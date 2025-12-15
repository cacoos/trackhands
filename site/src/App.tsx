import { Route, Switch } from "wouter";
import { HomePage, PrivacyPolicyPage } from "./pages";

function App() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#2d2d2d_0%,#1a1a1a_50%)] pointer-events-none" />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
      </Switch>
    </div>
  );
}

export default App;
