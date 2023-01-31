import React, { useContext, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import "semantic-ui-css/semantic.min.css";
import MenuBar from "./components/MenuBar";
import "./App.css";
import {  AuthProvider } from "./context/AuthContext";
import SinglePost from "./components/SinglePost";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path='/posts/:postId/' element={<SinglePost/>}/>
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
