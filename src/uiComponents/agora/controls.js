import React, { useState, useEffect } from "react";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FiVideo, FiVideoOff } from "react-icons/fi";
import { MdCallEnd } from "react-icons/md";
import Dropdown from 'react-bootstrap/Dropdown';
import CallCut from '../../assets/images/png/call_cut.png';

const Controls = (props) => {
  const { client, setVideoQuality, videoQuality, localCameraEnabled, setLocalCameraEnabled, localMicEnabled, setLocalMicEnabled, localTracks, setShowCancelModal } = props;

  async function toggleCamera() {
    if (client && localCameraEnabled) {
      await localTracks[1]?.setEnabled(false);
      setLocalCameraEnabled(false);
    }
    else if (client && !localCameraEnabled) {
      await localTracks[1]?.setEnabled(true);
      setLocalCameraEnabled(true);
    }
    // else {
    //   // localTracks[1]?.open();
    //   (this.agoraVideo.localVideoTrack as MediaStreamTrack).open();
    // }
  }

  async function toggleMic() {
    if (client && localMicEnabled) {
      await localTracks[0]?.setEnabled(false);
      setLocalMicEnabled(false);
    }
    else if (client && !localMicEnabled) {
      try {
        await localTracks[0]?.setEnabled(true);
        setLocalMicEnabled(true);
      } catch (error) {
        console.log(error, "cambug")
      }
    }
    // else {
    //   // localTracks[1]?.open();
    //   (this.agoraVideo.localVideoTrack as MediaStreamTrack).open();
    // }
  }

  return (
    <>
      <div className='btn-status d-block d-sm-none'>
        {videoQuality?.uplinkNetworkQuality <= 0 ? (
          <>
            <p className='call_status'><span class="circle red"></span>Disconnected</p>
          </>
        ) : (
          <>
            <p className='call_status'><span class="circle green"></span>Connected</p>
          </>
        )}
      </div>
      <div className="controls">
        <div className='btn-status d-none d-sm-block'>
          {videoQuality?.uplinkNetworkQuality <= 0 ? (
            <>
              <p className='call_status'><span class="circle red"></span>Disconnected</p>
            </>
          ) : (
            <>
              <p className='call_status'><span class="circle green"></span>Connected</p>
            </>
          )}
        </div>

        <div className="wrapper_btn_cutt">
          <span onClick={toggleMic} className={localMicEnabled ? 'on video_btn' : 'video_btn off'}>
            {localMicEnabled ? <BsFillMicFill /> : <BsFillMicMuteFill />}
          </span>
          <span onClick={toggleCamera} className={localCameraEnabled ? 'on video_btn' : 'video_btn off'}>
            {localCameraEnabled ? <FiVideo /> : <FiVideoOff />}
          </span>

          <span className="cuttt_of" onClick={(e) => setShowCancelModal(true)}>
            <img src={CallCut} style={{
              cursor: "pointer",
              height: "48px",
              marginLeft: "5px",
              width: '72.32px'
            }} />
          </span>
        </div>

        {
          // <div
          //   className="video_btn"
          //   onClick={() => {
          //     leaveChannel();
          //     navigateWithRefresh('instant-consultant');
          //   }}
          // >
          //   <MdCallEnd />
          // </div>
        }




        <div className='connection_controller'>
          <h5 className='your_connn'>
            Your internet connection is
          </h5>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className={`signals_hk ${videoQuality?.uplinkNetworkQuality == 1 && 'green__ ' || videoQuality?.uplinkNetworkQuality == 2 && 'yellow__ '}`}>
              <span className="connections_controll">
                {videoQuality?.uplinkNetworkQuality == 1 && 'Strong' || videoQuality?.uplinkNetworkQuality == 2 && 'Strong' || videoQuality?.uplinkNetworkQuality >= 4 && 'Weak' || videoQuality?.uplinkNetworkQuality == 0 && 'waiting...' || videoQuality?.uplinkNetworkQuality == null && 'waiting...'}
              </span>
            </Dropdown.Toggle>
            <div className='hk_dropdown_controller'>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="1">HD</Dropdown.Item>
                <Dropdown.Item eventKey="2">SD</Dropdown.Item>
                {/* <Dropdown.Item eventKey="3">Audio</Dropdown.Item> */}
              </Dropdown.Menu>
            </div>
          </Dropdown>
        </div>
      </div >
    </>
  );
};
export default Controls;