/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { X } from 'lucide-react';

import { colors } from '@/styles/colors';
import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div css={wrapper}>
      <div css={loginModalArea}>
        <button css={closeBtn} onClick={onClose}>
          <X css={{ color: '#888' }} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

const wrapper = css`
  margin: 0;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const loginModalArea = css`
  position: relative;
  width: 480px;
  display: flex;
  flex-direction: column;
  background-color: #1d1d1d;
  border-radius: 15px;
  color: ${colors.white};
  align-items: center;
`;

const closeBtn = css`
  position: absolute;
  right: 0;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 16px;
  cursor: pointer;
`;
