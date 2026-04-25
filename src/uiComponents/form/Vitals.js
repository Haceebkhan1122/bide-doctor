import React, { useEffect, useMemo, useState, useRef } from "react";
import { Select, InputNumber, Form, Input, Button } from "antd";
import { Col, Row } from "react-bootstrap";
import arrowdropdown from "../../assets/images/svg/dropdown-icon.svg";


function Vitals({ patientData, onSubmit, vitalsForm, vitalsData, setVitalsData,setDisableButton,disableButton,editedVitals }) {

  useEffect(() => {
    if (patientData) {
      vitalsForm.setFieldsValue(patientData);
    }
  }, [patientData, vitalsForm]);

  const onFinish = (values) => {
    console.log('Form values submitted:', values);
    setVitalsData(values); 
    onSubmit(values); 
  };

    return (
        <div className="p-40">
            <Form
                className="personalHistoryForm vitals"
                form={vitalsForm}
                onFinish={onFinish}
                onValuesChange={() => setDisableButton(false)}
            >
                <Row>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Blood Pressure (Diastolic)</p>
                        <Form.Item
                            name="blood_pressure_diastolic"
                            initialValue={editedVitals?.blood_pressure_diastolic ? editedVitals?.blood_pressure_diastolic :  patientData?.blood_pressure_diastolic || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Height</p>
                        <Form.Item
                            name="height"
                            // initialValue={patientData?.height || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>


                    </Col>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Heart Rate</p>
                        <Form.Item
                            name="heart_rate"
                            // initialValue={patientData?.heart_rate || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Blood Pressure (Systolic)</p>
                        <Form.Item
                            name="blood_pressure_systolic"
                            // initialValue={patientData?.blood_pressure_systolic || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">BMI</p>
                        <Form.Item
                            name="bmi"
                            // initialValue={patientData?.bmi || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Temperature</p>
                        <Form.Item
                            name="temperature"
                            // initialValue={patientData?.temperature || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Glucometer Result</p>
                        <Form.Item
                            name="glucometer_result"
                            // initialValue={patientData?.glucometer_result || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                    <Col md={3} lg={3}>
                        <p className="labelText1 fs-14 ps-0">Weight</p>
                        <Form.Item
                            name="weight"
                            // initialValue={patientData?.weight || ''}
                            rules={[{ required: false }]}
                        >
                            <Input
                                className="form-control form002 newSelect"
                                placeholder="Enter"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col md={9} lg={9}></Col>
                    <Col md={3} lg={3}>
                        <Button disabled={disableButton} className="submitVitalsButton" htmlType="submit" onClick={onSubmit} type="primary">
                            Submit
                        </Button>
                    </Col>
                </Row>

            </Form>
        </div>
    )
}

export default Vitals