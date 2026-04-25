import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faYoutube,
  faLinkedin,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import API from "../../utils/customAxios";
import { Link } from "react-router-dom";
import visa from "../../assets/images/png/visa-logo-png.png";
import master from "../../assets/images/png/mastercard-logo.png";
import logo from "../../assets/images/svg/meri-sehat-logo.svg";



const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const getUanNumber = footerData?.settings?.uan_number;

  const UanNumber = localStorage.setItem("uan_Number", getUanNumber);
  const uan_number = localStorage.getItem("uan_Number");

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get(
          `/footer`
        );

        if (response?.data?.code === 200) {
          setFooterData(response?.data?.data);
        }
      } catch (error) { }
    })();
  }, []);

  let footerBaseUrl = process.env.REACT_APP_FOOTER_BASE_URL;


  return (
    <>
      <section dir="auto" className="footer position-relative">
        <Container>
          <Row>
            <Col md={3}>
              {/* <FooterLogo /> */}
              <div className="footerLogo mb-3">
                <img src={logo} alt="logo" />
              </div>
              <p className="footerColumn">
                <a href={`tel:${uan_number}`}>UAN: {uan_number}</a>
              </p>
              <p className="footerColumn">
                {footerData?.settings?.email && (
                  <a href="mailto:help@merisehat.pk">
                    Email: {footerData?.settings?.email}
                  </a>
                )}
              </p>
              <div dir="auto" className="social_icons">
                {footerData?.settings?.facebook_link && (
                  <a
                    target="_blank"
                    // href="https://www.facebook.com/MeriSehat.pk"
                    href={footerData?.settings?.facebook_link}
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                )}
                {footerData?.settings?.instagram_link && (
                  <a
                    target="_blank"
                    // href="https://www.instagram.com/merisehat.pk"
                    href={footerData?.settings?.instagram_link}
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
                {footerData?.settings?.youtube_link && (
                  <a
                    target="_blank"
                    // href="https://www.youtube.com/merisehat"
                    href={footerData?.settings?.youtube_link}
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                )}
                {footerData?.settings?.twitter_link && (
                  <a
                    target="_blank"
                    className="TwitterBg"
                    // href="https://www.youtube.com/merisehat"
                    href={footerData?.settings?.twitter_link}
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                )}
                {footerData?.settings?.lindedin_link && (
                  <a
                    target="_blank"
                    className="LinkedinBg"
                    // href="https://www.youtube.com/merisehat"
                    href={footerData?.settings?.lindedin_link}
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                    <i class="fa-brands fa-linkedin-in"></i>
                  </a>
                )}
              </div>
            </Col>
            <Col md={9} className="row mt-5 mt-md-0">
              {footerData?.footer?.map((item, index) => {
                return (
                  <Col className="col-xs-6">
                    <div className="mb-4 mb-md-0">
                      <h5> {item?.name} </h5>
                      <ul dir="auto" className="footer_links">
                        {item?.children?.map((child) => {
                          return (
                            child?.link && (
                              <li key={child?.id}>
                                <a href={`${child?.link === '//dr.merisehat.pk/signup-number' ? `/signup-number` : null || child?.link === '//dr.merisehat.pk/login' ? `/login` : `${footerBaseUrl}${child?.link}`}`}> {child?.name} </a>
                              </li>
                            )
                          );
                        })}
                      </ul>
                      <div className="cardsImagesContainer grayScaleImage d-flex align-items-center justify-content-center">
                        <img src={visa} alt="visa" className="me-4 img-fluid" />
                        <img src={master} alt="master" className="img-fluid" />
                      </div>
                    </div>
                  </Col>
                );
              })}

              {/* <Col className="col-xs-6" md={3}>
                <div className="">
                  <h5>Doctors / Clinics</h5>
                  <ul dir="auto" className="footer_links">
                    {footerData.footer?.map((item) => {
                      return (
                        item?.link && (
                          <li key={item?.id}>
                            <Link to={item?.link}>{item?.name} </Link>
                          </li>
                        )
                      );
                    })}
                  </ul>

                </div>
              </Col> */}
              {/* <Col className="col-xs-6" md={3}>
                <div className="">
                  <h5>Media / Press</h5>
                  <ul dir="auto" className="footer_links">
                    {footerData.footer?.map((item) => {
                      return (
                        item?.link && (
                          <li key={item?.id}>
                            <Link to={item?.link}>{item?.name} </Link>
                          </li>
                        )
                      );
                    })}
                  </ul>

                </div>
              </Col> */}
              {/* <Col className="subscription_cont col-xs-6" md={3}>

                <h5>Responsibility</h5>
                <ul className="footer_links">
                    <li><a href="javascript:void(0)">Our Approach to CSR</a></li>
                    <li><a href="javascript:void(0)">Causes we support</a></li>
                    <li><a href="javascript:void(0)">CSR 2022</a></li>
                    <li><a href="javascript:void(0)">Apply for a grant</a></li>
                </ul>
                <div className="cardsImagesContainer grayScaleImage">
                  <img src={visa} alt="visa" className='me-4'/>
                  <img src={master} alt="master" />

                </div>
              </Col> */}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Footer;
