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
import {
  getEarning,
  postBankDetails,
} from "../../../pages/earnings/redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
// import { selectUser } from "./redux/slice";
// import { setInLocalStorage } from "../../../utils/helperFunctions";
// import { authInfo } from "../../../layouts/redux/slice";
import arrowdropdown from "../../../assets/images/svg/dropdown-icon.svg";
import "./AddBankModal.scss";
import { ToastContainer, toast } from "react-toastify";
import swal from "sweetalert";
import { FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { earningStatus } from "../../../pages/earnings/redux/slice";

function AddBankModal(props) {
  const [form] = Form.useForm();
  const { show, close, data, type } = props;
  const [visible, setVisible] = useState();
  const { Option } = Select;

  const dispatch = useAppDispatch();

  const addBank = (values) => {
    dispatch(postBankDetails(values))
      .then((info) => {
        if (info.payload.code === 200) {
          // console.log(info);
          setVisible(close);
          // showResult(true);
          // setTimeout(() => {
          if (type === "edit") {
            toast.success("Bank Details Edited Successfully");
          } else {
            toast.success("Bank Details Added Successfully");
          }

          setTimeout(() => {
            window.location.reload();
          }, 2000);
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

  return (
    <Modal
      show={visible}
      className="modalLayout addBankModal"
      onHide={close}
      centered
      aria-labelledby="containoded-mal-title-vcenter"
    >
      <Modal.Header closeButton></Modal.Header>
      {type === "delete" ? (
        <Modal.Body>
          <div className="content delete">
            <HeadingWithSpaceLarge text="DELETE BANK DETAILS" color="black" />
            <HeadingDesc
              text="Are you sure you want to delete your bank details?"
              color="black"
            />
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
            <HeadingWithSpaceLarge className='px-4' text="ADD BANK DETAILS" color="black" />
            <Form layout="vertical" onFinish={addBank} form={form}>
              <Row className="px-4">
                <Col md={12}>
                  <Form.Item
                    name="bank_name"
                    label="Bank*"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Select
                      dropdownAlign={{ offset: [0, 4] }}
                      virtual
                      listHeight={120}
                      placeholder={"Select Bank"}
                      suffixIcon={<img src={arrowdropdown} alt />}
                      className="c_select"
                    >
                      <Option value="Abb">Al Baraka Bank limited</Option>
                      <Option value="Abl">Allied bank Limited</Option>
                      <Option value="Acb">Askari Commercial bank</Option>
                      <Option value="Hbl">Bank Al-Habib Limited</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item
                    name="account_name"
                    label="Account Title*"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                      
                      {
                        max: 25,
                        message: "Account title cannot exceed more than 25 digits"
                      }
                    ]}
                  >
                    <Input
                      type="text"
                      className="c_input"
                      placeholder={"Enter account title"}
                    />
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item
                    name="account_number"
                    className="accountNumber"
                    label="Account Number*"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Account number must only contain digits",
                      },
                      {
                        max: 16,
                        message: "Account number must be at most 16 digits",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      className="c_input"
                      bordered
                      placeholder={"Enter account number"}
                    />
                  </Form.Item>
                </Col>
             
                <Col md={12}>
                  <Form.Item
                    name="iban_number"
                    label="IBAN*"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },

                      {
                        max: 20,
                        message: "IBAN must be at most 20 characters",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      className="c_input"
                      placeholder={"Enter IBAN"}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col md={12}>
                  <hr />
                </Col>
              <Row className="px-4">
                <Col md={12}>
                  <button
                    className="submit-btn-completed bankSubmitBtn add-record-btn text-uppercase w-100 max-width-100"
                    type="submit"
                  >
                    Save Details
                    <span className="add-record-chevron">
                      <FiChevronRight />
                    </span>
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
}

export default React.memo(AddBankModal);
