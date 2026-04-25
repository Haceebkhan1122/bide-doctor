/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { SectionHeadingMed } from "../../Headings";
// import tickIcon from "../../assets/images/svg/tick_icon.svg";
import {BiCheck} from "react-icons/bi";
import "./_cancelModal.scss";

function CancelModal(props) {
  const { show, close } = props;

  return (
    <Modal
      show={show}
      className="modalLayout closeModal"
      onHide={close}
      centered
      aria-labelledby="containoded-mal-title-vcenter"
    >
      <Modal.Body>
        <div className="content">
          <div className="tick_div">
            <BiCheck color="#72D54A" className="tick_icon"/>
          </div>
          {/* <img src={tickIcon} alt="tickIcon" className="tick_icon" /> */}
          <SectionHeadingMed text="Hospital has been added successfully!" />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CancelModal;
