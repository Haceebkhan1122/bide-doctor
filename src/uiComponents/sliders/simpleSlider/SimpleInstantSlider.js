import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Form, Input } from "antd";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import Slider from "react-slick";
import {
  HeadingDescSmall,
  HeadingDescVsmall,
  HeadingWithSpaceLarge,
} from "../../Headings";
import { TableComponent } from "../../tableComponent";
import "./_simpleSlider.scss";
import { TypeFilter } from "../../../pages/dashboard/TypeFilter";
import loadingGif from "../../../assets/images/gif/loader_gif.gif";
import InstantTable from "../../tableComponent/InstantTable";

function SimpleSlider(props) {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const [tableData, settableData] = useState([]);
  

  const slider = useRef();

  // console.log('check prop', props.hasOwnProperty('text'));
  // console.log(props.text)

  let datee = [];
  if (props?.bodyData) {
    // console.log(props?.bodyData);
    // props?.date?.[0]?.substring(6)
    if (props?.date) {
      props?.date?.map((d) => datee.push(d?.split(", ")[1]));
    }
  }
  const handleChange = (e) => {
    let date = datee[e];
    let filter = props?.bodyData?.filter((item) => item.date === date);
    settableData(filter);
  };

  // const next = () => {
  //      slider.current.slickNext();
  //    };

  //    const previous = () => {
  //      slider.current.slickPrev();
  //    };

  useEffect(() => {
    let filter = props?.bodyData?.filter((item) => item?.date === props?.date?.[0]?.split(", ")[1]);
    settableData(filter);
  }, [props?.date])

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };
  return (
    <>
      
      <div className="white_b bg-transparent">
        <div className="inline_data">
          <Col lg={3}>
            {props.text ? (
              <HeadingWithSpaceLarge text={props.text} />
            ): (
              <HeadingWithSpaceLarge text="YOUR APPOINTMENTS" />
            )}
            
            
          </Col>
          
          <Col lg={9}>
            <div className="flex_center" style={{float: 'right'}}>
            
            {props.onTypeFilterClick && (
              <div className="flex_center grey_div_low_padding">
              <TypeFilter onTypeFilterClick={props.onTypeFilterClick} />
              </div>
            )}
            
            
            <div className="flex_end">
              {!props.disableDateSlider && (
                <div className="flex_center grey_div">
                {props.date.length > 0 ? (
                  <Slider
                    asNavFor={nav2}
                    ref={(slider1) => setNav1(slider1)}
                    afterChange={(e) => handleChange(e)}
                    // prevArrow={<SlickButtonFix><RiArrowLeftSLine className="arrow_grey" /></SlickButtonFix>}
                    // nextArrow={<SlickButtonFix><RiArrowRightSLine className="arrow_grey" /></SlickButtonFix>}
                    prevArrow={<RiArrowLeftSLine className="arrow_grey" />}
                    nextArrow={<RiArrowRightSLine className="arrow_grey" />}
                    className="first_slider"
                    {...settings}
                  >
                    {props?.date?.map((d, index) => {
                      if (index === 0) {
                        d = "Today, " + d
                      }
                      return (
                        <div key={index}>
                          <HeadingDescVsmall
                            text={d}
                          ></HeadingDescVsmall>
                        </div>
                      );
                    })}
                    {/* {slides} */}
                  </Slider>
                ) : (
                  ""
                )}
                {/* <HeadingDescVsmall text={date} /> */}

                {/* <div
                     className="next_btn"
                     onClick={next}
                     aria-hidden="true"
                     role="button"
                   >
                     <RiArrowRightSLine className="arrow_grey" />
                   </div> */}
              </div>
              ) }
              
              
            </div>
            </div>
          </Col>
        </div>
      </div>

      <Slider className="appointments-slider"
        asNavFor={nav1}
        ref={(slider2) => setNav2(slider2)}
        slidesToShow={1}
      >
        <InstantTable
          header={props?.header}
          data={props?.bodyData}
          pagination={false}
          
        />
      </Slider>
    </>
  );
}

export default React.memo(SimpleSlider);
