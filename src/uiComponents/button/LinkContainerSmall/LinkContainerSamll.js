import React from 'react';
import { Link } from 'react-router-dom';
import './_linkContainerSmall.scss';

function LinkContainerSmall(props) {
  const { text, to, children, bgColor } = props;
  return (
    <div>
      <Link
        className="simple_ancer_small"
        to={to || ''}
        style={{ backgroundColor: bgColor }}
      >
        {children}
        <div>{text || ''}</div>
      </Link>
    </div>
  );
}

export default React.memo(LinkContainerSmall);
