import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Checkbox,
} from "antd";
import { Col, Container, Row, Table } from "react-bootstrap";
import MedCancelCard from "../../uiComponents/card/medCancelCard/MedCancelCard";
import {
  HeadingDescSmall,
  HeadingDescVsmall,
  HeadingWithSpaceLarge,
} from "../../uiComponents/Headings";
import notallow from "../../assets/images/svg/notallow.svg";
import calendar01 from "../../assets/images/svg/calendar01.svg";
import delete1 from "../../assets/images/svg/delete.svg";
import fileIcon from "../../assets/images/png/view.png";
import { DatePicker } from 'antd';
import {
  FiChevronRight,
} from "react-icons/fi";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  getMedicine,
  getInsulin,
  getLab,
  postConsult,
} from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import {
  selectAppointmentData,
  selectDiseases,
  selectMedicine,
  selectInsulin,
  selectLabs,
  selectAppointmentToken,
  selectVitalScan,
  selectInstantMedical,
  selectMedicineLoading,
  selectLabLoading,
} from "./redux/slice";
import "./Appointments.scss";
import LabForm from "../../uiComponents/form/LabForm";
import MedForm from "../../uiComponents/form/MedForm";
import { ToastContainer, toast } from "react-toastify";
import Countdown from "react-countdown";
import "yet-another-react-lightbox/styles.css";
import { downloadPrescription } from "../../helpers/utilityHelper";
import { RouterPrompt } from "../../uiComponents/RouterPrompt";
import disableConsultation from "../../assets/images/svg/instant-disable-modal.svg";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import RemovePre from "../../assets/images/svg/removePre.svg";
import EditPre from "../../assets/images/svg/EditPre.svg";
import { useEffectOnce } from "react-use";
import instance from "../../utils/customAxios";
import { acquireApi, startApi, stopApi } from "../../utils/agoraEndpoints";
import axios from "axios";
import "./appointmentFirstTime.css";
import AgoraRTM from "agora-rtm-sdk";
import moment from "moment";
import { isMobile } from "react-device-detect";
import { isProduction } from "../../utils/helperFunctions";
import { getUserId } from "../../helpers/authHelper";
import Cookies from "js-cookie";
import Loader from "../../uiComponents/loader/Loader";
import Agoraa from "../../uiComponents/agora/Agoraa";
import { InsulinForm } from "../../uiComponents/form/InsulinForm";
import PersonalHistory from "../../uiComponents/form/PersonalHistory";
import MedicalHistory from "../../uiComponents/form/MedicalHistory";
import LabsReport from "../../uiComponents/form/LabsReport";
import Vitals from "../../uiComponents/form/Vitals";
import DiabetesHis from "../../uiComponents/form/DiabetesHis";

let arr = new Set();

