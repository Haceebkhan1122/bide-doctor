import React from "react";
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
import { RiArrowDownSLine } from "react-icons/ri";

export const AppointmentTypeFilter = ({ onTypeFilterClick }) => {

  // console.log(props, "props");

  const menu = (
    <Menu onClick={onTypeFilterClick} style={{ width: '150px', marginLeft: '-12%' }}>
      <Menu.Item key="3">All</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="in-person"> In Person</Menu.Item>
      <Menu.Item key="video"> Video</Menu.Item>


    </Menu>
  );

  return (
    <div>
      <Dropdown className="filter" overlay={menu} placement='bottomLeft'>
        <a className="ant-dropdown-link">
          <div className="customP" style={{ display: 'inline-block' }}>
            <h6 className="headingDescVsmall" style={{ display: 'inline-block' }}> Filter By Type</h6> <RiArrowDownSLine className="arrow_grey" style={{ fontSize: '14px', fontWeight: 'bold' }} />
          </div>
        </a>

      </Dropdown>
    </div>
  );
};
