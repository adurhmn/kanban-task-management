import Header from "@/components/ui/header";
import SideNav from "@/components/ui/sidenav";
import { useConnectIDB } from "@/libs/hooks/idb";

function App() {
  useConnectIDB();

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex h-full flex-shrink">
        <SideNav />
      </div>
    </main>
  );
}

export default App;
