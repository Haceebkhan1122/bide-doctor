import React, { useState, useEffect } from "react";
import { ConfigProvider, Table } from "antd";
import { FiArrowRightCircle } from "react-icons/fi";
import { RiArrowRightSLine } from "react-icons/ri";
import "../tableComponent/tableComp/_tableComponent.scss";
import { Link } from "react-router-dom";

function TableComponent(props) {
  // const onChange = (pagination, filters, sorter, extra) => {
  //   // console.log("params", pagination, filters, sorter, extra);
  // };
  

  return (
    <div>
        <ConfigProvider renderEmpty={() => (
            <p className="empty-state mt-3 mb-3 text-danger"> No Appointments Found </p>
        )}>
        <Table
        style={{ whiteSpace: props.pre ? "pre-wrap" : "none" }}
        key={props.key}
        columns={props.header}
        dataSource={props.data}
        // onChange={onChange}
        pagination={props.pagination}
        width={400}
        className={props.bold ? "bolder_first" : ""}
        
      />
      </ConfigProvider>
      
    </div>
  );
}

export default React.memo(TableComponent);
