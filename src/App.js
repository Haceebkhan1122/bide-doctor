import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layouts/layout";
import ReactGA from "react-ga";
import "./assets/css/stylenew.css";
import "./assets/css/stylenewupdated.css";

const AppContainer = () => {
  ReactGA.initialize("G-VXJ4GHSTJG");
  return (
    <>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </>
  );
};

export default AppContainer;
