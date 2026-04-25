import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Menu, Modal } from "antd";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { URL } from "../../constants";
import { asynchronouslyRemoveFromLocal } from "../../utils/helperFunctions";
import { HeadingDesc, HeadingDescSmall, HeadingDescVsmall } from "../Headings";
import HeaderLogo from "../logos/HeaderLogo";
import profilePic from "../../assets/images/svg/profile_pic_icon.svg";
import mobileIcon from "../../assets/images/png/menu-mobile.png";
import mobileMenu from "../../assets/images/png/mobilemenu.png";
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

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const SideBarSignUp = () => {
  // const [collapsed, setCollapsed] = useState(true);
  const dispatch = useAppDispatch();
  const profile_data = useAppSelector(selectUser);

  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState();

  const logout = async () => {
    await asynchronouslyRemoveFromLocal("D_APP_TOKEN");
    await asynchronouslyRemoveFromLocal("D_USER_ID");
    await asynchronouslyRemoveFromLocal("nextauth.message");
    window.location.href = "/login";
    //  setRedirect(true);
  };

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    setUserInfo(profile_data?.data?.user);
  }, [profile_data]);
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = section.offsetTop - 200;
      section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest', offsetTop: -1200, });
      setVisible(false);
    }
  };
  // const toggleCollapsed = () => {
  //     setCollapsed(!collapsed);
  // };
  const items = [
    getItem(
      <div className="flex_start sideProfile mobilemenu">
        {" "}
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
    getItem(
      <NavLink
        activeClassName="linkactive"
        to="#benefits"
        onClick={() => scrollToSection("benefits")}
      >
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="Benefits" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
    getItem(
      <NavLink
        activeClassName="linkactive"
        to="#registration"
        onClick={() => scrollToSection("registration")}
      >
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="Registration" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
    getItem(
      <NavLink
        activeClassName="linkactive"
        to="#whychooseus"
        onClick={() => scrollToSection("whychooseus")}
      >
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="Why Choose Us" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
    getItem(
      <NavLink
        activeClassName="linkactive"
        to="#featured"
        onClick={() => scrollToSection("featured")}
      >
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="Get Featured" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
    getItem(
      <NavLink
        activeClassName="linkactive"
        to="#testimonials"
        onClick={() => scrollToSection("testimonials")}
      >
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="Testimonials" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
    getItem(
      <NavLink
        activeClassName="linkactive"
        to="#faq"
        onClick={() => scrollToSection("faq")}
      >
        <div className="flex_start">
          {" "}
          <HeadingDescSmall text="FAQs" />{" "}
          <img src={profiledropdown} alt="icon" className="icon_dropdown01" />
        </div>
      </NavLink>,
      "5"
    ),
  ];

  const [logoutmodal, setLogoutmodal] = useState(false);

  return (
    <div className="sideBar position-fixed">
      <div
        // type="primary"
        // onClick={toggleCollapsed}
        onClick={() => {
          setVisible(true);
        }}
        className="open_sidebar sidebarsignup"
      >
        <div className="user_side_menu">
          <img src={mobileMenu} alt="pfp" className="sidebar_image11" />
        </div>
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
      <div></div>
      {/* <div className="orange-bg1">
                <img src={NotificationIcon} alt="notification  "></img>
            </div> */}

      <br />
      <br />
    </div>
  );
};

export default SideBarSignUp;

// import { Button, Drawer, Radio, Space } from 'antd';
// import React, { useState } from 'react';

// const SideBar = () => {
//     const [visible, setVisible] = useState(false);

//     return (
//         <>
//             <>
//                 <Button type="primary"
//                     onClick={() => {
//                         setVisible(true);
//                     }}>Open</Button>
//                 <Drawer
//                     title="Drawer Demo"
//                     placement="left"
//                     closable={false}
//                     visible={visible}
//                     onClose={() => {
//                         setVisible(false)
//                     }}
//                 >
//                     <p>Item One</p>
//                     <p>Item Two</p>
//                     <p>Item Three</p>
//                     <p>Item Four</p>
//                     <p>Item Five</p>
//                 </Drawer>
//             </>
//         </>
//     );
// };

// export default SideBar;
