/** @jsxImportSource @emotion/react */
import { FormEvent } from 'react';

import Modal from '@/components/Modal';
import {
  submitBtn,
  idAndPasswordArea,
  idAndPassword,
  modalMovementBtn,
} from '@/components/sign/Signin';
import useModalStore from '@/stores/useModalStore';
import { colors } from '@/styles/colors';

const Signup: React.FC = () => {
  const { isModalOpen, closeModal, openModal } = useModalStore();

  const handleOpenSignin = () => {
    openModal('signin');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 회원가입 로직
    closeModal('signup');
  };

  const children: React.ReactNode = (
    <>
      <h2 css={{ margin: '50px 0 20px', fontSize: '28px' }}>Sign Up</h2>
      <form css={{ width: '330px' }} onSubmit={handleSubmit}>
        <div css={idAndPasswordArea}>
          <input css={idAndPassword} type="text" required />
          <label>Name</label>
        </div>
        <div css={idAndPasswordArea}>
          <input css={idAndPassword} type="text" required />
          <label>ID</label>
        </div>
        <div css={idAndPasswordArea}>
          <input css={idAndPassword} type="password" required />
          <label>Password</label>
        </div>
        <div css={{ fontSize: '14px' }}>
          <label
            css={{ cursor: 'pointer', accentColor: `${colors.primaryGreen}` }}
            htmlFor="remember"
          >
            <input css={{ cursor: 'pointer' }} type="checkBox" id="remember" />
            All confirmed
          </label>
        </div>
        <button css={submitBtn} type="submit">
          Sign Up
        </button>
      </form>
      <p css={{ fontSize: '14px', marginBottom: '40px' }}>
        Want to sign in?
        <button css={modalMovementBtn} onClick={handleOpenSignin}>
          Go back to login
        </button>
      </p>
    </>
  );

  return (
    <Modal modalName="signup" isOpen={isModalOpen('signup')} onClose={() => closeModal('signup')}>
      {children}
    </Modal>
  );
};

export default Signup;
