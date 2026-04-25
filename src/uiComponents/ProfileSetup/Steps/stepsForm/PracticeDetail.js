import React, { useState, useRef, useEffect } from "react";

import './../Steps.scss';
import { Button, Form, Input, Select, Radio, Space } from "antd";
import { Row, Col, Container } from "react-bootstrap";

import infoIcon from "../../../../assets/images/png/info.png";
import { Popover } from 'antd';
import { Label } from "evergreen-ui";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getSpeciality } from "../../../../pages/updateProfile/redux/thunk";
import { selectServices, selectServicesLoader, selectSpeciality, selectSpecialityLoader } from "../../../../pages/updateProfile/redux/slice";
import Loader from "../../../loader/Loader";
import API from "../../../../utils/customAxios";
import SelectElements from "./SelectElements";
import { getDiseases } from "../../../../pages/appointments/redux/thunk";
import { selectDiseases, selectDiseasesLoading } from "../../../../pages/appointments/redux/slice";
import Cookies from "js-cookie";
import { isElementRepeated } from "../../../../helpers/utilityHelper";
import { isMobile } from "react-device-detect";



const { Option } = Select;

let index = 0;
function PracticeDetail(props) {
    const dispatch = useAppDispatch();

    const { servicesLoader, diseasesLoader, addSelectPair, selectPairs, handleFirstSelectChange, removeSelectPair, form, selectedSpecialities, setSelectedSpecialities } = props;

    const specialities = useAppSelector(selectSpeciality);
    const specialityLoader = useAppSelector(selectSpecialityLoader);

    const [name, setName] = useState("");
    const [items, setItems] = useState(['Acne', 'Diabetes', 'Hypertension', 'Other']);
    const inputRef = useRef(null);
    const [showAddItem, setShowAddItem] = useState(false); // State to control the visibility of Add item field and button
    
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDiseases, setSelectedDiseases] = useState([]);
    const [specialityError, setSpecialityError] = useState(false);

    function handleDuplicateSpeciality(_, specialityId) {
        
        const prefilledSpecialities = [];
        selectPairs?.forEach((pair, index) => {
            let value = form?.getFieldValue(`speciality${index+1}`);
            prefilledSpecialities.push(value);
        });

        const alreadyExists = isElementRepeated(prefilledSpecialities, specialityId);
        if (alreadyExists) {
            return Promise.reject("Please choose a different speciality");
        }

        else {
            return Promise.resolve();
        }
    }

    function handleDuplicateService(_, serviceId) {
        const alreadyExists = isElementRepeated(selectedServices, serviceId);
        if (alreadyExists) {
            return Promise.reject("Please choose a different service");
        }

        else {
            return Promise.resolve();
        }
    }

    function handleDuplicateDisease(_, diseaseId) {
        const alreadyExists = isElementRepeated(selectedDiseases, diseaseId);
        if (alreadyExists) {
            return Promise.reject("Please choose a different condition");
        }

        else {
            return Promise.resolve();
        }
    }

    function handleSpecialityChange(value) {
        setSelectedSpecialities([...selectedSpecialities, value]);
    }



    function handleServiceChange(value) {
        setSelectedServices([...selectedServices, value]);
    }

    function handleDiseaseChange(value) {
        setSelectedDiseases([...selectedDiseases, value]);
    }

    const onNameChange = (event) => {
        setName(event.target.value);
    };

    const addItem = (e) => {
        e.preventDefault();
        if (name !== "Other") {
            // setItems([...items, name || `New item ${index++}`]);// Add new item at the end
            setItems([name || `New item ${index++}`, ...items]); // Add new item at the beginning
        }
        setName("");
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    useEffect(() => {
        dispatch(getSpeciality());
    }, [])


    // useEffect(() => {
    //     if (currentSpeciality) {
    //         API.get(`/services?speciality_id=${currentSpeciality}`)
    //             .then((res) => {
    //                 setServicesArray([...servicesArray, {
    //                     currentSpeciality: res?.data?.data?.services
    //                 }])
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // }, [currentSpeciality])

    const handleConditionsChange = (value) => {
        setShowAddItem(!showAddItem);
        setShowAddItem(value.includes("Other"));
    };

    const { TextArea } = Input;



    return (
        <>
            {(specialityLoader || servicesLoader || diseasesLoader) && (
                <Loader />
            )}
            <Row>
                <Col lg={12} md={12}>
                    <Form.Item
                        name="about"
                        label="About me"
                        className="textarea_style"
                    >
                        <TextArea rows={4} maxLength='500' placeholder="Please share a brief bio to provide additional information about yourself..." />
                    </Form.Item>
                </Col>
                <Col lg={6} md={6}>
                    <Form.Item
                        name="pmdc"
                        label="PMDC Number  (Not mandatory for certain specialties)* "
                        // rules={[
                        //     { required: true, message: 'PMDC number is required' },
                        //     { pattern: /^\d+$/, message: 'PMDC number should only contain numeric values' },
                        //     { max: 13, message: 'PMDC number cannot exceed 13 characters' }
                        // ]}
                    >
                        <Input
                            maxLength="7"
                            disabled
                            placeholder="Enter PMDC number"
                            // onKeyDown={(evt) => {
                            //     const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
                            //     if (!/\d/.test(evt.key) && !allowedKeys.includes(evt.key)) {
                            //         evt.preventDefault();
                            //     }
                            // }}
                        />
                    </Form.Item>
                </Col>
                <Col lg={6} md={6}>
                </Col>
                {/* First column is for spacing so that 'add another speciality' button gets 'floated' to the right */}
                <Col lg={10} md={10}>

                </Col>

                {!isMobile ? (
                    <Col lg={2} md={2}>
                        <button
                            style={{ position: 'relative', right: '45px' }}
                            className="ant-btn ant-btn-default add-btn btn"
                            type="button"
                            onClick={addSelectPair}>
                            +Add Another Speciality
                        </button>
                    </Col>
                ) : null}

                {specialities && selectPairs?.map(pair => (
                    <SelectElements
                        key={pair.id}
                        id={pair.id}
                        firstSelectValue={pair.firstSelectValue}
                        secondSelectOptions={pair.secondSelectOptions}
                        thirdSelectOptions={pair.thirdSelectOptions}
                        onChange={handleFirstSelectChange}
                        onRemove={removeSelectPair}
                        specialities={specialities}
                        handleDuplicateSpeciality={handleDuplicateSpeciality}
                        handleDuplicateService={handleDuplicateService}
                        handleDuplicateDisease={handleDuplicateDisease}
                        handleSpecialityChange={handleSpecialityChange}
                        handleServiceChange={handleServiceChange}
                        handleDiseaseChange={handleDiseaseChange}
                        form={form}
                    />
                ))}

                {isMobile ? (
                    <Col lg={2} md={2}>
                        <button
                            style={{ position: 'relative', right: '0' }}
                            className="ant-btn ant-btn-default add-btn btn"
                            type="button"
                            onClick={addSelectPair}>
                            +Add Another Speciality
                        </button>
                    </Col>
                ) : null}



            </Row>



        </>
    );
}

export default PracticeDetail;