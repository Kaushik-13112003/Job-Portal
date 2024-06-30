import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./component/HomePage";
import Login from "./component/Login";
import Register from "./component/Register";
import UpdateUser from "./component/UpdateUser";
import "./App.css";
import Private from "./private/PrivateAuth";
import PrivateAuth from "./private/PrivateAuth";
import UpdateJob from "./component/UpdateJob";
import AllJobs from "./component/AllJobs";
import SearchResult from "./component/SearchResult";
import SingleJob from "./component/SingleJob";
import Profile from "./component/Profile";
import Footer from "./component/Footer";
import Navbar from "./component/LayoutFile";
import ScrollToTop from "react-scroll-to-top";
import { Layout } from "antd";
import LayoutFile from "./component/LayoutFile";
import CreateJob from "./component/CreateJob";
import MyJobs from "./component/MyJobs";
import SavedJobs from "./component/SavedJobs";
import ManageJob from "./component/ManageJobs";
import Applications from "./component/Applications";
import ApplyNow from "./component/ApplyNow";
import SingleApplication from "./component/SingleApplication";
import ForgotPassword from "./component/ForgotPassword";
import { Toaster } from "react-hot-toast";

const App = () => {
  const location = useLocation("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <Toaster />

      <ScrollToTop
        smooth
        color="blue"
        style={{
          borderRadius: "100px",
          backgroundColor: " orange",
        }}
      />
      <ToastContainer position="bottom-center" />
      {/* <LayoutFile /> */}
      <Routes>
        <Route path="/" element={<PrivateAuth />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/jobs" element={<AllJobs />}></Route>
          <Route path="/create-job" element={<CreateJob />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/single-job/:id" element={<SingleJob />}></Route>
          <Route path="/my-jobs" element={<MyJobs />}></Route>
          <Route path="/manage-job" element={<ManageJob />}></Route>
          <Route path="/applications" element={<Applications />}></Route>
          <Route path="/saved-jobs" element={<SavedJobs />}></Route>
          <Route path="/apply-for-job/:id" element={<ApplyNow />}></Route>
          <Route
            path="/single-application/:id"
            element={<SingleApplication />}
          ></Route>
          <Route path="/search-result" element={<SearchResult />}></Route>

          <Route path="/update-user/:id" element={<UpdateUser />}></Route>
          <Route path="/update-job/:id" element={<UpdateJob />}></Route>
        </Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
     
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      </Routes>
    </>
  );
};

export default App;
