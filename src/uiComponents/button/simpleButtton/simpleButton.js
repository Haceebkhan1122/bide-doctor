import React from 'react';
import './_simpleButton.scss';

function SimpleButton(props) {
  const { text, bgColor, onClick, type, children } = props;
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        className="simple_btn"
        style={{ backgroundColor: bgColor }}
      >
        {text || ''} {children}
      </button>
    </div>
  );
}

export default React.memo(SimpleButton);
