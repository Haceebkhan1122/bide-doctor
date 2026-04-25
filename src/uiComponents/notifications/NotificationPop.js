import React from "react";
import "./NotificationPop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/fontawesome-free-solid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BlueNotificationBell from "../../assets/images/svg/blueNotification.svg";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { BsCheckCircle } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import API from "../../utils/customAxios";

const NotificationPop = ({ notifications, setMarkAsReadSignal }) => {
  const [value, setValue] = React.useState("all");

  const history = useHistory();

  const AllNotifications = () => {
    history.push("/notifications");
    sessionStorage.removeItem("defaultOpenTab");
  };

  const AllNotificationsUnread = () => {
    history.push("/notifications");
    sessionStorage.setItem("defaultOpenTab", "1");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const markNotificationAsRead = async (e, notification_id) => {
    if (!notification_id) {
      try {
        const response = await API.get(
          `/markRead-notifications/999?mark_all=true`
        );

        if (response?.code === 200) {
          setMarkAsReadSignal(true);
        }
      } catch (error) {}
    } else {
      try {
        const response = await API.get(
          `/markRead-notifications/${notification_id}`
        );

        if (response?.code === 200) {
          setMarkAsReadSignal(true);
        }
      } catch (error) {}
    }
  };

  return (
    <div className="notification-icon-open">
      <div className=" for-scroll-notification">
        <Box>
          <TabContext value={value}>
            <div className="d-flex align-items-center justify-content-between p-3 pb-0">
              <Box className="notifications-tabss d-flex align-items-center">
                <h5 className="fs-14 ff-circular line-height-20 fw-500">
                  Notifications
                </h5>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="secondary tabs example"
                >
                  <Tab value="all" label="All" />
                  <Tab value="unread" label="Unread" />
                </Tabs>
              </Box>
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={(e) => markNotificationAsRead(e)}
              >
                <p className="fs-14  line-height-20 ff-Circular me-2 fw-400 word-spacing-inverse ff-circular">
                  Mark all as read
                </p>
                <BsCheckCircle />
              </div>
            </div>
            {!notifications || notifications?.notifications?.length === 0 ? (
              <div className="d-flex align-items-center justify-content-center text-center p-4">
                <div>
                  <img
                    src={BlueNotificationBell}
                    alt="notification bell"
                    className="img-fluid mb-3"
                  />
                  <h4 className="mb-2 fs-16 line-height-20 fw-400 ff-circular color-313131">
                    No notifications yet.
                  </h4>
                  <p className="fs-16 line-height-20 ff-circular color-1A1F36">
                    Notifications about your activity will show up here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <TabPanel value="all">
                  {notifications?.notifications?.slice(0, 3).map((item) => (
                    <>
                      <div
                        className="innerCardNotification pb-3 border-bottom"
                        style={{ cursor: "pointer", padding: "1.5rem" }}
                        onClick={(e) => {
                          markNotificationAsRead(e, item?.id);
                        }}
                      >
                        <div className="d-flex unreadNotifications">
                          {item?.read_status == 0 && (
                            <div className="newNotificationCircle position-relative"></div>
                          )}

                          <div className="bellIcons">
                            {/* <FontAwesomeIcon icon={faBell} /> */}
                            {item?.read_status == 0 && (
                              <img src={BlueNotificationBell} />
                            )}
                            {item?.read_status == 1 && (
                              <FontAwesomeIcon icon={faBell} />
                            )}
                          </div>
                          <div className="detailsNotifications">
                            <p className="fs-14 color-313131">
                              <strong className="fw-400 color-404040 d-block">
                                {item?.title}:
                              </strong>
                              {item?.text}
                            </p>
                            <p style={{ paddingTop: "15px" }}>
                              {item?.created_at}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ borderBottom: "0.3px solid #828282" }}
                      ></div>
                    </>
                  ))}
                  {notifications?.notifications?.length > 3 ? (
                    <div className="text-uppercase see-all">
                      <h5
                        style={{ cursor: "pointer" }}
                        onClick={AllNotifications}
                      >
                        see all
                      </h5>
                    </div>
                  ) : null}

                  {/* <div className="innerCardNotification p-4 border-bottom bgActiveNotification">
                    <div className="d-flex unreadNotifications">
                      <div className="newNotificationCircle position-relative"></div>
                      <div className="bellIcons">
                        <FontAwesomeIcon icon={faBell} />
                      </div>
                      <div className="detailsNotifications">
                        <p className="fs-14 color-313131">
                          <strong className="fw-400 color-404040">
                            Your subscription will expire in 7 days.
                          </strong>
                        </p>
                        <div className="d-flex">
                          <a
                            class="share-record-button mt-3 px-3 text-white me-3"
                            href="javascript:void(0)"
                          >
                            Renew subscription
                          </a>
                        </div>
                        <div className="timeMinutes mt-3">
                          <p className="fs-14 fw-400 color-404040">
                            Yesterday at 15:30
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="innerCardNotification p-4 border-bottom oldReadNotifications">
                    <div className="d-flex unreadNotifications">
                      <div className="bellIcons">
                        <FontAwesomeIcon icon={faBell} />
                      </div>
                      <div className="detailsNotifications">
                        <p className="fs-14 color-313131">
                          <strong className="fw-400 color-404040">
                            Recommended Article:
                          </strong>
                          Beat the Heat: What Happens When Heat, Sweat and Skin
                          Collide...
                        </p>
                        <div className="timeMinutes mt-3">
                          <p className="fs-14 fw-400">14 Nov at 10:27</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="innerCardNotification p-3 d-flex align-items-center justify-content-center">
                    <Link
                      className="text-uppercase see-all-color fw-600 ff-circular"
                      to={'/notifications'}
                    >
                      See All
                    </Link>
                  </div> */}
                </TabPanel>
                <TabPanel value="unread">
                  {notifications?.notifications
                    ?.slice(0, 4)
                    .filter((n) => n?.read_status == 0)
                    ?.map((item) => (
                      <>
                        <div
                          className="innerCardNotification p-4 border-bottom"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            markNotificationAsRead(e, item?.id);
                          }}
                        >
                          <div className="d-flex unreadNotifications">
                            <div className="newNotificationCircle position-relative"></div>
                            <div className="bellIcons">
                              {item?.read_status == 0 && (
                                <img src={BlueNotificationBell} />
                              )}
                            </div>
                            <div className="detailsNotifications">
                              <p className="fs-14 color-313131">
                                <strong className="fw-400 color-404040">
                                  {item?.title}:
                                </strong>
                                {item?.sub_title}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{ borderBottom: "0.3px solid #828282" }}
                        ></div>
                      </>
                    ))}
                  {notifications?.unread_count > 3 ? (
                    <div className="text-uppercase see-all">
                      <h5
                        style={{ cursor: "pointer" }}
                        onClick={AllNotificationsUnread}
                      >
                        see all
                      </h5>
                    </div>
                  ) : notifications?.unread_count === 0 ? (
                    <div className="text-center py-3">
                      <p> No unread messages</p>
                    </div>
                  ) : null}
                </TabPanel>
              </>
            )}
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default NotificationPop;
