export const modalHandler = (setModal) => {
  const openPaymentModal = () => {
    setModal('payment')
  }

  const closeModal = () => {
    setModal('')
  }

  const openAddProductModal = () => {
    setModal('addProduct')
  }
  return { openPaymentModal, closeModal, openAddProductModal }
}
