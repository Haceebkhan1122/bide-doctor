import React, { useEffect, useState } from "react";
import { HeadingDesc, HeadingDescSmall } from "../../Headings";
import TextCard from "../textCard/TextCard";
import editIcon from "../../../assets/images/svg/edit_icon_blue.svg";
import closeIcon from "../../../assets/images/svg/close_icon_red.svg";
import { useHistory } from "react-router-dom";
import ConfirmModal from "../../modal/confirmModal/ConfirmModal"
import "./_HospitalCard.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectToggleClinic } from "../../../pages/health-clinics/redux/slice";
import { toggleClinic } from "../../../pages/health-clinics/redux/thunk";
import { toast } from "react-toastify";

function HospitalCard(props) {
  const [modal, setModal] = useState("false");
  const [toggleStatus, setToggleStatus] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dispatch = useAppDispatch();
  const clinicData = useAppSelector(selectToggleClinic);
  const { clinic, time_slots, id, consultation_fee, status, consultation_duration, menu } = props;
  const history = useHistory();
  const price2 = "Rs. " + consultation_fee;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        setMobile(true)
      }
    }
    setToggleStatus(status)
  }, [status])

  let consultation_duration2
  if (consultation_duration.length > 4) {
    consultation_duration2 = consultation_duration.split(":")[1]
  }
  else {
    consultation_duration2 = consultation_duration
  }
  let prop = { clinic, time_slots, id, consultation_fee, status, consultation_duration2 }
  const editClinic = (e) => {
    if (e === 0) {
      history.push("/clinic-timing", { type: "online", prop, menu: menu })
    } else {
      history.push("/clinic-info", { prop, menu: menu });
    }

  }

  const changeStatus = async () => {
    await dispatch(toggleClinic(id)).then(data => {
      if (data?.payload?.code === 200) {
        setToggleStatus(!toggleStatus)
        toast.success("Toggle Status Changed");
      }
      else {
        toast.error(data.payload.message)
      }
    });
  }
  const closeModal = () => {
    setModal(false)
  }
  return (
    <div className="hospital_card column_flex" key={id}>
      <div className="flex_start justify_between">
        <HeadingDesc text={clinic?.name} />
        <div className="top_options">
          <label className="switch">
            <input type="checkbox" checked={toggleStatus} onChange={changeStatus} />
            <span className="slider round"></span>
          </label>
          {!mobile &&
            <button onClick={(e) => editClinic(clinic?.id)}>
              <div className="img_circle circle_blue">
                <img src={editIcon} alt="editIcon" />
              </div>
            </button>}
          {!mobile &&
            <button
              onClick={() => setModal("m1")}
            >
              <div className="img_circle circle_red">
                <img src={closeIcon} alt="closeIcon" />
              </div>
            </button>}
          {!mobile &&
            <ConfirmModal
              show={modal === "m1"}
              close={() => setModal(false)}
              type="delete"
              closeModal={closeModal}
              id={id}
            />}
        </div>
      </div>
      {mobile ?
        <div className="column_flex">
          <div className="flex_start gap_flex">
            <HeadingDescSmall text={clinic?.address} />
          </div>
          <div className="flex_start little_gap">
            <HeadingDescSmall text="Each Time Slot Duration (in minutes):" />
            <HeadingDescSmall text={consultation_duration2} />
          </div>
          <div className="price_div">
            <HeadingDescSmall text={price2} />
          </div>
        </div>
        :
        <div className="column_flex">
          <div className="flex_start gap_flex">
            <HeadingDescSmall text={clinic?.address} />
            <div className="price_div">
              <HeadingDescSmall text={price2} />
            </div>
          </div>
          <div className="flex_start little_gap">
            <HeadingDescSmall text="Each Time Slot Duration (in minutes):" />
            <HeadingDescSmall text={consultation_duration2} />
          </div>
        </div>
      }
      <div className="time_slot">
        <HeadingDescSmall text="Timeslots" />
      </div>
      <div className="timings column_flex">
        {/* <p>{time_slots?.[0]?.day}</p> */}
        {time_slots?.map((time, i) => (
          <>
            <div key={i} className="flex_start gap_flex">
              <div className="day_name">
                <HeadingDescSmall text={time?.day} />
              </div>

              <div className="flex_start small_gap">
                {time?.data?.map((slot, index) => {
                  return <TextCard key={index} text={slot?.start_time} />;
                })}
              </div>
            </div>
          </>
        ))}
        {mobile && <div className="flex_end w-100 gap-2">
          <button onClick={(e) => editClinic(clinic?.id)}>
            <div className="img_circle circle_blue">
              <img src={editIcon} alt="editIcon" />
            </div>
          </button>
          <button
            onClick={() => setModal("m1")}
          >
            <div className="img_circle circle_red">
              <img src={closeIcon} alt="closeIcon" />
            </div>
          </button>
          <ConfirmModal
            show={modal === "m1"}
            close={() => setModal(false)}
            type="delete"
            closeModal={closeModal}
            id={id}
          /></div>}
      </div>
    </div>
  );
}

export default React.memo(HospitalCard);
