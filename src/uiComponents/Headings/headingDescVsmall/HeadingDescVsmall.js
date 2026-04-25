import './_headingDescVsmall.scss';
import React from 'react'

function HeadingDescVsmall(props) {
  const { text, key,className } = props;
  return <h6 key={key} className={`${className} headingDescVsmall`}> {text || ''} </h6>;
}

export default React.memo(HeadingDescVsmall);
