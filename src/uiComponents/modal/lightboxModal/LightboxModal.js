import React, { useState } from 'react'
import Carousel, { Modal, ModalGateway } from 'react-images';

const LightboxModal = (props) => {
    return (
        <ModalGateway key={props?.id} id={props?.id}>
            <Modal onClose={() => props?.setToggler1(false)}>
                <Carousel id={props?.id} key={props?.id} views={props?.files} />
            </Modal>
        </ModalGateway>
    )
}

export default LightboxModal