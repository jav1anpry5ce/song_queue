import "./App.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Login } from "./components";
import CreateUUID from "./functions/CreateUUID";

if (!localStorage.getItem("user_key")) {
  const user_key = CreateUUID();
  localStorage.setItem("user_key", user_key);
}

function App() {
  console.log(process.env);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
