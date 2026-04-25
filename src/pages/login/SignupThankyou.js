import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
// import LoginLogo from "../../assets/images/png/LoginLogo.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import LoginAunty from "../../assets/images/png/girlFile.png";
import { FiChevronRight } from "react-icons/fi";
import i18n from "../../i18n";
import { useNavigate, useParams, Link, useHistory, useLocation } from "react-router-dom";
import { BsX } from "react-icons/bs";
import "./fewMoreDetail.css";
import Logo from "../../assets/images/svg/meri-sehat-logo.svg";
import tick from "../../assets/images/png/check-tick.png";
import encryptStorage from "../../utils/encryptStorage";
import loadingGif from "../../assets/images/gif/loader_gif.gif";
import grayCheck from "../../assets/images/svg/gray-check.svg";
import greenCheck from "../../assets/images/svg/green-check.svg";
import API from "../../utils/customAxios";
import axios from "axios";
import moment from "moment";
import Loader from "../../uiComponents/loader/Loader";
const SignupThankyou = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [doctorstatus, setDoctorStatus] = useState();

  const [bookingTime, setBookingTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  const uniqueCode = encryptStorage.getItem("unique_code");

  const location = useLocation();

  useEffect(() => {
    if(location.state) {
      console.log(location.state);
      sessionStorage.setItem("apiUrl", location?.state?.apiUrl)
    }
  }, [location.state])

  const apiUrl = sessionStorage.getItem("apiUrl");

  useEffect(() => {
    if(apiUrl) {
      axios.get(apiUrl, {
        headers: {
          'Authorization': process.env.REACT_APP_CALENDLY_AUTH
        }
      })
      .then((res) => {
          console.log(res?.data?.resource?.start_time, "ubaid");
          const startTime = res?.data?.resource?.start_time;
          if(startTime) {
            setBookingTime(moment(startTime).local().format(('hh:mm A')));
            setBookingDate(moment(startTime).local().format('DD-MM-YYYY'));
          }
        
      })
    }
  }, [apiUrl])
  
  

  useEffect(() => {
    sessionStorage.setItem("alreadyShow", "alreadyshown");
    // setTimeout(() => {
    //   window.location.href = "/profile-setup";
    // }, 3000);
  }, []);

  // console.log(uniqueCode);

  // encryptStorage.clear();

  function navigateToPatient() {
    window.location.href = "https://merisehat.pk";

  }

  return (
    <>
      <StyledThankyou className="thankyouscreen">
        {(!bookingDate || !bookingTime) && (
          <Loader />
        )}
        <div className="header_meriSehat bg-white d-none d-lg-block">
          <Container fluid>
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

        <Container>
          <Row className="my-4">
            <Col md={7} className="order-2 order-md-1 mt-3 mt-md-0">
              <div className="image-below d-sm-block d-none">
                <img className="img-fluid" src={LoginAunty} />
              </div>
              <div className="image-below d-sm-none d-block">
                <div className="mt-70">
                  <button type="submit" className="btn-okay">
                    OKAY
                  </button>
                </div>
              </div>
            </Col>
            {uniqueCode && !showCalendar ? (
              <Col md={5} className="order-1 order-md-2 d-none">
                <div
                  className="content text-center bg-white p-5 mobile_style_thankyou"
                  style={{ borderRadius: "18.6977px" }}
                >
                  <img src={tick} alt="" />
                  <h1 className="thankyou-heading mt-4">
                    {i18n.t("Thank you!")}
                  </h1>

                  <p className="text-uppercase para-application my-4">
                    {i18n.t("Your Registration Number is")}
                  </p>

                  <div>
                    <input
                      className="p-2 text-center application-number"
                      maxLength={6}
                      placeholder={uniqueCode}
                    />
                  </div>

                  <p className="mt-4 ContactText text-center col-md-9 m-auto">
                    {i18n.t(
                      "Your registration is almost complete, just a few more steps."
                    )}{" "}
                  </p>
                  <div className="mt-4 ">
                    <p className="saveText">
                      We will now call you for an orientation session while we
                      verify your PMDC number and we will also walk you through
                      our platform and its features.
                    </p>
                    <p className="saveText mt-4">
                      Please select a time below for your availability and one
                      of our customer happiness representatives will be in touch
                      with you.
                    </p>
                    <button
                      type="submit"
                      className="review-button mt-4 select-availabilty-btn position-relative text-uppercase"
                      onClick={(e) => setShowCalendar(true)}
                    >
                      Select Your availabilty
                    </button>
                  </div>
                </div>
              </Col>
            ) : showCalendar ? (
              <Col md={5} className="order-1 order-md-2">
                <p>zayk</p>
              </Col>
            ) : (
              <div className="loaderWrapper container">
                <img src={loadingGif} alt="" />
              </div>
            )}
            <Col
              md={5}
              className="order-1 order-md-2 text-center bookedAreaBooking"
            >
              <Col md={8} className="m-auto">
                <h1 className="thankyou-time-booked">
                  {i18n.t("Thank you, your time slot has been booked")}
                </h1>
              </Col>
              <p className="  timeBookedSlot my-4">{bookingDate} at {bookingTime}</p>
              <hr className="bg-black opacity-1" />
              <p className="text-uppercase para-application my-4">
                {i18n.t("Your Registration Number is")}
              </p>

              <div>
                <input
                  className="p-2 text-center application-number pinkBookedColor"
                  maxLength={6}
                  placeholder={uniqueCode}
                />
              </div>
              <div className="card bg-white p-4 mt-5">
                <h5 className="mb-3">You’re almost there!</h5>
                <div className="borderstyle d-flex align-items-center pb-4 text-left">
                  <img src={greenCheck} alt="" className="img-fluid" />
                  <div className="ms-2">
                    <h6 className="mb-0 active">Step 1: Register</h6>
                  </div>
                </div>
                <div className="borderstyle  d-flex align-items-center pb-4 text-left">
                  <img src={greenCheck} alt="" className="img-fluid" />
                  <div className="ms-2">
                    <h6 className="mb-0 active">
                      Step 2: Select your availability
                    </h6>
                  </div>
                </div>
                <div className="borderstyle  d-flex align-items-center pb-4 text-left">
                  <img src={grayCheck} alt="" className="img-fluid" />
                  <div className="ms-2">
                    <h6 className="mb-0">Step 3: Orientation and training</h6>
                    <p>
                      Go through our introductory training and complete your
                      profile.
                    </p>
                  </div>
                </div>
                <div className=" d-flex align-items-center text-left">
                  <img src={grayCheck} alt="" className="img-fluid" />
                  <div className="ms-2">
                    <h6 className="mb-0">Step 4: Profile verification</h6>
                    <p>Meri Sehat will verify your profile for authenticity.</p>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="my-4">
                  <button type="submit" 
                  className="btn-okay" 
                  style={{backgroundColor: '#EF6286'}}
                  onClick={navigateToPatient}
                  >
                    <span style={{ borderBottom: '1px solid #fff'}}>
                  Return to Home Screen
                    </span>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </StyledThankyou>
    </>
  );
};

