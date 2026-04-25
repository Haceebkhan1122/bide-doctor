import React, { useState, useEffect } from "react";

import { Col, Row } from "react-bootstrap";

import "primereact/resources/themes/lara-light-indigo/theme.css";

import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";

import "react-phone-input-2/lib/style.css";

import ReactPhoneInput from "react-phone-input-2";

import { TabList, TabPanel, TabContext } from "@mui/lab";

import Tab from "@mui/material/Tab";
// import { MultiSelect } from "react-multi-select-component";

import i18n from "../../i18n";
// import Select, { SelectChangeEvent } from '@mui/material/Select';

import LogoBg from "../../assets/images/png/LogoFresh.png";

import circle1 from "../../assets/images/svg/circle1.svg";

import circle2 from "../../assets/images/svg/revisedCircle.svg";

import circle3 from "../../assets/images/svg/circle3.svg";

import "./Registeration.css";


import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import axios from "axios"
import './Registeration.css';

import { useHistory, Link, Redirect } from "react-router-dom";
import { postLoginDetails } from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectUser, selectEmail } from "./redux/slice";
import {
  asynchronouslyGetFromLocal,
  asynchronouslySetInLocal,
  setInLocalStorage,
} from "../../utils/helperFunctions";
import { isUserLogin, SelectAuth, setLogin } from "../../layouts/redux/slice";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useFormik, ErrorMessage, Field } from "formik";
import * as Yup from 'yup'
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FiX } from "react-icons/fi";
import { FaRegWindowClose } from "react-icons/fa";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { validateEmail } from "../../helpers/utilityHelper";
import classNames from "classnames";
import loadingGif from "../../assets/images/gif/loader_gif.gif";






// import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const CityProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};



