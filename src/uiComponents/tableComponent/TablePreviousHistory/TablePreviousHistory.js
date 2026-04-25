import React, { useState, useEffect } from "react";
import { Table } from 'antd';
import "./TablePreviousHistory.scss";
import { Link } from "react-router-dom";

function TablePreviousHistory(props) {
    // const onChange = (pagination, filters, sorter, extra) => {
    //   // console.log("params", pagination, filters, sorter, extra);
    // };


    return (
        <div>
            <Table
                columns={props.columns}
                dataSource={props.data}
                pagination={props.pagination}

            />

        </div>
    );
}

export default React.memo(TablePreviousHistory);
