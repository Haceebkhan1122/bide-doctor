
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Input, Select, Radio, Space, Checkbox, TimePicker } from "antd";
import { Col, Row } from "react-bootstrap";
import infoIcon from "../../../../assets/images/png/info.png";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import plusIcon from "../../../../assets/images/png/plus.png";
import deleteIcon from '../../../../assets/images/png/delete_icon.png';
dayjs.extend(customParseFormat);



const { Option } = Select;

let index = 0;

function Test(props) {
    const [videoConsultCheckbox, setVideoConsultCheckbox] = useState(false);
    const [videoClinicCheckbox, setVideoClinicCheckbox] = useState(false);
    const [addDays, setAddDays] = useState(1);
    const [addTime, setAddTime] = useState([{}]);



    const handleConsultCheckbox = () => {
        setVideoConsultCheckbox(!videoConsultCheckbox);
    };
    const handleClinicCheckbox = () => {
        setVideoClinicCheckbox(!videoClinicCheckbox);
    };
    const handleAddDaysRow = () => {
        setAddDays(addDays + 1);
    }
    const handleRemoveDaysRow = () => {
        setAddDays(addDays - 1);
    }

    const handleAddTime = () => {
        setAddTime(prevAddTime => [
            ...prevAddTime,
            {
                id: uuidv4(),
            },
        ]);
    };
    const handleRemoveTime = (item) => {
        setAddTime(prevAddTime => {
            const updatedAddTime = prevAddTime.filter(x => x?.id !== item?.id);
            return updatedAddTime;
        });
    };



    console.log(addTime, "addTime")

    return (
        <>

            <Row>
                <Col lg={12} md={12}>
                    <div className="infoBox mb-33">
                        <img src={infoIcon} className="img-fluid" alt="info"></img>
                        <p>   Select one or both types of consultations as per your preference.</p>
                    </div>
                </Col>
                <Col lg={12} md={12} className="checkbox_style consultation_checkbox">
                    <div className="mb-24">
                        <Checkbox checked={videoConsultCheckbox} onChange={handleConsultCheckbox}> <span className="video">Video Consultations</span> <span className="consult_p">Consult patients online through video calls. </span></Checkbox>
                    </div>
                    {videoConsultCheckbox && (
                        <div className="video_consult ">
                            <Row className="">
                                <Col md={6} lg={6} className="selectBox  ">
                                    <Form.Item
                                        name={`mins`}
                                        label="Consultation duration in mins* "
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Consultation duration is required',
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Please select">
                                            <Option value="10mins">10 mins</Option>
                                            <Option value="20mins">20 mins</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col md={6} lg={6} className="selectBox ">
                                    <Form.Item
                                        name={`fee`}
                                        label="Consultation fees*"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Consultation fee is required',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter fee" />
                                    </Form.Item>

                                </Col>
                                <Col md={12} lg={12} className=" position-relative">
                                    <div className="add_more">
                                        <Button className="btn btn_add" onClick={handleAddDaysRow}><img src={plusIcon} ></img> Add more slots</Button>
                                    </div>


                                    {Array.from({ length: addDays }).map((_, index) => (
                                        <Row key={index} className="duplicate_row_days">
                                            <Col md={12} lg={12} className="">
                                                <Form.Item
                                                    name={`day${index}`}
                                                    label="Consultation days*"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Consultation day is required',
                                                        },
                                                    ]}
                                                >
                                                    <div className="checkbox_style1 checkbox_blue"  >
                                                        <Checkbox name="Monday">
                                                            <span className="days">Monday</span>
                                                        </Checkbox>
                                                        <Checkbox name="Tuesday">
                                                            <span className="days">Tuesday</span>
                                                        </Checkbox>
                                                        <Checkbox name="Wednesday">
                                                            <span className="days">Wednesday</span>
                                                        </Checkbox>
                                                        <Checkbox name="Thursday">
                                                            <span className="days">Thursday</span>
                                                        </Checkbox>
                                                        <Checkbox name="Friday">
                                                            <span className="days">Friday</span>
                                                        </Checkbox>
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col md={12} lg={12} className="">
                                                {addTime?.map((item, index1) => {
                                                    if (index1 === 0) {
                                                        return (
                                                            <>
                                                                <Row key={index1} className="duplicate_row_time">
                                                                    <Col md={6} lg={6} className="selectBox">
                                                                        <Form.Item
                                                                            name={`starttime${index1}`}
                                                                            label="Start time Fee*"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'Start time is required',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <TimePicker className="custom-timepicker" defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col md={6} lg={6} className="selectBox">
                                                                        <Form.Item
                                                                            name={`endtime${index1}`}
                                                                            label="End time"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'End time is required',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <TimePicker className="custom-timepicker" defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </>
                                                        )
                                                    } else {
                                                        return (
                                                            <div key={item?.id}>
                                                                <Row className="duplicate_row_time">
                                                                    <Col md={6} lg={6} className="selectBox">
                                                                        <Form.Item
                                                                            name={`starttime${item?.id}`}
                                                                            label="Start time Fee*"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'Start time is required',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <TimePicker className="custom-timepicker" defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col md={6} lg={6} className="selectBox">
                                                                        <Form.Item
                                                                            name={`endtime${item?.id}`}
                                                                            label="End time"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'End time is required',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <TimePicker className="custom-timepicker" defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Col lg={12} md={12} className="text-end ">
                                                                    <span style={{ cursor: 'pointer' }} onClick={() => handleRemoveTime(item)}>
                                                                        <img src={deleteIcon} alt="Delete" className="img-fluid" />
                                                                    </span>
                                                                </Col>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                                <Col md={12} lg={12} className="">
                                                    <div className="add_moretime text-end">
                                                        <Button className="btn btn_add ms-auto" onClick={() => handleAddTime(index)}>
                                                            <img src={plusIcon} alt="Add" /> Add Time
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Col>
                                            <Col lg={12}>
                                                {index === 0 ? (
                                                    /* Render content for the first row */
                                                    <Col lg={12} md={12} className="text-end ">
                                                        <Row>
                                                            <Col lg={9} md={9} className="mx-auto">
                                                                <hr />
                                                            </Col>
                                                        </Row>
                                                        {/* Your content for the first row */}
                                                    </Col>
                                                ) : (
                                                    /* Render content for other rows */
                                                    <Col lg={12} md={12} className="text-end ">
                                                        <Row>
                                                            <Col lg={9} md={9} className="mx-auto">
                                                                <hr />
                                                            </Col>
                                                        </Row>

                                                        <button>
                                                            <img src={deleteIcon} alt="Delete" onClick={handleRemoveDaysRow} className="img-fluid" />
                                                        </button>
                                                    </Col>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}




                                </Col>

                            </Row>
                        </div>
                    )}
                </Col>
                <Col lg={12} md={12} className="checkbox_style consultation_checkbox">

                    <Checkbox checked={videoClinicCheckbox} onChange={handleClinicCheckbox}> <span className="video">Clinic Visits</span> <span className="consult_p">Consult patients in-person at your clinic. </span></Checkbox>

                    {videoClinicCheckbox && (
                        <div className="video_consult">
                            Content here
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default Test;
