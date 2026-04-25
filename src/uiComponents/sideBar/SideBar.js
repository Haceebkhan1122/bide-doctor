import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Menu, Modal, Typography } from "antd";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { URL } from "../../constants";
import { asynchronouslyRemoveFromLocal } from "../../utils/helperFunctions";
import { HeadingDesc, HeadingDescSmall, HeadingDescVsmall } from "../Headings";
import HeaderLogo from "../logos/HeaderLogo";
import profilePic from "../../assets/images/svg/profile_pic_icon.svg";
import mobileIcon from "../../assets/images/png/menu-mobile.png";
import dashboardIcon from "../../assets/images/svg/dashboard_icon.svg";
import appIcon from "../../assets/images/svg/appointments_icon.svg";
import clinicIcon from "../../assets/images/svg/clinics_icon.svg";
import earningIcon from "../../assets/images/svg/earnings_icon.svg";
import profileIcon from "../../assets/images/svg/profile_icon.svg";
import profileIcon1 from "../../assets/images/svg/profile_icon1.svg";
import closeIcon from "../../assets/images/svg/close.svg";

import profiledropdown from "../../assets/images/png/mobille-arrow-icon.png";
import passwordIcon from "../../assets/images/svg/password_icon.svg";
import logoutIcon from "../../assets/images/svg/logout_icon.svg";
import logoMobile from "../../assets/images/svg/logo-mobile.svg";
import { useRef } from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import NotificationIcon from "../../assets/images/svg/notification-icon-gray.svg";
import { Box, CircularProgress } from "@mui/material";
import API from "../../utils/customAxios";
import Cookies from "js-cookie";
import Loader from "../loader/Loader";
import { isMobile } from "react-device-detect";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const SideBar = () => {
  // const [collapsed, setCollapsed] = useState(true);
  const dispatch = useAppDispatch();
  // const profile_data = useAppSelector(selectUser);
  const [apiLoading, setApiLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [progress, setProgress] = useState("");

  // const logout = async () => {
  //   await asynchronouslyRemoveFromLocal("D_APP_TOKEN");
  //   await asynchronouslyRemoveFromLocal("D_USER_ID");
  //   await asynchronouslyRemoveFromLocal("nextauth.message");
  //   window.location.href = "/login";
  // };

  // sideBar logout

  const logout = async () => {
    try {
      setApiLoading(true);
      const data = {
        is_instant_consultation: 0,
      };

      const response = await API.post(
        `${process.env.REACT_APP_BASE_URL}/doctor/instant-online-offline`,
        data
      );

      if (response?.data?.code === 200) {
        setApiLoading(false);
        sessionStorage.removeItem("alreadyShow");
        Cookies.remove("token");
        Cookies.remove("pagestatus");
        Cookies.remove("pageStatus");
        // dispatch(SelectAuth(null));

        window.location.href = "/login";
      } else {
        setApiLoading(false);
      }
    } catch (error) {
      setApiLoading(false);
    }
  };

  // sideBar logout
  useEffect(() => {
    // dispatch(getProfile());
  }, []);

  // useEffect(() => {
  //   setUserInfo(profile_data?.data?.user);
  // }, [profile_data]);

  // const toggleCollapsed = () => {
  //     setCollapsed(!collapsed);
  // };

  const nameAbbreviation = (name) => {
    if (!name || typeof name !== 'string') {
      return '';
    }

    const words = name.trim().split(' ');
    const abbreviation = words
      .filter((word) => word !== '')
      .map((word, index) => {
        if (index === 0 || words.length === 1) {
          return word.charAt(0).toUpperCase();
        }
        return '';
      })
      .join('');

    return abbreviation;
  };

  const moverFunc = () => {
    setLogoutmodal(true);
    setVisible(false);
  };

  const profile_verification = progress?.profile_verification;


  const items = [
    getItem(
      <div className="flex_start sideProfile mobilemenu">
        <div id="loginDropdown">
          <div className="dropDownTitle">
            <HeadingDescSmall text={nameAbbreviation(userInfo?.name)} />
          </div>
        </div>{" "}
        <div className="column_flex box001">
          <HeadingDescSmall
            text={
              userInfo?.prefix + ". " + userInfo?.name ? userInfo?.name : "User"
            }
          />
        </div>
        <Button
          onClick={() => {
            setVisible(false);
          }}
          className="close_icon"
        >
          <img src={closeIcon} alt="close" />
        </Button>
      </div>
    ),
    // getItem(<NavLink activeClassName='linkactive' onClick={() => setVisible(false)} to={URL.dashboard} exact><div className='flex_start'><img src={dashboardIcon} alt="pfp" /><HeadingDescSmall text="Dashboard" /></div></NavLink>, '1'),
    // getItem(<NavLink activeClassName='linkactive' onClick={() => setVisible(false)} to={URL.appointments} exact><div className='flex_start'><img src={appIcon} alt="pfp" /><HeadingDescSmall text="Appointments" /></div></NavLink>, '2'),
    // getItem(<NavLink activeClassName='linkactive' onClick={() => setVisible(false)} to={{ pathname: URL.healthClinic, state: { type: 'physical' } }} exact><div className='flex_start'><img src={clinicIcon} alt="pfp" /><HeadingDescSmall text="Hospital/Clinics" /></div></NavLink>, '3'),
    // getItem(<NavLink activeClassName='linkactive' onClick={() => setVisible(false)} to={URL.earnings} exact><div className='flex_start'><img src={earningIcon} alt="pfp" /><HeadingDescSmall text="Earnings" /></div></NavLink>, '4'),
    getItem(
      <NavLink
        activeClassName="linkactive"
        onClick={() => setVisible(false)}
        to={`${profile_verification === 1 ? '/profile-update' : ''}`}
        exact
      >
        <div className="flex_start">
          <img src={profileIcon1} alt="pfp" />
          <HeadingDescSmall text="Profile" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
    // getItem(<NavLink activeClassName='linkactive' onClick={() => setVisible(false)} to={URL.password} exact><div className='flex_start'><img src={passwordIcon} alt="pfp" /><HeadingDescSmall text="Change Password" /></div></NavLink>, '6'),
    getItem(
      <NavLink activeClassName="linkactive" onClick={moverFunc} to="">
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="Log out" />
        </div>
      </NavLink>,
      "7"
    ),
    // getItem(<HeaderLogo />, '8'),
  ];
  const [logoutmodal, setLogoutmodal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get(`doctor/progress`);

        if (response?.data?.code === 200) {
          setProgress(response?.data?.data);
        }
      } catch (error) { }
    })();
  }, []);

  const percentage = progress?.profile_completion;


  return (
    <div className="sideBar">
      {apiLoading && (
        <>
          <Loader />
        </>
      )}
      <div
        // type="primary"
        // onClick={toggleCollapsed}
        onClick={() => {
          setVisible(true);
        }}
        className="open_sidebar"
      >
        <div className="user_side_menu">
          <h6>{nameAbbreviation(userInfo?.name)}</h6>
          <img src={mobileIcon} alt="pfp" className="sidebar_image1" />
        </div>
        {/* <img src={profilePic} alt="pfp" className='sidebar_image' /> */}
      </div>
      <Drawer
        title="Drawer Demo"
        placement="left"
        closable={false}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          theme="light"
          items={items}
          className="sidebar_menu"
        />
      </Drawer>

      <div className="flex_center">
        <img src={logoMobile} alt="notification" />
      </div>
      <div>
        <div className="complate_profile d-flex mob__">
          <div className="chart_style">
            <div className="single-chart">
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  // style={{color:'#19B3B5'}}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "100%",
                    boxShadow: "inset 0 0 0px 2px #19B3B5",
                    backgroundColor: "transparent",
                    color: "#19B3B5",
                  }}
                  size={80}
                  thickness={5}
                  value={percentage}
                  variant="determinate"
                />
                <Box
                  top={14}
                  left={10}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="block"
                  alignItems="center"
                  justifyContent="center"
                  className="progressBox"
                >
                  <Typography
                    style={{ fontSize: "8px", color: "#000000" }}
                    variant="caption"
                    component="div"
                    color="textSecondary"
                  >
                    {percentage}%
                  </Typography>
                </Box>
              </Box>
            </div>
          </div>
          <h6> Profile</h6>
        </div>
      </div>
      {/* <div className="orange-bg1">
                  <img src={NotificationIcon} alt="notification  "></img>
              </div> */}

      <Modal
        title=" "
        visible={logoutmodal}
        onOk={() => setLogoutmodal(false)}
        onCancel={() => setLogoutmodal(false)}
        className="modal_logout modal-centerd-screen"
      >
        <p>
          Are you sure you want
          <br />
          to log out?
        </p>
        <div className="button_logout">
          {" "}
          <Button
            onClick={logout}
            className="btn btn-transparent switchModalBtns me-2"
          >
            {" "}
            Yes
          </Button>{" "}
          <Button
            onClick={() => setLogoutmodal(false)}
            className="btn btn-primary switchModalBtns ms-2"
          >
            {" "}
            No
          </Button>
        </div>
      </Modal>
      <br />
      <br />
    </div>
  );
};

export default SideBar;
