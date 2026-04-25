import React, { useState, useEffect } from "react";
import { ConfigProvider, Table } from "antd";
import { FiArrowRightCircle } from "react-icons/fi";
import { RiArrowRightSLine } from "react-icons/ri";
import "./_tableComponent.scss";
import { Link } from "react-router-dom";
import loadingGif from "../../../assets/images/gif/loader_gif.gif";

function EarningTable(props) {
  // const onChange = (pagination, filters, sorter, extra) => {
  //   // console.log("params", pagination, filters, sorter, extra);
  // };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(props.data?.length<=0) {
      setLoading(false);

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }

    else if(props.data?.length>0) {
      setLoading(false);
    }

    // console.log(props?.data, 'props.data');
  }, [props?.data])

  return (
    <div>

      {loading ? (
        <div className="loaderWrapper container mt-3">
        <img src={loadingGif} alt="" />
      </div>
      ): (
        <ConfigProvider renderEmpty={() => (
          <p className="mt-3 mb-3 earning-empty-text"> No earnings added </p>
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
        locale={props?.locale ? props?.locale : null}
      //   loading={{indicator: <div className="loaderWrapper container">
      //   <img src={loadingGif} alt="" />
      // </div>, spinning: loading }}
      />
      </ConfigProvider>
      )}

    </div>
  );
}

export default React.memo(EarningTable);
