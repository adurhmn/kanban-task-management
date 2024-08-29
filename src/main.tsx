import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import DragDropContext from "./components/ui/providers/drag-drop-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DragDropContext>
      <App />
    </DragDropContext>
  </StrictMode>
);
