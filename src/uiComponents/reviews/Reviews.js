import React, { useEffect, useState } from "react";
import { AiTwotoneLike } from "react-icons/ai";
import { selectDashboard } from "../../pages/dashboard/redux/slice";
import { getDashboardDetails, getU } from "../../pages/dashboard/redux/thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import API from "../../utils/customAxios";
import Loader from "../loader/Loader";
import StarRating from "../rating/ratingStars/StarRating";
import "./reviews.css";
import SingleReview from "./SingleReview";
import BackArrow from "../../assets/images/png/back-arrow.png";
import { useHistory } from "react-router-dom";

function Reviews() {
  const selectDashboardDetails = useAppSelector(selectDashboard);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getDashboardDetails());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsApiLoading(true);

        const response = await API.get(`/user`);

        if (response?.data?.code === 200) {
          setIsApiLoading(false);
          setReviews(response?.data?.data?.user?.reviews);
          setReviewCount(response?.data?.data?.user?.review_count);
        } else {
          setIsApiLoading(false);
        }
      } catch (error) {
        // console.log(error);
        setIsApiLoading(false);
      }
    })();
  }, []);

  function backToDashboard() {
    history.push("/");
  }

  return (
    <section className="reviews-section cover_space">
      {isApiLoading || isLoading ? (
        <Loader />
      ) : (
        <>
          {reviews?.length > 0 && (
            <>
              <div className="container">
                <h3 className="ff-Nunito fw-500 color-313131"> Reviews </h3>
                <div className="reviews-container mt-3 mb-4 container">
                  <div className="review-rating-container mb-3">
                    <AiTwotoneLike
                      color="#3B9915"
                      style={{ width: "21px", height: "21px" }}
                    />
                    <h6
                      className="mx-2 colorGreenLike"
                      style={{ lineHeight: "23px", paddingTop: "3px" }}
                    >
                      {selectDashboardDetails?.data?.reviews?.average_rating}/5 (
                      {reviewCount} REVIEWS)
                    </h6>
                    <StarRating
                      rating={selectDashboardDetails?.data?.reviews?.average_rating}
                    />
                  </div>
                  <div>
                    {reviews?.map((review, index) => (
                      <SingleReview key={index} review={review} />
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="back-to-dashboard container"
                onClick={backToDashboard}
              >
                <img src={BackArrow} className="me-3" />
                <p>BACK TO DASHBOARD</p>
              </div>
            </>
          )}

        </>
      )}
    </section>
  );
}
export default Reviews;
