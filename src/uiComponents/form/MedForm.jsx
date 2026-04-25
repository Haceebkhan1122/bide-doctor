import React, { useEffect, useMemo, useState, useRef } from "react";
import { Select, InputNumber, Form, Input, Button, Checkbox, Radio } from "antd";
import { Col, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import arrowdropdown from "../../assets/images/svg/dropdown-icon.svg";
import "./medform.css";
import swal from "sweetalert";
import instance from "../../utils/httpService";

function MedForm(props) {
  const { Option } = Select;
  const {
    medicine,
    medTable,
    setMedTable,
    editMedicineStatus,
    setEditMedicineStatus,
    editMedicine,
    medDuration
  } = props;
console.log({props})
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [medicineTypes, setMedicineTypes] = useState([]);
  const [medName, setMedName] = useState(null);
  const [typeName, setTypeName] = useState(null);
  const [medGenerics, setMedGenerics] = useState(null);
  const [medRoutes, setMedRoutes] = useState(null);
  const [medStrength, setMedStrength] = useState(null);
  const [morningDose, setMorningDose] = useState(null);
  const [afternoonDose, setAfternoonDose] = useState(null);
  const [eveningDose, setEveningDose] = useState(null);
  const [nightDose, setNightDose] = useState(null);
  const [durationNumber, setDurationNumber] = useState(null);
  const [mealStatus, setMealStatus] = useState(null);
  const [generic, setGeneric] = useState();
  const [userForm] = Form.useForm();
  const mealStatusRef = useRef();
  const medicineRef = useRef();


  function handleMedicineSearch(value) {
    const filteredOptions = medicine.medicines?.filter((item) => {
      return item?.name?.toLowerCase()?.startsWith(value?.toLowerCase());
    });

    if (filteredOptions.length === 0) {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  }

  function handleGenericSearch(value) {
    const filteredOptions = medicine.generics?.filter((item) => {
      return item?.value?.toLowerCase()?.startsWith(value?.toLowerCase());
    });

    if (filteredOptions.length === 0) {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  }

  const medicineChange = async (value) => {
    setMedName(value);

    const response = await instance.get(`prescription/medicine-generic/${value}`)
    setGeneric(response?.data)
  };


  const typeChange = (value) => {
    setTypeName(value);
  };

  const genericsChange = (value) => {
    setMedGenerics(value);
  };

  const routesChange = (value) => {
    setMedRoutes(value);
  };

  const strengthChange = (e) => {
    setMedStrength(e.target.value);
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

console.log({durationNumber})

  const onFinish = async (value) => {
    console.log({value})
    const {
      medName,
      typeName,
      morningDose,
      afternoonDose,
      eveningDose,
      nightDose,
      durationNumber,
    } = value;

    const currentMealStatus = mealStatusRef.current;
    const sanitizedDurationNumber = durationNumber || 0;
    let found = [];
    medicine.medicines?.map((item) => {
      if (item.id === medName) {
        found.push(item.name);
        found.push(item.id);
      }
    });
    value.medName = found[0];
    value.prescription_element_id = found[1];

    // let foundGenerics = [];
    // generic?.generics?.map((item) => {
    //   if (item.id === medGenerics) {
    //     foundGenerics.push(item.name);
    //     foundGenerics.push(item.id);
    //   }
    // });
    value.medGenerics = generic?.name;
    value.generic = generic?.id;

    let foundTypes = [];
    medicine?.medicine_type?.map((item) => {
      if (item.id === typeName) {
        foundTypes.push(item.name);
        foundTypes.push(item.id);
      }
    });
    value.typeName = foundTypes[0];
    value.typeName = foundTypes[1]; 

    let foundRoutes = [];
    medicine?.routes?.map((item) => {
      if (item.id === medRoutes) {
        foundRoutes.push(item.name);
        foundRoutes.push(item.id);
      }
    });
    value.medRoutes = foundRoutes[0];
    value.routes = foundRoutes[1];

    // let foundStrength = [];
    // medicine?.strengths?.map((item) => {
    //   if (item.id === medStrength) {
    //     foundStrength.push(item.name);
    //     foundStrength.push(item.id);
    //   }
    // });
    // value.medStrength = foundStrength[0];
    // value.strength = foundStrength[1];



    let payload = {
      medName: found[0] || medName,
      prescription_element_id:
        found[1] || editMedicine?.prescription_element_id,
      generic: generic?.id,
      genericName: generic?.name,
      unit: foundTypes[1]?.toString(),
      unitName: foundTypes[0],
      route: foundRoutes[1],
      routeName: foundRoutes[0],
      strength: medStrength,
      // strengthName: foundStrength[0],
      morning: morningDose || morningRef?.current,
      afternoon: afternoonDose || afternoonRef?.current,
      evening: eveningDose || eveningRef?.current,
      night: nightDose || nightRef?.current,
      number_of_days: durationNumber ? durationNumber : null,
      is_after_meal: currentMealStatus,
    };

    // if (durationNumber) {
    //   payload.number_of_days = durationNumber;
    // }
    console.log('Constructed Payload:', payload);

    if (medTable?.length == 0) {
      setMedTable([...medTable, payload]);
      userForm.resetFields();
      setMorningDose("");
      setAfternoonDose("");
      setEveningDose("");
      setNightDose("");
      setMealStatus(null)
      setEditMedicineStatus(false);
    } else if (medTable?.length > 0 && medName && typeName) {
      let duplicateFound = false;
      setMorningDose("");
      setAfternoonDose("");
      setEveningDose("");
      setNightDose("");
      setMealStatus(null)
      for (let item of medTable) {
        if (
          item?.prescription_element_id === payload?.prescription_element_id
        ) {
          // Compare against payload?.prescription_element_id instead of medName
          duplicateFound = true;
          break;
        }
      }

      if (duplicateFound) {
        swal("Error!", "You can't add similar medicines twice", "error");
      } else {
        setMedTable([...medTable, payload]);
        setMorningDose("");
        setAfternoonDose("");
        setEveningDose("");
        setNightDose("");
        userForm.resetFields();
        setEditMedicineStatus(false);
        setMealStatus(null)
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Manually trigger the form validation and submit
    userForm
      .validateFields()
      .then(() => {
        userForm.submit();
      })
      .catch((error) => {
        console.error("Form validation failed:", error);
      });
  };


  useEffect(() => {
    if (editMedicine) {
      const formValues = {
        medName: editMedicine?.medName,
        generic: editMedicine?.generic,
        typeName: parseInt(editMedicine?.unit),
        routes: editMedicine?.route,
        strength: editMedicine?.strength,
        morningDose: editMedicine?.morning,
        afternoonDose: editMedicine?.afternoon,
        eveningDose: editMedicine?.evening,
        nightDose: editMedicine?.night,
        durationNumber: editMedicine?.number_of_days,
        mealStatus: editMedicine?.is_after_meal,
      };
      userForm.setFieldsValue(formValues);

      setMorningDose(editMedicine?.morning);
      setEveningDose(editMedicine?.evening);
      setAfternoonDose(editMedicine?.afternoon);
      setNightDose(editMedicine?.night);

    }
  }, [editMedicine]);

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
      name: 'before',
      figmaName: 'Before Meal'
    },
    {
      id: 2,
      value: '1',
      name: 'after',
      figmaName: 'After Meal'
    },
  ]


  return (
    <>
      <Form
        form={userForm}
        name="basic"
        initialValues={{ name: "" }}
        onFinish={onFinish}
        className="medicine_form01"
      >
        <Row className="spacing_grid spacing_grid1">
          <Col md={3}>
            <p className="labelText fs-14 ps-0">Choose Medicine*</p>
            <Form.Item
            readOnly
              name="medName"
              rules={[{ required: true, message: "Required medicine" }]}
            >
              <Select
                ref={medicineRef}
                dropdownAlign={{ offset: [0, 4] }}
                style={{ cursor: "pointer" }}
                showSearch
                value={medName}
                className="c_select"
                placeholder="Select medicine"
                onChange={medicineChange}
                // onSelect={(e) => setMed(e)}
                onSearch={handleMedicineSearch}
                filterOption={(input, option) => {
                  return option?.children
                    ?.toLowerCase()
                    ?.startsWith(input?.toLowerCase());
                }}
              >
                {medicine.medicines?.map((med) => {
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
            <p className="labelText fs-14 ps-0">Generic </p>
            <Form.Item
              name="generic"

            >
              <Input readOnly placeholder={generic ? generic?.name : "Select"} className="c_select kh-generic-input"/>

            </Form.Item>

          </Col>

          <Col md={3}>
            <p className="labelText fs-14 ps-0">Type*</p>
            <Form.Item
              name="typeName"
              rules={[{ required: true, message: "Required medicine type" }]}
            >
              <Select
                value={typeName}
                dropdownAlign={{ offset: [0, 4] }}
                placeholder="Select type"
                suffixIcon={<img src={arrowdropdown} alt />}
                onChange={typeChange}
                className="c_select"
              >
                {medicine?.medicine_type?.map((med) => (
                  <Option value={med?.id}> {med?.name} </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={3} className="row m-0 px-0 d-md-flex pt-0">
            <p style={{marginLeft:'0.7rem'}} className="labelText fs-14 ">Route </p>
            <Form.Item name="routes">
              <Select
                className="c_select"
                placeholder="Select type"
                suffixIcon={<img src={arrowdropdown} alt />}
                onChange={routesChange}>
                {medicine?.routes?.map((med) => (
                  <Option value={med?.id}> {med?.name} </Option>
                ))}
              </Select>

            </Form.Item>
          </Col>
        </Row>
        <Row className="align-items-center spacing_grid1 " >
          <Col md={12}>
            <Row className="align-items-center">
              <Col md={3}>
                <p className="labelText fs-14 ps-0">Item Strength</p>
                <Form.Item
                  name="strength"
                >
              <Input 
              maxLength={5}
              onChange={strengthChange} 
              value={medStrength}  
              placeholder={"Select Strength"} 
              className="c_select kh-generic-input"
              />

                  {/* <Select
                    className="c_select"
                    placeholder="Select"
                    suffixIcon={<img src={arrowdropdown} alt />}
                    onChange={strengthChange}>
                    {medicine?.strengths?.map((med) => (
                      <Option value={med?.id}> {med?.name} </Option>
                    ))}
                  </Select> */}
                </Form.Item>
              </Col>
              <Col md={3}>
                <p className="labelText fs-14 ps-0">Duration</p>
                <Form.Item
                  name="durationNumber"
                >
                  <Select
                    value={durationNumber}
                    dropdownAlign={{ offset: [0, 4] }}
                    placeholder="Select duration"
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
              <Col md={3} className="forParentMed mb-1 newPrescriptionChecks m-0  d-md-flex">
                <Row>
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
                        placeholder="0"

                          onKeyDown={(evt) =>
                            arrayWithoutNumber.includes(evt.key) &&
                            evt.preventDefault()
                          }
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col md={3} className="">
                    <p className="labelText fs-14 ps-0">Noon</p>
                    <Form.Item name="afternoonDose">
                      <InputNumber
                        value={afternoonDose}
                        min={1}
                        max={99}
                        placeholder="0"
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
                        placeholder="0"
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
                        placeholder="0"
                        value={nightDose}
                        onChange={changeNight}
                        onKeyDown={(evt) =>
                          arrayWithoutNumber.includes(evt.key) &&
                          evt.preventDefault()
                        } />

                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col
                md={3} className="d-flex pe-0">
                {mealState?.length > 0 && mealState?.map((meal) => {
                  return (
                    <>
                      <div className="meal">
                        <div className="hk_go_for_next">
                          <input
                            type="radio"
                            value={meal?.value}
                            name="instruction"
                            checked={editMedicine?.is_after_meal ? editMedicine?.is_after_meal == meal.value : mealStatus === meal.value} // Add checked attribute
                            onChange={(e) => mealChange(e, meal.value)} // Pass meal value to mealChange function
                          />
                          <label>{meal?.figmaName}</label>
                        </div>
                      </div>
                    </>
                  )
                })}
              </Col>
            </Row>
          </Col>
          <Col md={3} className="ms-auto">
            <Button
              type="primary"
              htmlType="submit"
              className="simple_btn_small"
              onClick={handleFormSubmit}
            >
              {editMedicineStatus ? "UPDATE MEDICINE" : "ADD MEDICINE"}
            </Button>
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </>
  );
}

export default React.memo(MedForm);
