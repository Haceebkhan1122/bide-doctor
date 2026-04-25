import React, { useEffect, useState, useRef } from "react";
// import Slider from "react-slick"; 
import { Row, Col, Container, Modal } from "react-bootstrap";
import {
  HeadingDesc,
  HeadingDescSmall,
  HeadingDescVsmall,
} from "../../uiComponents/Headings";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProgressBar } from "react-bootstrap";
import logoNeww from "../../assets/images/png/default-user.png";
import shareIcons from "../../assets/images/svg/share-icon.svg";
import logoNewMobile from "../../assets/images/png/mobileLogo.png";
import profileCompletion from "../../assets/images/svg/complete-profile-dash.svg";
import profileVerifications from "../../assets/images/svg/pending-verification.svg";
import { Link } from "react-router-dom";
import goLive from "../../assets/images/svg/go-live.svg";
import greenCheck from "../../assets/images/svg/greenCheck.svg";
import grayCheck from "../../assets/images/svg/gray-check.svg";
import { Accordion } from "react-bootstrap";
import API from "../../utils/customAxios";
import { getCurrentUserData } from "../../utils/powerFuntions";
import { useSelector } from "react-redux";
// import { selectUser } from "../updateProfile/redux/slice";

function DashboardNew() {

  // const user = useSelector(selectUser);
  const [progress, setProgress] = useState("");
  const [doctorCurrentData, setDoctorCurrentData] = useState("");
  const [profileVerification, setProfileVerification] = useState(null)
  const [doctorSpecialists, setDoctorSpecialists] = useState([]);


  // useEffect(() => {
  //   setDoctorSpecialists(user?.data?.user?.doctor_specialities);
  // }, []);

  const specialistString = doctorSpecialists?.join(", ");

  useEffect(() => {
    (async () => {
      const res = await getCurrentUserData();
      if (res) {
        setDoctorCurrentData(res);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get(`doctor/progress`);

        if (response?.data?.code === 200) {
          setProgress(response?.data?.data);
        }
      } catch (error) { }
    })();
  }, []);

  const percentage = progress?.profile_completion;

  return (
    <section className="dashboardNew" style={{ paddingTop: '60px' }}>
      <Row>
        <Col lg={12}>
          <div className="mt-md-0 card bg-white p-3 d-md-flex flex-row align-items-end justify-content-between d-block bg-change-mobile">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center align-items-lg-start">
                <div className="imgProfile me-3">
                  <img
                    src={logoNeww}
                    alt=""
                    className="img-fluid rounded d-none d-lg-block"
                  />
                  <img
                    src={logoNewMobile}
                    alt=""
                    className="img-fluid rounded d-lg-none"
                  />
                </div>
                <div className="d-flex flex-md-row flex-column">
                  <div className="nameDoctor order-2 order-md-1 ">
                    <h4 className="color-313131">
                      Hello,
                      <br className="d-lg-none" /> {doctorCurrentData?.prefix}. {doctorCurrentData?.name}
                    </h4>
                    <p className="belowSpeciality" >{specialistString}</p>
                    <p className="d-none d-lg-block">
                      {doctorCurrentData?.doctor_educations?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item}
                          {index !== doctorCurrentData.doctor_educations.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-lg-none">
                <img src={shareIcons} alt="" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-2 percentageBar">
              <div className="col-6 col-lg-12">
                <ProgressBar now={percentage} label={`${percentage} %`} />

                <h6>Profile Completion <span className="d-none ms-1 d-sm-block">{progress?.profile_completion}%</span></h6>

              </div>
              <div className="text-center">

                <Link to="/profile-setup" class={progress?.profile_completion == '100' ? ("activebtn ")
                  : progress?.profile_status === 'Incomplete' ?
                    ("") : ''}>View your profile</Link>
                {/* <button className="" to="/profile-setup">View your profile</button> */}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="my-4">
        <div className="d-flex align-items-center statusHead">
          <h3>Profile Status</h3>
          {progress?.profile_status === 'Incomplete' ? (<div class="status articleLabel d-flex align-items-center ms-4 mb-0">
            <p class="text">Incomplete</p>
          </div>)
            : progress?.profile_status === 'Pending Verification' ?
              (<div class="status articleLabel d-flex align-items-center ms-4 mb-0">
                <p style={{ color: '#EB8E39' }} class="text">Pending Verification</p>
              </div>) : ''}
        </div>
      </Row>
      <Row>
        <Col lg={12}>
          <Accordion defaultActiveKey="" className="completionBoxShad">
            <Accordion.Item className="" eventKey="0">
              <Accordion.Header className="pricing-accordion-question">
                <div className="d-flex align-items-center">
                  <div className="img-width-sett">
                    <img src={profileCompletion} alt="" className="img-fluid" />
                  </div>
                  <div className="ms-2">
                    <div className="d-flex">
                      <h3>Profile Completion</h3>
                      <div class="status d-flex align-items-center ms-3 mt-1 profileLabels ">
                        {percentage === 100 ? <p style={{ color: '#83C256', backgroundColor: '#e6f3dd' }} class="text">complete</p> : ''}
                      </div>
                    </div>
                    <p>Complete and submit your profile</p>
                  </div>

                </div>
              </Accordion.Header>
              <Accordion.Body className="accordionInner p-lg-5 py-4">
                <div className="d-flex align-items-start px-4 ms-1 mb-4 beforeImgAdd position-relative">
                  {progress?.about_completion === 40 ? (
                    <img style={{ zIndex: '10' }} src={greenCheck} alt="" className="img-fluid" />) :
                    <img src={grayCheck} alt="" className="img-fluid" />
                  }

                  <div className="ms-2">
                    <h3 className="mb-1">About</h3>
                    <p>Add details about yourself and your practice.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start px-4 ms-1 mb-4 beforeImgAdd position-relative">
                  {progress?.qualification_completion === 30 ? (
                    <img style={{ zIndex: '10' }} src={greenCheck} alt="" className="img-fluid" />) :
                    <img src={grayCheck} alt="" className="img-fluid" />
                  }
                  <div className="ms-2">
                    <h3 className="mb-1">Qualifications</h3>
                    <p>
                      Add details about your academic and professional
                      background.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start px-4 ms-1">
                  {progress?.consultation_completion === 30 ? (
                    <img style={{ zIndex: '10' }} src={greenCheck} alt="" className="img-fluid" />) :
                    <img src={grayCheck} alt="" className="img-fluid" />
                  }
                  <div className="ms-2">
                    <h3 className="mb-1">Consultation</h3>
                    <p>
                      Select your consultation type, duration, fees and more.{" "}
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="completionBoxShad mt-4 p-lg-3 p-2">
            <div className="d-flex align-items-center">
              <div className="img-width-sett dd">
                <img src={profileVerifications} alt="" className="img-fluid w-5" />
              </div>
              <div className="ms-2 d-flex align-items-start">
                <div className="">
                  <div className="d-flex">
                    <h3>Profile Verification</h3>
                    <div class="status d-flex align-items-center  ms-3 mt-1 mb-0 profileLabels">
                      {progress?.profile_status === 'Pending Verification' ? <p style={{ color: '#EB8E39', backgroundColor: '#fbe8d7' }} class="text">Pending</p> : ''}
                    </div>
                  </div>
                  <p>Await verification from Meri Sehat</p>
                </div>
              </div>
            </div>
          </div>
          <div className="completionBoxShad mt-4 p-lg-3 p-2 ">
            <div className="d-flex align-items-center">
              <div className="img-width-sett">
                <img src={goLive} alt="" className="img-fluid" />
              </div>
              <div className="ms-2">
                <h3>Go Live</h3>
                <p>Start earning</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>

    </section>
  );
}

export default DashboardNew;
