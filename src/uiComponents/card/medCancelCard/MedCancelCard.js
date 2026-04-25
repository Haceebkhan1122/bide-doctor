import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/images/svg/pinkClose.svg";
import { HeadingDescSmall } from "../../Headings";
import "./MedCancelCard.scss";

function MedCancelCard(props) {
  const [hideButton, setHideButton] = useState(false);

  const removeDisease = () => {
    props.setDiseaseFunc("del", props.text);
    setHideButton(true);
  };

  return (
    <div
      className="cancelMedCard"
      id={props.id}
      style={{ display: hideButton ? "none" : "block" }}
    >
      {hideButton ? null : (
        <div className="pink_div vf">
          {props.cancel ? (
            <a onClick={() => removeDisease()}>
              <img src={closeIcon} alt="closeIcon" />
            </a>
          ) : null}
          <HeadingDescSmall text={props.text} />
        </div>
      )}
    </div>
  );
}

export default React.memo(MedCancelCard);
