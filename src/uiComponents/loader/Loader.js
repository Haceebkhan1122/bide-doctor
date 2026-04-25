import React from 'react';
import loader from "../../assets/images/gif/loader_gif.gif";
import "./loader.css";

function Loader() {
  return (
    <>
       <div class="custom-loadingWrapper">
        <img src={loader} class="gif w-90-px" alt="" />
        </div>
    </>
  )
}

export default Loader