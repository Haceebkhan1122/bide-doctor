import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Input, Modal, Popconfirm, Select, Switch, Checkbox } from "antd";
import { Col, Collapse, Container, Row, Table } from "react-bootstrap";
import MedCancelCard from "../../uiComponents/card/medCancelCard/MedCancelCard";
import {
    HeadingDesc,
    HeadingDescSmall,
    HeadingDescVsmall,
    HeadingWithSpaceLarge,
} from "../../uiComponents/Headings";
import StickyTab from "../../uiComponents/stickyTab/StickyTab";
import { TableComponent } from "../../uiComponents/tableComponent";
import deleteIconPink from "../../assets/images/svg/delete_icon_pink.svg";
import arrowdropdown from "../../assets/images/svg/dropdown-icon.svg";
import fileIcon from "../../assets/images/png/view.png";
import { FiArrowRightCircle, FiChevronRight, FiCircle, FiCheckCircle } from "react-icons/fi";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
    getAppointmentData,
    getDiseases,
    getMedicine,
    getLab,
    postConsult,
    getVitalScan,
} from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import arrowDownload from '../../assets/images/svg/arrow-download-circle.svg';
import logo from '../../assets/images/svg/meri-sehat-logo.svg';
import logoMob from '../../assets/images/svg/logo-mobile.svg';
import featuredDoc from '../../assets/images/png/featured_doc.png';

import drSaad from '../../assets/images/png/dr-saad.jpg';

import FeaturedTick from '../../assets/images/png/featured_doc.png';
import DrPicture from '../../assets/images/png/dr-saad.jpg';
import LoaderTimer from '../../assets/images/gif/loading_spinner.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    selectAppointmentData,
    selectDiseases,
    selectMedicine,
    selectLabs,
    selectMedical,
    selectAppointmentToken,
    selectVitalScan,
    selectInstantMedical,
    selectAppointmentDataSuccess,
} from "./redux/slice";
import "./Appointments.scss";
import LabForm from "../../uiComponents/form/LabForm";
import MedForm from "../../uiComponents/form/MedForm";
import Agora from "../../uiComponents/agora/Agora";
import { ToastContainer, toast } from "react-toastify";
import Countdown from "react-countdown";
// import FsLightbox from 'fslightbox-react';
import "yet-another-react-lightbox/styles.css";
import { downloadPrescription, getAge } from "../../helpers/utilityHelper";
import { RouterPrompt } from "../../uiComponents/RouterPrompt";
import disableConsultation from "../../assets/images/svg/instant-disable-modal.svg";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import RemovePre from "../../assets/images/svg/removePre.svg";
import EditPre from "../../assets/images/svg/EditPre.svg";
import { useEffectOnce } from "react-use";
import API from "../../utils/customAxios";
import { selectDashboard } from "../dashboard/redux/slice";
import { getDashboardDetails } from "../dashboard/redux/thunk";
import { acquireApi, startApi, stopApi } from "../../utils/agoraEndpoints";
import axios from "axios";
import "./appointmentFirstTime.css";
import { AiOutlineFile } from "react-icons/ai";
import AgoraRTM from "agora-rtm-sdk";
import TablePreviousHistory from "../../uiComponents/tableComponent/TablePreviousHistory/TablePreviousHistory";
import TabItem from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav';
import moment from 'moment';
import Accordion from 'react-bootstrap/Accordion';
import { isMobile } from "react-device-detect";
import smilyFace from '../../assets/images/png/smily.png'
import stressFace from '../../assets/images/png/stress-emojy.png'






let arr = new Set();

