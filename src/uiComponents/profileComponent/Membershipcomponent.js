import React from "react";
import { Form, Input, Select } from "antd";
import { Row, Col } from "react-bootstrap";
import { isEmpty } from "../../helpers/objectHelper";
import { HiOutlineArrowDown } from "react-icons/hi";


function MembershipComponent(props) {
  // const dispatch = useAppDispatch();
  // const universities = useAppSelector(selectUniversities);

  // useEffect(() => {
  //   dispatch(getUniversities());
  // }, []);

  const universities = [];

  const { Option } = Select;
  return (
    <div className="membership_component" id={props?.id}>
      <Row>
        <Col md={4}>
          <Form.Item name={"institutionName" + props?.id?.toString()} label="Institution Name">
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
      </Row>
    </div>
  );
}

export default React.memo(MembershipComponent);
