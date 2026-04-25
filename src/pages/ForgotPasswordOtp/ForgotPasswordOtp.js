import React, {useState, useEffect} from 'react'

import { Col, Container, Row } from "react-bootstrap";
import { Form, Input } from "antd";
import { useHistory, useLocation } from 'react-router-dom'
import ContentBlock from "../../uiComponents/contentBlock/ContentBlock";
import { LinkContainer, SimpleButton } from "../../uiComponents/button";
import i18n from "../../i18n";
// import "./login.css";
import LoginBgTwo from "../login/LoginBgTwo";
import OTPInput, { ResendOTP } from 'otp-input-react';
import { postForgotPassword } from "../login/redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { setEmail } from "../login/redux/slice";
import swal from 'sweetalert';
import "./ForgotPasswordOtp.css";




const ForgotPasswordOtp = () => {


  const location = useLocation();
  const email = location?.state?.email;

  const history = useHistory();


  let resend = "Resend SMS in";
  let secondValue = 60;
  let seconds = "00:60 seconds";
  let resendColor = "#060606";
  let secondsColor='#FB384B';

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const [OTP, setOTP] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [disable, setDisable]  = useState(false);

  const [phone, setPhone] = useState("");
  

  useEffect(() => {
    if(OTP.length ===4) {
      const bodyData = {
        email: email,
        otp: OTP
      };
  
      fetch(`${process.env.REACT_APP_BASE_URL}/doctor/forgot/password/otp`, {
        method: "POST",
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify(bodyData)
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if(data.code === 200) {
          setPhone(phone);
          history.push({
            pathname: "/update-password",
            state: {email: email, otp: OTP}
          })
        }
      })
      .catch((err) => {
        // swal("Error!", "The entered OTP is incorrect.", "error");
        setOTP('');
      });
    }
  }, [OTP])

  const renderTime = (remainingTime) => {
    return <span>{remainingTime} </span>;
  };
  
  const renderButton = (buttonProps) => {
    return <button {...buttonProps}>Resend SMS in</button>;
  };


  let inputStyle = {

    height: '120px',

    width: '23%',

    borderRadius: '10px',

    marginRight: '0px'

  };


  if (window.innerWidth < 768) {

    inputStyle = {

      height: '100px',

      width: '23%',

      borderRadius: '10px',

      marginRight: '0px'

    };

  }

  function handleOTPResend() {
    // console.log("resend otp handle");

    // history.push({
    //   pathname: '/otp-2',
    //   state: {uniqueCode: uniqueCode, phone: phone}
    // });
  }
  return (
    <LoginBgTwo>
    <div className="loginWithPhone">
      <Container>
        <Row>
          <Col lg={6} />
          <Col lg={5} >
          <h1 className="thankYou">

              {i18n.t('Enter OTP Code')} 

              </h1>
              <p className=" sms-otp">

                {i18n.t('An OTP code has been sent on the details below')}
              </p>
              <p className=" sms-otp">
                 {i18n.t('Phone Number:')}{' '}

                <strong>030******44</strong>
              </p>
              <p className="pt-1 sms-otp">
               Email:

                <strong> {email && email}</strong>

                </p>

                <div className="opt_box input-cont px-0 py-2">

                    <OTPInput

                              value={OTP}

                              onChange={setOTP}

                              

                              autoFocus

                              OTPLength={4}

                              otpType="number"

                              disabled={false}

                              secure={false}

                              className="otpContainer"

                              inputStyles={inputStyle}

                            />
                  </div>
                  <div className="py-4">

                        <button className="btn-group text-uppercase theme-color-sec" disabled={false} type="submit">

                          Continue

                        </button>
                        {/* <button className="btn-group text-uppercase mt-4" disabled={true} type="submit">

                          Resend OTP in 00:30

                          </button> */}

              <ResendOTP maxTime={60} className='OtpCounting' style={{display: "grid", justifyContent: "center"}} 
                
                renderButton={renderButton}
                renderTime={renderTime} onResendClick={() => {
                  // console.log("Render click");
                  history.push({
                    pathname: '/otp2',
                    state: { phone: phone}
                  });
                }} />

                          <p className="mt-4 sms-otp">

                            {i18n.t('If you do not receive the OTP, please call support')}
                            </p>
                            <p className="pt-2 sms-otp">

                           <strong>+92 21 111 123 123</strong>
                            </p>
                        </div>
                        
          </Col>
          </Row>
        </Container>
      </div>
    </LoginBgTwo> 
  )
}

export default ForgotPasswordOtp