import React, { useEffect, useRef, useState } from 'react';
import heartLogo from '../../assets/images/png/heartLogo.png'
import { HeadingDescVsmall } from '../Headings';

export const VideoPlayer = ({ user, localCameraEnabled, client, users, countDown, text }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);

    // Add a class to the client's video element
    if (user.uid === client.uid) {
      ref.current.classList.add('doctor_frame');
    }
    else {
      ref.current.classList.add('rtx_video_player');
    }
  }, [user]);

console.log(users, "usersusers")

  return (
    <>
      <div className='ng_agora_new'>
        {!localCameraEnabled ? (
          <>
            <div className='emptttt_mini_frame'>
              <img src={heartLogo} alt="Logo Heart" />
            </div>
          </>
        ) : null}
        {users?.length > 0 ? (
          <>
            <div className={`emptttt ${users?.length == 1 ? 'checkOne' : 'checkTwo'}`}>
              <img src={heartLogo} alt="Logo Heart" />
              <div className="wrape__head">
                <h2> {text} </h2>
                <div className="onlyForFixedRemainingTime">
                  <h3 className="rem-time">{countDown}</h3>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div ref={ref}></div>
      </div>
    </>
  );
};