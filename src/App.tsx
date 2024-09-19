import Header from "@/components/ui/header";
import SideNav from "@/components/ui/sidenav";
import { useConnectIDB } from "@/libs/hooks/idb";
import Dashboard from "./components/ui/dashboard";
import { useBoardSync, useColumnSync } from "./libs/hooks/kanban";
import { useColorModeSync } from "./libs/hooks/app";

function App() {
  useColorModeSync();
  useConnectIDB();
  useBoardSync();
  useColumnSync();

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex h-full flex-shrink">
        <SideNav />
        <Dashboard />
      </div>
    </main>
  );
}

export default App;
