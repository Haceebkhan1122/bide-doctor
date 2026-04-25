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
import Logo from "../../assets/images/svg/meri-sehat-logo.svg";
import { setDefaultNamespace } from "i18next";
import { useEffectOnce } from "react-use";
import API from "../../utils/customAxios";
import loadingGif from "../../assets/images/gif/loader_gif.gif";
import { toast } from "react-toastify";
import encryptStorage from "../../utils/encryptStorage";
// import Select from "@mui/material/Select";
import { Form, Input, Select } from "antd";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Chip, InputLabel } from "@mui/material";
import { useForm } from "antd/lib/form/Form";
import arrowIcon from "../../assets/images/svg/arrowIcon.svg";
import Cookies from "js-cookie";

const SignupDetails = () => {
  const history = useHistory();

  const [name, setName] = useState("");
  const [city, setCity] = useState(null);
  const [email, setEmail] = useState("");
  const [pmc, setPmc] = useState("");
  const [specialities, setSpecialities] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [cities, setCities] = useState(null);
  const [mobile, setMobile] = useState("");
  // const [speciality, setSpeciality] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formErrors, setFormErrors] = useState({
    nameError: "",
    cityError: "",
    pmcError: "",
    specialityError: "",
    emailError: "",
  });
  const [speciality, setSpeciality] = React.useState([]);

  const { Option } = Select;
  const [form] = useForm();


  const handleChange = (value) => {
    setSpeciality(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };


  let footerBaseUrl = process.env.REACT_APP_FOOTER_BASE_URL;


  const navigateToLogin = () => {
    // Cookies.remove('token')
    window.location.href = '/login'
  }


  useEffectOnce(() => {
    let loadSuccessFlag;
    let loadSuccessFlag2;

    (async () => {
      setApiLoading(true);

      let phone = encryptStorage.getItem("signupPhone");
      phone = `0${phone}`;

      setMobile(phone);

      const response = await API.get("/specialities");

      if (response?.data?.code === 200) {
        let data = [];

        data.push(response?.data?.data?.specialities);

        setSpecialities(data);
        loadSuccessFlag = true;
      } else {
        loadSuccessFlag = true;
        setApiError(true);
      }

      const cityResponse = await API.get("/cities");

      if (cityResponse?.data?.code === 200) {
        let data = [];

        data.push(cityResponse?.data?.data);

        setCities(data);
        loadSuccessFlag2 = true;
      } else {
        setApiError(true);
      }

      if (loadSuccessFlag && loadSuccessFlag2) {
        setApiLoading(false);
      }
    })();
  });

  const signupWait = (e) => {
    e.preventDefault();
    history.push("/please-wait");
  };

  const emailValidate = (e) => {
    const emailValue = e.target.value;
    const emailRegex = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/gm;

    if (emailValue === "") {
      setEmail('');
      setEmailError("");
    }
    else if (!emailRegex.test(emailValue)) {
      setEmail(emailValue);
      setEmailError("Email should be valid");
      // Handle the invalid email address
    }
    else {
      setEmailError("");
      setEmail(emailValue);
      // Handle the valid email address
    }
  };


  async function handleSubmit(e) {
    // e?.preventDefault();
    setFormErrors({});

    const otp = encryptStorage.getItem("otp");

    let errors = {};

    if (!name) {
      errors = { ...errors, nameError: "Required" };
    }

    if (!email) {
      errors = { ...errors, emailError: "Required  " };
    }
    if (!pmc) {
      errors = { ...errors, pmcError: "Required" };
    }

    if (!city) {
      errors = { ...errors, cityError: "Required" };
    }

    if (speciality?.length === 0) {
      errors = { ...errors, specialityError: "Required" };
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      let data = {
        name,
        speciality: speciality?.map((item) => item),
        city,
        pmc_number: pmc,
        phone: mobile,
        otp,
        email,
      };

      try {
        setSignupLoading(true);
        const response = await API.post("/doctor/registration-full", data);

        // console.log(response, 'response');

        if (response?.data?.code === 200) {
          setSignupLoading(false);

          encryptStorage.setItem(
            "unique_code",
            response?.data?.data?.unique_code
          );

          history.replace("/thanks-availability");
        } else {
          setSignupLoading(false);
          setSignupError(response?.data?.message || "Something went wrong");
        }
      } catch (error) {
        setSignupLoading(false);
        setSignupError(error?.response?.data?.message || error?.message);
      }
    }
  }

  // console.log({cities});
  console.log({ email })

  return (
    <>
      <StyledLoginOtp className="signupDetails">
        {apiLoading || apiError ? (
          <div className="loaderWrapper container">
            <img src={loadingGif} alt="" />
          </div>
        ) : (
          <>
            <div className="header_meriSehat bg-white d-none d-lg-block">
              <Container fluid>
                <Row>
                  <Col md={12}>
                    <div className="logo_only">
                      {/* <Link to="/"> */}
                      <img src={Logo} alt="Logo" />
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

              <Row className="hk_for_center">
                <Col md={6} className="d-none d-md-block">
                  <div className="image-below">
                    <img className="img-fluid" src={LoginAunty} />
                  </div>
                </Col>
                <Col md={5} className="offset-md-1">
                  <div className="white-form my-3 detailssForm">
                    <div className="p-4">
                      <h4 className="detailsFormm mb-2">
                        Please provide your professional details:
                      </h4>
                      <Form
                        className="form"
                        autoComplete="off"
                        onFinish={handleSubmit}
                        form={form}
                      >
                        <div className="formHead">
                          <h2 className="labelHead">Full Name*</h2>
                          <input
                            placeholder="Enter full name"
                            className="detail-form detailFormfield"
                            value={name}
                            onChange={(e) => {
                              const inputName = e.target.value;
                              const regex = /^[A-Za-z ]+$/; // Regular expression for alphabets only
                              if (inputName === '' || regex.test(inputName)) {
                                setName(inputName)

                              }
                            }
                            }


                          />
                          {formErrors?.nameError && (
                            <p className="errorRequired">
                              {" "}
                              {formErrors?.nameError}{" "}
                            </p>
                          )}
                        </div>
                        <div className="formHead" >
                          <h2 className="labelHead" >Mobile Number*</h2>
                          <input
                            value={mobile}
                            className="detail-form detailFormfield"
                            disabled
                          />
                        </div>

                        <div className="formHead emailNewInput" >
                          <h2 className="labelHead">Email Address*</h2>
                          <Form.Item
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                            rules={[
                              { type: 'email', message: 'Invalid email format' }
                            ]}
                          >
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              value={email}
                            />

                          </Form.Item>
                          {/* <input
                            type="email"
                            placeholder="Enter email address"
                            className="detail-form detailFormfield"
                            value={email}
                            onChange={emailValidate}
                          /> */}
                          {/* {emailError ? (
                                 <p className="errorRequired">
                                 {" "}
                                 {emailError}{" "}
                               </p>
                          ) : null} */}
                          {formErrors?.emailError ? (
                            <p className="errorRequired">
                              {" "}
                              {formErrors?.emailError}{" "}
                            </p>
                          ) : signupError && <p className="red-error"> {signupError} </p>}
                          {/* {signupError && <p className="red-error"> {signupError} </p>} */}
                        </div>

                        <div className="formHead" >
                          <h2 className="labelHead" >Medical Speciality*</h2>
                          <Form.Item
                            name="Medical Speciality*"
                            className="selectSpeciality"
                          >
                            <Select
                              className="placeholder-left"
                              // filterOption={(input, option) =>
                              //   option.props.children.toLowerCase().startsWith(input.toLowerCase())
                              // }

                              suffixIcon={
                                <img src={arrowIcon} alt='Dropdown' />
                              }
                              showArrow
                              placeholder="Select your area of medical specialty"
                              mode="multiple"
                              value={speciality}
                              label="name"
                              allowClear
                              onChange={value => handleChange(value)}
                              showSearch={true}
                              optionFilterProp="children"
                              filterOption={(input, option) => {
                                return option.children?.toString().toLowerCase().startsWith(input.toLowerCase())
                              }}
                              style={{ width: "100%" }}
                              MenuProps={{
                                // getContentAnchorEl: null,
                                // anchorOrigin: {
                                //   vertical: "bottom",
                                //   horizontal: "left",
                                // },
                                MenuListProps: {
                                  style: {
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                  },
                                },
                              }}
                            >
                              {specialities?.[0]?.map((spec, index) => (
                                <Option key={index} value={spec?.id}>
                                  {spec?.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>

                          {formErrors?.specialityError && (
                            <p className="errorRequired">
                              {" "}
                              {formErrors?.specialityError}{" "}
                            </p>
                          )}
                        </div>
                        <div className="order-reverse-mobile">
                          <div className="formHead row pmdc-number-last">
                            <Col md={12}>
                              <h2 className="labelHead">
                                PMDC Number{" "}
                                <span className="ms-1 ms-1 d-none d-lg-block ">
                                  (Not mandatory for certain specialities)
                                </span>
                                <span className="d-lg-none">*</span>
                              </h2>
                              <input
                                placeholder="Enter PMDC number"
                                className="detail-form detailFormfield"
                                value={pmc}
                                onChange={(e) => {
                                  const inputNumber = e.target.value;
                                  const regex = /^[A-Za-z0-9]{0,7}$/; // Regular expression to match up to 7 digits
                                  if (inputNumber === '' || regex.test(inputNumber)) {
                                    setPmc(inputNumber);
                                  }
                                }}
                              />
                              {formErrors?.pmcError && (
                                <p className="errorRequired">
                                  {" "}
                                  {formErrors?.pmcError}{" "}
                                </p>
                              )}
                            </Col>
                          </div>

                          <div className="formHead" >
                            <h2 className="labelHead" >City*</h2>
                            <Form.Item
                              name="city"
                              className="selectSpeciality citySelectSpe"
                            >
                              <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {

                                  return option.props.children?.[1].toString().toLowerCase().startsWith(input.toLowerCase())
                                }

                                }
                                suffixIcon={
                                  <img src={arrowIcon} alt='Dropdown' />
                                }
                                showArrow
                                placeholder="Select city"
                                value={city}
                                // label="name"
                                onChange={(e) => setCity(e)}
                                style={{ width: "100%" }}
                                MenuProps={{

                                  MenuListProps: {
                                    style: {
                                      maxHeight: "500px",
                                      overflowY: "auto",
                                    },
                                  },
                                }}
                              >
                                {cities?.[0]?.map((city, index) => (
                                  <Option key={index} value={city?.name}>
                                    {" "}
                                    {city?.name}{" "}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>

                            {formErrors?.cityError && (
                              <p className="errorRequired">
                                {" "}
                                {formErrors?.cityError}{" "}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* <div className="formHead selectParent row">
                          <Col md={12}>
                            <h2 className="labelHead" >City*</h2>
                            <select
                              placeholder="Select your city"
                              className="details-select detailFormfield"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            >
                              <option
                                className="details-select-option"
                                disabled
                                selected
                                hidden
                              >
                                {" "}
                                Select city{" "}
                              </option>
                              {cities?.[0]?.map((city, index) => (
                                <option key={index} value={city?.name}>
                                  {" "}
                                  {city?.name}{" "}
                                </option>
                              ))}
                            </select>
                            {formErrors?.cityError && (
                              <p className="errorRequired">
                                {" "}
                                {formErrors?.cityError}{" "}
                              </p>
                            )}
                          </Col>
                        </div> */}

                        <div className="Otp-continue-btn w-100">
                          <button
                            type="submit"
                            disabled={signupLoading}
                            className="review-button text-uppercase signupDetails-phone-btn position-relative mt-2"
                          >
                            Continue
                            <span
                              className="signupDetails-phone-chevron"
                              style={{ height: "46px" }}
                            >
                              <FiChevronRight />
                            </span>
                          </button>

                        </div>

                        <div className="description-details col-md-8 m-auto mt-3">
                          <p className="termsParaa terms-privacy">
                            By creating an account, you agree with our{" "}
                            <a target="_blank" href={`${footerBaseUrl}/page/terms-conditions`} className="termsConditions" > Terms & Conditions </a>and
                            <a target="_blank" href={`${footerBaseUrl}/page/privacy-policy`} className="termsConditions" > Privacy Statement </a>
                          </p>
                          <p className="alreadyAccountPara mt-2">
                            Already have an account?{" "}
                            <a onClick={navigateToLogin} style={{ color: '#19B3B5' }} className="fw-700">
                              Login
                            </a>{" "}
                            here.
                          </p>
                        </div>
                      </Form >
                    </div >
                  </div >
                </Col >
              </Row >
            </Container >
          </>
        )}
      </StyledLoginOtp >
    </>
  );
};

export const StyledLoginOtp = styled.section`
  .white-form {
    background: #ffffff;
    box-shadow: 0px 0px 16px rgba(25, 179, 181, 0.15);
    border-radius: 11.2px;

    .selectSpeciality{
      .anticon svg {
          fill: #313131;
}
    }

    .detail-form {
      width: 100%;
      margin-top: 5px;
      margin-bottom: 5px;
      border: 0.5px solid #959494;
      border-radius: 10px;
      padding: 10px;
      height: 38px;
    }

    .details-select {
      width: 100%;
      margin-top: 5px;
      margin-bottom: 5px;
      border: 0.5px solid #959494;
      border-radius: 10px;
      padding: 5px 10px;
      height: 38px;
    }

    h2 {
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 300;
      font-size: 16px;
      line-height: 23px;
      display: flex;
      align-items: center;
      color: #313131;
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 17px;
      /* identical to box height */

      display: flex;
      align-items: center;

      color: #313131;
    }
  }

  .description-details {
    margin: 15px 0;
    p {
      font-family: 'Circular Std';
      font-style: normal;
      font-weight: 300;
      font-size: 11px;
      line-height: 140%;

      text-align: center;
      letter-spacing: 0.01em;
      color: #404040;
  }
    }
    a {
      color: #e9406a;
    }
  

  .image-below {
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .signupDetails-phone-btn {
    border-radius: 12px;
    background-color: #19b3b5;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    padding: 0;
    width: 100%;

    .signupDetails-phone-chevron {
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
  .alreadyAccountPara{
    font-family: 'Circular Std';
    font-style: normal;
    font-weight: 300;
    font-size: 13px;
    line-height: 140%;

    text-align: center;
    letter-spacing: 0.01em;
    
    color: #404040;
  }
`

export default SignupDetails;
