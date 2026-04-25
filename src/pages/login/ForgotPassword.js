import React, {useState} from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Form, Input } from "antd";
import ContentBlock from "../../uiComponents/contentBlock/ContentBlock";
import { LinkContainer, SimpleButton } from "../../uiComponents/button";
import i18n from "../../i18n";
// import "./login.css";
import LoginBgTwo from "./LoginBgTwo";
import { useHistory } from "react-router-dom";
import { postForgotPassword } from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
//import { setEmail } from "./redux/slice";
// import { setInLocalStorage } from "../../utils/helperFunctions";
// import { authInfo } from "../../layouts/redux/slice";
import "./_login.scss";
import { useFormik } from "formik";
import * as Yup from 'yup'
import axios from "axios";

const ForgotPassword = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');

  const [forgotPaswordError, setForgotPasswordError] = useState('');

  const formik = useFormik({
    initialValues: {

      email: '',
    },
    validationSchema: Yup.object({

      email: Yup.string().email('Invalid email address').required('Email is required'),


    }),
    onSubmit: async (values) => {
      // console.log(values)
    },

    validateOnChange: false,
    validateOnBlur: false
  })

  // const selectUserDetails = useAppSelector(selectUser);

  const onFinish = async (values, qs) => {
    // console.log(values.target);
    // dispatch(postForgotPassword(values, qs));
    // if (selectUserDetails?.data?.user) {
    //   setInLocalStorage("D_USER_ID", selectUserDetails.data.user.id);
    //   dispatch(authInfo(true));
    // }
    // dispatch(setEmail(values.email));
    //history.push('/otp')

    // const {email} = values;

    // console.log(email, 'email');
    // console.log(formik.errors, 'formik'); 

    if(!(formik.errors.email || formik.errors.password)) {
      try {
      

        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/doctor/forgot/password`, {email: email});
        // console.log(res.data, 'api')
        if(res.data.code === 200) {
  
        history.push({
          pathname: "/forgot-password-otp",
          state: {email: email}
        })
      }

      else if(res.data?.response?.data?.message) {
        setForgotPasswordError(res.data?.response?.data?.message);

        // console.log(forgotPaswordError);
      }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data.message);
        setForgotPasswordError(error?.response?.data?.message);

        // console.log(formik.errors, 'formike');
  
      }
    }
  };

  return (
    <LoginBgTwo>
      <div className="loginWithPhone">
        <Container>
          <Row>
            <Col lg={6} />
            <Col lg={6}>
              <div className="content">
                <Row>
                  <Col lg={8}>
                    <ContentBlock
                      heading={i18n.t("forgot_password")}
                      body={i18n.t("enter_email_forgot")}
                    />
                    <Form layout="vertical" onFinish={onFinish} onChange={(e) => setEmail(e.target.value)}>
                      <Form.Item

                        name="email"
                        label={i18n.t("email_address")}
                        
                        
                      >
                        <Input type="text"
                         className="c_input email_field"
                        
                         name="email"
                         onBlur={formik.handleBlur}
                         value={formik.values.email}
                         required={false}
                         error={formik.touched.email && Boolean(formik.errors.email) || forgotPaswordError }
                         onChange={formik.handleChange}
                         autoFocus
                         />
                          {formik.errors.email && (
                  <small
                    id='username2-help'
                    className='p-error'
                    style={{
                      display: 'block',
                      padding: '10px 0 0 3px',
                      color: 'red',
                      // textAlign: 'center',
                      textAlign: 'left',
                    }}
                  >
                    {formik.errors.email}
                  </small>
                )}

                {forgotPaswordError && (
                  <small
                  id='username2-help'
                  className='p-error'
                  style={{
                    display: 'block',
                    padding: '10px 0 0 3px',
                    color: 'red',
                    // textAlign: 'center',
                    textAlign: 'left',
                  }}
                >
                  {forgotPaswordError}
                </small>
                )}

               

                      </Form.Item>
                      <SimpleButton
                        type="submit"
                        text={i18n.t("continue")}
                        // to="/otp"
                      />
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LoginBgTwo>
  );
};

export default ForgotPassword;
