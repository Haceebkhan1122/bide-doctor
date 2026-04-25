import React, {useState, useEffect} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import OtpOne from '../../uiComponents/OtpOne/OtpOne'
import LogoBg from '../../assets/images/png/LogoFresh.png';
import OtpImg from '../../assets/images/png/otp-img.png';
import i18n from '../../i18n';
import OTPInput, { ResendOTP } from 'otp-input-react';
import { Col, Container, Row } from 'react-bootstrap';
import "../../pages/login/Registeration.css";

const Otp2 = () => {

  const location = useLocation();
  const history = useHistory();

  const [OTP, setOTP] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

 // const uniqueCode = location?.state?.uniqueCode || '987548';
  const phone = location.state.phone ;

  // console.log(phone);

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

  let resend = "Resend sms";
  let resendColor = "#FB384B";
  let seconds = "00:60 seconds";
  let secondsColor='#FB384B';

  let bodyData = {
    phone: phone,
    otp: OTP
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/resend-otp`, {
      method: "POST",
      headers: {"Content-type": "application/json;charset=UTF-8"},
      body: JSON.stringify(bodyData)
    })
    .then((res)=> res.json())
    .then((data)=> {
      if(OTP.length ===4 && data.code === 200) {
        // console.log("Calling Check-OTP");
        fetch(`${process.env.REACT_APP_BASE_URL}/check-otp`, {
          method: "POST",
          headers: {"Content-type": "application/json;charset=UTF-8"},
          body: JSON.stringify(bodyData)
        })
        .then((res) => res.json())
        .then((data) => {
          if(data.status === true) {
            history.push({
              pathname: "/thank-you",
              state: {uniqueCode: data.data.user.unique_code}
            })
          }
        })
        .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.log(err));
  }, [OTP])

  const renderTime = (remainingTime) => {
    return <span>{remainingTime} </span>;
  };
  
  const renderButton = (buttonProps) => {
    return <button {...buttonProps}>Resend SMS in</button>;
  };
  

  return (

    // <div><OtpOne resend='Resend sms' resendColor='#FB384B'/></div>

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

              {/* <div className="pt-4">

                <p style={{ color: resendColor }}>{i18n.t(resend)} </p>


              </div> */}

              <div className="pt-2">
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

              <button className="btn-group text-uppercase" disabled={false} type="submit">

Continue

</button>

              </div>

            </div>

          </Col>

        </div>

      </Container>

    </div>

  </section>

  )

}


export default Otp2
