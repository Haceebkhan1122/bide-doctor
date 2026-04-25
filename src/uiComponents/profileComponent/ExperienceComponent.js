import React, { useState, useEffect } from "react";
import { Checkbox, Form, Input, Select } from "antd";
import { Row, Col } from "react-bootstrap";
import { DatePicker } from "antd";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectUniversities } from "../../pages/updateProfile/redux/slice";
import { getUniversities } from "../../pages/updateProfile/redux/thunk";
import { isEmpty } from "../../helpers/objectHelper";
import { HiOutlineArrowDown } from "react-icons/hi";

function ExperienceComponent(props) {
  // console.log(props?.id,'sss')
  // const dispatch = useAppDispatch();
  // const universities = useAppSelector(selectUniversities);

  // useEffect(() => {
  //   dispatch(getUniversities());
  // }, []);

  const universities = [];

  const { Option } = Select
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    // e.preventDefault();
    setChecked(!checked);
  };
  return (
    <div className="experience_component" key={props.id}>
      <Row>
        <Col md={4}>
          <Form.Item name={"designation" + props.id.toString()} label="Designation">
            <Input type="text" className="c_input" />
          </Form.Item>
        </Col>
        <Col md={4}>
          <Form.Item name={"institution_name" + props.id.toString()} label="Institution Name">
            {isEmpty(universities) === false ? (
              <Select dropdownAlign={{ offset: [0, 4] }}
                suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                className="c_select"
              >
                {universities?.data.map((uni) => (
                  <Option value={uni.name} key={uni.id}>
                    {uni.name}
                  </Option>
                ))}
              </Select>
            ) : (
              <Select dropdownAlign={{ offset: [0, 4] }}
                suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                className="c_select"
              >
                <Option value="other">Other</Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col md={4}>
          <div className="flex_start">
            <Form.Item name={"start_date" + props.id.toString()} label="Start Date" id={"sd" + props?.id} >
              <DatePicker className="c_input" format="DD/MM/YYYY" placeholder="" id={"sd" + props?.id} name={"sd" + props?.id} />
              {/* <Input type="text" className="c_input" /> */}
            </Form.Item>
            <div className="column_flex">
              <Form.Item name={"end_date" + props.id.toString()} label="End Date" id={"ed" + props?.id}>
                <DatePicker
                  id={"ed" + props?.id}
                  name={"ed" + props?.id}
                  className="c_input"
                  format="DD/MM/YYYY"
                  disabled={checked ? true : false}
                  placeholder=""
                />

                {/* <Input type="text" className="c_input" id={checked ? 'grey':'white'} disabled={checked ? true: false}/> */}
              </Form.Item>
              <div className="flex_end">
                <Checkbox onChange={handleChange}>Till date</Checkbox>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(ExperienceComponent);
