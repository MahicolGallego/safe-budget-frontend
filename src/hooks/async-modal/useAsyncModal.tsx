import { useState } from "react";

export const useAsyncModal = () => {
  const [modalLoading, setModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleShowModal = () => {
    setOpenModal(true);
  };

  const handleHiddenModal = () => {
    setOpenModal(false);
  };
  return {
    //properties
    openModal,
    modalLoading,

    //methods
    handleShowModal,
    handleHiddenModal,
    setModalLoading,
  };
};
