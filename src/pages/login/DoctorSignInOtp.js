import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
// import LoginLogo from "../../assets/images/png/LoginLogo.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import LoginAunty from "../../assets/images/png/login_left_image.png";
import LoginAuntyMobile from "../../assets/images/png/opt-mobile-screen.png";
import { FiChevronRight } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import "./fewMoreDetail.css";
import englishUrduLogo from '../../assets/images/svg/englishUrduLogo.svg';
import Logo from "../../assets/images/png/meri-sehat-logo.png";
import instance from '../../utils/httpService'
import Loader from "../../uiComponents/loader/Loader";
import Cookies from "js-cookie";
import swal from "sweetalert";
import { ConsoleIcon } from "evergreen-ui";


const DoctorSignInOtp = () => {
  const history = useHistory();

  const [Otp, setOtp] = useState("");
  const [hideError, setHideError] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendOtpError, setResendOtpError] = useState("");
  let doctorEmailFromCookie = Cookies.get('emailAddress')

  let inputStyle = {
    height: "100px",
    width: "100px",
    borderRadius: "10px",
    marginRight: "0px",
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (Otp.length === 4) {
      (async () => {
        const emailDoctor = doctorEmailFromCookie !== "undefined" && doctorEmailFromCookie

        const data = {
          email: emailDoctor,
          otp: Otp,
        };

        try {
          setApiLoading(true);
          const response = await instance.post("/verify-otp", data);
          if (response?.status === 200) {
            // swal("Success", "Login Successfully", "success")
            setApiLoading(false);
            setOtpError('');
            Cookies.set("token", `Bearer ${response?.data?.data?.token}`, {
              expires: 30,
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 2000) 
          } else {
            setApiLoading(false);
            console.log({response}) 
            setOtpError(
              response?.data?.error || "Error! Something went wrong..."
            );
          }
        } catch (error) {
          setApiLoading(false);
          setOtpError(error?.response?.data?.message || error?.message);
        }
      })();
    } else {
      setOtpError("Enter OTP code");
    }
  }

  const renderInstantTime = (remainingTime) => {
    return (
      <span className="fw-500 fs-18" style={{color: "#E9406A", fontFamily: "Circular Std",wordSpacing: '-6px' }}>
        {" "}
        {remainingTime === 0
          ? ""
          : ` 00:${remainingTime < 10 ? `0` : ""}${remainingTime} seconds`}
      </span>
    );
  };

  const renderInstantButton = (buttonProps) => {
    return (
      <button {...buttonProps}>
        {buttonProps.remainingTime === 0 ? (
          <>
            {" "}
            <a
              className="_underline_ancer1 fs-18"
              style={{ color: "#E9406A", textDecoration: "underline" }}
              onClick={resendOtpHandler}
            >
              Resend SMS 
            </a>
            <br /> <p style={{fontFamily: "Circular Std",color: "#313131" }} className="mt-1 fs-16 fw-450"> Code Expired - Click Resend</p>{" "}
          </>
        ) : (
          <p className="fs-18 fw-450" style={{ color: "#313131", fontFamily: "Circular Std", fontWeight:'450' }}>Resend Email</p>
        )}
      </button>
    );
  };

  async function resendOtpHandler() {
    try {
      const email = doctorEmailFromCookie !== "undefined" && doctorEmailFromCookie
      const data = {
        email,
      };

      const response = await instance.post("/resendOtp", data);

      if (response?.status === 200) {
        setResendOtpError('')
        // swal("Success", "OTP Sent Successfully", "success")
        setOtpError('')
        setOtpError(false)
        setOtp('')
      } else {
        setResendOtpError(
          response?.data?.message || "Your OTP could not be resent..."
        );
      }
    } catch (error) {
      setResendOtpError(error?.response?.data?.message || error?.message);
    }
  } 

  const handleAlert = () => {
    setOtpError('')
    setOtpError(false)
}

  return (
    <>
      <StyledLoginOtp className="signup_otp">
        <div className="header_meriSehat">
          <Container fluid>
            {apiLoading && <Loader />}
            <Row>
              <Col md={12}>
                <div className="logo_only ddd">
                  {/* <Link to="/"> */}
                  <div className="d-none d-sm-block">
                    <img src={Logo} alt="Logo" />
                  </div>
                  <div className="d-block d-sm-none">
                    <img src={englishUrduLogo} alt="Logo" />
                  </div>
                  {/* </Link> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row>
            <Col md={6}>
              <div className="login-below">
                <img src={LoginAunty} className="img-fluid d-none d-md-block" />
                <img
                  src={LoginAuntyMobile}
                  className="img-fluid d-md-none mt-4 mb-4"
                />
              </div>
            </Col>
            <Col md={6} className="hk_signin_otp_doctor signup_otp_style">
              <div className="heading-confirm col-lg-12 m-auto mt-4">
                <h3 className="justify-content-center pt-4">Confirm your email</h3>
              </div>
              <div className="mt-3 confirm-paragraph col-lg-12 m-auto d-none d-md-block">
                <p>
                  An email has been sent to the <br/>
                  following email address <b>{doctorEmailFromCookie !== "undefined" && doctorEmailFromCookie}</b>
                </p>
              </div>

              <form className="form" autoComplete="off" onSubmit={handleSubmit}>
                <div className="px-md-4 otp-login-box">
                  <OTPInput
                    value={Otp}
                    onChange={setOtp}
                    autoFocus
                    hasErrored
                    OTPLength={4}
                    otpType="number"
                    disabled={false}
                    secure={false}
                    className={
                      otpError && !hideError
                        ? "input-otp-error otpContainer pb-0"
                        : "otpContainer" && resendOtpError && !hideError
                          ? "input-otp-error otpContainer pb-0"
                          : "otpContainer"
                    }
                    inputStyles={inputStyle}
                  />

                  {otpError && !hideError && (
                    <div
                      className="doctor-error-msg"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        position: "relative",
                      }}
                    >
                      <p className="otpErrorState"> {otpError} </p>
                      <span className='cross-icon' onClick={handleAlert}> </span>
                    </div>
                  )}

                  {resendOtpError && !hideError && (
                    <div
                      className="doctor-error-msg"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p> {resendOtpError} </p>
                    </div>
                  )}
                </div>
                <div className="resend-sms-otp px-4 mt-5">
                  <ResendOTP
                    maxTime={60}
                    className="OtpCounting verifyOtpConfirm "
                    
                    renderButton={renderInstantButton}
                    renderTime={renderInstantTime}
                  />
                </div>

                <div className="Otp-continue-btn">
                  <button
                    type="submit"
                    diabled={apiLoading}
                    className="review-button text-uppercase loginOtp-phone-btn position-relative"
                  >
                    Continue
                    <span
                      className="loginOtp-phone-chevron"
                      style={{ height: "53px" }}
                    >
                      <FiChevronRight />
                    </span>
                  </button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </StyledLoginOtp>
    </>
  );
};

export const StyledLoginOtp = styled.section`
  /* position: relative; */
  .LogoStyled {
    padding-top: 55px;
  }

  .heading-confirm {
    text-align: center;
    // padding: 0 175px;

    h3 {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 500;
      font-size: 36px;
      line-height: 45px;
      padding-bottom:30px;
      /* or 125% */

      display: flex;
      align-items: center;
      text-align: center;

      color: #313131;
    }
  }

  .confirm-paragraph {
    // padding: 0 100px;
    text-align: center;

    p {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 300;
      font-size: 18px;
      line-height: 23px;
      text-align: center;
      color: #313131;
    }

    span {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 450;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      color: #313131;
    }
  }

  .otp-font {
    font-family: "Nunito";
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 55px;
    /* identical to box height */

    text-align: center;

    color: #313131;
  }

  .login-below {
    position: absolute;
        bottom: -81px;
    left: 100px;
  }

  .loginOtp-phone-btn {
    border-radius: 12px;
    background-color: #19b3b5;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 53px;
    padding: 0;
    width: 100%;
    left: 0;
    font-family: "Nunito";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.05em;
    color: #ffffff;

    .loginOtp-phone-chevron {
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

  .otp-login-box {
    padding-top: 20px;
  }

  .Otp-continue-btn {
    padding-top: 30px;
    margin-left: 0px;
    margin: auto;
    width: 100%;
  }

  .otpContainer {
    display: flex;
    justify-content: center;
    gap: 18px;

    input {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 500;
      font-size: 36px;
      line-height: 45px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #313131;
    }
  }

  .doctor-error-msg {
    margin-top: 6px;
    margin-left: 0px;
    // background-color: #fee6e6;
    padding: 3px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    color: #b11b1b;
    width: 100%;
    margin: 0 auto;

    .bsX {
      cursor: pointer;
      margin-top: 2px;
      font-size: 20px;
    }
  }

  .input-otp-error {
    input {
      border: 1px solid #bc0001 !important;
      color: #bc0001;
    }
  }
  @media only screen and (max-width: 767px) {
    .heading-confirm h3 {
      font-size: 20px;
      line-height: 27px;
      margin-top: 25px;
      justify-content: center;
    }
    .otp-login-box {
      padding-top: 0px;
    }
    .doctor-error-msg p {
      justify-content: space-between;
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 450;
      font-size: 15px;
      line-height: 150%;
      display: flex;
      align-items: center;
      color: #bc0001;
     
    }
    .otpContainer input {
      width: 44px !important;
      height: 44px !important;
      border-radius: 5px !important;
      font-family: "Circular Std";
      font-weight: 450;
      font-size: 22px;
      line-height: 150%;
    }
    // .Otp-continue-btn {
    //   width: 100%;
    // }
    .loginOtp-phone-btn .loginOtp-phone-chevron {
      background-color: transparent !important;
      position: relative;
      width: auto;
    }
  }
`;

export default DoctorSignInOtp;
