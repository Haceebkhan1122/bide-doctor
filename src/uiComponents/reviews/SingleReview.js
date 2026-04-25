import React from "react";
import "./singleReview.css";
import { AiTwotoneStar } from "react-icons/ai";
import { Divider } from "antd";
import ExtremeSatisfied from "../../assets/images/png/extreme.png";
import NotRecommended from '../../assets/images/png/not_rec.png'
import Recommended from '../../assets/images/png/rec.png'

function SingleReview({review}) {

  return (
    <div className="single-review-container mb-3">
      <div className="review-headline">
        {(review?.consultation_rating === "Extremely Satisfied" && (
          <>
            <img src={ExtremeSatisfied} alt="Extreme Satisfied" />
            <p className="custom_font"> I highly recommend this doctor </p>
          </>
        )) ||
          (review?.consultation_rating === "Satisfied" && (
            <>
              <img src={Recommended} alt="Satisfied" />
              <p className="custom_font"> I recommend this doctor </p>
            </>
          )) ||
          (review?.consultation_rating === "Satisfied" && (
            <>
              <img src={NotRecommended} alt="Extreme Satisfied" />
              <p className="custom_font"> I do not recommend this doctor </p>
            </>
          ))}
        <Divider
          type="vertical"
          style={{ backgroundColor: "#313131", height: "16px" }}
        />
        <AiTwotoneStar color="#3B9915" />
        <p style={{ color: "#3B9915", marginLeft: "5px" }}>{review?.rating}/5</p>
      </div>

      <div className="mt-2 single-doctor-review-text">
        <p>
          "{review?.description}"
        </p>
      </div>

      <div className="mt-3 mb-3 single-doctor-review-date">
        {review?.review_by_user ? (
          <p>
            {review?.created_at} by {review?.review_by_user}
          </p>
        ) : (
          <p> {review?.created_at} </p>
        )}
      </div>
    </div>
  );
}

export default SingleReview;
