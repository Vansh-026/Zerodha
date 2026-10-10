import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Chatbot from "./Chatbot";

const Home = () => {
  return (
    <>
      <TopBar />
      <Dashboard />
      <Chatbot />
    </>
  );
};

export default Home;