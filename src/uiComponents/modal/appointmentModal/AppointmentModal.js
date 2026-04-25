import React, { useState } from "react";
import "./appointmentModal.css";
import { FaTimes } from "react-icons/fa";
function AppointmentModal({
  description,
  single,
  singleText,
  btn1Text,
  btn2Text,
  show,
  onClickHandler
}) {
  const [showModal, setShowModal] = useState(show);

  return (
    <>
      {showModal && (
        <div className="modal-container container text-center">
          <div
            className="close-icon"
            onClick={() => {
              setShowModal(false);
            }}
          >
            <FaTimes color="#313131" />
          </div>

          <div className="row">
            <div className="col-md-10 m-auto">
              <h5 className="mb-3">
                {description}
              </h5>

              <div className="buttons-container w-100">
                {single ? (
                  <button className="ms-3 modal-container-no">
                    {singleText}
                  </button>
                ) : (
                  <>
                    <button className="modal-container-yes"> {btn1Text} </button>
                    {onClickHandler ? (
                      <button className="ms-3 modal-container-no" onClick={onClickHandler}> {btn1Text} </button>
                    ) : (
                      <button className="ms-3 modal-container-no"> {btn2Text} </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(AppointmentModal);