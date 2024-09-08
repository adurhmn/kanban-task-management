import { Dialog, DialogContent } from "@/components/core";
import { IModalProps } from "@/libs/types";

export const Modal = ({
  children,
  showModal,
  setShowModal,
  onClose,
  preventDefaultClose,
}: IModalProps) => {
  const closeModal = () => {
    if (!preventDefaultClose) {
      setShowModal(false);
      onClose && onClose();
    }
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
