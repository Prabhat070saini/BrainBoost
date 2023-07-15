import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter bg-richblack-900">
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>

    </div>
  );
}

export default App;
