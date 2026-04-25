import React from 'react'
import "./medicalhistory.css";


function MedicalHistory({ patientData }) {

    return (
        <div className='medicleHistory'>
            <table className="table medicleTable">
                <>
                    <thead>
                        <tr className="">
                            <th className="text-left" >Date</th>
                            <th className=""> Question
                            </th>
                            <th className=""> Response
                            </th>
                            <th className=""> Remarks
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientData?.medical_history?.length > 0 && patientData?.medical_history?.map((item) => {
                            return (
                                <>
                                    <tr>
                                        <td>{patientData?.date}</td>
                                        <td>{item?.Question}</td>
                                        <td>{item?.Answer == 1 ? 'Yes' : 'No'}</td>
                                        <td>{item?.Response}</td>
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

export default MedicalHistory