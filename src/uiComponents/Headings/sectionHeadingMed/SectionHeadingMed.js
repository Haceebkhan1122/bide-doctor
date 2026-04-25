import React from 'react';
import './_sectionHeadingMed.scss';

function SectionHeadingMed(props) {
  const { text, color } = props;
  return (
    <div>
      <h3 dir="auto" className="sectionHeadingMed" style={{ color }}>
        {text || ''}
      </h3>
    </div>
  );
}

export default React.memo(SectionHeadingMed);
