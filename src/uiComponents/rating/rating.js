import { Star } from '../icons';
import './rating.css';

function Rating(props) {
  const { text, subText } = props;
  return (
    <div className="rating">
      <Star />
      <h6>
        {text || ''} <span> ({subText || ''})</span>
      </h6>
    </div>
  );
}

export default Rating;