function getStyles(name, personName, theme, city, cityName) {
  return {
    fontWeight:
      personName?.indexOf(name, city) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}




const Login = () => {


  const [select, setSelect] = useState("SE");
  const onSelect = (code) => setSelect(code);
  const [value, setValue] = React.useState("2");
  const [agree, setAgree] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  // const [registerPassword, setRegisterPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pmcNumber, setPmcNumber] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [city, setCity] = useState('');
  const [data, setData] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [error, setError] = useState('');
  const [regError, setRegError] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [personName, setPersonName] = React.useState([]);
  const [cityName, setCityName] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [specialityError, setSpecialityError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [cityError, setCityError] = useState('');
  const [pmcError, setPmcError] = useState('');
  const [regEmailError, setRegEmailError] = useState('');

  // const [error, setError] = useState("");
  function handlePhoneChange(value) {
    if (value) {
      setPhone(value)
    }
  }

  const theme = useTheme();



  const handleInput = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    formikSignup.handleChange();
  };

  function validatePhone(value) {
    let error;
    if (value?.length < 11 || value?.length > 15) {
      error = 'Phone Number is in an incorrect format.';
    }
    return error;
  }




  const handleCity = (event) => {
    const {
      target: { value }
    } = event;
    setCityName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };


  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/cities`, {
      headers: {
        'user-id': '0'
      }
    }, { mode: 'no-cors' })
      .then((response) => response.json())
      .then((data) => setData(data.data))
      .catch((err) => console.error(err));

    //  console.log(data)

    fetch(`${process.env.REACT_APP_BASE_URL}/specialities`, {
      headers: {
        'user-id': '0'
      }
    }, { mode: 'no-cors' })
      .then((response) => response.json())
      .then((data) => setSpecialities(data.data?.specialities))
      .catch((err) => console.error(err));

    // console.log(data)

  }, []);

  const handleChange = (event, newValue) => {
    // console.log('event' , event , 'newValue' , newValue);
    setValue(newValue);
  };



  const handleClick = () => {
    // 👇️ toggle

    setIsActive((current) => !current);

    // 👇️ or set to true

    // setIsActive(true);
  };

  const checkboxHandler = () => {
    // if agree === true, it will be set to false

    // if agree === false, it will be set to true

    setAgree(!agree);

    // Don't miss the exclamation mark
  };

  const btnHandler = () => {
    alert("The buttion is clickable!");
  };





  const history = useHistory();
  const dispatch = useAppDispatch();

  const selectUserDetails = useAppSelector(selectUser);
  const selectUserEmail = useAppSelector(selectEmail);


  useEffect(() => {
    if (selectUserDetails?.data?.user) {
      setUser();
    }
  }, [selectUserDetails]);

  const setUser = async () => {
    toast.success(selectUserDetails?.message);
    await asynchronouslySetInLocal(
      "D_USER_ID",
      selectUserDetails?.data?.user?.id
    );
    const token = await asynchronouslyGetFromLocal("D_USER_ID");
    dispatch(SelectAuth(token));
  };

  function resetSignupErrors() {
    setTimeout(() => {
      setNameError('');
      setPhoneError('');
      setCityError('');
      setSpecialityError('');
      setPmcError('');
      setRegEmailError('');
    }, 3000);
  }

  const onRegister = async (e) => {
    e.preventDefault();

    let formData = new FormData();



    let newPhone = '';
    newPhone = phone.replace(/\s/g, '');
    newPhone = newPhone.replace(/-/g, '');
    newPhone = newPhone.replace(/\+92/g, "0");

    if (name.trim().length <= 0) {
      setNameError("The name field is required.");
    }

    if (registerEmail.trim().length <= 0) {
      setRegEmailError("The email field is required.");
    }

    if (registerEmail.trim().length > 0 && validateEmail(registerEmail) === false) {
      setRegEmailError("Email must be in a valid format.");
    }

    if (pmcNumber.trim().length <= 0) {
      setPmcError("PMC Number is required.");
    }

    if (pmcNumber.trim().length > 7) {
      setPmcError("PMC Number can't contain more than 7 characters");
    }

    if (phone.trim().length <= 0) {
      setPhoneError("Phone is required.");
    }

    if ((phone.trim().length > 0 && phone.trim().length < 16) || phone.trim().length > 16) {
      // console.log(phone.trim().length, 'phonetrim');
      setPhoneError("Phone Number is in invalid format");
    }

    if (personName.length <= 0) {
      setSpecialityError("You must select at least one speciality.");
    }

    if (cityName.length <= 0) {
      setCityError("City Name is required.");
    }

    if (phoneError == '' && pmcError == '' && regEmailError == '' && nameError == '' && specialityError == '' && cityError == '') {
      formData.append('name', name);
      formData.append('phone', newPhone);
      formData.append('email', registerEmail);
      formData.append('pmc_number', pmcNumber);
      formData.append('speciality[]', personName.join(","));
      formData.append('city', cityName[0]);

      // console.log(phone)

      if (agree) {


        try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/doctor/registration-short`, formData);

          if (res.message) {
            setError(res.message);
            setRegistrationError(false);
          }

          else {

            history.push({
              pathname: '/otp1',
              state: { phone: newPhone }
            });
          }


        } catch (error) {
          // console.log(error.response)
          setRegError(error.response.data.message);
          setRegistrationError(true);
        }
      }
      else {
        swal("Error", "You need to agree to our terms and conditions in order to register to this site.", "error");
      }

    }



  }

  const formik = useFormik({


    initialValues: {

      email: '',
      password: '',





    },
    validationSchema: Yup.object({
      //
      email: Yup.string().email('Invalid email address').required('Required'),
      // emailSignUp: Yup.string().email('Invalid email address').required('Required'),

      password: Yup.string().required('Required'),
      // phone: Yup.string().min(11).max(16).required(),
      //  name: Yup.string().required('Required'),
      //  pmc_number: Yup.string().required('Required'),
      //  specialities: Yup.string().required('Required'),
      //  cityname: Yup.string().required('Required'),






    }),
    onSubmit: async (values) => {

      // console.log("test");
      // console.log(values);

      if (!(formik.errors.email || formik.errors.password)) {
        // console.log(formik.errors.email)
        await dispatch(postLoginDetails(values)).then((data) => {
          if (data?.payload?.code === 200) {
            toast.success(data?.payload?.message);
          }

          else {
            setError("Invalid Credentials..");
            setLoginError(true);
            //  console.log(loginError)



            //  {(formik.errors.email || loginError) ? console.log("Condition true") : console.log("condition false")}
          }
        })
          .catch((err) => {
            setError("Invalid Credentials..");
            setLoginError(true);
            // console.log(loginError)
          })
      }

    },


    // validateOnChange: false
    validateOnBlur: false,
    validateOnChange: false

  })

  const formikSignup = useFormik({


    initialValues: {

      emailSignUp: '',
      phone: '',
      name: '',
      specialities: personName,
      cityname: '',
      pmc_number: ''




    },
    validationSchema: Yup.object({
      //
      emailSignUp: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.string().min(11).max(16).required(),
      name: Yup.string().required('Name is Required'),
      pmc_number: Yup.string().required('PMC Number is Required'),
      //  specialities: Yup.string().required('Speciality is required'),
      cityname: Yup.string().required('City Name is Required'),

    }),


    onSubmit: async (values) => {
      let formData = new FormData();

      if (personName.length <= 0) {
        setSpecialityError('Please select a medical speciality');
        return;
      }

      if (phone.length < 15) {
        setPhoneError("Please enter your phone number in correct format");
        return;
      }
      let newPhone = '';
      newPhone = phone.replace(/\s/g, '');
      newPhone = newPhone.replace(/-/g, '');
      newPhone = newPhone.replace(/\+92/g, "0")


      formData.append('name', name);
      formData.append('phone', newPhone);
      formData.append('email', registerEmail);
      formData.append('pmc_number', pmcNumber);
      formData.append('speciality[]', personName.join(","));
      formData.append('city', values.cityname.target.value);

      // console.log(formik.errors, 'formik.errors')



      // console.log(phone)

      if (agree) {

        try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/doctor/registration-short`, formData);
          resetSignupError();

          if (res.data.code !== 200) {
            setRegError(res.message);
            setRegistrationError(false);

            resetSignupError();
          }

          else {

            history.push({
              pathname: '/otp1',
              state: { phone: newPhone }
            });
          }


        } catch (error) {
          // console.log(error.response)
          setRegError(error.response.data.message);
          setRegistrationError(true);
        }
      }
      else {
        swal("Error!", "You need to agree to our terms and conditions", "error");
      }




    },
    validateOnChange: false,
    validateOnBlur: false,
  })

  function resetSignupError() {
    setTimeout(() => {
      formikSignup.setFieldError("name", "");
      formikSignup.setFieldError("emailSignUp", "");
      formikSignup.setFieldError("pmc_number", "");
      formikSignup.setFieldError("cityname", "");

      setSpecialityError("");
      setPhoneError("");
    }, 2500);
  }

  function handleSpecialityChange(event) {
    // console.log(event.target.value);
    const {
      target: { value },
    } = event;
    // setPersonName(
    //   // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value,
    // );
    setPersonName(...personName, value);
    formik.setFieldValue("specialities", personName);
  }



  return (
    <div className="registeration h-100-vh text-md-left text-center">
      <div className="container-fluid px-4 px-lg-8">
        <img className="LogoImage pt-4" src={LogoBg} />

        <div className="row">
          <Col md={6}>
            <div className="heading-first">
              <h1 className="reg-head">
                Join Pakistan's largest <br className="d-none d-xl-block" />{" "}
                healthcare platform today
              </h1>
            </div>

            <hr className="bottom-border"></hr>

            <div className="description">
              <p className="fs-20">
                Our Artificial Intelligence technology helps you connect
              </p>
            </div>

            <div className="main-list text-left">
              <div className="group1">
                <img className="circle" src={circle1} alt="" />

                <p>Community of 50,000+ doctors and growing</p>
              </div>

              <div className="group2">
                <img className="circle" src={circle2} alt="" />

                <p>Zero Commissions on all appointment bookings*</p>
              </div>

              <div className="group3">
                <img className="circle" src={circle3} alt="" />

                <p>
                  Access to enterprise-level medical software to help your
                  practice grow
                </p>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="content ">
              <Row>
                <Col md={12} className="column">


                  <div className="registeration-form">
                    <div className="form-control p-4 my-5 my-md-0">
                      <div>
                        <Box sx={{ width: "100%", typography: "body1" }}>
                          <TabContext value={value}>
                            <Box

                            // sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                              <TabList
                                // sx={{

                                //   display: 'flex', justifyContent: 'center'

                                // }}

                                onChange={handleChange}
                                aria-label="lab API tabs example"
                              >
                                <Tab
                                  style={{
                                    padding: "10px 40px",

                                    textTransform: "capitalize",

                                    borderRadius: "30px",

                                    color: isActive ? "#575757" : "",

                                    transition: "ease-in-out 0.3s",
                                  }}
                                  onActive={handleClick}
                                  label="Sign In"
                                  value="2"
                                />

                                <Tab
                                  style={{
                                    padding: "10px 40px",

                                    textTransform: "capitalize",

                                    borderRadius: "30px",

                                    marginLeft: "-0.5rem",

                                    color: isActive ? "#575757" : "",

                                    transition: "ease-in-out 0.3s",
                                  }}
                                  onActive={handleClick}
                                  label="Sign Up"
                                  value="3"
                                />
                              </TabList>
                            </Box>

                            <TabPanel onSubmitCapture={formik.handleSubmit} value="2">
                              <form onSubmitCapture={formik.handleSubmit} >



                                <div className="d-md-flex"></div>

                                <div className="input_box">
                                  <Box
                                    component="form"
                                    sx={{
                                      "& > :not(style)": {
                                        m: "5px",

                                        width: "100%",
                                      },
                                    }}

                                    autoComplete="off"
                                    validateOnBlur={false}
                                    validateOnChange={false}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                  >
                                    <TextField

                                      // onChange={(e) => {setEmail(e.target.value) ; formik.handleChange()}}
                                      // onChange={formik.handleChange}

                                      type="email"
                                      name="email"

                                      // onChange={(e) => {setEmail(e.target.value)}}

                                      value={formik.values.email}
                                      error={formik.touched.email && Boolean(formik.errors.email) || loginError}


                                      onChange={formik.handleChange}


                                      // helperText={formik.touched.email && formik.errors.email}

                                      id="outlined-abasic"
                                      label={i18n.t(
                                        "Enter your phone number or email"

                                      )}




                                    // label="Enter your phone number or email"

                                    // variant="outlined"
                                    />
                                    {formik.errors.email && (
                                      <small
                                        id='username2-help'
                                        className='p-error'
                                        style={{
                                          display: 'block',
                                          color: 'red',
                                          // textAlign: 'center',
                                          textAlign: 'left',
                                        }}
                                      >
                                        {formik.errors.email}
                                      </small>
                                    )}



                                  </Box>
                                  {/* {console.log(value)} */}

                                </div>

                                <div className="input_box">
                                  <Box
                                    component="form"
                                    sx={{
                                      "& > :not(style)": {
                                        m: "5px",

                                        width: "100%",
                                      },
                                    }}

                                    autoComplete="off"
                                    onChange={(e) => { setPassword(e.target.value) }}
                                  >
                                    <TextField
                                      onChange={formik.handleChange}
                                      // onBlur={formik.handleBlur}
                                      value={formik.values.password}
                                      id="outlined-basic"
                                      label={i18n.t("Enter Your password")}
                                      required
                                      variant="outlined"
                                      type="password"
                                      name="password"
                                      error={formik.touched.password && Boolean(formik.errors.password) || loginError}
                                    />
                                    {formik.errors.password && (
                                      <small
                                        id='username2-help'
                                        className='p-error'
                                        style={{
                                          display: 'block',
                                          color: 'red',
                                          // textAlign: 'center',
                                          textAlign: 'left',
                                        }}
                                      >
                                        {formik.errors.password}
                                      </small>
                                    )}

                                    {error && (
                                      <p className="my-2 text-red text-center"> {error} </p>
                                    )}
                                  </Box>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                  className="CheckIfAgree"
                                >
                                  <div>
                                    <input
                                      className="checkbox"
                                      type="checkbox"
                                      id="agree"
                                    />

                                    <label className="agree">
                                      {" "}
                                      {i18n.t("Remember Me")}{" "}
                                    </label>
                                  </div>

                                  <div className="forgotPassword">
                                    <Link to="/forgot-password">
                                      {i18n.t("Forgot Password?")}
                                    </Link>
                                  </div>

                                  {/* htmlFor="agree" */}
                                </div>

                                <div className="NotAMember d-md-flex align-items-center">
                                  <label >{i18n.t("Not a member?")}</label>

                                  {/* <button onClick={handleClick} > */}

                                  <TabList
                                    // sx={{

                                    //   display: 'flex', justifyContent: 'center'

                                    // }}

                                    onChange={handleChange}
                                    aria-label="lab API tabs example"
                                  >

                                    <Tab

                                      style={{

                                        backgroundColor: '#fff',
                                        textTransform: "capitalize",
                                        color: '#ee6285',
                                        fontFamily: 'Inter',
                                        fontSize: '19px',
                                        transition: "ease-in-out 0.3s",
                                      }}
                                      onActive={handleClick}
                                      label="Sign Up"
                                      value="3"
                                    />
                                  </TabList>
                                  {/* </button> */}
                                </div>

                                <div className="confirm-button">
                                  <button
                                    className="btn-group text-uppercase"
                                    type="submit"
                                  >
                                    SIGN IN
                                  </button>
                                </div>
                              </form>
                            </TabPanel>

                            <TabPanel onSubmitCapture={onRegister} value="3">
                              {specialities?.length > 0 && data?.length > 0 ? (
                                <form onBeforeInputCapture={resetSignupErrors} onSubmit={onRegister} id="formElem">
                                  <div onChange={val => {
                                    setPhone(val.target.value);
                                    // formikSignup.handleChange("phone");
                                  }

                                  } className="d-md-flex ">
                                    {/* <Field name="phone" component={ReactPhoneInput} /> */}
                                    <ReactPhoneInput
                                      inputClass={classNames({
                                        'border-red': nameError
                                      })}
                                      containerStyle={{ marginTop: "15px" }}
                                      countryCodeEditable={false}

                                      name='phone'
                                      type='number'

                                      inputProps={{
                                        name: 'phone',
                                        required: true,


                                      }}

                                      // onBlur={handleValidation}
                                      country={'pk'}
                                      // isValid={(value, country) => {
                                      //   if (value.length <= 11) {

                                      //     return false;
                                      //   } else {

                                      //     return true
                                      //   }



                                      // }}
                                      // defaultErrorMessage="Phone number is required"
                                      searchClass="search-class"
                                      searchStyle={{
                                        margin: "0",
                                        width: "97%",
                                        height: "30px",
                                      }}

                                      enableSearchField
                                      disableSearchIcon
                                    />

                                    {/* <MuiPhoneNumber
                      name="phone"
                      label="Phone Number"
                      data-cy="user-phone"
                      defaultCountry={"pk"}
                      value={phone}
                      onChange={handlePhoneChange}
                      inputClass={phoneError && 'border-red'}
                    /> */}


                                  </div>
                                  {phoneError && (
                                    <small
                                      id='username2-help'
                                      className='p-error'
                                      style={{
                                        display: 'block',
                                        color: 'red',
                                        // textAlign: 'center',
                                        textAlign: 'left',
                                      }}
                                    >
                                      {phoneError}
                                    </small>
                                  )}
                                  <div className="input_box">
                                    <Box
                                      component="form"
                                      sx={{
                                        "& > :not(style)": {
                                          m: "5px",

                                          width: "100%",
                                        },
                                      }}

                                      autoComplete="off"
                                      onChange={(e) => setName(e.target.value)}


                                    >
                                      <TextField
                                        id="outlined-basic"
                                        label={i18n.t("Enter Full Name")}
                                        name="name"
                                        className={classNames({
                                          'border-red': nameError
                                        })}
                                        // onChange={(e) => setName(e.target.value)}

                                        type="text"

                                        // onChange={formikSignup.handleChange}
                                        // onBlur={formikSignup.handleBlur}
                                        value={name}
                                      // error={formikSignup.touched.name && Boolean(formikSignup.errors.name) || registrationError}
                                      // variant="outlined"
                                      />
                                      {nameError && (
                                        <small
                                          id='username2-help'
                                          className='p-error'
                                          style={{
                                            display: 'block',
                                            color: 'red',
                                            // textAlign: 'center',
                                            textAlign: 'left',
                                          }}
                                        >
                                          {nameError}
                                        </small>
                                      )}
                                    </Box>
                                  </div>

                                  <div className="input_box">
                                    <Box
                                      component="form"
                                      sx={{
                                        "& > :not(style)": {
                                          m: "5px",

                                          width: "100%",
                                        },
                                      }}

                                      autoComplete="off"
                                      onChange={(e) => setRegisterEmail(e.target.value)}
                                    >
                                      <TextField
                                        id="outlined-basic"
                                        label={i18n.t("Enter Your Email")}
                                        name="emailSignUp"
                                        className={classNames({
                                          'border-red': regEmailError
                                        })}
                                        type="email"

                                        // onChange={(e) => setRegisterEmail(e.target.value)}
                                        // onBlur={formikSignup.handleBlur}
                                        value={registerEmail}
                                        // error={formikSignup.touched.emailSignUp && Boolean(formikSignup.errors.emailSignUp) || registrationError}
                                        required
                                      // onChange={(e) => setRegisterEmail(e.target.value)}

                                      // variant="outlined"
                                      />

                                      {regEmailError ? (

                                        <small
                                          id='username2-help'
                                          className='p-error'
                                          style={{
                                            display: 'block',
                                            color: 'red',
                                            // textAlign: 'center',
                                            textAlign: 'left',
                                          }}
                                        >
                                          {regEmailError}
                                        </small>


                                      ) : null
                                      }
                                    </Box>
                                  </div>

                                  <div className="input_box">
                                    <Box
                                      component="form"
                                      sx={{
                                        "& > :not(style)": {
                                          m: "5px",

                                          width: "100%",
                                        },
                                      }}

                                      autoComplete="off"
                                      onChange={(e) => setPmcNumber(e.target.value)}
                                    >
                                      <TextField
                                        id="outlined-basic"
                                        label={i18n.t("Enter Your PMC Number")}
                                        name="pmc_number"
                                        type='text'
                                        pattern="[a-zA-Z0-9\s]+"
                                        variant="outlined"
                                        // onChange={formikSignup.handleChange}
                                        // onBlur={formikSignup.handleBlur}
                                        value={pmcNumber}
                                        className={classNames({
                                          'border-red': pmcError
                                        })}
                                      // error={formikSignup.touched.pmc_number && Boolean(formikSignup.errors.pmc_number) || registrationError}


                                      // onChange={(e) => setPmcNumber(e.target.value)}
                                      />
                                      {pmcError && (
                                        <small
                                          id='username2-help'
                                          className='p-error'
                                          style={{
                                            display: 'block',
                                            color: 'red',
                                            // textAlign: 'center',
                                            textAlign: 'left',
                                          }}
                                        >
                                          {pmcError}
                                        </small>
                                      )}
                                    </Box>
                                  </div>

                                  {specialities?.length > 0 && (
                                    <div className="input_box">

                                      <FormControl sx={{

                                        m: '5px',
                                        width: '100%'

                                      }}>

                                        <InputLabel id="demo-multiple-name-label">{i18n.t('List Your Area of Medical Specialty')}</InputLabel>


                                        <Select
                                          labelId="demo-multiple-name-label"
                                          id="demo-multiple-name"
                                          open={open}

                                          onOpen={() => setOpen(true)}
                                          onClose={() => setOpen(false)}
                                          multiple
                                          name="specialities"
                                          value={personName}
                                          // className={classNames({
                                          //   'border-red': specialityError
                                          // })}
                                          className={classNames({
                                            'border-red': cityError
                                          })}
                                          onChange={handleInput}
                                          input={<OutlinedInput label={i18n.t('List Your Area of Medical Specialty')} />}
                                          MenuProps={MenuProps}
                                        // error={formikSignup.touched.specialities && Boolean(formikSignup.errors.specialities) || specialityError}


                                        >
                                          <div style={{ height: '20px', width: '40px' }} className="d-flex justify-content-end align-items-center iconItem ms-auto">

                                            <button style={{ position: 'fixed', width: '40px', zIndex: '1', marginRight: '1rem', color: '#E9406A', fontWeight: 'bold' }} onClick={() => setOpen(false)} >DONE</button>
                                          </div>


                                          {specialities.length > 0 && specialities.map((name) => (
                                            <MenuItem

                                              name="speciality[]"
                                              key={name?.name}
                                              value={name?.id}
                                              style={getStyles(name, personName, theme)}
                                            >
                                              {name?.name}

                                            </MenuItem>

                                          ))}
                                        </Select>
                                      </FormControl>

                                      {specialityError && (
                                        <small
                                          id='username2-help'
                                          className='p-error'
                                          style={{
                                            display: 'block',
                                            color: 'red',
                                            // textAlign: 'center',
                                            textAlign: 'left',
                                          }}
                                        >
                                          {specialityError}
                                        </small>
                                      )}

                                    </div>
                                  )}

                                  {data?.length > 0 && (
                                    <div className="input_box">

                                      <FormControl sx={{

                                        m: '5px',
                                        width: '100%'

                                      }}>
                                        <InputLabel id="demo-multiple-name-label">Select Your City</InputLabel>
                                        <Select
                                          labelId="demo-multiple-name-label"
                                          id="demo-multiple-name"
                                          select
                                          name="cityname"
                                          value={cityName}
                                          onChange={handleCity}
                                          input={<OutlinedInput label="Select Your city" />}
                                          className={classNames({
                                            'border-red': cityError
                                          })}
                                          MenuProps={CityProps}
                                        // error={formikSignup.touched.cityname && Boolean(formikSignup.errors.cityname) || registrationError}

                                        >
                                          {/* {console.log(cityName)} */}
                                          {data.length > 0 && data.map((city) => (
                                            <MenuItem
                                              onChange={(e) => setCity(e.target.value)}

                                              key={city?.name}
                                              value={city?.name}
                                              style={getStyles(city, cityName, theme)}
                                            >
                                              {city?.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                        {/* {formikSignup.errors.cityname && (
                    <small
                      id='username2-help'
                      className='p-error'
                      style={{
                        display: 'block',
                        color: 'red',
                        // textAlign: 'center',
                        textAlign: 'left',
                      }}
                    >
                      {formikSignup.errors.cityname}
                    </small>
                  )} */}
                                        {cityError && (
                                          <small
                                            id='username2-help'
                                            className='p-error'
                                            style={{
                                              display: 'block',
                                              color: 'red',
                                              // textAlign: 'center',
                                              textAlign: 'left',
                                            }}
                                          >
                                            {cityError}
                                          </small>
                                        )}

                                        {regError && (
                                          <p className="my-2 text-red text-center"> {regError} </p>
                                        )}
                                      </FormControl>
                                      {/*

                                    <Box
                                      component="form"
                                      sx={{
                                        "& > :not(style)": {
                                          m: "5px",

                                          width: "100%",
                                        },
                                      }}
                                      noValidate
                                      autoComplete="off"
                                    >
                                      <TextField

                                        onChange={(e) => setCity(e.target.value)}
                                        id="outlined-basic"
                                        label={i18n.t("Enter Your City")}
                                        variant="outlined"
                                      />
                                    </Box> */}
                                    </div>
                                  )}


                                  <div className="CheckIfAgree">
                                    <input
                                      className="checkbox"
                                      type="checkbox"
                                      id="agree"
                                      onChange={checkboxHandler}
                                    />

                                    <label className="agree">
                                      {" "}
                                      {i18n.t("I agree to the")}{" "}
                                      <Link to="/terms">
                                        {i18n.t("Terms of services")}
                                      </Link>
                                    </label>

                                    {/* htmlFor="agree" */}
                                  </div>

                                  <div className="confirm-button">
                                    <button
                                      // disabled={!agree}
                                      className="btn-group text-uppercase"
                                      type="submit"
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <div className="loaderWrapper">
                                  <img src={loadingGif} alt="" />
                                </div>
                              )}

                            </TabPanel>
                          </TabContext>
                        </Box>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </div>
      </div>
    </div>
  );
}

export default Login;
