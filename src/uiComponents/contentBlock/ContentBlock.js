import React from 'react';
import { SectionHeadingMed } from '../Headings';
import './_contentBlock.scss';

function ContentBlock(props) {
  const { heading, body, image } = props;
  return (
    <div className="contentBlock">
      <SectionHeadingMed text={heading} />
      <div className="blockBody">{body}</div>
      <div className="blockImage">
        {image && <img src={image} alt="contentImage" />}
      </div>
    </div>
  );
}

export default React.memo(ContentBlock);
