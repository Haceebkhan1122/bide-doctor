import React, { useState } from 'react';
import "../../pages/login/Registeration.css";


import { Col, Container, Row } from 'react-bootstrap';

import LogoBg from '../../assets/images/png/LogoFresh.png';

import OtpImg from '../../assets/images/png/otp-img.png';

import i18n from '../../i18n';

import OTPInput, { ResendOTP } from 'otp-input-react';
import { useHistory } from 'react-router-dom';




// const useSSNFields = () => {

//   const [ssnValues, setValue] = React.useState({

//     ssn1: '',

//     ssn2: '',

//     ssn3: '',

//     ssn4: ''

//   });


  // return {

  //   handleChange: (e) => {

  //     const { maxLength, value, name } = e.target;

  //     const [fieldName, fieldIndex] = name.split('-');


  //     // Check if they hit the max character length

  //     if (value.length >= maxLength) {

  //       // Check if it's not the last input field

  //       if (parseInt(fieldIndex, 10) < 4) {

  //         // Get the next input field

  //         const nextSibling = document.querySelector(

  //           `input[name=ssn-${parseInt(fieldIndex, 10) + 1}]`

  //         );


  //         // If found, focus the next field

  //         if (nextSibling !== null) {

  //           nextSibling.focus();

  //         }

  //       }

  //     }




//       setValue({

//         ...value,

//         [`ssn${fieldIndex}`]: value

//       });

//     }

//   };

// };




const OtpOne = ({ resend, seconds, resendColor, secondsColor, otp, uniqueCode }) => {


  // const { handleChange } = useSSNFields();

  const history = useHistory();

  const [OTP, setOTP] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if(OTP.length ===4) {
    if(OTP === otp) {
      setSuccess("OTP Matched");
      setError("");

      history.push({
        pathname: '/thank-you',
        state: {uniqueCode: uniqueCode}
      });
    }

    else {
      setError("OTP does not match");
      setSuccess("");

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




  return (



    <section className="otp-screen reg-bg-color">

      <div className="registration-app h-100-vh">

        <Container>

          <img className="pt-4 LogoImage" src={LogoBg} />

          <div className="row align-items-center">

            <Col md={6} className="md-order-2">

              {<img src={OtpImg} className="img-fluid d-md-none" alt="" />}

            </Col>


            {error && (
              <div className="alert alert-primary" role="alert">
              {error}
            </div>
            )}

            <Col md={5}>

              <div className="content text-center thankyou pt-5">

                <h1 className="thankYou">

                {i18n.t('Confirm your')} <br className="d-none d-lg-block" /> {i18n.t('phone number')}

                </h1>


                <p className=" sms-otp">

                  {i18n.t('An SMS has been sent to the')}{' '}

                  <br className="d-none d-lg-block" /> {i18n.t('following phone number:')}

                  030******44

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

                <div className="pt-4">

                  <p style={{ color: resendColor }}>{i18n.t(resend)} </p>


                </div>

                <div className="pt-2">


                  <p className="fw-700" style={{ color: secondsColor }}>

                    {i18n.t(seconds)}

                  </p>

                </div>

                <div className="py-5">

                  <button className="btn-group text-uppercase" type="submit">

                    Continue

                  </button>

                </div>

              </div>

            </Col>

          </div>

        </Container>

      </div>

    </section>

  );

};


export default OtpOne;


