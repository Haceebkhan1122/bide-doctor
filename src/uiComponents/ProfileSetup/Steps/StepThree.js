import React, { useEffect, useState } from "react";
import './Steps.scss';
import { Steps, Button, Form, Input, Select, Modal } from "antd";
import imageFormModal from "../../../assets/images/png/image-form.png";
import VideoConsultation from "./stepsForm/VideoConsultation";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import API from "../../../utils/customAxios";
import { useHistory } from "react-router-dom";
import Loader from "../../../uiComponents/loader/Loader";
import Cookies from "js-cookie";
import { isMobile } from "react-device-detect";
const { Step } = Steps;
const { Option } = Select;

function StepThree({ setQualification, setConsultation, setListner }) {
    const history = useHistory();


    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [confirmFormSubmit, setConfirmFormSubmit] = useState(false);
    const [submitForm, setSubmitForm] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [videoConsultCheckbox, setVideoConsultCheckbox] = useState(false);
    const [videoClinicCheckbox, setVideoClinicCheckbox] = useState(false);
    const [submissionLoader, setSubmissionLoader] = useState(false);

    const [videoClinics, setVideoClinics] = useState([{
        id: 1
    }])
    const [videoSlots, setVideoSlots] = useState([{
        clinicId: 1,
        slotsId: 1
    }])

    const [videoTimeSlots, setVideoTimeSlots] = useState([
        {
            clinicId: 1,
            slotsId: 1,
            timeSlotId: 1,
            day: ''
        }
    ])

    const [clinicVisit, setClinicVisit] = useState([{
        id: 1
    }])
    const [clinicSlots, setClinicSlots] = useState([{
        clinicId: 1,
        slotsId: 1
    }])

    const [clinicTimeSlots, setClinicTimeSlots] = useState([
        {
            clinicId: 1,
            slotsId: 1,
            timeSlotId: 1,
            day: ''
        }
    ])

    useEffect(() => {
        API.get(`/doctor/profile-details?clinics=1`)
            .then((res) => {
                if (res?.data?.code === 200) {
                    setProfileData(res?.data?.data);
                }
            })
    }, [])

    // Prefilled Video Data

    useEffect(() => {

        if (Object.keys(profileData)?.length > 0) {
            const doctorClinics = profileData?.doctor_clinics;

            if (doctorClinics?.length > 0) {


                for (let i = 0; i < doctorClinics?.length; i++) {


                    if (doctorClinics?.[i]?.clinic_id === 0) {
                        form.setFieldsValue({
                            ['video_mins']: doctorClinics?.[i]?.consultation_duration,
                            ['video_fee']: doctorClinics?.[i]?.consultation_fee
                        })
                        let days = [];

                        for (let j = 0; j < doctorClinics?.[i]?.clinic_timings?.length; j++) {
                            days.push(doctorClinics?.[i]?.clinic_timings?.[j]?.day);

                            if (j > 0) {


                                setVideoTimeSlots([
                                    ...videoTimeSlots,
                                    {
                                        clinicId: 1,
                                        slotsId: i + 1,
                                        timeSlotId: videoTimeSlots.length + 1
                                    }

                                ])
                            }

                            form.setFieldsValue({
                                [`video_starttime${j + 1}`]: moment(doctorClinics?.[i]?.clinic_timings?.[j]?.start_time, 'HH:mm:ss'),
                                [`video_endtime${j + 1}`]: moment(doctorClinics?.[i]?.clinic_timings?.[j]?.end_time, 'HH:mm:ss'),
                                // [`visit-day${i+1}`]: [doctorClinics?.[i]?.clinic_timings?.[j]?.day]
                            })
                        }

                        form.setFieldsValue({
                            [`video_day${i + 1}`]: days
                        })
                    }
                }
            }
        }

    }, [JSON.stringify(profileData)])

    // prefilled clinic visit data

    useEffect(() => {

        if (Object.keys(profileData)?.length > 0) {
            let doctorClinics = profileData?.doctor_clinics;

            doctorClinics = doctorClinics?.filter((clinic) => {
                return clinic?.clinic_id != 0;
            })

            if (doctorClinics?.length > 0) {


                for (let i = 0; i < doctorClinics?.length; i++) {


                    if (i > 0) {
                        addAnotherClinic();
                    }


                    form.setFieldsValue({
                        [`visit-clinic_id${i + 1}`]: doctorClinics?.[i]?.clinic_id,
                        [`visit-consultation_fee${i + 1}`]: doctorClinics?.[i]?.consultation_fee,
                        [`visit-mins${i + 1}`]: doctorClinics?.[i]?.consultation_duration,
                    });

                    let days = [];

                    for (let j = 0; j < doctorClinics?.[i]?.clinic_timings?.length; j++) {
                        console.log(j, "aruu")
                        console.log(doctorClinics?.[i]?.clinic_timings?.[j]?.start_time, 'zetime')

                        days.push(doctorClinics?.[i]?.clinic_timings?.[j]?.day);

                        if (j > 0) {
                            console.log("weow")

                            addClinicTimeSlot(null, i + 1, i + 1)

                            // setClinicTimeSlots([
                            //     ...clinicTimeSlots,
                            //     {
                            //         clinicId: i+1,
                            //         slotsId: i+1,
                            //         timeSlotId: clinicTimeSlots.length + 1
                            //     }

                            // ])
                        }

                        form.setFieldsValue({
                            [`visit-start_time${j + 1}`]: moment(doctorClinics?.[i]?.clinic_timings?.[j]?.start_time, 'HH:mm:ss'),
                            [`visit-end_time${j + 1}`]: moment(doctorClinics?.[i]?.clinic_timings?.[j]?.end_time, 'HH:mm:ss'),
                            // [`visit-day${i+1}`]: [doctorClinics?.[i]?.clinic_timings?.[j]?.day]
                        })
                    }

                    form.setFieldsValue({
                        [`visit-day${i + 1}`]: days
                    })


                }
            }
        }

    }, [JSON.stringify(profileData)])


    const handleNext = async (e, save) => {
        try {
            // await form.validateFields();
            // setCurrentStep((prevStep) => prevStep + 1);

            // payload setup for video clinics


            let fieldsToValidate = [];

    
            if (videoClinicCheckbox) {
                fieldsToValidate.push('visit-clinic_id1');
                fieldsToValidate.push('visit-mins1');
                fieldsToValidate.push('visit-consultation_fee1');
                fieldsToValidate.push('visit-start_time1');
                clinicTimeSlots.forEach((item) => {
                    fieldsToValidate.push(`visit-end_time${item?.timeSlotId}`);
                    fieldsToValidate.push(`visit-clinic_location${item.clinicId}`);
                })
        

            
            }

            if (videoConsultCheckbox) {
                fieldsToValidate.push('video_mins');
                fieldsToValidate.push('video_fee');
                fieldsToValidate.push('video_starttime1');
                videoTimeSlots.forEach((item) => {
                    fieldsToValidate.push(`video_endtime${item?.timeSlotId}`);
                    
                })
                    }

            await form.validateFields(fieldsToValidate)

            const values = form.getFieldsValue();

            let videoPayload = {};

            if (values.hasOwnProperty('video_mins')) {
                videoPayload.consultation_duration = values['video_mins'];
                videoPayload.consultation_fee = values['video_fee'];

                let schedule = [];

                for (let i = 0; i < videoSlots.length; i++) {
                    for (let j = 0; j < videoTimeSlots.length; j++) {
                        if (videoSlots[i].slotsId === videoTimeSlots[j].slotsId) {
                            schedule?.push({
                                days: videoTimeSlots[j].day ? videoTimeSlots[j].day : "monday",
                                start_time: moment(values[`video_starttime${j + 1}`]).format('HH:mm:ss'),
                                end_time: moment(values[`video_endtime${j + 1}`]).format('HH:mm:ss'),
                            })
                        }
                    }
                }

                videoPayload.schedule = schedule;
            }

            //Payload setup for clinic visit

            let clinic = [];

            let scheduleForVisit = [];

            if (values.hasOwnProperty('visit-clinic_id1')) {

                let clinicLocal = [];
                for (let i = 0; i < clinicVisit.length; i++) {
                    // console.log(values[`visit-clinic_id${i+1}`], "monis")
                    // clinicVisit.push({clinic_id: values[`visit-clinic_id${i+1}`]});
                    // clinicVisit.push({consultation_duration: values[`visit-mins${i+1}`]});
                    // clinicVisit.push({consultation_fee: values[`visit-consultation_fee${i+1}`]});
                    // clinic.push({consultation_fee: values[("visit-consultation_fee"+(i+1))]});
                    clinicLocal.push({
                        clinic_id: values[`visit-clinic_id${i + 1}`],
                        consultation_duration: values[`visit-mins${i + 1}`],
                        consultation_fee: values[`visit-consultation_fee${i + 1}`]
                    })

                    let scheduleLocal = [];

                    for (let j = 0; j < clinicSlots.length; j++) {
                        if (clinicSlots[j].clinicId === clinicVisit[i].id) {
                            for (let k = 0; k < clinicTimeSlots.length; k++) {
                                if (clinicTimeSlots[k].slotsId === clinicSlots[j].clinicId) {
                                    scheduleLocal?.push({
                                        days: clinicTimeSlots[k].day ? clinicTimeSlots[k].day : "monday",
                                        start_time: moment(values[`visit-start_time${k + 1}`]).format('HH:mm:ss'),
                                        end_time: moment(values[`visit-end_time${k + 1}`]).format('HH:mm:ss'),
                                    })
                                }

                            }
                        }
                    }


                    clinic?.push({
                        clinic_id: values[`visit-clinic_id${i + 1}`],
                        consultation_duration: values[`visit-mins${i + 1}`],
                        consultation_fee: values[`visit-consultation_fee${i + 1}`],
                        schedule: scheduleLocal
                    })
                }
            }

            let payload = {};

            if (clinic.length > 0) {
                payload.is_clinic_visit = clinic
            }

            if (Object.keys(videoPayload).length > 0) {
                payload.is_video_consultation = videoPayload;
            }

            try {
                setSubmissionLoader(true);
                const response = await API.post('/doctor/time-slots', payload);
                setSubmissionLoader(false);
                if (response?.data?.code === 200 && !save) {
                    toast.success('Details submitted successfully')
                    setListner((prevStep) => !prevStep);
                    setConfirmFormSubmit(true)
                    Cookies.remove('pageStatus')
                } else {
                    toast.success(response?.data?.message)
                }
            } catch (error) {
                setSubmissionLoader(false);
            }



        } catch (err) {
            console.error(err);
        }
    };

    const handlerConfirmFormSubmit = () => {
        setConfirmFormSubmit(true);
    }

    const handleSubmitForm = () => {
        setConfirmFormSubmit(false);
        setSubmitForm(true);
    }
    const handleSubmit = () => {
        form.submit();
    };

    // For clinic visit state and manipulation functions 



    function addAnotherClinic() {
        addClinicTimeSlot(null, clinicVisit.length + 1, clinicSlots.length + 1)
        addClinicSlot(null, clinicVisit.length + 1);

        setClinicVisit([
            ...clinicVisit,
            { id: clinicVisit.length + 1 }
        ])
    }

    function deleteClinic(e, clinicId) {
        setClinicVisit(clinicVisit?.filter((clinic) => clinic?.id != clinicId));
    }

    function addClinicSlot(e, clinicId) {
        addClinicTimeSlot(null, clinicId, clinicSlots.length + 1)

        setClinicSlots([
            ...clinicSlots,
            {
                clinicId: clinicId,
                slotsId: clinicSlots.length + 1
            }
        ])
    }

    function deleteClinicSlot(e, slotId) {
        const slots = clinicSlots?.filter((item) => {
            return item?.slotsId !== slotId
        });

        setClinicSlots(slots);
    }

    function addClinicTimeSlot(e, clinicId, slotId) {
        console.log("zayk")

        setClinicTimeSlots([
            ...clinicTimeSlots,
            {
                clinicId: clinicId,
                slotsId: slotId,
                timeSlotId: clinicTimeSlots.length + 1
            }

        ])
    }

    function deleteClinicTimeSlot(e, clinicId, slotId, timeSlotId) {
        const slots = clinicTimeSlots?.filter((item) => {
            return item?.timeSlotId !== timeSlotId
        });


        setClinicTimeSlots(slots);
    }

    const handleSubmitAfter = () => {
        setSubmitForm(false)
        history.push('/')
    }

    const handlePrev = () => {
        setConsultation(false);
        setQualification(true);
    }

    return (
        <>
            {submissionLoader && (
                <Loader />
            )}
            <div className="steps_form">
                {!isMobile ? (
                    <>
                        <Steps current={currentStep}>
                            <Step key="consultations" title="Consultations" />
                        </Steps>
                    </>
                ) : null}

                <div style={{ marginTop: 16 }}>
                    {currentStep === 0 && (
                        <Form form={form} onFinish={handleNext}>
                            <VideoConsultation
                                videoClinics={videoClinics}
                                setVideoClinics={setVideoClinics}
                                videoSlots={videoSlots}
                                setVideoSlots={setVideoSlots}
                                videoTimeSlots={videoTimeSlots}
                                setVideoTimeSlots={setVideoTimeSlots}
                                clinicVisit={clinicVisit}
                                setClinicVisit={setClinicVisit}
                                clinicSlots={clinicSlots}
                                setClinicSlots={setClinicSlots}
                                clinicTimeSlots={clinicTimeSlots}
                                setClinicTimeSlots={setClinicTimeSlots}
                                videoConsultCheckbox={videoConsultCheckbox}
                                videoClinicCheckbox={videoClinicCheckbox}
                                setVideoClinicCheckbox={setVideoClinicCheckbox}
                                setVideoConsultCheckbox={setVideoConsultCheckbox}
                            />

                            {/* Add more fields for profile information */}
                            <div className="buttons_box">
                                <div className="box_buttons">
                                    <Row>
                                        <Col lg={6} md={6} className="text-start">
                                            {!isMobile ? (
                                                <>
                                                    <Button className="btn  btn-01 bg-light1" onClick={handlePrev}>
                                                        Back to Qualifications
                                                    </Button>
                                                </>
                                            ) : null}
                                        </Col>
                                        {isMobile && !videoConsultCheckbox && !videoClinicCheckbox ? (
                                            <>
                                                <Col lg={6} md={6} className="text-end hk_bottom_stick">
                                                    <Button disabled style={{ marginRight: 8, opacity: 1, backgroundColor: '#EFEFEF', color: '#8E8E8E', display: 'block', textAlign: 'center', margin: 'auto', border: 'none' }} className="btn btn-01 bg-light1">
                                                        Next
                                                    </Button>
                                                </Col>
                                            </>
                                        ) : (
                                            <Col lg={6} md={6} className={isMobile ? 'text-center' : 'text-end'}>
                                                <Button style={{ marginRight: 8 }} className="btn btn-01 bg-light1" onClick={(e) => handleNext(e, true)} >
                                                    Save
                                                </Button>
                                                <Button type="primary" className="btn btn-01 bg-dark1 ss" onClick={handleNext}  >
                                                    Next
                                                </Button>
                                            </Col>
                                        )}

                                    </Row>
                                </div>
                            </div>

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
                className="confirmFormSubmit"
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

                        {isMobile ? (
                            <div className="text-center">
                            <Button className="btn btn-modal" onClick={handleSubmitAfter}>OK</Button>
                        </div>
                        ) :  <div className="text-center">
                        <Button className="btn btn-modal" onClick={handleSubmitAfter}>OKAY</Button>
                    </div> }
                        
                    </div>

                </div>
            </Modal>
            <div className="toast_blue width_toast">
        <ToastContainer />
      </div>
        </>
    );
}

export default StepThree;