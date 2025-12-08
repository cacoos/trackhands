import { PopoverWindow } from "@/components/popover-window/popover-window";
import { WarningWindow } from "@/components/warning-window/warning-window";

function App() {
  const isWarningRoute = window.location.pathname === "/warning";

  if (isWarningRoute) {
    return <WarningWindow />;
  }

  return <PopoverWindow />;
}

export default App;
