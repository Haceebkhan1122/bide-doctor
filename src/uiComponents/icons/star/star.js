import React from 'react';
import img from '../../../assets/images/svg/star.svg';
import './_star.scss';

function Star() {
  return (
    <div>
      <img src={img} alt="star" />
    </div>
  );
}

export default React.memo(Star);
