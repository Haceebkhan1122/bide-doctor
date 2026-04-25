import React, { useEffect, useState, useRef } from "react";

import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Modal,
} from "antd";
import axios from "axios";
import { Col, Row } from "react-bootstrap";

import cameraIcon from "../../../../assets/images/png/camera.png";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getCities } from "../../../../pages/updateProfile/redux/thunk";
import {
  selectCities,
  selectCityLoader,
} from "../../../../pages/updateProfile/redux/slice";
import Loader from "../../../loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import takePhotoPreview from "../../../../assets/images/svg/preview-img.svg";
import Webcam from "react-webcam";
import { dataUrlToFile } from "../../../../utils/helperFunctions";
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const { Step } = Steps;
const { Option } = Select;
function PersonalInformation(props) {
  const { savedImage, name, setName } = props;

  const cities = useAppSelector(selectCities);
  const cityLoading = useAppSelector(selectCityLoader);

  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState("");
  const [form] = Form.useForm();
  const [showRetakeModal, setShowRetakeModal] = useState(false);

  // upload field
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [modalTakePhoto, setModalTakePhoto] = useState(false);

  const [base64Image, setBase64Image] = useState("");
  const [showTakePhotoBtn, setShowTakePhotoBtn] = useState(true);

  const webcamRef = useRef();

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setBase64Image(imageSrc);
    const fileName = "upload-" + Date.now();

    dataUrlToFile(imageSrc, fileName).then((res) => {
      setCapturedImage(res);
      setShowRetakeModal(true);
      setModalTakePhoto(false);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        const stream = mediaStream;
        const tracks = stream.getTracks();

        tracks[0].stop();
      });
  }, [webcamRef]);

  const videoConstraints = {
    width: 800,
    height: 500,
    facingMode: "user",
  };

  function retakeImage() {
    // setCapturedImage("");
    setShowRetakeModal(false);
    setModalTakePhoto(true);
  }

  useEffect(() => {
    dispatch(getCities());
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    if (base64Image) {
      setPreviewImage(base64Image);
    } else {
      setPreviewImage(file.url || file.preview);
    }

    setPreviewVisible(true);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  async function handleFormSubmit(e) {
    // console.log("damn");
  }

  async function captureImage() {
    // Get access to the user's webcam.
    var constraints = {
      video: {
        facingMode: "user",
      },
    };

    var stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Create a <video> element to display the camera stream.
    var video = document.getElementById("video");
    video.srcObject = stream;

    // Create a <canvas> element to capture the video frame.
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Capture a video frame from the camera and draw it to the <canvas> element.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the data URL of the image.
    var imageDataUrl = canvas.toDataURL("image/jpeg");

    // Display the image in an <img> element.
    var img = document.getElementById("img");
    img.src = imageDataUrl;
  }

  const handleBeforeUpload = (file) => {
    props?.setImage(file);
    // Prevent the file from being uploaded to the server
    return false;
  };

  // function disabledDate(current) {
  //   let customDate = "2000-07-01";
  //   return current && current > moment(customDate, "YYYY-MM-DD");
  // }
  const getCurrentYear = () => moment().year();
  const getStartYear = () => getCurrentYear() - 23;
  const disabledDate = (current) => {
    // Calculate the date 23 years ago from today
    const maxDate = moment().subtract(23, "years");

    // Disable dates that are after the calculated maximum date
    return current && current > maxDate;
  };
  const defaultPickerValue = moment().year(getStartYear());

  function handleUploadChange(fileList) {
    const file = fileList?.file;
    const allowedFileTypes = ["application/pdf", "image/png", "image/jpeg"];
    const fileType = file?.type;

    if (!allowedFileTypes.includes(fileType)) {
      // Display a toast notification for invalid file type
      // toast.error('Invalid file type.');
      props?.setImage(null); // Clear the image selection
    } else {
      props?.setImage(file);
    }
  }

  // useEffect(() => {
  //   if (modalTakePhoto === false) {
  //     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  //       .then(mediaStream => {
  //         const stream = mediaStream;
  //         const tracks = stream.getTracks();

  //         tracks[0].stop();
  //       })
  //   }
  // }, [modalTakePhoto])

  function uploadPhotoHandler() {
    props?.setImage(base64Image);

    const imageThumbnail = document.querySelector(
      ".ant-upload-list-item-thumbnail"
    );

    if (imageThumbnail) imageThumbnail.setAttribute("href", base64Image);

    const actualImage = document.querySelector(".ant-upload-list-item-image");

    if (actualImage) actualImage.src = base64Image;

    const imageName = document.querySelector(".ant-upload-list-item-name");

    if (imageName) imageName.textContent = capturedImage?.name;

    // const modalPreviewImage = document.querySelector(".preview_image");
    // if(modalPreviewImage) {
    //   modalPreviewImage.src = base64Image;
    // }

    handleBeforeUpload(capturedImage);
    setPreviewImage(base64Image);
    setShowRetakeModal(false);
    setShowTakePhotoBtn(false);
  }

  return (
    <>
      {cityLoading && <Loader />}
      <Row>
        <Col lg={4} md={4}>
          <Form.Item
            name="DoctorId"
            label="Doctor ID"
            rules={[{ required: false }]}
          >
            <Input disabled value="ss" placeholder="2345643" />
          </Form.Item>
        </Col>
        <Col lg={4} md={4}>
          <Form.Item label="Full Name  ">
            <div className="d-flex selectBox box_dr_name">
              <Form.Item noStyle name="prefix">
                <Select placeholder="Dr.">
                  <Option value="Dr">Dr.</Option>
                  <Option value="Prof">Prof.</Option>
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                rules={[{ required: false, message: " Full name is required" }]}
                name="fullName"
              >
                <Input placeholder="Khalid Farooq" />
              </Form.Item>
            </div>
          </Form.Item>
        </Col>
        <Col lg={4} md={4}>
          <Form.Item
            name="phone"
            label="Mobile Number*"
            rules={[
              { required: true, message: "Phone is required" },
              {
                pattern: /^\d+$/,
                message: "Phone number should only contain numeric values",
              },
              { max: 11, message: "Phone number cannot exceed 11 characters" },
              { min: 11, message: "Phone number should contain 11 numbers" },
            ]}
          >
            <Input
              disabled
              maxLength="11"
              onKeyDown={(evt) => {
                const allowedKeys = [
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Delete",
                ];
                if (!/\d/.test(evt.key) && !allowedKeys.includes(evt.key)) {
                  evt.preventDefault();
                }
              }}
              placeholder="0300-1234567"
            />
          </Form.Item>
        </Col>
        <Col lg={4} md={4}>
          <Form.Item
            name="assistantPhone"
            label="Assistant Mobile Number"
            rules={[
              {
                required: false,
                message: '"Assistant mobile number is required',
              },
              {
                pattern: /^\d+$/,
                message: "Phone number should only contain numeric values",
              },
              // { max: 11 },
              { min: 11, message: "Phone number should contain 11 numbers" },
              {
                validator: (_, value) => {
                  if (
                    !value ||
                    value.length !== 11 ||
                    /^03(2|1|3|4|0)/.test(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Invalid phone number");
                },
              },
            ]}
          >
            <Input
              maxLength="11"
              onKeyDown={(evt) => {
                const allowedKeys = [
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Delete",
                ];
                if (!/\d/.test(evt.key) && !allowedKeys.includes(evt.key)) {
                  evt.preventDefault();
                }
              }}
              placeholder="Assistant Mobile Number"
            />
          </Form.Item>
        </Col>
        <Col lg={4} md={4}>
          <Form.Item
            name="email"
            label="Email Address*"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Email Address " />
          </Form.Item>
        </Col>
        <Col lg={4} md={4}>
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth*"
            rules={[{ required: true, message: "Date of birth is required" }]}
          >
            <DatePicker
              defaultPickerValue={defaultPickerValue}
              disabledDate={disabledDate}
              className="no_icon_date"
              placeholder=" Date of Birth"
            />
          </Form.Item>
        </Col>
        <Col lg={4} md={4} className="selectBox">
          <Form.Item
            name="gender"
            label="Gender*"
            rules={[
              {
                required: true,
                message: "Gender is required",
              },
            ]}
          >
            <Select placeholder="Select Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={4} md={4} className="selectBox">
          <Form.Item
            name="city"
            label="City*"
            rules={[
              {
                required: true,
                message: "City is required",
              },
            ]}
          >
            <Select
              placeholder="Select City"
              showSearch={true}
              optionFilterProp="children"
              filterOption={(input, option) => {
                return option.children
                  ?.toString()
                  .toLowerCase()
                  .startsWith(input.toLowerCase());
              }}
            >
              {cities?.data?.map((city) => (
                <Option key={city?.id} value={city?.id} id={city?.name}>
                  {city?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={4} md={4} className="selectBox">
          <Form.Item
            name="experience"
            label="Total Experience in years*"
            rules={[
              {
                required: true,
                message: "Experience is required",
              },
            ]}
          >
            <Select placeholder="Select years">
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
              <Option value="10">10</Option>
              <Option value="11">11</Option>
              <Option value="12">12</Option>
              <Option value="13">13</Option>
              <Option value="14">14</Option>
              <Option value="15">15</Option>
              <Option value="16">16</Option>
              <Option value="17">17</Option>
              <Option value="18">18</Option>
              <Option value="19">19</Option>
              <Option value="20">20</Option>
              <Option value="21">21</Option>
              <Option value="22">22</Option>
              <Option value="23">23</Option>
              <Option value="24">24</Option>
              <Option value="25">25</Option>
              <Option value="26">26</Option>
              <Option value="27">27</Option>
              <Option value="28">28</Option>
              <Option value="29">29</Option>
              <Option value="30">30</Option>
            </Select>
          </Form.Item>
        </Col>

        {savedImage && (
          <Col lg={4} md={4} className="upload_file">
            <div className="upload_button">
              <Form.Item
                name="profilePic"
                label="Profile image*"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Please upload a profile image.",
                  },
                ]}
                extra=""
              >
                <Upload
                  name="logo"
                  listType="picture"
                  beforeUpload={handleBeforeUpload}
                  onPreview={handlePreview}
                  onChange={(e) => {
                    handleUploadChange(e);
                  }}
                  defaultFileList={[
                    {
                      url: savedImage,
                      uid: "12345",
                      status: "done",
                      name: "doctor.png",
                    },
                  ]}
                  onRemove={(e) => {
                    setBase64Image("");
                    setCapturedImage("");
                    setShowTakePhotoBtn(true);
                  }}
                >
                  <Button type="primary"> upload</Button>
                </Upload>
              </Form.Item>
              <h5>
                Camera instructions:
                {showTakePhotoBtn && (
                  <img
                  src={cameraIcon}
                  className="img-fluid right_icon"
                  onClick={() => setModalTakePhoto(true)}
                  />
                )}
                
              </h5>

              <p>
                1. Stand in front of a plain background in a well-lit room
                <br></br>
                2. Make sure there is no bright light behind you<br></br>
                3. Assume a portrait orientation, avoiding side angles
              </p>
            </div>
            <Modal
              centered
              visible={modalTakePhoto}
              onOk={() => setModalTakePhoto(false)}
              onCancel={() => setModalTakePhoto(false)}
              className="modal-xl modalTakePhotoPrev"
              cancelButtonProps={{
                style: {
                  display: "none",
                },
              }}
              okButtonProps={{
                style: {
                  display: "none",
                },
              }}
            >
              <Col md={8} className="m-auto text-center">
                {/* <img
                  alt="Preview"
                  className="img-fluid"
                  src={takePhotoPreview}
                /> */}
                <Webcam
                  style={{ width: "60%", height: "500px" }}
                  audio={false}
                  // height={500}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  // width={800}
                  videoConstraints={videoConstraints}
                />
              </Col>
              <div className="d-flex align-item-center justify-content-end mt-3">
                <Button
                  className="bg-transparent text-white btnRetake border border-white me-3"
                  key="retake"
                  onClick={capture}
                >
                  Capture
                </Button>

                <Button className="primaryBtnBg" key="upload" type="primary">
                  Upload
                </Button>
              </div>
            </Modal>
            <Modal
              visible={previewVisible}
              title=" "
              centered
              footer={null}
              onCancel={handleCancel}
              className="modal_preview"
            >
              <img
                alt="Preview"
                style={{ width: "100%" }}
                src={previewImage}
                className="preview_image"
              />
            </Modal>

            <Modal
              centered
              visible={showRetakeModal}
              onOk={() => setModalTakePhoto(false)}
              onCancel={() => setModalTakePhoto(false)}
              className="modal-xl modalTakePhotoPrev"
              cancelButtonProps={{
                style: {
                  display: "none",
                },
              }}
              okButtonProps={{
                style: {
                  display: "none",
                },
              }}
            >
              <Col md={8} className="m-auto text-center">
                {/* <img
                  alt="Preview"
                  className="img-fluid"
                  src={takePhotoPreview}
                /> */}
                <div
                  className="d-flex align-items-center justify-content-center m-auto"
                  style={{ width: "60%", height: "500px" }}
                >
                  <img src={base64Image} className="img-fluid" />
                </div>
              </Col>
              <div className="d-flex align-item-center justify-content-end mt-3">
                <Button
                  className="bg-transparent text-white btnRetake border border-white me-3"
                  key="retake"
                  onClick={retakeImage}
                >
                  Retake
                </Button>

                <Button
                  className="primaryBtnBg"
                  key="upload"
                  type="primary"
                  onClick={uploadPhotoHandler}
                >
                  Upload
                </Button>
              </div>
            </Modal>
          </Col>
        )}

        {!savedImage && (
          <Col lg={4} md={4} className="upload_file">
            <div className="upload_button">
              <Form.Item
                name="profilePic"
                label="Profile image*"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Please upload a profile image.",
                    validator: (_, value) => {
                      if (value && value.length > 0) {
                        const fileType = value[0].type;
                        const allowedFileTypes = [
                          "application/pdf",
                          "image/png",
                          "image/jpeg",
                        ];
                        const isAllowed = allowedFileTypes.includes(fileType);
                        return isAllowed
                          ? Promise.resolve()
                          : Promise.reject(
                              "Invalid file type. Only PDF, PNG, and JPG files are allowed."
                            );
                      }
                      return Promise.reject("Please upload a profile image.");
                    },
                  },
                ]}
                extra=""
              >
                <Upload
                  name="logo"
                  listType="picture"
                  beforeUpload={handleBeforeUpload}
                  onPreview={handlePreview}
                  onChange={(e) => {
                    handleUploadChange(e);
                  }}
                  onRemove={(e) => {
                    setBase64Image("");
                    setCapturedImage("");
                    setShowTakePhotoBtn(true);
                  }}
                >
                  <Button type="primary">upload</Button>
                </Upload>
              </Form.Item>
              <h5>
                Camera instructions:{" "}
                {showTakePhotoBtn && (
                  <img
                  src={cameraIcon}
                  className="img-fluid right_icon"
                  onClick={() => setModalTakePhoto(true)}
                  />
                )}
                
              </h5>

              <p>
                1. Stand in front of a plain background in a well-lit room
                <br></br>
                2. Make sure there is no bright light behind you<br></br>
                3. Assume a portrait orientation, avoiding side angles
              </p>
            </div>
            <Modal
              visible={previewVisible}
              title=" "
              centered
              footer={null}
              onCancel={handleCancel}
              className="modal_preview"
            >
              <img
                alt="Preview"
                style={{ width: "100%" }}
                src={previewImage}
                className="preview_image"
              />
            </Modal>
          </Col>
        )}
      </Row>
      <ToastContainer />
    </>
  );
}

export default PersonalInformation;
