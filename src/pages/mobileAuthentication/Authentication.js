import React, { useEffect, useState } from "react";
import { useParams,useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import loadingGif from "../../assets/images/gif/loader_gif.gif";
import { SelectAuth } from "../../layouts/redux/slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { asynchronouslyGetFromLocal, asynchronouslySetInLocal } from "../../utils/helperFunctions";
import { selectUser } from "./redux/slice";
import { getUserDetails } from "./redux/thunk";

const Authentication = () => {
  const url = useParams();
  const history = useHistory();
  //const dispatch = useAppDispatch();

  //const selectUserDetails = useAppSelector(selectUser);
    
  // const setUser = async () => {
  //   toast.success(selectUserDetails.message)
  //   // console.log(selectUserDetails)
  //   await asynchronouslySetInLocal("D_USER_ID", selectUserDetails.data.user.id);
  //   const token = await asynchronouslyGetFromLocal("D_USER_ID");
  //   dispatch(SelectAuth(token));
  // };

  // useEffect(() => {
  //   if (selectUserDetails?.data?.user) {
  //     setUser();
  //     // console.log(selectUserDetails, 'selectUserDetails')
  //   }
  // }, [selectUserDetails]);


  useEffect(() => {

    // console.log(url, 'First Call');
    asynchronouslySetInLocal("D_APP_TOKEN", "Bearer "+url.token);
    asynchronouslySetInLocal("D_USER_ID", url.id);
    asynchronouslySetInLocal("D_IS_MOBILE", "1");
    //let user = dispatch(getUserDetails());
    //// console.log(user, 'First Call');
    setTimeout(() => {
      history.push("/");
    }, 1000);
  }, []);

  return (
    <>
      <div className="loaderWrapper">
        <img src={loadingGif} alt="" />
      </div>
      <ToastContainer />
    </>
  );
};

export default Authentication;