function AppointmentFirstTime(props) {

  const doctorId = getUserId();

  let stagingName = `S${doctorId}`;
  let prodName = `L${doctorId}`;

  let firstPrefix = process.env.REACT_APP_BASE_URL?.includes("staging")
    ? stagingName
    : prodName;


  const history = useHistory();
  const params = useParams();
  const [tabValue, setTabValue] = React.useState("1");
  const [tabValue1, setTabValue1] = React.useState("11");
  const [tabSwitchState, setTabSwitchState] = useState(0);

  const dispatch = useAppDispatch();
  const location = useLocation();

  if (location?.state?.user_id) {
    sessionStorage.setItem("user_id", location?.state?.user_id);
  }

  if (location?.state?.visit_count) {
    sessionStorage.setItem("visit_count", location?.state?.visit_count);
  }

  const vitalScan = useAppSelector(selectVitalScan);
  const medicine = useAppSelector(selectMedicine);
  const insulin = useAppSelector(selectInsulin);
  const medicineLoading = useAppSelector(selectMedicineLoading);
  const labLoading = useAppSelector(selectLabLoading);
  const labs = useAppSelector(selectLabs);
  const [appForm] = Form.useForm();
  let id = params.id;
  let visit_count = sessionStorage.getItem("visit_count");
  const [startCall, setStartCall] = useState(false);
  const [config, setConfig] = useState(null);
  const [loader, setLoader] = useState(false);
  const [note, setNote] = useState("");
  const [cond, setCond] = useState([]);
  const [editMedicineStatus, setEditMedicineStatus] = useState(false);
  const [editInsulinStatus, setEditInsulinStatus] = useState(false);
  const [editLabStatus, setEditLabStatus] = useState(false);
  const [editMedicine, setEditMedicine] = useState();
  const [editInsulin, setEditInsulin] = useState();
  const [editLab, setEditLab] = useState();
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
  const [insulinTable, setInsulinTable] = useState([]);
  const [labTable, setLabTable] = useState([]);
  const [vitalTable, setVitalTable] = useState([]);
  const [medicalRec, setMedicalRec] = useState([]);
  const [timeRem, setTimeRem] = useState(0);
  const [prescribeData, setPrescribeData] = useState([]);
  const [count, setCount] = useState(0);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [endAnnounced, setendAnnounced] = useState(false);
  const [blockUserExit, setBlockUserExit] = useState(false);
  const [formValues, setFormValues] = useState({});
  const { Option } = Select;
  const { TextArea } = Input;
  const [mobile, setMobile] = useState(false);
  const [writePrescriptionInfo, setWritePrescriptionInfo] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [channelName, setChannelName] = useState("");
  const [channelToken, setChannelToken] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [stopId, setStopId] = useState("");
  const [appointmentCompleted, setAppointmentCompleted] = useState(false);
  const [shouldDispatchMedicine, setShouldDispatchMedicine] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState(false);
  const [userCity, setUserCity] = useState("");

  const [startNextConsultation, setStartNextConsultation] = useState(false);
  const [viewSingleReport, setViewSingleReport] = useState(false);
  const [viewSinglePresc, setViewSinglePresc] = useState(false);

  const [completeAppointmentLoader, setCompleteAppointmentLoader] =
    useState(false);
  const [cancelAppointmentLoader, setCancelAppointmentLoader] = useState(false);
  const [shouldDispatchDiseases, setShouldDispatchDiseases] = useState(false);
  const [addDiseaseLoader, setAddDiseaseLoader] = useState(false);
  const [addMedicineLoader, setAddMedicineLoader] = useState(false);
  const [addLabLoader, setAddLabLoader] = useState(false);
  const [shouldDispatchLabs, setShouldDispatchLabs] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [patientQueueCount, setPatientQueueCount] = useState(null);
  const [patientData, setPatientData] = useState(null)
  const [scroll, setScroll] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [pastRemarks, setPastRemarks] = useState([])
  const [isPastRemarks, setIsPastRemarks] = useState(false)
  const [lifeStyleOccupationList, setLifeStyleOccupationList] = useState('');
  
  const [agoraData, setAgoraData] = useState([])
  const [ethnicityList, setEthnicityList] = useState([]);
  const [targetEndTime, setTargetEndTime] = useState([]);
  const [countDown, setCountDown] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [inpersonCountdown, setInpersonCountdown] = useState(0);
  const [vitalsData, setVitalsData] = useState(null);
  const [editedVitals, setEditedVitals] = useState(null);
  const [disableButton, setDisableButton] = useState(true);
  const [inPersonCountDown, setInPersonCountDown] = useState(0);

  
  const [vitalsForm] = Form.useForm();

  useEffect(() => {
    setLoader(false);
    dispatch(getMedicine());
    dispatch(getInsulin());
    dispatch(getLab());
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        setMobile(true);
      }
    }
  }, [id]);

  useEffect(() => {
    console.log('Vitals Data in state:', vitalsData);  // This logs the state whenever it changes
  }, [vitalsData]);

  const handleVitalsSubmit = (event) => {
    event.preventDefault();
    vitalsForm
      .validateFields()
      .then((values) => {
        // Add patient_id to the vitals data
        const updatedVitalsData = {
          ...values,
          id:patientData?.patient_vitals?.id,
          patient_id: patientData?.patient_vitals?.patient_id 
        };
        console.log({updatedVitalsData})

        setEditedVitals(updatedVitalsData); 
        setDisableButton(true); 
        vitalsForm.submit(); 
      })
      .catch((error) => {
        console.error("Form validation failed:", error);
      });
  };

  // hit patient api 
  useEffect(() => {
    if (params.id) {
      (async () => {
        const response = await instance.get(`/consultation/patient-info?appointment_id=${params.id}`);
        if (response?.status == 200) {
          setPatientData(response?.data?.data);
          setPatientQueueCount(response?.data?.data?.patient_count);
          setInpersonCountdown(response?.data?.data?.apppointment?.remaining_time)
        }
      })()
    }
  }, [])

  useEffect(() => {
    let timer = inpersonCountdown;
    let minutes = 0;
    let seconds = 0;

    const interval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      setInPersonCountDown(`${minutes}:${seconds}`);
      if (--timer < 0) {
        clearInterval(interval);
        setInPersonCountDown('00:00');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [inpersonCountdown]);

  

  useEffect(() => {
    if (shouldDispatchDiseases === true) {
      // dispatch(getDiseases());
    }
  }, [shouldDispatchDiseases]);

  const gettingLifestyleAndOccupation = async () => {
    try {
        const response = await instance.get('/lifestyle-occupation')
        setLifeStyleOccupationList(response?.data)
    } catch (error) {
        console.log(error)
    }
}

  useEffect(() => {
      gettingLifestyleAndOccupation()
  }, [patientData])

  useEffect(() => {
    if (shouldDispatchLabs === true) {
      // dispatch(getLab());
      setShouldDispatchLabs(false);
    }
  }, [shouldDispatchLabs]);
console.log({patientData})

  // useEffect(() => {
  //   if(patient?.doctor?.id && patientData?.apppointment?.type == "in-person"){
  //     (async () => {
  //         try {
  //           const response = await instance.get(`consultation/in-person-call-time?appointment_id=${params.id}`);
  //           if(response?.status == 200){
  //             setInpersonCountdown(response)
  //             console.log({inpersonCountdown})
  //           }
  //         } catch (error) {
            
  //         }
  //     })();
  //   }
  // }, [])
  

  useEffect(() => {
    if (patientData?.doctor?.id && patientData?.apppointment?.type !== "in-person") {
      (async () => {
        try {
          const response = await instance.get(
            `/consultation/generate-agora-link?appointment_id=${params.id}&user_id=${patientData?.doctor?.id}`
          );
          if (response?.status == 200) {
            setChannelName(response?.data?.data?.channel_name);
            setChannelToken(response?.data?.data?.agora_token);
            setTotalSeconds(response?.data?.data?.remaining_time);
          }
        } catch (error) {
          // console.log(error, 'agorrerror');
        }
      })();
    }

  }, [channelName, patientData]);

  const gettingEthnicity = async () => {
    try {
      const response = await instance.get('/ethnicities')
      setEthnicityList(response?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    gettingEthnicity()
  }, [patientData])
console.log({patientData})
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (patientData?.doctor?.id && params.id) {
          const response = await instance.get(
            `/consultation/generate-agora-link?appointment_id=${params.id}&user_id=${patientData.doctor.id}`
          );
          setAgoraData(response?.data?.data);
          if (response?.status === 200) {
            if (response?.data?.data?.remaining_time === 0) {
              setAppointmentCompleted(true);
            }
            setTotalSeconds(response?.data?.data?.remaining_time);
            let currentDateTime = new Date();
            setTimeRem(
              new Date(
                currentDateTime.getTime() +
                parseInt(response?.data?.data?.remaining_time) * 1000
              )
            );
          }
        }
      } catch (error) {
        // Handle error
      }
    };
  
    if (patientData?.apppointment?.type !== "in-person") {
      const interval = setInterval(fetchData, 15000);
  
      return () => {
        clearInterval(interval);
      };
    }
  }, [params.id, patientData]);


  useEffect(() => {
    if (channelName && isProduction()) {
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

        if (response?.status === 200) {
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

  useEffect(() => {
    setVitalTable(vitalScan?.data);
  }, [vitalScan]);
  
  useEffect(() => {
    window.addEventListener("unload", function (e) {
    });
  }, []);

  const handleChangeTabs = (event, newValue) => {
    setTabValue1(newValue);
  };

  const handleTabs = (event, newValue) => {
    if (tabSwitchState === 1 && newValue === "2") {
    } else if (tabSwitchState === 2 && newValue === "1") {
    } else {
      setTabValue(newValue);
    }
  };

  let medical_record_table = [];

  medicalRec?.map((med, index) => {
    let imgs = [];
    med?.instant_medical_record_files.length && med?.instant_medical_record_files?.map((f) => {
      imgs.push(f?.file);
    });
    med?.instant_medical_record_files.length && medical_record_table.push({
      key: index + 1,
      // key: med?.instant_medical_record_files
      med_rec_date: moment(med?.date).format('DD/MM/YYYY'),
      med_rec_reports: med?.total_reports,
      buttons: med?.instant_medical_record_files,
    });
  });

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
        dateValue: scan?.date,
        timeValue: scan?.dateTime,
        heart_rate_value: scan?.heart_rate_value,
        respiratory_rate_value: scan?.respiratory_rate_value,
        stress_level_value: scan?.stress_level_value,
        spo2_value: scan?.spo2_value,
        sdnn_value: scan?.sdnn_value,
        blood_pressure_value: scan?.blood_pressure_value,
        sehat_score: scan?.sehat_score,
      });
    }
  });

  let previousConsultationData = [];

  patient.previous_consultation.length > 0 &&
    patient.previous_consultation.forEach((item) => {
      previousConsultationData.push({
        date: item?.date,
        prescription: `Prescription-${item?.id}`,
        url: `/appointment/download-prescription/${item?.id}?is_html=1&is_download=1`,
        downloadUrl: `${process.env.REACT_APP_BASE_URL}/appointment/download-prescription/${item?.id}?is_html=1&is_download=1`
      });
    });

  let completeApp = (values) => {
    setFormValues(values);
    setModal2Visible(true);
    // setCanUserLeave(false);
    setBlockUserExit(false);
  };

  const completeAppointment = async () => {
    setBlockUserExit(false);
    setCompleteAppointmentLoader(true);
    let appointmentsInQueue = [];

    // const response = await instance.get("/doctor/pending-appointment");

    // if (response?.data?.code === 200) {
    //   appointmentsInQueue = response?.data?.data;
    // }

    if (appointmentsInQueue?.length > 1) {
      appointmentsInQueue?.sort((a, b) => a?.id - b?.id);
    }

    let prescription_here = JSON.stringify(writePrescriptionInfo);

    // setBlockUserExit(true);
    setModal2Visible(false);
    setModal3Visible(false);
    let values = formValues;

    values.prescription_here = prescription_here;
    values.condition = cond;

    let payload = {
      appointment_id: params?.id,
      consultation_note: note?.note,
      follow_up_date: followUpDate,
      medicines: medTable,
      insulines: insulinTable,
      labs: labTable,
      vitals : editedVitals
    };
    const stopAgoraApi = stopApi(resourceId, stopId);

    const stopApiPayload = {
      cname: channelName,
      uid: params?.id?.toString(),
      clientRequest: {},
    };

    const customerKey = process.env.REACT_APP_AGORA_CUSTOMER_KEY;
    const customerSecret = process.env.REACT_APP_AGORA_CUSTOMER_SECRET;

    if (isProduction()) {
      try {
        const response = await instance.post(stopAgoraApi, stopApiPayload, {
          auth: {
            username: customerKey,
            password: customerSecret,
          },
        });
      } catch (error) { }
    }
    await dispatch(postConsult(payload)).then((data) => {
      if (data.payload.status === 200) {
        setStartCall(false);
        // leaveChannel()
        toast.success("Appointment is completed.");
        // setBlockUserExit(false);
        window.location.href = "/";
        const appID = process.env.REACT_APP_AGORA_APP_ID;
        const appointmentId = params?.id;
        const channelName = `${appointmentId}`;
        let token;
        window.location.href = "/";
      } else {
        setCompleteAppointmentLoader(false);
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

  let medData2 = [];

  medTable?.map((item) => {
    if (item?.medName) {
      item.medicine = item?.medName;
      medData2.push(item);
    }
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
    let timer = totalSeconds;
    let minutes = 0;
    let seconds = 0;

    const interval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      setCountDown(`${minutes}:${seconds}`);
      if (--timer < 0) {
        clearInterval(interval);
        setCountDown('00:00');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [totalSeconds]);

  useEffect(() => {
    let interval = setInterval(() => {
      let remainingTimeElement = document.querySelector(".rem-time");
      if (remainingTimeElement) {
        let remainingTime = remainingTimeElement.innerHTML;
        let [minutes, seconds] = remainingTime.split(":").map(Number);

        if (minutes === 2 && seconds === 0) {
          setModal4Visible(true);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);



  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     setScroll(window.scrollY > 650);
  //   });
  // }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if(window.scrollY > 500) {
        setScroll(true)
      }
      if(window.scrollY < 500) {
        setScroll(false)
      }
    });
  }, []);

  async function onCheckboxChange(e) {
    // setIsOnline(e);

    if (e === true) {
      const data = {
        is_instant_consultation: 1,
      };

      const response = await instance.post(`/doctor/instant-online-offline`, data);

      if (response?.data?.code === 200) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } else {
      let instant = pendingAppointments;


      if (instant?.length > 0) {
        setModal1Visible(true);
        setIsOnline(isOnline);
      }

      const data = {
        is_instant_consultation: 0,
      };

      const response = await instance.post(`/doctor/instant-online-offline`, data);

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
  }, [medTable?.length, writePrescriptionInfo?.length]);

  useEffect(() => {
    if (appointmentCompleted) {
      completeAppointment();
    }
  }, [appointmentCompleted]);

  useEffect(() => {
    if (shouldDispatchMedicine) {
      setShouldDispatchMedicine(false);
    }
  }, [shouldDispatchMedicine]);

  const forStartNextConsultation = (e) => {
    setStartNextConsultation(e.target.checked);
  };

  const forStartNextConsultation2 = (e) => {
    setStartNextConsultation(e.target.checked);
  };

  async function cancelAppointment(e) {
    setBlockUserExit(false);

    try {
      setCancelAppointmentLoader(true);

      const response = await instance.post(`/appointment/cancel-appointment?appointment_id=${id}`);
      setCancelAppointmentLoader(false);
      if (response?.data?.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      setCancelAppointmentLoader(false);
    }
  }

  const medDuration = [
    {
      name: "1 day",
      value: "1 day"
    },
    {
      name: "2 days",
      value: "2 days"
    },
    {
      name: "3 days",
      value: "3 days"
    },
    {
      name: "4 days",
      value: "4 days"
    },
    {
      name: "5 days",
      value: "5 days"
    },
    {
      name: "6 days",
      value: "6 days"
    },
    {
      name: "1 week",
      value: "1 week"
    },
    {
      name: "2 weeks",
      value: "2 weeks"
    },
    {
      name: "3 weeks",
      value: "3 weeks"
    },
    {
      name: "4 weeks",
      value: "4 weeks"
    },
    {
      name: "1 month",
      value: "1 month"
    }
  ]

  const handleDatePickerChange = (date, dateString, id) => {
    setFollowUpDate(dateString)
  }
  useEffect(() => {
    if (patientData?.prescription?.medicines != null) {

      setMedTable(patientData?.prescription?.medicines)
    }

  }, [patientData])
  useEffect(() => {
    if (patientData?.prescription?.insuline != null) {

      setInsulinTable(patientData?.prescription?.insuline)
    }

  }, [patientData])

  useEffect(() => {
    if (patientData?.prescription?.labs != null) {

      setLabTable(patientData?.prescription?.labs)
    }

  }, [patientData])


  useEffect(() => {
    if (patientData?.prescription?.remarks != null) {
      setIsPastRemarks(true)
      setPastRemarks(patientData?.prescription?.remarks)
    }

  }, [patientData])

  useEffect(() => {
    let timer = totalSeconds;
    let minutes = 0;
    let seconds = 0;

    const interval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      setCountDown(`${minutes}:${seconds}`);
      if (--timer < 0) {
        clearInterval(interval);
        setCountDown('00:00');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [totalSeconds]);
  console.log({ editedVitals })

  return (
    <div className="appointment_first cover_space appoint-css">
      {(completeAppointmentLoader ||
        cancelAppointmentLoader ||
        addDiseaseLoader ||
        addMedicineLoader ||
        medicineLoading ||
        labLoading ||
        addLabLoader) && <Loader />}
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
      {}
      <Form form={appForm} layout="vertical" onFinish={completeApp}>
        <Container fluid className="mt-5">
          {patientData && patientData?.apppointment?.type !== "in-person" ? (
            <Row>
              {!viewSingleReport || viewSinglePresc ? (
                <>
                  <Col md={4} className="d-block d-sm-none">
                    <div className="mt-6 box_mobile_call">
                      <Row>
                        <Col xs={7}>
                          <div className="pat_info_mob">
                            <HeadingDescVsmall
                              text={patientData?.patient_info?.name}
                            />
                            <HeadingDescVsmall
                              text={
                                patientData?.patient_info?.age === null ||
                                patientData?.patient_info?.age === ""
                                  ? "-"
                                  : patientData?.patient_info?.age + " years"
                              }
                            />
                            <HeadingDescVsmall
                              text={
                                patientData?.patient_info?.gender === null
                                  ? "-"
                                  : patientData?.patient_info?.gender
                              }
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
                              <h3 className="rem-time">{countDown}</h3>
                              <HeadingWithSpaceLarge text="  Remaining" />
                            </div>
                            <div className="heading-captalize  mobile_time01 pt-mob">
                              <HeadingWithSpaceLarge text="Patient In Queue" />
                              <h3>{patientQueueCount}</h3>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </>
              ) : null}
              <Col
                md={8}
                id="mobile_vid"
                className={scroll ? "fixedSameVideoTop" : ""}
              >
                <div
                  className={`video_div position-relative ${
                    isMobile && "noPadding"
                  } ${
                    (viewSingleReport === true && "currentViewState") ||
                    (viewSinglePresc === true && "currentViewState")
                  }`}
                >
                  {/* <img src={patient_img} alt="patient_img" className="img_vid" /> */}
                  <Agoraa
                    patientData={patientData && patientData}
                    doctorName={patientData?.doctor?.name}
                    setShowCancelModal={setShowCancelModal}
                    text={patientData?.patient_info?.name}
                    countDown = {countDown}
                    scroll = {scroll}
                  />
                  {/* doctor Name for small frame */}
                  <p className="topNameDoctorNow">
                    {patientData?.doctor?.name}
                  </p>
                  {/* doctor Name for small frame */}
                  {/* <div className="fixedScreenHeading withoutScrollFixed">
                    <HeadingDescVsmall text={patientData?.patient_info?.name} />
                    <div className="onlyForFixedRemainingTime">
                      <h3 className="rem-time">{countDown}</h3>
                    </div>
                  </div> */}
                </div>
              </Col>
              <Col md={4} className={scroll ? "vvissl" : ""} >
                <div
                  className={
                    mobile
                      ? "d-none"
                      : "white_color_div patient-info-set hk_white_video_right_area videoSize"
                  }
                >
                  <div className="column_flex nameP ">
                    <HeadingDescVsmall
                      text={`${patientData?.patient_info?.name} - ${patientData?.patient_info?.mr_no}`}
                    />
                  </div>
                  <div className="column_flex">
                    <HeadingDescVsmall text="Age" />
                    <HeadingDescVsmall
                      text={
                        patientData?.patient_info?.age === null ||
                        patientData?.patient_info?.age === ""
                          ? "-"
                          : patientData?.patient_info?.age + " years"
                      }
                    />
                  </div>
                  <div
                    className="column_flex"
                    style={{ textTransform: "capitalize" }}
                  >
                    <HeadingDescVsmall text="Gender" />
                    <HeadingDescVsmall
                      text={
                        patientData?.patient_info?.gender === null
                          ? "-"
                          : patientData?.patient_info?.gender
                      }
                    />
                  </div>
                  <div
                    className="column_flex"
                    style={{ textTransform: "capitalize" }}
                  >
                    <HeadingDescVsmall text="Date Of Birth" />
                    <HeadingDescVsmall
                      text={patientData?.patient_info?.date_of_birth}
                    />
                  </div>
                  <div
                    className="column_flex"
                    style={{ textTransform: "capitalize" }}
                  >
                    <HeadingDescVsmall text={"CNIC"} />
                    <HeadingDescVsmall text={patientData?.patient_info?.cnic} />
                  </div>
                  <div
                    className="column_flex"
                    style={{ textTransform: "capitalize" }}
                  >
                    <HeadingDescVsmall text="Address" />
                    <HeadingDescVsmall
                      text={patientData?.patient_info?.address}
                    />
                  </div>
                  <div
                    className="column_flex"
                    style={{ textTransform: "capitalize" }}
                  >
                    <HeadingDescVsmall text="Ethnicity" />
                    <HeadingDescVsmall
                      text={ethnicityList?.map((ethnicity) => {
                        if (
                          patientData?.patient_info?.ethnicity == ethnicity.id
                        ) {
                          return `${ethnicity.name}`;
                        }
                        return null;
                      })}
                    />
                  </div>
                  <div className="patient_status follow_up">
                    <HeadingDescVsmall text={patientData?.patient_info?.patient_type} />
                  </div>
                  <hr className="break-lines d-none d-lg-block mt-0 mb-0" />
                  <div className="flex_center videofixes">
                    <div className="column_flex heading-captalize">
                      <HeadingWithSpaceLarge text="Time" />
                      <h3 className="rem-time">{countDown}</h3>
                    </div>
                    <div className="column_flex heading-captalize">
                      <HeadingWithSpaceLarge text="Patient Queue" />
                      <h3>{patientQueueCount}</h3>
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
                    <HeadingWithSpaceLarge
                      text="Patient Information"
                      className="kh-infostyle"
                    />
                    <div className="flex_center">
                      <div className="column_flex">
                        <HeadingDescVsmall text="Patient Name" />
                        <HeadingDescVsmall
                          text={patientData?.patient_info?.name}
                        />
                      </div>
                      <div className="column_flex">
                        <HeadingDescVsmall text="Age" />
                        <HeadingDescVsmall
                          text={
                            patientData?.patient_info?.age === null ||
                            patientData?.patient_info?.age === ""
                              ? "-"
                              : patientData?.patient_info?.age + " years"
                          }
                        />
                      </div>
                      <div className="column_flex">
                        <HeadingDescVsmall text="Gender" />
                        <HeadingDescVsmall
                          text={
                            patientData?.patient_info?.gender === null
                              ? "-"
                              : patientData?.patient_info?.gender
                          }
                        />
                      </div>

                      <div className="patient_status first_time">
                        <HeadingDescVsmall text="First Time Appointment" />

                        <div className="inperson-timeWrapper">
                          <div className="column_flex kh-timeReamining">
                            <HeadingDescVsmall text="Time remaining" />
                            <h3 className="rem-time">{inPersonCountDown}</h3>
                          </div>

                          <div className="column_flex kh-timeReamining">
                            <HeadingDescVsmall text="Serial Number" />
                            <HeadingDescVsmall
                              className="kh-serialText"
                              text="01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={tabValue1}>
              <div
                className={
                  scroll
                    ? "container-fluid mt-5 whenNotFixedVideo"
                    : "container-fluid mt-5 whenNotFixedVideo"
                }
              >
                <div className="row">
                  <div className="col-12 col-lg-12 ">
                    <div className="row align-items-end">
                      <div className="col-12 col-lg-10">
                        <Box>
                          <TabList
                            onChange={handleChangeTabs}
                            aria-label="lab API tabs example"
                            className="tabListingBIDE"
                          >
                            <Tab
                              className="tab-1 tabItem"
                              label="Prescription"
                              value="11"
                            />
                            <Tab
                              className="tab-2 tabItem"
                              label="Personal History"
                              value="21"
                            />
                            <Tab
                              className="tab-3 tabItem"
                              label="Medical History"
                              value="31"
                            />
                            <Tab
                              className="tab-4 tabItem"
                              label="Diabetes History"
                              value="41"
                            />
                            <Tab
                              className="tab-4 tabItem"
                              label="Lab Reports"
                              value="51"
                            />
                            <Tab
                              className="tab-4 tabItem"
                              label="Vitals"
                              value="61"
                            />
                          </TabList>
                        </Box>
                      </div>
                      <div className="col-12 col-lg-2 ms-auto">
                        <div className="boxFollow">
                          <label className="d-block mb-1 followUp">
                            {" "}
                            Followup Date
                          </label>
                          <div className="datepickerBox dd">
                            <img
                              src={calendar01}
                              className="img-fluid imgCL"
                            ></img>
                            <DatePicker
                              onChange={(date, dateString) =>
                                handleDatePickerChange(date, dateString, 1)
                              }
                              disabledDate={(current) =>
                                current.isBefore(moment())
                              }
                              className="datepickerDate"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr></hr>
                  </div>
                </div>
                {/* end tabs section */}
              </div>
              <Container fluid>
                <Col md={12}>
                  <Row>
                    <Col md={12}>
                      <TabPanel value="11" className="pt-3 px-0">
                        <div className="newTabBoxes prescription-parent ">
                          <Box sx={{ width: "100%", typography: "body1" }}>
                            <TabContext value={tabValue}>
                              <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                              >
                                <TabList
                                  onChange={handleTabs}
                                  aria-label="lab API tabs example"
                                >
                                  <Tab
                                    className="tab-10"
                                    label="Medicine"
                                    value="1"
                                  />
                                  <Tab
                                    className="tab-2"
                                    label="INSULIN"
                                    value="266"
                                  />
                                  <Tab
                                    className="tab-3"
                                    label="LAB TESTS"
                                    value="3"
                                  />
                                  <Tab
                                    className="tab-4"
                                    label="REMARKS"
                                    value="4"
                                  />
                                </TabList>
                              </Box>
                              <TabPanel
                                value="1"
                                className="tabContent appointment_div_data mainTabletBox px-0 prescription1"
                                id="prescription"
                              >
                                <div className="white_color_div mb-4">
                                  <div className="gap_div">
                                    <Form.Item>
                                      <MedForm
                                        medDuration={medDuration}
                                        medicine={medicine}
                                        complete={addMed}
                                        medTable={medTable}
                                        setMedTable={setMedTable}
                                        setEditMedicineStatus={
                                          setEditMedicineStatus
                                        }
                                        editMedicineStatus={editMedicineStatus}
                                        setEditMedicine={setEditMedicine}
                                        editMedicine={editMedicine}
                                        setShouldDispatchMedicine={
                                          setShouldDispatchMedicine
                                        }
                                        setAddMedicineLoader={
                                          setAddMedicineLoader
                                        }
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                                <div>
                                  {medTable?.length > 0 && (
                                    <>
                                      {" "}
                                      <h2 className="headingtop">
                                        Active Medicines
                                      </h2>
                                    </>
                                  )}
                                  <div className="table-scroll">
                                    <Table
                                      style={{ backgroundColor: "#fff" }}
                                      className="table instant-feedback-table ss"
                                    >
                                      <>
                                        <thead>
                                          <tr className="first-table-row">
                                            <th
                                              style={{ color: "#313131" }}
                                              className="fw-400 medicine"
                                            >
                                              Medicine
                                            </th>
                                            <th
                                              colSpan={1}
                                              style={{ color: "#313131" }}
                                              className="fw-400"
                                            >
                                              Generic
                                            </th>
                                            <th
                                              colSpan={1}
                                              style={{ color: "#313131" }}
                                              className="fw-400"
                                            >
                                              Type
                                            </th>
                                            <th
                                              colSpan={1}
                                              style={{ color: "#313131" }}
                                              className="fw-400"
                                            >
                                              Route
                                            </th>
                                            <th
                                              colSpan={1}
                                              style={{ color: "#313131" }}
                                              className="fw-400"
                                            >
                                              Item Strength
                                            </th>
                                            <th
                                              colSpan={1}
                                              style={{ color: "#313131" }}
                                              className="fw-400"
                                            >
                                              Duration
                                            </th>
                                            <th
                                              colSpan={1}
                                              style={{ color: "#313131" }}
                                              className="fw-400 text-center"
                                            >
                                              Frequency
                                            </th>

                                            <th
                                              style={{ color: "#313131" }}
                                              className="fw-400"
                                            >
                                              Instructions
                                            </th>
                                            <th className=""></th>
                                          </tr>

                                          {medTable?.length > 0 && (
                                            <tr className="second-table-row dd ss">
                                              <th className="text-left">
                                                &nbsp;
                                              </th>
                                              <th className="text-left">
                                                &nbsp;
                                              </th>
                                              <th className="text-left">
                                                &nbsp;
                                              </th>
                                              <th className="text-left">
                                                &nbsp;
                                              </th>
                                              <th className="text-center">
                                                &nbsp;
                                              </th>
                                              <th className="text-center">
                                                &nbsp;
                                              </th>
                                              <th>
                                                <table className="w-100">
                                                  <tr>
                                                    <th
                                                      className=""
                                                      style={{
                                                        color: "#078A8E",
                                                      }}
                                                    >
                                                      M
                                                    </th>
                                                    <th
                                                      className=""
                                                      style={{
                                                        color: "#078A8E",
                                                      }}
                                                    >
                                                      A
                                                    </th>
                                                    <th
                                                      className=""
                                                      style={{
                                                        color: "#078A8E",
                                                      }}
                                                    >
                                                      E
                                                    </th>
                                                    <th
                                                      className=""
                                                      style={{
                                                        color: "#078A8E",
                                                      }}
                                                    >
                                                      N
                                                    </th>
                                                  </tr>
                                                </table>
                                              </th>
                                              <th className="">&nbsp;</th>
                                            </tr>
                                          )}
                                        </thead>
                                        <tbody>
                                          {console.log({medTable})}
                                          {medTable?.length > 0 ? (
                                            medTable.map((item, index) => (
                                              <tr
                                                key={index}
                                                className="align-middle"
                                              >
                                                <td className="kh-01 text-left">
                                                  {item?.medicine}{" "}
                                                </td>
                                                <td className="kh-01">
                                                  {item?.genericName}
                                                </td>
                                                <td className="kh-01">
                                                  {item?.unitName}
                                                </td>
                                                <td className="kh-01">
                                                  {item?.routeName}
                                                </td>
                                                <td className="kh-01">
                                                  {item?.strength}
                                                </td>
                                                <td className="kh-01 ">
                                                  {item?.number_of_days}
                                                </td>
                                                <td>
                                                  <table className="w-100">
                                                    <tbody>
                                                      <tr className="second_td_row">
                                                        <td className="kh-01 text-center">
                                                          {item?.afternoon && (
                                                            <span className="bg-change-td">
                                                              {item?.afternoon}{" "}
                                                            </span>
                                                          )}
                                                        </td>
                                                        <td className="me-2 te-lef ">
                                                          {item?.morning && (
                                                            <span className="kh-01 bg-change-td text-center">
                                                              {item?.morning}{" "}
                                                            </span>
                                                          )}
                                                        </td>
                                                        <td className="te-lef">
                                                          {item?.evening && (
                                                            <span className="kh-01 bg-change-td text-center">
                                                              {item?.evening}{" "}
                                                            </span>
                                                          )}
                                                        </td>
                                                        <td className="te-lef">
                                                          {item?.night && (
                                                            <span className="kh-01 bg-change-td text-center">
                                                              {item?.night}{" "}
                                                            </span>
                                                          )}
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                                <td className="kh-01">
                                                  {" "}
                                                  {item?.is_after_meal == "1" ? "After Meal" : item?.is_after_meal == "0" ? "Before Meal" : "" 
                                                    
                                                    }{" "}
                                                </td>
                                                <td className="text-center">
                                                  <img
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    src={RemovePre}
                                                    alt=""
                                                    onClick={(e) => {
                                                      let modified =
                                                        medTable?.filter(
                                                          (med, idx) => {
                                                            return (
                                                              med?.medicine !=
                                                              item?.medicine
                                                            );
                                                          }
                                                        );
                                                      setMedTable(modified);
                                                    }}
                                                  />
                                                  <img
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    src={EditPre}
                                                    alt=""
                                                    disabled={
                                                      editMedicineStatus
                                                    }
                                                    className={`img-fluid ms-2 ${
                                                      editMedicineStatus &&
                                                      "disabled_edit"
                                                    }`}
                                                    onClick={(e) => {
                                                      let modified =
                                                        medTable?.filter(
                                                          (med, idx) => {
                                                            return (
                                                              med?.medicine !=
                                                              item?.medicine
                                                            );
                                                          }
                                                        );
                                                      setMedTable(modified);
                                                      setEditMedicine(item);
                                                      setEditMedicineStatus(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                  {item?.return && (
                                                    <img
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      src={notallow}
                                                      alt=""
                                                      className="img-fluid ms-2 false "
                                                      onClick={(e) => {
                                                        let modified =
                                                          medTable?.filter(
                                                            (med, idx) => {
                                                              return (
                                                                med?.medicine !=
                                                                item?.medicine
                                                              );
                                                            }
                                                          );
                                                        setMedTable(modified);
                                                      }}
                                                    />
                                                  )}
                                                </td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr className="no_med">
                                              <td
                                                colSpan="9"
                                                className="text-center"
                                              >
                                                No medicine records
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </>
                                    </Table>
                                  </div>
                                </div>
                              </TabPanel>
                              <TabPanel
                                value="266"
                                className="tabContent appointment_div_data mainTabletBox px-0 prescription1 prescription-parent "
                              >
                                <div className="white_color_div">
                                  <div className="gap_div">
                                    <Form.Item>
                                      <InsulinForm
                                        insulin={insulin}
                                        medDuration={medDuration}
                                        complete={addMed}
                                        insulinTable={insulinTable}
                                        setInsulinTable={setInsulinTable}
                                        setEditInsulinStatus={
                                          setEditInsulinStatus
                                        }
                                        editInsulinStatus={editInsulinStatus}
                                        setEditInsulin={setEditInsulin}
                                        editInsulin={editInsulin}
                                        setShouldDispatchMedicine={
                                          setShouldDispatchMedicine
                                        }
                                        setAddMedicineLoader={
                                          setAddMedicineLoader
                                        }
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                                <div>
                                  <Table
                                    style={{ backgroundColor: "#fff" }}
                                    className="table instant-feedback-table ss"
                                  >
                                    <>
                                      <thead>
                                        <tr className="first-table-row">
                                          <th
                                            style={{ color: "#313131" }}
                                            className="fw-400 text-left"
                                          >
                                            Insulin
                                          </th>
                                          <th
                                            colSpan={1}
                                            style={{ color: "#313131" }}
                                            className="fw-400 text-center"
                                          >
                                            Unit
                                          </th>
                                          <th
                                            colSpan={1}
                                            style={{ color: "#313131" }}
                                            className="fw-400 text-center"
                                          >
                                            Duration
                                          </th>

                                          <th
                                            colSpan={1}
                                            style={{ color: "#313131" }}
                                            className="fw-400 text-center"
                                          >
                                            Frequency
                                          </th>

                                          <th
                                            style={{ color: "#313131" }}
                                            className="fw-400 text-center"
                                          >
                                            Instructions
                                          </th>
                                          <th className=""></th>
                                        </tr>
                                        <tr className="second-table-row dd">
                                          <th className="text-left">&nbsp;</th>
                                          <th className="text-center">
                                            &nbsp;
                                          </th>
                                          <th className="text-center">
                                            &nbsp;
                                          </th>
                                          <th>
                                            <table className="w-100">
                                              <tr>
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
                                              </tr>
                                            </table>
                                          </th>
                                          <th className="text-center">
                                            &nbsp;
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {insulinTable?.length > 0 &&
                                          insulinTable?.map((insulin) => {
                                            return (
                                              <>
                                                <tr className="align-middle">
                                                  <td className="text-left">
                                                    {insulin?.insuline}
                                                  </td>
                                                  <td>{insulin?.unit}</td>
                                                  <td className="text-center">
                                                    {insulin?.number_of_days}
                                                  </td>
                                                  <td>
                                                    <table className="w-100">
                                                      <tbody>
                                                        <tr className="second_td_row">
                                                          <td className="text-center">
                                                            <span className="bg-change-td">
                                                              {insulin?.morning}
                                                            </span>
                                                          </td>
                                                          <td className="me-2 text-center">
                                                            <span className="bg-change-td">
                                                              {
                                                                insulin?.afternoon
                                                              }
                                                            </span>
                                                          </td>
                                                          <td className="text-center">
                                                            <span className="bg-change-td">
                                                              {insulin?.evening}
                                                            </span>
                                                          </td>
                                                          <td className="text-center">
                                                            <span className="bg-change-td">
                                                              {insulin?.night}
                                                            </span>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td className="text-center">
                                                    {insulin?.is_after_meal == "1" ? "After Meal" : insulin?.is_after_meal == "0" ? "Before Meal" : "" }
                                                  </td>
                                                  <td className="text-center">
                                                    <img
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      src={delete1}
                                                      alt=""
                                                      onClick={(e) => {
                                                        let modified =
                                                          insulinTable?.filter(
                                                            (med, idx) => {
                                                              return (
                                                                med?.insuline !=
                                                                insulin?.insuline
                                                              );
                                                            }
                                                          );
                                                        setInsulinTable(
                                                          modified
                                                        );
                                                      }}
                                                    />
                                                    <img
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      src={EditPre}
                                                      alt=""
                                                      className={`img-fluid ms-2 ${
                                                        editInsulinStatus &&
                                                        "disabled_edit"
                                                      }`}
                                                      onClick={(e) => {
                                                        let modified =
                                                          insulinTable?.filter(
                                                            (med, idx) => {
                                                              return (
                                                                med?.insuline !=
                                                                insulin?.insuline
                                                              );
                                                            }
                                                          );
                                                        setInsulinTable(
                                                          modified
                                                        );
                                                        setEditInsulin(insulin);
                                                        setEditInsulinStatus(
                                                          true
                                                        );
                                                      }}
                                                    />
                                                    {insulin?.return && (
                                                      <img
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        src={notallow}
                                                        alt=""
                                                        className="img-fluid ms-2 false "
                                                        onClick={(e) => {
                                                          let modified =
                                                            medTable?.filter(
                                                              (med, idx) => {
                                                                return (
                                                                  med?.insuline !=
                                                                  insulin?.insuline
                                                                );
                                                              }
                                                            );
                                                          setMedTable(modified);
                                                        }}
                                                      />
                                                    )}
                                                  </td>
                                                </tr>
                                              </>
                                            );
                                          })}
                                      </tbody>
                                    </>
                                  </Table>
                                </div>
                              </TabPanel>
                              <TabPanel
                                value="3"
                                className="tabContent prescription-parent px-0"
                              >
                                <div
                                  className={
                                    mobile
                                      ? location?.search?.split("?")[1] ===
                                        "#prescribe_lab"
                                        ? "tab_data cover_space3 white_color_div pb-0"
                                        : "d-none"
                                      : "tab_data cover_space3 white_color_div pb-0"
                                  }
                                  id="prescribe_lab"
                                >
                                  <div className="appointment_div_data">
                                    <div className="white_color_div pb-0">
                                      <div className="gap_div pt-0">
                                        <Form.Item>
                                          <LabForm
                                            labs={labs}
                                            complete={addMed}
                                            labTable={labTable}
                                            setLabTable={setLabTable}
                                            setEditLabStatus={setEditLabStatus}
                                            editLabStatus={editLabStatus}
                                            editLab={editLab}
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="appointment_div_data">
                                  <div className="white_color_div1">
                                    {labTable.length > 0 ? (
                                      <div className="prescriptionBox">
                                        <h4>Lab Test </h4>
                                      </div>
                                    ) : null}
                                    <Table className="table instant-feedback-table lab-test-table border_bottom_rem">
                                      <>
                                        <tbody>
                                          {labTable?.map((item, index) => {
                                            return (
                                              <tr>
                                                <td className="fonfamily med-test-type text-left w-25 br-0 pl-4">
                                                  {item?.lab}
                                                </td>
                                                <td className="w-5 text-end pe-4">
                                                  <img
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    src={delete1}
                                                    alt=""
                                                    onClick={(e) => {
                                                      let modified =
                                                        labTable?.filter(
                                                          (med, idx) => {
                                                            return (
                                                              med?.lab !=
                                                              item?.lab
                                                            );
                                                          }
                                                        );
                                                      setLabTable(modified);
                                                    }}
                                                  />
                                                  <img
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    src={EditPre}
                                                    alt=""
                                                    className={`img-fluid ms-2 ${
                                                      editLabStatus &&
                                                      "disabled_edit"
                                                    }`}
                                                    onClick={(e) => {
                                                      let modified =
                                                        labTable?.filter(
                                                          (med, idx) => {
                                                            return (
                                                              med?.lab !=
                                                              item?.lab
                                                            );
                                                          }
                                                        );
                                                      setLabTable(modified);
                                                      setEditLab(item);
                                                      setEditLabStatus(true);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </>
                                    </Table>
                                  </div>
                                </div>
                              </TabPanel>
                              <TabPanel
                                value="4"
                                className="tabContent prescription-parent px-0"
                              >
                                <div className="appointment_div_data historyBox">
                                  <div className="white_color_div pb-0 col-lg-12">
                                    {!isPastRemarks && (
                                      <Row className="w-100">
                                        <Col md={12}>
                                          <HeadingWithSpaceLarge text="REMARKS" />
                                          <Form.Item
                                            name="cosultation_note"
                                            label=""
                                          >
                                            <TextArea
                                              maxLength={500}
                                              placeholder="Write something here..."
                                              defaultValue={
                                                patientData?.prescription
                                                  ?.patient_consultation_note
                                              }
                                              value={note?.note}
                                              onChange={(e) => {
                                                setNote({
                                                  note: e.target.value,
                                                });
                                              }}
                                              rows={6}
                                              className="texittt_remarks"
                                            />
                                            <span className="limit">
                                              500 Limit{" "}
                                            </span>
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    )}
                                    {isPastRemarks && (
                                      <Row className="w-100">
                                        <Col lg={6}>
                                          <HeadingWithSpaceLarge text="REMARKS" />
                                          <Form.Item
                                            name="cosultation_note"
                                            label=""
                                            className="remarks"
                                          >
                                            <TextArea
                                              placeholder="Write something here..."
                                              defaultValue={
                                                patientData?.prescription
                                                  ?.patient_consultation_note
                                              }
                                              value={note?.note}
                                              onChange={(e) => {
                                                setNote({
                                                  note: e.target.value,
                                                });
                                              }}
                                              rows={7}
                                              className="c_input inputBox "
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col lg={6} className="right_remark">
                                          <HeadingWithSpaceLarge text="PAST REMARKS" />
                                          <div className="boxremarks">
                                            <p className="text-right">
                                              {pastRemarks?.date}
                                            </p>
                                            <div className="remark">
                                              {pastRemarks?.remarks}
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                    )}
                                  </div>
                                </div>
                              </TabPanel>
                            </TabContext>
                          </Box>
                        </div>
                      </TabPanel>
                      <TabPanel bPanel value="21" className="boxTab tabOne">
                        <Row>
                          <Col md={12}>
                            <div className="boxnew">
                              <PersonalHistory
                                lifeStyleOccupationList={
                                  lifeStyleOccupationList
                                }
                                patientData={
                                  patientData?.patient_personal_history
                                }
                                patientDataAll={patientData}
                              />
                            </div>
                          </Col>
                        </Row>
                      </TabPanel>

                      <TabPanel value="31" className="boxTab tabtwo">
                        <Row>
                          <Col md={12}>
                            <div className="boxnew">
                              <MedicalHistory
                                patientData={
                                  patientData?.patient_medical_history
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      </TabPanel>

                      <TabPanel value="41" className="boxTab taThree">
                        <Row>
                          <Col md={12}>
                            <DiabetesHis
                              patientsmbg={patientData?.patient_smgb}
                              patientData={
                                patientData?.patient_diabetes_history
                              }
                            />
                          </Col>
                        </Row>
                      </TabPanel>

                      <TabPanel value="51" className="boxTab taThree">
                        <Row>
                          <Col md={12}>
                            <div className="boxnew">
                              <LabsReport
                                patientData={patientData?.patient_reports}
                              />
                            </div>
                          </Col>
                        </Row>
                      </TabPanel>

                      <TabPanel value="61" className="boxTab taThree">
                        <Row>
                          <Col md={12}>
                            <div className="boxnew">
                              <Vitals
                                patientData={patientData?.patient_vitals}
                                onSubmit={handleVitalsSubmit}
                                vitalsData={vitalsData}
                                vitalsForm={vitalsForm}
                                setVitalsData={setVitalsData}
                                setDisableButton={setDisableButton}
                                disableButton={disableButton}
                                editedVitals={editedVitals}

                              />
                            </div>
                          </Col>
                        </Row>
                      </TabPanel>
                    </Col>
                  </Row>
                </Col>
              </Container>
            </TabContext>
          </Box>
        </>
        {/* New Tabs Start */}
        {/* New Tabs end */}

        <div className="bottom_btn bg-transparent">
          <a
            className="appoitment-cancel-btn fixed_app_button bg-transparent text-uppercase d-flex align-items-center justify-content-center color-313131"
            onClick={(e) => setShowCancelModal(true)}
          >
            Cancel
          </a>
          <button
            className="submit-btn-completed add-record-btn text-uppercase w-100"
            htmlType="submit"
          >
            <span className="hk_for_center"> MARK COMPLETE</span>
            <span className="add-record-chevron">
              <FiChevronRight />
            </span>
          </button>
        </div>

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
            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500 fontModal">
              Are you sure you want mark <br />{" "}
              <span className="markComp"> this consultation as complete? </span>
              {/* <div className="hk_go_for_next">
                <Checkbox onChange={forStartNextConsultation}>
                  Start next video call
                </Checkbox>
              </div> */}
            </h5>
          </div>
        </Modal>
        {/* ------------------------mark complete popup -------------------------*/}
        <Modal
          className="consultaionEndedModal"
          title=""
          centered
          visible={modal3Visible}
          closable={false}
          // onOk={() => completeAppointment()}
          cancelButtonProps={{ style: { display: "none" } }}
          footer={[
            // <Button className="col-md-9 m-auto" key="info" onClick={() => completeAppointment()}>
            //   Mark Complete
            // </Button>

            <Button
              className="col-md-9 m-auto"
              key="info"
              onClick={() => completeAppointment()}
            >
              MARK AS COMPLETE
            </Button>,
          ]}
        >
          <div className="col-md-9 m-auto text-center">
            <h5
              style={{ fontSize: "28px" }}
              className="ff-Nunito color-313131 line-height-35 fw-500"
            >
              Consultation ended
            </h5>
            <p style={{ fontSize: "18px" }} className="pt-2 pb-2">
              Please mark this consultation as complete.
            </p>
            {/* <div className="hk_go_for_next">
              <Checkbox onChange={forStartNextConsultation2}>
                Start next video call
              </Checkbox>
            </div> */}
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
            <img src={disableConsultation} alt="" className="img-fluid mb-3" />
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
          onOk={() => setModal4Visible(false)}
          okText="OK"
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <div className="col-md-11 m-auto text-center">
            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500">
              The consultation is about to end
            </h5>
          </div>
        </Modal>
        {/* Cancel Consultation Modal */}
        <Modal
          className="leaveConsultationModal consultationAboutEnd"
          title=""
          centered
          visible={showCancelModal}
          onCancel={(e) => setShowCancelModal(false)}
          okText="Yes"
          cancelText="No"
          closable={true}
          onOk={cancelAppointment}
        >
          <div className="col-md-9 m-auto text-center">
            <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500 pb-3">
              Are you sure you want to leave this consultation?
            </h5>
          </div>
        </Modal>
        <ToastContainer />
      </Form>
    </div>
  );
}

export default AppointmentFirstTime;
