import { Pagination, Select } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import {
  HeadingDesc,
  HeadingDescSmall,
  HeadingDescVsmall,
  HeadingWithSpaceLarge,
} from "../../uiComponents/Headings";
import { TableComponent } from "../../uiComponents/tableComponent";
import { getAppointmentDetails } from "./redux/thunk";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { selectAppointment } from "./redux/slice";
import "./Appointments.scss";
import moment from "moment";
import StickyTab from "../../uiComponents/stickyTab/StickyTab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffectOnce } from "react-use";
import { AppointmentTypeFilter } from "./AppointmentTypeFilter";
import Slider from "react-slick";
import { getCurrentUserData, getDatesArray } from "../../utils/powerFuntions";
import classNames from "classnames";
import { Switch } from "antd";
import API from "../../utils/customAxios";
import Loader from "../../uiComponents/loader/Loader";
import { isEmpty } from "../../helpers/objectHelper";
import { Modal as AntModal, Button } from "antd";
import disableConsultation from "../../assets/images/svg/instant-disable-modal.svg";

function Appointments() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const selectAppointmentData = useAppSelector(selectAppointment);
  const [tableData, setTableData] = useState();
  const [activeKey, setActiveKey] = useState(0);
  const [appTable, setAppTable] = useState([]);
  const [datefilter, setDateFilter] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [upcomingApp, setUpcomingApp] = useState([]);
  const [pastApp, setPastApp] = useState([]);
  const [cancelledApp, setCancelledApp] = useState([]);

  // console.log({selectAppointmentData})

  // Desktop Tables

  const [scheduleData, setScheduleData] = useState(null);
  const [instantData, setInstantData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const [desktopFilters, setDesktopFilters] = useState("all");
  const [datesArray, setDatesArray] = useState(null);

  const [value, setValue] = React.useState("1");
  const [areAppointmentsLoading, setAreAppointmentsLoading] = useState(false);
  const [userApiLoading, setUserApiLoading] = useState(false);

  //Instant States

  const [isOnline, setIsOnline] = useState(false);
  const [showInstantConsultations, setShowInstantConsultations] =
    useState(false);

  const [showWarningModal, setShowWarningModal] = useState(false);

  const [appointmentsTable, setAppointmentsTable] = useState([]);
  const [historyApiLoading, setHistoryApiLoading] = useState(false);
  const [isHistoryTabActive, setIsHistoryTabActive] = useState(false);

  let [instantPage, setInstantPage] = useState(1);
  const [totalInstantCount, setTotalInstantCount] = useState(null);
  const [lastInstantPage, setLastInstantPage] = useState(null);

  const [historyPage, setHistoryPage] = useState(1);
  const [totalHistoryCount, setTotalHistoryCount] = useState(null);
  const [lastHistoryPage, setLastHistoryPage] = useState(null);

  const slider = useRef();
  const checkboxRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        setUserApiLoading(true);
        const res = await getCurrentUserData();

        if (res?.is_instant_consultation === true) {
          setUserApiLoading(false);
          setIsOnline(true);
        } else {
          setUserApiLoading(false);
          setIsOnline(false);
        }
      } catch (error) {
        setUserApiLoading(false);
        setIsOnline(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        setMobile(true);
      }
    }
    setAreAppointmentsLoading(true);

    // console.log("instanteffect")

    API.get(`/doctor/all-appointment?page=1`)
      .then((response) => {
        if (response?.data?.code === 200) {
          setAppointmentsTable(response?.data?.data?.data);
          setAreAppointmentsLoading(false);
          setTotalInstantCount(response?.data?.data?.total);
          setLastInstantPage(response?.data?.data?.last_page);

          response?.data?.data?.data?.sort((a, b) =>
            a.days_left > b.days_left ? 1 : -1
          );
          setAppTable(response?.data?.data?.data);
          let app_table = [];
          let patient_id = [];
          response?.data?.data?.data?.map((data, index) => {
            if (data?.progress !== "cancelled by user") {
              const start = data?.time?.split(":");
              var timee = new Date(0, 0, 0, start?.[0], start?.[1], 0);
              // const ap_date = data?.date?.split("-");
              // var date = new Date(ap_date?.[0], ap_date?.[1] - 1, ap_date?.[2]);
              // let appointment_date = date?.toLocaleString('en-US', { month: 'short', day: 'numeric' });
              let date = moment(data?.date)
                .format()
                .toString()
                .substring(0, 10);
              let appointment_time = timee?.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true,
                minute: "numeric",
              });
              let myobj = {
                user_id: data?.user_id,
                key: data?.id,
                patients: data?.patient_name,
                date: date,
                time: appointment_time,
                type: data?.type,
                fees: data?.consultation_fee,
                visit_count: data?.user?.appointment_count?.toString(),
                consult: data?.days_left,
                progress: data?.progress,
                typeText: data?.type_text,
              };
              app_table?.push(myobj);
              patient_id.push(data?.id);
            }
          });
          const table_data = app_table;
          setTableData(table_data);
          const data = table_data
            ?.filter(
              (app) =>
                app?.type === "instant-consultation" &&
                !app?.progress.includes("pending")
            )
            ?.sort((a, b) => b?.key - a?.key);

          // console.log(data, "jenny")

          // const data =

          const pendingInstant = table_data
            ?.filter(
              (d) =>
                d?.type === "instant-consultation" &&
                d?.progress.includes("pending")
            )
            ?.sort((a, b) => a?.key - b?.key);

          if (pendingInstant?.length === 1) {
            pendingInstant[0].canStart = true;
          }

          if (pendingInstant?.length > 1) {
            pendingInstant[1].canStart = false;
          }

          // console.log(pendingInstant, "monica")

          setInstantData(pendingInstant.concat(data));
        }
      })
      .catch((err) => {
        setAreAppointmentsLoading(false);
      });
  }, []);

  // console.log({instantData})

  useEffect(() => {
    setIsHistoryTabActive(true);
    setHistoryApiLoading(true);
    API.get(`/doctor/all-appointment?past&page=1`)
      .then((response) => {
        if (response?.data?.code === 200) {
          setHistoryData(response?.data?.data?.data);
          setHistoryApiLoading(false);
          setTotalHistoryCount(response?.data?.data?.total);
          setLastHistoryPage(response?.data?.data?.last_page);

          response?.data?.data?.data?.sort((a, b) => b?.key - a?.key);

          let app_table = [];
          response?.data?.data?.data?.map((data, index) => {
            if (data?.progress !== "cancelled by user") {
              const start = data?.time?.split(":");
              var timee = new Date(0, 0, 0, start?.[0], start?.[1], 0);
              // const ap_date = data?.date?.split("-");
              // var date = new Date(ap_date?.[0], ap_date?.[1] - 1, ap_date?.[2]);
              // let appointment_date = date?.toLocaleString('en-US', { month: 'short', day: 'numeric' });
              let date = moment(data?.date)
                .format()
                .toString()
                .substring(0, 10);
              let appointment_time = timee?.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true,
                minute: "numeric",
              });
              let myobj = {
                user_id: data?.user_id,
                key: data?.id,
                patients: data?.patient_name,
                date: date,
                time: appointment_time,
                type: data?.type,
                fees: data?.consultation_fee,
                visit_count: data?.user?.appointment_count?.toString(),
                consult: data?.days_left,
                progress: data?.progress,
                typeText: data?.type_text,
              };
              app_table?.push(myobj);
            }
          });
          const table_data = app_table;
          setHistoryData(table_data);
        }
      })
      .catch((err) => {
        setHistoryApiLoading(false);
      });
  }, []);

  // console.log({instantPage})

  // console.log({ appointmentsTable })

  useEffect(() => {
    setScheduleData(
      tableData?.filter(
        (app) =>
          app?.type?.includes("in-person") || app?.type?.includes("schedule")
      )
    );
  }, [JSON.stringify(tableData)]);

  useEffectOnce(() => {
    let currentDate = moment();
    let stopDate = moment().add(30, "days");

    let dates = getDatesArray(currentDate, stopDate);

    setDatesArray(dates);
  });

  // function handleInstantPageChange() {
  //   if(lastInstantPage > instantPage) {
  //     setInstantPage(instantPage + 1);
  //   }

  // }

  const instantPaginationOptions = {
    pageSize: 10,
    current: instantPage,
    total: totalInstantCount,
    onChange: (page) => {
      setInstantPage(page);
      setAreAppointmentsLoading(true);

      // console.log("instanteffect")

      API.get(`/doctor/all-appointment?page=${page}`)
        .then((response) => {
          if (response?.data?.code === 200) {
            setAppointmentsTable(response?.data?.data?.data);
            setAreAppointmentsLoading(false);
            setTotalInstantCount(response?.data?.data?.total);
            setLastInstantPage(response?.data?.data?.last_page);

            response?.data?.data?.data?.sort((a, b) =>
              a.days_left > b.days_left ? 1 : -1
            );
            setAppTable(response?.data?.data?.data);
            let app_table = [];
            let patient_id = [];
            response?.data?.data?.data?.map((data, index) => {
              if (data?.progress !== "cancelled by user") {
                const start = data?.time?.split(":");
                var timee = new Date(0, 0, 0, start?.[0], start?.[1], 0);
                // const ap_date = data?.date?.split("-");
                // var date = new Date(ap_date?.[0], ap_date?.[1] - 1, ap_date?.[2]);
                // let appointment_date = date?.toLocaleString('en-US', { month: 'short', day: 'numeric' });
                let date = moment(data?.date)
                  .format()
                  .toString()
                  .substring(0, 10);
                let appointment_time = timee?.toLocaleString("en-US", {
                  hour: "numeric",
                  hour12: true,
                  minute: "numeric",
                });
                let myobj = {
                  user_id: data?.user_id,
                  key: data?.id,
                  patients: data?.patient_name,
                  date: date,
                  time: appointment_time,
                  type: data?.type,
                  typeText: data?.type_text,
                  fees: data?.consultation_fee,
                  visit_count: data?.user?.appointment_count?.toString(),
                  consult: data?.days_left,
                  progress: data?.progress,
                };
                app_table?.push(myobj);
                patient_id.push(data?.id);
              }
            });
            const table_data = app_table;
            setTableData(table_data);
            const data = table_data
              ?.filter(
                (app) =>
                  app?.type === "instant-consultation" &&
                  !app?.progress.includes("pending")
              )
              ?.sort((a, b) => b?.key - a?.key);

            // const data =

            const pendingInstant = table_data
              ?.filter(
                (d) =>
                  d?.type === "instant-consultation" &&
                  d?.progress.includes("pending")
              )
              ?.sort((a, b) => a?.key - b?.key);

            if (pendingInstant?.length === 1) {
              pendingInstant[0].canStart = true;
            }

            if (pendingInstant?.length > 1) {
              pendingInstant[1].canStart = false;
            }

            setInstantData(pendingInstant.concat(data));
          }
        })
        .catch((err) => {
          setAreAppointmentsLoading(false);
        });
    },
  };

  const historyPaginationOptions = {
    pageSize: 10,
    current: historyPage,
    total: totalHistoryCount,
    onChange: (page) => {
      setHistoryPage(page);

      setHistoryApiLoading(true);
      API.get(`/doctor/all-appointment?past&page=${page}`)
        .then((response) => {
          if (response?.data?.code === 200) {
            setHistoryData(response?.data?.data?.data);
            setHistoryApiLoading(false);
            setTotalHistoryCount(response?.data?.data?.total);
            setLastHistoryPage(response?.data?.data?.last_page);

            response?.data?.data?.data?.sort((a, b) =>
              a.days_left > b.days_left ? 1 : -1
            );

            let app_table = [];
            response?.data?.data?.data?.map((data, index) => {
              if (data?.progress !== "cancelled by user") {
                const start = data?.time?.split(":");
                var timee = new Date(0, 0, 0, start?.[0], start?.[1], 0);
                // const ap_date = data?.date?.split("-");
                // var date = new Date(ap_date?.[0], ap_date?.[1] - 1, ap_date?.[2]);
                // let appointment_date = date?.toLocaleString('en-US', { month: 'short', day: 'numeric' });
                let date = moment(data?.date)
                  .format()
                  .toString()
                  .substring(0, 10);
                let appointment_time = timee?.toLocaleString("en-US", {
                  hour: "numeric",
                  hour12: true,
                  minute: "numeric",
                });
                let myobj = {
                  user_id: data?.user_id,
                  key: data?.id,
                  patients: data?.patient_name,
                  date: date,
                  time: appointment_time,
                  type: data?.type,
                  typeText: data?.type_text,
                  fees: data?.consultation_fee,
                  visit_count: data?.user?.appointment_count?.toString(),
                  consult: data?.days_left,
                  progress: data?.progress,
                };
                app_table?.push(myobj);
              }
            });
            const table_data = app_table;
            setHistoryData(table_data);
          }
        })
        .catch((err) => {
          setHistoryApiLoading(false);
        });
    },
  };

  // console.log(instantPaginationOptions.current, "currr")

  function handleHistoryPageChange() {
    if (lastHistoryPage > historyPage) {
      setHistoryPage(historyPage + 1);
    }
  }

  async function onCheckboxChange(e) {
    // setIsOnline(e);

    if (e === true) {
      const data = {
        is_instant_consultation: 1,
      };

      const response = await API.post(`/doctor/instant-online-offline`, data);

      if (response?.data?.code === 200) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } else {
      let instant = instantData?.filter((instant) => {
        return (
          instant.type == "instant-consultation" &&
          instant.progress == "pending"
        );
      });

      if (instant?.length > 0) {
        setShowWarningModal(true);
        setIsOnline(isOnline);
      }

      const data = {
        is_instant_consultation: 0,
      };

      const response = await API.post(`/doctor/instant-online-offline`, data);

      if (response?.data?.code === 200) {
        setIsOnline(false);
      } else {
        setIsOnline(true);
      }
    }
  }

  let simpleSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  let appHeader = [
    { title: "Patients", dataIndex: "patients" },
    {
      title: "Date",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
        // multiple: 3,
      },
    },
    {
      title: "Consultation Time",
      dataIndex: "time",
      sorter: {
        compare: (a, b) => a.time.localeCompare(b.time),
        multiple: 2,
      },
    },
    {
      title: "Type",
      dataIndex: "typeText",
      sorter: {
        compare: (a, b) => a.type.localeCompare(b.type),
        multiple: 1,
      },
      render(text, record) {
        return {
          props: {
            style: {
              color: "#EF6286",
            },
          },
          children: <div className="capitalize">{text}</div>,
        };
      },
    },
    { title: "Fees (Rs.)", dataIndex: "fees" },
    { title: "Visit Count", dataIndex: "visit_count" },
    {
      title: "",
      dataIndex: "consult",
      render(text, record) {
        return {
          children: (
            <div>
              {/* <div className="d-flex mb-2">
                <p className="fs-13">Status</p>
                <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                  Completed
                </div>
              </div> */}
              {record?.progress === "completed" ? (
                <Link
                  className="consult_later"
                  to={{
                    pathname: `/past-consultation/${record?.key}`,
                    state: {
                      id: record.key,
                      type: record?.type,
                      user_id: record?.user_id,
                      visit_count: record?.visit_count,
                    },
                  }}
                >
                  <div className="inline_data">
                    <button className="status_btn btn_complete completed">
                      View Details
                    </button>
                    {/* <RiArrowRightSLine className="arrow_grey" /> */}
                  </div>
                </Link>
              ) : text === 0 ? (
                <Link
                  className="consult_now justify-content-start"
                  to={{
                    pathname: `/appointment/${record?.key}`,
                    state: {
                      id: record.key,
                      type: record?.type,
                      user_id: record?.user_id,
                      visit_count: record?.visit_count,
                    },
                  }}
                >
                  <div className="inline_data btn btn-theme ">
                    <p className="text-white">START</p>
                  </div>
                </Link>
              ) : (
                <>
                  {/* <div className="d-flex mb-2">
                    <p className="fs-13">Status</p>
                    <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                      Cancelled
                    </div>
                  </div> */}
                  <div className="inline_data">
                    <button className="status_btn btn_incomplete incomplete">
                      Cancelled
                    </button>
                  </div>
                </>
              )}
            </div>
          ),
        };
      },
    },
  ];

  let instantHeader = [
    { title: "Patients", dataIndex: "patients" },
    {
      title: "Date",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
        // multiple: 3,
      },
    },
    {
      title: "Consultation Time",
      dataIndex: "time",
      sorter: {
        compare: (a, b) => a.time.localeCompare(b.time),
        multiple: 2,
      },
    },
    {
      title: "Type",
      dataIndex: "typeText",
      sorter: {
        compare: (a, b) => a.type.localeCompare(b.type),
        multiple: 1,
      },
      render(text, record) {
        return {
          props: {
            style: {
              color: "#EF6286",
            },
          },
          children: <div className="capitalize">{text}</div>,
        };
      },
    },
    { title: "Visit Count", dataIndex: "visit_count" },
    {
      title: "",
      dataIndex: "consult",
      render(text, record) {
        return {
          children: (
            <div>
              {/* <div className="d-flex mb-2">
                <p className="fs-13">Status</p>
                <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                  Arrived
                </div>
              </div> */}
              {record?.progress === "completed" ? (
                <>
                  {/* <div className="d-flex mb-2">
                    <p className="fs-13">Status</p>
                    <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                      Completed
                    </div>
                  </div> */}
                  <Link
                    className="consult_later"
                    to={{
                      pathname: `/past-consultation/${record?.key}`,
                      state: {
                        id: record.key,
                        type: record?.type,
                        user_id: record?.user_id,
                        visit_count: record?.visit_count,
                      },
                    }}
                  >
                    <div className="inline_data">
                      <button className="status_btn btn_complete complete">
                        View Details
                      </button>
                      {/* <RiArrowRightSLine className="arrow_grey" /> */}
                    </div>
                  </Link>
                </>
              ) : record?.progress === "pending" ? (
                <>
                  <Link
                    className={classNames(
                      "consult_now consult_now_instant justify-content-start",
                      {
                        "disable-now-btn": record?.canStart === false,
                      }
                    )}
                    to={{
                      pathname: `/appointment/${record?.key}`,
                      state: {
                        id: record.key,
                        type: record?.type,
                        user_id: record?.user_id,
                        visit_count: record?.visit_count,
                      },
                    }}
                  >
                    <div className="inline_data btn btn-theme ">
                      <p className="text-white">START</p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  {/* <div className="d-flex mb-2">
                    <p className="fs-13">Status</p>
                    <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                      Cancelled
                    </div>
                  </div> */}
                  <div className="inline_data">
                    <button className="status_btn btn_incomplete incomplete">
                      Cancelled
                    </button>
                  </div>
                </>
              )}
            </div>
          ),
        };
      },
    },
  ];

  let historyHeader = [
    { title: "Patients", dataIndex: "patients" },
    {
      title: "Date",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
        // multiple: 3,
      },
    },
    {
      title: "Consultation Time",
      dataIndex: "time",
      sorter: {
        compare: (a, b) => a.time.localeCompare(b.time),
        multiple: 2,
      },
    },
    {
      title: "Type",
      dataIndex: "typeText",
      sorter: {
        compare: (a, b) => a.type.localeCompare(b.type),
        multiple: 1,
      },
      render(text, record) {
        return {
          props: {
            style: {
              color: "#EF6286",
            },
          },
          children: <div className="capitalize">{text}</div>,
        };
      },
    },
    { title: "Fees (Rs.)", dataIndex: "fees" },
    { title: "Visit Count", dataIndex: "visit_count" },
    {
      title: "",
      dataIndex: "consult",
      render(text, record) {
        return {
          children: (
            <div>
              {/* <div className="d-flex mb-2">
                <p className="fs-13">Status</p>
                <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                  Completed
                </div>
              </div> */}
              {record?.progress === "completed" ? (
                <Link
                  className="consult_later"
                  to={{
                    pathname: `/past-consultation/${record?.key}`,
                    state: {
                      id: record.key,
                      type: record?.type,
                      user_id: record?.user_id,
                      visit_count: record?.visit_count,
                    },
                  }}
                >
                  <div className="inline_data">
                    <button className="status_btn btn_complete completed">
                      View Details
                    </button>
                    {/* <RiArrowRightSLine className="arrow_grey" /> */}
                  </div>
                </Link>
              ) : (
                record?.progress !== "pending" && (
                  <>
                    {/* <div className="d-flex mb-2">
                    <p className="fs-13">Status</p>
                    <div className="status-tag-action text-uppercase arrived-tag _pending-tag ms-1">
                      Cancelled
                    </div>
                  </div> */}
                    <div className="inline_data">
                      <button className="status_btn btn_incomplete incomplete">
                        Cancelled
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          ),
        };
      },
    },
  ];

  useEffect(() => {
    if (appointmentsTable?.length > 0) {
      // let appointments_table = [...appointments_table2];
      appointmentsTable?.sort((a, b) => (a.days_left > b.days_left ? 1 : -1));
      setAppTable(appointmentsTable);
      let app_table = [];
      let patient_id = [];
      appointmentsTable?.map((data, index) => {
        if (data?.progress !== "cancelled by user") {
          const start = data?.time?.split(":");
          var timee = new Date(0, 0, 0, start?.[0], start?.[1], 0);
          // const ap_date = data?.date?.split("-");
          // var date = new Date(ap_date?.[0], ap_date?.[1] - 1, ap_date?.[2]);
          // let appointment_date = date?.toLocaleString('en-US', { month: 'short', day: 'numeric' });
          let date = moment(data?.date).format().toString().substring(0, 10);
          let appointment_time = timee?.toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
            minute: "numeric",
          });
          let myobj = {
            user_id: data?.user_id,
            key: data?.id,
            patients: data?.patient_name,
            date: date,
            time: appointment_time,
            type: data?.type,
            typeText: data?.type_text,
            fees: data?.consultation_fee,
            visit_count: data?.user?.appointment_count?.toString(),
            consult: data?.days_left,
            progress: data?.progress,
          };
          app_table?.push(myobj);
          patient_id.push(data?.id);
        }
      });
      const table_data = app_table;
      setTableData(table_data);
    }
  }, [appointmentsTable]);
  const { Option } = Select;

  useEffect(() => {
    addDays();
  }, []);

  const padStart = (val) => {
    return val < 10 ? "0" + val : val;
  };
  const addDays = () => {
    const date = new Date();
    let datesCollection = [];

    for (var i = 0; i < 60; i++) {
      const newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      datesCollection.push(
        `${newDate.getFullYear()}/${padStart(
          newDate.getMonth() + 1
        )}/${padStart(newDate.getDate())}/`
      );
    }
    setDateFilter(datesCollection);
  };

  const formatedDate = datefilter?.map((item, index) => {
    if (index === 0) {
      return (
        moment(new Date(item)).format("ddd") +
        ", " +
        moment(new Date(item)).format("MMM D")
      );
    } else {
      return (
        moment(new Date(item)).format("ddd") +
        ", " +
        moment(new Date(item)).format("MMM D")
      );
    }
  });
  const menuList = [
    {
      link: "#upcoming",
      name: "Upcoming",
    },
    {
      link: "#past",
      name: "Past",
    },
    {
      link: "#cancelled",
      name: "Cancelled",
    },
  ];

  const filters = () => {
    setUpcomingApp(tableData?.filter((app) => app?.type !== "incomplete"));
    setPastApp(tableData?.filter((app) => app?.progress === "completed"));
    setCancelledApp(
      tableData?.filter((app) => app?.progress.includes("cancelled"))
    );
  };

  useEffect(() => {
    filters();
  }, [tableData]);

  const filterAppointment = (type, id) => {
    setActiveKey(id);
    if (activeKey === id) {
      setActiveKey(0);
      filters();
    } else {
      if (location?.search === "?#upcoming" || location?.search === " ") {
        if (type === "video") {
          setUpcomingApp(
            tableData?.filter(
              (app) =>
                app?.progress === "incomplete" && app?.type.includes("schedule")
            )
          );
        } else {
          setUpcomingApp(
            tableData?.filter(
              (app) =>
                app?.progress === "incomplete" && app?.type.includes(type)
            )
          );
        }
      } else if (location?.search === "?#past") {
        if (type === "video") {
          setPastApp(
            tableData?.filter(
              (app) =>
                app?.progress === "completed" && app?.type.includes("schedule")
            )
          );
        } else {
          setPastApp(
            tableData?.filter(
              (app) => app?.progress === "completed" && app?.type.includes(type)
            )
          );
        }
      } else if (location?.search === "?#cancelled") {
        if (type === "video") {
          setCancelledApp(
            tableData?.filter(
              (app) =>
                app?.progress.includes("cancelled") &&
                app?.type.includes("schedule")
            )
          );
        } else {
          setCancelledApp(
            tableData?.filter(
              (app) =>
                app?.progress.includes("cancelled") && app?.type.includes(type)
            )
          );
        }
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDesktopChange = (event, newValue) => {
    setValue(newValue);

    if (newValue === "1") {
      setIsHistoryTabActive(false);
    } else if (newValue === "2") {
      setIsHistoryTabActive(false);
      const data = tableData
        ?.filter(
          (app) =>
            app?.type === "instant-consultation" &&
            !app?.progress.includes("pending")
        )
        ?.sort((a, b) => b?.key - a?.key);

      // const data =

      const pendingInstant = tableData
        ?.filter(
          (d) =>
            d?.type === "instant-consultation" &&
            d?.progress.includes("pending")
        )
        ?.sort((a, b) => a?.key - b?.key);

      if (pendingInstant?.length === 1) {
        pendingInstant[0].canStart = true;
      }

      if (pendingInstant?.length > 1) {
        pendingInstant[1].canStart = false;
      }

      setInstantData(pendingInstant.concat(data));
    } else if (newValue === "3") {
      // setIsHistoryTabActive(true);
      // setHistoryApiLoading(true);
      // API.get(`/doctor/all-appointment?past&page=1`)
      //   .then((response) => {
      //     if (response?.data?.code === 200) {
      //       setHistoryData(response?.data?.data?.data);
      //       setHistoryApiLoading(false);
      //       setTotalHistoryCount(response?.data?.data?.total);
      //       setLastHistoryPage(response?.data?.data?.last_page);
      //     }
      //   })
      //   .catch((err) => {
      //     setHistoryApiLoading(false);
      //   });
      // setHistoryData(
      //   tableData?.filter((app) => (!app?.progress.includes("pending")))?.sort((a,b) => b?.key - a?.key)
      // );
    }
  };

  function handleTypeFilterClickSchedule(e) {
    if (e.key === "3") {
      setScheduleData(tableData);
    } else if (e.key === "in-person") {
      setScheduleData(
        tableData?.filter((app) => app?.type.includes("in-person"))
      );
    } else if (e.key === "video") {
      setScheduleData(
        tableData?.filter((app) => app?.type?.includes("schedule"))
      );
    }
  }

  function handleTypeFilterClickHistory(e) {
    if (e.key === "3") {
      setHistoryData(tableData);
    } else if (e.key === "in-person") {
      setHistoryData(
        tableData?.filter((app) => app?.type.includes("in-person"))
      );
    } else if (e.key === "video") {
      setHistoryData(
        tableData?.filter((app) => app?.type?.includes("schedule"))
      );
    }
  }

  function desktopFiltersChange(e) {
    // console.log(e.target.value, 'desktopFiltersChange' )
    setDesktopFilters(e.target.value);
  }

  function handleDateSlideChangeSchedule(current) {
    const slideElement = slider.current.innerSlider.list.querySelector(
      `[data-index="${current}"]`
    );

    let slideElementText = slideElement?.innerText;

    if (slideElementText?.includes("Today")) {
      slideElementText = slideElementText?.split(",")?.[1]?.trim();
    }

    // console.log(tableData?.filter((app) => app?.date == slideElementText, 'loll'));
    setScheduleData(tableData?.filter((app) => app?.date == slideElementText));
  }

  function handleDateSlideChangeHistory(current) {
    const slideElement = slider.current.innerSlider.list.querySelector(
      `[data-index="${current}"]`
    );

    let slideElementText = slideElement?.innerText;

    if (slideElementText?.includes("Today")) {
      slideElementText = slideElementText?.split(",")?.[1]?.trim();
    }

    // console.log(tableData?.filter((app) => app?.date == slideElementText, 'loll'));
    setHistoryData(
      tableData?.filter((app) => app?.date == slideElementText)
    )?.sort((a, b) => b?.key - a?.key);
  }

  return (
    <>
      {areAppointmentsLoading || userApiLoading || historyApiLoading ? (
        <Loader />
      ) : (
        <div className="appointments_wrapper cover_space">
          {mobile && <StickyTab menuList={menuList} type="a" />}
          {mobile ? (
            <>
              <div className="filter_appointment flex_start">
                <a
                  className={
                    activeKey === "1" ? "single_filter active" : "single_filter"
                  }
                  id="1"
                  onClick={() => filterAppointment("video", "1")}
                >
                  <HeadingDescSmall text="Video Consultation" />
                </a>
                <a
                  className={
                    activeKey === "2" ? "single_filter active" : "single_filter"
                  }
                  id="2"
                  onClick={() => filterAppointment("person", "2")}
                >
                  <HeadingDescSmall text="In-Person Appointment" />
                </a>
                <a
                  className={
                    activeKey === "3" ? "single_filter active" : "single_filter"
                  }
                  id="3"
                  onClick={() => filterAppointment("instant", "3")}
                >
                  <HeadingDescSmall text="Instant Consultation" />
                </a>
              </div>
              <div
                className={
                  mobile
                    ? location?.search?.split("?")[1] === "#upcoming" ||
                      typeof location?.search?.split("?")[1] === "undefined"
                      ? "reviews"
                      : "d-none"
                    : "reviews"
                }
                id="upcoming"
              >
                {upcomingApp?.map((apps) => (
                  <Link
                    to={{
                      pathname: `/appointment/${apps?.id}`,
                      state: {
                        id: apps?.key,
                        type: apps?.type,
                        user_id: apps?.user_id,
                        visit_count: apps?.visit_count,
                      },
                    }}
                  >
                    <div className="single_reviews">
                      <div className="flex_center justify-content-between align-items-start">
                        <div className="column_flex">
                          <HeadingDesc text={apps?.patients} />
                          <HeadingDescSmall
                            text={apps?.date + " " + apps.time}
                          />
                          {/* <CountdowmTimer text="Starts in 6 Hours 53 minutes" /> */}
                        </div>
                        <div className="right_arrow">
                          <HeadingDesc text={apps?.fees} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {/* <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                    <CountdowmTimer text="Starts in 6 Hours 53 minutes" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link>
            <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link>
            <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link> */}
              </div>
              <div
                className={
                  mobile
                    ? location?.search?.split("?")[1] === "#past"
                      ? "reviews"
                      : "d-none"
                    : "reviews"
                }
                id="past"
              >
                {pastApp?.map((apps) => (
                  <Link
                    to={{
                      pathname: `/past-consultation/${apps?.id}`,
                      state: {
                        id: apps?.key,
                        type: apps?.type,
                        user_id: apps?.user_id,
                        visit_count: apps?.visit_count,
                      },
                    }}
                  >
                    <div className="single_reviews">
                      <div className="flex_center justify-content-between align-items-start">
                        <div className="column_flex">
                          <HeadingDesc text={apps?.patients} />
                          <HeadingDescSmall
                            text={apps?.date + " " + apps.time}
                          />
                          {/* <CountdowmTimer text="Starts in 6 Hours 53 minutes" /> */}
                        </div>
                        <div className="right_arrow">
                          <HeadingDesc text={"Rs. " + apps?.fees} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {/* <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                    <CountdowmTimer text="Starts in 6 Hours 53 minutes" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link>
            <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link>
            <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link> */}
              </div>
              <div
                className={
                  mobile
                    ? location?.search?.split("?")[1] === "#cancelled"
                      ? "reviews"
                      : "d-none"
                    : "reviews"
                }
                id="cancelled"
              >
                {cancelledApp?.map((apps) => (
                  <Link
                    to={{
                      pathname: `/past-consultation/${apps?.id}`,
                      state: {
                        id: apps?.key,
                        type: apps?.type,
                        user_id: apps?.user_id,
                        visit_count: apps?.visit_count,
                      },
                    }}
                  >
                    <div className="single_reviews">
                      <div className="flex_center justify-content-between align-items-start">
                        <div className="column_flex">
                          <HeadingDesc text={apps?.patients} />
                          <HeadingDescSmall
                            text={apps?.date + " " + apps.time}
                          />
                          {/* <CountdowmTimer text="Starts in 6 Hours 53 minutes" /> */}
                        </div>
                        <div className="right_arrow">
                          <HeadingDesc text={apps?.fees} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {/* <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                    <CountdowmTimer text="Starts in 6 Hours 53 minutes" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link>
            <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link>
            <Link to="appointment-detail">
              <div className="single_reviews">
                <div className="flex_center justify-content-between align-items-start">
                  <div className="column_flex">
                    <HeadingDesc text="Nadia Khursheed Ahmed" />
                    <HeadingDescSmall text="Today, Apr 7 - 9:45 am" />
                  </div>
                  <div className="right_arrow">
                    <HeadingDesc text="Rs. 1500" />
                  </div>
                </div>
              </div>
            </Link> */}
              </div>
            </>
          ) : (
            <div className="overflow_div appointments-table">
              <Container>
                <HeadingWithSpaceLarge text="YOUR APPOINTMENTS" />
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box>
                      <TabList onChange={handleDesktopChange} aria-label="">
                        <Tab label="Schedule" value="1" />
                        <Tab label="Instant" value="2" />
                        <Tab label="History" value="3" />
                      </TabList>
                      <div className="d-flex forCustomP">
                        {/* <select value={desktopFilters} onChange={desktopFiltersChange}>
                    <option>Filter By Type</option>
                    <option value="all">All</option>
                    <option value="in-person">In Person</option>
                    <option value="video">Video</option>
                  </select> */}

                        {value === "1" || value === "3" ? (
                          <>
                            {value === "1" ? (
                              <AppointmentTypeFilter
                                onTypeFilterClick={
                                  handleTypeFilterClickSchedule
                                }
                              />
                            ) : (
                              value === "3" && (
                                <AppointmentTypeFilter
                                  onTypeFilterClick={
                                    handleTypeFilterClickHistory
                                  }
                                />
                              )
                            )}

                            {value === "1" ? (
                              <Slider
                                prevArrow={
                                  <RiArrowLeftSLine className="arrow_grey" />
                                }
                                nextArrow={
                                  <RiArrowRightSLine className="arrow_grey" />
                                }
                                className="first_slider"
                                {...simpleSliderSettings}
                                afterChange={handleDateSlideChangeSchedule}
                                ref={slider}
                              >
                                {datesArray?.map((d, index) => {
                                  if (index === 0) {
                                    d = "Today, " + d;
                                  }
                                  return (
                                    <div key={index}>
                                      <HeadingDescVsmall
                                        text={d}
                                      ></HeadingDescVsmall>
                                    </div>
                                  );
                                })}
                              </Slider>
                            ) : (
                              value === "3" && (
                                <Slider
                                  prevArrow={
                                    <RiArrowLeftSLine className="arrow_grey" />
                                  }
                                  nextArrow={
                                    <RiArrowRightSLine className="arrow_grey" />
                                  }
                                  className="first_slider"
                                  {...simpleSliderSettings}
                                  afterChange={handleDateSlideChangeHistory}
                                  ref={slider}
                                >
                                  {datesArray?.map((d, index) => {
                                    if (index === 0) {
                                      d = "Today, " + d;
                                    }
                                    return (
                                      <div key={index}>
                                        <HeadingDescVsmall
                                          text={d}
                                        ></HeadingDescVsmall>
                                      </div>
                                    );
                                  })}
                                </Slider>
                              )
                            )}
                          </>
                        ) : (
                          <div className="instant_consult">
                            <div className="flex_center gap">
                              <HeadingDescSmall text="Instant Consultation" />
                              <Switch
                                className="ms-2 is-online-switch"
                                checked={isOnline}
                                onChange={onCheckboxChange}
                              />
                            </div>
                          </div>
                        )}

                        {/* <select>
                    <option value="date">Today, 9/11/2022</option>
                    <option>All</option>
                    <option>In Person</option>
                    <option>Video</option>
                  </select> */}
                      </div>
                      {/* <SimpleSlider
                      date={formatedDate}
                      header={appHeader}
                      bodyData={scheduleData}

                    >
                    </SimpleSlider> */}
                    </Box>
                    <TabPanel value="1" className="p-0">
                      <TableComponent
                        header={appHeader}
                        data={scheduleData}
                        pagination={true}
                      />
                    </TabPanel>
                    <TabPanel value="2" className="p-0">
                      <TableComponent
                        header={instantHeader}
                        data={instantData}
                        pagination={instantPaginationOptions}
                      />
                      {/* <Pagination
        current={instantPage}
        onChange={handleInstantPageChange}
        total={totalInstantCount} // total number of items
        pageSize={10} // number of items per page
      /> */}
                    </TabPanel>
                    <TabPanel value="3" className="p-0">
                      <TableComponent
                        header={historyHeader}
                        data={historyData}
                        pagination={historyPaginationOptions}
                      />
                      {/* <Pagination
                        current={historyPage}
                        onChange={handleHistoryPageChange}
                        total={totalHistoryCount} // total number of items
                        pageSize={10} // number of items per page
                      /> */}
                    </TabPanel>
                  </TabContext>
                </Box>
              </Container>
              <AntModal
                className="consultaionEndedModal"
                title=""
                centered
                visible={showWarningModal}
                onOk={() => {
                  setShowWarningModal(false);
                }}
                cancelButtonProps={{ style: { display: "none" } }}
                footer={[
                  <Button
                    className="col-md-9 m-auto"
                    key="info"
                    onClick={() => {
                      setShowWarningModal(false);
                    }}
                  >
                    Okay
                  </Button>,
                ]}
              >
                <div className="col-md-8 m-auto text-center">
                  <img
                    src={disableConsultation}
                    alt=""
                    className="img-fluid mb-3"
                  />
                  <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500 mb-3">
                    Instant Consultation disabled
                  </h5>
                  <p className="ff-circular fw-300 fs-17 line-height-24 mb-3">
                    Your instant consultation bookings will be temporarily
                    disabled.{" "}
                  </p>
                  <p className="ff-circular fw-300 fs-17 line-height-24">
                    Please attend to the next patient in queue.
                  </p>
                </div>
              </AntModal>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default React.memo(Appointments);
