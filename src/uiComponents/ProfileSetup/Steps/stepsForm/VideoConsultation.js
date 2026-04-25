import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  Space,
  Checkbox,
  TimePicker,
} from "antd";
import { Col, Row } from "react-bootstrap";
import infoIcon from "../../../../assets/images/png/info.png";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import plusIcon from "../../../../assets/images/png/plus.png";
import deleteIcon from "../../../../assets/images/png/delete_icon.png";
import styled from "styled-components";
import API from "../../../../utils/customAxios";
import moment from "moment";
import { isBrowser, isMobile } from "react-device-detect";
import arrowIcon from "../../../../assets/images/svg/arrowIcon.svg";
import { MdBorderColor } from "react-icons/md";

dayjs.extend(customParseFormat);

const { Option } = Select;

let index = 0;

function VideoConsultation(props) {
  const [addslots, setAddSlots] = useState(1);
  const [addTimeslots, setAddTimeslots] = useState([{}]);
  const [addDays, setAddDays] = useState(1);
  const [addTime, setAddTime] = useState([{}]);
  const [mins, setMins] = useState("");
  const [fees, setFees] = useState("");
  const [clinicFees, setClinicFees] = useState("");
  const [clinicMins, setClinicMins] = useState("");
  const [hospital, setHospital] = useState("");
  // const [videoStartTime, setVideoStartTime] = useState("");
  // const [videoEndTime, setVideoEndTime] = useState("");
  const [anotherStartTime, setAnotherStartTime] = useState("");
  const [anotherEndTime, setAnotherEndTime] = useState("");
  const [clinics, setClinics] = useState([]);
  const [consultationMinutes, setConsultationMinutes] = useState([]);
  const [redField, setRedField] = useState(false)

  const {
    videoClinics,
    setVideoClinics,
    videoSlots,
    setVideoSlots,
    videoTimeSlots,
    setVideoTimeSlots,
    clinicVisit,
    setClinicVisit,
    clinicSlots,
    setClinicSlots,
    clinicTimeSlots,
    setClinicTimeSlots,
    videoClinicCheckbox,
    setVideoClinicCheckbox,
    videoConsultCheckbox,
    setVideoConsultCheckbox,
  } = props;

  const [videoStartTimeArray, setVideoStartTimeArray] = useState([
    {
      timeSlotId: 1,
      time: "",
    },
  ]);

  const [videoEndTimeArray, setVideoEndTimeArray] = useState([
    {
      timeSlotId: 1,
      time: "",
    },
  ]);

  const [clinicStartTimeArray, setClinicStartTimeArray] = useState([
    {
      timeSlotId: 1,
      time: "",
    },
  ]);

  const [clinicEndTimeArray, setClinicEndTimeArray] = useState([
    {
      timeSlotId: 1,
      time: "",
    },
  ]);

  useEffect(() => {
    const currentYear = moment().year();
    const minutesArray = [];
    const minutesInterval = 10;
    const maxMinutes = 60;

    for (let minutes = 30; minutes <= maxMinutes; minutes += minutesInterval) {
      minutesArray.push({ id: minutes, minutes: minutes });
    }
    // for (
    //   let minutes = minutesInterval;
    //   minutes <= maxMinutes;
    //   minutes += minutesInterval
    // ) {
    //   minutesArray.push({ id: minutes, minutes: minutes });
    // }

    setConsultationMinutes(minutesArray);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get(`doctor/all-clinic-listing`);

        if (response?.data?.code === 200) {
          setClinics(response?.data?.data);
        }
      } catch (error) { }
    })();
  }, []);

  const handleConsultCheckbox = () => {
    setVideoConsultCheckbox(!videoConsultCheckbox);
  };
  const handleClinicCheckbox = () => {
    setVideoClinicCheckbox(!videoClinicCheckbox);
  };

  //For Video Clinics state and add/manipulate functions...

  function addVideoSlot(e, clinicId) {
    addVideoTimeSlot(null, clinicId, videoSlots.length + 1);

    setVideoSlots([
      ...videoSlots,
      {
        clinicId: clinicId,
        slotsId: videoSlots.length + 1,
      },
    ]);
  }

  function deleteVideoSlot(e, slotId) {
    const slots = videoSlots?.filter((item) => {
      return item?.slotsId !== slotId;
    });

    setVideoSlots(slots);
  }

  function addVideoTimeSlot(e, clinicId, slotId) {
    setVideoTimeSlots([
      ...videoTimeSlots,
      {
        clinicId: clinicId,
        slotsId: slotId,
        timeSlotId: videoTimeSlots.length + 1,
      },
    ]);
  }

  function deleteVideoTimeSlot(e, slotId, timeSlotId) {
    const slots = videoTimeSlots?.filter((item) => {
      return item?.timeSlotId !== timeSlotId;
    });

    setVideoTimeSlots(slots);
  }

  function setLocalVideoSlots(checked, day, clinicId, slotId) {

    if (checked && day !== "monday") {

      setVideoTimeSlots([
        ...videoTimeSlots,
        {
          clinicId: clinicId,
          slotsId: slotId,
          timeSlotId: videoTimeSlots.length + 1,
          day: day,
        },
      ]);
    } else if (!checked) {
      const slots = videoTimeSlots?.filter((slot) => {
        return slot?.slotsId !== slotId || slot?.day !== day;
      });

      setVideoTimeSlots(slots);
    } else {
    }
  }

  // For clinic visit state and manipulation functions

  function addAnotherClinic() {
    addClinicTimeSlot(null, clinicVisit.length + 1, clinicSlots.length + 1);
    addClinicSlot(null, clinicVisit.length + 1);

    setClinicVisit([...clinicVisit, { id: clinicVisit.length + 1 }]);
  }

  function deleteClinic(e, clinicId) {
    setClinicVisit(clinicVisit?.filter((clinic) => clinic?.id != clinicId));
  }

  function addClinicSlot(e, clinicId) {
    addClinicTimeSlot(null, clinicId, clinicSlots.length + 1);

    setClinicSlots([
      ...clinicSlots,
      {
        clinicId: clinicId,
        slotsId: clinicSlots.length + 1,
      },
    ]);
  }

  function deleteClinicSlot(e, slotId) {
    const slots = clinicSlots?.filter((item) => {
      return item?.slotsId !== slotId;
    });

    setClinicSlots(slots);
  }

  function addClinicTimeSlot(e, clinicId, slotId) {
    setClinicTimeSlots([
      ...clinicTimeSlots,
      {
        clinicId: clinicId,
        slotsId: slotId,
        timeSlotId: clinicTimeSlots.length + 1,
      },
    ]);
  }

  function deleteClinicTimeSlot(e, clinicId, slotId, timeSlotId) {
    const slots = clinicTimeSlots?.filter((item) => {
      return item?.timeSlotId !== timeSlotId;
    });

    setClinicTimeSlots(slots);
  }

  function setLocalClinicSlots(checked, day, clinicId, slotId) {

    if (checked && day !== "monday") {

      setClinicTimeSlots([
        ...clinicTimeSlots,
        {
          clinicId: clinicId,
          slotsId: slotId,
          timeSlotId: clinicTimeSlots.length + 1,
          day: day,
        },
      ]);
    } else if (!checked) {
      const slots = clinicVisit?.filter((slot) => {
        return slot?.slotsId !== slotId || slot?.day !== day;
      });

      setClinicTimeSlots(slots);
    } else {
    }
  }
  const validateLocationNumber = (_, value) => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]*[a-zA-Z0-9][a-zA-Z0-9\s]*$/; // Regular expression to allow alphanumeric characters and spaces, with at least one alphanumeric character

    if (!value) {
      setRedField(true)
      return Promise.reject("Location is required");

    }

    const isAlphanumeric = alphanumericRegex.test(value);

    // if (isAlphanumeric == '') {
    //   return Promise.reject("Location is required");
    //   setRedField(true)

    // }

    if (!isAlphanumeric) {
      return Promise.reject("Location should be alphanumeric");
    }

    return Promise.resolve();
  };

  const validateLocationRequired = (_, value) => {
    if (!value) {
      return Promise.reject("Location is required");
    }

    else {
      return Promise.resolve()
    }
  }

  function handleVideoStartTimeChange(e, timeSlotId) {
    setVideoStartTimeArray([
      ...videoStartTimeArray,
      {
        timeSlotId,
        time: e,
      },
    ]);
  }

  function handleVideoEndTimeChange(e, timeSlotId) {
    setVideoEndTimeArray([
      ...videoEndTimeArray,
      {
        timeSlotId,
        time: e,
      },
    ]);
  }

  const validateVideoEndTime = (id) => (rule, value, callback) => {
    const startTime = videoStartTimeArray.find(
      (item) => item?.timeSlotId === id
    );

    if (value && startTime && value.isBefore(startTime.time, "minute")) {
      // callback('End time must be greater than start time');
      return Promise.reject("End time must be greater than start time");
    } else {
      // callback();
      return Promise.resolve();
    }
  };

  function handleClinicStartTimeChange(e, timeSlotId) {
    setClinicStartTimeArray([
      ...clinicStartTimeArray,
      {
        timeSlotId,
        time: e,
      },
    ]);
  }

  function handleClinicEndTimeChange(e, timeSlotId) {
    setClinicEndTimeArray([
      ...clinicEndTimeArray,
      {
        timeSlotId,
        time: e,
      },
    ]);
  }

  const validateClinicEndTime = (id) => (rule, value, callback) => {
    const startTime = clinicStartTimeArray.find(
      (item) => item?.timeSlotId === id
    );

    if (value && startTime && value.isBefore(startTime.time, "minute")) {
      // callback('End time must be greater than start time');
      return Promise.reject("End time must be greater than start time");
    } else {
      // callback();
      return Promise.resolve();
    }
  };

  function generateArrayWithoutNumber() {
    let res = [];
    for (let i = 0; i <= 255; i++) {
      if (i >= 48 && i <= 57) {
      } else {
        res.push(String.fromCharCode(i));
      }
    }
    return res;
  }

  const arrayWithoutNumber = useMemo(() => generateArrayWithoutNumber(), []);

  console.log({ redField })
  return (
    <StyledVideoConsultation>
      <Row>
        <Col lg={12} md={12}>
          <div className="infoBox mb-33">
            <img src={infoIcon} className="img-fluid" alt="info"></img>
            <p>
              {" "}
              Select one or both types of consultations as per your preference.
            </p>
          </div>
        </Col>
        <Col lg={12} md={12} className="checkbox_style consultation_checkbox">
          <div className="mb-24">
            <Checkbox
              checked={videoConsultCheckbox}
              onChange={handleConsultCheckbox}
            >
              {" "}
              <span className="video">Video Consultations</span>{" "}
              <span className="consult_p">
                Consult patients online through video calls.{" "}
              </span>
            </Checkbox>
          </div>
          {videoConsultCheckbox && (
            <div className="video_consult ">
              <Row className="">
                <Col md={6} lg={6} className="selectBox sss">
                  <Form.Item
                    name={`video_mins`}
                    label={
                      !isMobile
                        ? "Consultation duration in mins*"
                        : "Consultation duration in mins (Slot size)*"
                    }
                    rules={[
                      {
                        required: true,
                        message: "Consultation duration is required",
                      },
                    ]}
                  >
                    <Select
                      onChange={(value) => {
                        setMins(value);
                      }}
                      placeholder="Please select"
                    >
                      {consultationMinutes?.length > 0 &&
                        consultationMinutes?.map((item) => (
                          <>
                            <Option value={item?.id}>
                              {item?.minutes} mins
                            </Option>
                          </>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} lg={6} className="selectBox ">
                  <Form.Item
                    name={`video_fee`}
                    label="Consultation fees* "
                    rules={[
                      {
                        required: true,
                        message: "Consultation fees is required",
                      },
                    ]}
                  >
                    <Input
                      onKeyDown={(evt) =>
                        arrayWithoutNumber.includes(evt.key) &&
                        evt.preventDefault()
                      }
                      maxLength={5}
                      onChange={(e) => {
                        setFees(e.target.value);
                      }}
                      value={fees}
                      placeholder="Enter fee"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} lg={12} className=" position-relative">
                  <div className="add_more">
                    <Button
                      className="btn btn_add"
                      onClick={(e) => addVideoSlot(e, 1)}
                    >
                      <img src={plusIcon}></img> Add more slots
                    </Button>
                  </div>

                  {videoSlots.map((slot, index) => (
                    <Row key={index} className="duplicate_row_days">
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

                            <button className="last">
                              <img
                                src={deleteIcon}
                                alt="Delete"
                                onClick={(e) =>
                                  deleteVideoSlot(e, slot?.slotsId)
                                }
                                className="img-fluid"
                              />
                            </button>
                          </Col>
                        )}
                      </Col>
                      <Col md={12} lg={12} className="">
                        <Form.Item
                          name={`video_day${slot?.slotsId}`}
                          label="Consultation days "
                          type="array"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (!value || value.length === 0) {
                                  return Promise.reject(
                                    "At least one consultation day is required"
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Checkbox.Group className="checkbox_blue">
                            <Checkbox
                              name="Monday"
                              value="monday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "monday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Monday" : "Mon"}
                              </span>
                            </Checkbox>
                            <Checkbox
                              name="Tuesday"
                              value="tuesday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "tuesday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Tuesday" : "Tue"}
                              </span>
                            </Checkbox>
                            <Checkbox
                              name="Wednesday"
                              value="wednesday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "wednesday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Wednesday" : "Wed"}
                              </span>
                            </Checkbox>
                            <Checkbox
                              name="Thursday"
                              value="thursday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "thursday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Thursday" : "Thur"}
                              </span>
                            </Checkbox>
                            <Checkbox
                              name="Friday"
                              value="friday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "friday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Friday" : "Fri"}
                              </span>
                            </Checkbox>
                            <Checkbox
                              name="Saturday"
                              value="saturday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "saturday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Saturday" : "Sat"}
                              </span>
                            </Checkbox>
                            <Checkbox
                              name="Sunday"
                              value="sunday"
                              onChange={(e) =>
                                setLocalVideoSlots(
                                  e.target.checked,
                                  "sunday",
                                  1,
                                  slot?.slotsId
                                )
                              }
                            >
                              <span className="days">
                                {!isMobile ? "Sunday" : "Sun"}
                              </span>
                            </Checkbox>
                          </Checkbox.Group>
                        </Form.Item>
                      </Col>
                      <Col md={12} lg={12} className="">
                        {videoTimeSlots?.map((item, index1) => {
                          if (
                            item?.slotsId === slot?.slotsId &&
                            item?.clinicId === 1
                          ) {
                            return (
                              <>
                                <Row
                                  key={index1}
                                  className="duplicate_row_time"
                                >
                                  <Col
                                    xs={6}
                                    md={6}
                                    lg={6}
                                    className="selectBox"
                                  >
                                    <Form.Item
                                      name={`video_starttime${item?.timeSlotId}`}
                                      label="Start time*"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Start time is required",
                                        },
                                      ]}
                                    >
                                      <TimePicker
                                        className="custom-timepicker"
                                        format="HH:mm"
                                        onChange={(e) =>
                                          handleVideoStartTimeChange(
                                            e,
                                            item?.timeSlotId
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    xs={6}
                                    md={6}
                                    lg={6}
                                    className="selectBox"
                                  >
                                    <Form.Item
                                      name={`video_endtime${item?.timeSlotId}`}
                                      label="End time*"
                                      rules={[
                                        {
                                          required: true,
                                          message: "End time is required",
                                        },
                                        {
                                          validator: validateVideoEndTime(
                                            item?.timeSlotId
                                          ),
                                        },
                                      ]}
                                    >
                                      <TimePicker
                                        className="custom-timepicker"
                                        format="HH:mm"
                                        onChange={(e) =>
                                          handleVideoEndTimeChange(
                                            e,
                                            item?.timeSlotId
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </>
                            );
                          }
                        })}
                        {videoTimeSlots?.length > 1 && (
                          <Col lg={12} md={12} className="text-end mb-3">
                            <button className="last">
                              <img
                                src={deleteIcon}
                                alt="Delete"
                                onClick={(e) => {
                                  deleteVideoTimeSlot(e, slot?.slotsId, videoTimeSlots?.length)
                                  deleteVideoSlot(e, slot?.slotsId)
                                }}
                                className="img-fluid"
                              />
                            </button>
                          </Col>
                        )}
                        {isBrowser ? (
                          <Col md={12} lg={12} className="">
                            <div className="add_moretime text-end">

                              {/* <Button className="btn btn_add ms-auto" onClick={(e) => addVideoTimeSlot(e, 1, slot?.slotsId)}>
                                <img src={plusIcon} alt="Add" /> Add more time
                              </Button> */}
                              <Button className="btn btn_add ms-auto" onClick={(e) => addVideoSlot(e, 1)}>
                                <img src={plusIcon} alt="Add" /> Add more time
                              </Button>
                            </div>
                          </Col>
                        ) : null}
                        {isMobile ? (
                          <Col md={12} lg={12} className="d-flex">
                            <div className="add_moretime text-end">
                              {/* <Button className="btn btn_add ms-auto" onClick={(e) => addVideoTimeSlot(e, 1, slot?.slotsId)}>
                                <img src={plusIcon} alt="Add" /> Add time
                              </Button> */}
                              <Button className="btn btn_add ms-auto" onClick={(e) => addVideoSlot(e, 1)}>
                                <img src={plusIcon} alt="Add" /> Add time
                              </Button>
                            </div>
                          </Col>
                        ) : null}
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>
              {/* lklk */}
            </div>
          )}
        </Col>

        {/* After line 386, copy from random.js... */}
        <Col lg={12} md={12} className="checkbox_style consultation_checkbox">
          <Checkbox
            checked={videoClinicCheckbox}
            onChange={handleClinicCheckbox}
          >
            {" "}
            <span className="video">Clinic Visits</span>{" "}
            <span className="consult_p">
              Consult patients in-person at your clinic.{" "}
            </span>
          </Checkbox>

          {videoClinicCheckbox && (
            <div className="video_consult ">
              <Row className="">
                <Col
                  lg={12}
                  md={12}
                  className="checkbox_style consultation_checkbox"
                >
                  <div
                    className={
                      !isMobile ? "video_consult pt-5" : "video_consult"
                    }
                  >
                    <Row className="">
                      <Col md={12} lg={12} className="position-relative">
                        {clinicVisit?.map((row, index) => (
                          <Row key={row?.id} className="duplicate_row_days">
                            <Col md={6} lg={6} className="selectBox clinicB0x">
                              <Form.Item
                                name={`visit-clinic_id${row?.id}`}
                                label="Clinic/Hospital* "
                                rules={[
                                  {
                                    required: true,
                                    message: "Clinic/Hospital is required",
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .startsWith(input.toLowerCase())
                                  }
                                  onChange={(value) => {
                                    setHospital(value);
                                  }}
                                  placeholder="Please select"
                                >
                                  {clinics.map((option) => (
                                    <Option
                                      key={option?.value}
                                      value={option?.id}
                                    >
                                      {option?.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col md={6} lg={6} className="clinicLocation ">
                              <Form.Item
                                name={`visit-clinic_location${row?.id}`}
                                label="Location*"

                                rules={[
                                  // {
                                  //   required: true,
                                  //   message: "Location is required",
                                  // },
                                  { validator: validateLocationNumber }

                                ]}
                              >
                                <Input className={redField === true ? 'locationInput' : ''} placeholder="Enter location" />
                              </Form.Item>
                            </Col>
                            <Col md={6} lg={6} className="selectBox ">
                              <Form.Item
                                name={`visit-consultation_fee${row?.id}`}
                                label="Consultation fees*"
                                rules={[
                                  {
                                    required: true,
                                    message: "Consultation fees is required",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Enter fee"
                                  maxLength={5}
                                  onKeyDown={(evt) =>
                                    arrayWithoutNumber.includes(evt.key) &&
                                    evt.preventDefault()
                                  } />
                              </Form.Item>
                            </Col>
                            <Col md={6} lg={6} className="selectBox ">
                              <Form.Item
                                name={`visit-mins${row?.id}`}
                                label="Consultation duration in mins* "
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Consultation duration is required",
                                  },
                                ]}
                              >
                                <Select placeholder="Please select">
                                  {consultationMinutes?.length > 0 &&
                                    consultationMinutes?.map((item) => (
                                      <>
                                        <Option value={item?.id}>
                                          {item?.minutes} mins
                                        </Option>
                                      </>
                                    ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col lg={12}>
                              <div className="add_more position-relative r-1 mobile-r1">
                                <Button
                                  className="btn btn_add dd"
                                  onClick={addAnotherClinic}
                                >
                                  + Add more consulting clinic
                                </Button>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="add_more position-relative r-1 ">
                                <Button
                                  className="btn btn_add ms-auto  "
                                  onClick={(e) => addClinicSlot(e, row?.id)}
                                >
                                  + Add more slots
                                </Button>
                              </div>
                            </Col>

                            {clinicSlots?.map((slot, idx) => {
                              if (slot?.clinicId == row?.id) {
                                return (
                                  <>
                                    <Col md={12} lg={12} className="">
                                      <Form.Item
                                        name={`visit-day${slot?.slotsId}`}
                                        label="Consultation days "
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "At least one consultation day is required",
                                            type: "array",
                                          },
                                        ]}
                                      >
                                        <Checkbox.Group className="checkbox_blue">
                                          <Checkbox
                                            name="Monday"
                                            value="monday"
                                            onChange={(e) =>
                                              setLocalClinicSlots(
                                                e.target.checked,
                                                "monday",
                                                row?.id,
                                                slot?.slotsId
                                              )
                                            }
                                          >
                                            <span className="days">
                                              {!isMobile ? "Monday" : "Mon"}
                                            </span>
                                          </Checkbox>
                                          <Checkbox
                                            name="Tuesday"
                                            value="tuesday"
                                            onChange={(e) =>
                                              setLocalClinicSlots(
                                                e.target.checked,
                                                "tuesday",
                                                row?.id,
                                                slot?.slotsId
                                              )
                                            }
                                          >
                                            <span className="days">
                                              {!isMobile ? "Tuesday" : "Tue"}
                                            </span>
                                          </Checkbox>
                                          <Checkbox
                                            name="Wednesday"
                                            value="wednesday"
                                            onChange={(e) =>
                                              setLocalClinicSlots(
                                                e.target.checked,
                                                "wednesday",
                                                row?.id,
                                                slot?.slotsId
                                              )
                                            }
                                          >
                                            <span className="days">
                                              {!isMobile ? "Wednesday" : "Wed"}
                                            </span>
                                          </Checkbox>
                                          <Checkbox
                                            name="Thursday"
                                            value="thursday"
                                            onChange={(e) =>
                                              setLocalClinicSlots(
                                                e.target.checked,
                                                "thursday",
                                                row?.id,
                                                slot?.slotsId
                                              )
                                            }
                                          >
                                            <span className="days">
                                              {!isMobile ? "Thursday" : "Thur"}
                                            </span>
                                          </Checkbox>
                                          <Checkbox
                                            name="Friday"
                                            value="friday"
                                            onChange={(e) =>
                                              setLocalClinicSlots(
                                                e.target.checked,
                                                "friday",
                                                row?.id,
                                                slot?.slotsId
                                              )
                                            }
                                          >
                                            <span className="days">
                                              {!isMobile ? "Friday" : "Fri"}
                                            </span>
                                          </Checkbox>
                                        </Checkbox.Group>
                                      </Form.Item>
                                    </Col>

                                    <Col
                                      md={12}
                                      lg={12}
                                      className="position-relative"
                                    >
                                      {clinicTimeSlots?.map(
                                        (timeSlot, timeSlotIndex) => {
                                          if (
                                            timeSlot?.slotsId ===
                                            slot?.slotsId &&
                                            timeSlot?.clinicId === row?.id
                                          ) {
                                            return (
                                              <>
                                                <Row
                                                  key={row?.id}
                                                  className="duplicate_row_time"
                                                >
                                                  <Col
                                                    xs={6}
                                                    md={6}
                                                    lg={6}
                                                    className="selectBox"
                                                  >
                                                    <Form.Item
                                                      name={`visit-start_time${timeSlot?.timeSlotId}`}
                                                      label="Start time "
                                                      rules={[
                                                        {
                                                          required: false,
                                                          message:
                                                            "Start time is required",
                                                        },
                                                      ]}
                                                    >
                                                      <TimePicker
                                                        className="custom-timepicker"
                                                        format="HH:mm"
                                                        onChange={(e) =>
                                                          handleClinicStartTimeChange(
                                                            e,
                                                            timeSlot?.timeSlotId
                                                          )
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col
                                                    xs={6}
                                                    md={6}
                                                    lg={6}
                                                    className="selectBox"
                                                  >
                                                    <Form.Item
                                                      name={`visit-end_time${timeSlot?.timeSlotId}`}
                                                      label="End time "
                                                      rules={[
                                                        {
                                                          required: false,
                                                          message:
                                                            "End time is required",
                                                        },
                                                        {
                                                          validator:
                                                            validateClinicEndTime(
                                                              timeSlot?.timeSlotId
                                                            ),
                                                        },
                                                      ]}
                                                    >
                                                      <TimePicker
                                                        className="custom-timepicker"
                                                        format="HH:mm"
                                                        onChange={(e) =>
                                                          handleClinicEndTimeChange(
                                                            e,
                                                            timeSlot?.timeSlotId
                                                          )
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                </Row>

                                                {/* <button type="button" className="last">
                                                  <img
                                                    src={deleteIcon}
                                                    onClick={(e) =>
                                                      deleteClinicTimeSlot(e, slot?.slotsId, timeSlot?.timeSlotId)
                                                    }
                                                    alt="Delete"
                                                    className="img-fluid"
                                                  />
                                                </button> */}

                                              </>
                                            );
                                          }
                                        }
                                      )}
                                      <div className="add_more r-p2 justify-content-start">
                                        <Button type="primary" className="btn btn_add  t-nt" onClick={(e) => {
                                          addClinicTimeSlot(e, row?.id, slot?.slotsId)
                                          addClinicSlot(e, row?.id)
                                        }}>
                                          <img src={plusIcon} alt="Add" /> Add time
                                        </Button>
                                      </div>
                                      <Col lg={12} md={12} className="text-end">
                                        <Row>
                                          <Col
                                            lg={9}
                                            md={9}
                                            className="mx-auto"
                                          >
                                            {/* <hr /> */}
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Col>
                                    <button type="button" className="last"
                                      onClick={(e) => {
                                        deleteClinicTimeSlot(e, row?.id, slot?.slotsId, clinicTimeSlots?.length)
                                        deleteClinicSlot(e, slot?.slotsId)
                                      }
                                      }
                                    >
                                      <img
                                        src={deleteIcon}

                                        alt="Delete"
                                        className="img-fluid"
                                      />
                                      ddd
                                    </button>

                                    <Col lg={12} md={12} className="text-end">
                                      <Row>
                                        <Col lg={9} md={9} className="mx-auto">
                                          <hr />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </>
                                );
                              }
                            })}
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </StyledVideoConsultation>
  );
}

export const StyledVideoConsultation = styled.section`
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .clinicBox .ant-select-selection-search input#visit-clinic_id1 {
    margin-top: 8px;
  }

  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .locationInput {
    color: #ff4d4f !important;
  }
  
`;

export default VideoConsultation;
