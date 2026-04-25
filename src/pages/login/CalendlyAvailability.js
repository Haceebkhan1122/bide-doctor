import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
// import LoginLogo from "../../assets/images/png/LoginLogo.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import LoginAunty from "../../assets/images/png/girlFile.png";
import { FiChevronRight } from "react-icons/fi";
import i18n from "../../i18n";
import { useParams, Link, useHistory } from "react-router-dom";
import { BsX } from "react-icons/bs";
import "./fewMoreDetail.css";
import Logo from "../../assets/images/svg/meri-sehat-logo.svg";
import tick from "../../assets/images/png/check-tick.png";
import encryptStorage from "../../utils/encryptStorage";
import loadingGif from "../../assets/images/gif/loader_gif.gif";
import grayCheck from "../../assets/images/svg/gray-check.svg";
import greenCheck from "../../assets/images/svg/green-check.svg";
import API from "../../utils/customAxios";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";

const CalendlyAvailability = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [doctorstatus, setDoctorStatus] = useState();


  const history = useHistory();

  const uniqueCode = encryptStorage.getItem("unique_code");

  useCalendlyEventListener({
    onProfilePageViewed: (e) => console.log("onProfilePageViewed", e),
    onDateAndTimeSelected: (e) => console.log("onDateAndTimeSelected", e),
    onEventTypeViewed: (e) => console.log("onEventTypeViewed", e),
    onEventScheduled: (e) => {
      // console.log(e.data.payload, "onEventScheduled");
      // window.location.href = "/profile-setup";

      const eventApi = e.data.payload.event.uri;

      const stateData = {
        apiUrl: eventApi,
      }

      history.replace("/thankyou-doctor", stateData);

    } 
  });

  useEffect(() => {
    sessionStorage.setItem("alreadyShow", "alreadyshown");
    // setTimeout(() => {
    //   window.location.href = "/profile-setup";
    // }, 3000);
  }, []);

  // console.log(uniqueCode);

  // encryptStorage.clear();
  return (
    <>
      <StyledThankyou className="thankyouscreen">
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
            
              <Col md={5} className="order-1 order-md-2">
                <InlineWidget url="https://calendly.com/info-_hk/30min" />
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
    position: absolute;
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

export default CalendlyAvailability;
