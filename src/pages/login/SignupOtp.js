import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
// import LoginLogo from "../../assets/images/png/LoginLogo.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import LoginAunty from "../../assets/images/png/girlFile.png";
import { FiChevronRight } from "react-icons/fi";
import i18n from "../../i18n";
import { useNavigate, useParams, Link, useHistory } from "react-router-dom";
import { BsX } from "react-icons/bs";
import "./fewMoreDetail.css";
import Logo from "../../assets/images/png/meri-sehat-logo.png";
import encryptStorage from "../../utils/encryptStorage";
import swal from "sweetalert";
import API from "../../utils/customAxios";
import { maskPhone } from "../../utils/helperFunctions";
import { useEffectOnce } from "react-use";
import Loader from "../../uiComponents/loader/Loader";
import LoginAuntyMobile from "../../assets/images/png/opt-mobile-screen.png";
import Cookies from "js-cookie";
import englishUrduLogo from '../../assets/images/svg/englishUrduLogo.svg';


const SignupOtp = () => {
  const history = useHistory();
  const [Otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [resendOtpError, setResendOtpError] = useState("");
  const [maskPhoneNumber, setMaskPhoneNumber] = useState("");
  const [hideError, setHideError] = useState(false);

  const hideOtpError = () => {
    setHideError(true);
  };

  useEffectOnce(() => {
    let phone = encryptStorage.getItem("signupPhone");
    phone = `0${phone}`;

    setMaskPhoneNumber(maskPhone(phone));
  });

  const signupDetails = async (e) => {
    e.preventDefault();

    e.preventDefault();

    // history.push('/signup-details')
    if (Otp.length === 4) {
      encryptStorage.setItem("otp", Otp);

      (async () => {
        let phone = encryptStorage.getItem("signupPhone");
        phone = `0${phone}`;

        const data = {
          phone,
          otp: Otp,
        };

        try {
          setApiLoading(true);
          const response = await API.post("/doctor-otp", data);

          if (response?.data?.code === 200) {
            Cookies.set("token", response?.data?.data?.token);
            localStorage.removeItem('number')
            if (Cookies.get("token")) {
              setApiLoading(false);
              window.location.href = "/signup-details";
            }
          } else {
            setApiLoading(false);
            setOtpError(response?.data?.message);
          }
        } catch (error) {
          setApiLoading(false);
          setOtpError(error?.response?.data?.message);
        }
      })();
    } else {
      setOtpError("Enter OTP code");
    }
  };

  let inputStyle = {
    height: "100px",
    width: "100px",
    borderRadius: "10px",
    marginRight: "0px",
    // marginLeft: '8px',
    // border:  '0.5px solid #959494 ',
  };

  const renderInstantTime = (remainingTime) => {
    return (
      <span>
        {" "}
        {remainingTime === 0
          ? ""
          : ` 00:${remainingTime < 10 ? `0` : ""}${remainingTime} seconds`}
      </span>
    );
  };

  const editPhoneNumber = () => {
    console.log('pushed')
    history.push('/signup-number')
  }

  const renderInstantButton = (buttonProps) => {
    return (
      <button {...buttonProps}>
        {buttonProps.remainingTime === 0 ? (
          <a style={{ color: "#E9406A", textDecoration: "underline" }}>
            Resend SMS
          </a>
        ) : (
          "Resend SMS"
        )}
      </button>
    );
  };

  async function resendOtpHandler() {
    try {
      const phone = encryptStorage.getItem("signupPhone");
      const data = {
        phone,
      };

      const response = await API.post("/resend-otp", data);

      if (response?.data?.code === 200) {
        // window.location.reload();
      } else {
        setResendOtpError(
          response?.data?.message || "Your OTP could not be resent..."
        );
      }
    } catch (error) {
      setResendOtpError(error?.response?.data?.message || error?.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <StyledLoginOtp className="signup_otp">
        <div className="header_meriSehat">
          <Container fluid>
            {apiLoading && <Loader />}
            <Row className="d-none d-lg-block" >
              <Col md={12}>
                <div className="logo_only test">
                  {/* <Link to="/"> */}
                  <img src={Logo} alt="Logo" />
                  {/* </Link> */}
                </div>
              </Col>
            </Row>
            <Row className="d-lg-none" >
              <Col md={12}>
                <div className="logo_only test1">
                  {/* <Link to="/"> */}
                  <img src={englishUrduLogo} alt="Logo" />
                  {/* </Link> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          {/* <div className='LogoStyled'>
         <img src={LoginLogo} alt="logo" />
            </div> */}

          <Row>
            <Col md={12}>
              <div className="login-below mt-5 mb-4 d-sm-none d-block text-center">
                <img src={LoginAuntyMobile} className="img-fluid " />
              </div>
            </Col>
            <Col md={6}></Col>
            <Col xs={11} md={6} className="signup_otp_style ">
              <div className="heading-confirm col-lg-5 m-auto mt-4">
                <h3>Confirm your phone number</h3>
              </div>
              <div className="mt-3 confirm-paragraph col-lg-7 m-auto d-sm-block d-none">
                <p>
                  An SMS has been sent to the following phone number:{" "}
                  <span> {maskPhoneNumber} </span>
                  <span style={{ cursor: 'pointer' }} onClick={editPhoneNumber} >(Edit)</span>
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
                  {/* {Otp === '' || Otp.length < 4 ? (
                          <span className="error">
                            {i18n.t('field_required')}
                          </span>
                        ) : (
                          ''
                        )} */}

                  {otpError && !hideError && (
                    <div
                      className="doctor-error-msg"
                      style={{
                        // display: "flex",
                        // position: 'absolute',
                        // justifyContent: "space-between",
                        // marginTop: '3px',
                        // marginLeft: '2.8rem',
                      }}
                    >
                      <p> {otpError} </p>
                      {/* <BsX onClick={hideOtpError} className="bsX" /> */}
                    </div>
                  )}

                  {resendOtpError && !hideError && (
                    <div
                      className="doctor-error-msg"
                      style={{
                        // display: "flex",
                        // position: 'absolute',
                        // justifyContent: "space-between",
                        // marginTop:'3px',
                        // marginLeft:'2.8rem',
                      }}
                    >
                      <p> {resendOtpError} </p>
                    </div>
                  )}
                </div>
                <div className="mt-3 confirm-paragraph  m-auto d-sm-none d-block">
                  <p>
                    An SMS has been sent to the following phone number:{" "}
                    <span> {maskPhoneNumber} </span>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={editPhoneNumber}
                    >(Edit)</span>
                  </p>
                </div>
                <div className="resend-sms-otp px-4 mt-5">
                  <ResendOTP
                    maxTime={60}
                    className="OtpCounting"
                    style={{ display: "grid", justifyContent: "center" }}
                    renderButton={renderInstantButton}
                    renderTime={renderInstantTime}
                    onResendClick={resendOtpHandler}
                  />
                </div>

                <div className="Otp-continue-btn">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    onClick={signupDetails}
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
          <div className="login-below d-none d-md-block">
            <img src={LoginAunty} className="img-fluid " />
          </div>
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
      font-size: 32px;
      line-height: 42px;
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
      font-size: 16px;
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
    text-align: center;
    color: #313131;
  }

  .login-below {
    position: absolute;
    bottom: 0;
    left: 0;
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
    padding-top: 40px;
  }

  .Otp-continue-btn {
    padding-top: 30px;
    margin-left: 60px;
  }

  .otpContainer {
    display: flex;
    justify-content: center;
    gap: 30px;

    input {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      line-height: 42px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #313131;
    }
  }

  .doctor-error-msg {
    margin-top: 6px;
    margin-left: 6px;
    // background-color: #fee6e6;
    padding: 3px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    color: #b11b1b;
    width: 85%;
    margin: 0 auto;

    p {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 450;
      font-size: 14px;
      line-height: 140%;
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      color: #b11b1b;
    }

    .bsX {
      cursor: pointer;
      margin-top: 2px;
      font-size: 20px;
    }
  }

  .input-otp-error {
    input {
      border: 1px solid #b11b1b !important;
      color: #C20203;
    }
  }
  .OtpCounting button {
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 450;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    margin-bottom: 5px;
    color: #313131;
  }
  .OtpCounting span {
    font-family: "Circular Std";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;

    color: #e9406a;
  }
`;

export default SignupOtp;