function AppointmentFirstTime(props) {
    const doctorId = localStorage.getItem("D_USER_ID");

    let stagingName = `S${doctorId}`;
    let prodName = `L${doctorId}`;

    let firstPrefix = process.env.REACT_APP_BASE_URL?.includes("staging")
        ? stagingName
        : prodName;

    const history = useHistory();
    const params = useParams();
    const textareaRef = useRef();

    const [tabValue, setTabValue] = React.useState("1");
    const [tabSwitchState, setTabSwitchState] = useState(0);
    const [rtmToken, setRtmToken] = useState("");

    const handleTabs = (event, newValue) => {
        if (tabSwitchState === 1 && newValue === "2") {
        } else if (tabSwitchState === 2 && newValue === "1") {
        } else {
            setTabValue(newValue);
        }
    };

    const dispatch = useAppDispatch();
    const location = useLocation();
    const selectDashboardDetails = useAppSelector(selectDashboard);

    if (location?.state?.user_id) {
        sessionStorage.setItem("user_id", location?.state?.user_id);
    }

    if (location?.state?.visit_count) {
        sessionStorage.setItem("visit_count", location?.state?.visit_count);
    }

    const AppointmentData = useAppSelector(selectAppointmentData);
    const vitalScan = useAppSelector(selectVitalScan);
    const conditions = useAppSelector(selectDiseases);
    const medicine = useAppSelector(selectMedicine);
    const labs = useAppSelector(selectLabs);
    // const medical = useAppSelector(selectMedical);
    const medical = useAppSelector(selectInstantMedical);
    const [appForm] = Form.useForm();
    const appointmentToken = useAppSelector(selectAppointmentToken);
    // console.log(location);
    let id = params.id;
    let user_id = sessionStorage.getItem("user_id");
    let visit_count = sessionStorage.getItem("visit_count");
    const [startCall, setStartCall] = useState(false);
    const [config, setConfig] = useState(null);
    const [toggler, setToggler] = useState(false);
    const [toggler1, setToggler1] = useState(false);
    const [loader, setLoader] = useState(false);
    const [note, setNote] = useState("");
    const [gnote, setGNote] = useState("");
    const [med, setMed] = useState([]);
    const [cond, setCond] = useState([]);
    const [patient, setPatient] = useState({
        name: "",
        age: "",
        gender: "",
        reason: "",
        prescription: "",
        previous_consultation: "",
    });
    const [medData, setMedData] = useState([]);
    const [medTable, setMedTable] = useState([]);
    const [vitalTable, setVitalTable] = useState([]);
    const [medicalRec, setMedicalRec] = useState([]);
    const [recFiles, setRecFiles] = useState([]);
    const [prevData, setPrevData] = useState([]);
    const [timeRem, setTimeRem] = useState(0);
    const [prescribeData, setPrescribeData] = useState([]);
    const [count, setCount] = useState(0);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal3Visible, setModal3Visible] = useState(false);
    const [modal4Visible, setModal4Visible] = useState(false);
    const [endAnnounced, setendAnnounced] = useState(false);
    const [blockUserExit, setBlockUserExit] = useState(true);
    const [formValues, setFormValues] = useState({});
    const { Option } = Select;
    const { TextArea } = Input;
    const [mobile, setMobile] = useState(false);
    const [writePrescriptionInfo, setWritePrescriptionInfo] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [errorPrescription, setErrorPrescription] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [channelToken, setChannelToken] = useState("");
    const [resourceId, setResourceId] = useState("");
    const [stopId, setStopId] = useState("");
    const [instantMedicalRecords, setInstantMedicalRecords] = useState([]);
    const [prev_consultation, setPrevConsultation] = useState([]);
    const [appointmentCompleted, setAppointmentCompleted] = useState(false);
    const [shouldDispatchMedicine, setShouldDispatchMedicine] = useState(false);
    const [pendingAppointments, setPendingAppointments] = useState(false);
    const [userCity, setUserCity] = useState("");
    const [activeTab, setActiveTab] = useState('');

    const [startNextConsultation, setStartNextConsultation] = useState(false);

    const [key, setKey] = useState('home');

    // console.log(location?.search?.split('?'));
    useEffect(() => {
        setLoader(false);
        // dispatch(getMedicalRecord(user_id));
        // dispatch(getInstantMedicalRecord(1035));
        if (id) {
            dispatch(getAppointmentData(id));
        }

        dispatch(getVitalScan(user_id));
        dispatch(getMedicine());
        dispatch(getLab());
        dispatch(getDiseases());
        if (typeof window !== "undefined") {
            if (window.innerWidth < 600) {
                setMobile(true);
            }
        }
    }, [id]);




    // useEffect(() => {
    //   (async() => {
    //     const response = await API.get(`/generate-agora-rtm-token`);

    //     if (response?.data?.code === 200) {
    //       setRtmToken(response?.data?.data?.token);
    //     }
    //   })()
    // }, [])

    // console.log(AppointmentData, "AppointmentData")
    useEffect(() => {
        (async () => {
            try {
                const response = await API.get(
                    `/generate-agora-link?appointment_id=${params.id}`
                );

                if (response?.data?.code === 200) {
                    setChannelName(response?.data?.data?.channel_name);
                    setChannelToken(response?.data?.data?.agora_token);
                }
            } catch (error) {
                // console.log(error, 'agorrerror');
            }
        })();
    }, []);

    useEffect(() => {
        if (channelName) {
            (async () => {
                const body = {
                    cname: channelName,
                    uid: params?.id?.toString(),
                    clientRequest: {
                        resourceExpiredHour: 24,
                        scene: 0,
                    },
                };

                const customerKey = process.env.REACT_APP_AGORA_CUSTOMER_KEY;
                const customerSecret = process.env.REACT_APP_AGORA_CUSTOMER_SECRET;

                const response = await axios.post(acquireApi, body, {
                    auth: {
                        username: customerKey,
                        password: customerSecret,
                    },
                });

                if (response.status === 200) {
                    const startAgoraAPI = startApi(response?.data?.resourceId);

                    const payload = {
                        cname: channelName,
                        uid: params?.id?.toString(),
                        clientRequest: {
                            token: channelToken,
                            recordingConfig: {
                                // https://docs.agora.io/en/cloud-recording/reference/rest-api/start#recording-configuration
                                maxIdleTime: 120,
                                streamTypes: 2,
                                audioProfile: 1,
                                channelType: 0, //used for communication. if live broadcast, set to 1
                                videoStreamType: 0,
                                transcodingConfig: {
                                    width: 640,
                                    height: 480,
                                    fps: 30,
                                    bitrate: 600,
                                    mixedVideoLayout: 1,
                                },
                            },

                            recordingFileConfig: {
                                avFileType: ["hls", "mp4"],
                            },
                            storageConfig: {
                                vendor: 1, //Here 1 means AWS S3
                                region: 8, // AP_SOUTHEAST_1
                                bucket: "agora-recording-s",
                                accessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
                                secretKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                                fileNamePrefix: [firstPrefix, params?.id?.toString()],
                            },
                        },
                    };
                    try {
                        const res = await axios.post(startAgoraAPI, payload, {
                            auth: {
                                username: customerKey,
                                password: customerSecret,
                            },
                        });

                        setResourceId(res?.data?.resourceId);
                        setStopId(res?.data?.sid);
                    } catch (error) {
                        // console.log(error);
                    }
                }
            })();
        }
    }, [channelName]);

    useEffectOnce(() => {
        dispatch(getDashboardDetails());
    });

    useEffect(() => {
        let interval = setInterval(async () => {
            const res = await API.get(`/instant-medical-record?user_id=${user_id}`);

            setMedicalRec(res?.data?.data);
        }, 10000);

        return function () {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        setVitalTable(vitalScan?.data);
    }, [vitalScan]);

    // useEffect(() => {
    //   setMedicalRec(medical?.data)
    // }, [medical]);

    useEffect(() => {
        window.addEventListener("unload", function (e) {
            // console.log('cancelled appointment');
        });
    }, []);

    // console.log(AppointmentData?.data, "app_data");

    useEffect(() => {
        if (AppointmentData?.data) {
            setUserCity(AppointmentData?.data?.user?.city);

            let data = {};
            data.patient = AppointmentData?.data?.user;
            data.reason = AppointmentData?.data?.reason;
            data.type = AppointmentData?.data?.type;
            data.prescription = AppointmentData?.data?.prescription;
            data.previous_consultation = AppointmentData?.data?.previous_consultation;

            setActiveTab(AppointmentData?.data?.previous_consultation?.[0]?.id);

            axios
                .get(`${process.env.REACT_APP_BASE_URL}/patient-info`, {
                    headers: {
                        // 'user-id': AppointmentData?.data?.user_id
                        "user-id": user_id,
                    },
                })
                .then((res) => {
                    // console.log(res, 'promise')
                    setPatient({
                        name: res?.data?.data?.name,
                        age: getAge(res?.data?.data?.date_of_birth),
                        gender: res?.data?.data?.gender,
                        reason: data?.reason,
                        type: AppointmentData?.data?.type,
                        prescription: data?.prescription,
                        previous_consultation: AppointmentData?.data?.previous_consultation,
                    });
                });

            setStartCall(data.type == "in-person" ? false : true);
            setLoader(true);
        }

        if (AppointmentData?.data?.remaining_time) {
            let currentDateTime = new Date();
            setTimeRem(new Date(currentDateTime.getTime() + parseInt(AppointmentData?.data?.remaining_time) * 1000));
            // setTimeRem(new Date(currentDateTime.getTime() + parseInt(9400) * 1000));
        }

        // if (AppointmentData?.data?.previous_consultation) {

        //   AppointmentData?.data?.previous_consultation.forEach((d) => {
        //     // console.log("Mapping appointment data", d);

        //     if (!prev_consultation?.includes(d)) {
        //       setPrevConsultation(d);
        //     }

        //   })

        // }
    }, [AppointmentData]);

    // const ErrorNull = () => {
    //   setErrorPrescription('')
    // }

    function writePrescription(e) {
        setErrorPrescription("");
        e.preventDefault();
        if (textareaRef.current.value === "") {
            setErrorPrescription("Field cannot be left empty");
        }

        if (textareaRef.current.value.length < 5) {
            setErrorPrescription("Prescription cannot be less than 5 characters");
        } else {
            setWritePrescriptionInfo([
                ...writePrescriptionInfo,
                textareaRef.current.value,
            ]);
            textareaRef.current.value = "";
        }
    }

    function removeWrittenPrescription(e, pres) {
        let filtered = writePrescriptionInfo.filter((info) => info !== pres);
        setWritePrescriptionInfo(filtered);
    }

    function editPrescriptionInfo(e, pres) {
        textareaRef.current.value = pres;

        let filtered = writePrescriptionInfo.filter((info) => info !== pres);
        setWritePrescriptionInfo(filtered);
    }

    function activeListHandler(e, elementId) {
        setBlockUserExit(false);

        const element = document.querySelector(elementId);
        const yOffset = -140;
        const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        if (element) {
            // element.scrollIntoView({ behavior: 'smooth', alignToTop: true, block: "nearest" });
            window.scrollTo({ top: y, behavior: "smooth" });
        }

        setTimeout(() => {
            setBlockUserExit(true);
        }, 4000);
    }

    // function consultationFinishedHandler() {
    //   const button = document.querySelector(".submit-btn-completed");

    //   button.click();
    // }

    const handleDelete = (key, data, change) => {
        const newData = data?.filter((item) => item.key !== key);
        setPrescribeData(newData);
        change(newData);
    };

    async function downloadPastPrescription(e, url) {
        try {

            const res = await API.get(url);

            if (res?.data?.code === 200) {
                try {
                    const response = await fetch(res?.data?.data?.pdf_download_link);

                    if (response.status === 200) {
                        const blob = await response.blob();

                        const downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = res?.data?.data?.pdf_download_link;

                        document.body.appendChild(downloadLink);
                        downloadLink.click();

                        setTimeout(() => {
                            URL.revokeObjectURL(downloadLink.href);
                            document.body.removeChild(downloadLink);
                        }, 100);
                    }

                    else {
                        // console.log("something went wrong");
                    }

                } catch (error) {
                    console.error(error);
                }
            }

        } catch (error) {
            // console.log(error);
        }
    }

    let medHeader = [
        { title: "Medicine", dataIndex: "medicine" },
        { title: "Dosage", dataIndex: "dosage" },
        { title: "Frequency", dataIndex: "per_day" },
        { title: "Duration", dataIndex: "number_of_days" },
        { title: "Instruction", dataIndex: "is_after_meal" },
        {
            title: "",
            dataIndex: "buttons",
            render: (_, record) => (
                <div className="flex_start">
                    {/* <a>
              <img src={editIConGreen} alt="edit"></img>
            </a> */}
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => {
                            handleDelete(record.key, medData2, setMedTable);
                        }}
                    >
                        <a>
                            <img src={deleteIconPink} alt="delete"></img>
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    let vitalHeader = [
        { title: "Date", dataIndex: "date" },
        { title: "Heart Rate", dataIndex: "heart_rate" },
        { title: "Respiratory Rate", dataIndex: "respiratory_rate" },
        { title: "Blood Pressure", dataIndex: "blood_pressure" },
        { title: "Stress Level", dataIndex: "stress_level" },
        { title: "SDNN", dataIndex: "sdnn" },
        { title: "SPO2", dataIndex: "spo2" },
    ];

    let previousConsultationHeader = [
        { title: "Date", dataIndex: "date" },
        {
            title: "Prescription",
            dataIndex: "prescription",
            render(text, record) {
                // console.log(record, "record")

                return {
                    children: <div onClick={(e) => downloadPastPrescription(e, record?.url)}> {record?.prescription}  </div>
                }
            }

        },
    ];

    let medRecordHeader = [
        { title: "Date", dataIndex: "med_rec_date" },
        {
            title: "Records",
            dataIndex: "buttons",
            render(text, record) {
                // console.log(text, "zain");
                let files = [];
                let first = text?.[0]?.file;
                text?.map((f) => {
                    files.push({ src: f?.file });
                });

                const slides = [
                    // {
                    //   src: first,
                    //   width: "100%",
                    //   height: "100%",
                    //   srcSet: files
                    // }
                    files,
                ];
                // console.log("Record", record);
                let idd = record?.key;
                return {
                    children: (
                        <>
                            <div className="row _flex_start">
                                {text?.map((item, index) => (
                                    <>
                                        <a
                                            key={index}
                                            className="consult_now fs-16 text-decoration-none col-6 justify-content-start"
                                            onClick={() => window.open(item?.file, "_blank")}
                                        >
                                            {/* <a className="consult_now" > */}
                                            {/* <FiArrowRightCircle className="arrow_black" /> */}
                                            <AiOutlineFile />
                                            <p className="black_text text-capitalize ms-2">
                                                {cutFromMiddle(item?.filename)}{" "}
                                            </p>
                                        </a>

                                        {/* {toggler1 && <LightboxModal id={idd} files={files} toggler1={toggler1} setToggler1={setToggler1} />} */}
                                    </>
                                ))}
                            </div>
                        </>
                    ),
                };
            },
        },
        { title: "", dataIndex: "", className: "w-40" },
    ];

    let prescribeHeader = [
        { title: "Lab Test", dataIndex: "lab_test" },
        {
            title: "",
            dataIndex: "buttons",

            render: (_, record) => (
                <div className="flex_start">
                    {/* <a>
            <img src={editIConGreen} alt="edit"></img>
          </a> */}
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => {
                            handleDelete(record.key, prescribeData, setPrescribeData);
                        }}
                    >
                        <a>
                            <img src={deleteIconPink} alt="delete"></img>
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const menuList = [
        {
            link: "#medical_history",
            name: "Medical History",
        },
        {
            link: "#medical_record",
            name: "Medical Records",
        },
        {
            link: "#vitals",
            name: "Vitals & Notes",
        },
        {
            link: "#prescribe_med",
            name: "Prescribe Medicines",
        },
        {
            link: "#prescribe_lab",
            name: "Prescribe Labs",
        },
    ];

    const cutFromMiddle = (longText) => {
        const maxLength = 20;
        let shortText = longText;

        if (longText?.length > maxLength) {
            const middle = Math.floor(longText.length / 6);
            const beginning = longText.slice(0, middle - 2);
            const end = longText.slice(middle + 30);
            shortText = `${beginning}...${end}`;
        }
        return shortText;
    };

    let medical_record_table = [];
    medicalRec?.map((med, index) => {
        let imgs = [];
        med?.instant_medical_record_files?.map((f) => {
            imgs.push(f?.file);
        });
        medical_record_table.push({
            key: index + 1,
            // key: med?.instant_medical_record_files
            med_rec_date: med?.date,
            med_rec_reports: med?.total_reports,
            buttons: med?.instant_medical_record_files,
        });
    });
    // console.log(medicalRec,'imgs')

    const previous_record_table = [];

    let vitalTableLocale = {
        emptyText: "No vitals measured",
    };

    let vitalData = [];
    vitalTable?.health_scans?.map((scan, index) => {
        if (index === 0) {
            vitalData.push({
                key: index + 1,
                date: `${scan?.date} ${scan?.dateTime}`,
                heart_rate: scan?.heart_rate && `${scan?.heart_rate} BPM`,
                respiratory_rate:
                    scan?.respiratory_rate && `${scan?.respiratory_rate} BPM`,
                blood_pressure: scan?.blood_pressure && `${scan?.blood_pressure} mmHG`,
                stress_level: scan?.stress_level,
                sdnn: scan?.sdnn && `${scan?.sdnn} MS`,
                spo2: scan.spo2 && `${scan?.spo2} %`,
            });
        }
    });

    // console.log({ vitalData });

    let previousConsultationData = [];

    patient.previous_consultation.length > 0 && patient.previous_consultation.forEach((item) => {
        previousConsultationData.push({ date: item?.date, prescription: `Prescription-${item?.id}`, url: `/appointment/download-prescription/${item?.id}?is_html=1&is_download=1` })
    })

    // console.log({ previousConsultationData });

    const setDiseaseFunc = (type, value) => {
        if (type === "add") {
            arr.add(value);
            setCond([...arr]);
        } else {
            const index = arr.has(value);
            if (index === true) {
                arr.delete(value);
            }
            setCond([...arr]);
        }
    };

    const handleOnChange = (value, event) => {
        if (arr.has(value) === false) {
            setDiseaseFunc("add", value);
            setMed([
                ...med,
                <MedCancelCard
                    text={value}
                    id={med.length}
                    cancel={true}
                    setDiseaseFunc={setDiseaseFunc}
                />,
            ]);
        }
    };

    const completeApp = (values) => {
        setFormValues(values);
        setModal2Visible(true);
        // setCanUserLeave(false);
        setBlockUserExit(false);
    };

    const completeAppointment = async () => {

        let appointmentsInQueue = [];

        const response = await API.get("/doctor/pending-appointment");

        if (response?.data?.code === 200) {
            appointmentsInQueue = response?.data?.data;
        }

        if (appointmentsInQueue?.length > 1) {
            appointmentsInQueue?.sort((a, b) => a?.id - b?.id)
        }


        let prescription_here = JSON.stringify(writePrescriptionInfo);

        setBlockUserExit(true);
        setModal2Visible(false);
        setModal3Visible(false);
        let values = formValues;

        values.prescription_here = prescription_here;
        values.condition = cond;

        delete values.prevRecord;
        values?.medicine?.map((item) => {
            delete item.medicine;
            delete item.medName;
            delete item.key;
        });
        delete values.medicalRecord;

        delete values.vitalTable;

        let labData = prescribeData.slice(0);
        let lab_info = [];
        labData?.map((labs) => {
            lab_info.push({
                prescription_element_id: labs.prescription_element_id,
                description: labs?.description,
            });

        });
        values.lab = lab_info;

        values.medicine = medTable;

        // values.patient = patient
        let payload = {
            id: id,
            data: values,
        };


        const stopAgoraApi = stopApi(resourceId, stopId);
        const stopApiPayload = {
            cname: channelName,
            uid: params?.id?.toString(),
            clientRequest: {},
        };

        const customerKey = process.env.REACT_APP_AGORA_CUSTOMER_KEY;
        const customerSecret = process.env.REACT_APP_AGORA_CUSTOMER_SECRET;

        try {
            const response = await axios.post(stopAgoraApi, stopApiPayload, {
                auth: {
                    username: customerKey,
                    password: customerSecret,
                },
            });
        } catch (error) { }

        await dispatch(postConsult(payload)).then((data) => {
            if (data.payload.code === 200) {
                setStartCall(false);

                // leaveChannel()
                toast.success("Appointment is completed.");
                // setBlockUserExit(false);

                const appID = process.env.REACT_APP_AGORA_TEST_APP_ID;
                const appointmentId = params?.id;

                const channelName = `${appointmentId}`;
                let token;

                (async () => {
                    const response = await API.get(`/generate-agora-rtm-token`);
                    if (response?.data?.code === 200) {
                        token = response?.data?.data?.token;

                        if (appID && channelName) {
                            const client = AgoraRTM.createInstance(appID);
                            setBlockUserExit(false);

                            await client.login({ token, uid: `${doctorId}` });

                            let channel = client.createChannel(channelName);

                            await channel.join();

                            await channel
                                .sendMessage({ text: "appointment-ended" })
                                .then(() => {
                                    // console.log({ startNextConsultation });
                                    // console.log({ appointmentsInQueue })
                                    // console.log("message_sent");
                                    if (startNextConsultation) {
                                        if (appointmentsInQueue?.length > 1) {
                                            history.push({
                                                pathname: `/appointment/${appointmentsInQueue?.[1]?.id}`,
                                                state: {
                                                    id: appointmentsInQueue?.[1]?.id,
                                                    type: appointmentsInQueue?.[1]?.type,
                                                    user_id: appointmentsInQueue?.[1]?.user_id,
                                                    visit_count: 0,
                                                },
                                            });
                                        }

                                        else {
                                            history.push("/");
                                        }

                                    }
                                    else {
                                        history.push("/");
                                    }

                                });
                        }
                    }
                })();
            } else {
                toast.error(data.payload.message);
            }
        });
    };

    const addMed = (values, values2) => {
        values.key = medData.length + 1;
        values2.key = medData.length + 1;
        let found = [];
        medicine?.data?.map((item) => {
            if (item.id === values.medicine) {
                found.push(item.name);
                found.push(item.id);
            }
        });
        values.medName = found[0];
        values2.medName = found[0];
        values.prescription_element_id = found[1];
        values2.prescription_element_id = found[1];

        let temp = [...new Set([...medData, values])];
        setMedData(temp);

        let temp2 = [...new Set([...medTable, values2])];
        setMedTable(temp2);
    };

    const addLab = (values) => {
        values.key = prescribeData.length + 1;
        let found = [];
        labs?.data?.map((item) => {
            if (item.id === values.lab_test) {
                found.push(item.name);
                found.push(item.id);

                item?.type?.prescription_element_type_categories?.map((elem) => {
                    if (elem?.id === values?.description) {
                        found.push(elem?.name);
                    }
                })


            }
        });
        if (found.length) {
            values.lab_name = found[0];
            values.prescription_element_id = found[1];
            values.description = found?.[2];
            let temp = [...new Set([...prescribeData, values])];
            setPrescribeData(temp);
        }
    };

    // console.log({ prescribeData })

    // console.log({prescribeData})

    // console.log({medTable})

    let medData2 = [];
    medTable?.map((item) => {
        item.medicine = item?.medName;
        medData2.push(item);
    });

    let prescribeData2 = [];
    prescribeData?.map((item) => {
        prescribeData2.push({ key: item.key, lab_test: item.lab_name });
    });

    appForm.setFieldsValue({
        vitalTable: vitalData,
        medicine: medData,
        lab: prescribeData,
    });

    useEffect(() => {
        if (config !== null && count <= 1) {
            setCount(count + 1);
            setStartCall(true);
        }
    }, [config]);

    const renderer = ({ minutes, seconds, completed }) => {
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        if (completed) {
            if (!endAnnounced) {
                setModal3Visible(true);

                setTimeout(() => {
                    // completeAppointment();
                    setAppointmentCompleted(true);
                }, 5000);

                setendAnnounced(true);
            }
            return <h3 className="fs-20">Time Ended</h3>;
        } else {
            return (
                <h3 className="rem-time">
                    {minutes}:{seconds}
                </h3>
            );
        }
    };

    useEffect(() => {
        let interval = setInterval(() => {
            let remainingTime = document.querySelector(".rem-time");

            if (remainingTime.innerHTML == "02:00") {
                // Stringified time remaining
                setModal4Visible(true);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        API.get(`/doctor/pending-appointment`)
            .then((res) => {
                if (res?.data?.code === 200) {
                    setPendingAppointments(res?.data?.data);
                }
            })
            .catch((err) => { });
    }, []);

    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 650);
        });
    }, []);

    async function onCheckboxChange(e) {
        // setIsOnline(e);

        if (e === true) {
            const data = {
                is_instant_consultation: 1,
            };

            const response = await API.post(`/doctor/instant-online-offline`, data);

            if (response?.data?.code === 200) {
                setIsOnline(true);
            } else {
                setIsOnline(false);
            }
        } else {
            let instant = pendingAppointments;

            // console.log(selectDashboardDetails?.data?.appointment_listing, 'listing')

            if (instant?.length > 0) {
                setModal1Visible(true);
                setIsOnline(isOnline);
            }

            const data = {
                is_instant_consultation: 0,
            };

            const response = await API.post(`/doctor/instant-online-offline`, data);

            if (response?.data?.code === 200) {
                setIsOnline(false);
            } else {
                setIsOnline(true);
            }
        }
    }

    useEffect(() => {
        if (medTable.length > 0) {
            setTabSwitchState(1);
        }

        if (writePrescriptionInfo.length > 0) {
            setTabSwitchState(2);
        }

        if (writePrescriptionInfo.length === 0 && medTable.length === 0) {
            setTabSwitchState(0);
        }
    }, [medTable.length, writePrescriptionInfo.length]);

    useEffect(() => {
        if (appointmentCompleted) {
            completeAppointment();
        }
    }, [appointmentCompleted]);

    useEffect(() => {
        if (shouldDispatchMedicine) {
            dispatch(getMedicine());
        }
    }, [shouldDispatchMedicine]);

    const forStartNextConsultation = (e) => {
        setStartNextConsultation(e.target.checked);

    };

    const forStartNextConsultation2 = (e) => {
        // console.log(`checked = ${e.target.checked}`);
        setStartNextConsultation(e.target.checked);
    };



    // previous consultation
    const columnsprev = [
        {
            title: <div className="consultation_detail">
                <th>Doctor Name</th>
                <th>Reason for visit</th>
                <th>Date</th>
            </div>,
            dataIndex: 'drname',
            key: 'drname',

        },


        {
            title: 'Prescription',
            dataIndex: 'prescription',
            key: 'prescription',
            render: (text, record) => (
                <ul className="prescription_list">
                    <li className="list_header">
                        <ul >
                            <li>Drug Name</li>
                            <li>Medicine/Day</li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li> Duration</li>
                            <li>Instructions</li>
                        </ul>
                    </li>
                    <li className="list_pres">
                        <ul>
                            <li>Tylenol Syrup (100mg)</li>
                            <li>
                                <p>2 Teaspoon</p>
                                <h6>Morning</h6>
                            </li>
                            <li>
                                <p>2 Teaspoon</p>
                                <h6>Afternoon</h6>
                            </li>
                            <li>
                                <p>2 Teaspoon</p>
                                <h6>Evening</h6>
                            </li>
                            <li>
                                <p>2 Teaspoon</p>
                                <h6>Night</h6>
                            </li>
                            <li>5 days</li>
                            <li>Before meal</li>
                        </ul>
                    </li>

                </ul>
            ),

        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',

        },
    ];





    const dataprev = [
        {
            drname: <div className="consultation_detai_listing">
                <p className="dr_name">Dr. Ismail Siddiqui</p>
                <p className="reason_name">Migraine issue</p>
                <p className="reason_name">10/4/2023</p>
            </div>,

            details: <Button className="view_more" onClick={() => setModal2Open(true)}> <img src={fileIcon} /> View More</Button>,
        },
        {
            drname: <div className="consultation_detai_listing">
                <p className="dr_name">Dr. Ismail Siddiqui</p>
                <p className="reason_name">Migraine issue</p>
                <p className="reason_name">10/4/2023</p>
            </div>,


        },
        {
            drname: <div className="consultation_detai_listing">
                <p className="dr_name">Dr. Ismail Siddiqui</p>
                <p className="reason_name">Migraine issue</p>
                <p className="reason_name">10/4/2023</p>
            </div>,



        },

    ];

    const [modal2Open, setModal2Open] = useState(false);
    const [modal2OpenData, setModal2OpenData] = useState();

    const [csvLoading, setCsvLoading] = useState(false);

    const handleModalData = async (item) => {
        setModal2Open(true)
        try {
            const response = await API.get(`/appointment/download-prescription/${item?.get_prescription?.appointment_id}?is_html=0`);
            if (response.data?.code === 200) {
                setModal2OpenData(response?.data?.data);
            }
        } catch (e) {
            console.log(e, "e")
        }
    }

    async function downloadCSVHandler() {

        downloadPrescription(id).then((res) => {
            // window.open(res?.data?.pdf_download_link, "_blank");
        });
    }

    const [visibleItems, setVisibleItems] = useState(1);

    const handleViewMore = () => {
        setVisibleItems((prevVisibleItems) => prevVisibleItems + 1);
    };


    return (
        <div className="appointment_first cover_space">
            {/* <Prompt when={setBlockUserExit}
              message={(location, action)=> {
                console.log(action, 'action');
                return "The following action will end the appointment. Are you sure you want to end the call?"
              }}></Prompt> */}
            {/* <NavigationPrompt when={setBlockUserExit}>
      {({ onConfirm, onCancel }) => (
    <ConfirmNavigationModal
      when={true}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )}
      </NavigationPrompt> */}
            <RouterPrompt
                when={blockUserExit}
                title="Mark as Complete?"
                cancelText=""
                okText="Ok"
                okFunction={completeAppointment}
                onOK={() => {
                    return false;
                }}
                onCancel={() => false}
            />
            {loader && (
                <Form form={appForm} layout="vertical" onFinish={completeApp}>
                    <Container>
                        {patient?.type !== "in-person" ? (
                            <Row>
                                <Col md={4} className="d-block d-sm-none">
                                    <div
                                        className="mt-6 box_mobile_call   "                  >
                                        <Row>
                                            <Col xs={7}>
                                                <div className="pat_info_mob">
                                                    <HeadingDescVsmall text={patient?.name} />
                                                    <HeadingDescVsmall
                                                        text={
                                                            patient?.age === null || patient?.age === ""
                                                                ? "-"
                                                                : patient?.age + " years"
                                                        }
                                                    />

                                                    <HeadingDescVsmall
                                                        text={patient?.gender === null ? "-" : patient?.gender}
                                                    />
                                                </div>
                                                <div
                                                    className="instant_consult mb-2"
                                                    style={{ display: "flex" }}
                                                >

                                                    <HeadingDescSmall text="DoctorNow" />
                                                    <Switch
                                                        className="ms-2 is-online-switch"
                                                        checked={isOnline}
                                                        onChange={onCheckboxChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col xs={5}>
                                                <div className=" ">
                                                    <div className="  heading-captalize mobile_time01">
                                                        <Countdown date={timeRem} renderer={renderer} />
                                                        <HeadingWithSpaceLarge text="  Remaining" />

                                                    </div>
                                                    <div className="heading-captalize  mobile_time01 pt-mob">
                                                        <HeadingWithSpaceLarge text="Patient In Queue" />
                                                        <h3>01</h3>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>







                                    </div>
                                </Col>
                                <Col md={8} id="mobile_vid" className={scroll ? "fixedSameVideoTop" : ""}>
                                    {startCall && (
                                        <div className={`video_div position-relative ${isMobile && 'noPadding'} ${viewSingleReport && 'currentViewState'}`}>
                                            {/* <img src={patient_img} alt="patient_img" className="img_vid" /> */}
                                            <Agora doctorName={AppointmentData?.data?.doctor?.name} />
                                            {/* doctor Name for small frame */}
                                            <p className="topNameDoctorNow">
                                                {AppointmentData?.data?.doctor?.name}
                                            </p>
                                            {/* doctor Name for small frame */}
                                            <div className="fixedScreenHeading withoutScrollFixed">
                                                <HeadingDescVsmall text={patient?.name} />
                                                <div className="onlyForFixedRemainingTime">
                                                    <Countdown date={timeRem} renderer={renderer} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <div
                                        className={
                                            mobile ? "d-none" : "white_color_div patient-info-set hk_white_video_right_area"
                                        }
                                    >
                                        <div
                                            className="instant_consult mb-3"
                                            style={{ display: "flex" }}
                                        >
                                            <HeadingDescSmall text="DoctorNow" />
                                            <Switch
                                                className="ms-2 is-online-switch"
                                                checked={isOnline}
                                                onChange={onCheckboxChange}
                                            />
                                        </div>

                                        <HeadingWithSpaceLarge text="PATIENT INFORMATION" />
                                        <div className="column_flex">
                                            <HeadingDescVsmall text="Patient Name:" />
                                            <HeadingDescVsmall text={patient?.name} />
                                        </div>

                                        <div className="column_flex">
                                            <HeadingDescVsmall text="Age" />
                                            <HeadingDescVsmall
                                                text={
                                                    patient?.age === null || patient?.age === ""
                                                        ? "-"
                                                        : patient?.age + " years"
                                                }
                                            />
                                        </div>
                                        <div
                                            className="column_flex"
                                            style={{ textTransform: "capitalize" }}
                                        >
                                            <HeadingDescVsmall text="Gender" />
                                            <HeadingDescVsmall
                                                text={patient?.gender === null ? "-" : patient?.gender}
                                            />
                                        </div>

                                        {/* <div
                      className="column_flex"
                      style={{ textTransform: "capitalize" }}
                    >
                      <HeadingDescVsmall text="City" />
                      <HeadingDescVsmall
                        text={
                          !userCity || typeof userCity === "undefined"
                            ? "-"
                            : userCity
                        }
                      />
                    </div> */}
                                        {parseInt(visit_count) > 0 ? (
                                            <div className="patient_status follow_up">
                                                <HeadingDescVsmall text="Follow Up Appointment" />
                                            </div>
                                        ) : (
                                            <div className="patient_status first_time">
                                                <HeadingDescVsmall text="First Time Appointment" />
                                            </div>
                                        )}

                                        {AppointmentData?.data?.reason_for_visit && (
                                            <div className="column_flex patient_reason_visit">
                                                <HeadingDescVsmall text="Reason for Visit" />
                                                <HeadingDescVsmall text={AppointmentData?.data?.reason_for_visit} />
                                                <HeadingDescVsmall
                                                    text={AppointmentData?.data?.additional_detail}
                                                />
                                            </div>
                                        )}

                                        <hr className="break-lines d-none d-lg-block mt-0 mb-0" />
                                        <div className="flex_center">
                                            <div className="column_flex heading-captalize">
                                                <HeadingWithSpaceLarge text="Time " />
                                                <Countdown date={timeRem} renderer={renderer} />
                                            </div>
                                            <div className="column_flex heading-captalize">
                                                <HeadingWithSpaceLarge text="Patient Queue" />
                                                <h3>01</h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        ) : (
                            <Row>
                                <Col md={24}>
                                    <div className="past_consultation">
                                        <div className={mobile ? "d-none" : "white_color_div"}>
                                            <HeadingWithSpaceLarge text="PATIENT INFORMATION" />
                                            <div className="flex_center">
                                                <div className="column_flex">
                                                    <HeadingDescVsmall text="Patient Name" />
                                                    <HeadingDescVsmall text={patient?.name} />
                                                </div>
                                                <div className="column_flex">
                                                    <HeadingDescVsmall text="Age" />
                                                    <HeadingDescVsmall
                                                        text={
                                                            patient?.age === null || patient?.age === ""
                                                                ? "-"
                                                                : patient?.age + " years"
                                                        }
                                                    />
                                                </div>
                                                <div className="column_flex">
                                                    <HeadingDescVsmall text="Gender" />
                                                    <HeadingDescVsmall
                                                        text={
                                                            patient?.gender === null ? "-" : patient?.gender
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    className="column_flex"
                                                    style={{ textTransform: "capitalize" }}
                                                >
                                                    <HeadingDescVsmall text="City" />
                                                    <HeadingDescVsmall
                                                        text={
                                                            !userCity || typeof userCity === "undefined"
                                                                ? "-"
                                                                : userCity
                                                        }
                                                    />
                                                </div>
                                                {patient?.reason && (
                                                    <div className="column_flex">
                                                        <HeadingDescVsmall text="Reason for Visiting" />
                                                        <HeadingDescVsmall text={patient?.reason} />
                                                    </div>
                                                )}
                                                {parseInt(visit_count) > 0 ? (
                                                    <div className="patient_status follow_up">
                                                        <HeadingDescVsmall text="Follow Up Appointment" />
                                                    </div>
                                                ) : (
                                                    <div className="patient_status first_time">
                                                        <HeadingDescVsmall text="First Time Appointment" />
                                                    </div>
                                                )}
                                                <div className="column_flex">
                                                    <HeadingDescVsmall text="Appointment Remaining Time" />
                                                    <Countdown
                                                        className="time-rem"
                                                        date={timeRem}
                                                        renderer={renderer}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Container>
                    {!isMobile && (
                        <>
                            <div
                                className={
                                    scroll
                                        ? "stickyonScroll also container mt-5 fixedVideoOnScroll text-center"
                                        : "container mt-5 whenNotFixedVideo"
                                }
                            >
                                <ul className="records-inline  ps-0 my-2">
                                    <li
                                        onClick={(e) => activeListHandler(e, "#vitals")}
                                        className="rec"
                                    >
                                        Vitals
                                    </li>
                                    <li
                                        onClick={(e) => activeListHandler(e, "#medical-history")}
                                        className="rec"
                                    >
                                        Medical History
                                    </li>
                                    <li
                                        onClick={(e) => activeListHandler(e, "#medical-records")}
                                        className="rec"
                                    >
                                        Medical Records
                                    </li>
                                    <li
                                        onClick={(e) => activeListHandler(e, "#prescription")}
                                        className="rec"
                                    >
                                        Prescription
                                    </li>
                                    <li
                                        onClick={(e) => activeListHandler(e, "#prescribe_lab")}
                                        className="rec"
                                    >
                                        Lab Tests
                                    </li>
                                </ul>

                                {/* <Container className="containerHideScreen">
              {patient?.type !== "in-person" ? (
                <Row>
                  <Col md={2}>
                    {startCall && (
                      <div className="video_div">
                        <Agora />
                        <div
                          className={mobile ? "d-none" : "fixedScreenHeading"}
                        >
                          <HeadingDescVsmall text={patient?.name} />
                          <Countdown date={timeRem} renderer={renderer} />
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col md={2}>
                    <div className="past_consultation">
                      <div className={mobile ? "d-none" : "white_color_div"}>
                        <div className="flex_center">
                          <div className="column_flex">
                            <HeadingDescVsmall text="Patient Name" />
                            <HeadingDescVsmall text={patient?.name} />
                          </div>
                          <div className="column_flex">
                            <HeadingDescVsmall text="Appointment Remaining Time" />
                            <Countdown
                              className="time-rem"
                              date={timeRem}
                              renderer={renderer}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </Container> */}
                            </div>
                        </>
                    )}

                    <div
                        className={
                            mobile
                                ? location?.search?.split("?")[1] === "#vitals"
                                    ? "tab_data cover_space3"
                                    : "d-none"
                                : "tab_data cover_space3"
                        }
                        id="vitals"
                    >
                        <Container>
                            {mobile ? (
                                <div className="column_flex justify_between">
                                    <div className="white_color_div">
                                        <div className="flex_end justify_between">
                                            <div className="column_flex gap_div">
                                                <div className="column_flex">
                                                    <HeadingDescSmall text="Heart Rate" />
                                                    <HeadingDescSmall text="20 BPM" />
                                                </div>
                                                <div className="column_flex">
                                                    <HeadingDescSmall text="Heart Rate" />
                                                    <HeadingDescSmall text="20 BPM" />
                                                </div>
                                            </div>
                                            <div className="column_flex gap_div">
                                                <div className="column_flex">
                                                    <HeadingDescSmall text="Breathing Rate" />
                                                    <HeadingDescSmall text="20 BPM" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="white_color_div">
                                        <div className="flex_end justify_between">
                                            <div className="column_flex gap_div">
                                                <div className="column_flex">
                                                    <HeadingDescSmall text="Heart Rate" />
                                                    <HeadingDescSmall text="20 BPM" />
                                                </div>
                                                <div className="column_flex">
                                                    <HeadingDescSmall text="Heart Rate" />
                                                    <HeadingDescSmall text="20 BPM" />
                                                </div>
                                            </div>
                                            <div className="column_flex gap_div">
                                                <div className="column_flex">
                                                    <HeadingDescSmall text="Breathing Rate" />
                                                    <HeadingDescSmall text="20 BPM" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="white_color_div">
                                    {vitalData.length > 0 ? (
                                        <div className="gap_div">
                                            <HeadingWithSpaceLarge text="VITALS" />
                                        </div>
                                    ) : null}
                                    <div className={`appointment_div_data ${vitalTableLocale ? 'noVitalsCurrently' : ''}`}>
                                        <Form.Item name="vitalTable" className="vital_table">
                                            <Form.Item>
                                                <TableComponent
                                                    locale={vitalTableLocale}
                                                    header={vitalHeader}
                                                    data={vitalData}
                                                    pagination={false}
                                                />
                                            </Form.Item>
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                        </Container>
                    </div>

                    {/* previous box start */}
                    {!isMobile && (
                        <>
                            <Container id="previous consultation">
                                <Row>
                                    <Col md={12} lg={12} className="prev_consultation">
                                        <div className="tab_data cover_space3">
                                            <div className="white_color_div">
                                                <div className="gap_div">
                                                    <HeadingWithSpaceLarge text="PREVIOUS CONSULTATION" />
                                                </div>
                                                {/* <div className="table_pt">
                      <TablePreviousHistory columns={columnsprev}
                        data={dataprev}
                        pagination={false} />
                    </div> */}
                                                <div className="table_pt position-relative">
                                                    <div className="d-flex align-items-center like_row_bg">
                                                        <div className="hk_align-by-align">
                                                            <h4>Doctor Name</h4>
                                                        </div>
                                                        <div className="hk_align-by-align">
                                                            <h4>Reason for visit</h4>
                                                        </div>
                                                        <div className="hk_align-by-align">
                                                            <h4>Date</h4>
                                                        </div>

                                                    </div>
                                                    <Row>
                                                        <div className="acc_button_area">
                                                            <TabItem.Container id="left-tabs-example" defaultActiveKey={activeTab}>
                                                                <Row>
                                                                    <Col sm={4}>
                                                                        {patient.previous_consultation?.length > 0 && patient.previous_consultation?.map((item) => {
                                                                            return (
                                                                                <>
                                                                                    <Nav variant="pills" className="flex-column hk_bg_cover">
                                                                                        <Nav.Item>
                                                                                            <Nav.Link eventKey={item?.id}>
                                                                                                <div className="d-flex align-items-center justify-content-between">
                                                                                                    <div className="f-items_hk">
                                                                                                        <h6 className="diff_color">Dr. {item?.doctor?.name}</h6>
                                                                                                    </div>
                                                                                                    <div className="f-items_hk">
                                                                                                        <h6>{item?.reason_for_visit}</h6>
                                                                                                    </div>
                                                                                                    <div className="f-items_hk">
                                                                                                        <h6>{item?.date}</h6>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Nav.Link>
                                                                                        </Nav.Item>
                                                                                    </Nav>
                                                                                </>
                                                                            )
                                                                        })}
                                                                    </Col>
                                                                    <Col sm={8}>
                                                                        <TabItem.Content>
                                                                            {patient?.previous_consultation?.length > 0 && patient?.previous_consultation?.map((item) => {
                                                                                return (
                                                                                    <>
                                                                                        <TabItem.Pane defaultActiveKey={patient.previous_consultation[0]?.id} eventKey={item?.id}>
                                                                                            <div className="hk_align-by-align in_tabs">
                                                                                                <h4>Prescription <span className="dr_name_header_date">(Dr. {item?.doctor?.name} | {item?.appointment_date}</span></h4>
                                                                                            </div>
                                                                                            {item?.get_prescription?.prescribed_medicine?.length > 0 ? (
                                                                                                <>
                                                                                                    <table className="in_table_view">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th>Drug Name</th>
                                                                                                                <th>Medicine/Day</th>
                                                                                                                <th>Duration</th>
                                                                                                                <th>Instructions</th>
                                                                                                                <th>View full prescription</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            {item?.get_prescription?.prescribed_medicine?.length > 0 && item?.get_prescription?.prescribed_medicine?.map((itemMed) => {
                                                                                                                return (
                                                                                                                    <>
                                                                                                                        <tr>
                                                                                                                            <td>{itemMed?.prescription_element?.name} </td>
                                                                                                                            <td>
                                                                                                                                <div className="d-flex align-items-center med_schedule_hk">
                                                                                                                                    <div className="hanlde_wrapper_schedule">
                                                                                                                                        {itemMed?.morning}  {itemMed?.unit} <span>Morning</span>
                                                                                                                                    </div>
                                                                                                                                    <div className="hanlde_wrapper_schedule">
                                                                                                                                        {itemMed?.afternoon} {itemMed?.unit}  <span>Afternoon</span>
                                                                                                                                    </div>
                                                                                                                                    <div className="hanlde_wrapper_schedule">
                                                                                                                                        {itemMed?.evening} {itemMed?.unit}  <span>Evening</span>
                                                                                                                                    </div>
                                                                                                                                    <div className="hanlde_wrapper_schedule">
                                                                                                                                        {itemMed?.night} {itemMed?.unit}  <span>Night</span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </td>
                                                                                                                            <td>{itemMed?.number_of_days}</td>
                                                                                                                            <td>{itemMed?.is_after_meal ? 'After meal' : 'Before meal'}</td>
                                                                                                                            <td><div class="flex_end"><div><button type="button" className="simple_btn_small" onClick={(e) => handleModalData(item)}><img src={fileIcon} /> View</button></div></div></td>
                                                                                                                        </tr >
                                                                                                                    </>
                                                                                                                )
                                                                                                            })}
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    {item?.prescription_here?.length > 0 && JSON.parse(item?.prescription_here) ? (
                                                                                                        <>
                                                                                                            <table className="in_written">
                                                                                                                <thead>
                                                                                                                    <tr>
                                                                                                                        <th>Prescription</th>
                                                                                                                        <th>View full prescription</th>
                                                                                                                    </tr>
                                                                                                                </thead>
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td><p>{JSON.parse(item?.prescription_here)}</p></td>
                                                                                                                        <td><div class="flex_end"><div><button type="button" className="simple_btn_small" onClick={(e) => handleModalData(item)}><img src={fileIcon} /> View</button></div></div></td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <p className="no_pres_prev_cons">No Prescription Here.</p>
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            )}
                                                                                        </TabItem.Pane >
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </TabItem.Content>
                                                                    </Col >

                                                                </Row>
                                                            </TabItem.Container>
                                                        </div>
                                                    </Row>
                                                </div>

                                                <div className="modal_appointment">

                                                    <Modal
                                                        className='instantModalpopup prescripModalSet'
                                                        title=""
                                                        centered
                                                        visible={modal2Open}
                                                        onOk={() => setModal2Open(false)}
                                                        onCancel={() => setModal2Open(false)}
                                                    >
                                                        <div className='modal-to-print'>
                                                            <div className='d-flex justify-content-between align-items-center mt-4 mb-2'>
                                                                <h4 className='prescriptionHeading'>Prescription</h4>
                                                                <p style={{ cursor: 'pointer' }} className='text-uppercase d-flex donwloadKey align-items-center'><img src={arrowDownload} alt='download' className='img-fluid me-2' />Download</p>
                                                            </div>


                                                            {csvLoading ? (
                                                                <div className="doctor-search-loader">

                                                                </div>

                                                            ) : (
                                                                <div className='border rounded p-2 mb-2 pdf-body hk_bt_remove px-3 py-4'>
                                                                    <div className='d-md-none d-flex justify-content-end'>
                                                                        <img src={logo} alt='logo' className='img-fluid logo_small' style={{ height: "25px" }} />
                                                                    </div>
                                                                    <div className='d-md-flex justify-content-between'>
                                                                        <div className='order-2 order-md-1 position-relative'>

                                                                            {modal2OpenData?.doctor?.is_featured && (
                                                                                <img src={FeaturedTick} alt="Featured" className='img-fluid realCheck' />
                                                                            )}

                                                                            <div className='d-flex align-items-center'>
                                                                                <div className='doctorImg'>

                                                                                    {modal2OpenData?.doctor?.image && (
                                                                                        <img className='img-fluid' src={modal2OpenData?.doctor?.image} alt='profile' />

                                                                                    )}
                                                                                </div>
                                                                                <div className='doctorInstantInfo text-left ms-3'>
                                                                                    <h5 className='fw-600 instant-doc-name' >{modal2OpenData?.doctor?.prefix}. {modal2OpenData?.doctor?.name}</h5>
                                                                                    <p className='instant-doc-specialities'>{modal2OpenData?.doctor?.doctor_specialities?.toString()?.replace(/,/g, ", ")}</p>
                                                                                    <p>{modal2OpenData?.doctor?.doctor_educations?.toString()?.replace(/,/g, ", ")}</p>
                                                                                </div>
                                                                            </div>

                                                                        </div>


                                                                        <img src={logo} alt='logo' className='img-fluid order-1 order-md-2 logo_small d-none d-md-block' />
                                                                    </div>
                                                                    <div className='d-md-flex mt-3 justify-content-between'>
                                                                        <div className='d-flex ms-0 justify-content-between'>
                                                                            <div className='me-3'>
                                                                                <p><strong>Patient:</strong> {modal2OpenData?.patient_info?.name || 'Patient'}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p><strong>Patient Number: </strong>{modal2OpenData?.patient_info?.id}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <p><strong>Prescribed on:</strong>{moment(modal2OpenData?.formatted_date_time).format('DD/MM/YYYY').slice(0, 10)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className='for_bor_only_instant__f border rounded table-responsive'>
                                                                {modal2OpenData?.prescription?.prescribed_medicine?.length > 0 ? (
                                                                    <Table striped className='table instant-feedback-table'>
                                                                        <>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className='text-left secondHeadWords'>Drug Name</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th className='secondHeadWords'>Medicine/Day</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th className='text-center secondHeadWords'>Duration</th>
                                                                                    <th className='text-center secondHeadWords'>Instructions</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th className='text-left'>&nbsp;</th>
                                                                                    <th className='text-left'>Morning</th>
                                                                                    <th className='text-left'>Afternoon</th>
                                                                                    <th className='text-left'>Evening</th>
                                                                                    <th className='text-left'>Night</th>
                                                                                    <th className='text-center'>&nbsp;</th>
                                                                                    <th className='text-center'>&nbsp;</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {modal2OpenData?.prescription?.prescribed_medicine?.map((item) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td className="text-left">
                                                                                                {item?.prescription_element?.name}
                                                                                            </td>
                                                                                            {item?.morning ? (
                                                                                                <>
                                                                                                    <td className="text-center fs-13 bg-change-tdd">
                                                                                                        {item?.morning} {item?.unit}
                                                                                                    </td>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <td className="text-center"></td>
                                                                                                </>
                                                                                            )}

                                                                                            {item?.afternoon ? (
                                                                                                <>
                                                                                                    <td className="text-center fs-13 bg-change-tdd">
                                                                                                        {item?.afternoon} {item?.unit}
                                                                                                    </td>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <td className="text-center"></td>
                                                                                                </>
                                                                                            )}

                                                                                            {item?.evening ? (
                                                                                                <>
                                                                                                    <td className="text-center fs-13 bg-change-tdd">
                                                                                                        {item?.evening} {item?.unit}
                                                                                                    </td>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <td className="text-center"></td>
                                                                                                </>
                                                                                            )}

                                                                                            {item?.night ? (
                                                                                                <>
                                                                                                    <td className="text-center fs-13 bg-change-tdd">
                                                                                                        {item?.night} {item?.unit}
                                                                                                    </td>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <td className="text-center"></td>
                                                                                                </>
                                                                                            )}


                                                                                            <td className='text-center fs-13' >{item?.number_of_days}</td>
                                                                                            <td>
                                                                                                {item?.is_after_meal === true ? (
                                                                                                    <>
                                                                                                        <p className='withMeal'>After meal</p>
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <p className='withMeal'>Before meal</p>
                                                                                                    </>
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                })}

                                                                            </tbody>
                                                                        </>
                                                                    </Table>
                                                                ) : modal2OpenData?.prescription_here ? (
                                                                    <Table striped className='table prescriptionHere instant-feedback-table '>

                                                                        <>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th style={{ color: '#078A8E', fontSize: '15px', marginLeft: '20px' }} className='text-left'>Prescription</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th></th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th className='text-center'></th>
                                                                                    <th className='text-center'></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <p style={{ whiteSpace: 'pre-line' }} disabled className='prescription-textBox' >
                                                                                    {modal2OpenData?.prescription_here}
                                                                                </p>
                                                                            </tbody>
                                                                        </>
                                                                    </Table>
                                                                ) : null}

                                                                {modal2OpenData?.prescription.prescribed_lab?.length > 0 && (
                                                                    <Table striped className='table instant-feedback-table lab-test-table border_bottom_rem'>
                                                                        <>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th style={{ color: '#078A8E', fontSize: '15px', }} className='text-left' colSpan={2}>Lab Test</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th>&nbsp;</th>
                                                                                    <th className='text-center'>&nbsp;</th>
                                                                                    <th className='text-center'>&nbsp;</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {modal2OpenData?.prescription.prescribed_lab?.map((test) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td className='med-test-type text-left'> {test?.description}</td>
                                                                                            <td className='text-left labTestName' colSpan={2}>{test?.prescription_element?.name}</td>
                                                                                            <td>&nbsp;</td>
                                                                                            <td>&nbsp;</td>
                                                                                            <td>&nbsp;</td>
                                                                                            <td>&nbsp;</td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                        </>
                                                                    </Table>
                                                                )}


                                                            </div>
                                                            {/* <div className='sharedReportBox'>
                            <h4 className="sharedReports text-left pb-3">Shared Reports</h4>
                            <div className="bg-gray rounded">
                              <div className="d-flex align-items-center justify-content-between border-bottom anchorInstantModal p-3">
                                <a href="#"  >
                                  <FontAwesomeIcon icon={'fa fa-file'} className="me-2 " />
                                  https://ms-image...t1r2uItsJ3U1Z2adsElJFkQNa3U.png
                                </a>
                                <a href="#"
                                  className="removeInstantLink">
                                  Remove
                                </a>
                              </div>
                            </div>
                          </div> */}
                                                        </div>
                                                    </Modal>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row >
                            </Container >
                        </>
                    )}

                    {/* previous box end */}

                    {/* {mobile && <StickyTab menuList={menuList} type="a" />} */}
                    {!isMobile && (
                        <>
                            <Container id="medical-history">
                                <Row>
                                    <div
                                        className={
                                            mobile
                                                ? location?.search?.split("?")[1] === "#medical_history" ||
                                                    typeof location?.search?.split("?")[1] === "undefined"
                                                    ? "tab_data cover_space3"
                                                    : "d-none"
                                                : "tab_data cover_space3"
                                        }
                                    >
                                        <div className="white_color_div">
                                            <div className="gap_div">
                                                {!mobile && (
                                                    <HeadingWithSpaceLarge text="MEDICAL HISTORY" />
                                                )}
                                                <div
                                                    className="appointment_div_data"
                                                    style={{ flexDirection: "column" }}
                                                >
                                                    <Row>
                                                        <Col md={4}>
                                                            <div className="column_flex">
                                                                <div className="column_flex2">
                                                                    <Form.Item name="blood_group" label="Blood Group">
                                                                        {/* <p className="labelText">Blood Group</p> */}
                                                                        <Select
                                                                            defaultValue={
                                                                                patient?.prescription?.blood_group
                                                                            }
                                                                            dropdownAlign={{ offset: [0, 4] }}
                                                                            placeholder="Select blood group"
                                                                            suffixIcon={
                                                                                // <HiOutlineArrowDown color="#29BCC1" />
                                                                                <img src={arrowdropdown} alt />
                                                                            }
                                                                            className="c_select"
                                                                        >
                                                                            {/* <Option selected >{patient?.prescription?.blood_group}</Option> */}
                                                                            <Option value="A+">A+</Option>
                                                                            <Option value="A-">A-</Option>
                                                                            <Option value="B+">B+</Option>
                                                                            <Option value="B-">B-</Option>
                                                                            <Option value="O+">O+</Option>
                                                                            <Option value="O-">O-</Option>
                                                                            <Option value="AB+">AB+</Option>
                                                                            <Option value="AB-">AB-</Option>
                                                                        </Select>
                                                                    </Form.Item>
                                                                </div>

                                                                <div className="column_flex2">
                                                                    <Form.Item
                                                                        name="condition"
                                                                        label="Add Existing Condition"
                                                                    >
                                                                        {/* <p className="labelText">Add Existing Condition</p> */}
                                                                        <Select
                                                                            dropdownAlign={{ offset: [0, 4] }}
                                                                            suffixIcon={
                                                                                // <HiOutlineArrowDown color="#29BCC1" />
                                                                                <img src={arrowdropdown} alt />
                                                                            }
                                                                            className="c_select"
                                                                            onSelect={(value, event) => {
                                                                                handleOnChange(value, event);
                                                                            }}
                                                                            showSearch
                                                                            placeholder="Select condition"
                                                                            filterOption={(input, option) => {
                                                                                return option?.children
                                                                                    ?.toLowerCase()
                                                                                    ?.startsWith(input?.toLowerCase());
                                                                            }}
                                                                        >
                                                                            {conditions?.data?.disease?.map(
                                                                                (disease, index) => (
                                                                                    <Option value={disease.name} key={index}>
                                                                                        {disease.name}
                                                                                    </Option>
                                                                                )
                                                                            )}
                                                                        </Select>
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                            {mobile && <div className="flex_start">{med}</div>}
                                                        </Col>

                                                        <Col md={8}>
                                                            <Form.Item name="cosultation_note" label="Notes">
                                                                {/* <p className="labelText">Notes</p> */}
                                                                <TextArea
                                                                    defaultValue={
                                                                        AppointmentData?.data?.prescription
                                                                            ?.patient_consultation_note
                                                                    }
                                                                    onChange={(e) => {
                                                                        setNote({ note: e.target.value });
                                                                        // console.log("NOTE", note)
                                                                    }}
                                                                    rows={6}
                                                                    className="c_input"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    {!mobile && <Row>{med}</Row>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            mobile
                                                ? location?.search?.split("?")[1] === "#medical_record"
                                                    ? "tab_data cover_space3"
                                                    : "d-none"
                                                : "tab_data cover_space3"
                                        }
                                        id="medical-records"
                                    >
                                        {mobile ? (
                                            <div className="column_flex justify_between">
                                                <div className="white_color_div">
                                                    <div className="flex_end justify_between">
                                                        <div className="column_flex gap_div">
                                                            <div className="column_flex">
                                                                <HeadingDescSmall text="Tests Taken on" />
                                                                <HeadingDescSmall text="Mar 01, 2022" />
                                                            </div>
                                                            <div className="column_flex">
                                                                <HeadingDescSmall text="Total Reports" />
                                                                <HeadingDescSmall text="3 Reports, 1 Prescription" />
                                                            </div>
                                                        </div>
                                                        <div className="flex_end gap_div">
                                                            <a className="consult_now">
                                                                <FiArrowRightCircle className="arrow_black" />
                                                                <p className="black_text">VIEW</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="white_color_div">
                                                    <div className="flex_end justify_between">
                                                        <div className="column_flex gap_div">
                                                            <div className="column_flex">
                                                                <HeadingDescSmall text="Tests Taken on" />
                                                                <HeadingDescSmall text="Mar 01, 2022" />
                                                            </div>
                                                            <div className="column_flex">
                                                                <HeadingDescSmall text="Total Reports" />
                                                                <HeadingDescSmall text="3 Reports, 1 Prescription" />
                                                            </div>
                                                        </div>
                                                        <div className="flex_end gap_div">
                                                            <a className="consult_now">
                                                                <FiArrowRightCircle className="arrow_black" />
                                                                <p className="black_text">VIEW</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="white_color_div pb-0">
                                                <div className="gap_div">
                                                    <HeadingWithSpaceLarge text="MEDICAL RECORDS" />
                                                </div>
                                                <div className="appointment_div_data medicalRec text-center medicalRecordsTableCall">
                                                    {medical_record_table.length === 0 ? (
                                                        <HeadingDesc text="No Medical Records Shared"></HeadingDesc>
                                                    ) : (
                                                        <Form.Item name="medicalRecord">
                                                            <Form.Item>
                                                                <TableComponent
                                                                    header={medRecordHeader}
                                                                    data={medical_record_table}
                                                                    pagination={false}
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Previous Consultation Table */}

                                    {previousConsultationData?.length > 0 && (
                                        <div className="column_flex justify_between">
                                            <div className="white_color_div mt-5 d-none">
                                                {previousConsultationData?.length > 0 && (
                                                    <div className="gap_div">
                                                        <HeadingWithSpaceLarge text="VITALS" />
                                                    </div>
                                                )}
                                                <div className="appointment_div_data">
                                                    <Form.Item name="vitalTable" className="vital_table">
                                                        <Form.Item>
                                                            <TableComponent
                                                                header={previousConsultationHeader}
                                                                data={previousConsultationData}
                                                                pagination={false}
                                                            />
                                                        </Form.Item>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    <div
                                        className={
                                            mobile
                                                ? location?.search?.split("?")[1] === "#prescribe_med"
                                                    ? "tab_data cover_space3"
                                                    : "d-none"
                                                : "tab_data cover_space3"
                                        }
                                        id="prescribe_med"
                                    >
                                        <div className="appointment_div_data">
                                            {/* {!mobile && <div className="white_color_div">
                    <div className="gap_div">
                      <HeadingWithSpaceLarge text="PRESCRIBE MEDICINES" />
                    </div>
                  </div>
                  } */}
                                            {/* <Form.Item name="medicine">
                    <Form.Item>
                      {mobile ?
                        <div className="column_flex justify_between">
                          <div className="white_color_div">
                            <div className="flex_end justify_between">
                              <div className="column_flex gap_div">
                                <div className="column_flex">
                                  <HeadingDescSmall text="Medicine" />
                                  <HeadingDescSmall text="Tramal" />
                                </div>
                                <div className="column_flex">
                                  <HeadingDescSmall text="Frequency" />
                                  <HeadingDescSmall text="Thrice a day" />
                                </div>
                                <div className="column_flex">
                                  <HeadingDescSmall text="Instruction" />
                                  <HeadingDescSmall text="After Meal" />
                                </div>
                              </div>
                              <div className="column_flex gap_div">
                                <div className="column_flex">
                                  <HeadingDescSmall text="Dosage" />
                                  <HeadingDescSmall text="100 mg" />
                                </div>
                                <div className="column_flex">
                                  <HeadingDescSmall text="Duration" />
                                  <HeadingDescSmall text="3 Day(s)" />
                                </div>
                                <div className="flex_start">
                                  <a>
                                    <img src={editIConGreen} alt="edit"></img>
                                  </a>
                                  <a>
                                    <img src={deleteIconPink} alt="delete"></img>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="white_color_div">
                            <div className="flex_end justify_between">
                              <div className="column_flex gap_div">
                                <div className="column_flex">
                                  <HeadingDescSmall text="Medicine" />
                                  <HeadingDescSmall text="Tramal" />
                                </div>
                                <div className="column_flex">
                                  <HeadingDescSmall text="Frequency" />
                                  <HeadingDescSmall text="Thrice a day" />
                                </div>
                                <div className="column_flex">
                                  <HeadingDescSmall text="Instruction" />
                                  <HeadingDescSmall text="After Meal" />
                                </div>
                              </div>
                              <div className="column_flex gap_div">
                                <div className="column_flex">
                                  <HeadingDescSmall text="Dosage" />
                                  <HeadingDescSmall text="100 mg" />
                                </div>
                                <div className="column_flex">
                                  <HeadingDescSmall text="Duration" />
                                  <HeadingDescSmall text="3 Day(s)" />
                                </div>
                                <div className="flex_start">
                                  <a>
                                    <img src={editIConGreen} alt="edit"></img>
                                  </a>
                                  <a>
                                    <img src={deleteIconPink} alt="delete"></img>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        :
                        <div className="white_color_div">
                          <TableComponent
                            header={medHeader}
                            data={medData2}
                            pagination={false}
                            bold={true}
                          />
                        </div>
                      }
                    </Form.Item>
                  </Form.Item> */}
                                            {/* =================================choose/write prescription==========================*/}

                                            <div className="prescription-parent" id="prescription">
                                                <Box sx={{ width: "100%", typography: "body1" }}>
                                                    <TabContext value={tabValue}>
                                                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                                            <TabList
                                                                onChange={handleTabs}
                                                                aria-label="lab API tabs example"
                                                            >
                                                                <Tab
                                                                    className="tab-1"
                                                                    label="Choose Prescription"
                                                                    value="1"
                                                                />
                                                                <Tab
                                                                    className="tab-2"
                                                                    label="Write Prescription"
                                                                    value="2"
                                                                />
                                                            </TabList>
                                                        </Box>
                                                        <TabPanel value="1">
                                                            <div className="white_color_div">
                                                                <div className="gap_div">
                                                                    <Form.Item>
                                                                        <MedForm
                                                                            medicine={medicine}
                                                                            complete={addMed}
                                                                            medTable={medTable}
                                                                            setShouldDispatchMedicine={
                                                                                setShouldDispatchMedicine
                                                                            }
                                                                        />
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Table
                                                                    style={{ backgroundColor: "#fff" }}
                                                                    className="table instant-feedback-table"
                                                                >
                                                                    <>
                                                                        <thead>
                                                                            <tr className="first-table-row">
                                                                                <th
                                                                                    style={{ color: "#313131" }}
                                                                                    className="fw-400 text-left"
                                                                                >
                                                                                    Medicine
                                                                                </th>
                                                                                <th
                                                                                    colSpan={4}
                                                                                    style={{ color: "#313131" }}
                                                                                    className="fw-400 text-center"
                                                                                >
                                                                                    Frequency
                                                                                </th>
                                                                                <th
                                                                                    style={{ color: "#313131" }}
                                                                                    className="fw-400 text-center"
                                                                                >
                                                                                    Duration
                                                                                </th>
                                                                                <th
                                                                                    style={{ color: "#313131" }}
                                                                                    className="fw-400 text-center"
                                                                                >
                                                                                    With Meal
                                                                                </th>
                                                                                <th className=""></th>
                                                                            </tr>
                                                                            <tr>
                                                                                <th className="text-left">&nbsp;</th>
                                                                                <th
                                                                                    className="text-center"
                                                                                    style={{ color: "#078A8E" }}
                                                                                >
                                                                                    Morning
                                                                                </th>
                                                                                <th
                                                                                    className="text-center"
                                                                                    style={{ color: "#078A8E" }}
                                                                                >
                                                                                    Afternoon
                                                                                </th>
                                                                                <th
                                                                                    className="text-center"
                                                                                    style={{ color: "#078A8E" }}
                                                                                >
                                                                                    Evening
                                                                                </th>
                                                                                <th
                                                                                    className="text-center"
                                                                                    style={{ color: "#078A8E" }}
                                                                                >
                                                                                    Night
                                                                                </th>
                                                                                <th className="text-center">&nbsp;</th>
                                                                                <th className="text-center">&nbsp;</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {medTable?.map((item, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="text-left">
                                                                                        {" "}
                                                                                        {item?.medicine}{" "}
                                                                                    </td>
                                                                                    <td className="me-2 text-center">
                                                                                        {item?.morning && (
                                                                                            <span className="bg-change-td">
                                                                                                {item?.morning}{" "}
                                                                                                {item?.morning && item?.unit}{" "}
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        {item?.afternoon && (
                                                                                            <span className="bg-change-td">
                                                                                                {item?.afternoon}{" "}
                                                                                                {item?.afternoon && item?.unit}
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        {item?.evening && (
                                                                                            <span className="bg-change-td">
                                                                                                {item?.evening}{" "}
                                                                                                {item?.evening && item?.unit}{" "}
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        {item?.night && (
                                                                                            <span className="bg-change-td">
                                                                                                {item?.night}{" "}
                                                                                                {item?.night && item?.unit}{" "}
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        {item?.number_of_days}
                                                                                    </td>
                                                                                    {/* <td ><img  src={greenIcon} alt='' className='img-fluid ms-4' /></td> */}
                                                                                    <td className="text-center">
                                                                                        {" "}
                                                                                        {item?.is_after_meal == "1"
                                                                                            ? "After Meal"
                                                                                            : "Before Meal"}{" "}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <img
                                                                                            style={{ cursor: "pointer" }}
                                                                                            src={RemovePre}
                                                                                            alt=""
                                                                                            onClick={(e) => {
                                                                                                let modified = medTable?.filter(
                                                                                                    (med, idx) => {
                                                                                                        return (
                                                                                                            med?.medicine !=
                                                                                                            item?.medicine
                                                                                                        );
                                                                                                    }
                                                                                                );
                                                                                                setMedTable(modified);
                                                                                            }}
                                                                                            className="img-fluid"
                                                                                        />
                                                                                        {/* <img style={{cursor:'pointer'}} src={EditPre} alt='' className='img-fluid ms-2' /> */}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </>
                                                                </Table>
                                                            </div>
                                                        </TabPanel>
                                                        <TabPanel value="2">
                                                            {" "}
                                                            <div className="white_color_div">
                                                                <div className="gap_div">
                                                                    <div className="p-4">
                                                                        <textarea
                                                                            maxLength={150}
                                                                            ref={textareaRef}
                                                                            placeholder="Write prescription here (Max: 150 characters)"
                                                                            className="textArea-w"
                                                                        ></textarea>
                                                                        {errorPrescription && (
                                                                            <div className="prescriptionError">
                                                                                <p>{errorPrescription}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <Col
                                                                        style={{ marginRight: "1.2rem" }}
                                                                        className="offset-md-8"
                                                                    >
                                                                        <button
                                                                            onClick={(e) => writePrescription(e)}
                                                                            className="review-button mt-3 me-2 text-uppercase MedBtn-btn"
                                                                        >
                                                                            ADD PRESCRIPTION
                                                                        </button>
                                                                    </Col>
                                                                </div>
                                                                <div className="prescriptionBox">
                                                                    <h4>Prescription</h4>
                                                                </div>
                                                                <div
                                                                    style={{ marginBottom: "1rem" }}
                                                                    className="row w-100"
                                                                >
                                                                    {writePrescriptionInfo?.map((pres) => (
                                                                        <>
                                                                            <Col md={11} className="mt-2">
                                                                                <p
                                                                                    style={{
                                                                                        marginLeft: "3rem",
                                                                                        wordBreak: "break-all",
                                                                                    }}
                                                                                >
                                                                                    {" "}
                                                                                    {pres}{" "}
                                                                                </p>
                                                                            </Col>
                                                                            <Col className="mt-2" md={1}>
                                                                                <img
                                                                                    style={{ cursor: "pointer" }}
                                                                                    onClick={(e) =>
                                                                                        removeWrittenPrescription(e, pres)
                                                                                    }
                                                                                    src={RemovePre}
                                                                                    alt=""
                                                                                    className="img-fluid"
                                                                                />
                                                                                <img
                                                                                    style={{ cursor: "pointer" }}
                                                                                    onClick={(e) =>
                                                                                        editPrescriptionInfo(e, pres)
                                                                                    }
                                                                                    src={EditPre}
                                                                                    alt=""
                                                                                    className="img-fluid ms-2"
                                                                                />
                                                                            </Col>
                                                                        </>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {/* <div className="d-flex">
                  </div> */}
                                                        </TabPanel>
                                                    </TabContext>
                                                </Box>
                                            </div>

                                            {/* =================================choose/write prescription==========================*/}
                                            {/* <div className="white_color_div">
                    <div className="gap_div">
                      <Form.Item>
                        <MedForm medicine={medicine} complete={addMed} />
                      </Form.Item>
                    </div>
                  </div> */}
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            mobile
                                                ? location?.search?.split("?")[1] === "#prescribe_lab"
                                                    ? "tab_data cover_space3"
                                                    : "d-none"
                                                : "tab_data cover_space3"
                                        }
                                        id="prescribe_lab"
                                    >
                                        <div className="appointment_div_data">
                                            {/* {!mobile && <div className="white_color_div">
                    <div className="gap_div">
                      <HeadingWithSpaceLarge text="PRESCRIBE LAB TESTS" />
                    </div>
                  </div>} */}
                                            {/* <Form.Item name="lab">
                    <Form.Item>
                      {mobile ?
                        <div className="column_flex justify_between">
                          <div className="white_color_div">
                            <div className="flex_end justify_between">
                              <div className="column_flex gap_div">
                                <div className="column_flex">
                                  <HeadingDescSmall text="Lab Test" />
                                  <HeadingDescSmall text="HbA1C (Glycosylated Hemoglobin)" />
                                </div>
                              </div>
                              <div className="column_flex gap_div">
                                <div className="column_flex">
                                  <a>
                                    <img src={editIConGreen} alt="edit"></img>
                                  </a>
                                  <a>
                                    <img src={deleteIconPink} alt="delete"></img>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        :
                        <div className="white_color_div">
                          <TableComponent
                            header={prescribeHeader}
                            data={prescribeData2}
                            pagination={false}
                            bold={true}
                          />
                        </div>}
                    </Form.Item>
                  </Form.Item> */}
                                            <div className="white_color_div">
                                                <div className="prescribe-lab">
                                                    <h4>PRESCRIBE LAB TESTS</h4>
                                                </div>
                                                <div className="gap_div">
                                                    <Form.Item>
                                                        <LabForm labs={labs} complete={addLab} />
                                                    </Form.Item>
                                                </div>
                                                {prescribeData.length > 0 ? (
                                                    <div className="prescriptionBox">
                                                        <h4>Lab Test </h4>
                                                    </div>
                                                ) : null}

                                                {/* lab-tests  */}

                                                {/* {prescribeData?.map((item, index) => {
                        return(
                            <div className="row w-100">
                      <Col md={2}>
                      <p style={{marginLeft:'1rem',padding:'20px'}} >{ item?.lab_name}</p>
                      </Col>
                      <Col md={10}>
                        <div className="d-flex justify-content-between">
                      <div style={{padding:'20px'}}>
                        <p> {item?.description}</p>
                    </div>
                        <div>
                        <img
                            style={{ cursor: "pointer" }}
                            src={RemovePre}
                            alt=""
                            className="img-fluid"
                            onClick={(e) => {
                              let modified = prescribeData?.filter(
                                (med, idx) => {
                                  return med?.lab_name != item?.lab_name;
                                }
                              );
                              setPrescribeData(modified);
                            }}
                          />

                        </div>
                        </div>
                      </Col>
                    </div>
                        )
                    })} */}

                                                <Table className="table instant-feedback-table lab-test-table border_bottom_rem">
                                                    <>
                                                        <tbody>
                                                            {prescribeData?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td className="med-test-type text-left w-25">
                                                                            {item?.lab_name}
                                                                        </td>
                                                                        <td className="text-left w-15">
                                                                            {item?.description}
                                                                        </td>
                                                                        <td className="w-50">&nbsp;</td>

                                                                        <td className="w-5 text-center">
                                                                            <img
                                                                                style={{ cursor: "pointer" }}
                                                                                src={RemovePre}
                                                                                alt=""
                                                                                className="img-fluid"
                                                                                onClick={(e) => {
                                                                                    let modified = prescribeData?.filter(
                                                                                        (med, idx) => {
                                                                                            return (
                                                                                                med?.lab_name != item?.lab_name
                                                                                            );
                                                                                        }
                                                                                    );
                                                                                    setPrescribeData(modified);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </>
                                                </Table>
                                                {/* {prescribeData?.map((item, index) => (
                      <div className="lab-test" key={index}>
                        <div style={{display: "flex", alignItems: "center"}}>
                          <p>{item?.lab_name}</p>
                          <p style={{marginLeft: "100px"}}>{item?.description}</p>
                        </div>
                        <div style={{ marginRight: "6rem" }} className="d-flex">
                          <img
                            style={{ cursor: "pointer" }}
                            src={RemovePre}
                            alt=""
                            className="img-fluid"
                            onClick={(e) => {
                              let modified = prescribeData?.filter(
                                (med, idx) => {
                                  return med?.lab_name != item?.lab_name;
                                }
                              );
                              setPrescribeData(modified);
                            }}
                          />

                        </div>
                      </div>
                    ))} */}

                                                {/* this div */}
                                                {/* lab-test  */}
                                            </div>
                                        </div>
                                    </div>
                                </Row >
                            </Container>
                        </>
                    )}

                    <div className="bottom_btn bg-transparent">
                        {/* <SimpleButton type="submit" text="MARK COMPLETE" className="fixed_app_button" />
             */}

                        <button className="appoitment-cancel-btn fixed_app_button bg-transparent text-uppercase">
                            Cancel
                        </button>

                        <button
                            className="submit-btn-completed add-record-btn text-uppercase w-100"
                            type="submit"
                        >
                            <span className="hk_for_center"> Mark Complete</span>
                            <span className="add-record-chevron">
                                <FiChevronRight />
                            </span>
                        </button>
                    </div>

                    {isMobile ? (
                        <>
                            <main className="forall_mobile_section">
                                <section className="Reason_for_visit_mobile for_accordion_style">
                                    <Accordion>
                                        <Accordion.Item eventKey="0" className={`${AppointmentData?.data?.reason_for_visit && 'data_true'}`}>
                                            <Accordion.Header>
                                                {!AppointmentData?.data?.reason_for_visit ? (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon="fas fa-check-circle" />
                                                    </>
                                                )}
                                                Reason for Visit
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {!AppointmentData?.data?.reason_for_visit ? (
                                                    <>
                                                        <p className="text-center no_data_mob_acc_state">No reason given</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h5>{AppointmentData?.data?.reason_for_visit}</h5>
                                                        <p>{AppointmentData?.data?.additional_detail}</p>
                                                    </>
                                                )}

                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </section>
                                {/* mobile accodian */}
                                <section className="vitals_mobile for_accordion_style">
                                    <Accordion>
                                        <Accordion.Item eventKey="0" className={`${vitalData?.length > 0 && 'data_true'}`}>
                                            <Accordion.Header className="vital_header">
                                                {vitalTableLocale ? (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon="fas fa-check-circle" />
                                                    </>
                                                )}
                                                Vitals <span>4/11/2022 <i>| 9:00 AM</i></span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {vitalData?.length > 0 ? (
                                                    <>
                                                        <p className="text-center no_data_mob_acc_state">{vitalTableLocale?.emptyText}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="vitals_area_mob">
                                                            <div className="d-flex align-items-center justify-content-center mb-4">
                                                                <h4><span>Sehat Score:</span> 8/10 <img src={smilyFace} alt="Score Emoji" /></h4>
                                                            </div>
                                                            <div className="d-flex align-items-center flex-wrap">
                                                                <div className="vital_rate">
                                                                    <h4>Blood Pressure</h4>
                                                                    <p><span className="scor">120/80</span> mmHG</p>
                                                                    <span className="score_measure score">Normal</span>
                                                                </div>
                                                                <div className="vital_rate">
                                                                    <h4>Heart Rate</h4>
                                                                    <p><span className="scor">79</span> BPM</p>
                                                                    <span className="score_measure_high score">High</span>
                                                                </div>
                                                                <div className="vital_rate">
                                                                    <h4>Oxygen Saturation</h4>
                                                                    <p><span className="scor">95</span> %</p>
                                                                    <span className="score_measure score">Normal</span>
                                                                </div>

                                                                <div className="vital_rate">
                                                                    <h4>Respiration Rate</h4>
                                                                    <p><span className="scor">14</span> bpm</p>
                                                                    <span className="score_measure score">Normal</span>
                                                                </div>
                                                                <div className="vital_rate">
                                                                    <h4>SDNN</h4>
                                                                    <p><span className="scor">105</span> MS</p>
                                                                    <span className="score_measure score">Normal</span>
                                                                </div>
                                                                <div className="vital_rate">
                                                                    <h4>Stress Level</h4>
                                                                    <p><img src={stressFace} alt="Stress Emoji" /></p>
                                                                    <span className="score_measure score">Low</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </section>

                                <section className="medical_records_mobile for_accordion_style">
                                    <Accordion>
                                        <Accordion.Item eventKey="0" className={`${medicalRec?.length !== 0 && 'data_true'}`}>
                                            <Accordion.Header>
                                                {medicalRec?.length === 0 || medicalRec?.length < 0 ? (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon="fas fa-check-circle" />
                                                    </>
                                                )}
                                                Medical Records
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {medicalRec?.length === 0 || medicalRec?.length < 0 ? (
                                                    <>
                                                        <p className="text-center no_data_mob_acc_state">No medical records shared</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <table className="med-record_data">
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>{AppointmentData?.data?.doctor?.name}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {console.log(medicalRec, "medicalRec")}
                                                                {medicalRec?.map((item) => (
                                                                    <tr>
                                                                        {item?.instant_medical_record_files?.length > 0 && (
                                                                            <td>
                                                                                {item?.date}
                                                                            </td>
                                                                        )}
                                                                        {item?.instant_medical_record_files?.length > 0 && (
                                                                            <>
                                                                                <td>
                                                                                    {item?.instant_medical_record_files.map((file) => (
                                                                                        <>
                                                                                            <div className="d-flex align-items-center mb-2" onClick={(e) => handleFileView(file)}>
                                                                                                <FontAwesomeIcon icon="fas fa-file" /><p>  {cutFromMiddle(file?.filename)}{" "}</p>
                                                                                            </div>
                                                                                        </>
                                                                                    ))}
                                                                                </td>
                                                                            </>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                                {/* {medicalRec?.length > 0 ? medicalRec?.map((item) => {
                                  { console.log(item, "itemitemitem") }
                                  item?.instant_medical_record_files.map((file) => {
                                    { console.log(file, "filefile") }
                                    return (
                                      <>
                                        <tr>
                                          <td>
                                            {item?.date}
                                            <td>
                                              <h3 className="file-name">Reports for Dr. Madeeha Asad</h3>
                                              <div className="d-flex align-items-center mb-2">
                                                <FontAwesomeIcon icon="fas fa-file" /><p>  {cutFromMiddle(file?.filename)}{" "}</p>
                                              </div>
                                            </td>
                                          </td>
                                        </tr>
                                      </>
                                    )
                                  })
                                }) : null} */}
                                                            </tbody>
                                                        </table>
                                                    </>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </section>

                                <section className="medical_history_mobile for_accordion_style">
                                    <Accordion>
                                        <Accordion.Item eventKey="0" className={`data_true`}>
                                            <Accordion.Header>
                                                <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                Medical History
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <>
                                                    <div
                                                        className="appointment_div_data"
                                                        style={{ flexDirection: "column" }}
                                                    >
                                                        <Row>
                                                            <Col md={4}>
                                                                <div className="column_flex">
                                                                    <div className="column_flex2">
                                                                        <Form.Item name="blood_group" label="Blood Group">
                                                                            {/* <p className="labelText">Blood Group</p> */}
                                                                            <Select
                                                                                defaultValue={
                                                                                    patient?.prescription?.blood_group
                                                                                }
                                                                                dropdownAlign={{ offset: [0, 4] }}
                                                                                placeholder="Select blood group"
                                                                                suffixIcon={
                                                                                    // <HiOutlineArrowDown color="#29BCC1" />
                                                                                    <img src={arrowdropdown} alt />
                                                                                }
                                                                                className="c_select"
                                                                            >
                                                                                {/* <Option selected >{patient?.prescription?.blood_group}</Option> */}
                                                                                <Option value="A+">A+</Option>
                                                                                <Option value="A-">A-</Option>
                                                                                <Option value="B+">B+</Option>
                                                                                <Option value="B-">B-</Option>
                                                                                <Option value="O+">O+</Option>
                                                                                <Option value="O-">O-</Option>
                                                                                <Option value="AB+">AB+</Option>
                                                                                <Option value="AB-">AB-</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>

                                                                    <div className="column_flex2">
                                                                        <Form.Item
                                                                            name="condition"
                                                                            label="Add Existing Condition"
                                                                        >
                                                                            {/* <p className="labelText">Add Existing Condition</p> */}
                                                                            <Select
                                                                                dropdownAlign={{ offset: [0, 4] }}
                                                                                suffixIcon={
                                                                                    // <HiOutlineArrowDown color="#29BCC1" />
                                                                                    <img src={arrowdropdown} alt />
                                                                                }
                                                                                className="c_select"
                                                                                onSelect={(value, event) => {
                                                                                    handleOnChange(value, event);
                                                                                }}
                                                                                showSearch
                                                                                placeholder="Select condition"
                                                                                filterOption={(input, option) => {
                                                                                    return option?.children
                                                                                        ?.toLowerCase()
                                                                                        ?.startsWith(input?.toLowerCase());
                                                                                }}
                                                                            >
                                                                                {conditions?.data?.disease?.map(
                                                                                    (disease, index) => (
                                                                                        <Option value={disease.name} key={index}>
                                                                                            {disease.name}
                                                                                        </Option>
                                                                                    )
                                                                                )}
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </div>
                                                                {mobile && <div className="flex_start">{med}</div>}
                                                            </Col>

                                                            <Col md={8}>
                                                                <Form.Item name="cosultation_note" label="Notes">
                                                                    {/* <p className="labelText">Notes</p> */}
                                                                    <TextArea
                                                                        defaultValue={
                                                                            AppointmentData?.data?.prescription
                                                                                ?.patient_consultation_note
                                                                        }
                                                                        onChange={(e) => {
                                                                            setNote({ note: e.target.value });
                                                                            // console.log("NOTE", note)
                                                                        }}
                                                                        rows={6}
                                                                        className="c_input"
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        {!mobile && <Row>{med}</Row>}
                                                    </div>
                                                </>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </section>

                                <section className="prescriptions_mobile for_accordion_style">
                                    <Accordion>
                                        <Accordion.Item eventKey="0" className={`'data_true`}>
                                            <Accordion.Header>
                                                <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                Prescription
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <>
                                                    <TabItem.Container defaultActiveKey="1" id="left-tabs-example">
                                                        <Nav variant="pills" className="flex-column hk_bg_cover">
                                                            <Nav.Item>
                                                                <Nav.Link eventKey={`1`}>
                                                                    <h6>Choose</h6>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link eventKey={`2`}>
                                                                    <h6>Write</h6>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        </Nav>

                                                        <TabItem.Content>
                                                            <TabItem.Pane eventKey={`1`}>
                                                                Choose
                                                            </TabItem.Pane>
                                                            <TabItem.Pane eventKey={`2`}>
                                                                Write
                                                            </TabItem.Pane>
                                                        </TabItem.Content>
                                                    </TabItem.Container>
                                                </>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </section>

                                <section className="labTests for_accordion_style">

                                    <Accordion>
                                        <Accordion.Item eventKey="0" className={`${vitalData?.length > 0 && 'data_true'}`}>
                                            <Accordion.Header className="vital_header">
                                                {prescribeData ? (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon="fas fa-check-circle" />
                                                    </>
                                                )}
                                                Lab Tests
                                            </Accordion.Header>
                                            <Accordion.Body>

                                                <div className="gap_div">
                                                    <Form.Item>
                                                        <LabForm labs={labs} complete={addLab} />
                                                    </Form.Item>
                                                </div>

                                                <div className="lab_test_results">

                                                    {prescribeData.length > 0 ? (
                                                        <div className="prescriptionBox">
                                                            <h4>Lab Test </h4>
                                                        </div>
                                                    ) : null}
                                                    <ul className="lab_test_mobile list-unstyled">

                                                        {prescribeData?.map((item, index) => {
                                                            return (<li>
                                                                <div className="d-flex justify-content-between">
                                                                    <div><h6><span>{item?.lab_name}</span> {item?.description}</h6></div>
                                                                    <div> <img
                                                                        style={{ cursor: "pointer" }}
                                                                        src={RemovePre}
                                                                        alt=""
                                                                        className="img-fluid close_mob"
                                                                        onClick={(e) => {
                                                                            let modified = prescribeData?.filter(
                                                                                (med, idx) => {
                                                                                    return (
                                                                                        med?.lab_name != item?.lab_name
                                                                                    );
                                                                                }
                                                                            );
                                                                            setPrescribeData(modified);
                                                                        }}
                                                                    /></div>
                                                                </div>
                                                            </li>
                                                            );
                                                        })}
                                                    </ul>



                                                </div>

                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </section>


                                <section className="previous_consultation_mob for_accordion_style">

                                    <Accordion>
                                        <Accordion.Item eventKey="0" >
                                            <Accordion.Header className="previous_header">
                                                {prescribeData ? (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon="fas fa-check-circle" />
                                                    </>
                                                )}
                                                Previous Consultation
                                            </Accordion.Header>
                                            <Accordion.Body className="prev_consult_mob">
                                                <div >




                                                    <ul className="result_prev_consult">
                                                        <li>Dr. Ismail Siddiqui <span>10/04/2023</span></li>
                                                        <li><span>10/04/2023</span></li>
                                                        <li><a href="" className="view_presc">View Prescription</a></li>
                                                    </ul>
                                                    {visibleItems >= 2 && (
                                                        <ul className="result_prev_consult">
                                                            <li>Dr. Ismail Siddiqui <span>10/04/2023</span></li>
                                                            <li><span>10/04/2023</span></li>
                                                            <li><a href="" className="view_presc">View Prescription</a></li>
                                                        </ul>
                                                    )}
                                                    {visibleItems >= 3 && (
                                                        <ul className="result_prev_consult">
                                                            <li>Dr. Ismail Siddiqui <span>10/04/2023</span></li>
                                                            <li><span>10/04/2023</span></li>
                                                            <li><a href="" className="view_presc">View Prescription</a></li>
                                                        </ul>
                                                    )}
                                                    {visibleItems >= 4 && (
                                                        <ul className="result_prev_consult">
                                                            <li>Dr. Ismail Siddiqui <span>10/04/2023</span></li>
                                                            <li><span>10/04/2023</span></li>
                                                            <li><a href="" className="view_presc">View Prescription</a></li>
                                                        </ul>
                                                    )}
                                                    {visibleItems < 4 && (
                                                        <div className="pd-10">
                                                            <button
                                                                className="view_more1 btn btn-sucsess w-100 d-block"
                                                                onClick={handleViewMore}
                                                            >
                                                                View More
                                                            </button>
                                                        </div>
                                                    )}

                                                </div>


                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                    <div className="prev_consult_mobile_view">
                                        <div className="text-end">
                                            <img src={logoMob} className="img-fluid" alt="logo" />
                                        </div>
                                        <div className="box_dr d-flex align-items-center">
                                            <div className="box_dr_img">
                                                <img src={featuredDoc} className="img-fluid dr_image_icon" alt="logo" />
                                                <img src={drSaad} className="img-fluid dr_image" alt="dr" />
                                            </div>
                                            <div>
                                                <p className="drName">Dr. Madeeha Asad</p>
                                                <h6>General Practitioner</h6>
                                                <h6>M.B.B.S, F.C.P.S, MRCOG</h6>
                                            </div>
                                        </div>

                                        <div className="batient_bio">
                                            <div className="d-flex flex-wrap">
                                                <div className="w-50">
                                                    <h6><span>Patient:</span><br />
                                                        Fatima Ahmed Khan</h6>
                                                </div>
                                                <div className="w-50">
                                                    <h6><span>Patient Number:
                                                    </span><br />
                                                        0001230</h6>
                                                </div>
                                                <div className="w-100">
                                                    <h6><span>Prescribed on:
                                                    </span><br />
                                                        02/11/2022</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <Accordion defaultActiveKey="0" className="medicine_accordian">
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>Tylenol Syrup (100mg)<span className="duratiion_med">Duration: 5 Days</span></Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="medicine_instuction">
                                                        <ul>
                                                            <li>
                                                                <p>Morning:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <h6>Instructions: <span>After meal</span></h6>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="1">
                                                <Accordion.Header>Acefyl Syrup (125ml) <span className="duratiion_med">Duration: 5 Days</span></Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="medicine_instuction">
                                                        <ul>
                                                            <li>
                                                                <p>Morning:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Evening:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>

                                                            <li>
                                                                <p>Night:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>

                                                        </ul>
                                                        <h6>Instructions: <span>After meal</span></h6>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="2">
                                                <Accordion.Header>Distelgesic (375 mg) <span className="duratiion_med">Duration: 5 Days</span></Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="medicine_instuction">
                                                        <ul>
                                                            <li>
                                                                <p>Morning:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Evening:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>

                                                            <li>
                                                                <p>Night:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>

                                                        </ul>
                                                        <h6>Instructions: <span>After meal</span></h6>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="3">
                                                <Accordion.Header>Acefyl Syrup (125ml) <span className="duratiion_med">Duration: 5 Days</span></Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="medicine_instuction">
                                                        <ul>
                                                            <li>
                                                                <p>Morning:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Afternoon:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p>Evening:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>

                                                            <li>
                                                                <p>Night:</p>
                                                                <div className="box_blue">
                                                                    <h6>1<br />
                                                                        Tablet</h6>
                                                                </div>
                                                            </li>

                                                        </ul>
                                                        <h6>Instructions: <span>After meal</span></h6>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </div>

                                </section>








                            </main>
                        </>
                    ) : null}
                    {/* ----------------leave consultation modal ----------------------------- */}
                    <Modal
                        className="leaveConsultationModal"
                        title=""
                        centered
                        visible={modal2Visible}
                        onOk={() => completeAppointment()}
                        onCancel={(e) => {
                            setModal2Visible(false);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="col-md-9 m-auto text-center">
                            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500">
                                Are you sure you want mark this consultation as complete?
                                <div className="hk_go_for_next">
                                    <Checkbox onChange={forStartNextConsultation}>Start next video call</Checkbox>
                                </div>
                            </h5>
                        </div>
                    </Modal>
                    {/* <AppointmentModal btn1Text={"yes"} btn2Text={"no"} show={modal2Visible}
          description="Are you sure you want to leave
          the consultation?" />
          {/* ------------------------mark complete popup -------------------------*/}

                    <Modal
                        className="consultaionEndedModal"
                        title=""
                        centered
                        visible={modal3Visible}
                        // onOk={() => completeAppointment()}
                        cancelButtonProps={{ style: { display: "none" } }}
                        footer={[
                            // <Button className="col-md-9 m-auto" key="info" onClick={() => completeAppointment()}>
                            //   Mark Complete
                            // </Button>

                            <Button
                                className="col-md-9 m-auto"
                                key="info"
                                onClick={() => setAppointmentCompleted(true)}
                            >
                                Mark Complete
                            </Button>,
                        ]}
                    >
                        <div className="col-md-9 m-auto text-center">
                            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500">
                                Consultation has ended
                            </h5>
                            <p>Please mark this consultation as complete.</p>
                            <div className="hk_go_for_next">
                                <Checkbox onChange={forStartNextConsultation2}>Start next video call</Checkbox>
                            </div>
                        </div>
                    </Modal>
                    {/* ----------------------for instant consulation disable------------------- */}
                    <Modal
                        className="consultaionEndedModal"
                        title=""
                        centered
                        visible={modal1Visible}
                        onOk={() => {
                            setModal1Visible(false);
                        }}
                        cancelButtonProps={{ style: { display: "none" } }}
                        footer={[
                            <Button
                                className="col-md-9 m-auto"
                                key="info"
                                onClick={() => {
                                    setModal1Visible(false);
                                }}
                            >
                                Okay
                            </Button>,
                        ]}
                    >
                        <div className="col-md-8 m-auto text-center">
                            <img
                                src={disableConsultation}
                                alt=""
                                className="img-fluid mb-3"
                            />
                            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500 mb-3">
                                Instant Consultation disabled
                            </h5>
                            <p className="ff-circular fw-300 fs-17 line-height-24 mb-3">
                                Your instant consultation bookings will be temporarily disabled.{" "}
                            </p>
                            <p className="ff-circular fw-300 fs-17 line-height-24">
                                Please attend to the next patient in queue.
                            </p>
                        </div>
                    </Modal>
                    {/* ----------------consultation about end modal ----------------------------- */}
                    <Modal
                        className="leaveConsultationModal consultationAboutEnd"
                        title=""
                        centered
                        visible={modal4Visible}
                        closable={false}
                        onOk={(e) => {
                            setModal4Visible(false);
                        }}
                        okText="OK"
                        cancelButtonProps={{ style: { display: "none" } }}
                    >
                        <div className="col-md-11 m-auto text-center">
                            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500">
                                The consultation is about to end
                            </h5>
                        </div>
                    </Modal>
                    <ToastContainer />
                </Form >
            )
            }
        </div >
    );
}

export default AppointmentFirstTime;
