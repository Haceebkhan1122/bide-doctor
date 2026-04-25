import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import styled from 'styled-components';
// import LoginLogo from "../../assets/images/png/LoginLogo.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import LoginAunty from "../../assets/images/png/girlFile.png"
import { FiChevronRight } from 'react-icons/fi';
import i18n from '../../i18n';
import { useNavigate, useParams, Link, useHistory } from 'react-router-dom';
import { BsX } from "react-icons/bs";
import './fewMoreDetail.css';
import Logo from "../../assets/images/svg/meri-sehat-logo.svg";
import Loader from "../../assets/images/gif/loading_spinner.gif";







const PleaseWait = () => {

  const history = useHistory();

  // const signupWait = () => {
  //   history.push('/please-wait')
  // }

  useEffect(() => {
    // setTimeout(() => {

    //   history.push('/thankyou-doctor');

    // }, 10000);
  }, [])


  return (

    <>
      <StyledPleaseWait>

        <div className="header_meriSehat">
          <Container fluid>
            <Row>
              <Col md={12}>
                <div className='logo_only'>
                  {/* <Link to="/"> */}
                  <img src={Logo} alt="Logo" />
                  {/* </Link> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>


          <div className='laoder-waiting' >

            <img src={Loader} />


          </div>
          <div className='description-loading' >
            <h4>Please wait</h4>
            <p>Uploading your application...</p>
          </div>


        </Container>
      </StyledPleaseWait>
    </>

  )
}


export const StyledPleaseWait = styled.section`



.laoder-waiting{
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 50vh; */

    img{
            width: 60px;
            height: 60px;

    }
}

.description-loading{
       p{
        padding-top: 10px;
        font-family: 'Circular Std';
font-style: normal;
font-weight: 300;
font-size: 18px;
line-height: 25px;
text-align: center;
color: #404040;

    }
    h4{
        padding-top: 15px;
        font-family: 'Nunito';
font-style: normal;
font-weight: 500;
font-size: 24px;
line-height: 120%;
text-align: center;
color: #313131;


    }
}

`


export default PleaseWait