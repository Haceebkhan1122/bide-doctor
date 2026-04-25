import React, { useMemo, useState } from "react";
import infoIcon from "../../../../assets/images/png/info.png";
import "./../Steps.scss";
import { Button, Form, Input, Select, Radio, Space } from "antd";
import { Row, Col, Container } from "react-bootstrap";
import { Popover } from "antd";
import { Label } from "evergreen-ui";

function BankDetail(props) {
    //   const [requiredIban, setrequiredIban] = useState("");
    const [regexIban, setRegexIban] = useState("");

    const content = (
        <div>
            <p className="info"> CNIC of the account holder</p>
        </div>
    );

    const accountTitleRegex = /^[A-Za-z\s]+$/;
    const cnicNumberRegex = /^[0-9]+$/;

    // const validateIBANNumber = (_, value) => {
    //     const alphabeticRegex = /[a-zA-Z]/;
    //     const numericRegex = /^[0-9]+$/;

    //     const hasAlphabetic = alphabeticRegex.test(value);
    //     const hasNumeric = numericRegex.test(value);

    //     if (!hasNumeric) {
    //         return Promise.reject('IBAN number should be alphanumeric');
    //     }

    //     return Promise.resolve();
    // };

    // const validateIBANNumber = (_, value) => {
    //     const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    //     const isAlphanumeric = alphanumericRegex.test(value);
    //     if(value === ''){
    //         console.log('erro')
    //     }
    //     else if (!isAlphanumeric) {
    //         // return Promise.reject('IBAN number should be alphanumeric');
    //         setRegexIban("IBAN number should be alphanumeric")
    //     }
    //     else {
    //         return Promise.resolve();
    //     }
    // };

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

    return (
        <>
            <Row>
                <Col lg={12} md={12}>
                    <div className="infoBox">
                        <img src={infoIcon} className="img-fluid" alt="info"></img>
                        <p>Please enter your bank details for seamless payouts. Meri Sehat takes the security of your information very seriously and will never share or disclose it to any third parties without your consent. For help or queries, contact our customer support at (021)-111-111-111</p>
                    </div>
                </Col>
                <Col lg={6} md={6}>
                    <Form.Item
                        name="accountTitle"
                        label="Account title"
                        rules={[
                            {
                                required: false,
                                message: 'Account title is required'
                            },
                            {
                                pattern: accountTitleRegex,
                                message: 'Account title should only contain alphabetic characters.',
                            },
                        ]}
                    >
                        <Input maxLength={30} placeholder="Enter account title" />
                    </Form.Item>
                </Col>
                <Col lg={6} md={6}>
                    <Form.Item
                        name="ibanNumber"
                        label="Account / IBAN number*"
                        rules={[
                            {
                                required: true,
                                message: 'IBAN number is required'
                            },
                            // { validator: validateIBANNumber },
                            {
                                pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
                                message: 'IBAN number should be alphanumeric.',
                            },
                            // { max: 24, message: 'IBAN number cannot exceed 24 characters' },
                        ]}
                    >
                        <Input
                            maxLength="24"
                            placeholder="Enter IBAN number"
                        />
                    </Form.Item>
                </Col>
                <Col lg={6} md={6}>
                    <Form.Item
                        name="bankName"
                        label="Bank name* "
                        rules={[
                            {
                                required: true,
                                message: 'Bank name is required'
                            },
                            {
                                pattern: accountTitleRegex,
                                message: 'Bank name should only contain alphabetic characters.',
                            },
                        ]}
                    >
                        <Input placeholder="Enter bank name" />
                    </Form.Item>
                </Col>
                <Col lg={6} md={6} className="condition_box ">
                    <Form.Item
                        name="cnic"
                        rules={[
                            {
                                required: true,
                                message: 'CNIC number is required'
                            },
                            {
                                pattern: cnicNumberRegex,
                                message: 'CNIC number should only in numbers',
                            },
                            { min: 13, message: 'CNIC must be atleast 13 digits' },
                        ]}
                        label={
                            <Label>CNIC* <div className="popover_box1">
                                <Popover content={content} placement="topLeft" overlayClassName="popover_box">
                                    <img src={infoIcon} className="img-fluid" alt="info"></img>
                                </Popover>
                            </div></Label>
                        }
                    >
                        <Input
                            placeholder="Enter CNIC"
                            maxLength={13}
                            onKeyDown={(evt) =>
                                arrayWithoutNumber.includes(evt.key) &&
                                evt.preventDefault()
                            }
                        />
                    </Form.Item>
                </Col>
            </Row >
        </>
    );
}

export default BankDetail;
