import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./_dashboard.scss";
import Loader from "../../uiComponents/loader/Loader";
import instance from "../../utils/customAxios";
import AgoraRTM from "agora-rtm-sdk";
import { getCurrentUserData } from "../../utils/powerFuntions";
import { Modal } from 'antd';
import close1 from "../../assets/images/svg/close1.svg"
import swal from "sweetalert";
import Dropdown from 'react-bootstrap/Dropdown';

function Dashboard() {

  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [awaitingPatient, setAwaitingPatient] = useState(null);
  const [inPersonPatientList, setInPersonPatientList] = useState([]);
  const [videoPatientList, setVideoPatientList] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [onCancelAppointmentId, setOnCancelAppointmentId] = useState();
  const [doctorGetBack, setDoctorGetBack] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);

  // get doctor data
  useEffect(() => {
    (async () => {
      const res = await getCurrentUserData();
      if (res) {
        setDoctorData(res);
      }

      if (res?.is_instant_consultation === true) {
      }
    })();
  }, []);

  // fetch awaiting doctor list
  const fetchAwaitingDoctors = async () => {
    try {
      const response = await instance.get('/doctor/awaiting');
      if (response?.status === 200) {
        setAwaitingPatient(response?.data?.data);
        setDoctorGetBack(true)
        setInPersonPatientList([])
        setVideoPatientList([])
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  // calling fetch doctor api only component first mount 
  useEffect(() => {
    fetchAwaitingDoctors()
  }, [])
  
  
  const fetchInPersonAwaiting = () => {
    const inPersonAwaiting = awaitingPatient?.filter((filItem) => filItem?.type == "In Person")?.map((item) => item)
    setInPersonPatientList(inPersonAwaiting)
    setVideoPatientList([])
  }
  const videoPersonAwaiting = () => {
    const videoAwaitingList = awaitingPatient?.filter((filItem) => filItem?.type == "Video")?.map((item) => item)
    setVideoPatientList(videoAwaitingList)
    setInPersonPatientList([])
  }

  // calling fetch doctor api after every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      instance.get(`/doctor/awaiting`)
        .then((res) => {
          if (res?.status == 200) {
            setAwaitingPatient(res?.data?.data);
          }
        })
        .catch((err) => { });
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // calling agora rtm api create room

  const proceedInPersonConsultation = (e, record) => {
    setLoader(true);
    e.preventDefault();
    history.push({
      pathname: `/appointment/${record?.id}`,
      state: {
        id: record?.id,
       },
    });
  }


  async function emitAppointmentStart(e, record) {
    setLoader(true);
    e.preventDefault();

    let options = {
      uid: "",
      token: "",
    };
    const appID = process.env.REACT_APP_AGORA_APP_ID;
    const appointmentId = record?.id;
    
    let token;
    let channelName = `${appointmentId}`;
    const response = await instance.post(`/consultation/generate-agora-rtm-token?appointment_id=${appointmentId}`);
    history.push({
      pathname: `/appointment/${record?.id}`,
      state: {
        id: record?.id,
       },
    });
    if (response?.status == 200) {
      token = response?.data?.data?.token;

      if (token) options.token = token;

      if (appID && channelName) {
        const client = AgoraRTM.createInstance(appID);

        await client.login({ token, uid: `${doctorData?.id}` });

        let channel = client.createChannel(channelName);

        await channel.join();

        await channel
          .sendMessage({ text: "appointment-started" })
          .then(() => {
            setLoader(false);
            // history.push({
            //   pathname: `/appointment/${record?.id}`,
            //   state: {
            //     id: record?.id,
            //   },
            // });
          });
      }
    }
  }

  // Cancel Appointment Api
  const cancelAppointment = async () => {
    setLoader(true);
    try {
      const response = await instance.post(`/appointment/cancel-appointment?appointment_id=${onCancelAppointmentId}`);
      if (response?.status === 200) {
        fetchAwaitingDoctors();
        setLoader(false);
        setCancelModal(false);
        swal("Success", "Appointment cancelled successfully", "success");
      } else {
        setTimeout(() => {
          setLoader(false);
          setCancelModal(false);
          swal("Error", "Something went wrong", "error");
        }, 2000);
      }
    } catch (error) {
      setLoader(false);
      swal("Error", error?.response?.data?.message || error?.message, "error");
    }
  };

  // Open Modal on cancel appointment
  const handleCancelAppointment = (item) => {
    setCancelModal(true)
    setOnCancelAppointmentId(item?.appointment_id)
  }


  const rejoinApiToWaitForPatient = async () => {
    try {
      const payload = {
        appointment_id: awaitingPatient?.[0]?.appointment_id
      }
      if (awaitingPatient && awaitingPatient?.[0]?.status_key === "in-progress" && !apiCalled) {
        const response = await instance.post(`/appointment/disconnect-doctor`, payload);
        setApiCalled(true); // Set the flag to true after the API call
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (doctorGetBack && !apiCalled) {
      rejoinApiToWaitForPatient();
    }
  }, [doctorGetBack]);

  return (
    <div className="bg_color_db">
      {loader && (
        <Loader />
      )}
      <section className="dashboard bgLinghtGray dash_wrapper cover_space">
        <>
          <Container fluid>
            <Row>
              <Col lg={12}>
                <div className="mt-0 card bg-white p-3 d-md-flex flex-row align-items-end justify-content-between d-block hk_firstfold">
                  <div className="d-flex align-items-center">
                    <div className="d-flex flex-md-row flex-column">
                      <div className="nameDoctor order-2 order-md-1">
                        <h4 className="color-313131">
                          Dashboard
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

            </Row>
            <Row>
              <Col md={12}>
                <div className="patient_wrapper_main ">
                  <div className="nameDoctor order-2 order-md-1">
                    <h4 className="color-313131">
                      Patients
                    </h4>
                  </div>
                  <table className="w-100">
                    <tr className="thead_bg">
                      <th>MR No</th>
                      <th>Patient</th>
                      <th>
                      <Dropdown >
                          <Dropdown.Toggle className="app-dropdown position-relative ps-0">
                            Appointment Type
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item className="dropdown-items" onClick={fetchAwaitingDoctors}>All</Dropdown.Item>
                            <Dropdown.Item className="dropdown-items" onClick={fetchInPersonAwaiting}>In Person</Dropdown.Item>
                            <Dropdown.Item className="dropdown-items" onClick={videoPersonAwaiting}>Video</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </th>
                      <th>Clinic Name</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                    {inPersonPatientList?.length > 0 ? (
                        inPersonPatientList.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.mr_no}</td>
                            <td>{item?.name}</td>
                            <td>{item?.type}</td>
                            <td>{item?.clinic_name}</td>
                            <td>{item?.gender}</td>
                            <td className={item?.status_key == 'cancel' ? 'red_text' : ''}>{item?.status}</td>
                            <td>
                              {item?.status_key !== 'complete' ? (
                                <div className="btn_wrap">
                                  <button
                                    disabled={item?.status_key == 'cancel'}
                                    className={`btn btn-primary _actionss dd ${item?.status_key == 'cancel' ? 'disabled_null_cancel' : ''}`}
                                    onClick={() => handleCancelAppointment(item)}
                                  >
                                    Cancel
                                  </button>
                                  {console.log({item})}
                                  <button
                                    onClick={(e) => proceedInPersonConsultation()}
                                    className={`${index > 0 || item?.patient_verified == false ? 'disabled' : ''} ${item?.status_key === 'cancel' ? 'disabled_cancelled' : ''} btn btn-primary _actionss starttt`}
                                    disabled={index > 0 || item?.status_key == 'cancel' || item?.patient_verified == false}
                                  >
                                    {item?.status_key == 'in-progress' ? 'Rejoin' : 'Start'}
                                  </button>
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))
                      ) : videoPatientList?.length > 0 ? (
                        videoPatientList.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.mr_no}</td>
                            <td>{item?.name}</td>
                            <td>{item?.type}</td>
                            <td>{item?.clinic_name}</td>
                            <td>{item?.gender}</td>
                            <td className={item?.status_key == 'cancel' ? 'red_text' : ''}>{item?.status}</td>
                            <td>
                              {item?.status_key !== 'complete' ? (
                                <div className="btn_wrap">
                                  <button
                                    disabled={item?.status_key == 'cancel'}
                                    className={`btn btn-primary _actionss dd ${item?.status_key == 'cancel' ? 'disabled_null_cancel' : ''}`}
                                    onClick={() => handleCancelAppointment(item)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={(e) => emitAppointmentStart(e, { id: item?.appointment_id })}
                                    className={`${index > 0 || item?.patient_verified == false ? 'disabled' : ''} ${item?.status_key === 'cancel' ? 'disabled_cancelled' : ''} btn btn-primary _actionss starttt`}
                                    disabled={index > 0 || item?.status_key == 'cancel' || item?.patient_verified == false}
                                  >
                                    {item?.status_key == 'in-progress' ? 'Rejoin' : 'Start'}
                                  </button>
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))
                      ) :
                      awaitingPatient?.length > 0 ? (
                        awaitingPatient.map((item, index) => (
                          <tr key={index}>
                            {console.log(item, "itemitem")}
                            <td>{item?.mr_no}</td>
                            <td>{item?.name}</td>
                            <td>{item?.type}</td>
                            <td>{item?.clinic_name}</td>
                            <td>{item?.gender}</td>
                            <td className={item?.status_key == 'cancel' ? 'red_text' : ''}>{item?.status}</td>
                            <td>
                              {item?.status_key !== 'complete' ? (
                                <div className="btn_wrap">
                                  <button
                                    disabled={item?.status_key == 'cancel'}
                                    className={`btn btn-primary _actionss dd ${item?.status_key == 'cancel' ? 'disabled_null_cancel' : ''}`}
                                    onClick={() => handleCancelAppointment(item)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={ (e) => item?.type == "In Person"  ? proceedInPersonConsultation(e, { id: item?.appointment_id })  : emitAppointmentStart(e, { id: item?.appointment_id })}
                                    className={`${item?.type == "In Person" ? '' : index > 0 || item?.patient_verified == false ? 'disabled' : ''} ${item?.status_key === 'cancel' ? 'disabled_cancelled' : ''} btn btn-primary _actionss starttt`}
                                    disabled={item?.type == "In Person" ? false : (index > 0 || item?.status_key == 'cancel' || item?.patient_verified == false)}
                                  >
                                    {item?.status_key == 'in-progress' ? 'Rejoin' : 'Start'}
                                  </button>
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))
                      ) : null}

                  </table>
                  <Modal
                    title=""
                    centered
                    open={cancelModal}
                    onOk={() => setCancelModal(false)}
                    onCancel={() => setCancelModal(false)}
                    className="cancelModal"
                  >
                    <div className="iconImage">
                      <img src={close1} className="img-fluid closeIcon" onClick={() => setCancelModal(false)}></img>
                    </div>
                    <div className="cancelBox">
                      <h2>Are you sure you want<br></br>
                        to cancel this appointment?
                      </h2>
                      <button className="btn-01 btnlight" onClick={() => setCancelModal(false)}> No</button>
                      <button className="btn-01 btnblue" onClick={() => cancelAppointment()}> Yes</button>
                    </div>
                  </Modal>
                  {!awaitingPatient?.length > 0 && (
                    <>
                      <div className="noDataFound">
                        <h3>No Patients in queue</h3>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </>
      </section>

    </div>
  );
}

export default Dashboard;
