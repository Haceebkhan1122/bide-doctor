import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppContainer from "./App";
import reportWebVitals from "./reportWebVitals";
import "./assets/scss/index.scss";
import "./assets/scss/styleupdate.css";
// import { store, persisStore } from "./redux/store";
import { store } from "./redux/store";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import "yet-another-react-lightbox/styles.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
