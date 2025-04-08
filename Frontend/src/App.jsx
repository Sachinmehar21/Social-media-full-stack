import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Editprofile";
import Upload from "./pages/Upload";
import Homepage from "./pages/Homepage";
import Search from "./pages/Search"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/:username/edit" element={<EditProfile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/feed" element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
