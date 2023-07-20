import "./App.css";
import { Routes, Route } from "react-router-dom";

import { ACCOUNT_TYPE } from "./utils/constansts";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import VerifyEmail from "./pages/VerifyEmail";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import Settings from "./components/core/Dashboard/Settings";
function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter bg-richblack-900">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <OpenRoute>
              <Contact />
            </OpenRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
        </Route>


        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>

    </div>
  );
}


export default App;
