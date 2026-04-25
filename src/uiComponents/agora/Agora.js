import "./agora.scss";
import React, { useEffect, useState } from "react";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import Controls from "./controls";
import "./agora.scss";
import { getAppointmentToken } from "../../pages/appointments/redux/thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAppointmentToken, selectAppointmentData } from "../../pages/appointments/redux/slice";
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import heartLogo from '../../assets/images/png/heartLogo.png'



const Agora = ({ doctorName }) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAppointmentToken(params?.id));
  }, [params]);

  const appointmentToken = useAppSelector(selectAppointmentToken);
  const AppointmentData = useAppSelector(selectAppointmentData);


  useEffect(() => {

    if (appointmentToken.data?.agora_token) {
      const obj = {
        token: appointmentToken?.data?.agora_token,
        channel: appointmentToken?.data?.channel_name,
        mode: 'rtc',
        codec: 'vp8',
        appId: 'e00a7e089f7145e89fb4959caf816626',
        role: 'host',
        logLevel: {
          level: null
        }
        // token:
        // '0060a7d74228e8949ffb0ae912701967065IADRCBEAAth5RMYv1+YKAllyHjb651ahO6isBPItl2o5SgChrPIAAAAAEACGukDP/NXoYgEAAQD81ehi',
        // channel: 'testing-channel'
      }
      setConfig(obj);
    }
  }, [appointmentToken]);


  useEffect(() => {
    if (config !== null) {
      setLoading(false)
    }
  }, [config])

  // console.log(loading, "config")

  useEffect(() => {
    if (config?.appId) {
      setLoading(false);
      // console.log(config, "config________");
    }
  }, [config]);
  const useClient = createClient(config);
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

  //var targetDiv = document.getElementsByClassName("rtx_video_small_frame").length;
  //var targetDiv = document.getElementsByClassName("rtx_video_small_frame").length;
  var targetDiv = document.querySelector(".rtx_video_small_frame div video");

  const Videos = (props) => {
    const { users, tracks, videolocalCamOff } = props;
    return (
      <>
        <div className="rtx_video_container" id="videos">

          {videolocalCamOff ? (
            <>
              <div className='emptttt_mini_frame'>
                <img src={heartLogo} alt="Logo Heart" />
              </div>
            </>
          ) : null}

          {/* <AgoraVideoPlayer
            className={
              users?.length > 0 ? "rtx_video_small_frame" : "rtx_video_player"
            }
            videoTrack={tracks[1]}

          /> */}


          <AgoraVideoPlayer
            className={
              users?.length > 0 ? "rtx_video_small_frame" : "rtx_video_small_frame"
            }
            videoTrack={tracks[1]}
          />

          {/* {!targetDiv && targetDiv === null ? (
            <>
              <div className={`rtx_video_small_frame mmm`}>
                <div className='emptttt ffff'>
                  <img src={heartLogo} alt="Logo Heart" />
                </div>
              </div>
            </>
          ) : null} */}

          {users.length === 0 ? (
            <>
              <div className={`rtx_video_player for_patient_area mmm`}>
                <div className='emptttt ffff'>
                  <img src={heartLogo} alt="Logo Heart" />
                </div>
              </div>
            </>
          ) : null}

          {console.log(users.length, "users")}
          {users.length > 0 &&
            users.map((user, index) => {

              if (user.videoTrack) {
                return (
                  <AgoraVideoPlayer
                    className={`rtx_video_player for_patient_area`}
                    videoTrack={user.videoTrack}
                    key={user.uid}
                  />

                );

              } else return (
                null

              );
            })}

        </div>
      </>
    );
  };

  const VideoCall = (props) => {
    const { setInCall, channelName } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const [videoQuality, setVideoQuality] = useState(null)
    const [videolocalCamOff, setVideolocalCamOff] = useState(false)




    useEffect(() => {
      // function to initialise the SDK
      let init = async (name = "") => {
        // console.log("init", name);
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          // console.log("subscribe success");          
          if (mediaType === "video") {
            setUsers([...users, user])
            if (!users.length) {
              setUsers((prevUsers) => {
                return [user];
              });
            }
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });
        client.on('network-quality', async (stats) => {
          try {
            if (stats.uplinkNetworkQuality >= 1 && stats.uplinkNetworkQuality <= 2) {
              tracks[1]?.setEncoderConfiguration("360p_1")
            }

            else if (stats.uplinkNetworkQuality >= 3 && stats.uplinkNetworkQuality <= 4) {
              tracks[1]?.setEncoderConfiguration("360p_3");
            }

            else if (stats.uplinkNetworkQuality >= 5 && stats.uplinkNetworkQuality <= 6) {
              tracks[1]?.setEncoderConfiguration("240p_3");
            }
          } catch (error) {

          }
        })



        client.on("user-unpublished", (user, type) => {
          // console.log("unpublished", user, type);
          if (type === "audio") {
            user.audioTrack?.stop();
          }
          if (type === "video") {
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
          }
        });
        client.on("user-left", (user) => {
          // console.log("leaving", user);
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        });
        await client.join(config.appId, name, config.token, null);
        if (tracks) await client.publish([tracks[0], tracks[1]]);
        setStart(true);
      };
      if (ready && tracks) {
        // console.log("init ready");
        init(channelName);
      }

    }, [channelName, client, ready, tracks]);

    useEffect(() => {
      client.on("network-quality", (quality) => {
        setVideoQuality(quality)
      });
    }, [videoQuality])



    return (
      <div className="rtx_video_main">
        {ready && tracks && (
          <Controls
            tracks={tracks}
            setStart={setStart}
            setInCall={setInCall}
            setVideoQuality={setVideoQuality}
            videoQuality={videoQuality}
            setVideolocalCamOff={setVideolocalCamOff}
            videolocalCamOff={videolocalCamOff}
          />
        )}
        {start && tracks && <Videos users={users} tracks={tracks} setVideolocalCamOff={setVideolocalCamOff} videolocalCamOff={videolocalCamOff} />}
      </div>
    );
  };


  const ChannelForm = (props) => {
    const { setInCall, setChannelName, configs } = props;
    const [channelName, setChannelNameState] = useState("");

    useEffect(() => {
      setInCall(true);
      setChannelName(configs.channel);
    }, []);

    const onInputChange = (e) => {
      // setChannelName(e.target.value);
      // console.log(e.target.value);
      setChannelNameState(e.target.value);
    };
    return (
      <form
        style={{ maxWidth: "400px" }}
        className="join form-group d-flex m-2">
        {configs.appId === "" && (
          <p className="badge badge-success" style={{ color: "red" }}>
            Please enter your Agora App ID in App.tsx and refresh the page
          </p>
        )}
        <input
          className="form-control"
          type="text"
          placeholder="Enter Channel Name"
          onChange={onInputChange}
        />
        <button
          type="button"
          className="btn btn-success mx-2"
          onClick={(e) => {
            setInCall(true);
            setChannelName(channelName);
          }}>
          Join
        </button>
      </form>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {inCall ? (
            <VideoCall setInCall={setInCall} channelName={channelName} />
          ) : (
            <ChannelForm
              configs={config}
              setInCall={setInCall}
              setChannelName={setChannelName}
            />
          )}
        </>
      )}
    </>
  );
};
export default React.memo(Agora); 