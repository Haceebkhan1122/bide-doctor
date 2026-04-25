import React, { useState } from 'react';
import OTPInput, { ResendOTP } from 'otp-input-react';
import { Col, Container, Row } from 'react-bootstrap';
import { Form } from "antd";
import ContentBlock from '../../uiComponents/contentBlock/ContentBlock';
import { LinkContainer, SimpleButton } from '../../uiComponents/button';
import LoginBgTwo from './LoginBgTwo';
import i18n from '../../i18n';
import { useHistory } from "react-router-dom";
import { postForgotPasswordOTP } from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectEmail } from "./redux/slice";
import "./_login.scss";

function OtpWhenLoggingIn() {
  const history = useHistory();

  const [OTP, setOTP] = useState('');

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

  const otpButton = (buttonProps) => (
    <button type="button" {...buttonProps} className="simple_btn otp_btn">
      RESEND OTP IN 0: {buttonProps.remainingTime}
    </button>
  );
  const renderTime = () => React.Fragment;

  const dispatch = useAppDispatch();

  const selectUserEmail = useAppSelector(selectEmail);
  // console.log(selectUserEmail)

  const onContinue = (values) => {
    // console.log(OTP)
    const payload = {
      otp: OTP,
      email: selectUserEmail
    }
    // dispatch(postForgotPasswordOTP(payload));

    history.push('/update-password')
  };

  return (
    <LoginBgTwo>
      <div className="otpWhenLoggingIn">
        <Container>
          <Row>
            <Col lg={6} />
            <Col lg={6}>
              <div className="content">
                <Row>
                  <Col lg={12}>
                    <div className="content_container">
                      <ContentBlock
                        heading={i18n.t('enter_otp_code')}
                        body={i18n.t('otp_code_sent_details')}
                      />
                      <div className="mt-3">
                        <p className="phoneNumber">
                          {i18n.t('phone_number')}: <b>+92 334 3* **09</b>
                        </p>
                        <p className="email mt-2">
                          {i18n.t('email')}: <b>tah********@gmail.com</b>
                        </p>
                      </div>
                      <Form layout="vertical" onFinish={onContinue}>
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
                        <div className="btns_container">
                          <SimpleButton
                            // to="/update-password"
                            type="submit"
                            text={i18n.t('continue')}
                          />
                        </div>
                        {/* <ResendOTP
                          maxTime={10}
                          renderButton={otpButton}
                          renderTime={renderTime}
                        /> */}
                        <div className="btns_container">
                          <SimpleButton
                            // to="/update-password"
                            text="REMAINING TIME"
                          />
                        </div>
                        <div className="mt-3">
                          <p className="supportCall">
                            {i18n.t('dont_receive_otp_please_call_support')}
                          </p>
                          <p className="supportCall mt-2">
                            <b>+92 21 111 123 123</b>
                          </p>
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LoginBgTwo>
  );
}

export default OtpWhenLoggingIn;
