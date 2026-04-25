import React, { useEffect, useMemo, useState, useRef } from "react";
import { Select, InputNumber, Form, Input, Button, Checkbox, Radio } from "antd";
import { Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "./personalhistory.css";
import "./diabeteshis.css";
import swal from "sweetalert";
import uniqBy from "lodash.uniqby";
import API from "../../utils/customAxios";
import arrowdropdown from "../../assets/images/svg/dropdown-icon.svg";
import { DatePicker, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Textarea } from "evergreen-ui";
import moment from "moment";


function DiabetesHis({ patientData, patientsmbg }) {

    const defaultYear = patientData?.year_diagnosed || null;
    const defaultDate = patientData?.date || null;

    return (
        <>
            <Row className="diabetesHis mainLabelClass">
                <Col lg={6}>
                    <div className="boxnew p-26 newFormBox">
                        <Row className="mb-1">
                            <Col lg={4} className="spacing001 mb-3">
                                <div className="datepickerNew dd">
                                    <DatePicker
                                        disabled
                                        value={defaultDate ? moment(defaultDate, 'MM/DD/YYYY') : null}
                                        format="MM/DD/YYYY"
                                        className="datepickerDate"
                                    />
                                    <FontAwesomeIcon icon="fas fa-calendar-alt" className="iconClander" />
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col lg={12} className="spacing001  mb-3">
                                <p className="labelText1 fs-16 ps-0">Type of Diabetes</p>
                                <div className="borderBox2 radioBox newSpacing radioNew">

                                    <Radio.Group disabled defaultValue={`${patientData?.type}`}>
                                        <Radio value="pre_diabetes">Pre Diabetes</Radio>
                                        <Radio value="type_i_diabetes">Type i Diabetes</Radio>
                                        <Radio value="type_iI_diabetes">Type iI Diabetes</Radio>
                                        <Radio value="gestational_diabetes">Gestational Diabetes</Radio>
                                    </Radio.Group>

                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col lg={4} className="spacing001 mb-3">
                                <p className="labelText1 fs-16 ps-0">Year Diagnosed</p>
                                <div className="datepickerNew dd">
                                    <DatePicker
                                        disabled
                                        value={defaultYear ? moment(defaultYear, 'YYYY') : null}
                                        picker="year" // This will show only the year
                                        className="datepickerDate"
                                    />
                                    <FontAwesomeIcon icon="fas fa-calendar-alt" className="iconClander" />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} className="spacing001">
                                <Row className="align-items-center">
                                    <Col lg={7}> <p className="labelText1 fs-16 ps-0">Is patient taking insulin?</p></Col>
                                    <Col lg={3} className="ms-auto">
                                        <div className="borderBox2 radioBox newSpacing">
                                            <Radio.Group disabled defaultValue={`${patientData?.insulin}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="position-relative mt-1">
                                    <Form.Item
                                        name="takinginsulin"
                                        rules={[{ required: false, }]}
                                    >
                                        <Textarea defaultValue={patientData?.insulin_details !== null ? patientData?.insulin_details : ''} className="form-control textarea01" placeholder="Specify insulin details" readOnly></Textarea>
                                        <span className="character">100 character limit</span>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12} className="spacing001">
                                <Row className="align-items-center">
                                    <Col lg={7}> <p className="labelText1 fs-16 ps-0">Is patient diagnosed with Ketoacidosis?</p></Col>
                                    <Col lg={3} className="ms-auto">
                                        <div className="borderBox2 radioBox newSpacing">
                                            <Radio.Group disabled defaultValue={`${patientData?.keto_diagnosis}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="position-relative mt-1">
                                    <Form.Item
                                        name="Ketoacidosis"
                                        rules={[{ required: false, }]}
                                    >
                                        <Textarea defaultValue={patientData?.keto_details !== null ? patientData?.keto_details : ''} className="form-control textarea01" placeholder="Specify insulin details" readOnly></Textarea>
                                        <span className="character">100 character limit</span>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} className="spacing001">
                                <p className="labelText1 fs-16 ps-0">Remarks</p>
                                <div className="position-relative mt-1">
                                    <Form.Item
                                        name="remarks"
                                        rules={[{ required: false, }]}
                                    >
                                        <Textarea defaultValue={patientData?.remarks !== null ? patientData?.remarks : ''} className="form-control textarea01  " placeholder="Specify insulin details" readOnly></Textarea>
                                        <span className="character">100 character limit</span>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col lg={6}>
                    <div className="boxnew py-27">
                        <h3 className="heading1 px-40">SMBG</h3>
                        <div className='medicleHistory labReport position-relative h-100'>
                            <table className="table medicleTable">
                                <>
                                    <thead>
                                        <tr className="">
                                            <th className="text-center">Date</th>
                                            <th className="text-center"> Pre  <br></br>Breakfast </th>
                                            <th className="text-center"> Post <br></br> Breakfast</th>
                                            <th className="text-center"> Pre <br></br>Lunch </th>
                                            <th className="text-center"> Post <br></br>Lunch</th>
                                            <th className="text-center"> Pre <br></br>Dinner</th>
                                            <th className="text-center"> Before <br></br> Bed </th>
                                            <th className="text-center"> Random </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patientsmbg?.length > 0 && patientsmbg?.map((item) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td className='text-center'>{item?.date}</td>
                                                        <td className='text-center'>{item?.pre_breakfast}</td>
                                                        <td className='text-center'>{item?.post_breakfast}</td>
                                                        <td className='text-center'>{item?.pre_lunch}</td>
                                                        <td className='text-center'>{item?.post_lunch}</td>
                                                        <td className='text-center'>{item?.pre_dinner}</td>
                                                        <td className='text-center'>{item?.before_bed}</td>
                                                        <td className='text-center'>{item?.random}</td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </>
                            </table>
                            <div className="posabs d-none">
                                <button className="bontinue_btn" >
                                    CONTINUE
                                </button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row >
        </>
    )
}

export default DiabetesHis