import React from 'react';
import logo from '../../assets/images/svg/new-logo.svg';

function HeaderLogo() {
  return (
    <div>
      <img src={logo} alt="logo" style={{maxWidth: '108px'}} />
    </div>
  );
}

export default React.memo(HeaderLogo);
