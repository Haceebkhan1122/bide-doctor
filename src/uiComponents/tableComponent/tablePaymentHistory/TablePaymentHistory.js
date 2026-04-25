import React, { useState, useEffect } from "react";
import { Table, DatePicker, ConfigProvider } from "antd";
import "./TablePaymentHistory.scss";
import loadingGif from "../../../assets/images/gif/loader_gif.gif";
import { Button, Modal } from "antd";

const { RangePicker } = DatePicker;

function TablePaymentHistory(props) {
  const [modal2Open, setModal2Open] = useState(false);
  const [loading, setLoading] = useState(false);

  const { emptyMessage } = props;

  useEffect(() => {
    if (props.data?.length <= 0) {
      setLoading(false);

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } else if (props.data?.length > 0) {
      setLoading(false);
    }

    // console.log(props?.data, 'props.data');
  }, [props?.data]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateRangeChange = (dates, dateStrings) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  return (
    <>
      {loading ? (
        <div className="loaderWrapper container mt-3">
          <img src={loadingGif} alt="" />
        </div>
      ) : (
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ConfigProvider renderEmpty={() => (
            <p className="mt-3 mb-3 earning-empty-text"> {emptyMessage} </p>
          )}>
            <Table
              style={{ whiteSpace: props.pre ? "pre-wrap" : "none" }}
              key={props.key}
              columns={props.header}
              dataSource={props.data}
              pagination={props.pagination}
              width={400}
              className={props.bold ? "bolder_first" : ""}
              locale={props?.locale ? props?.locale : null}
            />
          </ConfigProvider>
        </div>
      )}
      <div className="call_now">
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_762_9056)">
            <path
              d="M0 5.72904C0.0317924 5.57712 0.0575553 5.42357 0.0964736 5.2733C0.205006 4.85541 0.397405 4.48084 0.703271 4.17317C1.25251 3.61982 1.80175 3.06592 2.36031 2.52244C2.82405 2.07109 3.36397 1.84953 3.99982 2.11606C4.22072 2.20874 4.43505 2.35407 4.60716 2.52189C5.43815 3.33464 6.25763 4.16001 7.07382 4.98757C7.43779 5.35666 7.67184 5.78662 7.59017 6.33065C7.52933 6.73593 7.29691 7.04524 7.01791 7.32493C6.55472 7.78999 6.0877 8.25176 5.62342 8.71572C5.38443 8.95483 5.3795 9.01844 5.51818 9.32885C6.04659 10.5145 6.8573 11.5 7.72611 12.4428C8.59163 13.3817 9.54486 14.2218 10.628 14.9024C10.9969 15.1344 11.3948 15.3198 11.7796 15.5276C11.9578 15.6236 12.091 15.5484 12.2165 15.4218C12.6983 14.9364 13.173 14.4439 13.6686 13.9723C13.8637 13.7869 14.0868 13.6103 14.3291 13.4996C14.8246 13.2731 15.3026 13.3762 15.7362 13.6915C15.8463 13.7716 15.9483 13.8648 16.0448 13.9608C16.8303 14.7423 17.619 15.5205 18.3925 16.3135C18.5799 16.506 18.7548 16.7314 18.8666 16.9732C19.1067 17.4942 19.013 18.0141 18.6391 18.4265C18.0334 19.0945 17.3921 19.7312 16.7442 20.3592C16.3879 20.7047 15.9302 20.8774 15.4407 20.958C15.381 20.9679 15.3229 20.9866 15.2637 21.0014H14.4842C14.4392 20.9893 14.3943 20.975 14.3483 20.9657C13.7617 20.8434 13.1593 20.7699 12.5909 20.5901C10.9026 20.0553 9.37493 19.1888 7.93715 18.171C5.33017 16.3261 3.24338 14.0019 1.66362 11.2258C1.06724 10.1778 0.582679 9.07822 0.264754 7.91229C0.150192 7.49165 0.086607 7.0584 0 6.63228C0 6.3312 0 6.03012 0 5.72904Z"
              fill="#404040"
            />
            <path
              d="M21.0005 9.84409C20.4649 9.93568 19.9431 10.0256 19.4322 10.1134C18.3233 5.37888 15.4006 2.54082 10.6191 1.56683C10.6899 1.06119 10.7639 0.530868 10.8373 0C15.49 0.571451 20.0209 4.27985 20.9999 9.84409H21.0005Z"
              fill="#404040"
            />
            <path
              d="M10.6237 4.19043C13.9263 4.6341 16.3173 7.31641 16.7306 10.1254C16.2093 10.2148 15.6874 10.3047 15.1574 10.3958C14.5637 7.84673 12.99 6.315 10.4033 5.78194C10.4751 5.26478 10.5486 4.73501 10.6237 4.19098V4.19043Z"
              fill="#404040"
            />
          </g>
          <defs>
            <clipPath id="clip0_762_9056">
              <rect width="21" height="21" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p>
          For any help or queries call us at{" "}
          <a style={{ textDecoration: 'underline' }} href="tel:(021)-111-111-111">(021)-111-111-111 </a>
        </p>
      </div>

    </>
  );
}

export default React.memo(TablePaymentHistory);
