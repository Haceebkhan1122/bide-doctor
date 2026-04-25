import React from 'react';
import './_sectionInnerHeading.scss';

function SectionInnerHeading(props) {
  const { text, color } = props;
  return (
    <div>
      <h3 dir="auto" className="sectionInnerHeading" style={{ color }}>
        {text || ''}
      </h3>
    </div>
  );
}

export default React.memo(SectionInnerHeading);
