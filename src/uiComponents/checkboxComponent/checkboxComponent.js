import React from "react";
import { Checkbox  } from "antd";
import "./_checkboxContainer.scss";

function checkboxComponent(props) {
  const { text = "", key= "", value="", onChange = ()=> {} } = props;

  return (
    <div>
      <Checkbox key={key} value={value}>{text}</Checkbox>
    </div>
  );
}

export default React.memo(checkboxComponent);
