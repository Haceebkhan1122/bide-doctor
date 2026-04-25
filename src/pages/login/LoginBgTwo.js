import React from 'react'
// import LayoutWithoutFooter from '../../layouts/layoutWithoutFooter/LayoutWithoutFooter';
import bgImage from '../../assets/images/png/signup.png';
import Header from '../../uiComponents/Header/Header';

function LoginBgTwo(props) {
  const { children } = props;

  return (
    // <LayoutWithoutFooter>
      <div className="loginPage">
        <div
          className="loginBg two"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <Header />
          <div className='flex_center'>
          {children}
          </div>
        </div>
      </div>
    // </LayoutWithoutFooter>
  );
}

export default LoginBgTwo;
