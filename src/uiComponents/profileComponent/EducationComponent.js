import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { Row, Col } from "react-bootstrap";
import { HiOutlineArrowDown } from "react-icons/hi";
import { isEmpty } from "../../helpers/objectHelper";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectUniversities, selectDegrees } from "../../pages/updateProfile/redux/slice";
import { getUniversities, getDegrees } from "../../pages/updateProfile/redux/thunk";

function EducationComponent(props) {
  const dispatch = useAppDispatch();
  const universities = useAppSelector(selectUniversities);

  const rerender = false;

  const degrees = useAppSelector(selectDegrees);

  useEffect(() => {
    dispatch(getDegrees());
    dispatch(getUniversities());
  }, [rerender]);

  // console.log(universities, 'universities');

  // const degrees = [];
  // const universities = []

  const { Option } = Select;
  // console.log(props.id)
  return (
    <div className="education_component" id={props.id}>
      <Row>
        <Col md={4}>
          <Form.Item name={"degree"+props.id.toString()} label="Degree Name">
            {/* <Input type="text" className="c_input" /> */}
            {isEmpty(degrees) === false ? (
              <Select dropdownAlign={{ offset: [0, 4] }}
                suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                className="c_select" id={props.id}
              >
                {degrees?.data.map((uni) => (
                  <Option value={uni.name} key={uni.id}>
                    {uni.full_name}
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
          <Form.Item name={"year_of_completion"+props.id.toString()} label="Year of Graduation">
            <Input type="text" className="c_input" id={props.id} />
          </Form.Item>
        </Col>
        <Col md={4}>
          <Form.Item name={"institute"+props.id.toString()} label="Institution Name">
            {/* <Input type="text" className="c_input" /> */}
            {isEmpty(universities) === false ? (
              <Select dropdownAlign={{ offset: [0, 4] }}
                suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                className="c_select" id={props.id}
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
      </Row>
    </div>
  );
}

export default React.memo(EducationComponent);
