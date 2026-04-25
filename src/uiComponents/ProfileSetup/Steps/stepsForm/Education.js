import React, { useState, useRef, useEffect } from "react";

import "./../Steps.scss";
import { Button, Form, Input, Select, Radio, Space, Tag } from "antd";
import { Row, Col, Container } from "react-bootstrap";
import deleteIcon from "../../../../assets/images/png/delete_icon.png";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  getDegrees,
  getUniversities,
} from "../../../../pages/updateProfile/redux/thunk";
import {
  selectDegrees,
  selectDegreesLoader,
  selectUniversities,
} from "../../../../pages/updateProfile/redux/slice";
import { isElementRepeated } from "../../../../helpers/utilityHelper";
import { useSelector } from "react-redux";
import Loader from "../../../loader/Loader";

const { Option } = Select;

let index = 0;
function Education(props) {
  const { rowCount, duplicateRow, deleteeRow, apiDegrees, form } = props;

  const [name, setName] = useState("");
  const [items, setItems] = useState(["MBBS", "BDS", "MBBSs", "Other"]);
  const inputRef = useRef(null);
  const [showAddItem, setShowAddItem] = useState(false); // State to control the visibility of Add item field and button
  const [deleterowcount, setDeleteRowCount] = useState();
  const [selectedDegrees, setSelectedDegrees] = useState([]);

  const [degreeOptions, setDegreeOptions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const degrees = useAppSelector(selectDegrees);
  const universities = useAppSelector(selectUniversities);

  const selectedValueRef = useRef('');
  const dropdownRef = useRef(null);

  const [dropdownDegrees, setDropdownDegrees] = useState("");

  const degreesLoading = useAppSelector(selectDegreesLoader);

  useEffect(() => {
    if(degrees && degrees?.data?.length > 0) {
      let combinedArray = [];

      let otherOption = [{ name: "Other", id: "Other" }];
      
      combinedArray = degrees?.data?.concat(otherOption);

      setDegreeOptions(combinedArray);
    }
  }, [degrees])
  

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDegrees());
    dispatch(getUniversities());
  }, []);

  let years = [];
  for (let i = 1947; i < 2030; i++) {
    years.unshift(i);
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e, id) => {
    e.preventDefault();
    // inputRef?.current?.focus();
    if (name !== "Other") {
      // setItems([...items, name || `New item ${index++}`]);// Add new item at the end
      setItems([name || `New item ${index++}`, ...items]); // Add new item at the beginning
    }
    setName("");

    if(name !== "Other") {
      form?.setFieldsValue({
        [`degree${id}`]: name
      })
    }
    

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSelect = (value) => {
    if(value?.toLowerCase() === 'other') {

    }

    else {
      selectedValueRef.current = value;
    }
  };

  const handleConditionsChange = (value) => {
    console.log(value, 'nibbz');
    // const excludedValue = 'Other';
    // setShowAddItem(!showAddItem);
    setShowAddItem(value?.toLowerCase() === 'other');
    
    if(value?.toLowerCase() !== "other") {
      setDropdownDegrees(value);
    } 
  };

  function handleDuplicateDegree(_, degree) {
    const myDegrees = selectedDegrees.concat(apiDegrees);

    const alreadyExists = isElementRepeated(myDegrees, degree);
    if (alreadyExists) {
      return Promise.reject("Please choose a different degree");
    }

    else {
      return Promise.resolve();
    }
  }



  return (
    <>
      {degreesLoading && (
        <Loader />
      )}
      <Row className="mt-7 d-none d-sm-block">
        <Col lg={12} md={12} className="text-end ">
          <Button className="add-btn btn" onClick={duplicateRow}>
            + Add More
          </Button>
        </Col>
      </Row>
      {Array.from({ length: rowCount }).map((_, index) => (
        <Row key={index} className="duplicate_row">
          {index === 0 ? (
            /* Render content for the first row */
            <div>{/* Your content for the first row */}</div> 
          ) : (
            /* Render content for other rows */
            <Col lg={12} md={12} className="text-end">
              <hr />
              <button>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={deleteeRow}
                  className="img-fluid"
                />
              </button>
            </Col>
          )}

          <Col lg={6} md={6} className="selectBox condition_box selectDegreeSingle">
            <Form.Item
              name={`degree${index + 1}`}
              label="Degree*"
              rules={[
                {
                  required: true,
                  message: "Degree is required",
                },
                {
                  validator: handleDuplicateDegree
                }
              ]}
            >
              <Select
                placeholder="Please select"
                className="select_des"
                value={dropdownDegrees}
                optionFilterProp="children"
                onChange={handleConditionsChange} // Call the handleConditionsChange function on conditions change
                dropdownClassName="dropdown_box_checkbox"
                onSelect={handleSelect}
                dropdownRender={(menu) => (
                  <>
                    {menu}

                    {showAddItem && ( // Show Add item field and button only when showAddItem is true
                      <Space
                        style={{ padding: "0 8px 4px" }}
                        className="add_item"
                        ref={dropdownRef}
                      >
                        <Input
                          placeholder="Enter your degree"
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                          className="textfield"
                        />
                        <Button
                          type="text"
                          onClick={(e) => addItem(e, index+1)}
                          className={name ? "activebtn" : ""}
                        >
                          Add
                        </Button>
                      </Space>
                    )}
                  </>
                )}
                options={degreeOptions?.map((item, index) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                optionLabelProp="label"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                tagRender={(props) => {
                  const { label, value, closable, onClose } = props;
                  const isOther = label === 'Other';
                  const isCustomItem = !degreeOptions?.some((option) => option?.name === label); // Check if label is a custom added item
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

          <Col lg={6} md={6} className="selectBox universityBox">
            <Form.Item
              name={`institute${index + 1}`}
              label="Institute / University"
              rules={[
                {
                  required: false,
                  message: "Institute is required",
                },
              ]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().startsWith(input.toLowerCase())
                }
                placeholder="Please select">
                {universities?.data?.map((item, index) => (
                  <Option key={item?.id} value={item?.id}>
                    {item?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={6} md={6} className="selectBox ">
            <Form.Item
              name={`completion${index + 1}`}
              label="Year of Completion "
              rules={[
                {
                  required: false,
                  message: "Year of completion is required",
                },
              ]}
            >
              <Select placeholder="Please select">
                {years?.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ))}

      <Row className=" d-block d-sm-none">
        <Col lg={12} md={12} className="  ">
          <Button className="add-btn btn" onClick={duplicateRow}>
            + Add More
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Education;
