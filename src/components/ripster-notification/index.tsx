"use client";
import React, { useEffect, useState, useCallback } from "react";
import SnackbarContainer from "../snackBar"; // Adjust based on your folder structure

export interface StockTrade {
  signal: "RipsterUp" | "RipsterDown";
  stockName: string;
  price: string;
  time: string;
}

interface NotificationContainerProps {
  onNewTrade: () => void; // Declare the callback prop
}
const NotificationContainer: React.FC<NotificationContainerProps> = ({
  onNewTrade,
}) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const addMessage = useCallback((newMessage: string) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const removeMessage = useCallback((index: number) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    console.log("messages", messages);
  }, []);

  const handleTrade = useCallback(
    (data: StockTrade) => {
      onNewTrade();
    },
    [messages, onNewTrade]
  );
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5001/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      try {
        // const receivedData = JSON.parse(event.data);
        const receivedData = event.data;
        console.log("Received data:", receivedData);

        if (Array.isArray(receivedData)) {
          console.log("array");
          receivedData.forEach(addMessage);
        } else if (typeof receivedData === "string") {
          try {
            console.log("string");
            const notificationData = JSON.parse(receivedData);
            // console.log("notification",notificationData)
            addMessage(
              `${notificationData[0]} detected for ${notificationData[1]} at ${notificationData[2]}`
            );
            console.log("notificationData", notificationData);
            handleTrade(notificationData);
          } catch (e) {
            console.log(e);
            addMessage(receivedData);
          }
        } else {
          console.error("Unexpected data format:", receivedData);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
        // If parsing fails, try to add the raw message
        addMessage(event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [addMessage]);

  return (
    <div>
      <SnackbarContainer messages={messages} removeMessage={removeMessage} />
    </div>
  );
};

export default NotificationContainer;
