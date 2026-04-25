import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, Badge, Row, Col } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import HeaderLogo from "../../uiComponents/logos/HeaderLogo";
import NotificationIcon from "../../assets/images/svg/notification.svg";
import Notification from "../../assets/images/svg/notification.svg";
import icon001 from "../../assets/images/svg/icon001.svg";


import Tooltip from "react-bootstrap/Tooltip";
import { URL } from "../../constants/index";
import "./_navbar.scss";
import { HeadingDescSmall } from "../Headings";
import Toast from "../notification/Toast";
import NotificationPop from "../notifications/NotificationPop";
import instance from "../../utils/customAxios";
import { toast } from "react-toastify";
import LoginDropdownBtn from "../../uiComponents/button/loginDropdownBtn/LoginDropdownBtn";


function Navabrr() {
  const [stickyClass, setStickyClass] = useState("relative");
  const [expanded, setExpanded] = useState(false);
  const [notificationPop, setNotificationPop] = useState(false);
  const [progress, setProgress] = useState();
  const [profileVerificationDoctor, setProfileVerificationDoctor] =
    useState(null);
  const location = useLocation();

  const myRef = useRef(null);
  const addClass = useRef(null);

  const stickNavbar = () => {
    if (window !== undefined) {
      const windowHeight = window.scrollY;
    }
  };


  useEffect(() => {
    var externalResource = document.getElementsByClassName(
      "videoask-embed__button_right--V-il1"
    );
    // console.log(externalResource.length, "len");
    for (var i = 0; i < externalResource.length; i++) {
      externalResource[i]?.remove();
    }
  }, []);

  const toggleHandler = (event) => {
    if (event === true) {
      addClass.current.classList.add("bg-white");
    } else {
      addClass.current.classList.remove("bg-white");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);
    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  const openNotificaiton = () => {
    setNotificationPop(true);
  };

  const tooltip = (
    <Tooltip id="tooltip" className="tooltip-menu">
      Can only be accessed after profile completion and verification
    </Tooltip>
  );

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {/* <Toast /> */}
      <section id="navbar">
        <Navbar
          expand="md"
          onToggle={(event) => toggleHandler(event)}
          className={`stickyNavbar ${stickyClass}`}
          ref={myRef}
          expanded={expanded}
        >
          <Container fluid ref={addClass}>
            <Col lg={1} md={1}>
              <Link to="/">
                <HeaderLogo />
              </Link>
            </Col>
            <Col lg={11} md={11} >
              {!location.pathname.includes('/appointment/') && (
                <>
                  <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    className="x navbar-toggle"
                    onClick={() => setExpanded(expanded ? false : "expanded")}
                  >
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </Navbar.Toggle>
                  <Navbar.Collapse id="basic-navbar-nav" className="ms-5">
                    <Nav className="m-auto align-items-center">
                      <NavLink
                        activeClassName="linkactive"
                        to={URL.dashboard}
                        onClick={() => setExpanded(false)}
                        exact
                      >
                        <img src={icon001} alt="Notification"></img>
                      </NavLink>
                      <NavLink
                        activeClassName="linkactive"
                        to={URL.dashboard}
                        onClick={() => setExpanded(false)}
                        exact
                      >
                        <HeadingDescSmall text="Dashboard" />
                      </NavLink>
                    </Nav>
                    <div className="loginUser d-flex align-items-center">
                      {/* <div className="position-relative me-1">
                        <img src={Notification} alt="Notification"></img>
                        <span className="notificationCount">
                          20
                        </span>
                      </div> */}
                      <LoginDropdownBtn
                        profileVerificationDoctor={profileVerificationDoctor}
                      />
                    </div>
                    {/* <SimpleButton text="login" /> */}
                  </Navbar.Collapse>
                </>
              )}

              {location.pathname.includes('/appointment/') && (
                <>
                  <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    className="x navbar-toggle"
                    onClick={() => setExpanded(expanded ? false : "expanded")}
                  >
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </Navbar.Toggle>
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="m-auto align-items-center">
                      <NavLink
                        activeClassName="linkactive"
                        to={URL.dashboard}
                        onClick={() => setExpanded(false)}
                        exact
                      >
                        <img src={icon001} alt="Notification"></img>
                      </NavLink>

                    </Nav>

                    {/* <SimpleButton text="login" /> */}
                  </Navbar.Collapse>
                </>
              )}

            </Col>
          </Container>
        </Navbar>
      </section>
    </>
  );
}

export default React.memo(Navabrr);
