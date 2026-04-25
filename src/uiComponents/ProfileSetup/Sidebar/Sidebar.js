import React, { useEffect, useState } from "react";
// import { Box, CircularProgress,Typography } from "@mui/material";
import './Sidebar.scss';
function ProfileSetup({ progress }) {
    const AboutPercentage = progress?.about_completion;
    const QualificationPercentage = progress?.qualification_completion;
    const consultPercentage = progress?.consultation_completion;

    //  class tick conditions
    //consult conditions
    return (
        <>
            <div className="pagination_sidebar current_box d-flex" >
                {/* add current_box class on current tabs box */}
                <div className="progress_left current_left">
                    {/* add current_left class on current tabs left pagination box */}
                    {AboutPercentage === 40 ? (
                        <div className="circle01 circle-active"></div>
                        /* add circle-active to circle-current circle01 for show complated check */
                    ) : (<div className="circle01 circle-current"></div>)}
                    {AboutPercentage <= 10 ? (
                        <div className="progress_custom height-33">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>

                    ) : AboutPercentage <= 20 ? (<div className="progress_custom height-66">
                        {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                    </div>) : AboutPercentage <= 30 ? (<div className="progress_custom height-52">
                        {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                    </div>) : AboutPercentage >= 40 ? (
                        <div className="progress_custom height-101">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) : ''}

                </div>
                <div className="details_sidebar">
                    <h5>About</h5>
                    <p>Add details about yourself and your practice.
                    </p>
                    <ul className="circle_list">
                        <li className={`${AboutPercentage >= 20 ? 'list01 listactive' : 'list01'}`}>Personal Information</li>
                        <li className={`${AboutPercentage >= 30 ? 'list01 listactive' : 'list01'}`}>
                            Practice Details
                        </li>
                        <li className={`${AboutPercentage >= 40 ? 'list01 listactive' : 'list01'}`}>Bank Details</li>
                    </ul>
                </div>
            </div>
            <div className="pagination_sidebar  d-flex">
                {/* here is 2 classess for heght of progress bar  height-50 and height-66 height-99*/}
                <div className={`progress_left  ${AboutPercentage >= 10 ? 'current_left' : ''}`}>
                    {AboutPercentage === 40 && QualificationPercentage === 30 ? (
                        <div className="circle01 circle-active "></div>
                    ) : QualificationPercentage > 0 ? (
                        <div className="circle01 blue-circle"></div>
                    ) :
                        AboutPercentage >= 10 && QualificationPercentage === 0 ? (
                            <div className="circle01"></div>
                        ) : AboutPercentage === 40 && QualificationPercentage === 0 ? (
                            <div className="circle01 blue-circle"></div>
                        ) : ''}


                    {QualificationPercentage <= 0 ? (
                        <div className="progress_custom ">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) : QualificationPercentage <= 15 ? (
                        <div className="progress_custom height-40 ">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) : QualificationPercentage > 15 && QualificationPercentage < 30 ? (
                        <div className="progress_custom height-46 ">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) :
                        QualificationPercentage === 30 ? (
                            <div className="progress_custom height-101 ">
                                {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                            </div>) : ''}
                </div>
                <div className="details_sidebar ">
                    <h5>Qualifications</h5>
                    <p>Add details about your academic and professional background.
                    </p>
                    <ul className="circle_list">
                        <li className={`${QualificationPercentage >= 15 ? 'list01 listactive' : 'list01'}`}>Qualification</li>
                        <li className={`${QualificationPercentage >= 30 ? 'list01 listactive' : 'list01'}`}>
                            Experience
                        </li>
                    </ul>
                </div>
            </div>
            <div className="pagination_sidebar  d-flex">
                <div className="progress_left">

                    {QualificationPercentage === 30 && consultPercentage === 30 ? (
                        <div className="circle01 circle-active "></div>
                    ) : QualificationPercentage === 30 && consultPercentage > 0 ? (
                        <div className="circle01 blue-circle"></div>
                    ) :
                        QualificationPercentage < 30 && consultPercentage === 0 ? (
                            <div className="circle01"></div>
                        ) : QualificationPercentage === 30 && consultPercentage === 0 ? (
                            <div className="circle01 blue-circle"></div>
                        ) : ''}
                    {consultPercentage <= 0 ? (
                        <div className="progress_custom  ">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) : consultPercentage <= 15 ? (
                        <div className="progress_custom height-40 ">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) : consultPercentage > 15 && consultPercentage < 30 ? (
                        <div className="progress_custom height-66 ">
                            {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                        </div>
                    ) :
                        consultPercentage === 30 ? (
                            <div className="progress_custom height-86 ">
                                {/* here is 3 classess for heght of progress bar  height-33 and height-66 height-99*/}
                            </div>) : ''}
                </div>
                <div className="details_sidebar">
                    <h5>Consultation</h5>
                    <p>Select your consultation type, duration, fees
                        and more.
                    </p>
                    <ul className="circle_list">
                        <li className={`${consultPercentage >= 15 ? 'list01 listactive' : 'list01'}`}>Online Consultation</li>
                        <li className={`${consultPercentage >= 30 ? 'list01 listactive' : 'list01'}`}> Clinic Visits</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default ProfileSetup;