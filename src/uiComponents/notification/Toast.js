import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Toast.scss';
import call from '../../assets/images/svg/call.svg';
import Toggle from '../../assets/images/gif/FinalNewToggle.webp';
import closeModal from '../../assets/images/png/crossTik.png';
import { Select, Form as AntForm, Switch, Radio } from 'antd';
import i18n from '../../i18n';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
// import { getUserDetail } from '../../redux/Actions/AuthAction';


function Toast(props) {
    const { text, link } = props;
    const [stickyClass, setStickyClass] = useState('relative');
    const [visible, setVisible] = useState(true);
    const [addClass, setAddClass] = useState('');
    const navigate = useHistory();
    const [defLang, setDefLang] = useState(null);
    let [checked, setChecked] = useState(false);
    const [myclass, changeclass] = useState("");
    const [myclassUr, changeclassUr] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showToggleModal, setToggleModal] = useState(false);





    const handleChange = () => {
        setVisible(false);
        setAddClass('transformTop');
    };

    const handleLoginNavigation = () => {
        navigate(link, { replace: true });
    };
    useEffect(() => {
        window.addEventListener('scroll', stickNavbar);
        return () => {
            window.removeEventListener('scroll', stickNavbar);
        };
    }, []);
    const stickNavbar = () => {
        if (window !== undefined) {
            const windowHeight = window.scrollY;
            windowHeight > 50 ? setStickyClass('position-fixed w-100 ') : setStickyClass('wait');
        }
    };


    const toggleChecked = useCallback(async ({ target: { value } }) => {
        setChecked((prev) => !prev)
        if (checked) {
            window.location.href = '/';
            changeclass(`lng_eng`)
            changeclassUr("")

        } else {
            // window.location.href = '/ur/';
            setToggleModal(true)
            changeclassUr(`lng_ur`)
            changeclass("")
        }

        const languageShort = { 1: '', 2: 'ur' };


    }, [checked])






    /////---------Urdu/ENglish---------------/////////////////////


    const optionsLang = [
        {
            label: i18n.t('lang_eng'),
            value: '1'
        },
        {
            label: i18n.t('lang_urdu'),
            value: '2'
        }
    ];





    return (
        <section className={`notificationToastContainer d-none d-lg-block hk_ for_doctorss topBarr ${addClass} ${stickyClass}`}>
            {visible && (
                <div className="notificationToast" >
                    {/* <h6 dir="auto" onClick={handleLoginNavigation}> {text || ''} </h6> */}
                    <a href="tel:021-111-111-111" className='d-flex'><img src={call} alt="close-icon" className='me-2' />(021)-111-111-111</a>


                    <div className='control_lang d-none'>
                        <span className={`${myclass}`}>Eng</span>
                        <label className="switch">
                            <input type="" id="togBtn" key={'langID'} name="toggleSwitch" onClick={() => setToggleModal(true)} defaultValue={defLang} />
                            {/* use below in input field when urdu is available */}
                            {/* <input type="checkbox" id="togBtn" key={'langID'} name="toggleSwitch" options={optionsLang} checked={checked} onChange={toggleChecked} defaultValue={defLang} /> */}

                            <div className="slider round">
                            </div>
                        </label>
                        <span className={`${myclassUr}`}>اردو</span>
                    </div>
                </div>
            )}

            <Modal
                className='urdumodal'
                centered
                visible={showToggleModal}
                footer={null}
                closeIcon={<img onClick={() => setToggleModal(false)} className='img-fluid mt-3' src={closeModal} alt='image' />} // Choose any icon you need.
            >
                <div>
                    <div className='coming-soon text-center mt-4'>
                        <h3>
                            <span> بہت جلد اب </span> اردو زبان میں
                        </h3>
                    </div>
                    <div className='toggleUrdu'>
                        <img style={{ height: '150px' }} className='img-fluid' src={Toggle} alt='image' />
                    </div>
                </div>
            </Modal>
        </section>
    );
}

export default Toast;