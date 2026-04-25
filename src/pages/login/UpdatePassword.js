import React, {useState} from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Form, Input } from "antd";
import ContentBlock from "../../uiComponents/contentBlock/ContentBlock";
import { LinkContainer, SimpleButton } from "../../uiComponents/button";
import i18n from "../../i18n";
// import "./login.css";
import LoginBgTwo from "./LoginBgTwo";
 import { useHistory, useLocation } from "react-router-dom";
import { postPasswordReset } from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectEmail } from "./redux/slice";
import "./_login.scss";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from 'yup'


const UpdatePassword = () => {
  const history = useHistory();

  
  const location = useLocation();
  const email = location?.state?.email;
  const otp = location?.state?.otp;



const formik = useFormik({
  initialValues: {

    password : '',
    changepassword: ''





  },
  validationSchema: Yup.object({

    changepassword: Yup.string().when("password", {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Both password need to be the same"
      ).required('Required')
    }),
    password: Yup.string().required('Required'),






  }),
  onSubmit: async (values) => {
    // console.log(values)
  },
})


  const dispatch = useAppDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const selectUserEmail = useAppSelector(selectEmail);

  const bodyData = {
    email,
    password: formik.values.password
  };

  const onContinue = (values) => {
    // console.log(formik.values);
    // console.log("ON CONTINUE");
    // const password = values.password_confirm;
    // const payload = {
    //   password,
    //   email: selectUserEmail
    // }
    // dispatch(postPasswordReset(payload));

    // console.log(password, confirmPassword);

    const bodyData = {
      email,
      password: formik.values.password,
      otp
    };

    if(password == confirmPassword) {
      fetch(`${process.env.REACT_APP_BASE_URL}/doctor/password/reset`, {
        method: "POST",
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify(bodyData)
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.code === 200) {
        swal("Success!", "Password Reset Successfully", "success")
          .then((value) => {
            history.push("/login");
          })
        }
        else {
          swal("Error", "Your password could not be changed", "error");
        }  
      })
      .catch((err) => {
        swal("Error!", err.message, "error");
      });
    }
    else {
      swal("Error!", "Your password and confirm password do not match", "error");
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
                    <Form layout="vertical" onFinish={onContinue}>
                    <Form.Item

                        name="password"
                        label={i18n.t("new_password")}
                      >
                        <Input type="password" className="c_input"

                                       onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.password}
                                      id="outlined-basic"
                                      label={i18n.t("Enter new password")}
                                      required
                                      name="password"
                        />
                          {formik.errors.password && (
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
                    {formik.errors.password}
                  </small>
                )}
                      </Form.Item>
                      <Form.Item

                        name="password_confirm"
                        label={i18n.t("confirm_password")}
                      >
                        <Input type="password" className="c_input"

                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.changepassword}
                        id="outlined-basic"
                        label={i18n.t("Confirm new password")}
                        required
                        name="changepassword"
          />
            {formik.errors.changepassword && (
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
      {formik.errors.changepassword}
    </small>
  )}



                      </Form.Item>
                      <SimpleButton
                        type="submit"
                        text={i18n.t("continue")}
                        // to="/login"
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

export default UpdatePassword;
