import React from 'react'
import { Link } from 'react-router-dom';
import './_linkContainer.scss';

function LinkContainer(props) {
  const { text, to, children, bgColor } = props;
  return (
    <div>
      <Link
        className="simple_ancer"
        to={to || ''}
        style={{ backgroundColor: bgColor }}
      >
        {children}
        <div>{text || ''}</div>
      </Link>
    </div>
  );
}

export default React.memo(LinkContainer);
