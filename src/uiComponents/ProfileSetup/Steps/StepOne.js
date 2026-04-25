import React, { useEffect, useState } from "react";
import "./Steps.scss";
import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Modal,
  Space,
} from "antd";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import cameraIcon from "../../../assets/images/png/camera.png";
import PracticeDetail from "./stepsForm/PracticeDetail";
import PersonalInformation from "./stepsForm/PersonalInformation";
import BankDetail from "./stepsForm/BankDetail";
import API from "../../../utils/customAxios";
import Cookies from "js-cookie";
import moment from "moment";
import Loader from "../../../uiComponents/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const { Step } = Steps;
const { Option } = Select;
function StepOne({ moveToQualification, setListner }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [practiceDetailForm] = Form.useForm();
  const [bankDetailForm] = Form.useForm();
  const [image, setImage] = useState();
  const [profileData, setProfileData] = useState({});
  const [savedImage, setSavedImage] = useState("");
  const [servicesLoader, setServicesLoader] = useState(false);
  const [diseasesLoader, setDiseasesLoader] = useState(false);
  const [name, setName] = useState(null);

  const [firstSubmissionLoading, setFirstSubmissionLoading] = useState(false);
  const [secondSubmissionLoading, setSecondSubmissionLoading] = useState(false);
  const [thirdSubmissionLoading, setThirdSubmissionLoading] = useState(false);
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

  const [selectPairs, setSelectPairs] = useState([
    {
      id: 1,
      firstSelectValue: "",
      secondSelectOptions: [],
      thirdSelectOptions: [],
    },
  ]);

  useEffect(() => {
    if (selectPairs.length > 0) {
      Cookies.set("specialityElementLength", selectPairs.length);
    }
  }, [selectPairs.length]);

  // Function to fetch options for the second select based on the first select value
  const fetchSecondSelectOptions = async (id, firstSelectValue) => {
    try {
      setServicesLoader(true);
      const response = await API.get(
        `/services?speciality_id=${firstSelectValue}`
      );

      let servicesArray = response?.data?.data?.services;

      let prefilledServices = [];

      if(servicesArray?.length > 0) {
        servicesArray?.forEach((service) => {
          prefilledServices.push(service?.id);
        })
      }

      setServicesLoader(false);

      practiceDetailForm.setFieldsValue({
        [`service${id}`]: prefilledServices?.[0]
      });

      // Update the options for the second select
      setSelectPairs((prevPairs) =>
        prevPairs.map((pair) => {
          if (pair.id === id) {
            return {
              ...pair,
              secondSelectOptions: response?.data?.data?.services,
            };
          }
          return pair;
        })
      );
    } catch (error) {
      setServicesLoader(false);
    }
    // Calling the API here with the first select value
  };

  const fetchThirdSelectOptions = async (id, firstSelectValue) => {
    try {
      setDiseasesLoader(true);
      const response = await API.get(
        `/disease?all=true&speciality_id=${firstSelectValue}`
      );
      setDiseasesLoader(false);

      let selectOptions = response?.data?.data?.disease;

      let diseaseArray = [];
      
      selectOptions?.forEach((item) => {
        diseaseArray.push(item?.id);
      })

      let otherOption = { name: "Other", id: "Other" };

      if (selectOptions?.length >= 0) {
        selectOptions.push(otherOption);
      }

      practiceDetailForm.setFieldsValue({
        [`condition${id}`]: diseaseArray
      })

      setSelectPairs((prevPairs) =>
        prevPairs.map((pair) => {
          if (pair.id === id) {
            return { ...pair, thirdSelectOptions: selectOptions };
          }
          return pair;
        })
      );
    } catch (error) {
      setDiseasesLoader(false);
    }
  };

  // Function to handle change in the first select
  const handleFirstSelectChange = (id, value) => {
    setSelectPairs((prevPairs) =>
      prevPairs.map((pair) => {
        if (pair.id === id) {
          // fetchSecondSelectOptions(id, value);
          return { ...pair, firstSelectValue: value };
        }
        return pair;
      })
    );
    fetchSecondSelectOptions(id, value);
    fetchThirdSelectOptions(id, value);

    practiceDetailForm.setFieldsValue({
      [`service${id}`]: "",
      [`condition${id}`]: []
    })
  };

  // Function to add a new select pair
  const addSelectPair = (selectValue) => {
    practiceDetailForm.setFieldsValue({
      [`speciality${selectPairs.length + 1}`]: "",
      [`service${selectPairs.length + 1}`]: "",
      [`condition${selectPairs.length + 1}`]: [],
    });

    if (selectValue) {
      const newId = selectPairs.length + 1;
      setSelectPairs((prevPairs) => [
        ...prevPairs,
        { id: newId, firstSelectValue: selectValue, secondSelectOptions: [] },
      ]);
    } else {
      const newId = selectPairs.length + 1;
      setSelectPairs((prevPairs) => [
        ...prevPairs,
        { id: newId, firstSelectValue: "", secondSelectOptions: [] },
      ]);
    }
  };

  // Function to remove a select pair
  const removeSelectPair = (id) => {
    if (id !== 1) {
      setSelectPairs((prevPairs) => prevPairs.filter((pair) => pair.id !== id));
    }
  };

  useEffect(() => {
    API.get(`/doctor/profile-details?education=1`).then((res) => {
      if (res?.data?.code === 200) {
        setProfileData(res?.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    API.get(`/doctor/profile-details?specialities=1`).then((res) => {
      if (res?.data?.code === 200) {
        setProfileData(res?.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    API.get(`/doctor/profile-details?bank_details=1`).then((res) => {
      if (res?.data?.code === 200) {
        setProfileData(res?.data?.data);
      }
    });
  }, []);

  // Show values for personal information form...
  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      const valuess = form.getFieldValue();
      setName(profileData?.name);
      form.setFieldsValue({
        prefix:  profileData?.doctor_detail?.prefix,
        DoctorId: profileData?.id,
        fullName: profileData?.name,
        phone: profileData?.phone,
        assistantPhone: profileData?.doctor_detail?.assistant_phone,
        email: profileData?.email,
        dateOfBirth:
          profileData?.birth_date === null
            ? null
            : moment(profileData?.birth_date),
        gender: profileData?.gender,
        city: profileData?.city_id,
        experience: profileData?.doctor_detail?.experience_year,
      });
      console.log( profileData)
      setSavedImage(profileData?.image_url); // Set the savedImage state

      const fileList = [
        {
          uid: "12345",
          status: "done",
          name: "doctor.png",
          url: profileData?.image_url,
        },
      ];

      form.setFieldsValue({ profilePic: fileList }); // Set the defaultFileList value
    }
  }, [JSON.stringify(profileData)]);

  // Show values for practice details

  useEffect(() => {
    if (profileData?.doctor_detail) {
      practiceDetailForm.setFieldsValue({
        about: profileData?.doctor_detail?.about,
        pmdc: profileData?.doctor_detail?.pmc_no,
      });
    }
    if (profileData?.doctor_specialities?.length > 0) {
      
      const initialValues = {};

      let prefilledSpecialities = [];

      const newSelectPairs = profileData.doctor_specialities.map(
        (speciality, index) => {
          const { speciality_id } = speciality;
          console.log({speciality});
          prefilledSpecialities.push(speciality_id);
          // setSelectedSpecialities([...selectedSpecialities, speciality_id]);
          handleFirstSelectChange(index+1, speciality_id);

          const selectPair = {
            id: index + 1,
            firstSelectValue: speciality_id, // Set the initial value for firstSelectValue
            secondSelectOptions: [], // Set the initial value for secondSelectOptions
            thirdSelectOptions: [], // Set the initial value for thirdSelectOptions
            // [`speciality${speciality_id}`]: speciality_id,
            // [`service${speciality_id}`]: null,
            // [`condition${speciality_id}`]: [],
          };

          practiceDetailForm.setFieldsValue({
            [`service${index + 1}`]: speciality?.doctor_services?.id,
            [`speciality${index + 1}`]: speciality_id,
          });

          let conditions = [];

          // Check if the speciality ID exists in the conditionsMap
          if (speciality.doctor_conditions.length > 0) {
            speciality.doctor_conditions.forEach((condition) => {
              conditions.push(condition?.disease_id);
              const conditionName = condition?.name;
              const conditionId = condition?.disease_id;
              selectPair[`condition${speciality_id}`]?.push(conditionId);
              initialValues[`condition${speciality_id}`] =
                initialValues[`condition${speciality_id}`] || [];
              initialValues[`condition${speciality_id}`]?.push(conditionId);
              selectPair?.thirdSelectOptions.push({
                name: conditionName,
                id: conditionId,
              });
            });
            practiceDetailForm.setFieldsValue({
              [`condition${index + 1}`]: conditions,
            });
          } else {
            initialValues[`condition${speciality_id}`] = [];
          }

          // Check if the speciality ID exists in the servicesMap
          if (speciality.doctor_services) {
            selectPair[`service${speciality_id}`] =
              speciality.doctor_services.id;
            initialValues[`service${speciality_id}`] =
              speciality.doctor_services.id; // Set the initial value for the service field
            selectPair?.secondSelectOptions.push({
              name: speciality.doctor_services.name,
              id: speciality.doctor_services.id,
            });
          }

          Object.assign(initialValues, selectPair); // Merge selectPair into initialValues

          return selectPair;
        }
      );

      setSelectPairs(newSelectPairs);
      practiceDetailForm.setFieldsValue(initialValues);

      setSelectedSpecialities([...selectedSpecialities, ...prefilledSpecialities]);
      // console.log({prefilledSpecialities});
    }
  }, [practiceDetailForm, profileData?.doctor_specialities]);

  // Show values for bank detail form

  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      if (profileData?.doctor_bank_details) {
        bankDetailForm.setFieldsValue({
          accountTitle: profileData?.doctor_bank_details?.account_name,
          ibanNumber: profileData?.doctor_bank_details?.account_number,
          bankName: profileData?.doctor_bank_details?.bank_name,
          cnic: profileData?.doctor_detail?.cnic,
        });
      }
    }
  }, [JSON.stringify(profileData)]);

  const handleNext = async (e, save) => {
    const values = form.getFieldsValue();
    
    
    try {
      await form.validateFields();

      const payload = {
        prefix: values?.prefix,
        name: values?.fullName,
        phone: values?.phone,
        assistant_phone: values?.assistantPhone,
        email: values?.email,
        birth_date: values?.dateOfBirth,
        gender: values?.gender,
        city_id: values?.city,
        experience_year: values?.experience,
        image: image,
      };


      const formData = new FormData();

      Object.keys(payload).forEach((item) => {
        formData.append(item, payload[item]);
      });

      if (
        payload?.image === null ||
        payload?.image === "" ||
        payload?.image === "undefined"
      ) {
        toast.error("Invalid file type.");
      } else {
        try {
          setFirstSubmissionLoading(true);
          const response = await API.post("/doctor/personal-info", formData);
          setFirstSubmissionLoading(false);
          if (response?.data?.code === 200 && !save) {
            setCurrentStep((prevStep) => prevStep + 1);
            setListner((prevStep) => !prevStep);
          }
        } catch (error) {
          console.error(error);
          setFirstSubmissionLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePracticeFormSubmit = async (e, save) => {
    try {
      await practiceDetailForm.validateFields();

      const values = practiceDetailForm.getFieldsValue();

      // console.log(values['speciality'+ 1], 'spect')

      let selectLength = Cookies.get("specialityElementLength");

      let service = [];
      let condition = [];
      let speciality = [];

      for (let i = 1; i <= selectLength; i++) {
        speciality.push(values["speciality" + i]);
        service.push(values["service" + i]);
        condition.push(values["condition" + i]);
      }

      let payload = {
        service,
        condition,
        speciality,
        about: values?.about,
        pmc_no: values?.pmdc,
      };

      try {
        setSecondSubmissionLoading(true);
        const response = await API.post(
          "/doctor/register/doctor/practice-detail",
          payload
        );
        setSecondSubmissionLoading(false);
        if (response?.data?.code === 200 && !save) {
          setListner((prevStep) => !prevStep);
          setCurrentStep((prevStep) => prevStep + 1);
        }
      } catch (error) {
        setSecondSubmissionLoading(false);
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBankFormSubmit = async (e, save) => {
    try {
      await bankDetailForm.validateFields();

      const values = bankDetailForm.getFieldsValue();

      const payload = {
        account_name: values?.accountTitle,
        account_number: values?.ibanNumber,
        iban_number: values?.ibanNumber,
        bank_name: values?.bankName,
        cnic: values?.cnic,
      };

      try {
        setThirdSubmissionLoading(true);
        const response = await API.post(
          "/bank-detail/updateBankDetails",
          payload
        );
        setThirdSubmissionLoading(false);
        if (response?.data?.code === 200 && !save) {
          setListner((prevStep) => !prevStep);
          Cookies.set("pagestatus", "qualifications");
          moveToQualification();
        }
      } catch (error) {
        setThirdSubmissionLoading(false);
      }

      // setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
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
      {(firstSubmissionLoading ||
        secondSubmissionLoading ||
        thirdSubmissionLoading) && <Loader />}
      <div className="steps_form">
        <Steps current={currentStep}>
          <Step key="personalinformation" title="Personal Information" />
          <Step key="practicedetails" title="Practice Details" />
          <Step key="bankdetails" title="Bank Details" />
        </Steps>
        <div style={{ marginTop: 16 }}>
          {currentStep === 0 && (
            <Form form={form} onFinish={handleNext}>
              <PersonalInformation
                setName={setName}
                name={name}
                setImage={setImage}
                savedImage={savedImage}
                form={form}
              />

              <div className="buttons_box">
                <div className="box_buttons">
                  {/* Add more fields for profile information */}
                  <Button
                    type="primary"
                    disabled={firstSubmissionLoading}
                    className="btn btn-01 bg-light1 me-3"
                    onClick={(e) => handleNext(e, true)}
                  >
                    Save
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-01 bg-dark1"
                    htmlType="submit"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Form>
          )}
          {currentStep === 1 && (
            <Form form={practiceDetailForm} onFinish={handlePracticeFormSubmit}>
              <PracticeDetail
                servicesLoader={servicesLoader}
                diseasesLoader={diseasesLoader}
                addSelectPair={addSelectPair}
                selectPairs={selectPairs}
                handleFirstSelectChange={handleFirstSelectChange}
                removeSelectPair={removeSelectPair}
                form={practiceDetailForm}
                selectedSpecialities={selectedSpecialities}
                setSelectedSpecialities={setSelectedSpecialities}
              />
              <div className="buttons_box">
                <div className="box_buttons ">
                  {/* Add fields for about information */}

                  <Row>
                    <Col lg={6} md={6} className="text-start">
                      <Button
                        style={{ marginRight: 8 }}
                        onClick={handlePrev}
                        className="btn btn-01 bg-light1 me-3"
                      >
                        Back
                      </Button>
                    </Col>
                    <Col lg={6} md={6} className="text-end">
                      <Button
                        disabled={secondSubmissionLoading}
                        type="primary"
                        className="btn btn-01 bg-light1 me-3"
                        onClick={(e) => handlePracticeFormSubmit(e, true)}
                      >
                        Save
                      </Button>
                      <Button
                        type="submit"
                        onClick={handlePracticeFormSubmit}
                        className="btn btn-01  bg-dark1"
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Form>
          )}
          {currentStep === 2 && (
            <Form form={bankDetailForm} onFinish={handleBankFormSubmit}>
              {/* Add fields for education information */}

              <BankDetail />

              <div className="buttons_box box_buttons ">
                <Row>
                  <Col lg={6} md={6} className="text-start">
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={handlePrev}
                      className="btn btn-01 bg-light1 me-3"
                    >
                      Back
                    </Button>
                  </Col>
                  <Col lg={6} md={6} className="text-end">
                    <Button
                      type="primary"
                      disabled={thirdSubmissionLoading}
                      className="btn btn-01 bg-light1 me-3"
                      onClick={(e) => handleBankFormSubmit(e, true)}
                    >
                      Save
                    </Button>
                    <Button
                      type="submit"
                      className="btn btn-01  bg-dark1"
                      htmlType="submit"
                    >
                      Next
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default StepOne;
