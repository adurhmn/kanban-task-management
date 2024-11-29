import Header from "@/components/ui/header";
import SideNav from "@/components/ui/sidenav";
import { useConnectIDB } from "@/libs/hooks/idb";
import Dashboard from "./components/ui/dashboard";
import { useBoardSync, useColumnSync } from "./libs/hooks/kanban";
import { useColorModeSync, useMediaQuery } from "./libs/hooks/app";

function App() {
  useColorModeSync();
  useConnectIDB();
  useBoardSync();
  useColumnSync();
  const { isMobile } = useMediaQuery();

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col overscroll-none">
      <Header />
      <div className="flex h-full flex-shrink">
        {!isMobile && <SideNav />}
        <Dashboard />
      </div>
    </main>
  );
}

export default App;
