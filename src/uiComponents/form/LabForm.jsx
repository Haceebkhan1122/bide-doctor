import React, { useState, useEffect, useRef } from "react";
import { Select, Form, Button } from "antd";
import { Col, Row } from "react-bootstrap";
import swal from "sweetalert";

function LabForm(props) {
  const { Option } = Select;
  const {
    labs,
    editLabStatus,
    setEditLabStatus,
    editLab,
    setLabTable,
    labTable
  } = props

  const [labName, setLabName] = useState(null);
  const [labForm] = Form.useForm();
  const labNameRef = useRef();

  useEffect(() => {
    labNameRef.current = labName;
  }, [labName]);

  const medicineChange = (value) => {
    setLabName(value);
  };

  const onFinish = async (value) => {
    const { lab } = value;

    var currentMealStatus = labNameRef.current;

    let found = [];

    labs.data?.map((item) => {
      if (item.id === currentMealStatus) {
        found.push(item.name);
        found.push(item.id);
      }
    });

    value.labName = found[0];
    value.prescription_element_id = found[1];

    let payload = {
      lab: found[0] || labName,
      prescription_element_id: found[1] || editLab?.prescription_element_id,
    };


    if (labTable?.length == 0) {
      setLabTable([...labTable, payload]);
      labForm.resetFields();
      setEditLabStatus(false);
    } else if (labTable?.length > 0 && labName) {
      let duplicateFound = false;
      setEditLabStatus(false);
      for (let item of labTable) {
        if (
          item?.prescription_element_id === payload?.prescription_element_id
        ) {
          // Compare against payload?.prescription_element_id instead of Lab Name
          duplicateFound = true;
          break;
        }
      }
      if (duplicateFound) {
        swal("Error!", "You can't add similar lab twice", "error");
      } else {
        setLabTable([...labTable, payload]);
        labForm.resetFields();
        setEditLabStatus(false);
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Manually trigger the form validation and submit
    labForm
      .validateFields()
      .then(() => {
        labForm.submit();
      })
      .catch((error) => {
        console.error("Form validation failed:", error);
      });
  };

  useEffect(() => {
    if (editLab && editLabStatus) {
      const formValues = {
        lab: editLab?.lab,
      };
      labForm.setFieldsValue(formValues);
    }
  }, [editLab, editLabStatus]);


  return (
    <>
      <Form
        form={labForm}
        name="basic"
        initialValues={{ name: "" }}
        onFinish={onFinish}
        className="medicine_form01 insulineForm">
        <Row className="align-items-center">
          <Col md={8} className="lab_mobile_title pt-0">
            <p className="labelText fs-14 px-0">Lab Test*</p>
            <Form.Item name="lab">
              <Select
                dropdownAlign={{ offset: [0, 4] }}
                style={{ cursor: "pointer" }}
                className="c_select sleeeeek"
                placeholder="Select Lab"
                value={labName}
                onChange={medicineChange}>
                {labs.data?.map((lab, index) => (
                  <Option
                    value={lab.id}
                    key={index}
                  >
                    {lab.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={4} className="pt-0 text-end btn_pos">
            <div className="flex_end d-block">
              <Button
                type="primary"
                htmlType="submit"
                className="simple_btn_small mt-0"
                onClick={handleFormSubmit}
              >
                {editLabStatus ? "UPDATE LAB TEST" : "ADD LAB TEST"}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default React.memo(LabForm);
