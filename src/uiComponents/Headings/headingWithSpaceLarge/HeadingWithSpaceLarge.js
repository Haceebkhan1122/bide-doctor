import './_headingWithSpaceLarge.scss';
import React from 'react'

function HeadingWithSpaceLarge(props) {
  const { text,className } = props;

  return (
    <div>
      <h6 dir="auto" className={`headingWithSpaceLarge ${className}`}>
        {text || ''}
      </h6>
    </div>
  );
}

export default React.memo(HeadingWithSpaceLarge);
