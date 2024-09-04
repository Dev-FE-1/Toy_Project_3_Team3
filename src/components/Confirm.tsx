/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import { css, Global } from '@emotion/react';
import Swal from 'sweetalert2';

interface ConfirmDialogProps {
  title: string;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
  deleteItem?: (index: number) => void;
  index?: number;
}

const Confirm: React.FC<ConfirmDialogProps> = ({
  title,
  text,
  onConfirm,
  onClose,
  index,
  deleteItem,
}) => {
  useEffect(() => {
    Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#00FFA3',
      cancelButtonColor: '#7E7E7E',
      confirmButtonText: '예',
      cancelButtonText: '아니요',
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        title: 'custom-title',
        popup: 'custom-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
        if (deleteItem && index != null && index >= 0) {
          deleteItem(index);
        }
      }
      onClose();
    });
  }, [title, text, onConfirm, onClose, deleteItem, index]);

  return <Global styles={ConfirmStyles} />;
};

export default Confirm;

export const ConfirmStyles = css`
  .swal2-container {
    z-index: 21000; /* 기존 z-index 유지 */
  }

  .custom-confirm-button {
    width: 120px;
    height: 40px;
    border-radius: 10px;
    margin: 25px 15px 20px 15px;
    color: #ffffff !important;
    font-size: 18px !important;
    font-weight: 500;
    background-color: #1ee13c !important;
  }

  .custom-cancel-button {
    width: 120px;
    height: 40px;
    border-radius: 10px;
    margin: 25px 15px 20px 15px;
    color: #ffffff !important;
    font-size: 18px !important;
    font-weight: 500;
  }

  .custom-title {
    margin: 40px 0 20px 0 !important;
    font-size: 22px !important;
    color: #ffffff !important;
    font-weight: bold;
    text-align: center;
  }

  .custom-popup {
    background-color: #333 !important;
    border-radius: 10px !important;
  }
`;
