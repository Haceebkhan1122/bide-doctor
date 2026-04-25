import { Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Tab } from "react-bootstrap";
import { HiOutlineArrowDown } from "react-icons/hi";
import patient_img from "../../assets/images/png/patient_img.png";
import { SimpleButton, SimpleButtonSmall } from "../../uiComponents/button";
import MedCancelCard from "../../uiComponents/card/medCancelCard/MedCancelCard";
import {
  HeadingDescVsmall,
  HeadingWithSpaceLarge,
} from "../../uiComponents/Headings";
import StickyTab from "../../uiComponents/stickyTab/StickyTab";
import { TableComponent } from "../../uiComponents/tableComponent";
import editIConGreen from "../../assets/images/svg/edit_icon_green.svg";
import deleteIconPink from "../../assets/images/svg/delete_icon_pink.svg";
import { FiArrowRightCircle } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectDiseases } from "./redux/slice";
import { getDiseases } from "./redux/thunk";
import "./Appointments.scss";
import { isEmpty } from "../../helpers/objectHelper";

function AppointmentFollowUp() {
  const dispatch = useAppDispatch();
  const conditions = useAppSelector(selectDiseases);

  const [note, setNote] = useState("");
  const [gnote, setGNote] = useState("");
  const [med, setMed] = useState([]);
  const { Option } = Select;
  const { TextArea } = Input;

  const menuList = [
    {
      link: "#medical_history",
      name: "Medical History",
    },
    {
      link: "#medical_record",
      name: "Medical Records",
    },
    {
      link: "#vitals",
      name: "Vitals & Notes",
    },
    {
      link: "#prescription",
      name: "Previous Consultation",
    },
    {
      link: "#prescribe_med",
      name: "Prescribe Medicines",
    },
    {
      link: "#prescribe_lab",
      name: "Prescribe Lab Tests",
    },
  ];

  const medical_record_table = {
    header: [
      { title: "Tests Taken on", dataIndex: "test_date" },
      { title: "Total Reports", dataIndex: "reports" },
      {
        title: "",
        dataIndex: "buttons",
        render: () => (
          <a className="flex_start">
            <FiArrowRightCircle className="arrow_black" />
            <h6 className="view_anchor">VIEW</h6>
          </a>
        ),
      },
    ],
    data: [
      {
        key: "1",
        test_date: "Mar 01, 2022",
        reports: "3 Reports, 1 Prescription",
      },
    ],
  };
  const vital_table = {
    header: [
      { title: "Heart Rate", dataIndex: "heart_rate" },
      { title: "Breathing Rate", dataIndex: "breathing_rate" },
      { title: "Heart Rate", dataIndex: "heart_rate" },
      { title: "Breathing Rate", dataIndex: "breathing_rate" },
      { title: "Heart Rate", dataIndex: "heart_rate" },
      { title: "Breathing Rate", dataIndex: "breathing_rate" },
    ],
    data: [
      {
        key: "1",
        heart_rate: "40",
        breathing_rate: "38",
        heart_rate: "40",
        breathing_rate: "38",
        heart_rate: "40",
        breathing_rate: "38",
      },
    ],
  };
  const conslt_table = {
    header: [
      { title: "Date & Time", dataIndex: "date_time" },
      { title: "Symptoms or general notes for patient", dataIndex: "symptoms" },
      { title: "Medicines", dataIndex: "medicines" },
      { title: "Lab Test", dataIndex: "lab_test" },
    ],
    data: [
      {
        key: "1",
        date_time: "Mar 01, 2022 11:30 am",
        symptoms:
          "Based on your results, you can consult with one of our top rated doctors",
        medicines:
          "Tramal 100 mg, 3 Days, Thrice a Day After Meal \nTramal 100 mg, 3 Days, Thrice a Day After Meal",
        lab_test: "HbA1C (Glycosylated Hemoglobin) Glycosylated HemoglobiN",
      },
      {
        key: "2",
        date_time: "Mar 01, 2022 11:30 am",
        symptoms:
          "Based on your results, you can consult with one of our top rated doctors",
        medicines:
          "Tramal 100 mg, 3 Days, Thrice a Day After Meal \nTramal 100 mg, 3 Days, Thrice a Day After Meal",
        lab_test: "HbA1C (Glycosylated Hemoglobin) Glycosylated HemoglobiN",
      },
    ],
  };
  const prescribe_med_table = {
    header: [
      { title: "Medicine", dataIndex: "medicine" },
      { title: "Dosage", dataIndex: "dosage" },
      { title: "Frequency", dataIndex: "frequency" },
      { title: "Duration", dataIndex: "duration" },
      { title: "Instruction", dataIndex: "instruction" },
      {
        title: "",
        dataIndex: "buttons",
        render: () => (
          <div className="flex_start">
            <a>
              <img src={editIConGreen} alt="edit"></img>
            </a>
            <a>
              <img src={deleteIconPink} alt="delete"></img>
            </a>
          </div>
        ),
      },
    ],
    data: [
      {
        key: "1",
        medicine: "Tramal",
        dosage: "100mg",
        frequency: "Thrice a day",
        duration: "3 Day(s)",
        instruction: "After Meal",
        // buttons: "",
      },
    ],
  };
  const prescribe_lab_table = {
    header: [
      { title: "Lab Test", dataIndex: "lab_test" },
      {
        title: "",
        dataIndex: "buttons",
        render: () => (
          <div className="flex_start">
            <a>
              <img src={editIConGreen} alt="edit"></img>
            </a>
            <a>
              <img src={deleteIconPink} alt="delete"></img>
            </a>
          </div>
        ),
      },
    ],
    data: [
      {
        key: "1",
        lab_test: "HbA1C (Glycosylated Hemoglobin)",
        // buttons: "",
      },
    ],
  };

  const handleOnChange = (value, event) => {
    // console.log(value);
    setMed([
      ...med,
      <MedCancelCard text={value} id={med.length} cancel={true} />,
    ]);
  };

  useEffect(() => {
    dispatch(getDiseases());
  }, []);

  // console.log(conditions);

  return (
    <div className="appointment_first cover_space">
      <Container>
        <Row>
          <Col md={8}>
            <div className="video_div">
              <img src={patient_img} alt="patient_img" className="img_vid" />
            </div>
          </Col>
          <Col md={4}>
            <div className="white_color_div">
              <HeadingWithSpaceLarge text="PATIENT INFORMATION" />
              <div className="column_flex">
                <HeadingDescVsmall text="Patient Name" />
                <HeadingDescVsmall text="Mir Muslim Hyder Kashif" />
              </div>
              <div className="flex_center">
                <div className="column_flex">
                  <HeadingDescVsmall text="Age" />
                  <HeadingDescVsmall text="37 years" />
                </div>
                <div className="column_flex">
                  <HeadingDescVsmall text="Gender" />
                  <HeadingDescVsmall text="Female" />
                </div>
              </div>
              <div className="column_flex">
                <HeadingDescVsmall text="Reason for Visiting" />
                <HeadingDescVsmall text="Regular Checkup" />
              </div>
              <div className="patient_status follow_up">
                <HeadingDescVsmall text="Follow Up Appointment" />
              </div>
              <div className="column_flex">
                <HeadingDescVsmall text="Consultation Time Left" />
                <h3>01:15</h3>
              </div>
            </div>
          </Col>
        </Row>
        <StickyTab menuList={menuList} type="a" />
        <Row>
          <div className="tab_data cover_space3" id="medical_history">
            <div className="white_color_div">
              <div className="gap_div">
                <HeadingWithSpaceLarge text="MEDICAL HISTORY" />
                <div className="appointment_div_data">
                  <Row>
                    <Col md={4}>
                      <div className="column_flex">
                        <div className="column_flex2">
                          <p className="labelText">Blood Group</p>
                          <Select dropdownAlign={{ offset: [0, 4] }}
                            suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                            className="c_select"
                          >
                            <Option value="a+">A+</Option>
                            <Option value="a-">A-</Option>
                            <Option value="b+">B+</Option>
                            <Option value="b-">B-</Option>
                            <Option value="o+">O+</Option>
                            <Option value="o-">O-</Option>
                          </Select>
                        </div>

                        <div className="column_flex2">
                          <p className="labelText">Add Existing Condition</p>
                          {isEmpty(conditions) === false ? (
                            <div>
                              <Select dropdownAlign={{ offset: [0, 4] }}
                                suffixIcon={
                                  <HiOutlineArrowDown color="#29BCC1" />
                                }
                                className="c_select"
                                onSelect={(value, event) =>
                                  handleOnChange(value, event)
                                }
                              >
                                {conditions.data.map((dis) => (
                                  <Option value={dis}>{dis}</Option>
                                ))}
                              </Select>
                            </div>
                          ) : (
                            <Select dropdownAlign={{ offset: [0, 4] }}
                              suffixIcon={
                                <HiOutlineArrowDown color="#29BCC1" />
                              }
                              className="c_select"
                              onSelect={(value, event) =>
                                handleOnChange(value, event)
                              }
                            >
                              <Option value="Asthma">Asthma</Option>
                            </Select>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col md={8}>
                      <p className="labelText">Notes</p>
                      <TextArea
                        onChange={(e) => this.setNote({ note: e.target.value })}
                        rows={6}
                        className="c_input"
                      />
                    </Col>
                  </Row>
                  <Row>{med}</Row>
                </div>
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="medical_record">
            <div className="white_color_div">
              <div className="gap_div">
                <HeadingWithSpaceLarge text="MEDICAL RECORDS" />
              </div>
              <div className="appointment_div_data">
                <TableComponent
                  table_data={medical_record_table}
                  pagination={false}
                />
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="vitals">
            <div className="white_color_div">
              <div className="gap_div">
                <HeadingWithSpaceLarge text="VITALS" />
              </div>
              <div className="appointment_div_data">
                <TableComponent table_data={vital_table} pagination={false} />
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="prescription">
            <div className="white_color_div">
              <div className="gap_div">
                <HeadingWithSpaceLarge text="PREVIOUS CONSULTATION" />
              </div>
              <div className="appointment_div_data">
                <TableComponent
                  table_data={conslt_table}
                  pagination={false}
                  pre="pre"
                />
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="general_notes">
            <div className="white_color_div">
              <div className="gap_div">
                <HeadingWithSpaceLarge text="GENERAL NOTES FOR PATIENT" />
                <div className="appointment_div_data">
                  <p className="labelText">
                    Add Symptoms or general notes for patient
                  </p>
                  <TextArea
                    onChange={(e) => this.setGNote({ gnote: e.target.value })}
                    rows={4}
                    className="c_input"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="prescribe_med">
            <div className="white_color_div">
              <div className="gap_div">
                <div className="flex_center justify_between">
                  <HeadingWithSpaceLarge text="PRESCRIBE MEDICINES" />
                  <a>
                    <HeadingDescVsmall text="COPY LAST PRESCRIPTION" />
                  </a>
                </div>
              </div>
              <div className="appointment_div_data">
                <TableComponent
                  table_data={prescribe_med_table}
                  pagination={false}
                />
                <div className="gap_div">
                  <Row>
                    <Col md={4}>
                      <p className="labelText fs-14">Choose Medicine*</p>
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        <Option value="tramal">Tramal</Option>
                        <Option value="tramal">Tramal</Option>
                        <Option value="tramal">Tramal</Option>
                        <Option value="tramal">Tramal</Option>
                      </Select>
                    </Col>
                    <Col md={4}>
                      <p className="labelText fs-14">Duration*</p>
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        <Option value="1day">1 Day(s)</Option>
                        <Option value="2days">2 Day(s)</Option>
                        <Option value="3days">3 Day(s)</Option>
                      </Select>
                    </Col>
                    <Col md={4}>
                      <p className="labelText fs-14">Dosage*</p>
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        <Option value="100mg">100mg</Option>
                        <Option value="200mg">200mg</Option>
                        <Option value="400mg">400mg</Option>
                        <Option value="500mg">500mg</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p className="labelText fs-14">Instruction</p>
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        <Option value="before">Before Meal</Option>
                        <Option value="after">After Meal</Option>
                      </Select>
                    </Col>

                    <Col md={4}>
                      <p className="labelText fs-14">Frequency*</p>
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        <Option value="once">Once a day</Option>
                        <Option value="twice">Twice a day</Option>
                        <Option value="thrice">Thrice a day</Option>
                      </Select>
                    </Col>
                    <Col md={4}>
                      <div className="flex_end">
                        {/* <button>ADD</button> */}
                        <SimpleButtonSmall text="ADD" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
          <div className="tab_data cover_space3" id="prescribe_lab">
            <div className="white_color_div">
              <div className="gap_div">
                <HeadingWithSpaceLarge text="PRESCRIBE LAB TESTS" />
              </div>
              <div className="appointment_div_data">
                <TableComponent
                  table_data={prescribe_lab_table}
                  pagination={false}
                />
                <div className="gap_div">
                  <Row>
                    <Col md={11}>
                      <p className="labelText">Prescribe Labs</p>
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        <Option value="tramal">Tramal</Option>
                        <Option value="tramal">Tramal</Option>
                        <Option value="tramal">Tramal</Option>
                        <Option value="tramal">Tramal</Option>
                      </Select>
                    </Col>
                    <Col md={1}>
                      <div className="flex_end">
                        <SimpleButtonSmall text="ADD" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
      <div className="bottom_btn">
        <SimpleButton text="MARK COMPLETE" />
      </div>
    </div>
  );
}

export default AppointmentFollowUp;
