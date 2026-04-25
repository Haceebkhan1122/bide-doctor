import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ReactPlayer from 'react-player/youtube';
import { HeadingDesc, SectionHeadingMed, TopicHeading } from '../Headings';
// import { SectionHeading } from '../SectionHeading';
import './videoWidget.css';
import { useLocation } from 'react-router-dom';
import API from '../../utils/customAxios';



const VideoWidget = (props) => {
//   const { widgetData = {}, key } = props;
  const location = useLocation();
//   let sehatScanPageURL = location.pathname;

  const [videoData, setVideoData] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

 

// console.log(videoData?.widgets?.[0]?.data)
  useEffect(() => {
    (async () => {
        try {
            const response = await API.get(
                `disease/doctor-sign-up`
            );
            if (response?.data?.code === 200) {
                setVideoData(response?.data?.data?.widgets?.[0]);

            }
        } catch (error) {
        }
    })();
}, []);


useEffect(() => {
    if(videoData){
        setVideoUrl(videoData?.data?.[0]?.source)
    }
  }, [videoData])

  function handleVideoChange(event, language, source) {
    setShowVideo(false);
    setVideoUrl(source);
    let languageTags = document.querySelectorAll(".language-tags");
    languageTags.forEach((tag) => {
      if (tag.isSameNode(event.target)) {
        tag.classList.add("language-active");
      }
      else {
        if (tag.classList.contains("language-active")) {
          tag.classList.remove("language-active");
        }
      }
    })
  }


  return (
    <div
    //   key={key}
      className="videoWidget dynamic-widget"
      data-reference_widget_id={videoData?.id}
      data-widget_id={videoData?.widget_id}
    >
      {/* {sehatScanPageURL === "/page/sehat-scan" || sehatScanPageURL === "/page/video-listings" ? ( */}
        {/* <Container className='border borderRadius'> */}
          {/* <Row>
            <Col md={12}>
              <div className='hk_sehat_scan_media'>
                <h1>{videoData?.heading}</h1>
                <ReactPlayer url={videoUrl} controls={true} />

                <ReactPlayer url={widgetData?.data?.} controls={true} />
                <TopicHeading text="Select By Language" />

                {videoData?.data?.map((item, index) => {


                  setVideoUrl(item?.data[0].source);
                  return (
                    <div className='container'>

                      <div className="container d-flex  mt-2 mb-2">
                        <p className={"language-tags " + (index === 0 ? 'language-active' : '')}
                         onClick={(event) => handleVideoChange(event, item.language, item.source)}
                         > {item.language} </p>
                      </div>
                    </div>
                  )

                })}

              </div>
            </Col>
          </Row>
        </Container> */}
       {/* ) : ( */}
        <div className='video-area-article'>
          {videoData?.data?.map((item, index) => {
            if (index === 0) {
              return ( 
                <div className='video-player-box video-radius-zeor'>
                  {showVideo && (
                    <ReactPlayer url={item?.data[0]?.source} controls={true} width="100%" />
                  )}

                  {videoUrl && (
                    <ReactPlayer url={videoUrl} controls={true} width="100%" />
                  )}

                </div>
              )
            }
          })}

          <div className='row px-md-4' >
            <Col md={8} >
              <div className="d-inline-block mt-2 mb-2">
                {/* <TopicHeading text="Select By Language" /> */}
                <h5 className='selectLanguage' >Select By Language</h5>

                <div className='d-flex' >
                  {videoData.data?.length > 0 && videoData.data?.map((item, indexgit) => (

                    <div className='language-boxes ' >
                      <button className={"language-tags " + (indexgit === 0 ? 'language-active' : '')} 
                      onClick={(event) => handleVideoChange(event, item?.language, item?.source)}
                      >{item?.language} </button >
                    </div>

                  ))}
                </div>
              </div>
            </Col>
          </div>
        </div>
    {/* //   )} */}
    </div>
  );
};

export default React.memo(VideoWidget);
