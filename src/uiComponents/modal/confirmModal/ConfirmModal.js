import React from 'react'
import { Modal } from "react-bootstrap";
import { HeadingDesc, HeadingWithSpaceLarge, SectionHeadingMed } from "../../Headings";
// import tickIcon from "../../assets/images/svg/tick_icon.svg";
import { BiCheck } from "react-icons/bi";
import "./_confirmModal.scss";
import { SimpleButton } from '../../button';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { deleteClinic } from "../../../pages/health-clinics/redux/thunk"
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { delClinic, selectClinic } from '../../../pages/health-clinics/redux/slice';

function CancelModal(props) {
    const { show, close, type, id, closeModal } = props;
    const dispatch = useAppDispatch();
    const history = useHistory();
    // const clinics = useAppSelector(selectClinic);

    const deleteClinics = async () => {
        await dispatch(deleteClinic(id)).then(data => {
            if (data?.payload?.code === 200) {
                toast.success("Clinic is deleted successfully");
                setTimeout(() => {
                    closeModal()
                    history.go(0)

                    // history.push("/health-clinics", {
                    //     location: { state: { type: 'physical' } }
                    //   });
                }, 1500);
            }
            else {
                toast.error(data.payload.message)
            }
        });
    }

    return (
        <Modal
            show={show}
            className="modalLayout confirmModal"
            onHide={close}
            centered
            aria-labelledby="containoded-mal-title-vcenter"
        >
            <Modal.Body>
                <div className="content delete">
                    <HeadingWithSpaceLarge text="DELETE CLINIC" color="black" />
                    <HeadingDesc text="Are you sure you want to delete this Clinic?" color="black" />
                    <div className="flex_center">
                        <SimpleButton
                            text="NO"
                            bgColor="red"
                            onClick={close}
                        />
                        <SimpleButton
                            type="submit"
                            text="YES"
                            bgColor="black"
                            onClick={() => deleteClinics()}
                        />
                    </div>
                </div>
            </Modal.Body>
            <ToastContainer />
            {/* <Modal.Body>
        <div className="content">
          <div className="tick_div">
            <BiCheck color="#72D54A" className="tick_icon"/>
          </div>
          <SectionHeadingMed text="Hospital has been added successfully!" />
        </div>
      </Modal.Body> */}
        </Modal>
    );
}

export default CancelModal;
