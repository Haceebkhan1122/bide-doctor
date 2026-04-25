import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import {Select } from "antd";
import logo from "../../assets/images/svg/englishUrduLogo.svg";
import ndnLogo from "../../assets/images/svg/ndnLogo.svg";
import "./SignupMobile.css";
import { useHistory } from "react-router-dom";
import Loader from "../../uiComponents/loader/Loader";
import loginDoctors from "../../assets/images/png/login_left_image.png";
import loginDoctorsMobile from "../../assets/images/png/sign-in-mobile.png";
import Cookies from "js-cookie";
import instance from '../../utils/httpService'
import logo_header from '../../assets/images/png/ogooo_head.png'
import bideLogo from '../../assets/images/svg/iconbide.svg';
import hpfLogo from '../../assets/images/svg/hpfSvg.svg';
import { Divider } from '@mui/material';

const { Option } = Select;
const DoctorSignIn = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [doctorEmail, setDoctorEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (!Cookies.get('token')) {
      Cookies.remove("pagestatus");
      Cookies.remove("pageStatus");
    }
  }, [])

  const navigateToOtp = async (e) => {
    e.preventDefault();
    if (doctorEmail === "") {
      setApiError("Email address could not be found");
    } else {
      let data = {
        email: doctorEmail,
        role_id: 2
      };
      try {
        setApiLoading(true);
        const response = await instance.post("/login", data);
        if (response?.status === 200) {
          Cookies.remove('emailAddress', doctorEmail)
          Cookies.set('emailAddress', doctorEmail)
          setApiLoading(false);
          history.push("/verify-otp");
        } else {
          setApiLoading(false);
          setApiError(
            response?.data?.error || "Error! Something went wrong..."
          );
        }
      } catch (error) {
        setApiLoading(false);
        setApiError(error?.response?.data?.error);
      }
    }
  };

  return (
    <>
      {apiLoading && (
        <Loader />
      )}
      <StyledContinueNumber className="bgWhiteMobile">
        <div className="header_meriSehat ">
          <Container fluid>
            {apiLoading && <Loader />}

            <Row>
              <Col md={8}>
                <div className="logo_only">
                  {/* <img src={logo} className="logoEU" alt="Logo" />
                  <img src={ndnLogo} className="logoS" alt="Logo" /> */}
                  <img src={logo_header} className="logoEUheee" alt="Logo" /> 
                </div>
              </Col>
              <Col md={4}>
              <div className="circular_bar">
                    <img src={hpfLogo} alt="" className='hpfLogo' />
                    <Divider orientation="vertical" className='divider' />
                    <img src={bideLogo} alt="" className='bideLogo' />
              </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className="align-items-md-center align-items-end singup-mobile-col hk_doctor_login">
            <Col md={5}>
              <div className="image-below">
                <img
                  className="img-fluid d-none d-md-block"
                  src={loginDoctors}
                />
                <img className="img-fluid d-md-none" src={loginDoctorsMobile} />
              </div>
            </Col>
            <Col md={7} className="marginTopEightRem p-0">
              <div className="continue-number-box instant_login_hk">
                <div className="p-4">
                  <div className="d-block text-center">
                    <h3 className=" enter-mobile">
                      Sign in with your Email
                    </h3>
                  </div>
                  <div className="form_controll form-drop form-Econtrol">
                    <form noValidate onSubmit={navigateToOtp} className={apiError !== "" ? 'alert_red' : ''}>
                      <label className="label_email">Email</label>
                      <div
                        style={{ display: "flex" }}
                        className='hk_number ek_number'>
                        <input
                          onChange={(e) => setDoctorEmail(e.target.value)}
                          className="input-number input-number-ek inppin"
                          placeholder="Enter your Email address"
                          type="email"
                          maxLength="50"
                          value={doctorEmail}
                          style={{ width: "100%" }}
                        />
                      </div>
                      {apiError ? (
                        <>
                          <p className="instant-error-msg"> {apiError} </p>
                        </>
                      ) : ''}
                      <div className="btn-cont p-0">
                        <button
                          type="submit"
                          className="review-button mt-4 text-uppercase instant-btn position-relative statechanged"
                        >
                          <span
                            className="leftZeroMobile"
                            style={{ position: "relative", left: "-15px" }}
                          >
                            SEND CODE
                          </span>
                          <span
                            className="instant-chevron instant-code-chev d-none d-md-flex"
                            style={{ height: "53px" }}
                          >
                            <FiChevronRight />
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </StyledContinueNumber>
    </>
  );
};

export const StyledContinueNumber = styled.section`
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

  .enter-mobile {
    font-family: "Nunito";
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    line-height: 45px;
    text-align: center;
    padding-top: 15px;
margin-bottom:20px;
    color: #19b3b5;
  }
  .continue-number-box {
    background-color: #fff;
    border-radius: 12px;
    width:544px;
    height: 317px;
  }
  @media only screen and (max-width: 767px) {
    .continue-number-box {
      background: #c9e9ea;
      box-shadow: 0px 3px 23px rgba(0, 0, 0, 0.102);
      border-radius: 20px 20px 0px 0px;
    }
  }
  .continue-heading {
    padding: 0 0px;
    margin-top: 0px;

    h4 {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      line-height: 45px;
      /* or 125% */

      letter-spacing: 0.01em;

      color: #313131;
      width: 480px;
    }

    p {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 300;
      font-size: 17px;
      line-height: 25px;

      color: #404040;
    }
  }

  .description-circle-group {
    margin-left: 0;
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

  .image-below {
    position: absolute;
    bottom: 0;
  }

  .doctor-error-msg {
    margin-top: 6px;
    margin-left: 6px;
    background-color: #fee6e6;
    padding: 3px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    color: #b11b1b;
    .bsX {
      cursor: pointer;
      margin-top: 2px;
      font-size: 20px;
    }
  }
`;

export default DoctorSignIn;
