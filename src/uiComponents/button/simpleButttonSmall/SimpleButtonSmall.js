import React from 'react';
import './_simpleButtonSmall.scss';

function SimpleButtonSmall(props) {
  const { text, type, bgColor, onClick, className, children } = props;
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        className={`${className} simple_btn_small`}
        style={{ backgroundColor: bgColor }}
      >
        {text || ''} {children}
      </button>
    </div>
  );
}

export default React.memo(SimpleButtonSmall);
