import React from 'react'
import clockOrange from "../../assets/images/svg/clockOrange.svg";
import { HeadingDescSmall } from '../Headings'

const CountdowmTimer = (props) => {
    const {text} = props
    return (
        <div className="flex_center orange_bg">
            <img src={clockOrange} alt="clockOrange" />
            <HeadingDescSmall text={text} />
        </div>
    )
}

export default CountdowmTimer