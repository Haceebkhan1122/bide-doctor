import React from 'react'
import { Link } from 'react-router-dom';
import { SimpleButtonSmall } from '../../uiComponents/button';
import { HeadingDescVsmall } from '../../uiComponents/Headings'
import "./Appointments.scss";

const MobileAppointment = () => {
    return (
        <div className='appointments_wrapper cover_space'>
            <div className='white_color_div'>
                <div className='patient_info'>
                    <div className='flex_start justify_between'>
                        <div className='column_flex'>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Patient Name" />
                                <HeadingDescVsmall text="Nadia Khurshid Ahmed" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Reason For Visiting" />
                                <HeadingDescVsmall text="Regular checkup" />
                            </div>
                            <div className="patient_status first_time">
                                <HeadingDescVsmall text="First Time Appointment" />
                            </div>
                        </div>
                        <div className='column_flex'>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Age" />
                                <HeadingDescVsmall text="37 years" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Gender" />
                                <HeadingDescVsmall text="Female" />
                            </div>
                        </div>
                    </div>
                    <div className='flex_start justify_between'>
                        <div className='column_flex'>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Do you have a family history of diabetes?" />
                                <HeadingDescVsmall text="Yes" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Do you have a family history of diabetes?" />
                                <HeadingDescVsmall text="Yes" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Do you have a family history of diabetes?" />
                                <HeadingDescVsmall text="Yes" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Do you have a family history of diabetes?" />
                                <HeadingDescVsmall text="Yes" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Do you have a family history of diabetes?" />
                                <HeadingDescVsmall text="Yes" />
                            </div>
                            <div className='column_flex'>
                                <HeadingDescVsmall text="Do you have a family history of diabetes?" />
                                <HeadingDescVsmall text="Yes" />
                            </div>
                        </div>
                    </div>
                    <Link to={{ pathname: `/appointment/2`, state: { id: 2, type: 'in-person', user_id: 732, visit_count: "4" } }}>
                    {/* <Link to={{ pathname: `/past-consultation/8`, state: { id: 8, type: 'in-person', user_id: 732, visit_count: "4" } }}> */}
                        <SimpleButtonSmall type="submit" text="START APPOINTMENT" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MobileAppointment