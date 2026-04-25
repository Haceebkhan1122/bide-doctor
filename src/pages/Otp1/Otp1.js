import React, {useState, useEffect} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import OtpOne from '../../uiComponents/OtpOne/OtpOne'
import { Col, Container, Row } from 'react-bootstrap';
import "../../pages/login/Registeration.css";
import LogoBg from '../../assets/images/png/LogoFresh.png';

import OtpImg from '../../assets/images/png/otp-img.png';

import i18n from '../../i18n';

import OTPInput, { ResendOTP } from 'otp-input-react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';

import {useCountdown} from "./Countdown";


const Otp1 = () => {

  const location = useLocation();
  // const otp = location?.state?.otp || '6578';
  // const uniqueCode = location?.state?.uniqueCode || '987548';
  const phone = location?.state?.phone ;

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


  let first3 = phone?.substring(0,3);
  let last2 = phone?.substring(phone?.length - 2);

  let mask = phone?.substring(3, phone?.length - 2).replace(/\d/g,"*");
  mask = `${first3}${mask}${last2}`;


  useEffect(() => {
    // if(OTP.length ===4) {
    //   if(OTP === otp) {
    //     setSuccess("OTP Matched");
    //     setError("");
    //     setDisable(false);
  
    //     history.push({
    //       pathname: '/thank-you',
    //       state: {uniqueCode: uniqueCode}
    //     });
    //   }
  
    //   else {
    //     setError("OTP does not match");
    //     setShow(true);
    //     setDisable(true);
    //     swal("Error!", "The entered OTP is incorrect.", "error");
    //     setOTP('');
  
    //   }
    // }

    if(OTP.length === 4) {
    const bodyData = {
      phone: phone,
      otp: OTP
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/check-otp`, {
      method: "POST",
      headers: {"Content-type": "application/json;charset=UTF-8"},
      body: JSON.stringify(bodyData)
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.code === 200) {
        history.push({
          pathname: "/thank-you",
          state: {uniqueCode: data.data.user.unique_code}
        })
      }
      else {
        swal("Error!", "The entered OTP is incorrect.", "error");
        setOTP('');
      }
    })
    .catch((err) => {
      swal("Error!", "The entered OTP is incorrect.", "error");
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


  const handleButton = () => {
    if (OTP.length < 4) {
      return (

          swal("Fill all boxes!", "", "error")

      )
    } else {

    }
  }

  let inputStyle = {

    height: '100px',

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

    history.push({
      pathname: '/otp-2',
      state: { phone: phone}
    });
  }

  return (

    <div>
      {/* <OtpOne otp={otp} uniqueCode={uniqueCode} resend='Resend SMS in' seconds='00:60 seconds' resendColor='#060606' secondsColor='#FB384B'/> */}
      <section className="otp-screen reg-bg-color">

      <div className="registration-app h-100-vh">

        <Container>

          <img className="pt-4 LogoImage" src={LogoBg} />

          <div className="row align-items-center">

            <Col md={6} className="md-order-2">

              {<img src={OtpImg} className="img-fluid d-md-none" alt="" />}

            </Col>


            {/* {error && (
              <>
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
              </>
            )} */}

            <Col md={5}>

              <div className="content text-center thankyou pt-5">

                <h1 className="thankYou">

                {i18n.t('Confirm your')} <br className="d-none d-lg-block" /> {i18n.t('phone number')}

                </h1>


                <p className=" sms-otp">

                  {i18n.t('An SMS has been sent to the')}{' '}

                  <br className="d-none d-lg-block" /> {i18n.t('following phone number:')}

                  {mask}

                </p>

                <div className="opt_box input-cont">

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



                  {/* <input

                  autoFocus

                    onChange={handleChange}

                    name="ssn-1"

                    maxLength={1}

                    className="opt_input"

                    type="text"

                    autoComplete="off"





                  />


                  <input

                    name="ssn-2"

                    onChange={handleChange}

                    style={{ marginLeft: '10px' }}

                    maxLength={1}

                    className="opt_input"

                    type="text"

                    autoComplete="off"

                  />


                  <input

                    name="ssn-3"

                    onChange={handleChange}

                    style={{ marginLeft: '10px' }}

                    maxLength={1}

                    className="opt_input"

                    type="text"

                    autoComplete="off"

                  />


                  <input

                    name="ssn-4"

                    onChange={handleChange}

                    style={{ marginLeft: '10px' }}

                    maxLength={1}

                    className="opt_input"

                    type="text"

                    autoComplete="off"

                  /> */}

                </div>

                {/* <div className="pt-4">

                  <p style={{ color: resendColor }}>{i18n.t(resend)} </p>


                </div> */}

                <div className="pt-2">
                {/* <div>00:</div> */}
                <ResendOTP maxTime={60} className='OtpCounting verifyOtpConfirm'  
                
                renderButton={renderButton}
                renderTime={renderTime} onResendClick={() => {
                  // console.log("Render click");
                  history.push({
                    pathname: '/otp2',
                    state: { phone: phone}
                  });
                }} />
                  <p className="fw-700 d-flex" style={{ color: secondsColor, justifyContent: 'center' }}>




                  </p>

                </div>

                <div className="py-5">

                  <button onClick={handleButton} className="btn-group text-uppercase" disabled={false} type="submit">

                    Continue

                  </button>

                </div>

              </div>

            </Col>

          </div>

        </Container>

      </div>

    </section>
    </div>

  )

}


export default Otp1
