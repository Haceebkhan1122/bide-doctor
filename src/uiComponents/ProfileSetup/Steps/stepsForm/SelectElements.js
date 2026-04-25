import React, { useState, useRef, useEffect } from "react";

import './../Steps.scss';
import { Button, Form, Input, Select, Radio, Space, Empty, Tag, Modal } from "antd";
import { Row, Col, Container } from "react-bootstrap";

import deleteIcon from "../../../../assets/images/png/delete_icon.png";
import infoIcon from "../../../../assets/images/png/info.png";
import { Popover } from "antd";
import { Label } from "evergreen-ui";

function SelectElements({ key, id, firstSelectValue, secondSelectOptions, onChange, onRemove, specialities, handleDuplicateSpeciality, handleDuplicateService, handleDuplicateDisease, handleSpecialityChange, handleServiceChange, handleDiseaseChange, thirdSelectOptions, form }) {
  const { Option } = Select;
  let index = 0;

  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [showAddItem, setShowAddItem] = useState(false); // State to control the visibility of Add item field and button
  const [items, setItems] = useState([]);
  const [showAddDiseaseBtn, setShowAddDiseaseBtn] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedConditions, setSelectedConditions] = useState([]);


  const [instruction, setInstruction] = useState(false);
  const modalCondition = (e) => {
    setInstruction(true);
  };



  const handleFirstSelectChange = (e) => {
    onChange(id, e);
  };

  const content = (
    <div>
      <p className="info">
        In case you don't make a selection, we will assign the most common
        <br></br> diseases related to your speciality to boost your visibility
        on our<br></br> platform.
      </p>
    </div>
  );

  const modalStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  };
  // const handleConditionsChange = (value) => {
  //   console.log({value})
  //   setShowAddItem(!showAddItem);
  //   setShowAddItem(value.includes("Other"));
  //   if(value?.[0] !== "Other") {
  //     handleDiseaseChange(value);
  //   }

  //   else {
  //     console.log("otherval")
  //     return null;
  //   }

  // };

  // const handleConditionsChange = (values) => {
  //   console.log(values[0], "values")
  //   const excludedValue = 'Other';

  //   // Check if the excluded value is included in the selected values
  //   if (values.includes(excludedValue)) {
  //     // Remove the excluded value from the selected values
  //     const filteredValues = values.filter((value) => value !== excludedValue);
  //     setSelectedConditions(filteredValues);
  //   } else {
  //     setSelectedConditions(values);
  //   }
  // };
  const handleConditionsChange = (values) => {
    console.log(values[0], "values");
    const excludedValue = 'Other';

    setShowAddItem(!showAddItem);
    setShowAddItem(values.includes("Other"));
    handleDiseaseChange(values);
    const filteredValues = values.filter((value) => value !== excludedValue);
    setSelectedConditions(filteredValues);
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  function filterConditionOption(input, option) {
    const excludedValue = "Other";

    if (option.props.value === excludedValue) {
      return false;
    }

    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  }

  const addItem = (e, id) => {
    e.preventDefault();
    if (name !== "Other") {
      // setItems([...items, name || `New item ${index++}`]);// Add new item at the end
      setItems([name || `New item ${index++}`, ...items]); // Add new item at the beginning
    }
    const previousDiseaseValue = form?.getFieldValue(`condition${id}`) || '';

    if (!previousDiseaseValue) {
      form?.setFieldsValue({
        [`condition${id}`]: [name]
      })
    }

    else {
      form?.setFieldsValue({
        [`condition${id}`]: [...previousDiseaseValue, name]
      })
    }


    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  function handleDiseaseSearch(value) {
    const filteredOptions = thirdSelectOptions?.filter((item) => {
      return item?.name?.toLowerCase()?.startsWith(value?.toLowerCase());
    });

    if (filteredOptions.length === 0) {
      setShowAddItem(true);
    } else {
      setShowAddItem(false);
    }
  }


  return (
    <>
      <Col lg={6} md={6} className="selectBox ">
        <Form.Item
          name={`speciality${id}`}
          label="Select your speciality*"
          rules={[
            {
              required: true,
              message: "Speciality is required",
            },
            {
              validator: handleDuplicateSpeciality,
            },
          ]}
        >
          <Select
            placeholder="Ent Specialist"
            onChange={(e) => {
              onChange(id, e);
              handleSpecialityChange(e);
            }}
            showSearch={true}
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option.children?.toString().toLowerCase().startsWith(input.toLowerCase())
              }}
          >
            {specialities?.data?.specialities?.map((item) => (
              <Option key={item?.id} value={item?.id}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col lg={6} md={6} className="selectBox ">
        <Form.Item
          name={`service${id}`}
          label="Select your service*"
          rules={[
            {
              required: true,
              message: "Service is required",
            },
            {
              validator: handleDuplicateService,
            },
          ]}
        >
          <Select
            placeholder="Select service"
            onChange={(e) => handleServiceChange(e)}
          >
            {secondSelectOptions.map((option) => (
              <Option key={option?.id} value={option?.id}>
                {option?.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col lg={6} md={6} className="selectBox condition_box select3BoxPadding">
        <Form.Item
          name={`condition${id}`}
          rules={[
            {
              required: true,
              message: "conditions is required",
            },
            {
              validator: handleDuplicateDisease,
            },
          ]}
          label={
            <Label>
              Select conditions you treat*{" "}
              <div className="popover_box1 dd">
                <div className="d-none d-sm-block">
                  <Popover
                    content={content}
                    placement="topLeft"
                    overlayClassName="popover_box"
                  >
                    <img src={infoIcon} className="img-fluid ss" alt="info" ></img>
                  </Popover>
                </div>
                <div className="d-block d-sm-none">
                  <img src={infoIcon} className="img-fluid ss" alt="info" onClick={modalCondition}></img>
                </div>
              </div>
            </Label>
          }
        >
          <Select
            mode="multiple"
            value={selectedConditions}
            placeholder="Select conditions"
            className="select_des"
            onChange={handleConditionsChange}
            showSearch={false}
            onSearch={handleDiseaseSearch}
            filterOption={filterConditionOption}
            dropdownClassName="dropdown_box_checkbox"
            dropdownRender={(menu) => (
              <>
                {menu}
                {showAddItem && ( // Show Add item field and button only when showAddItem is true
                  <Space style={{ padding: "0 8px 4px" }} className="add_item">
                    <Input
                      placeholder="Enter condition you treat"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                      className="textfield"
                    />
                    <Button
                      type="text"
                      onClick={(e) => addItem(e, id)}
                      className={name ? "activebtn" : ""}
                    >
                      Add
                    </Button>
                  </Space>
                )}
              </>
            )}
            options={thirdSelectOptions?.map((item) => ({ label: item?.name, value: item?.id }))}
            optionLabelProp="label"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            tagRender={(props) => {
              const { label, value, closable, onClose } = props;
              const isOther = label === 'Other';
              const isCustomItem = !thirdSelectOptions?.some((option) => option?.name === label); // Check if label is a custom added item
              const className = isOther ? 'selected-other-value' : '';

              return (
                <Tag
                  className={`className ${isCustomItem ? 'forTagCustom' : ''}`}
                  closable={closable}
                  onClose={onClose}
                  style={{ marginRight: 3, backgroundColor: isCustomItem ? 'rgb(240 193 150 / 69%)' : '#29BCC1', color: isCustomItem ? '#EB8E39' : 'white', borderRadius: '5px' }}
                >
                  {label}
                </Tag>
              );
            }}
          />
        </Form.Item>
      </Col>

      <Col md={6} lg={6}></Col>
      <Modal
        title=""
        centered
        visible={instruction}
        onOk={() => setInstruction(false)}
        onCancel={() => setInstruction(false)}
        bodyStyle={modalStyle}
        mask={false}
        wrapClassName="scrollModal"
        className=" modal_ins hideclosebtn"
      >
        <div className="modal_prompt">
          <h6>Select conditions you treat</h6>
          <p>In case you don't make a selection, we will assign the most common diseases related to your speciality to boost your visibility on our platform.</p>
          <div className="text-center">
            <Button className="btn btn-modal" onClick={() => setInstruction(false)}>Close</Button>
          </div>
        </div>
      </Modal>
      {id != 1 && (
        <>
          <Col md={11} lg={11}></Col>

          <Col md={1} lg={1}>
            <div className="text-end">
              {" "}
              <img src={deleteIcon} onClick={(e) => onRemove(id)}></img>
            </div>
            {/* <BsTrash style={{ cursor: 'pointer' }} /> */}
          </Col>
        </>
      )}
    </>
  );
}
export default SelectElements;
