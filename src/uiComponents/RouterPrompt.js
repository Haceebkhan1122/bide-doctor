import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Button, Modal } from "antd";

export function RouterPrompt(props) {
  const { when, onOK, onCancel, title, okText, cancelText, okFunction } = props;

  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);
        setShowPrompt(true);
        return "true";
      });
    } else {
      history.block(() => { });
    }

    return () => {
      history.block(() => { });
    };
  }, [history, when]);

  const handleOK = useCallback(async () => {
    if (onOK) {
      // console.log("can route");
      const canRoute = await Promise.resolve(onOK());
      if (canRoute) {
        history.block(() => { });
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => { });
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);

  return showPrompt ? (
    // <Modal
    //   title={title}
    //   visible={showPrompt}
    //   onCancel={handleCancel}
    //   closable={true}
    //   footer={[
    //     <Button key="ok" type="primary" onClick={handleCancel}>OK</Button>
    //   ]}

    // >
    //   You can't leave appointment midway. Please press the Mark Complete button
    // </Modal>
    <Modal
      className="leaveConsultationModal consultationAboutEnd"
      title=""
      centered
      visible={showPrompt}
      onCancel={handleCancel}
      okText="Yes"
      cancelText="No"
      closable={true}
      onOk={okFunction}
    >
      <div className="col-md-9 m-auto text-center">
        <h5 className="ff-Nunito color-313131 fs-24 line-height-35 fw-500 pb-3">Are you sure you want to leave the consultation?</h5>
      </div>
    </Modal>
  ) : null;
}