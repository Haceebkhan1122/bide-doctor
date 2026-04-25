import React from 'react'
import englishUrduLogo from '../../assets/images/svg/englishUrduLogo.svg';

const LogoEnglishUrdu = () => {
  return (
    <div>
    <img src={englishUrduLogo} alt="logo" style={{maxWidth: '195px'}} />
  </div>
  )
}

export default React.memo(LogoEnglishUrdu)