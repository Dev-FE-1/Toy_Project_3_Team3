/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import Modal from '@/components/Modal';
import {
  submitBtn,
  idAndPasswordArea,
  idAndPassword,
  modalMovementBtn,
} from '@/components/sign/Signin';
import useModalStore from '@/stores/useModalStore';
import { colors } from '@/styles/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';

import 'react-toastify/dist/ReactToastify.css';

interface SignupData {
  nickname: string | null;
  userid: string | null;
  password: string | null;
}

const Signup: React.FC = () => {
  const signinModal = useModalStore((state) => state.modals);
  const openSigninModal = useModalStore((state) => state.openModal);
  const [newUser, setNewUser] = useState<SignupData>({
    nickname: null,
    userid: null,
    password: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewUser({
      nickname: nameRef.current?.value ?? null,
      userid: idRef.current?.value ?? null,
      password: passwordRef.current?.value ?? null,
    });
    setIsSubmitting(true);
  };

  const checkbox = document.getElementById('check') as HTMLInputElement;

  const addNewUser = async () => {
    if (newUser.userid && newUser.nickname && newUser.password && checkbox?.checked) {
      try {
        const res = await axios.post('/api/register', {
          userid: newUser.userid,
          nickname: newUser.nickname,
          password: newUser.password,
        });
        if (res.status === 201) {
          toast.success('가입이 완료되었습니다.');
          openSigninModal('signin');
        }
      } catch (error) {
        console.error(error);
        toast.error('계정 생성 중에 오류가 발생하였습니다. 다시 시도해주세요.');
      }
    }
  };

  useEffect(() => {
    const validation = async () => {
      if (!checkbox?.checked && signinModal.modalState) {
        toast.error('모두 확인하였는지 체크해주세요.');
        setIsSubmitting(false);
        return;
      }
      try {
        const res = await axios.post('/api/signup/validate', {
          userid: newUser.userid,
          nickname: newUser.nickname,
        });
        if (res.status === 200) {
          await addNewUser();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 400) {
            const { field } = error.response.data;
            if (field === 'userid') {
              toast.error('중복된 ID 입니다.');
            } else if (field === 'nickname') {
              toast.error('중복된 닉네임입니다.');
            }
          }
        }
      }
      setIsSubmitting(false);
    };
    validation();
  }, [isSubmitting]);

  const children: React.ReactNode = (
    <>
      <h2 css={{ margin: '40px 0 40px', fontSize: '28px' }}>회원가입</h2>
      <form css={{ width: '330px' }} onSubmit={(e) => onSignup(e)}>
        <div css={idAndPasswordArea}>
          <Input css={idAndPassword} ref={nameRef} type="text" required />
          <label>Username</label>
        </div>
        <div css={idAndPasswordArea}>
          <Input css={idAndPassword} ref={idRef} type="text" required />
          <label>Id</label>
        </div>
        <div css={idAndPasswordArea}>
          <Input css={idAndPassword} ref={passwordRef} type="password" required />
          <label>Password</label>
        </div>
        <div css={{ fontSize: '14px' }}>
          <label
            css={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              accentColor: `${colors.primaryGreen}`,
            }}
            htmlFor="check"
          >
            <input css={{ cursor: 'pointer', marginRight: '10px' }} type="checkBox" id="check" />
            모두 확인 하셨습니까?
          </label>
        </div>
        <Button css={submitBtn} type="submit">
          가입하기
        </Button>
      </form>
      <p css={{ fontSize: '14px', marginBottom: '40px' }}>
        로그인하시겠습니까?
        <button css={modalMovementBtn} onClick={() => openSigninModal('signin')}>
          Go back to login
        </button>
      </p>
      <ToastContainer
        position="bottom-center"
        limit={1}
        closeButton={false}
        autoClose={2000}
        hideProgressBar
      />
    </>
  );
  return (
    <>
      {signinModal.modalName === 'signup' && signinModal.modalState ? (
        <Modal children={children} modalName="signup" />
      ) : null}
    </>
  );
};

export default Signup;
