/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, Badge, Row, Col } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import HeaderLogo from "../../uiComponents/logos/HeaderLogo";
import { LoginDropdownBtn, SimpleButton } from "../../uiComponents/button";
import NotificationIcon from "../../assets/images/svg/notification-icon-gray.svg";

import { URL } from "../../constants/index";
import "./_navbar.scss";
import { HeadingDescSmall } from "../Headings";
import Toast from "../notification/Toast";
import NotificationPop from "../notifications/NotificationPop";

function NavbarSignup() {
    const [stickyClass, setStickyClass] = useState("relative");
    const [expanded, setExpanded] = useState(false);
    const [notificationPop, setNotificationPop] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    const [visible, setVisible] = useState(false);
    const myRef = useRef(null);
    const addClass = useRef(null);

    const stickNavbar = () => {
        if (window !== undefined) {
            const windowHeight = window.scrollY;
            // windowHeight > 50 ? setStickyClass("active2") : setStickyClass("wait");
        }
    };

    // const navigate = useNavigate();

    // const handleLoginNavigation = () => {
    //   navigate('/login', { replace: true });
    // };

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


    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = section.offsetTop - 100; // Subtract 100px from the section's top position
            window.scrollTo({ top: offset, behavior: 'smooth' });
            setActiveSection(sectionId);
            setVisible(false);
        }
    };
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section'); // Assuming your sections have the 'section' tag
            let currentSection = null;

            sections.forEach((section) => {
                const { top, bottom } = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Check if the section is at least 50% visible
                if (top < windowHeight / 4 && bottom > windowHeight / 4) {
                    currentSection = section.id;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="position-fixed sign-upnew">
                {/* <Toast /> */}
                <section id="navbar" className="">
                    <Navbar
                        expand="md"
                        onToggle={(event) => toggleHandler(event)}
                        className={`stickyNavbar ${stickyClass}`}
                        ref={myRef}
                        expanded={expanded}
                    >
                        <Container fluid ref={addClass}>
                            <Row>
                                <Col lg={1} md={1}>
                                    <Link to="/">
                                        <HeaderLogo />
                                    </Link>
                                </Col>
                                <Col lg={11} md={11} className="ms-3">
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
                                        <Nav className="m-auto">

                                            <NavLink to="#benefits"
                                                onClick={() => scrollToSection('benefits')}
                                                className={activeSection === 'benefits' ? 'activeclass' : ''}>
                                                <HeadingDescSmall text="Benefits" />
                                            </NavLink>
                                            <NavLink to="#registration"
                                                onClick={() => scrollToSection('registration')} className={activeSection === "registration" ? "activeclass" : ""}
                                            >
                                                <HeadingDescSmall text="Registration" />
                                            </NavLink>
                                            <NavLink
                                                to="#whychooseus" onClick={() => scrollToSection('whychooseus')} className={activeSection === "whychooseus" ? "activeclass" : ""}
                                            >
                                                <HeadingDescSmall text="Why Choose Us" />
                                            </NavLink>
                                            <NavLink
                                                to="#featured" onClick={() => scrollToSection('featured')} className={activeSection === "featured" ? "activeclass" : ""}
                                            >
                                                <HeadingDescSmall text="Get Featured" />
                                            </NavLink>
                                            <NavLink
                                                to="#testimonials" onClick={() => scrollToSection('testimonials')} className={activeSection === "testimonials" ? "activeclass" : ""}
                                            >
                                                <HeadingDescSmall text="Testimonials  " />
                                            </NavLink>

                                            <NavLink
                                                to="#faq" onClick={() => scrollToSection('faq')} className={activeSection === "faq" ? "activeclass" : ""}
                                            >
                                                <HeadingDescSmall text="FAQs  " />
                                            </NavLink>

                                        </Nav>



                                        {/* <SimpleButton text="login" /> */}
                                    </Navbar.Collapse>
                                </Col>
                            </Row>
                        </Container>
                    </Navbar>
                </section>
            </div>
        </>
    );
}

export default React.memo(NavbarSignup);
