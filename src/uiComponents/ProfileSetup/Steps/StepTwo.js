import React, { useEffect, useState } from "react";
import "./Steps.scss";
import { Steps, Button, Form, Input, Select } from "antd";
import axios from "axios";

import { Col, Row } from "react-bootstrap";
import Education from "./stepsForm/Education";
import Experiance from "./stepsForm/Experiance";
import API from "../../../utils/customAxios";
import {
  getDegreesByInstituteWithYearOfCompletion,
  getUniqueObjectsByKey,
} from "../../../helpers/utilityHelper";
import Cookies from "js-cookie";
import Loader from "../../../uiComponents/loader/Loader";
import { isMobile } from "react-device-detect";
import { toast, ToastContainer } from "react-toastify";

const { Step } = Steps;
const { Option } = Select;
function StepTwo({
  moveToConsultation,
  setAbout,
  setQualification,
  setConsultation,
  setCurrentStep,
  setListner,
}) {
  const [currentStepTwo, setCurrentStepTwo] = useState(0);
  const [form] = Form.useForm();
  const [educationForm] = Form.useForm();
  const [experienceForm] = Form.useForm();
  const [profileData, setProfileData] = useState({});
  const [rowCount, setRowCount] = useState(1);
  const [firstSubmissionLoader, setFirstSubmissionLoader] = useState(false);
  const [secondSubmissionLoader, setSecondSubmissionLoader] = useState(false);
  const [apiDegrees, setApiDegrees] = useState([]);

  const duplicateRow = () => {
    setRowCount(rowCount + 1);
  };
  const deleteeRow = () => {
    setRowCount(rowCount - 1);
  };

  const [experienceRowCount, setExperienceRowCount] = useState(1);

  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(
    Array.from({ length: experienceRowCount }, () => false)
  );

  const duplicateExperienceRow = () => {
    setExperienceRowCount(experienceRowCount + 1);
  };
  const deleteExperienceRow = () => {
    setExperienceRowCount(experienceRowCount - 1);
  };

  const [rowCertificate, setRowCertificate] = useState(1);

  const duplicateRowCertificate = () => {
    setRowCertificate(rowCertificate + 1);
  };

  const deleteRowCertificate = () => {
    setRowCertificate(rowCertificate - 1);
  };
  useEffect(() => {
    API.get(`/doctor/profile-details?education=1`).then((res) => {
      if (res?.data?.code === 200) {
        setProfileData(res?.data?.data);
        let degrees = [];
        res?.data?.data?.doctor_education?.forEach((item) => {
          degrees.push(item?.degree_id);
        });
        setApiDegrees(degrees);
      }
    });
  }, []);

  useEffect(() => {
    API.get(`/doctor/profile-details?experiences=1`).then((res) => {
      if (res?.data?.code === 200) {
        setProfileData(res?.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    API.get(`/doctor/profile-details?certification=1`).then((res) => {
      if (res?.data?.code === 200) {
        setProfileData(res?.data?.data);
      }
    });
  }, []);
  //show prefilled education data
  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      const doctorEducation = profileData?.doctor_education;

      if (doctorEducation?.length > 0) {
        const degreesByInstituteWithYearOfCompletion =
          getDegreesByInstituteWithYearOfCompletion(doctorEducation);

        setRowCount(degreesByInstituteWithYearOfCompletion.length);

        for (
          let i = 0;
          i < degreesByInstituteWithYearOfCompletion.length;
          i++
        ) {
          form.setFieldsValue({
            [`degree${i + 1}`]: degreesByInstituteWithYearOfCompletion[i]?.map(
              (item) => {
                return item?.degree;
              }
            ),
            [`institute${i + 1}`]:
              degreesByInstituteWithYearOfCompletion?.[i]?.[0]?.institute,
            [`completion${i + 1}`]:
              degreesByInstituteWithYearOfCompletion?.[i]?.[0]
                ?.yearOfCompletion,
          });
        }
      }
    }
  }, [JSON.stringify(profileData)]);

  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      const doctorEducation = profileData?.doctor_education;

      if (doctorEducation?.length > 0) {
        const degreesByInstituteWithYearOfCompletion =
          getDegreesByInstituteWithYearOfCompletion(doctorEducation);

        setRowCount(degreesByInstituteWithYearOfCompletion.length);

        for (
          let i = 0;
          i < degreesByInstituteWithYearOfCompletion.length;
          i++
        ) {
          educationForm.setFieldsValue({
            [`degree${i + 1}`]: degreesByInstituteWithYearOfCompletion[i]?.map(
              (item) => {
                return item?.degree;
              }
            ),
            [`institute${i + 1}`]:
              degreesByInstituteWithYearOfCompletion?.[i]?.[0]?.institute,
            [`completion${i + 1}`]:
              degreesByInstituteWithYearOfCompletion?.[i]?.[0]
                ?.yearOfCompletion,
          });
        }
      }
    }
  }, [JSON.stringify(profileData)]);

  // show prefilled experiences data

  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      const doctorExperiences = profileData?.doctor_experiences;

      if (doctorExperiences?.length > 0) {
        setExperienceRowCount(doctorExperiences?.length);

        for (let i = 0; i < doctorExperiences?.length; i++) {
          experienceForm.setFieldsValue({
            [`designation${i + 1}`]: doctorExperiences?.[i]?.position_id,
            [`institute${i + 1}`]: doctorExperiences?.[i]?.institute_id,
            [`startyear${i + 1}`]: doctorExperiences?.[i]?.start_year,
            [`endyear${i + 1}`]: doctorExperiences?.[i]?.end_year,
          });
        }
      }

      const doctorCertification = profileData?.doctor_certification;

      if (doctorCertification?.length > 0) {
        setRowCertificate(doctorCertification?.length);

        for (let i = 0; i < doctorCertification?.length; i++) {
          experienceForm.setFieldsValue({
            [`membershipcertificate${i + 1}`]:
              doctorCertification?.[i]?.certification_id,
          });
        }
      }
    }
  }, [JSON.stringify(profileData)]);

  const handleNext = async (e, save) => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      let educ = [];

      for (let i = 1; i <= rowCount; i++) {
        educ.push({
          degree: (typeof values[`degree${i}`] === "string" || typeof values[`degree${i}`] === 'number') ? values[`degree${i}`] : values[`degree${i}`]?.[0] ,
          institute: values["institute" + i],
          year_of_completion: values["completion" + i],
        });
      }

      let payload = {
        educ: educ,
      };

      try {
        setFirstSubmissionLoader(true);
        const response = await API.post(
          `doctor/register/doctor/education-api`,
          payload
        );
        setFirstSubmissionLoader(false);
        if (response?.data?.code === 200 && !save) {
          setCurrentStepTwo((prevStep) => prevStep + 1);
          if (isMobile) {
            handleExperienceSubmit();
          }
          setListner((prevStep) => !prevStep);
        } else {
          toast.success(response?.data?.message);
        }
      } catch (error) {
        console.error(error);
        setFirstSubmissionLoader(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExperienceSubmit = async (e, save) => {
    try {
      await experienceForm.validateFields();
      const values = experienceForm.getFieldsValue();

      let exp = [];

      for (let i = 1; i <= experienceRowCount; i++) {
        exp.push({
          position: values["designation" + i],
          institute: values["institute" + i],
          start_year: values["startyear" + i],
          end_year: values["endyear" + i],
        });
      }

      let certification = [];

      for (let i = 1; i <= rowCertificate; i++) {
        certification.push(values["membershipcertificate" + i]);
      }

      let payload = {};

      if (exp?.length > 0) {
        payload.exp = exp;
      }
      if (typeof certification[0] !== "undefined") {
        payload.certification = certification;
      }

      // let payload = {
      //     exp: exp,
      //     certification: certification
      // };

      try {
        setSecondSubmissionLoader(true);
        const response = await API.post(
          `doctor/register/doctor/experience-api`,
          payload
        );
        setSecondSubmissionLoader(false);
        if (response?.data?.code === 200 && !save) {
          setListner((prevStep) => !prevStep);
          if (isMobile) {
            toast.success("Educations & Experiences Submit Successfully.");
            setCurrentStep((prevStep) => prevStep + 1);
            setQualification(false);
            setConsultation(true);
          }
          Cookies.remove("pagestatus");
          Cookies.set("pageStatus", "consultation");
          // setCurrentStepTwo((prevStep) => prevStep + 1);
          setConsultation(true);
          setQualification(false);
        } else {
          toast.success(response?.data?.message);
        }
      } catch (error) {
        console.error(error);
        setSecondSubmissionLoader(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrev = () => {
    setCurrentStepTwo((prevStep) => prevStep - 1);
  };

  const handlePrevTwo = () => {
    setAbout(true);
    setQualification(false);
  };

  const handleSubmit = () => {
    form.submit();
  };

  const handleFormSubmit = (values) => {
    // Submit the form data to the server using axios or your preferred method
    axios
      .post("/api/submit-form", values)
      .then((response) => {
        // Handle the response
        console.log(response);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  return (
    <>
      {(firstSubmissionLoader || secondSubmissionLoader) && (
        <>
          <Loader />
        </>
      )}
      <div className="steps_form">
        {!isMobile ? (
          <>
            <Steps current={currentStepTwo}>
              <Step key="education" title="Education" />
              <Step key="experience" title="Experience" />
            </Steps>
          </>
        ) : null}
        <div style={{ marginTop: 16 }}>
          {!isMobile ? (
            currentStepTwo === 0 && (
              <Form form={form} onFinish={handleNext}>
                <Education
                  rowCount={rowCount}
                  duplicateRow={duplicateRow}
                  deleteeRow={deleteeRow}
                  apiDegrees={apiDegrees}
                  form={form}
                />
                <div className="buttons_box">
                  <div className="box_buttons">
                    <Row>
                      <Col lg={6} md={6} className="text-start">
                        {!isMobile ? (
                          <>
                            <Button
                              type="primary"
                              onClick={handlePrevTwo}
                              className="btn btn-01 bg-light1 me-3"
                            >
                              Back to About You
                            </Button>
                          </>
                        ) : null}
                      </Col>
                      <Col lg={6} md={6} className="text-end">
                        <Button
                          disabled={firstSubmissionLoader}
                          onClick={(e) => handleNext(e, true)}
                          type="primary"
                          className="btn btn-01 bg-light1 me-3"
                        >
                          Save
                        </Button>
                        <Button
                          disabled={firstSubmissionLoader}
                          type="primary"
                          onClick={handleNext}
                          className="btn btn-01  bg-dark1"
                        >
                          Next
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            )
          ) : (
            <Form form={form} onFinish={handleNext}>
              <Education
                rowCount={rowCount}
                duplicateRow={duplicateRow}
                deleteeRow={deleteeRow}
                apiDegrees={apiDegrees}
                form={form}
              />
              {/* <div className="buttons_box">
                                <div className="box_buttons">
                                    <Row>
                                        <Col lg={6} md={6} className="text-start">
                                            {!isMobile ? (
                                                <>
                                                    <Button type="primary" onClick={handlePrevTwo} className="btn btn-01 bg-light1 me-3" >
                                                        Back to About You
                                                    </Button>
                                                </>
                                            ) : null}
                                        </Col>
                                        <Col lg={6} md={6} className="text-end">
                                            <Button disabled={firstSubmissionLoader} onClick={(e) => handleNext(e, true)} type="primary" className="btn btn-01 bg-light1 me-3" >
                                                Save
                                            </Button>
                                            <Button disabled={firstSubmissionLoader} type="primary" onClick={handleNext} className="btn btn-01  bg-dark1">
                                                Next
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div> */}
            </Form>
          )}

          {!isMobile ? (
            currentStepTwo === 1 && (
              <Form form={experienceForm} onFinish={handleExperienceSubmit}>
                <Experiance
                  experienceForm={experienceForm}
                  // experienceForm={experienceForm}
                  experienceRowCount={experienceRowCount}
                  duplicateExperienceRow={duplicateExperienceRow}
                  deleteExperienceRow={deleteExperienceRow}
                  rowCertificate={rowCertificate}
                  duplicateRowCertificate={duplicateRowCertificate}
                  deleteRowCertificate={deleteRowCertificate}
                  form={experienceForm}
                  isCurrentlyWorking={isCurrentlyWorking}
                  setIsCurrentlyWorking={setIsCurrentlyWorking}
                />

                <div className="buttons_box">
                  <div className="box_buttons">
                    <Row>
                      <Col lg={6} md={6} className="text-start">
                        <Button
                          className="btn  btn-01 bg-light1"
                          onClick={handlePrev}
                        >
                          Back
                        </Button>
                      </Col>
                      <Col lg={6} md={6} className="text-end">
                        <Button
                          disabled={secondSubmissionLoader}
                          onClick={(e) => handleExperienceSubmit(e, true)}
                          type="primary"
                          style={{ marginRight: 8 }}
                          className="btn btn-01 bg-light1"
                        >
                          Save
                        </Button>
                        <Button
                          type="primary"
                          disabled={secondSubmissionLoader}
                          className="btn btn-01 bg-dark1 ss"
                          onClick={handleExperienceSubmit}
                        >
                          Next
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            )
          ) : (
            <>
              <h2 className="mt-3">Experience</h2>
              <Form form={experienceForm} onFinish={handleExperienceSubmit}>
                <Experiance
                  experienceForm={experienceForm}
                  experienceRowCount={experienceRowCount}
                  duplicateExperienceRow={duplicateExperienceRow}
                  deleteExperienceRow={deleteExperienceRow}
                  rowCertificate={rowCertificate}
                  duplicateRowCertificate={duplicateRowCertificate}
                  deleteRowCertificate={deleteRowCertificate}
                  form={experienceForm}
                  isCurrentlyWorking={isCurrentlyWorking}
                  setIsCurrentlyWorking={setIsCurrentlyWorking}
                />

                <div className="buttons_box">
                  <div className="box_buttons">
                    <Row>
                      <Col lg={6} md={6} className="text-center">
                        <Button
                          disabled={firstSubmissionLoader}
                          onClick={(e) => handleNext(e, true)}
                          type="primary"
                          className="btn btn-01 bg-light1 me-3"
                        >
                          Save
                        </Button>
                        <Button
                          disabled={firstSubmissionLoader}
                          type="primary"
                          onClick={handleNext}
                          className="btn btn-01  bg-dark1"
                        >
                          Next
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
      <div className="toast_blue width_toast">
        <ToastContainer />
      </div>
    </>
  );
}

export default StepTwo;
