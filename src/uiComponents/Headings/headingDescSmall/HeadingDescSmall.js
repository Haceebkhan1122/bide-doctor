import React from 'react';
import './_headingDescSmall.scss';

function HeadingDescSmall(props) {
  const { text, color, className } = props;
  let fontColor
  if (color === "pink") {
    fontColor = "#ef6286"
  } else if (color === "blue") {
    fontColor = "#29bcc1"
  }
  return (
    <div>
      <h5 dir="auto" style={{color: fontColor}} className={`${className} heading_desc_small`}>
        {text || ''}
      </h5>
    </div>
  );
}

export default React.memo(HeadingDescSmall);
