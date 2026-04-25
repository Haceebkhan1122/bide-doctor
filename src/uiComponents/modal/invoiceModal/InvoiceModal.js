import React, { useState, useForm, useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import {
  HeadingDesc,
  HeadingWithSpaceLarge,
  SectionHeadingMed,
} from "../../Headings";
import { Form, Input, Select } from "antd";
import { HiOutlineArrowDown } from "react-icons/hi";
import { SimpleButton } from "../../button";
import { postBankDetails } from "../../../pages/earnings/redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import arrowdropdown from "../../../assets/images/svg/dropdown-icon.svg";
import downloadIcon from "../../../assets/images/svg/download.svg";
import "./InvoiceModal.css";
import { ToastContainer, toast } from "react-toastify";
import swal from "sweetalert";
import { FiChevronRight } from "react-icons/fi";
import { RiContactsBookLine } from "react-icons/ri";
import Cookies from "js-cookie";

function InvoiceModal(props) {
  const [form] = Form.useForm();
  const { show, close, data, type,currentRecord } = props;
  const [visible, setVisible] = useState();
  const { Option } = Select;


  let baseUrl = process.env.REACT_APP_BASE_URL;


  async function downloadCSVHandler(e, id) {

    fetch(`${baseUrl}/doctor/download-invoice/${id}?is_html=1&is_download=1`, {
        method: 'GET',
        headers: {
            'Authorization': Cookies.get('token'),
            'Access-Control-Allow-Origin': '*'
        },
    })
        .then(response => response.blob())
        .then(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "file.pdf";
            document.body.appendChild(a);
            a.click();
        })
}

  const dispatch = useAppDispatch();

  const addBank = (values) => {
    dispatch(postBankDetails(values))
      .then((info) => {
        if (info.payload.code === 200) {
          // console.log(info);
          setVisible(close);
          // showResult(true);
          // setTimeout(() => {
          //   toast.success("Bank Details Edited Successfully");
          // }, 4000);

          swal(
            "Success!",
            "Your bank details have been updated successfully.",
            "success"
          ).then((value) => {
            window.location.reload();
          });
        } else {
          swal("Error!", "Your bank details could not be updated.", "error");
        }
      })
      .catch((err) => {
        swal("Error!", "Your bank details could not be updated.", "error");
      });
  };

  const deleteBank = () => {};

  if (type === "edit") {
    form.setFieldsValue(data);
  }
  // // console.log(data)

  useEffect(() => {
    setVisible(show);
  }, [show]);


  // console.log({currentRecord})

  return (
    <section className="invoiceModal">
    <Modal
      show={visible}
      className="modalLayout viewInvoiceModal"
      onHide={close}
      centered
      aria-labelledby="containoded-mal-title-vcenter"
    >
      <Modal.Header closeButton className="border-bottom-0 pb-0"></Modal.Header>
      {type === "delete" ? (
        <Modal.Body>
          <div className="content delete">
            <HeadingWithSpaceLarge text="Invoice" color="black" />

            <div className="flex_center">
              <SimpleButton
                type="submit"
                text="No"
                bgColor="red"
                onClick={close}
              />
              <SimpleButton
                type="submit"
                text="YES"
                bgColor="black"
                onClick={deleteBank}
              />
            </div>
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <div className="content">
            <div className="d-flex align-items-center justify-content-between w-100">
              <HeadingWithSpaceLarge
                className="text-initial"
                text="Invoice"
                color="black"
              />
              <a onClick={(e) => downloadCSVHandler(e, currentRecord?.apptId)} className="d-flex align-item-center">
                <img src={downloadIcon} alt="" className="img-fluid me-2" />
                Download Invoice
              </a>
            </div>
            <div className="bggrayBox mt-3">
              <div className="p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  
                  <h4 className="leftSideInvoiceHeading">Appointment ID</h4>
                  <h4 className="leftSideInvoiceHeading">Patient Name</h4>
                  <h4 className="leftSideInvoiceHeading">Appointment Date</h4>
                  <h4 className="leftSideInvoiceHeading">Appointment Time</h4>
                  <h4 className="leftSideInvoiceHeading">Appointment Type</h4>
                  <h4 className="leftSideInvoiceHeading">Payment Type</h4>
                  {currentRecord?.progress === "completed" &&
                  <div className="mt-4">
                  <h4 className="leftSideInvoiceHeading appointProgress">Amount Paid by Patient</h4>
                  <h4 style={{marginTop:'9px'}} className="leftSideInvoiceHeading appointProgress">Meri Sehat Platform Fee</h4>
                  </div>
                  }
                </div>
                <div>
                  <p className="rightSideInvoicePara">{currentRecord?.apptId}</p>
                  <p className="rightSideInvoicePara">{currentRecord?.patientName}</p>
                  <p className="rightSideInvoicePara">{currentRecord?.date}</p>
                  <p className="rightSideInvoicePara">{currentRecord?.time}</p>
                  <p className="rightSideInvoicePara">{currentRecord?.type}</p>
                  <p className="rightSideInvoicePara">
                    {currentRecord?.payment_type}
                  </p>
                  {currentRecord?.progress === "completed" &&
                  <div className="mt-4">
                  <p className="rightSideInvoicePara">{currentRecord?.amountToShow}</p>
                  <p className="rightSideInvoicePara">Rs. {currentRecord?.platformFee}</p>
                  </div>
                  }
                </div>
              </div>
              </div>
              <div className="d-flex mt-4 totalAmountBorder justify-content-between">
                {currentRecord?.progress === "completed" && (
                  <>
                  <h4 className="leftSideInvoiceHeading totalAmountGst ps-3">Total Amount<span className="inclusiveText ms-2">(incl. GST)</span></h4>
                  <p className="rightSideInvoicePara pe-3">{`Rs. ${currentRecord?.amount}`}</p>
                  {/* <p className="rightSideInvoicePara pe-3">{currentRecord?.amountToShow === "N/A" ? `Rs. ${currentRecord?.platformFee}` : `Rs. ${currentRecord?.amountToShow - currentRecord?.platformFee}`}</p> */}
                  </>
                 )}

                 {currentRecord?.progress === "cancel" && (
                  <>
                  {/* // <div className="pt-3"> */}
                  <div className="ps-3">
                    <h4 className="leftSideInvoiceHeading">Amount Paid by Patient</h4>
                    <div className="d-block">
                    <h4 className="leftSideInvoiceHeading cancellationFee pe-3">Cancellation Fee</h4>
                    <p className="leftSideInvoiceHeading cancellationUnderText pe-3">(This amount will be deducted from your total receivables)</p>
                    </div>
                  </div>
                  <div>
                  <p className="rightSideInvoicePara pe-3">{currentRecord?.amountToShow}</p>
                  <p className="rightSideInvoicePara pe-3">{currentRecord?.cancellation_fee === 'NA' ? 0 : `Rs.${currentRecord?.cancellation_fee}`}</p>
                  </div>
                    {/* // </div> */}
                    </>
                 )}
                  </div>
            </div>
          </div>
        </Modal.Body>
      )}
    </Modal>
    </section>
  );
}

export default React.memo(InvoiceModal);
