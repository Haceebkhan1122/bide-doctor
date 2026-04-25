import React from 'react'
import { HeadingDescSmall } from '../../Headings';
import "./_TextCard.scss"

function TextCard(props) {
    const {text} = props
  return (
    <div className='text_card_container'>
        <HeadingDescSmall text={text} />
    </div>
  )
}

export default React.memo(TextCard);