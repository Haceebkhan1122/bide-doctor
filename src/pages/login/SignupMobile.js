import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import appStore from "../../assets/images/png/apple123.png";
import playStore from "../../assets/images/png/macc.png";
import QrCode from "../../assets/images/svg/downloadMS.svg";
import jazz from "../../assets/images/svg/jazz.svg";
import zong from "../../assets/images/png/zong_logo.png";
import ufone from "../../assets/images/png/ufone-new.png";
import telenor from "../../assets/images/png/telenor-new.png";
import bannerImg from "../../assets/images/png/sign-up-banner.png";
import secTwoImgg from "../../assets/images/png/sec-2.png";
import secTwoFour from "../../assets/images/png/why-us.png";
import iconOne from "../../assets/images/png/register.png";
import iconTwo from "../../assets/images/png/complete-profile.png";
import iconThree from "../../assets/images/png/profile-verification.png";
import iconFour from "../../assets/images/png/start-earning.png";
import chooseIconOne from "../../assets/images/png/grow.png";
import chooseIconTwo from "../../assets/images/png/earn.png";
import chooseIconThree from "../../assets/images/png/track.png";
import chooseIconFour from "../../assets/images/png/strength.png";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Divider, Modal, Button, Select } from "antd";
import circle1 from "../../assets/images/svg/circle1.svg";
import circle2 from "../../assets/images/svg/revisedCircle.svg";
import circle3 from "../../assets/images/svg/circle3.svg";
// import Logo from "../../assets/images/svg/meri-sehat-logo.svg";
import Logo from "../../assets/images/png/meri-sehat-logo.png";
import "./SignupMobile.css";
import { useHistory, useLocation } from "react-router-dom";
import encryptStorage from "../../utils/encryptStorage";
import API from "../../utils/customAxios";
import loadingGif from "../../assets/images/gif/loader_gif.gif";
import Loader from "../../uiComponents/loader/Loader";
import { BsX } from "react-icons/bs";
import Slider from "react-slick";
import phoneimg from "../../assets/images/png/phoneimg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/fontawesome-free-solid";
import { isMobile } from "react-device-detect";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { maskPhone } from "../../utils/helperFunctions";
import { unmaskPhone } from "../../utils/helperFunctions";
import {
  faFacebookF,
  faYoutube,
  faLinkedin,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import drImage from "../../assets/images/png/dr_image.png";
import { Accordion } from "react-bootstrap";
import i18n from "../../i18n";
import visa from "../../assets/images/png/visa-logo-png.png";
import master from "../../assets/images/png/mastercard-logo.png";
import StickyTab from "../../uiComponents/stickyTab/StickyTab";
import arrowShape from "../../assets/images/svg/ShapeArrow.svg";
import NavbarSignup from "../../uiComponents/Navbar/NavbarSignup";
import SidebarSignup from "../../uiComponents/sideBar/SideBarSignUp";
import Footer from "../../uiComponents/Footer/Footer";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import $ from "jquery";
import VideoWidget from "../../uiComponents/videoWidget/videoWidget";

const { Option } = Select;

const SignupMobile = () => {
  // const dispatch = useDispatch();

  const [continuePhoneNumber, setContinuePhoneNumber] = useState("");
  const [continueNetwork, setContinueNetwork] = useState("");
  const [continuePhoneError, setContinuePhoneError] = useState("");
  const [continueNetworkError, setContinueNetworkError] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [hideError, setHideError] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileform, setMobileForm] = useState(false);
  const [confirmFormSubmit, setConfirmFormSubmit] = useState(false);
  const [faqQuestions, setFaqQuestions] = useState();

  const handleRegister = () => {
    setConfirmFormSubmit(true);
  };
  const hideOtpError = () => {
    setHideError(true);
  };

  let footerBaseUrl = process.env.REACT_APP_FOOTER_BASE_URL;

  const history = useHistory();

  const signupOtp = () => {
    history.push("/signup-otp");
  };
  const menuList = [
    {
      link: "#overview",
      name: "Overview",
    },
    {
      link: "#badge",
      name: "Badge",
    },
    {
      link: "#reviews",
      name: "Your Reviews",
    },
  ];

  // useEffect(() => {
  //   window.VIDEOASK_EMBED_CONFIG = {
  //     kind: "widget",
  //     url: "https://ask.merisehat.pk/farw9k0xp",
  //     options: {
  //       widgetType: "VideoThumbnailExtraLarge",
  //       text: "",
  //       backgroundColor: "#5CD6C8",
  //       position: "bottom-right",
  //       dismissible: false,
  //     },
  //   };
  //   const script = document.createElement("script");
  //   script.src = "https://www.videoask.com/embed/embed.js";
  //   script.async = true;
  //   script.id = "videoask";
  //   script.onload = () => this.scriptLoaded();

  //   document.body.appendChild(script);
  // }, []);
  const secondCharacter = continuePhoneNumber?.charAt(1);

  const navigateToOtp = async (e) => {
    e.preventDefault();

    setContinuePhoneError("");
    setContinueNetworkError("");

    if (continuePhoneNumber?.trim() === "") {
      setApiError(null);
      setContinuePhoneError("Please enter your mobile number");
    } else if (
      continuePhoneNumber?.trim()?.length < 10 ||
      continuePhoneNumber?.trim()?.length > 10
    ) {
      setApiError(null);
      setContinuePhoneError("Invalid mobile number");
    }
    else if (!/[0-4]/.test(secondCharacter)) {
      setApiError(null)
      setContinueNetworkError("Invalid mobile number");
    }
    // else if (continuePhoneNumber.length >= 2) {
    //   const secondCharacter = continuePhoneNumber.charAt(1);
    //   if (!/[0-4]/.test(secondCharacter)) {
    //     setContinueNetworkError("Invalid mobile number");
    //   }
    // }
    else {
      if (encryptStorage.getItem("signupPhone")) {
        encryptStorage.removeItem("signupPhone");
      }

      if (encryptStorage.getItem("signupNetwork")) {
        encryptStorage.removeItem("signupNetwork");
      }

      // localStorage.setItem("phone", continuePhoneNumber)
      encryptStorage.setItem("signupPhone", continuePhoneNumber);
      encryptStorage.setItem("signupNetwork", continueNetwork);

      const data = {
        phone: `0${continuePhoneNumber}`,
        network: continueNetwork,
      };

      localStorage.setItem("number", continuePhoneNumber);

      try {
        setApiLoading(true);
        const response = await API.post("/doctor/registration-short", data);

        if (response?.data?.code === 200) {
          setApiLoading(false);
          history.replace("/signup-otp");
        } else {
          setApiLoading(false);
          setApiError(response?.data?.message);
        }
      } catch (error) {
        setApiError(error?.response?.data?.message || error?.message);
        setApiLoading(false);
      }
    }
  };

  useEffect(() => {
    const persistNumber = localStorage.getItem("number");
    setContinuePhoneNumber(persistNumber);
    if (persistNumber?.startsWith("32") || persistNumber?.startsWith("30")) {
      setContinueNetwork("jazz");
    } else if (persistNumber?.startsWith("33")) {
      setContinueNetwork("ufone");
    } else if (persistNumber?.startsWith("34")) {
      setContinueNetwork("telenor");
    } else if (persistNumber?.startsWith("31")) {
      setContinueNetwork("zong");
    } else {
      setContinueNetwork("");
    }
  }, []);

  function generateArrayWithoutNumber() {
    let res = [];
    for (let i = 0; i <= 255; i++) {
      if (i >= 48 && i <= 57) {
      } else {
        res.push(String.fromCharCode(i));
      }
    }
    return res;
  }

  const arrayWithoutNumber = useMemo(() => generateArrayWithoutNumber(), []);

  function ContinuePhoneChange(e) {
    const limit = 10;
    setContinuePhoneNumber(e.target.value.slice(0, limit));

    if (e.target.value?.startsWith("32") || e.target.value?.startsWith("30")) {
      setContinueNetwork("jazz");
    } else if (e.target.value?.startsWith("33")) {
      setContinueNetwork("ufone");
    } else if (e.target.value?.startsWith("34")) {
      setContinueNetwork("telenor");
    } else if (e.target.value?.startsWith("31")) {
      setContinueNetwork("zong");
    } else {
      setContinueNetwork("");
    }
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  useEffect(() => {
    let responseData = [];
    (async () => {
      const response = await API.get(`/faqs?category_id=10`);
      if (response?.data?.code === 200) {
        responseData.push(response?.data?.data);
      }
      setFaqQuestions(responseData);
    })();
  }, []);

  useEffect(() => {
    // Disable Mouse scrolling
    $("input[type=number]").on("mousewheel", function (e) {
      $(this).blur();
    });

    // Disable keyboard scrolling
    $("input[type=number]").on("keydown", function (e) {
      var key = e.charCode || e.keyCode;
      // Disable Up and Down Arrows on Keyboard
      if (key === 38 || key === 40) {
        e.preventDefault();
      } else {
        return;
      }
    });
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = section.offsetTop - 100; // Subtract 100px from the section's top position
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };
  return (
    <>
      {mobile && <StickyTab menuList={menuList} type="a" />}
      <StyledContinueNumber className="vh-100 position-relative">
        <div className="header_meriSehat d-sm-block d-none">
          <Container fluid>
            {apiLoading && <Loader />}
            <Row>
              <Col md={12}>
                <div className="logo_only">
                  {/* <Link to="/"> */}
                  <img src={Logo} alt="Logo" />
                  {/* </Link> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <NavbarSignup />

        {!isMobile ? (
          <>
            {" "}
            <NavbarSignup />
          </>
        ) : (
          <>
            <SidebarSignup />
          </>
        )}
        <Container className="">
          {/* <div className='LogoStyled'>
        <Col md={3}>
         <img src={LoginLogo} alt="logo"  className='img-fluid'/>
         </Col>
            </div> */}

          <Row className="pt-5 mt-5 singup-mobile-col" id="banner-form">
            {/* <Col md={6}>
              <div>
                <div className='continue-heading'>
                  <h4>
                    Join Pakistan’s largest
                    healthcare platform today
                  </h4>
                  <Divider style={{ backgroundColor: '#959494', height: '1px', width: '100%', minWidth: '40%', margin: '15px 0 25px' }} type='horizontal' />
                  <p>
                    Our Artificial intelligence technology helps you connect with patients across the nation.
                  </p>
                </div>
                <div className='description-circle-group'>
                  <div className='d-flex'>
                    <img className='img-fluid' src={circle1} alt='1' />
                    <p className='ms-4' >Join a community of PMC certified doctors</p>
                  </div>
                  <div className='d-flex mt-3'>
                    <img className='img-fluid' src={circle2} alt='2' />
                    <p className='ms-4' >Zero commissions on all appointment bookings*</p>
                  </div>
                  <div className='d-flex mt-3 '>
                    <img className='img-fluid' src={circle3} alt='2' />
                    <p className='ms-4' >Access to enterprise-level medical software to help your practice grow</p>
                  </div>
                </div>
                <Col md={8} className='m-auto'>
                  <div className="mb-5 mt-5">
                    <div className="boxLineCut">
                      <h1 className='_bg-white'>Download the Meri Sehat app </h1>

                      <div className="mt-3 px-3">
                        <Row>
                 
                          <Col md={6} className='signupImagess col-6'>
                            <img
                              src={appStore}
                              alt="logo"
                              className="img-fluid btn-apple12 "
                            />
                          </Col>
                          <Col md={6} className='signupImagess col-6'>
                            <img
                              src={playStore}
                              alt="logo"
                              className="img-fluid btn-apple12 "
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Col>
            <Col md={1}>
            </Col> */}
            <Col md={6}>
              <h2 className="doctorHead">Are you a Doctor?</h2>
              <p className="doctorSubHead w-70">
                Expand your practice & reach more patients across Pakistan.
              </p>
              {isMobile ? (
                <>
                  <div className="text-center d-none">
                    <Button className="btn  btnsignup" onClick={handleRegister}>
                      SIGN UP
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}

              <img
                src={bannerImg}
                alt="banner img"
                className="img-fluid fixedBottomBannerImg d-sm-block d-none"
              />
            </Col>
            <Col md={5}>
              <div className="continue-number-box" id="signup-number-box">
                <div className="p-4">
                  <div className="d-flex mb-3 justify-content-center ">
                    <h3 className=" enter-mobile dd">
                      Verify your phone number to proceed
                    </h3>
                  </div>
                  <div className="form_controll form-drop form-Econtrol">
                    <div className="mt-2">
                      <form
                        noValidate
                        onSubmit={navigateToOtp}
                        // validated={validated}
                        // onSubmit={handleSubmit}
                        className=""
                      >
                        <div
                          // borderedRed
                          style={{ display: "flex" }}
                          className={
                            continuePhoneError ||
                              continueNetworkError ||
                              apiError
                              ? "borderedRed hk_number ek_number"
                              : "hk_number ek_number"
                          }
                        >
                          <div className="country_code_hk country_code_ek">
                            <Select
                              defaultValue="+92"
                              className="select-code border-selection select-code-ek"
                              suffixIcon={<img src={arrowShape} />}
                            //   onChange={phoneChange}
                            >
                              <Option value="+92">+92</Option>
                            </Select>
                          </div>

                          <input
                            className={
                              continuePhoneError ||
                                continueNetworkError ||
                                apiError
                                ? "input-number numberRed input-number-ek"
                                : "input-number input-number-ek"
                            }
                            placeholder="Mobile number"
                            type="number"
                            pattern="[0-9]+"
                            maxlength="10"
                            name="number"
                            value={continuePhoneNumber}
                            onChange={ContinuePhoneChange}
                            style={{ width: "100%" }}
                            onKeyDown={(evt) =>
                              arrayWithoutNumber.includes(evt.key) &&
                              evt.preventDefault()
                            }
                          />
                          <Select
                            value={continueNetwork}
                            className="select-country hk_network ek_network"
                            onChange={(value) => setContinueNetwork(value)}
                            style={{
                              width: 120,
                              border: "none",
                            }}
                            suffixIcon={<img src={arrowShape} />}
                          >
                            <Option
                              className="network-height ufone"
                              value="ufone"
                            >
                              {" "}
                              <img src={ufone} /> <span></span>
                            </Option>
                            <Option
                              className="network-height jazz"
                              value="jazz"
                            >
                              {" "}
                              <img src={jazz} /> <span></span>
                            </Option>
                            <Option
                              className="network-height telenor"
                              value="telenor"
                            >
                              {" "}
                              <img src={telenor} /> <span></span>
                            </Option>
                            <Option
                              className="network-height zong"
                              value="zong"
                            >
                              {" "}
                              <img src={zong} /> <span></span>
                            </Option>
                          </Select>
                        </div>

                        {continuePhoneError && !hideError && (
                          <div
                            style={{ position: "absolute" }}
                            className="doctor-error-msg"
                          >
                            <p> {continuePhoneError} </p>
                            {/* <BsX onClick={hideOtpError} className="bsX" /> */}
                          </div>
                        )}

                        {continueNetworkError && !hideError && (
                          <div
                            style={{ position: "absolute" }}
                            className="doctor-error-msg"
                          >
                            <p> {continueNetworkError} </p>
                            {/* <BsX onClick={hideOtpError} className="bsX" /> */}
                          </div>
                        )}

                        {apiError && !hideError && (
                          <div
                            style={{ position: "absolute" }}
                            className="doctor-error-msg"
                          >
                            <p> {apiError} </p>
                            {/* <BsX onClick={hideOtpError} className="bsX" /> */}
                          </div>
                        )}

                        {/* {error && (
                      <p className='instant-error-msg'> {error} </p>
                    )} */}

                        <div className="btn-cont">
                          <button
                            type="submit"
                            disabled={apiLoading}
                            className="review-button mt-4 continue-phone-btn position-relative"
                          >
                            Continue
                            <span
                              className="continue-phone-chevron instant-code-chev d-none d-lg-flex"
                              style={{ height: "53px" }}
                            >
                              <FiChevronRight />
                            </span>
                          </button>
                          <p
                            style={{ textAlign: "center" }}
                            className="mt-4 ff-circular fw-300 textLineFormm col-md-9 m-auto"
                          >
                            By creating an account, you agree with our{" "}
                            <a
                              target="_blank"
                              href={`${footerBaseUrl}/page/terms-conditions`}
                              className="pinkTextCol"
                            >
                              Terms & Conditions
                            </a>{" "}
                            <br className="d-none d-lg-block" />
                            and{" "}
                            <a
                              target="_blank"
                              href={`${footerBaseUrl}/page/privacy-policy`}
                              className="pinkTextCol"
                            >
                              Privacy Statement
                            </a>
                          </p>

                          <p
                            style={{ textAlign: "center" }}
                            className="mt-3 d-flex justify-content-center ff-circular fw-300 alreadyTextFormm"
                          >
                            Already have an account? {" "}
                            <Link
                              className="blueTextCol"
                              to="/login"

                            >
                              <p
                                style={{
                                  color: "#19B3B5",
                                  fontWeight: "500",
                                  margin: '0 3px'
                                  // wordSpacing: "-4px",
                                }}
                              >  Sign in </p>
                            </Link>
                            here.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              {isMobile ? (
                <>
                  <Modal
                    title=""
                    centered
                    visible={confirmFormSubmit}
                    onOk={() => setConfirmFormSubmit(false)}
                    onCancel={() => setConfirmFormSubmit(false)}
                    className="confirmFormSubmit"
                  >
                    <div className="mobile_box_register">test Modal</div>
                  </Modal>
                </>
              ) : (
                <></>
              )}

              <img
                src={bannerImg}
                alt="banner img"
                className="img-fluid  d-sm-none d-block mobile-mt"
              />
            </Col>
          </Row>
        </Container>
      </StyledContinueNumber>
      <section className="bg-white py-80 sec2MainArea" id="benefits">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h3 className="mb-4 d-lg-none">
                Patients are searching professionals like you!
              </h3>
              <h3 className="mb-4 d-none d-lg-block">
                Patients are seeking <br className="d-none d-lg-block" />{" "}
                professionals like you!
              </h3>
              <ul>
                <li>Get access to patients all across Pakistan</li>
                <li>Provide online video consultations </li>
                <li>
                  Earn through consultations at any time and from anywhere
                </li>
                <li>View and manage your appointments in one place </li>
                <li>Get verified patient feedback </li>
              </ul>
            </Col>
            <Col md={5}>
              <img src={secTwoImgg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-80 sec2MainArea" id="registration">
        <Container>
          <Row className="align-items-center justify-content-center text-center">
            <Col md={4}>
              <h3 className="mb-5">
                Join Pakistan’s largest healthcare platform today
              </h3>
            </Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <Col md={3}>
              <div className="singleBoxArea text-left bg-white">
                <img src={iconOne} className="img-fluid mb-2" alt="Register" />
                <h5 className="mb-2">Register on dr.merisehat.pk</h5>
                <p>
                  Enter your name, mobile number, PMC number and your areas of
                  medical specialities.
                </p>
              </div>
            </Col>
            <Col md={3}>
              <div className="singleBoxArea text-left bg-white">
                <img src={iconTwo} className="img-fluid mb-3" alt="Register" />
                <h5 className="mb-2">Complete your profile</h5>
                <p>
                  Go through our introductory training and complete your
                  profile.
                </p>
              </div>
            </Col>
            <Col md={3}>
              <div className="singleBoxArea text-left bg-white">
                <img
                  src={iconThree}
                  className="img-fluid mb-3"
                  alt="Register"
                />
                <h5 className="mb-2">Profile Verification</h5>
                <p>Await verification from Meri Sehat, and go live!</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="singleBoxArea text-left bg-white">
                <img src={iconFour} className="img-fluid mb-2" alt="Register" />
                <h5 className="mb-2">Start Earning</h5>
                <p>
                  Connect with patients and start earning through in-person or
                  online video consultations.{" "}
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-block d-lg-none">
                <a
                  href="#banner-form"
                  onClick={() => scrollToSection("banner-form")}
                  className="   review-button mt-3 mt-lg-5 text-uppercase registerBtns position-relative fw-700"
                >
                  {" "}
                  Register Now
                  <span
                    className="continue-phone-chevron instant-code-chev d-none d-lg-flex"
                    style={{ height: "53px" }}
                  >
                    <FiChevronRight />
                  </span>
                </a>
              </div>
              <div className="d-none d-lg-block">
                <button
                  onClick={(e) => window.scrollTo({ top: 0, left: 0 })}
                  type="submit"
                  className="  review-button mt-3 mt-lg-5 text-uppercase registerBtns position-relative fw-700"
                >
                  Register Now
                  <span
                    className="continue-phone-chevron instant-code-chev d-none d-lg-flex"
                    style={{ height: "53px" }}
                  >
                    <FiChevronRight />
                  </span>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="bg-white py-80 whyUsArea" id="whychooseus">
        <Container>
          <Row className="m-0">
            <Col md={5}>
              <h3 className="mb-5">Why choose us</h3>
              <div className="d-flex align-items-start mb-4">
                <div className="me-3 col-2 col-lg-1 ">
                  <img
                    src={chooseIconOne}
                    alt=""
                    className="img-fluid mob_size"
                  />
                </div>
                <div className="col-10 col-lg-11">
                  <div className="box_chose">
                    <h5 className="mb-2">Grow your practice</h5>
                    <p>
                      Get access to enterprise-level medical software to help
                      your practice thrive.
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start mb-4">
                <div className="me-3 col-2 col-lg-1">
                  <img
                    src={chooseIconTwo}
                    alt=""
                    className="img-fluid mob_size"
                  />
                </div>
                <div className="col-10 col-lg-11">
                  <div className="box_chose">
                    <h5 className="mb-2">Earn remotely</h5>
                    <p>
                      Earn money by offering online video consultations from any
                      location and at any time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start mb-4">
                <div className="me-3 col-2 col-lg-1 ">
                  <img
                    src={chooseIconThree}
                    alt=""
                    className="img-fluid mob_size"
                  />
                </div>
                <div className="col-10 col-lg-11">
                  <div className="box_chose">
                    <h5 className="mb-2">Keep track of your patients </h5>
                    <p>
                      Have easy access to your patients medical history and
                      prescriptions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start mb-4">
                <div className="me-3 col-2 col-lg-1 ">
                  <img
                    src={chooseIconFour}
                    alt=""
                    className="img-fluid mob_size"
                  />
                </div>
                <div className="col-10 col-lg-11">
                  <div className="box_chose">
                    <h5 className="mb-2">Strengthen your credibility </h5>
                    <p>Join a community of PMC certified doctors.</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={5} className="offset-md-1">
              <img src={secTwoFour} alt="" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-80 sec2MainArea featureAreaBox" id="featured">
        <Container>
          <Row className="align-items-center justify-content-center">
            {/* <Col md={6} className="order-2 order-lg-1 mt-5 mt-lg-0">
              <div
                class="videoWidget dynamic-widget"
                data-reference_widget_id="7089"
                data-widget_id="17"
              >
                <div class="video-area-article">
                  <div class="video-player-box">
                    <div style={{ width: "100%", height: "360px" }}>
                      <div style={{ width: "100%", height: "100%" }}>
                        <iframe
                          frameborder="0"
                          allowfullscreen="1"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          title="YouTube video player"
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/yElm__MHvf0?autoplay=0&amp;mute=0&amp;controls=1&amp;origin=https%3A%2F%2Fstaging.merisehat.pk&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;iv_load_policy=3&amp;modestbranding=1&amp;enablejsapi=1&amp;widgetid=1"
                          id="widget2"
                          data-gtm-yt-inspected-6="true"
                          data-gtm-yt-inspected-97936982_33="true"
                          data-gtm-yt-inspected-16="true"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  <div class="row m-0">
                    <div class="col-md-8">
                      <div class="d-inline-block mt-2 mb-2">
                        <h5 class="selectLanguage text-left">
                          Select By Language
                        </h5>
                        <Tabs
                          defaultActiveKey="profile"
                          id="uncontrolled-tab-example"
                          className="mb-3 language-boxes"
                        >
                          <Tab
                            className="language-tags language-active"
                            eventKey="urdu"
                            title="Urdu"
                          ></Tab>
                          <Tab
                            className="language-tags"
                            eventKey="sindhi"
                            title="Sindhi"
                          ></Tab>
                          <Tab
                            className="language-tags"
                            eventKey="balochi"
                            title="Balochi"
                          ></Tab>
                          <Tab
                            className="language-tags"
                            eventKey="punjabi"
                            title="Punjabi"
                          ></Tab>
                          <Tab
                            className="language-tags"
                            eventKey="pashto"
                            title="Pashto"
                          ></Tab>
                        </Tabs>
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
              <a href="#banner-form" onClick={() => scrollToSection('banner-form')} className="review-button mt-5 text-uppercase registerBtns position-relative fw-700 d-lg-none"
              >  Register Now
                <span
                  className="continue-phone-chevron instant-code-chev d-none d-lg-flex"
                  style={{ height: "53px" }}
                >
                  <FiChevronRight />
                </span></a>
              <button
                onClick={(e) => window.scrollTo({ top: 0, left: 0 })}
                type="submit"
                className="d-none review-button mt-5 text-uppercase registerBtns position-relative fw-700 d-lg-none"
              >
                Register Now
              </button>
            </Col> */}

            <Col md={6} className="order-2 order-lg-1 mt-5 mt-lg-0">
              <VideoWidget />
            </Col>

            <Col md={5} className="offset-md-1 text-left order-1 order-lg-2">
              <h3 className="mb-3">Feature in our health videos</h3>
              <div className="w-80 mob-100">
                <p>
                  Meri Sehat has the largest health directory in the country,
                  containing 4000+ disease articles available in both English
                  and Urdu, as well as disease videos in major regional
                  languages.{" "}
                </p>
                <Col md={9}>
                  <button
                    onClick={(e) => window.scrollTo({ top: 0, left: 0 })}
                    type="submit"
                    className="review-button mt-5 text-uppercase registerBtns position-relative fw-700 d-none d-lg-flex"
                  >
                    Register Now
                    <span
                      className="continue-phone-chevron instant-code-chev"
                      style={{ height: "53px" }}
                    >
                      <FiChevronRight />
                    </span>
                  </button>
                </Col>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <section className="corporateSection py-80 bg-white" id="testimonials">
        <Container>
          <Row>
            <Col md={5} className="text-center mx-auto">
              <h2 className="heading3 mb-5">
                Here’s what doctors have to say about Meri Sehat
              </h2>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={12} className="text-center mx-auto">
              <Slider {...settings}>
                <div className="slider_dr">
                  <img src={drImage} className="img-fluid" alt="dr image" />
                  <h5>Mr. Ismail Munir</h5>
                  <h6>Karachi, Pakistan</h6>
                  <div className="star_rating_dr">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <p>
                    “ I am thrilled to be a part of an organisation providing
                    healthcare to patients far and wide with its vast range of
                    intuitive services “
                  </p>
                </div>
                <div className="slider_dr">
                  <img src={drImage} className="img-fluid" alt="dr image" />
                  <h5>Mr. Ismail Munir</h5>
                  <h6>Karachi, Pakistan</h6>
                  <div className="star_rating_dr">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <p>
                    “ I am thrilled to be a part of an organisation providing
                    healthcare to patients far and wide with its vast range of
                    intuitive services “
                  </p>
                </div>
              </Slider>
            </Col>
          </Row>
        </Container>
      </section> */}
      <section className="py-80 instantFAQ bg-white" id="faq">
        <Container>
          <h3 className="mb-4 d-none d-lg-block">{i18n.t("faqs")}</h3>
          <h3 className="mb-4 d-lg-none">{i18n.t("faqsss")}</h3>
          {faqQuestions?.[0]?.map((faqs, index) => (
            <Accordion defaultActiveKey={0}>
              <Accordion.Item
                className="pricing-accordion-item"
                key={index}
                eventKey="0"
              >
                <Accordion.Header className="pricing-accordion-question">
                  {faqs?.question}
                </Accordion.Header>
                <Accordion.Body className="pricing-accordion-answer">
                  {faqs?.answer}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
        </Container>
      </section>
      <Footer />
    </>
  );
};

export const StyledContinueNumber = styled.section`
  /* .LogoStyled{
        padding-top: 35px;
    } */

  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    /* Firefox */
  }

  .borderedRed {
    border: 1.5px solid red;
    border-radius: 11px;
  }


  .numberRed {
    color: #b11b1b !important;
  }

  .enter-mobile {
    color: #19b3b5;
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 450;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }
  .continue-number-box {
    background-color: #fff;
    border-radius: 12px;
  }
  .continue-heading {
    padding: 0 40px;
    margin-top: 50px;

    h4 {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 500;
      font-size: 36px;
      line-height: 45px;
      /* or 125% */

      letter-spacing: 0.01em;

      color: #313131;
    }

    p {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 300;
      font-size: 18px;
      line-height: 25px;

      color: #404040;
    }
  }

  .description-circle-group {
    margin-left: 2.3rem;
    margin-top: 25px;

    p {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 450;
      font-size: 18px;
      line-height: 23px;
      color: #313131;
      display: flex;
      align-items: center;
    }
  }

  .line-divider {
    display: flex;
    justify-content: center;
    padding: 15px 4px 0 4px;

    span {
      margin-top: 10px;
      padding: 0 4px;
    }
  }

  .continue-phone-btn {
    border-radius: 12px;
    background-color: #19b3b5;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 53px;
    padding: 0;
    width: 100%;
    font-family: "Nunito";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.05em;
    color: #ffffff;

    .continue-phone-chevron {
      float: right;
      background-color: #078a8e !important;
      font-size: 16px;
      height: 44px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0px 10px 10px 0px;
      position: absolute;
      right: 0;
      left: auto;
    }
  }

  .boxLineCut {
    border: 0.3px solid #313131;
    height: auto;
    width: 80%;
    margin: auto;
    padding-bottom: 1rem;

    .btn-apple12 {
      width: 100%;
      cursor: pointer;
    }
  }

  .boxLineCut h1 {
    width: 75%;
    margin-top: -15px;
    margin-left: auto;
    margin-right: auto;
    background: #e1f3f4;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
  }

  .doctor-error-msg p {
    margin-top: 0px;
    margin-left: 80px;
    // background-color: #fee6e6;
    padding: 3px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    color: #b11b1b;
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 450;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #bc0001;
    .bsX {
      cursor: pointer;
      margin-top: 2px;
      font-size: 20px;
    }
  }
  @media (min-width: 0px) and (max-width: 767px) {
    .doctor-error-msg {
      p {
        margin-left: 62px !important;
        font-size: 12.5px;
      }
    }
  }
`;

export default SignupMobile;
