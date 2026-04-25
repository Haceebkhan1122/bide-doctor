import React, { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../redux/hooks";
import { SelectAuth, selectAuthToken, selectIsLoading, selectIsLogin } from "./redux/slice";
import {
  setInLocalStorage,
} from "./../utils/helperFunctions";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import DoctorSignIn from "../pages/login/DoctorSignIn";
import Dashboard from "../pages/dashboard/Dashboard";
import DoctorSignInOtp from "../pages/login/DoctorSignInOtp";
import { useHistory } from "react-router-dom";
import Navabrr from "../uiComponents/Navbar/Navbarr";
import AppointmentFirstTime from "../pages/appointments/AppointmentFirstTime";
import { routes } from "../routing/routes";
import { getCurrentUserData } from "../utils/powerFuntions";

const Layout = () => {
  const dispatch = useAppDispatch();
  const selectLayout = useAppSelector(selectAuthToken);
  const selectLogin = useAppSelector(selectIsLogin);
  const isLoading = useAppSelector(selectIsLoading);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const location = useLocation();

  useEffect(() => {
    if (selectLayout?.data?.token) {
      const { token } = selectLayout.data;
      setInLocalStorage("D_APP_TOKEN", token);
    }
  }, [selectLayout]);

  useEffect(() => {
    const redirectUser = () => {
      const authToken = Cookies.get('token');

      if (authToken === undefined) {
        window.location.href = '/login';
        Cookies.remove('emailAddress')
        setIsLoggedIn(false)
      } else {
        setIsLoggedIn(true)
      }
    };

    // Call the function only if the user is not on the login page
    if (window.location.pathname !== '/login') {
      redirectUser();
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="_layout_wrapper">
        {isLoggedIn == true && (
          <>
            <Navabrr />
          </>
        )}
        <Fragment>
          <Router>
            <Switch>
              <Route path="/login" component={DoctorSignIn} />
              <Redirect to="/" from="/login" />
              <Route path="/verify-otp" component={DoctorSignInOtp} />
              
            </Switch>
          </Router>
        </Fragment>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              component={route.component}
            />
          ))}

        </Switch>
      </div>

    </>
  );
};

export default Layout;
