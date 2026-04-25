import React, { useState, useRef, useEffect } from "react";

import "./../Steps.scss";
import { Button, Form, Input, Select, Radio, Space, Checkbox } from "antd";
import { Row, Col, Container } from "react-bootstrap";
import deleteIcon from "../../../../assets/images/png/delete_icon.png";
import API from "../../../../utils/customAxios";
import { isBrowser, isMobile } from "react-device-detect";

const { Option } = Select;

let index = 0;
function Experiance(props) {
  const {
    experienceRowCount,
    duplicateExperienceRow,
    deleteExperienceRow,
    rowCertificate,
    duplicateRowCertificate,
    deleteRowCertificate,
    form,
    isCurrentlyWorking,
    setIsCurrentlyWorking,
    experienceForm
  } = props;

  const [designations, setDesignations] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [certifications, setCertifications] = useState([]);


  const inputRef = useRef(null);

  useEffect(() => {
    API.get("/doctor/designation").then((res) => {
      if (res?.data?.code === 200) {
        setDesignations(res?.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    API.get("/doctor/institute").then((res) => {
      if (res?.data?.code === 200) {
        setInstitutes(res?.data?.data);
      }
    });
  }, []);

  useEffect(() => {
    API.get("/doctor/certifications").then((res) => {
      if (res?.data?.code === 200) {
        setCertifications(res?.data?.data);
      }
    });
  }, []);

  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString());
  }

  const validateStartEndYear = (_, value, callback) => {
    const startYear = value;
    const endYear = experienceForm.getFieldValue(`endyear${index + 1}`);

    if (startYear && endYear && startYear > endYear) {
      callback('Start year cannot be later than end year');
    } else {
      callback();
    }
  };



  async function currentlyWorkingHandler(e, id) {
    try {
      await form?.setFieldsValue({
        [`endyear${id+1}`]: ''
      });
  
      const updatedEndYearEmpty = [...isCurrentlyWorking];
      updatedEndYearEmpty[id] = e.target.checked;
      setIsCurrentlyWorking(updatedEndYearEmpty);
    } catch (error) {
      
    }

    

    // setIsCurrentlyWorking(!isCurrentlyWorking);
  }

  return (
    <>
      {!isMobile && (
        <Row className="mt-7">
          <Col lg={12} md={12} className="text-end">
            <Button className="add-btn btn" onClick={duplicateExperienceRow}>
              + Add More
            </Button>
          </Col>
        </Row>
      )}

      {Array.from({ length: experienceRowCount }).map((_, index) => (
        <Row key={index} className="duplicate_row">
          {index === 0 ? (
            /* Render content for the first row */
            <>{/* Your content for the first row */}</>
          ) : (
            /* Render content for other rows */
            <Col lg={12} md={12} className="text-end">
              <Row>
                <Col lg={9} className="mx-auto">
                  <hr />
                </Col>
              </Row>

              <button>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={deleteExperienceRow}
                  className="img-fluid delete"
                />
              </button>
            </Col>
          )}

          <Col lg={6} md={6} className="selectBox ">
            <Form.Item
              name={`designation${index + 1}`}
              label="Designation*"
              rules={[
                {
                  required: true,
                  message: "Designation is required",
                },
              ]}
            >
              <Select placeholder="Please select">
                {designations?.map((item, index) => (
                  <Option key={index} value={item?.id}>
                    {" "}
                    {item?.name}{" "}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={6} md={6} className="selectBox instituteBox">
            <Form.Item
              name={`institute${index + 1}`}
              label="Institute* "
              rules={[
                {
                  required: true,
                  message: "Institute is required",
                },
              ]}
            >
              <Select placeholder="Please select"
                showSearch
                filterOption={(input, option) =>
                  option.children?.[1]?.toLowerCase().startsWith(input.toLowerCase())
                }
              >
                {institutes?.map((item, index) => (
                  <Option key={index} value={item?.id}>
                    {" "}
                    {item?.name}{" "}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={6} lg={6} md={6} className="selectBox mob-space">
            <Form.Item
              name={`startyear${index + 1}`}
              label="Start year*"
              rules={[
                {
                  required: true,
                  message: 'Start year is required',
                },
                {
                  validator: validateStartEndYear,
                },
              ]}
            >
              <Select placeholder="Please select">
                {years?.length > 0 && years?.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={6} lg={6} md={6} className="selectBox mob-space">
            <Form.Item
              name={`endyear${index + 1}`}
              label="End year"
              rules={[
                {
                  required: false,
                  message: "End Year  is required",
                },
              ]}
            >
              <Select placeholder="Please select" disabled={isCurrentlyWorking[index]}>
                {years?.length > 0 && years?.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={6} md={6} className="checkbox_style ms-auto text-end">
            
              <Checkbox 
              onChange={(e) => currentlyWorkingHandler(e, index)} 
              checked={isCurrentlyWorking[index]}
              >
                Currently working here
              </Checkbox>
            
            
          </Col>
        </Row>
      ))}
      {isMobile ? (
        <Row className="mt-7">
        <Col lg={12} md={12} className="text-end pos_mobile">
          <Button className="add-btn btn" onClick={duplicateExperienceRow}>
            + Add More
          </Button>
        </Col>
      </Row>
      ) : null } 
      {isBrowser ? 
      (<Row className="mt-7">
      <Col lg={12} md={12} className="text-end pos_mobile">
        <Button className="add-btn btn" onClick={duplicateRowCertificate}>
          + Add More
        </Button>
      </Col>
    </Row>) : null}
      
      {Array.from({ length: rowCertificate }).map((_, indexx) => (
        <Row key={indexx} className="duplicate_row">
          {indexx === 0 ? (
            /* Render content for the first row */
            <>{/* Your content for the first row */}</>
          ) : (
            /* Render content for other rows */
            <Col lg={12} md={12} className="text-end mob_pos">
              <Row>
                <Col lg={9} className="mx-auto">
                  <hr />
                </Col>
              </Row>
              <button>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={deleteRowCertificate}
                  className="img-fluid delete dd"
                />
              </button>
            </Col>
          )}

          <Col lg={12} md={12} className="selectBox ">
            <Form.Item
              name={`membershipcertificate${indexx + 1}`}
              label="Professional Membership / Certification"
              rules={[
                {
                  required: false,
                  message: "Certification is required",
                },
              ]}
            >
              <Select placeholder="Please select">
                {certifications?.map((item, index) => (
                  <Option key={index} value={item?.id}>
                    {" "}
                    {item?.name}{" "}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ))}
      {isMobile && (
        <Row className="">
          <Col lg={12} md={12} className="text-start">
            <Button className="add-btn btn" onClick={duplicateRowCertificate}>
              + Add More
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
}

export default Experiance;
