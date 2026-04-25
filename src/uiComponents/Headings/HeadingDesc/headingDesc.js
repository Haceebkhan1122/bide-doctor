import React from 'react';
import './_headingDesc.scss';

function HeadingDesc(props) {
  const { text } = props;
  return (
    <div>
      <h5 dir="auto" className="heading_desc">
        {text || ''}
      </h5>
    </div>
  );
}

export default React.memo(HeadingDesc);
