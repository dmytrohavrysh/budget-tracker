import { useState } from "react";

const useModal = (isLocked=false) => {
    const [isModalOpen, setIsModalOpen] = useState(isLocked);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }

    return [isModalOpen, openModal, closeModal, isLocked];
}

export default useModal;