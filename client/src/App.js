import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
import FibPage from "./pages/FibPage";
import OtherPage from "./pages/OtherPage";

function App() {
  return (
    <Router>
      <div>
        <h1>Fib Calculator</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/other">Other page</Link>
            </li>
          </ul>
        </nav>

        <Route exact path="/" component={FibPage} />
        <Route exact path="/other" component={OtherPage} />
      </div>
    </Router>
  );
}

export default App;
