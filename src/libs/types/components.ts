export interface IModalProps {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onClose?: () => void;
  preventDefaultClose?: boolean;
  hideCloseBtn?: boolean;
}
