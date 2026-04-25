import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  HeadingDescSmall,
  HeadingDescVsmall,
  HeadingWithSpaceLarge,
} from "../../uiComponents/Headings";
import { TableComponent } from "../../uiComponents/tableComponent";
import { FiArrowRightCircle } from "react-icons/fi";
import ArrowRight from "../../assets/images/svg/arrow-circle-right.svg";
import ArrowLeft from "../../assets/images/svg/arrow-circle-left.svg";
import "./Appointments.scss";
import { Table } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectAddDetail,
  selectAppDetailLoader,
  selectMedical,
  selectVitalScan,
} from "./redux/slice";
import { getAppDetail, getVitalScan } from "./redux/thunk";
import {
  capitalizeWithSplit,
  formatDate,
  getFromLocalStorage,
} from "../../utils/helperFunctions";
import "yet-another-react-lightbox/styles.css";
import LightboxModal from "../../uiComponents/modal/lightboxModal/LightboxModal";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import API from "../../utils/customAxios";
import moment from "moment";
import badSehatScore from "../../assets/images/png/bad-sehat-score.png";
import normalSehatScore from "../../assets/images/png/normal-sehat-score.png";
import goodSehatScore from "../../assets/images/png/good-sehat-score.png";
import lowStress from "../../assets/images/png/low-stress.png";
import normalStress from "../../assets/images/png/normal-stress.png";
import highStress from "../../assets/images/png/high-stress.png";
import { useSelector } from "react-redux";
import Loader from "../../uiComponents/loader/Loader";
import { AiOutlineFile } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import RightArrowBorder from "../../assets/images/png/right-arrow-border-small.svg";
import LeftArrowBorder from "../../assets/images/png/left-arrow-border.svg";
import "./pastConsultation.css";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  capitalizeFirstLetter,
  downloadPrescription,
  getAge,
} from "../../helpers/utilityHelper";
import VitalsTable from "../../uiComponents/tableComponent/VitalsTable";

