import React from 'react';
import ReactStars from 'react-rating-stars-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/fontawesome-free-solid';
import './_ratingStars.scss';

function RatingStars(props) {
  const { edit, newValue } = props;
  const ratingChanged = (e) => {
    // console.log(e);
  };
  return (
    <div className="ratingStars">
      <ReactStars
        count={5}
        onChange={(e) => ratingChanged(e)}
        isHalf={true}
        value={newValue}
        edit={edit}
        emptyIcon={<FontAwesomeIcon icon={faStar} />}
        halfIcon={<FontAwesomeIcon icon={faStar} />}
        filledIcon={<FontAwesomeIcon icon={faStar} />}
        activeColor="#F5D730"
        color="#CCCCCC"
      />
    </div>
  );
}

export default React.memo(RatingStars);
