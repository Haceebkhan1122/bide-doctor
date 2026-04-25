import React from 'react'
import "./medicalhistory.css";
import moment from "moment";


function LabsReport({ patientData }) {

    const dateFormat = (item) => {
        const format = moment(item?.date, "DD/MM/YYYY")?.format("DD/MM/YYYY");
        return format
    }

    return (
        <div className='medicleHistory labReport'>
            <table
                className="table medicleTable table-responsive"
            >
                <>
                    <thead>
                        <tr className="">
                            <th className="text-center">Date</th>
                            <th className="text-center"> Lab <br></br>Name</th>
                            <th className="text-center"> ECG</th>
                            <th className="text-center"> RBS</th>
                            <th className="text-center"> Hb1Ac</th>
                            <th className="text-center"> S.Cr.</th>
                            <th className="text-center"> Urine DR</th>
                            <th className="text-center"> M.Alb</th>
                            <th className="text-center"> 24h<br></br> UP</th>
                            <th className="text-center"> 24h <br></br>CCT</th>
                            <th className="text-center"> Lipid</th>
                            <th className="text-center"> HDL  </th>
                            <th className="text-center"> FBS  </th>
                            <th className="text-center"> Glucose  </th>
                            <th className="text-center"> Trigly </th>
                            <th className="text-center"> Echo </th>
                            <th className="text-center">LDL. </th>
                            <th className="text-center">T3 </th>
                            <th className="text-center">ETT </th>
                            <th className="text-center">HBS </th>
                            <th className="text-center">Chol</th>
                            <th className="text-center">T4 </th>
                            <th className="text-center">X-Ray Chest </th>
                            <th className="text-center">CDS </th>
                            <th className="text-center">TSH </th>
                            <th className="text-center">Remarks </th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientData?.length > 0 && patientData?.map((item) => {
                            return (
                                <>
                                    <tr>
                                        <td className='text-center kh-p0'>{dateFormat(item)}</td>
                                        <td className='text-center'>{item?.lab_name}</td>
                                        <td className='text-center'>{item?.ecg}</td>
                                        <td className='text-center'>{item?.rbs}</td>
                                        <td className='text-center'>{item?.hba1c}</td>
                                        <td className='text-center'>{item?.s_creatinine}</td>
                                        <td className='text-center'>{item?.urine_dr}</td>
                                        <td className='text-center'>{item?.alb}</td>
                                        <td className='text-center'>{item?.hup}</td>
                                        <td className='text-center'>{item?.tfh_cct}</td>
                                        <td className='text-center'>{item?.total_lipid}</td>
                                        <td className='text-center'>{item?.hdl}</td>
                                        <td className='text-center'>{item?.fbs}</td>
                                        <td className='text-center'>{item?.glucose}</td>
                                        <td className='text-center'>{item?.triglyceride}</td>
                                        <td className='text-center'>{item?.echo}</td>
                                        <td className='text-center'>{item?.ldl}</td>
                                        <td className='text-center'>{item?.t3}</td>
                                        <td className='text-center'>{item?.ett}</td>
                                        <td className='text-center'>{item?.hbs}</td>
                                        <td className='text-center'>{item?.cholesterol}</td>
                                        <td className='text-center'>{item?.t4}</td>
                                        <td className='text-center'>{item?.xray_chest}</td>
                                        <td className='text-center'>{item?.cds}</td>
                                        <td className='text-center'>{item?.tsh}</td>
                                        <td className='text-center'>{item?.remarks}</td>

                                    </tr>
                                </>
                            )
                        })}
                    </tbody>
                </>
            </table>
        </div>
    )
}

export default LabsReport