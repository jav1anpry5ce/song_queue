import React, { useState } from "react";
import "./App.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Login } from "./components";
import CreateUUID from "./functions/CreateUUID";
import IsIngcognito from "./functions/IsIncognito";

if (!localStorage.getItem("user_key")) {
  const user_key = CreateUUID();
  localStorage.setItem("user_key", user_key);
}

function App() {
  const [isPrivate, setIsPrivate] = useState(false);

  IsIngcognito().then((data) => {
    if (data === true) {
      setIsPrivate(true);
    }
  });

  if (!isPrivate) {
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
  } else {
    return <h1 align="center">Use a non-private browser</h1>;
  }
}

export default App;
