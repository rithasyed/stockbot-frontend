"use client";
import NotificationContainer from "@/components/ripster-notification";
import { useTrades } from "@/store/tradeStore";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { execute: fetchTradeslist } = useTrades();
  const handleNewTrade = async () => {
    try {
      fetchTradeslist();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <main className="h-full overflow-auto bg-white">
      <div className="mx-auto  h-full w-full">{children}</div>
      <NotificationContainer onNewTrade={handleNewTrade} />
    </main>
  );
};

export default MainLayout;
