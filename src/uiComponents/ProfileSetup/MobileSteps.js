import React, { useEffect, useState } from "react";

import './Steps/Steps.scss';
import { Steps, Button, Form, Input, Select, DatePicker, Upload, Modal, Space } from "antd";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import backIcon from './../../assets/images/png/back.png';
import PersonalInformation from "./Steps/stepsForm/PersonalInformation";
import PracticeDetail from "./Steps/stepsForm/PracticeDetail";
import BankDetail from "./Steps/stepsForm/BankDetail";
import Education from "./Steps/stepsForm/Education";
import Experiance from "./Steps/stepsForm/Experiance";
import VideoConsultation from "./Steps/stepsForm/VideoConsultation";
import imageFormModal from "./../../assets/images/png/image-form.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../../utils/customAxios";
import moment from "moment";
import Cookies from "js-cookie";
import StepTwo from "./Steps/StepTwo";
import StepThree from "./Steps/StepThree";
import { getDegreesByInstituteWithYearOfCompletion } from "../../helpers/utilityHelper";
import Loader from "../loader/Loader";


const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const { Step } = Steps;
const { Option } = Select;

function MobileSteps({ moveToQualification, setAbout, setQualification, setConsultation, moveToConsultation, setListner }) {

    const [confirmFormSubmit, setConfirmFormSubmit] = useState(false);
    const [submitForm, setSubmitForm] = useState(false);

    const [image, setImage] = useState();
    const [savedImage, setSavedImage] = useState('');
    const [firstSubmissionLoading, setFirstSubmissionLoading] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [thirdSubmissionLoading, setThirdSubmissionLoading] = useState(false);
    const [servicesLoader, setServicesLoader] = useState(false);
    const [diseasesLoader, setDiseasesLoader] = useState(false);
    const [secondSubmissionLoading, setSecondSubmissionLoading] = useState(false);
    const [experienceRowCount, setExperienceRowCount] = useState(1);
    const [secondSubmissionLoader, setSecondSubmissionLoader] = useState(false);
    const [rowCertificate, setRowCertificate] = useState(1);
    const [rowCount, setRowCount] = useState(1);

    const [profileVerificationDoctor, setProfileVerificationDoctor] = useState(null)


    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [educationForm] = Form.useForm();
    const [experienceForm] = Form.useForm();


    const [selectPairs, setSelectPairs] = useState([
        { id: 1, firstSelectValue: '', secondSelectOptions: [], thirdSelectOptions: [] }
    ]);

    useEffect(() => {
        if (selectPairs.length > 0) {
            Cookies.set('specialityElementLength', selectPairs.length)
        }
    }, [selectPairs.length])

    // Function to fetch options for the second select based on the first select value
    const fetchSecondSelectOptions = async (id, firstSelectValue) => {

        try {
            setServicesLoader(true);
            const response = await API.get(`/services?speciality_id=${firstSelectValue}`);

            setServicesLoader(false);

            // Update the options for the second select
            setSelectPairs(prevPairs => prevPairs.map(pair => {
                if (pair.id === id) {
                    return { ...pair, secondSelectOptions: response?.data?.data?.services };
                }
                return pair;
            }));
        } catch (error) {
            setServicesLoader(false);
        }
        // Calling the API here with the first select value


    };

    const fetchThirdSelectOptions = async (id, firstSelectValue) => {
        try {
            setDiseasesLoader(true);
            const response = await API.get(`/disease?all=true&speciality_id=${firstSelectValue}`);
            setDiseasesLoader(false);

            setSelectPairs(prevPairs => prevPairs.map(pair => {
                if (pair.id === id) {
                    return { ...pair, thirdSelectOptions: response?.data?.data?.disease };
                }
                return pair;
            }));
        } catch (error) {
            setDiseasesLoader(false);
        }
    }

    // Function to handle change in the first select
    const handleFirstSelectChange = (id, value) => {
        setSelectPairs(prevPairs => prevPairs.map(pair => {
            if (pair.id === id) {
                // fetchSecondSelectOptions(id, value);
                return { ...pair, firstSelectValue: value };
            }
            return pair;
        }));
        fetchSecondSelectOptions(id, value);
        fetchThirdSelectOptions(id, value);
    };

    // Function to add a new select pair
    const addSelectPair = (selectValue) => {
        if (selectValue) {
            const newId = selectPairs.length + 1;
            setSelectPairs(prevPairs => [
                ...prevPairs,
                { id: newId, firstSelectValue: selectValue, secondSelectOptions: [] }
            ]);
        }

        else {
            const newId = selectPairs.length + 1;
            setSelectPairs(prevPairs => [
                ...prevPairs,
                { id: newId, firstSelectValue: '', secondSelectOptions: [], thirdSelectOptions: [] }
            ]);
        }

    };

    // Function to remove a select pair
    const removeSelectPair = (id) => {
        if (id != 1) {
            setSelectPairs(prevPairs => prevPairs.filter(pair => pair.id !== id));
        }
    };

    const handleSubmitForm = () => {
        setSubmitForm(true);
        setConfirmFormSubmit(false);
    }

    const handleNextAbout = async (e, save) => {
        const values = form.getFieldsValue();

        try {
            await form.validateFields();

            const payload = {
                name: values?.fullName,
                phone: values?.phone,
                assistant_phone: values?.assistantPhone,
                email: values?.email,
                birth_date: values?.dateOfBirth,
                gender: values?.gender,
                city_id: values?.city,
                experience_year: values?.experience,
                image: image
            };

            const formData = new FormData();

            Object.keys(payload).forEach((item) => {
                formData.append(item, payload[item]);
            })

            if (payload?.image === null || payload?.image === '' || payload?.image === 'undefined') {
                toast.error('Invalid file type.');
            } else {
                try {
                    setFirstSubmissionLoading(true);
                    const response = await API.post('/doctor/personal-info', formData);
                    setFirstSubmissionLoading(false);
                    if (response?.data?.code === 200 && !save) {
                        handlePracticeFormSubmit();
                        setThirdSubmissionLoading(true);
                        // setCurrentStep((prevStep) => prevStep + 1);
                        setAbout(false);
                        setQualification(true)
                    }
                    else {
                        toast.error(response?.data?.message)
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


    const handleNext = async (e, save) => {
    }

    const handlePrev = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = () => {
        form.submit();
    };


    const handleFormSubmit = (values) => {
        // Submit the form data to the server using axios or your preferred method
        axios.post("/api/submit-form", values)
            .then((response) => {
                // Handle the response
                console.log(response);
            })
            .catch((error) => {
                // Handle the error
                console.error(error);
            });
    };


    useEffect(() => {
        (async () => {
            try {
                const response = await API.get(`doctor/progress`);

                if (response?.data?.code === 200) {
                    setProfileVerificationDoctor(response?.data?.data);
                }
            } catch (error) { }
        })();
    }, []);


    useEffect(() => {
        API.get(`/doctor/profile-details?specialities=1`)
            .then((res) => {
                if (res?.data?.code === 200) {
                    setProfileData(res?.data?.data);
                }
            })
    }, [])

    useEffect(() => {
        API.get(`/doctor/profile-details?bank_details=1`)
            .then((res) => {
                if (res?.data?.code === 200) {
                    setProfileData(res?.data?.data);
                }
            })
    }, [])

    useEffect(() => {
        if (Object.keys(profileData).length > 0) {
            const valuess = form.getFieldValue();
            console.log(valuess, "valuess");
            form.setFieldsValue({
                fullName: profileData?.name,
                phone: profileData?.phone,
                assistantPhone: profileData?.doctor_detail?.assistant_phone,
                email: profileData?.email,
                dateOfBirth: profileData?.birth_date === null ? null : moment(profileData?.birth_date),
                gender: profileData?.gender,
                city: profileData?.city_id,
                experience: profileData?.doctor_detail?.experience_year,
            });

            setSavedImage(profileData?.image_url); // Set the savedImage state

            const fileList = [
                {
                    uid: '12345',
                    status: 'done',
                    name: 'doctor.png',
                    url: profileData?.image_url,
                },
            ];

            form.setFieldsValue({ profilePic: fileList }); // Set the defaultFileList value
        }
    }, [JSON.stringify(profileData)]);

    //show prefilled education data

    const handleBankFormSubmit = async (e, save) => {
        try {
            await form.validateFields();

            const values = form.getFieldsValue();

            const payload = {
                account_name: values?.accountTitle,
                account_number: values?.ibanNumber,
                iban_number: values?.ibanNumber,
                bank_name: values?.bankName,
                cnic: values?.cnic
            };

            try {
                const response = await API.post('/bank-detail/updateBankDetails', payload);
                // setThirdSubmissionLoading(false);
                if (response?.data?.code === 200) {
                    setThirdSubmissionLoading(false)
                    toast.success(<p className="toast_about">About Details Submited Successfully</p>, { autoClose: 5000, })
                    setTimeout(() => {
                        setCurrentStep((prevStep) => prevStep + 1);
                    }, 5000)
                    Cookies.set('pagestatus', 'qualifications')
                    moveToQualification();
                }
                else {
                    toast.error(response?.data?.message)
                }
            } catch (error) {
                console.error(error);
            }

            // setCurrentStep((prevStep) => prevStep + 1);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (Object.keys(profileData).length > 0) {
            if (profileData?.doctor_bank_details) {
                form.setFieldsValue({
                    accountTitle: profileData?.doctor_bank_details?.account_name,
                    ibanNumber: profileData?.doctor_bank_details?.account_number,
                    bankName: profileData?.doctor_bank_details?.bank_name,
                    cnic: profileData?.doctor_detail?.cnic,
                })
            }
        }
    }, [JSON.stringify(profileData)])

    useEffect(() => {
        if (profileData?.doctor_detail) {
            form.setFieldsValue({
                about: profileData?.doctor_detail?.about,
                pmdc: profileData?.doctor_detail?.pmc_no,
            })
        }
        if (profileData?.doctor_specialities?.length > 0) {
            const initialValues = {};

            const newSelectPairs = profileData.doctor_specialities.map((speciality, index) => {
                const { speciality_id } = speciality;

                const selectPair = {
                    id: index + 1,
                    firstSelectValue: "", // Set the initial value for firstSelectValue
                    secondSelectOptions: [], // Set the initial value for secondSelectOptions
                    thirdSelectOptions: [], // Set the initial value for thirdSelectOptions
                    [`speciality${speciality_id}`]: speciality_id,
                    [`service${speciality_id}`]: null,
                    [`condition${speciality_id}`]: [],
                };

                form.setFieldsValue({
                    [`service${index + 1}`]: speciality?.doctor_services?.id,
                    [`speciality${index + 1}`]: speciality_id
                })

                let conditions = [];


                // Check if the speciality ID exists in the conditionsMap
                if (speciality.doctor_conditions.length > 0) {
                    speciality.doctor_conditions.forEach((condition) => {
                        conditions.push(condition?.disease_id);
                        const conditionName = condition?.name;
                        const conditionId = condition?.disease_id;
                        selectPair[`condition${speciality_id}`].push(conditionId);
                        initialValues[`condition${speciality_id}`] = initialValues[`condition${speciality_id}`] || [];
                        initialValues[`condition${speciality_id}`].push(conditionId);
                        selectPair?.thirdSelectOptions.push({ name: conditionName, id: conditionId })

                    });
                    form.setFieldsValue({
                        [`condition${index + 1}`]: conditions
                    })
                } else {
                    initialValues[`condition${speciality_id}`] = [];
                }

                // Check if the speciality ID exists in the servicesMap
                if (speciality.doctor_services) {
                    selectPair[`service${speciality_id}`] = speciality.doctor_services.id;
                    initialValues[`service${speciality_id}`] = speciality.doctor_services.id; // Set the initial value for the service field
                    selectPair?.secondSelectOptions.push({ name: speciality.doctor_services.name, id: speciality.doctor_services.id })

                }

                Object.assign(initialValues, selectPair); // Merge selectPair into initialValues

                return selectPair;
            });

            setSelectPairs(newSelectPairs);
            form.setFieldsValue(initialValues);
            console.log(selectPairs, "newSelectPairs");
        }
    }, [form, profileData?.doctor_specialities]);


    const handlePracticeFormSubmit = async (e, save) => {
        try {
            await form.validateFields();

            const values = form.getFieldsValue();
            console.log(values, "haseeb")

            // console.log(values['speciality'+ 1], 'spect')

            let selectLength = Cookies.get('specialityElementLength');

            let service = [];
            let condition = [];
            let speciality = [];

            for (let i = 1; i <= selectLength; i++) {
                speciality.push(values['speciality' + i]);
                service.push(values['service' + i])
                condition.push(values['condition' + i])
            }

            let payload = {
                service,
                condition,
                speciality,
                about: values?.about,
                pmc_no: values?.pmdc
            };

            try {
                // setSecondSubmissionLoading(true);
                const response = await API.post('/doctor/register/doctor/practice-detail', payload);
                // setSecondSubmissionLoading(false);
                if (response?.data?.code === 200 && !save) {
                    handleBankFormSubmit();
                    // setAbout(false);
                    // setQualification(true);
                } else {
                    toast.error(response?.data?.message)
                }

            } catch (error) {
                // setSecondSubmissionLoading(false);
                console.error(error);
            }


        } catch (err) {
            console.error(err);
        }
    }

    const handleExperienceSubmit = async (e, save) => {
        try {
            await experienceForm.validateFields();
            const values = experienceForm.getFieldsValue();

            let exp = [];

            for (let i = 1; i <= experienceRowCount; i++) {
                exp.push({
                    position: values['designation' + i],
                    institute: values['institute' + i],
                    start_year: values['startyear' + i],
                    end_year: values['endyear' + i]
                })

            }

            let certification = [];

            for (let i = 1; i <= rowCertificate; i++) {
                certification.push(values['membershipcertificate' + i]);
            }

            let payload = {
                exp: exp,
                certification: certification

            };

            try {
                setSecondSubmissionLoader(true);
                const response = await API.post(`doctor/register/doctor/experience-api`, payload);
                setSecondSubmissionLoader(false);
                if (response?.data?.code === 200 && !save) {
                    Cookies.remove('pagestatus');
                    Cookies.set('pageStatus', 'consultation')
                    // setCurrentStep((prevStep) => prevStep + 1);
                    setConsultation(true)
                    setQualification(false)

                }

            } catch (error) {
                console.error(error);
                setSecondSubmissionLoader(false);
            }

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <>
            {thirdSubmissionLoading === true ? (
                <>
                    <Loader />
                </>
            ) : null}
            <div className="steps_form">
                <Steps current={profileVerificationDoctor?.about_completion === 40 && 1 && profileVerificationDoctor?.qualification_completion === 30 && 2 && profileVerificationDoctor?.consultation_completion === 30 && 3 || currentStep}>
                    <Step key="about" title="About" />
                    <Step key="qualifications" title="Qualifications" />
                    <Step key="consultations" title="Consultations" />
                </Steps>
                <div style={{ marginTop: 16 }} className="main_step_box mobile_box">
                    {currentStep === 0 && (
                        <Form form={form} onFinish={handleNextAbout} className="">
                            <h2>Personal Information</h2>
                            <div className="mb-25 toast_sucsess01"><PersonalInformation setImage={setImage} savedImage={savedImage} /></div>
                            <h2>Practice Details</h2>
                            <div className="mb-40">
                                <PracticeDetail
                                    servicesLoader={servicesLoader}
                                    diseasesLoader={diseasesLoader}
                                    addSelectPair={addSelectPair}
                                    selectPairs={selectPairs}
                                    handleFirstSelectChange={handleFirstSelectChange}
                                    removeSelectPair={removeSelectPair}
                                />
                            </div>
                            <h2>Bank Details</h2>
                            <BankDetail />
                            <div className="buttons_box">
                                <div className="box_buttons">
                                    <Button type="primary" disabled={firstSubmissionLoading} onClick={(e) => handleNext(e, true)} className="btn btn-01 bg-light1 me-3" >
                                        Save
                                    </Button>
                                    <Button type="submit" htmlType="submit" className="btn btn-01  bg-dark1">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                    {currentStep === 1 && (
                        <Form form={educationForm}>
                            <h2><button onClick={handlePrev} className="me-2"> <img src={backIcon} className="img-fliud"></img></button> Education</h2>
                            <StepTwo setListner={setListner} setCurrentStep={setCurrentStep} setAbout={setAbout} setConsultation={setConsultation} setQualification={setQualification} moveToConsultation={moveToConsultation} />
                            {/* <div className="buttons_box">
                                <div className="box_buttons">
                                    <Row>
                                        <Col lg={12} md={12} className="text-center">
                                            <Button type="primary" className="btn btn-01 bg-light1 me-3" >
                                                Save
                                            </Button>
                                            <Button type="submit" onClick={handleNextQualification} className="btn btn-01  bg-dark1">
                                                Next
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div> */}
                        </Form>
                    )}
                    {currentStep === 2 && (
                        <Form form={experienceForm} onFinish={handleSubmit}>
                            {/* Add fields for education information */}
                            <h2><button onClick={handlePrev} className="me-2"> <img src={backIcon} className="img-fliud"></img></button> Consultation Details</h2>
                            {/* <VideoConsultation /> */}
                            <StepThree setListner={setListner} setConsultation={setConsultation} setQualification={setQualification} />

                            {/* <div className="buttons_box box_buttons ">
                                <Row>

                                    <Col lg={6} md={6} className="text-center ">
                                        <Button type="primary" className="btn btn-01 bg-light1 me-3" >
                                            Save
                                        </Button>
                                        <Button type="primary"
                                            className="btn btn-01  bg-dark1" htmlType="submit">
                                            Next
                                        </Button>
                                    </Col>
                                </Row>
                            </div> */}
                        </Form>
                    )}
                </div>
            </div>


            <Modal
                title=""
                centered
                visible={confirmFormSubmit}
                onOk={() => setConfirmFormSubmit(false)}
                onCancel={() => setConfirmFormSubmit(false)}
                className="confirmFormSubmit "
            >
                <div className="confirmModal">
                    <div className="text-center">
                        <img src={imageFormModal} className="img-fluid"></img>
                        <h6>Your profile will be verified within 3 working days</h6>
                        <hr></hr>
                    </div>
                    <div className="list_modal">
                        <p>Please make sure that you have added the following
                            fields correctly:</p>
                        <ul className="listing">
                            <li>
                                PMDC Number
                            </li>
                            <li>
                                Email Address / Number
                            </li>
                            <li>
                                Profile image
                            </li>

                        </ul>
                        <div className="text-center">
                            <Button className="btn btn-modal" onClick={handleSubmitForm}>SUBMIT</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                title=""
                centered
                visible={submitForm}
                onOk={() => setSubmitForm(false)}
                onCancel={() => setSubmitForm(false)}
                className="confirmFormSubmit hideclosebtn"
            >
                <div className="confirmModal">
                    <div className="text-center pd-5">
                        <img src={imageFormModal} className="img-fluid"></img>
                        <h6>Your profile has been
                            submitted successfully!</h6>
                    </div>
                    <div className="list_modal text-center">
                        <p className="m-0 pb-4 text-black">Our team will verify your information to ensure authenticity.<br></br> Thank you for your patience during this process. </p>

                        <div className="text-center">
                            <Button className="btn btn-modal" onClick={() => setSubmitForm(false)}>OKAY</Button>
                        </div>
                    </div>

                </div>
            </Modal>


        </>
    );
}

export default MobileSteps;