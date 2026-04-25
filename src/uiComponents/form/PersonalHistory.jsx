import React, { useEffect, useState } from "react";
import { Select, InputNumber, Form, Input, Radio } from "antd";
import { Col, Row } from "react-bootstrap";
import "./personalhistory.css";
import arrowdropdown from "../../assets/images/svg/dropdown-icon.svg";
import instance from "../../utils/httpService";
const PersonalHistory = ({ lifeStyleOccupationList, patientData, patientDataAll }) => {

    return (
        <div className="p-24 mainLabelClass">
            <Form
                className="personalHistoryForm"
            >
                <Row>
                    <Col lg={12}>
                        <Row className="spacing_grid">
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Marital Status</p>
                                <Form.Item
                                    name="status"
                                    rules={[{ required: true, message: "Required Medicine" }]}
                                >
                                    <Select
                                        defaultValue={patientData?.marital_status !== null ? patientData?.marital_status : ''}
                                        dropdownAlign={{ offset: [0, 4] }}
                                        style={{ cursor: "pointer" }}
                                        className="form-control form001 newSelect kh-borderfix"
                                        suffixIcon={<img src={arrowdropdown} alt />}
                                        disabled
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Occupation</p>
                                <Form.Item
                                    name="Occupation"
                                    rules={[{ required: false, }]}
                                >
                                    <Input
                                        defaultValue={
                                            lifeStyleOccupationList?.occupations?.find(occupation => occupation.id === patientData?.occupation)?.name

                                        }
                                        className="form-control form002 newSelect"
                                        readOnly />
                                </Form.Item>

                            </Col>
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Life Style</p>
                                {/* <div className="borderBox1 radioBox"> */}
                                <Input
                                    defaultValue={
                                        lifeStyleOccupationList?.lifestyles?.find(occupation => occupation.id === patientData?.lifestyle)?.name

                                    }
                                    className="form-control form002 newSelect"
                                    readOnly />
                                {/* <Radio.Group defaultValue={patientData?.lifestyle} disabled>
                                        <Radio value="Drinker">Drinking</Radio>
                                        <Radio value="Smoker">Smoking</Radio>
                                    </Radio.Group> */}
                                {/* </div> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Row className="spacing_grid">
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Is patient’s father diabetic?</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.father_diabetic}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="fatherdiabetic"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.father_diabetic_text !== null ? patientData?.father_diabetic_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>
                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Col>
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Is patient’s mother diabetic?</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing" >

                                            <Radio.Group disabled defaultValue={`${patientData?.mother_diabetic}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="motherdiabetic"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.mother_diabetic_text !== null ? patientData?.mother_diabetic_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Is patient’s spouse diabetic?</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.spouse_diabetic}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="spousediabetic"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.spouse_diabetic_text !== null ? patientData?.spouse_diabetic_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>


                            {patientDataAll?.patient_info?.gender == "Female" && <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Abortion</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.abortion}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="abortion"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.abortiont_ext !== null ? patientData?.abortiont_ext : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Row className="spacing_grid">
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Is patient’s brother diabetic?</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.brother_diabetic}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="brotherdiabetic"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.brother_diabetic_text !== null ? patientData?.brother_diabetic_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Col>
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Is patient’s sister diabetic?</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing" >

                                            <Radio.Group disabled defaultValue={`${patientData?.sister_diabetic}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="sisterdiabetic"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.sister_diabetic_text !== null ? patientData?.sister_diabetic_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Are patient’s children diabetic ?</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.children_diabetic}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="childrendiabetic"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.children_diabetic_text !== null ? patientData?.children_diabetic_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>


                            {patientDataAll?.patient_info?.gender == "Female" && <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Neonatal Deaths</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.neonatal_deaths}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="neonataldeaths"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.neonatal_deaths_text !== null ? patientData?.neonatal_deaths_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Row className="spacing_grid">
                            {patientDataAll?.patient_info?.gender == "Female" && <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Live Birth</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing">

                                            <Radio.Group disabled defaultValue={`${patientData?.live_birth}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="livebirth"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.live_birth_text !== null ? patientData?.live_birth_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Col>}
                            {patientDataAll?.patient_info?.gender == "Female" && <Col md={3} lg={3}>
                                <p className="labelText1 fs-14 ps-0">Still Birth</p>
                                <Row>
                                    <Col lg={6} className="pe-0">

                                        <div className="borderBox2 radioBox newSpacing" >

                                            <Radio.Group disabled defaultValue={`${patientData?.still_birth}`}>
                                                <Radio value="1">Yes</Radio>
                                                <Radio value="0">No</Radio>
                                            </Radio.Group>

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Item
                                            name="stillbirth"
                                            rules={[{ required: false, }]}
                                        >
                                            <InputNumber defaultValue={patientData?.still_birth_text !== null ? patientData?.still_birth_text : ''} className="form-control form002 newSelect" readOnly></InputNumber>

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>}

                        </Row>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default PersonalHistory