import React, { useState, useRef, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { HeadingDescSmall } from "../Headings";
import { Select, TimePicker, Form, Checkbox } from "antd";
import { HiOutlineArrowDown } from "react-icons/hi";
import CheckboxComponent from "../checkboxComponent/checkboxComponent";
import { postClinicRecord } from "../../pages/health-clinics/redux/thunk";
import { useSelector } from "react-redux";
import { selectClinic } from "../../pages/health-clinics/redux/slice";
import { GiCancel, GiCurlingVines } from "react-icons/gi";
import "./_AddTimeForm.scss";
import moment from "moment";
import { toast } from "react-toastify";

function AddTimeForm(props) {
  const [timeForm] = Form.useForm();
  const clinic = useSelector(selectClinic);
  let dropdown_data = []

  const refer = useRef();
  const { updateTime } = props;
  const [start_time, setStart] = useState("");
  const [end_time, setEnd] = useState("");
  const [day, setDay] = useState("");
  const [fields, setFields] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  // var arr = []
  const [arr, setArr] = useState([]);
  const [arr2, setArr2] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [preCheck, setPreCheck] = useState([]);
  const [mobile, setMobile] = useState(false)
  let arr3 = [];
  let vals = []

  let checkboxes = [];
  const onChecked = (checked) => {
    if (checked.target.checked) {
      if (checkboxes.includes(checked.target.value) === false) {
        checkboxes.push(checked.target.value);
      }
    } else {
      if (checkboxes.includes(checked.target.value)) {
        let ind = checkboxes.indexOf(checked.target.value)
        checkboxes.splice(ind, 1)
      }
    }
    if (checkboxes.length === arr2.length) {
      setCheckAll(checkboxes.length === arr2.length)
    }
    else {
      setCheckAll(false)
    }
  };

  const onCheckAllChange = (checked) => {
    if (checked.target.checked) {
      checkboxes.push(...arr2);
      for (let i = 0; i < checkboxes.length; i++) {
        arr3.push(<Checkbox
          key={i}
          name={"timeslot" + [i.toString()]}
          value={checkboxes[i]}
          onChange={onChecked}
          defaultChecked={checkboxes.includes(arr[i]) ? false : true}
        >
          {checkboxes[i]}
        </Checkbox>)
      }
      setCheckAll(checkboxes.length === arr2.length)
      setArr(arr3)
    } else {
      checkboxes.pop(...arr2)
      for (let i = 0; i < arr2.length; i++) {
        arr3.push(<Checkbox
          key={i}
          name={"timeslot" + [i.toString()]}
          value={arr2[i]}
          onChange={onChecked}
          defaultChecked={checkboxes.includes(arr[i]) ? true : false}
        >
          {arr2[i]}
        </Checkbox>)
      }
      setCheckAll(false)
      setArr(arr3)
    }
  }

  const getDateGap = () => {
    let start = []
    let end = []
    if (props?.timings) {
      dropdown_data.map((item, index) => {
        let days = Object.keys(item).filter(k => k.startsWith('day'))
        days.map((day, ind) => {

          let start_time1 = Object.keys(item).filter(k => k.startsWith('start_time' + day.slice(-1)))
          let end_time1 = Object.keys(item).filter(k => k.startsWith('end_time' + day.slice(-1)))
          let prechecked = []
          let prechecked_12 = []

          start_time1?.map((st_time) => {
            prechecked_12.push(item[st_time])
            let [pre, mod_pre] = item[st_time].split(' ')
            let [hour_pre, minute_pre] = pre.split(':');

            if (mod_pre === "PM") {
              hour_pre = parseInt(hour_pre, 10) + 12;
            }

            prechecked.push([hour_pre.toString(), minute_pre])
          })

          let start_time = start_time1[0]
          let end_time = start_time1[start_time1.length - 1]

          let [hs, mod_s] = item[start_time].split(' ')
          let [hour_s, minute_s] = hs.split(':');

          let [he, mod_e] = item[end_time].split(' ')
          let [hour_e, minute_e] = he.split(':');

          if (mod_s === "PM") {
            if (parseInt(hour_s) !== 12) {
              hour_s = parseInt(hour_s, 10) + 12;
            }
          }
          if (mod_e === "PM") {
            if (parseInt(hour_e) !== 12) {
              hour_e = parseInt(hour_e, 10) + 12;
            }
          }
          start.push([hour_s.toString(), minute_s])

          end.push([hour_e.toString(), minute_e])
          var startDate = new Date(0, 0, 0, start[0][0], start[0][1], 0);
          var endDate = new Date(0, 0, 0, end[0][0], end[0][1], 0);
          var diff = endDate.getTime() - startDate.getTime();

          var hours = Math.floor(diff / 1000 / 60 / 60);
          if (hours < 0) {
            hours += 24;
          }
          // var minutes = hours * 60;
          var minutes = Math.floor(diff / 60000);
          var tim = []
          let times = [];
          let times_checked = [];
          for (let i = parseInt(start[0][1]); i <= minutes; i += parseInt(props.time)) {
            // arr.push(i)
            var date = new Date(0, 0, 0, start[0][0], i, 0);
            times.push(date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
            // arr.push(date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}))
            // arr.push(...<CheckboxComponent text={date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})} />))
            tim.push(
              date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            );
          }
          setArr2(tim)

          var datee = new Date(0, 0, 0, parseInt(times?.[times.length - 1]?.split(":")[0]), parseInt(times?.[times.length - 1]?.split(":")[1]) + parseInt(props?.time), 0);
          times.push(datee.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
          if (tim[tim.length - 1] != item[start_time1[start_time1.length - 1]]) {
            var dateee = new Date(0, 0, 0, parseInt(times?.[times.length - 2]?.split(":")[0]), parseInt(times?.[times.length - 2]?.split(":")[1]) + parseInt(props?.time), 0);
            tim.push(dateee.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
            var ddd = new Date(0, 0, 0, parseInt(times?.[times.length - 1]?.split(":")[0]), parseInt(times?.[times.length - 1]?.split(":")[1]) + parseInt(props?.time), 0);
            times.push(ddd.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
          }
          for (let i = 0; i < tim.length; i++) {
            arr3.push(
              <Checkbox
                key={i}
                name={"timeslot" + [i.toString()]}
                value={tim[i]}
                onChange={onChecked}
                defaultChecked={prechecked_12.includes(tim[i]) ? true : false}
              >
                {tim[i]}
              </Checkbox>
            )
            if (checkboxes.includes(times[i]) === false) {
              prechecked_12.includes(tim[i]) && checkboxes.push(times[i])
            }
            // const updated = [...arr, <CheckboxComponent key={i} text={tim[i]} />]
            // setArr(updated);
          }
          setArr2(tim);
          let check_no = 'check' + ind
          checkbox[check_no] = arr3
          setCheckbox(checkbox)

          let prec = []
          prechecked?.map((pr) => {
            prec.push(pr[0] + ":" + pr[1])
          })

          prec?.map((st_time, index) => {
            let ind = times.indexOf(st_time)
            let dd = item[day]
            let timings = {
              day: dd,
              start_time: st_time,
              end_time: times[ind + 1],
              is_physical: props?.type === "online" ? 0 : 1,
              checkboxes: checkboxes,
            }
            updateTime(timings, checkboxes);
            start = []
            end = []
            arr3 = []
          })
        })
      })
    }
    else {
      if (start_time === end_time) {
        toast.error("Start Time and End Time cannot be same!")
        arr3 = []
        setArr(arr3);
      }
      else {
        start.push(start_time.split(":"));
        end.push(end_time.split(":"));
        if (parseInt(end[0][0]) - parseInt(start[0][0]) < 0) {
          end[0][0] = (parseInt(end[0][0]) + 24).toString()
        }
        var startDate = new Date(0, 0, 0, start[0][0], start[0][1], 0);
        var endDate = new Date(0, 0, 0, end[0][0], end[0][1], 0);
        if (startDate.getDate() === endDate.getDate()) {
          var diff = endDate.getTime() - startDate.getTime();
          var hours = Math.floor(diff / 1000 / 60 / 60);
          if (hours < 0) {
            hours += 24;
          }
          // var minutes = hours * 60;
          var minutes = Math.floor(diff / 60000);
          let tim = []
          let times = []
          for (let i = parseInt(start[0][1]); i <= minutes + parseInt(start[0][1]); i += parseInt(props.time)) {
            // arr.push(i)
            var date = new Date(0, 0, 0, start[0][0], i, 0);
            // arr.push(date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}))
            // arr.push(...<CheckboxComponent text={date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})} />))
            times.push(date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
            tim.push(
              date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            );
          }
          var datee = new Date(0, 0, 0, parseInt(times?.[times.length - 1]?.split(":")[0]), parseInt(times?.[times.length - 1]?.split(":")[1]) + parseInt(props.time), 0);
          times.push(datee.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
          setArr2(tim)
          for (let i = 0; i < tim.length; i++) {
            // props?.timings ?
            //   (arr3.push(
            //     <Checkbox
            //       key={i}
            //       name={"timeslot" + [i.toString()]}
            //       value={tim[i]}
            //       onChange={onChecked}
            //       checked={i === 0 ? true : false}
            //     >
            //       {tim[i]}
            //     </Checkbox>
            //   )) : (
            arr3.push(
              <Checkbox
                key={i}
                name={"timeslot" + [i.toString()]}
                value={tim[i]}
                onChange={onChecked}
                defaultChecked={true}
              >
                {tim[i]}
              </Checkbox>)
            if (checkboxes.includes(tim[i]) === false) {
              checkboxes.push(tim[i])
            }
            // )
            // const updated = [...arr, <CheckboxComponent key={i} text={arr2[i]} />]
            // setArr(updated);
          }
          setArr2(tim);
          setArr(arr3);
          setCheckAll(true)

          tim?.map((st_time, index) => {
            let ind = tim.indexOf(st_time)
            let timings = {
              day: day,
              start_time: times[ind],
              end_time: times[ind + 1],
              is_physical: props?.type === "online" ? 0 : 1,
              checkboxes: checkboxes,
            }
            updateTime(timings, checkboxes);
          })


          // const val = {
          //   ...fields,
          //   day,
          //   start_time,
          //   end_time,
          //   is_physical: 1,
          //   checkboxes,
          // };
          // console.log(val)
          // updateTime(val, checkboxes);
        } else {
          if (start[0].length > 1 && end[0].length > 1) {
            toast.error("Select Valid Timings")
            arr3 = []
            setArr(arr3);
          }
        }
      }
    }
    // // console.log(arr)

    // const start_time = new Date ('1/1/1999 ' + start_time).getTime();
    // const end_time = new Date ('1/1/1999 ' + end_time).getTime();
    // const diff = Math.abs(end_time - start_time);
    // // console.log(diff);
    // const days = Math.round(diff / 60000);
    // // console.log(days);
    // const arr = []
    // for (let i=30; i< days-1; i+=30) {
    //     arr.push(i)
    // }
    // // console.log(arr)
    // return days;
  };

  // const addClinic = () => {
  //   const time = [];
  //   arr.map((data) => {
  //     time.push(data.props.text);
  //   });

  //   const timing = { [day]: time };
  //   // console.log(timing);
  //   dispatch(setClinic(timing));

  // };

  const submitClinic = () => {

    getDateGap();
    // if (props?.timings) {
    //   // let days = Object.keys(dropdown_data[0]).filter(item => item.startsWith('day'))
    //   // let st_time = Object.keys(dropdown_data[0]).filter(item => item.startsWith('start_time'))
    //   // let e_time = Object.keys(dropdown_data[0]).filter(item => item.startsWith('end_time'))

    //   // console.log(dropdown_data[0][days[0]])
    //   // days?.map((da) => (
    //   //   val.day = dropdown_data[0][da],
    //   //   val.start_time = dropdown_data[0][st_time[0]],
    //   //   val.end_time = dropdown_data[0][e_time[e_time.length - 1]],
    //   //   val.is_physical = 1,
    //   //   val.checkboxes = checkboxes
    //   // ))
    //   // updateTime(vals, checkboxes);
    // } else {
    //   const val = {
    //     ...fields,
    //     day,
    //     start_time,
    //     end_time,
    //     is_physical: 1,
    //     checkboxes,
    //   };
    //   console.log(val)
    //   updateTime(val, checkboxes);
    // }
  };

  const { Option } = Select;

  const removeComponent = (e) => {
    props?.removeTime(props?.type == "online" ? 'online' : 'physical', e)
  };

  // timeForm.setFieldsValue({dropdown_data});

  let dropdown_data2 = {}
  const editing = () => {
    if (props?.timings) {
      props?.timings?.map((item, index) => {
        let days = "day" + index;
        let start_time = "start_time" + index;
        let end_time = "end_time" + index;
        dropdown_data2[days] = item?.day;
        item?.data?.map((item2, index2) => {
          dropdown_data2[start_time] = item2?.start_time;
          dropdown_data2[end_time] = item2?.end_time;
          start_time = "start_time" + index + index2
          end_time = "end_time" + index + index2
        })
      })
      dropdown_data.push(dropdown_data2)
      timeForm.setFieldsValue({ ...dropdown_data2 });
      // getDateGap()
      if (i < c) {
        submitClinic()
        i++
      }
    }
  }
  let c = 1
  let i = 0
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        setMobile(true)
      }
    }
    editing()
  }, []);

  useEffect(() => {
    setPreCheck(checkbox)
  }, [checkbox]);

  return (
    <>
      {props?.timings ? (
        <>
          {props?.timings?.map((times, index) => (
            <div className="addTimeForm" id={props?.id} key={props?.id}>
              <Form
                form={timeForm}
                ref={refer}
                layout="vertical"
                onFinish={submitClinic}
              >
                <Row>
                  <Col lg={4}>
                    <Form.Item
                      name={"day" + index}
                      id={"day" + index}
                      label="Select Day"
                    >
                      {/* <p className="labelText">Select Day</p> */}
                      <Select dropdownAlign={{ offset: [0, 4] }}
                        value={times?.day}
                        onChange={(value) => {
                          setDay(value);
                        }}
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        className="c_select"
                      >
                        {/* {props.timings?.map((day, index) => (
                          <Option value={day} key={index}>
                            {day}
                          </Option>
                        ))} */}

                        <Option value="monday">Monday</Option>
                        <Option value="tuesday">Tuesday</Option>
                        <Option value="wednesday">Wednesday</Option>
                        <Option value="thursday">Thursday</Option>
                        <Option value="friday">Friday</Option>
                        <Option value="saturday">Saturday</Option>
                        <Option value="sunday">Sunday</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {mobile ?
                    <Row>
                      <Col xs={6}>
                        <Form.Item
                          name={"start_time" + index}
                          id={"start_time" + index}
                          label="Start Time"
                        >
                          <Form.Item>
                            <TimePicker
                              key={index}
                              className="start_time c_select"
                              // defaultValue={moment(props.timings[times][0], 'HH:mm')}
                              defaultValue={moment(times?.data?.[0]?.start_time, 'h:mm:A')}
                              use12Hours
                              format="h:mm A"
                              placeholder=""
                              suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                              // onChange={onChange(value, timeString, setStart)}
                              onChange={(value, timeString) => {
                                let dd = new Date("1/1/2013 " + timeString)
                                let time = dd.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                })
                                // const matches = timeString
                                //   .toLowerCase()
                                //   .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                                // console.log(matches)
                                // const output =
                                //   parseInt(matches[1]) +
                                //   ((matches[3] === "am" && matches[1] === "12"
                                //     ? -12
                                //     : 0) ||
                                //     (matches[3] === "pm" && matches[1] === "12"
                                //       ? 0
                                //       : 0) ||
                                //     (matches[3] === "am" ? 0 : 12)) +
                                //   ":" +
                                //   matches[2];
                                // // console.log(output);
                                setStart(time);
                                refer.current.submit();
                              }}
                              onSelect={(value, timeString) => {
                                let dd = new Date("1/1/2013 " + timeString)
                                let time = dd.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                })
                                setStart(time);
                                refer.current.submit();
                              }}
                            />
                          </Form.Item>
                        </Form.Item>
                      </Col>
                      <Col xs={6}>
                        <div className="flex_start align_item_start">
                          <Form.Item
                            name={"end_time" + index}
                            id={"end_time" + index}
                            label="End Time"
                          >
                            <Form.Item>
                              <TimePicker
                                key={index}
                                className="end_time c_select"
                                use12Hours
                                defaultValue={moment(times?.data?.[times?.data?.length - 1]?.start_time, 'h:mm:A')}
                                format="h:mm A"
                                placeholder=""
                                suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                                onChange={(value, timeString) => {
                                  let dd = new Date("1/1/2013 " + timeString)
                                  let time = dd.toLocaleString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false,
                                  })
                                  // .toLowerCase()
                                  // .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                                  // const matches = timeString
                                  // const output =
                                  //   parseInt(matches[1]) +
                                  //   ((matches[3] === "am" && matches[1] === "12"
                                  //     ? -12
                                  //     : 0) ||
                                  //     (matches[3] === "pm" && matches[1] === "12"
                                  //       ? 0
                                  //       : 0) ||
                                  //     (matches[1] !== "12" && matches[3] !== "am"
                                  //       ? 12
                                  //       : 0)) +
                                  //   ":" +
                                  //   matches[2];
                                  // // console.log(output);
                                  setEnd(time);
                                  refer.current.submit();
                                }}

                                onSelect={(value, timeString) => {
                                  let dd = new Date("1/1/2013 " + timeString)
                                  let time = dd.toLocaleString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false,
                                  })
                                  setStart(time);
                                  refer.current.submit();
                                }}
                              />
                            </Form.Item>
                          </Form.Item>
                          {parseInt(props?.id) > 0 && <div id={index} onClick={() => removeComponent(props?.id)}><GiCancel className="cross_icon" /></div>}
                        </div>
                      </Col>
                    </Row>
                    :
                    <>
                      <Col lg={4}>
                        <Form.Item
                          name={"start_time" + index}
                          id={"start_time" + index}
                          label="Start Time"
                        >
                          <Form.Item>
                            <TimePicker
                              key={index}
                              className="start_time c_select"
                              // defaultValue={moment(props.timings[times][0], 'HH:mm')}
                              defaultValue={moment(times?.data?.[0]?.start_time, 'h:mm:A')}
                              use12Hours
                              format="h:mm A"
                              placeholder=""
                              suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                              // onChange={onChange(value, timeString, setStart)}
                              onChange={(value, timeString) => {
                                let dd = new Date("1/1/2013 " + timeString)
                                let time = dd.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                })
                                // const matches = timeString
                                //   .toLowerCase()
                                //   .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                                // console.log(matches)
                                // const output =
                                //   parseInt(matches[1]) +
                                //   ((matches[3] === "am" && matches[1] === "12"
                                //     ? -12
                                //     : 0) ||
                                //     (matches[3] === "pm" && matches[1] === "12"
                                //       ? 0
                                //       : 0) ||
                                //     (matches[3] === "am" ? 0 : 12)) +
                                //   ":" +
                                //   matches[2];
                                // // console.log(output);
                                setStart(time);
                                refer.current.submit();
                              }}
                              onSelect={(value, timeString) => {
                                let dd = new Date("1/1/2013 " + timeString)
                                let time = dd.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                })
                                setStart(time);
                                refer.current.submit();
                              }}
                            />
                          </Form.Item>
                        </Form.Item>
                      </Col>
                      <Col lg={4}>
                        <div className="flex_start align_item_start">
                          <Form.Item
                            name={"end_time" + index}
                            id={"end_time" + index}
                            label="End Time"
                          >
                            <Form.Item>
                              <TimePicker
                                key={index}
                                className="end_time c_select"
                                use12Hours
                                defaultValue={moment(times?.data?.[times?.data?.length - 1]?.start_time, 'h:mm:A')}
                                format="h:mm A"
                                placeholder=""
                                suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                                onChange={(value, timeString) => {
                                  let dd = new Date("1/1/2013 " + timeString)
                                  let time = dd.toLocaleString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false,
                                  })
                                  // .toLowerCase()
                                  // .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                                  // const matches = timeString
                                  // const output =
                                  //   parseInt(matches[1]) +
                                  //   ((matches[3] === "am" && matches[1] === "12"
                                  //     ? -12
                                  //     : 0) ||
                                  //     (matches[3] === "pm" && matches[1] === "12"
                                  //       ? 0
                                  //       : 0) ||
                                  //     (matches[1] !== "12" && matches[3] !== "am"
                                  //       ? 12
                                  //       : 0)) +
                                  //   ":" +
                                  //   matches[2];
                                  // // console.log(output);
                                  setEnd(time);
                                  refer.current.submit();
                                }}

                                onSelect={(value, timeString) => {
                                  let dd = new Date("1/1/2013 " + timeString)
                                  let time = dd.toLocaleString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false,
                                  })
                                  setStart(time);
                                  refer.current.submit();
                                }}
                              />
                            </Form.Item>
                          </Form.Item>
                          {parseInt(props?.id) > 0 && <div id={index} onClick={() => removeComponent(props?.id)}><GiCancel className="cross_icon" /></div>}
                        </div>
                      </Col>
                    </>
                  }
                </Row>
                <Row>
                  <HeadingDescSmall text="Selected Time slots" />
                  <div className="checkbox_container flex_start">
                    {/* {arr} */}
                    {Object.keys(checkbox)?.map((check_key) => {
                      if (check_key == 'check' + index) {
                        return checkbox[check_key]
                      }
                      // let tim = Object.keys(ch).filter(k => k.startsWith('check'+index));
                      // console.log(ch[tim])
                      // return ch[tim]
                    })}
                    {/* {arr.map((time, index) => (<CheckboxComponent key={index.toString()} text={time} />))} */}
                    {/* <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" />
            <CheckboxComponent text="9:30 AM" /> */}
                  </div>
                </Row>
                {/* <button type="submit">ewerew</button> */}
              </Form>
            </div>
          ))}
        </>
      ) : (
        <div className="addTimeForm" id={props.id}>
          <Form
            form={timeForm}
            ref={refer}
            layout="vertical"
            onFinish={submitClinic}
          >
            <Row>
              <Col lg={4}>
                <Form.Item name="day" label="Select Day">
                  {/* <p className="labelText">Select Day</p> */}
                  <Select dropdownAlign={{ offset: [0, 4] }}
                    onChange={(value) => {
                      setDay(value);
                    }}
                    suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                    className="c_select"
                  >
                    <Option value="monday">Monday</Option>
                    <Option value="tuesday">Tuesday</Option>
                    <Option value="wednesday">Wednesday</Option>
                    <Option value="thursday">Thursday</Option>
                    <Option value="friday">Friday</Option>
                    <Option value="saturday">Saturday</Option>
                    <Option value="sunday">Sunday</Option>
                  </Select>
                </Form.Item>
              </Col>
              {mobile ?
                <Row>
                  <Col xs={6}>
                    <Form.Item name="start_time" label="Start Time">
                      <Form.Item>
                        <TimePicker
                          className="start_time c_select"
                          use12Hours
                          format="h:mm A"
                          placeholder=""
                          suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                          // onChange={onChange(value, timeString, setStart)}
                          onChange={(value, timeString) => {
                            let dd = new Date("1/1/2013 " + timeString)
                            let time = dd.toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: false,
                            })
                            // const matches = timeString
                            //   .toLowerCase()
                            //   .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                            // const output =
                            //   parseInt(matches[1]) +
                            //   (((matches[3] === "am" && matches[1] === "12")
                            //     ? -12
                            //     : 0) ||
                            //     ((matches[3] === "pm" && matches[1] ==="12")
                            //       ? parseInt(matches[1])-0
                            //       : 0) ||
                            //     ((matches[3] === "am") ? 0 : 12)) +
                            //   ":" +
                            //   matches[2];
                            // console.log(output);
                            setStart(time);
                            refer.current.submit();
                          }}
                        />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                  <Col xs={6}>
                    <div className="flex_start align_item_start">
                      <Form.Item name="end_time" label="End Time">
                        <Form.Item>
                          <TimePicker
                            className="end_time c_select"
                            use12Hours
                            format="h:mm A"
                            placeholder=""
                            suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                            onChange={(value, timeString) => {
                              let dd = new Date("1/1/2013 " + timeString)
                              let time = dd.toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: false,
                              })
                              //   const matches = timeString
                              //     .toLowerCase()
                              //     .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                              // console.log(matches)
                              // const output =
                              //     parseInt(matches[1]) +
                              //     ((matches[3] === "am" && matches[1] === "12"
                              //       ? -12
                              //       : 0) ||
                              //       (matches[3] === "pm" && matches[1] === "12"
                              //         ? 0
                              //         : 0) ||
                              //       (matches[1] !== "12" && matches[3] !== "am"
                              //         ? 12
                              //         : 0)) +
                              //     ":" +
                              //     matches[2];
                              setEnd(time);
                              refer.current.submit();
                            }}
                          />
                        </Form.Item>
                      </Form.Item>
                      {parseInt(props?.id) > 0 && <div id={props?.id} onClick={() => removeComponent(props?.id)}><GiCancel className="cross_icon" /></div>}
                    </div>
                  </Col>
                </Row>
                :
                <><Col lg={4}>
                  <Form.Item name="start_time" label="Start Time">
                    <Form.Item>
                      <TimePicker
                        className="start_time c_select"
                        use12Hours
                        format="h:mm A"
                        placeholder=""
                        suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                        // onChange={onChange(value, timeString, setStart)}
                        onChange={(value, timeString) => {
                          let dd = new Date("1/1/2013 " + timeString)
                          let time = dd.toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          })
                          // const matches = timeString
                          //   .toLowerCase()
                          //   .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                          // const output =
                          //   parseInt(matches[1]) +
                          //   (((matches[3] === "am" && matches[1] === "12")
                          //     ? -12
                          //     : 0) ||
                          //     ((matches[3] === "pm" && matches[1] ==="12")
                          //       ? parseInt(matches[1])-0
                          //       : 0) ||
                          //     ((matches[3] === "am") ? 0 : 12)) +
                          //   ":" +
                          //   matches[2];
                          // console.log(output);
                          setStart(time);
                          refer.current.submit();
                        }}
                      />
                    </Form.Item>
                  </Form.Item>
                </Col>
                  <Col lg={4}>
                    <div className="flex_start align_item_start">
                      <Form.Item name="end_time" label="End Time">
                        <Form.Item>
                          <TimePicker
                            className="end_time c_select"
                            use12Hours
                            format="h:mm A"
                            placeholder=""
                            suffixIcon={<HiOutlineArrowDown color="#29BCC1" />}
                            onChange={(value, timeString) => {
                              let dd = new Date("1/1/2013 " + timeString)
                              let time = dd.toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: false,
                              })
                              //   const matches = timeString
                              //     .toLowerCase()
                              //     .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
                              // console.log(matches)
                              // const output =
                              //     parseInt(matches[1]) +
                              //     ((matches[3] === "am" && matches[1] === "12"
                              //       ? -12
                              //       : 0) ||
                              //       (matches[3] === "pm" && matches[1] === "12"
                              //         ? 0
                              //         : 0) ||
                              //       (matches[1] !== "12" && matches[3] !== "am"
                              //         ? 12
                              //         : 0)) +
                              //     ":" +
                              //     matches[2];
                              setEnd(time);
                              refer.current.submit();
                            }}
                          />
                        </Form.Item>
                      </Form.Item>
                      {parseInt(props?.id) > 0 && <div id={props?.id} onClick={() => removeComponent(props?.id)}><GiCancel className="cross_icon" /></div>}
                    </div>
                  </Col>
                </>
              }
            </Row>
            <Row>
              {arr.length > 0 && <>
                <div className="flex_start gap">
                  <HeadingDescSmall text="Selected Time slots" />
                  {/* <Checkbox
                  indeterminate={
                    checkboxes.length < arr3.length && checkboxes.length > 0
                  }
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  Check all
                </Checkbox> */}
                </div>
                <div className="checkbox_container flex_start">{arr}</div></>}
            </Row>
          </Form>
        </div>
      )}
    </>
  );
}

export default React.memo(AddTimeForm);
