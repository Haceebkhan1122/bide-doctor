import React from 'react';
import './_rankTag.scss';

function RankTag(props) {
  const { icon, text, bgColor } = props;
  return (
    <div className="rankTag" style={{ backgroundColor: bgColor }}>
      <img src={icon} alt="icon" /> <h6> {text || ''} </h6>
    </div>
  );
}

export default React.memo(RankTag);
