import React, { useState, useEffect, useCallback, useRef } from "react";

interface SnackbarProps {
  message: string;
  duration?: number;
  onRemove: () => void;
}

interface SnackbarContainerProps {
  messages: string[];
  removeMessage: (index: number) => void;
  soundUrl?: string; // New prop for custom sound URL
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  duration = 30000,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [duration, onRemove]);

  return (
    <div className="bg-green-500 text-white p-4 rounded-md shadow-md mb-4">
      <div className=" flex flex-row">
        <div className="font-bold">{message}</div>
        <button
          onClick={onRemove}
          className="ml-5 text-sm text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const SnackbarContainer: React.FC<SnackbarContainerProps> = ({
  messages,
  removeMessage,
  soundUrl = "/ding.mp3",
}) => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(soundUrl);
  }, [soundUrl]);
  useEffect(() => {
    if (messages.length > visibleMessages.length) {
      setVisibleMessages((prev) => [...prev, ...messages.slice(prev.length)]);
      // Play sound when new message is added
      audioRef.current?.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [messages, visibleMessages]);

  const handleRemove = useCallback(
    (index: number) => {
      setVisibleMessages((prev) => prev.filter((_, i) => i !== index));
      console.log(visibleMessages);
      removeMessage(index);
    },
    [removeMessage]
  );

  return (
    <div className="fixed top-24 right-5 space-y-2 z-50">
      {visibleMessages.map((msg, idx) => (
        <Snackbar
          key={`${msg}-${idx}`}
          message={msg}
          onRemove={() => handleRemove(idx)}
        />
      ))}
    </div>
  );
};

export default SnackbarContainer;