function PastConsultation(props) {
  // let data = props?.location?.state;
  // let id = data?.id;

  const params = useParams();

  let id = params.id;

  const settings = {
    // dots: false,
    // arrows: true,
    // infinite: true,
    // speed: 500,
    // // slidesToShow: 1,
    // centerMode: false,
    // slidesToScroll: 1,

    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 1, //you also can use 3.5 to show half of next one
    centerMode: true,
    variableWidth: false,
  };
  const dispatch = useAppDispatch();
  const history = useHistory();
  const appointmentData = useAppSelector(selectAddDetail);
  const appDetailLoader = useAppSelector(selectAppDetailLoader);

  // console.log(appointmentData, "ethan");

  const { isLoading } = useSelector((state) => state.appointment);

  const medical = useAppSelector(selectMedical);
  const vitalScan = useAppSelector(selectVitalScan);

  const [vitalTable, setVitalTable] = useState([]);
  const [medicalRec, setMedicalRec] = useState([]);
  const [toggler1, setToggler1] = useState(false);

  const [conditions, setConditions] = useState([]);

  const [open, setOpen] = React.useState(false);

  const [fileId, setFileId] = useState([]);
  const [fileLink, setFileLink] = useState([]);
  const [mobile, setMobile] = useState(false);

  const [recordsLoading, setRecordsLoading] = useState(true);

  const user_id = getFromLocalStorage("D_USER_ID");
  const { Column, ColumnGroup } = Table;

  // const data1 = [];
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        setMobile(true);
      }
    }
    dispatch(getAppDetail(id));
    //dispatch(getMedicalRecord(user_id));
  }, []);

  //   async function downloadCSVHandler() {
  //   downloadPrescription(appointmentId).then((res) => {
  //     window.open(res?.data?.pdf_download_link, "_blank");
  //   });
  // }

  useEffect(() => {
    // console.log(appointmentData?.data?.user_id);
    // dispatch(getMedicalRecord(appointmentData?.data?.user_id));

    if (appointmentData?.data?.user_id) {
      setRecordsLoading(true);
      (async () => {
        try {
          const res = await API.get(
            `/instant-medical-record?user_id=${appointmentData?.data?.user_id}`
          );

          setMedicalRec(res?.data?.data);

          let data = [];

          res?.data?.data?.map((med) => {
            data.push(med?.medical_record_files?.src);
          });

          setFileLink(data);

          dispatch(getVitalScan(appointmentData?.data?.user_id));
          setRecordsLoading(false);
        } catch (error) {
          setRecordsLoading(false);
        }
      })();

      //dispatch(getMedicalRecord(user_id));
    }
  }, [appointmentData]);

  useEffect(() => {
    setVitalTable(vitalScan?.data);
  }, [vitalScan]);

  // useEffect(() => {
  //   setMedicalRec(medical?.data);
  //   console.log(medical.data);
  //   medical?.data?.map((med) => {
  //     setFileLink(med.medical_record_files.src);
  //   });

  // }, [medical]);

  let info = appointmentData?.data;

  let user = info?.user;

  // console.log({user});

  let prescription = info?.prescription;

  const medical_rec_header = [
    { title: "Tests Taken on", dataIndex: "med_rec_date" },
    { title: "Total Reports", dataIndex: "med_rec_reports" },
    {
      title: "",
      dataIndex: "buttons",
      // render: (text, record) => (
      //   <>
      //   <a className="flex_start" onClick={() => {
      //     setToggler1(true)
      //     console.log(toggler1);
      //     console.log(medical_record_table);
      //     setOpen(true);

      //     // {toggler1 && (
      //     //   medicalRec.map((med) => {
      //     //    console.log(med, "MED");
      //     //    med.medical_record_files.map((m) => (
      //     //     //  <LightboxModal id={m.id} files={m.file} toggler1={toggler1} setToggler1={setToggler1} />
      //     //     <LightboxModal id={m.id} files={m.file} />
      //     //    ))
      //     //   })
      //     //  )}

      //   }}>
      //     <FiArrowRightCircle className="arrow_black" />
      //     <h6 className="view_anchor">VIEW</h6>
      //   </a>

      //   {/* <Lightbox
      //   open={open}
      //   close={() => setOpen(false)}
      //   slides={[
      //     { src: "../../assets/images/png/login.png" },
      //     { src: "../../assets/images/png/LogoFresh.png" },
      //     { src: "../../assets/images/png/LogoMain.png" },
      //   ]}
      // /> */}
      render(text, record) {
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

        let idd = record?.key;
        return {
          children: (
            <>
              <div className="flex_start" key={record?.key}>
                <a className="consult_now" onClick={() => setToggler1(true)}>
                  {/* <a className="consult_now" > */}
                  <FiArrowRightCircle className="arrow_black" />
                  <p className="black_text">VIEW</p>
                </a>
                {/* {toggler1 && text?.map((image, ind) => (<img key={ind} src={image}></img>))} */}
                {/* <p>{files}</p> */}
                {/* <FsLightbox
                  toggler={toggler1}
                  id={record?.key}
                  key={record?.key}
                  sources={text}
                /> */}
                {/* <Lightbox
                  open={toggler1}
                  close={() => setToggler1(false)}
                  slides={
                    //   [
                    //   { src: "/image1.jpg" },
                    //   { src: "/image2.jpg" },
                    //   { src: "/image3.jpg" },
                    // ]
                    [...files]

                  }
                /> */}

                {toggler1 && (
                  <LightboxModal
                    id={idd}
                    files={files}
                    toggler1={toggler1}
                    setToggler1={setToggler1}
                  />
                )}
              </div>
            </>
          ),
        };
      },

      //   {/* {medical_record_table.forEach((e)=> {
      //     console.log(e)
      //   })} */}

      //   {/* <LightboxModal id={fileLink?.id} files={fileLink?.file} toggler1={toggler1} setToggler1={setToggler1} /> */}

      //   {console.log(toggler1)}

      //   {console.log("MEdical Rec", medicalRec)}
      //   </>
      // ),
    },
  ];

  let vital_header = [
    {
      title: "Date/Time",
      dataIndex: "date",
      render(text, record) {
        const timeStamp = record?.date;
        let data = timeStamp.split("\n");
        return {
          children: (
            <div className="text-left">
              <p className="fs-16 ff-circular"> {data[0]} </p>
              <span className="d-block color-gray-text fs-15 fw-300">
                {" "}
                {data[1]}{" "}
              </span>
            </div>
          ),
        };
      },
    },
    {
      title: "Sehat Score",
      dataIndex: "sehat_score",
      render(text, record) {
        const score = record?.sehat_score;

        return {
          children: (
            <div>
              <p className="fs-16"> {score}/10 </p>
              {score <= 4 ? (
                <img src={badSehatScore} />
              ) : score <= 7 ? (
                <img src={normalSehatScore} />
              ) : (
                <img src={goodSehatScore} />
              )}
            </div>
          ),
        };
      },
    },
    {
      title: "Blood Pressure",
      dataIndex: "blood_pressure",
      render(text, record) {
        const value = record?.blood_pressure_value;

        return {
          children: (
            <div>
              {record?.blood_pressure && (
                <>
                  <p className="fs-12">
                    {" "}
                    <strong className="fs-15">
                      {record?.blood_pressure}
                    </strong>{" "}
                    mmHG{" "}
                  </p>

                  {value?.toLowerCase() === "low" ? (
                    <button className="blood_pressure_low lowHighRedBtns">
                      {value}
                    </button>
                  ) : value?.toLowerCase() === "normal" ? (
                    <button className="blood_pressure_normal normalPrimaryBtns">
                      {value}
                    </button>
                  ) : (
                    <button className="blood_pressure_high lowHighRedBtns">
                      {value}
                    </button>
                  )}
                </>
              )}
            </div>
          ),
        };
      },
    },
    {
      title: "Heart Rate",
      dataIndex: "heart_rate",
      render(text, record) {
        const value = record?.heart_rate_value;

        return {
          children: (
            <div>
              {record?.heart_rate && (
                <>
                  <p className="fs-12">
                    {" "}
                    <strong className="fs-16">
                      {record?.heart_rate}
                    </strong> BPM{" "}
                  </p>

                  {value?.toLowerCase() === "low" ? (
                    <button className="heart_rate_low lowHighRedBtns">
                      {value}
                    </button>
                  ) : value?.toLowerCase() === "normal" ? (
                    <button className="heart_rate_normal normalPrimaryBtns">
                      {value}
                    </button>
                  ) : (
                    <button className="heart_rate_high lowHighRedBtns">
                      {value}
                    </button>
                  )}
                </>
              )}
            </div>
          ),
        };
      },
    },
    {
      title: "Oxygen Saturation (SpO2)",
      dataIndex: "spo2",
      render(text, record) {
        const value = record?.spo2_value;

        return {
          children: (
            <div>
              {record?.spo2 && (
                <>
                  <p className="fs-12">
                    {" "}
                    <strong className="fs-16">{record?.spo2}</strong> %{" "}
                  </p>

                  {value?.toLowerCase() === "low" ? (
                    <button className="spo2_low lowHighRedBtns">{value}</button>
                  ) : value?.toLowerCase() === "normal" ? (
                    <button className="spo2_normal normalPrimaryBtns">
                      {value}
                    </button>
                  ) : (
                    <button className="spo2_high lowHighRedBtns">
                      {value}
                    </button>
                  )}
                </>
              )}
            </div>
          ),
        };
      },
    },
    {
      title: "Respiration Rate",
      dataIndex: "respiratory_rate",
      render(text, record) {
        const value = record?.respiratory_rate_value;

        return {
          children: (
            <div>
              {record?.respiratory_rate && (
                <>
                  <p className="fs-12">
                    {" "}
                    <strong className="fs-16">
                      {record?.respiratory_rate}
                    </strong>{" "}
                    BPM{" "}
                  </p>

                  {value?.toLowerCase() === "low" ? (
                    <button className="respiratory_rate_low lowHighRedBtns">
                      {value}
                    </button>
                  ) : value?.toLowerCase() === "normal" ? (
                    <button className="respiratory_rate_normal normalPrimaryBtns">
                      {value}
                    </button>
                  ) : (
                    <button className="respiratory_rate_high lowHighRedBtns">
                      {value}
                    </button>
                  )}
                </>
              )}
            </div>
          ),
        };
      },
    },
    {
      title: "SDNN",
      dataIndex: "sdnn",
      render(text, record) {
        const value = record?.sdnn_value;

        return {
          children: (
            <div>
              {record?.sdnn && (
                <>
                  <p className="fs-12">
                    {" "}
                    <strong className="fs-16">{record?.sdnn}</strong> MS{" "}
                  </p>

                  {value?.toLowerCase() === "low" ? (
                    <button className="sdnn_low normalPrimaryBtns">
                      {value}
                    </button>
                  ) : value?.toLowerCase() === "normal" ? (
                    <button className="sdnn_normal normalPrimaryBtns">
                      {value}
                    </button>
                  ) : (
                    <button className="sdnn_high lowHighRedBtns">
                      {value}
                    </button>
                  )}
                </>
              )}
            </div>
          ),
        };
      },
    },
    {
      title: "Stress Level",
      dataIndex: "stress_level",
      render(text, record) {
        const value = record?.stress_level;
        return {
          children: (
            <div>
              {value >= 1 && value <= 2 ? (
                <div className="stress-level-field">
                  <img src={lowStress} className="img-fluid mb-2" alt="" />{" "}
                  <br />
                  <button className="stress_low normalPrimaryBtns">Low</button>
                </div>
              ) : value > 2 && value <= 4 ? (
                <div className="stress-level-field">
                  <img src={normalStress} className="img-fluid mb-2" alt="" />{" "}
                  <br />
                  <button className="stress_normal normalPrimaryBtns">
                    Normal
                  </button>
                </div>
              ) : (
                <div className="stress-level-field">
                  <img src={highStress} className="img-fluid mb-2" alt="" />{" "}
                  <br />
                  <button className="stress_high normalPrimaryBtns">
                    High
                  </button>
                </div>
              )}
            </div>
          ),
        };
      },
    },
  ];

  const pres_header = [
    { title: "Date & Time", dataIndex: "date_time" },
    { title: "Symptoms or general notes for patient", dataIndex: "symptoms" },
    { title: "Medicines", dataIndex: "medicines" },
    { title: "Lab Test", dataIndex: "lab_test" },
  ];
  let medInfo = "";
  // Object.values(info?.medicine).map((med) => {
  //   medInfo = medInfo + med.medicine + ' ' + med.dosage + ', ' + med.duration + ', ' + med.frequency  + ' ' + med.instruction + '\n\n'
  // });
  const freq = ["Once a day", "Twice a day", "Thrice a day", " times a day"];

  prescription?.prescribed_medicine?.map((med) => {
    let af;
    let per_d;
    if (med?.is_after_meal === false) {
      af = "Before Meal";
    } else {
      af = "After Meal";
    }
    per_d = freq[med?.per_day - 1];

    medInfo =
      medInfo +
      "\n" +
      med?.prescription_element?.name +
      " " +
      med?.dosage +
      " mg" +
      ", " +
      med?.number_of_days +
      " Day(s)" +
      ", " +
      per_d +
      " " +
      af +
      "\n";
  });
  let labInfo = "";
  // Object.values(info?.lab).map((lab) => {
  //   labInfo = labInfo + lab.lab_test + '\n'
  // });

  prescription?.prescribed_lab?.map((lab) => {
    labInfo = labInfo + lab?.prescription_element?.name + "\n";
  });
  const pres_data = [
    {
      key: "1",
      // date_time: "Mar 01, 2022 11:30 am",
      date_time: info?.date_time,
      symptoms: prescription?.patient_consultation_note,
      medicines: medInfo,
      lab_test: labInfo,
    },
  ];

  let data1 = [];

  prescription?.prescribed_medicine?.forEach((med) => {
    data1.push({
      drugName: med?.prescription_element?.name,
      duration: med?.number_of_days + " ",
      withmeal: med?.is_after_meal,
      morning: med?.morning && med?.morning + " " + med?.unit,
      afternoon: med?.afternoon && med?.afternoon + " " + med?.unit,
      evening: med?.evening && med?.evening + " " + med?.unit,
      night: med?.night && med?.night + " " + med?.unit,
    });
  });

  let medical_record_table = [];
  medicalRec?.map((med, index) => {
    let imgs = [];
    med?.instant_medical_record_files?.map((f) => {
      // console.log(f, "monis")
      imgs.push(f?.file);
    });
    medical_record_table.push({
      key: index + 1,
      med_rec_date: med?.date,
      med_rec_reports: med?.total_reports,
      buttons: med?.instant_medical_record_files,
    });
  });

  //console.log("Medical Record Table: ", medical_record_table);

  let vitalData = [];
  vitalTable?.health_scans?.slice(0, 6)?.map((scan, index) => {
    vitalData.push({
      key: index + 1,
      date: `${moment(scan?.date)
        .format("DD/MM/YYYY")
        .toString()
        .substring(0, 10)} \n${scan?.dateTime}`,
      heart_rate: scan?.heart_rate,
      respiratory_rate: scan?.respiratory_rate,
      blood_pressure: scan?.blood_pressure,
      stress_level: scan?.stress_level,
      sdnn: scan?.sdnn,
      spo2: scan?.spo2,
      sehat_score: scan?.sehat_score,
      blood_pressure_value: scan?.blood_pressure_value,
      heart_rate_value: scan?.heart_rate_value,
      spo2_value: scan?.spo2_value,
      respiratory_rate_value: scan?.respiratory_rate_value,
      sdnn_value: scan?.sdnn_value,
    });
  });
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ToAppointments = () => {
    history.push("/appointments");
  };

  async function downloadFile(e, filePath) {
    e.preventDefault();

    try {
      const response = await fetch(filePath);

      if (response.status === 200) {
        const blob = await response.blob();

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filePath;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        setTimeout(() => {
          URL.revokeObjectURL(downloadLink.href);
          document.body.removeChild(downloadLink);
        }, 100);
      } else {
        // console.log("something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {isLoading || recordsLoading || appDetailLoader === "pending" ? (
        <Loader />
      ) : (
        <div className="appointment_first past_consultation cover_space view-details-slider">
          <Container>
            <Row>
              <div className="d-flex align-items-center">
                <div className="imgProfile me-3 mb-0">
                  <img
                    src={user?.image}
                    alt=""
                    className="img-fluid rounded-circle"
                    style={{ height: "75px", objectFit: "cover" }}
                  />
                </div>
                <div className="d-flex">
                  <div className="nameDoctor">
                    <h5>{info?.patient_info?.name}</h5>
                    <p>
                      {capitalizeFirstLetter(info?.patient_info?.gender)}{" "}
                      {info?.patient_info?.date_of_birth && (
                        <>
                          | {getAge(info?.patient_info?.date_of_birth)} years
                          old
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Col md={4}>
                {(prescription?.blood_group ||
                  info?.conditions?.length > 0 ||
                  prescription?.cosultation_note) && (
                  <>
                    <div className="card bg-white p-4 mt-4 overflow-hidden ">
                      {prescription?.blood_group && (
                        <div>
                          <label className="mb-1">Blood Group</label>
                          <p className="bloodGroupUser mb-3">
                            {prescription?.blood_group}
                          </p>
                        </div>
                      )}

                      {info?.conditions?.length > 0 && (
                        <div className="condition-container mb-2 mt-2">
                          <label className="mt-2 mb-1">
                            Existing Conditions
                          </label>
                          <div className="condition-slider mb-3 existingConditionSliders">
                            <Slider
                              nextArrow={<img src={ArrowRight} />}
                              prevArrow={<img src={ArrowLeft} />}
                              slidesToShow={
                                info?.conditions?.length <= 2
                                  ? info?.conditions?.length
                                  : 2
                              }
                              {...settings}
                            >
                              {info?.conditions?.map((item) => (
                                <div>
                                  <a className="roundButton">
                                    {item?.condition}
                                  </a>
                                </div>
                              ))}
                            </Slider>
                          </div>
                        </div>
                      )}

                      {prescription?.cosultation_note && (
                        <>
                          <label className="mb-1">Notes</label>
                          <textarea
                            className="bloodGroupUser"
                            value={prescription?.cosultation_note}
                            rows={5}
                            disabled
                          />
                        </>
                      )}
                    </div>
                    <div className="card bg-white mt-4 previousAppointments letter-spacing-1">
                      {/* <HeadingWithSpaceLarge text="PREVIOUS APPOINTMENTS" /> */}
                      {appointmentData?.data?.previous_consultation?.length >
                      0 ? (
                        <>
                          <div className="prescribed-date ps-3 pb-0 pt-4">
                            <h6 className="fs-18 text-uppercase">
                              Previous Appointments
                            </h6>
                          </div>

                          <table class="table previous-table previousAppointmentsTableLeft">
                            <thead>
                              <tr>
                                <th
                                  className="border-0"
                                  valign="middle"
                                  scope="col"
                                ></th>
                                <th
                                  valign="middle"
                                  scope="col"
                                  className="text-center border-0"
                                ></th>
                              </tr>
                            </thead>
                            <tbody>
                              {appointmentData?.data?.previous_consultation?.map(
                                (item, index) => (
                                  <tr key={index}>
                                    <td>
                                      {capitalizeWithSplit(item?.type, "-")}
                                    </td>
                                    <td className="text-center">
                                      {formatDate(item?.date, "DD/MM/YYYY")}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </>
                      ) : null}
                    </div>
                    <div
                      onClick={ToAppointments}
                      className="backToAppointments"
                    >
                      <img src={ArrowLeft} className="img-fluid" />
                      <a>BACK TO APPOINTMENTS</a>
                    </div>
                  </>
                )}
              </Col>

              <Col md={8} className="rightSideTable mt-4 center-arrow-text">
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box>
                      <TabList onChange={handleChange} aria-label="">
                        <Tab label="Prescription" value="1" />
                        <Tab label="Lab Test" value="2" />
                        <Tab label="Medical Record" value="3" />
                        {(appointmentData?.data?.previous_consultation?.length >
                          0 ||
                          appointmentData?.data?.next_consultation?.length >
                            0) && (
                          <>
                            <div className="previous-appointments-container ps-5 ms-0">
                              <p className="me-2">Previous Consultation</p>
                            </div>

                            <div className="previous-appointments-icon-links ps-4 ms-0">
                              {appointmentData?.data?.previous_consultation?.[0]
                                ?.id && (
                                <a
                                  href={`/past-consultation/${appointmentData?.data?.previous_consultation?.[0]?.id}`}
                                  className="previous-appointments-link pe-2"
                                >
                                  <img src={LeftArrowBorder} />
                                </a>
                              )}

                              {appointmentData?.data?.next_consultation?.[0]
                                ?.id && (
                                <a
                                  href={`/past-consultation/${appointmentData?.data?.next_consultation?.[0]?.id}`}
                                  className="previous-appointments-link"
                                >
                                  <img src={RightArrowBorder} alt="" />
                                </a>
                              )}
                            </div>
                          </>
                        )}
                      </TabList>
                    </Box>
                    <TabPanel className="p-0" value="1">
                      <div className="card bg-white pt-4 table-responsive">
                        <div className="prescribed-date ps-3 pb-3">
                          <h6>
                            Prescribed on{" "}
                            {formatDate(
                              appointmentData?.data?.formatted_date_time,
                              "DD/MM/YYYY"
                            )}
                          </h6>
                        </div>

                        {prescription?.prescribed_medicine?.length > 0 ? (
                          <table
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
                                {prescription?.prescribed_medicine?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td valign="middle" className="text-left">
                                        {item?.prescription_element?.name}
                                      </td>
                                      <td
                                        valign="middle"
                                        className="me-2 text-center"
                                      >
                                        {item?.morning && (
                                          <span className="bg-change-td">
                                            {item?.morning} &nbsp;
                                            {item?.morning && item?.unit}
                                          </span>
                                        )}
                                      </td>
                                      <td
                                        valign="middle"
                                        className="text-center"
                                      >
                                        {item?.afternoon && (
                                          <span className="bg-change-td">
                                            {item?.afternoon} &nbsp;
                                            {item?.afternoon && item?.unit}
                                          </span>
                                        )}
                                      </td>
                                      <td
                                        valign="middle"
                                        className="text-center"
                                      >
                                        {item?.evening && (
                                          <span className="bg-change-td">
                                            {item?.evening} &nbsp;
                                            {item?.evening && item?.unit}
                                          </span>
                                        )}
                                      </td>
                                      <td
                                        valign="middle"
                                        className="text-center"
                                      >
                                        {item?.night && (
                                          <span className="bg-change-td">
                                            {item?.night} &nbsp;
                                            {item?.night && item?.unit}
                                          </span>
                                        )}
                                      </td>
                                      <td
                                        valign="middle"
                                        className="text-center"
                                      >
                                        {item?.number_of_days}
                                      </td>
                                      <td
                                        valign="middle"
                                        className="text-center"
                                      >
                                        {" "}
                                        {item?.is_after_meal == "1"
                                          ? "With Meal"
                                          : "Before Meal"}{" "}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </>
                          </table>
                        ) : info?.prescription_here ? (
                          // <> {info?.prescription_here?.split("\n")?.map((item, index) => (
                          //   <p key={index}> {item} </p>
                          // ))} </>

                          <div
                            className="prescriptionDoctorView"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {info?.prescription_here}
                          </div>
                        ) : (
                          <div className="emptyLabState">
                            No prescription added
                          </div>
                        )}
                      </div>
                    </TabPanel>
                    {/* {console.log(medicalRec)} */}
                    <TabPanel className="p-0" value="2">
                      <div className="card bg-white pt-4 table-responsive">
                        <div className="prescribed-date ps-3 pb-3">
                          <h6>
                            Prescribed on{" "}
                            {formatDate(
                              appointmentData?.data?.formatted_date_time,
                              "DD/MM/YYYY"
                            )}{" "}
                          </h6>
                        </div>
                        <table class="table vital-history-table">
                          <thead>
                            <tr>
                              <th valign="middle" scope="col">
                                Lab Test
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescription?.prescribed_lab.length > 0 ? (
                              prescription?.prescribed_lab?.map((lab) => (
                                <tr>
                                  <td> {lab?.prescription_element?.name} </td>
                                </tr>
                              ))
                            ) : (
                              <div className="emptyLabState">
                                No lab test prescribed
                              </div>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabPanel>
                    <TabPanel className="p-0" value="3">
                      <div className="card bg-white pt-4">
                        {medicalRec?.length > 0 ? (
                          medicalRec?.[0]?.instant_medical_record_files?.map(
                            (item, index) => (
                              <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                                <div className="d-flex align-items-center">
                                  <AiOutlineFile />
                                  <a
                                    // onClick={downloadCSVHandler}
                                    href={`${item?.file}`}
                                    target="_blank"
                                    className="text-decoration-underline ms-1 text-uppercase ff-Nunito fw-700 fs-13"
                                  >
                                    {/* {item?.prescription_element_type?.name} */}
                                    File: {index + 1}
                                  </a>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="d-flex align-items-center me-3">
                                    <FontAwesomeIcon icon={faDownload} />
                                    <a
                                      // href={`${item?.file}`}
                                      // target="_blank"
                                      onClick={(e) =>
                                        downloadFile(e, item?.file)
                                      }
                                      className="text-decoration-underline ms-1 text-uppercase ff-Nunito fw-700 fs-13"
                                    >
                                      Download
                                    </a>
                                  </div>
                                  <div>
                                    <BiSearch />
                                    <a
                                      href={`${item?.file}`}
                                      target="_blank"
                                      className="text-decoration-underline ms-1 text-uppercase ff-Nunito fw-700 fs-13"
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="emptyLabState">
                            No medical records shared
                          </div>
                        )}
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
                <div className="tab_data cover_space3" id="vitals">
                  {mobile && <HeadingDescVsmall text="Vital History" />}
                  <div className="white_color_div m-0">
                    <div className="_gap_div w-100">
                      <div className="p-3">
                        {!mobile && (
                          <HeadingWithSpaceLarge text="Vital History" />
                        )}
                      </div>
                      <div className="appointment_div_data">
                        {mobile ? (
                          <div className="column_flex justify_between">
                            <div className="white_color_div">
                              <div className="flex_end justify_between">
                                <div className="column_flex gap_div">
                                  <div className="column_flex">
                                    <HeadingDescSmall text="Heart Rate" />
                                    <HeadingDescSmall
                                      text={vitalData?.[0]?.heart_rate}
                                    />
                                  </div>
                                  <div className="column_flex">
                                    <HeadingDescSmall text="Respiratory Rate" />
                                    <HeadingDescSmall
                                      text={vitalData?.[0]?.respiratory_rate}
                                    />
                                  </div>
                                </div>
                                <div className="column_flex gap_div">
                                  <div className="column_flex">
                                    <HeadingDescSmall text="Blood Pressure" />
                                    <HeadingDescSmall
                                      text={vitalData?.[0]?.blood_pressure}
                                    />
                                  </div>
                                  <div className="column_flex">
                                    <HeadingDescSmall text="Stress Level" />
                                    <HeadingDescSmall
                                      text={vitalData?.[0]?.stress_level}
                                    />
                                  </div>
                                </div>
                                <div className="column_flex gap_div">
                                  <div className="column_flex">
                                    <HeadingDescSmall text="SDNN" />
                                    <HeadingDescSmall
                                      text={vitalData?.[0]?.sdnn}
                                    />
                                  </div>
                                  <div className="column_flex">
                                    <HeadingDescSmall text="SPO2" />
                                    <HeadingDescSmall
                                      text={vitalData?.[0]?.spo2}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="white_color_div vital-history-table m-0 rounded-0 ff-circular">
                            {/* <TableComponent
                              header={vital_header}
                              data={vitalData}
                              pagination={false}
                            /> */}
                            <VitalsTable
                              header={vital_header}
                              data={vitalData}
                              pagination={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* <div className="cover_space3">
            {mobile && <HeadingDescVsmall text="Patient Information" />}
            <div className="white_color_div">
              {!mobile && <HeadingWithSpaceLarge text="PATIENT INFORMATION" />}
              {mobile ? (
                <div className="flex_end justify_between">
                  <div className="column_flex">
                    <div className="column_flex">
                      <HeadingDescVsmall text="Patient Name" />
                      <HeadingDescVsmall text={user?.name} />
                    </div>
                    <div className="column_flex">
                      <HeadingDescVsmall text="Reason For Visiting" />
                      <HeadingDescVsmall text={info?.reason} />
                    </div>
                  </div>
                  <div className="column_flex">
                    <div className="column_flex">
                      <HeadingDescVsmall text="Age" />
                      <HeadingDescVsmall text={user?.age} />
                    </div>
                    <div className="column_flex">
                      <HeadingDescVsmall text="Gender" />
                      <HeadingDescVsmall text={user?.gender} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex_center">
                  <div className="column_flex">
                    <HeadingDescVsmall text="Patient Name" />
                    <HeadingDescVsmall text={user?.name} />
                  </div>
                  <div className="column_flex">
                    <HeadingDescVsmall text="Age" />
                    <HeadingDescVsmall text={user?.age} />
                  </div>
                  <div className="column_flex">
                    <HeadingDescVsmall text="Gender" />
                    <HeadingDescVsmall text={user?.gender} />
                  </div>
                  {info?.reason && (
                    <div className="column_flex">
                      <HeadingDescVsmall text="Reason for Visiting" />
                      <HeadingDescVsmall text={info?.reason} />
                    </div>
                  )}
                  <div className="patient_status follow_up">
                  <HeadingDescVsmall text="Follow Up Appointment" />
                </div>
                </div>
              )}
            </div>
          </div> */}
            </Row>
            {/* <Row>
          <div className="tab_data cover_space3" id="medical_history">
            {mobile && <HeadingDescVsmall text="Medical History" />}
            <div className="white_color_div">
              <div className="gap_div">
                {!mobile && <HeadingWithSpaceLarge text="MEDICAL HISTORY" />}
                <div className="appointment_div_data">
                  <Row>
                    <Col md={4}>
                      <div className="column_flex">
                        <div className="column_flex2">
                          <p className="labelText">Blood Group</p>
                          <HeadingDescSmall text={prescription?.blood_group} />
                        </div>

                        <div className="column_flex2">
                          <p className="labelText">Conditions</p>
                          {medical?.data?.map((d) => {
                            d?.conditions.length > 0 &&
                              d?.conditions?.map((cond) => {
                                conditionData.push(cond);
                              });
                          })}

                          {conditionData.length > 0 &&
                            conditionData.map((c) => (
                              <div className="flex_start">{c.condition}</div>
                            ))}
                        </div>
                      </div>
                    </Col>

                    <Col md={8}>
                      <p className="labelText">Notes</p>
                      <HeadingDescSmall text={prescription?.cosultation_note} />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="medical_record">
            {mobile && <HeadingDescVsmall text="Medical Records" />}
            <div className="white_color_div">
              <div className="gap_div">

                {!mobile && <HeadingWithSpaceLarge text="MEDICAL RECORDS" />}

                <div className="appointment_div_data medicalRec">
                  {mobile ? (
                    <div className="column_flex justify_between">
                      <div className="white_color_div">
                        <div className="flex_end justify_between">
                          <div className="column_flex gap_div">
                            <div className="column_flex">
                              <HeadingDescSmall text="Tests Taken on" />
                              <HeadingDescSmall
                                text={medical_record_table?.[0]?.med_rec_date}
                              />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="Total Reports" />
                              <HeadingDescSmall
                                text={medical_record_table?.[0]?.med_rec_reports}
                              />
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
                    <div className="white_color_div">
                      <TableComponent
                        header={medical_rec_header}
                        data={medical_record_table}
                        pagination={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="vitals">
            {mobile && <HeadingDescVsmall text="Vitals" />}
            <div className="white_color_div">
              <div className="gap_div">

                {!mobile && <HeadingWithSpaceLarge text="VITALS" />}
                <div className="appointment_div_data">
                  {mobile ? (
                    <div className="column_flex justify_between">
                      <div className="white_color_div">
                        <div className="flex_end justify_between">
                          <div className="column_flex gap_div">
                            <div className="column_flex">
                              <HeadingDescSmall text="Heart Rate" />
                              <HeadingDescSmall
                                text={vitalData?.[0]?.heart_rate}
                              />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="Respiratory Rate" />
                              <HeadingDescSmall
                                text={vitalData?.[0]?.respiratory_rate}
                              />
                            </div>
                          </div>
                          <div className="column_flex gap_div">
                            <div className="column_flex">
                              <HeadingDescSmall text="Blood Pressure" />
                              <HeadingDescSmall
                                text={vitalData?.[0]?.blood_pressure}
                              />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="Stress Level" />
                              <HeadingDescSmall
                                text={vitalData?.[0]?.stress_level}
                              />
                            </div>
                          </div>
                          <div className="column_flex gap_div">
                            <div className="column_flex">
                              <HeadingDescSmall text="SDNN" />
                              <HeadingDescSmall text={vitalData?.[0]?.sdnn} />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="SPO2" />
                              <HeadingDescSmall text={vitalData?.[0]?.spo2} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="white_color_div">
                      <TableComponent
                        header={vital_header}
                        data={vitalData}
                        pagination={false}
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          <div className="tab_data cover_space3" id="prescription">
            {mobile && <HeadingDescVsmall text="Prescription" />}
            <div className="white_color_div">
              <div className="gap_div">

                {!mobile && <HeadingWithSpaceLarge text="PRESCRIPTION" />}
                <div className="appointment_div_data">
                  {mobile ? (
                    <div className="column_flex justify_between">
                      <div className="white_color_div">
                        <div className="flex_end justify_between">
                          <div className="column_flex gap_div">
                            <div className="column_flex">
                              <HeadingDescSmall text="Date & Time" />
                              <HeadingDescSmall
                                text={pres_data?.[0]?.date_time}
                              />
                              <HeadingDescSmall text="March 01, 2022, 11:30 am" />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="Symptoms or general notes for patient" />
                              <HeadingDescSmall text={pres_data?.[0]?.symptoms} />
                              <HeadingDescSmall text="Based on your results, you can consult with one of our top rated doctors." />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="Medicines" />
                              <HeadingDescSmall
                                text={pres_data?.[0]?.medicines}
                              />
                              <HeadingDescSmall text="Tramal 100 mg, 3 Days, Thrice a Day After Meal     Tramal 100 mg, 3 Days, Thrice a Day After Meal" />
                            </div>
                            <div className="column_flex">
                              <HeadingDescSmall text="Lab Test" />
                              <HeadingDescSmall text={pres_data?.[0]?.lab_test} />
                              <HeadingDescSmall text="HbA1C (Glycosylated Hemoglobin)      Glycosylated Hemoglobin" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="white_color_div">
                      <TableComponent
                        header={pres_header}
                        data={pres_data}
                        pagination={false}
                        pre="pre"
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </Row> */}
          </Container>
        </div>
      )}
    </>
  );
}

export default PastConsultation;
