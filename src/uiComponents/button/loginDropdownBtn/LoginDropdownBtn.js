import React, { useEffect, useState } from "react";
import { DropdownButton, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { HeadingDesc } from "../../Headings";
import arrowIcon from "../../../assets/images/svg/arrow-down-black.svg";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import "./_loginDropdownBtn.scss";
import API from "../../../utils/customAxios";
import swal from "sweetalert";
import logoutWarning from "../../../assets/images/png/logout-not-possible.png";
import logoutIcon from "../../../assets/images/png/logut-icon.png";
import Loader from "../../loader/Loader";
import { Modal as AntModal } from "antd";
import Cookies from "js-cookie";

function LoginDropdownBtn({ profileVerificationDoctor }) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [doctorName, setDoctorName] = useState(false);

  const handleClose = () => setLogoutConfirm(false);
  const handleOkayClose = () => setLogoutConfirm(false);

  useEffect(() => {
    const doctorName = Cookies.get('doctorName')
    setDoctorName(doctorName)
  }, [])

  useEffect(() => {
    // dispatch(getProfile());
  }, []);

  const nameAbbreviation = (name) => {
    if (!name || typeof name !== 'string') {
      return '';
    }

    const words = name.trim().split(' ');
    const abbreviation = words
      .filter((word) => word !== '')
      .map((word, index) => {
        if (index === 0 || words.length === 1) {
          return word.charAt(0).toUpperCase();
        }
        return '';
      })
      .join('');

    return abbreviation;
  };

  const dropDownTitle = () => (
    <div className="loginDropdownContainer">
      {typeof name === "string" && (
        <>
          <div className="dropDownTitle">
            <HeadingDesc text={<b>{doctorName?.[0]?.toUpperCase()}</b>} />
          </div>
          <div className="arrowIcon ee">
            <img src={arrowIcon} alt="arrowIcon" />
          </div>
        </>
      )}
    </div>
  );

  const simplyLogout = async () => {
    try {
      setApiLoading(true);
      const data = {
        is_instant_consultation: 0,
      };

      const response = await API.post(
        `${process.env.REACT_APP_BASE_URL}/doctor/instant-online-offline`,
        data
      );

      if (response?.data?.code === 200) {
        setApiLoading(false);
        sessionStorage.removeItem("alreadyShow");
        Cookies.remove("token");
        Cookies.remove("pagestatus");
        Cookies.remove("pageStatus");
        // dispatch(SelectAuth(null));

        window.location.href = "/login";
      } else {
        setApiLoading(false);
      }
    } catch (error) {
      setApiLoading(false);
    }
  };

  const logout = async () => {
    try {

      setApiLoading(true);
      const response1 = await API.post("/logout");
      Cookies.remove('token')
      if (response1?.status == 200) {
        window.location.href = "/login"
      }
    } catch (error) {
      setApiLoading(false);
      swal("Error!", error?.response?.data?.message || error?.message, "error");
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      {apiLoading && (
        <>
          <Loader />
        </>
      )}
      <div id="loginDropdown" className="desktop">
        <DropdownButton
          title={dropDownTitle()}
          className={dropdownOpen ? "active" : ""}
          onToggle={handleDropdownToggle}
        >
          {/* {profileVerificationDoctor === 0 ? (
            <p style={{ cursor: 'pointer' }} className="dropdown-item">
              My Profile
            </p>
          ) :
            <NavLink className="dropdown-item" to="/profile-update">
              My Profile
            </NavLink>
          } */}



          {/* <NavLink className="dropdown-item" to="/profile-update">
        My Profile
      </NavLink>
         */}
          <div className="">
            <button
              disabled={apiLoading}
              className="dropdown-item d-flex align-items-center justify-content-start"
              onClick={logout}
            >
              <img
                src={logoutIcon}
                alt="arrowRightIcon"
                className="img-fluid me-2"
              />
              Log Out
              {/* <img src={arrowRightIcon} alt="arrowRightIcon" /> */}
            </button>
          </div>
        </DropdownButton>

        <AntModal
          className="leaveConsultationModal consultationAboutEnd"
          title=""
          centered
          visible={showPrompt}
          okText="OK"
          closable={true}
          cancelButtonProps={{ style: { display: "none" } }}
          onOk={() => setShowPrompt(false)}
          onCancel={() => setShowPrompt(false)}
        >
          <div className="col-md-11 m-auto text-center">
            <img src={logoutWarning} />
            <h5 className="ff-Nunito color-313131 fs-24 mb-4 mt-4 line-height-35 fw-500">
              Log out not possible{" "}
            </h5>
            <p className="ff-circular fw-300 fs-17 line-height-24 mb-3">
              You can't log out, you have a pending appointment.{" "}
            </p>
          </div>
        </AntModal>
        {/* -----------logout modal--------- */}
        <Modal
          className="text-center ToGetCenter cancel-appointment-modal confirmLogoutModdal"
          show={logoutConfirm}
          onHide={handleOkayClose}
        >
          <button
            className="border-bottom-0 closeButtonCancelModal"
            onClick={handleClose}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="close"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
            </svg>
          </button>
          <div className="pt-0 mb-4">
            <h4 className="fw-600 ff-Nunito">
              Are you sure you want to log out?
            </h4>
          </div>
          <div className="border-top-0 row flex-md-nowrap justify-content-center pb-0">
            <button
              className="btn-btn-lg btn-transparent modal-btn me-md-3"
              onClick={simplyLogout}
            >
              Yes
            </button>

            <button
              className="btn btn-lg theme-bg modal-btn ms-md-3 text-white"
              onClick={handleClose}
            >
              No
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default React.memo(LoginDropdownBtn);
