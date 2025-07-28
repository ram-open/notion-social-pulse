import { useState } from "react";
import { ConnectAccountsForm } from "@/components/ConnectAccountsForm";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  if (isConnected) {
    return <Dashboard />;
  }

  return <ConnectAccountsForm onConnect={handleConnect} />;
};

export default Index;