export const StyledThankyou = styled.section`
  .thankyou-heading {
    font-family: "Nunito";
    font-style: normal;
    font-weight: 500;
    font-size: 26px;
    line-height: 35px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #313131;
    justify-content: center;
  }

  .ContactText {
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    /* or 125% */

    text-align: center;

    color: #292929;
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 450;
    display: flex;
    align-items: center;
    text-align: center;

    color: #ef6286;
  }

  .saveText {
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 20px;
    /* or 125% */

    text-align: center;

    color: #292929;
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #313131;
  }

  .classPadding {
    padding: 0 9rem;
  }

  .bg-black {
    width: 60% !important ;
    margin: 1rem auto !important;
  }

  .para-application {
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 23px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #313131;
    justify-content: center;
  }

  .image-below {
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .application-number {
    border-radius: 10px;
    border: none;
    width: fit-content;
    background: #cfeced;
    border-radius: 12.4651px;
    font-family: "Nunito";
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 30px;
    /* display: flex; */
    /* align-items: center; */
    text-align: center;
    letter-spacing: 0.06em;
    color: #1fa7a8;
    max-width: 150px;

    input {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 30px;
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: 0.06em;

      color: #313131;
    }
    input::placeholder {
      color: #1fa7a8;
    }
  }
  .select-availabilty-btn {
    background: #ef6286;
    border-radius: 18.6977px;
    border-radius: 12px;
    /* background-color: #19b3b5; */
    color: white;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 53px;
    padding: 0;
    width: 100%;
    font-family: "Nunito";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    -webkit-letter-spacing: 0.05em;
    -moz-letter-spacing: 0.05em;
    -ms-letter-spacing: 0.05em;
    letter-spacing: 0.05em;
    color: #ffffff;
  }
  .timeBookedSlot {
    background: #ffffff;
    border-radius: 6.4px;
    font-family: "Nunito";
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 27px;
    text-align: center;
    width: fit-content;
    margin: auto;
    padding: 7px 14px;
    color: #1fa7a8;
  }
  .pinkBookedColor {
    background: #ef6286;
    color: white;
  }
  .pinkBookedColor::placeholder {
    color: white;
  }
`;

export default SignupThankyou;
