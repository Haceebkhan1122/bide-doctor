import React, { useEffect, useMemo, useState, useRef } from "react";
import { Select, InputNumber, Form, Button, Input } from "antd";
import { Col, Row } from "react-bootstrap";
import arrowdropdown from "../../assets/images/svg/dropdown-icon.svg";
import "./medform.css";
import swal from "sweetalert";


export const InsulinForm = (props) => {
    const { Option } = Select;
    const { insulin,
        medDuration,
        editInsulinStatus,
        setEditInsulinStatus,
        editInsulin,
        setInsulinTable,
        insulinTable
    } = props

    const [insulinName, setInsulinName] = useState(null);
    const [typeName, setTypeName] = useState(null);
    const [morningDose, setMorningDose] = useState(null);
    const [afternoonDose, setAfternoonDose] = useState(null);
    const [eveningDose, setEveningDose] = useState(null);
    const [nightDose, setNightDose] = useState(null);
    const [durationNumber, setDurationNumber] = useState(null);
    const [mealStatus, setMealStatus] = useState(null);
    const [insulinForm] = Form.useForm();
    const mealStatusRef = useRef();


    function handleInsulinSearch(value) {
        const filteredOptions = insulin?.insulin.filter((item) => {
            return item?.name?.toLowerCase()?.startsWith(value?.toLowerCase());
        });
        if (filteredOptions.length === 0) {
            // setShowAddBtn(true);
        } else {
            // setShowAddBtn(false);
        }
    }

    const medicineChange = (value) => {
        setInsulinName(value);
    };

    const typeChange = (e) => {
        setTypeName(e.target.value);
    };

    const changeAfternoon = (value) => {
        setAfternoonDose(value);
    };

    const changeEvening = (value) => {
        setEveningDose(value);
    };

    const changeNight = (value) => {
        setNightDose(value);
    };

    const durationChange = (value) => {
        setDurationNumber(value);
    };

    const mealChange = (e) => {
        setMealStatus(e.target.value);
    };

    useEffect(() => {
        mealStatusRef.current = mealStatus;
    }, [mealStatus]);

    const morningRef = useRef(morningDose);
    const afternoonRef = useRef(afternoonDose);
    const eveningRef = useRef(eveningDose);
    const nightRef = useRef(nightDose);

    useEffect(() => {
        morningRef.current = morningDose;
    }, [morningDose]);

    useEffect(() => {
        afternoonRef.current = afternoonDose;
    }, [afternoonDose]);

    useEffect(() => {
        eveningRef.current = eveningDose;
    }, [eveningDose]);

    useEffect(() => {
        nightRef.current = nightDose;
    }, [nightDose]);

    const onFinish = async (value) => {
        const {
            typeName,
            morningDose,
            afternoonDose,
            eveningDose,
            nightDose,
            durationNumber,
        } = value;

        const currentMealStatus = mealStatusRef.current;

        let found = [];
        insulin?.insulin?.map((item) => {
            if (item.id === insulinName) {
                found.push(item.name);
                found.push(item.id);
            }
        });
        value.insulinName = found[0];
        value.prescription_element_id = found[1];

        let foundType = [];
        // insulin.insulinUnit?.map((item) => {
        //     console.log(typeName, "typeName")
        //     console.log(item, "item")
        //     foundType.push(item.name);
        //     // if (item.id === typeName) {
        //     //     foundType.push(item.id);
        //     // }
        // });
        // value.typeName = foundType[0];
        // value.typeName = foundType[1];

        let payload = {
            insuline: found[0] || insulinName,
            prescription_element_id:
                found[1] || editInsulin?.prescription_element_id,
            unit: typeName ? typeName : null,
            // unitName: typeName,
            morning: morningDose || morningRef?.current,
            afternoon: afternoonDose || afternoonRef?.current,
            evening: eveningDose || eveningRef?.current,
            night: nightDose || nightRef?.current,
            number_of_days: durationNumber,
            is_after_meal: currentMealStatus,
        };


        if (insulinTable?.length == 0) {
            setInsulinTable([...insulinTable, payload]);
            insulinForm.resetFields();
            setMorningDose("");
            setAfternoonDose("");
            setEveningDose("");
            setNightDose("");
            setEditInsulinStatus(false);
            setMealStatus(null)
        } else if (insulinTable?.length > 0 && insulinName && typeName) {
            let duplicateFound = false;
            setMorningDose("");
            setAfternoonDose("");
            setEveningDose("");
            setNightDose("");
            setMealStatus(null)
            setEditInsulinStatus(false);
            for (let item of insulinTable) {
                if (
                    item?.prescription_element_id === payload?.prescription_element_id
                ) {
                    // Compare against payload?.prescription_element_id instead of insulinName
                    duplicateFound = true;
                    break;
                }
            }
            if (duplicateFound) {
                swal("Error!", "You can't add similar insulin twice", "error");
            } else {
                setInsulinTable([...insulinTable, payload]);
                setMorningDose("");
                setAfternoonDose("");
                setEveningDose("");
                setNightDose("");
                setMealStatus(null)
                insulinForm.resetFields();
                setEditInsulinStatus(false);
            }
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Manually trigger the form validation and submit
        insulinForm
            .validateFields()
            .then(() => {
                insulinForm.submit();
            })
            .catch((error) => {
                console.error("Form validation failed:", error);
            });
    };

    useEffect(() => {
        if (editInsulin && editInsulinStatus) {
            const formValues = {
                insulin: editInsulin?.insuline,
                typeName: editInsulin?.unit,
                morningDose: editInsulin?.morning,
                afternoonDose: editInsulin?.afternoon,
                eveningDose: editInsulin?.evening,
                nightDose: editInsulin?.night,
                durationNumber: editInsulin?.number_of_days,
                mealStatus: editInsulin?.is_after_meal,
            };
            insulinForm.setFieldsValue(formValues);

            setMorningDose(editInsulin?.morning);
            setEveningDose(editInsulin?.evening);
            setAfternoonDose(editInsulin?.afternoon);
            setNightDose(editInsulin?.night);

        }
    }, [editInsulin, editInsulinStatus]);

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


    const mealState = [
        {
            id: 1,
            value: '0',
            name: 'Before Meal'
        },
        {
            id: 2,
            value: '1',
            name: 'After Meal'
        },
    ]

    return (
        <>
            <Form
                form={insulinForm}
                name="basic"
                initialValues={{ name: "" }}
                onFinish={onFinish}
                className="medicine_form01 insulineForm">
                <Row className="spacing_grid1">
                    <Col md={3} className="pe-3" >
                        <p className="labelText fs-14 ps-0">Choose Insulin*</p>
                        <Form.Item
                            name="insulin"
                            rules={[{ required: true, message: "Required Insulin" }]}
                        >
                            <Select
                                dropdownAlign={{ offset: [0, 4] }}
                                showSearch
                                style={{ cursor: "pointer" }}
                                className="c_select"
                                placeholder="Select insulin"
                                value={insulinName}
                                onChange={medicineChange}
                                onSearch={handleInsulinSearch}
                                filterOption={(input, option) => {
                                    return option?.children
                                        ?.toLowerCase()
                                        ?.startsWith(input?.toLowerCase());
                                }}
                            >
                                {insulin.insulin?.map((med) => {
                                    return (
                                        <>
                                            <Option value={med?.id} key={med?.id}>
                                                {med.name}
                                            </Option>
                                        </>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col md={3}>
                        <p className="labelText fs-14 ps-0">Units </p>
                        <Form.Item
                            name="typeName">
                            <Input placeholder="Unit" maxLength={5} className="c_input unitInput" type="text" value={typeName} onChange={typeChange} />
                            {/* <Select
                                placeholder="Select unit"
                                className="c_select"
                                value={typeName}
                                onChange={typeChange}
                                suffixIcon={<img src={arrowdropdown} alt />}>
                                {insulin.insulinUnit?.map((med) => {
                                    return (
                                        <>
                                            <Option value={med?.id} key={med?.id}>
                                                {med.name}
                                            </Option>
                                        </>
                                    );
                                })}
                            </Select> */}

                        </Form.Item>
                    </Col>
                    <Col md={3}>
                        <p className="labelText fs-14 ps-0">Duration*</p>
                        <Form.Item
                            name="durationNumber"
                            rules={[
                                { required: true, message: "Required Duration Period" },
                            ]}
                        >
                            <Select
                                value={durationNumber}
                                dropdownAlign={{ offset: [0, 4] }}
                                placeholder="Select"
                                suffixIcon={<img src={arrowdropdown} alt />}
                                onChange={durationChange}
                                className="c_select"
                            >
                                {medDuration?.map((med) => (
                                    <Option value={med?.name}> {med?.name} </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col md={3} className="row m-0  d-md-flex pt-0 newPrescriptionChecks ">
                        <Col md={3}>
                            {/* block for mobile  */}
                            <div className="mobile_design_field d-sm-block d-none">
                                <p className="labelText fs-14 ps-0">Morning</p>
                                <Form.Item name="morningDose">
                                    <InputNumber
                                        value={morningDose}
                                        min={1}
                                        max={99}
                                        maxLength={2}
                                        onKeyDown={(evt) =>
                                            arrayWithoutNumber.includes(evt.key) &&
                                            evt.preventDefault()
                                        }
                                    />
                                </Form.Item>
                            </div>
                        </Col>
                        <Col md={3} className=" d-sm-block d-none">
                            <p className="labelText fs-14 ps-0">Noon</p>
                            <Form.Item name="afternoonDose">
                                <InputNumber
                                    value={afternoonDose}
                                    min={1}
                                    max={99}
                                    maxLength={2}
                                    onChange={changeAfternoon}
                                    onKeyDown={(evt) =>
                                        arrayWithoutNumber.includes(evt.key) &&
                                        evt.preventDefault()
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col md={3} className=" d-sm-block d-none">
                            <p className="labelText fs-14 ps-0">Evening</p>
                            <Form.Item name="eveningDose">
                                <InputNumber
                                    value={eveningDose}
                                    min={1}
                                    max={99}
                                    maxLength={2}
                                    onChange={changeEvening}
                                    onKeyDown={(evt) =>
                                        arrayWithoutNumber.includes(evt.key) &&
                                        evt.preventDefault()
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col md={3} className=" d-sm-block d-none">
                            <p className="labelText fs-14 ps-0">Night</p>
                            <Form.Item name="nightDose">
                                <InputNumber
                                    max={99}
                                    maxLength={2}
                                    min={1}
                                    value={nightDose}
                                    onChange={changeNight}
                                    onKeyDown={(evt) =>
                                        arrayWithoutNumber.includes(evt.key) &&
                                        evt.preventDefault()
                                    } />

                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
                <Row className=" ">
                    <Col
                        md={5} className="d-flex columspaacing">
                        {mealState?.length > 0 && mealState?.map((meal) => {
                            return (
                                <>
                                    <div className="meal">
                                        <div className="hk_go_for_next">
                                            <input
                                                type="radio"
                                                value={meal?.value}
                                                name="instruction"
                                                checked={editInsulin?.is_after_meal ? editInsulin?.is_after_meal == meal.value : mealStatus === meal.value} // Add checked attribute
                                                onChange={(e) => mealChange(e, meal.value)} // Pass meal value to mealChange function
                                            />
                                            <label>{meal?.name}</label>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col md={3} className="ms-auto">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="simple_btn_small"
                            onClick={handleFormSubmit}
                        >
                            {editInsulinStatus ? "UPDATE INSULIN" : "ADD INSULIN"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
