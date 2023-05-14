
import { Routes, Route } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App.js";
import Home from "./Home.js";


const history = createBrowserHistory();

function AppRouter() {

  return (
    <Router history={history}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<App />} />
        </Routes>
    </Router>
  );
}

export default AppRouter;
