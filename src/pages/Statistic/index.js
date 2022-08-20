import { useState } from 'react';
import Modal from '../../components/Modal';
import useModal from '../../hooks/useModal';

const Statistic = () => {
    const [isModalOpen, openModal, closeModal, isLocked ] = useModal();

    return (<>
        <Modal open={isModalOpen} onClose={closeModal} locked={isLocked}><input type="text"/></Modal>
        <button onClick={openModal}>Open modal</button>
        </>
    );
}

export default Statistic;