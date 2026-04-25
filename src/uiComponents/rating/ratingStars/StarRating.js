import "./_ratingStars.scss";
import StarRatings from "react-star-ratings"

export default function StarRating({rating}) {
  return (
      <div className="ratingStars">
      <StarRatings
        rating={rating}
        starDimension="20px"
        starSpacing="0px"
        starEmptyColor="#CCCCCC"
        starRatedColor="#F5D730"
      />
      </div>
  );
}
