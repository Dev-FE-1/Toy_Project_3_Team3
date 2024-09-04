/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react';
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
import 'react-toastify/dist/ReactToastify.css';
import useUserDataFetch from '@/hooks/useUserDataFetch';
export interface SignupData {
  nickname?: string | null;
  userId: string | null;
  password?: string | null;
}

const Signup: React.FC = () => {
  const signinModal = useModalStore((state) => state.modals);
  const openSigninModal = useModalStore((state) => state.openModal);
  const [newUser, setNewUser] = useState<SignupData>({
    nickname: null,
    userId: null,
    password: null,
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { mutateAsync } = useUserDataFetch();

  const onSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewUser({
      nickname: nameRef.current?.value ?? null,
      userId: idRef.current?.value ?? null,
      password: passwordRef.current?.value ?? null,
    });
  };

  const checkbox = document.getElementById('check') as HTMLInputElement;

  const addNewUser = async () => {
    if (newUser.userId && newUser.nickname && newUser.password && checkbox?.checked) {
      try {
        const userData = {
          userId: newUser.userId,
          nickname: newUser.nickname,
          password: newUser.password,
        };
        const res = await mutateAsync({ api: 'register', userData });
        if (res === 201) {
          toast.success('가입이 완료되었습니다.');
          openSigninModal('signin');
        }
      } catch (error) {
        console.error(error);
        toast.error('계정 생성 중에 오류가 발생하였습니다. 다시 시도해주세요.');
      }
    }
  };

  const validation = async () => {
    if (newUser.nickname && newUser.userId && !checkbox?.checked && signinModal.modalState) {
      toast.error('모두 확인하였는지 체크해주세요.');
    } else {
      try {
        const userData = {
          userId: newUser.userId,
          nickname: newUser.nickname,
        };
        const res = await mutateAsync({ api: 'validate', userData });
        if (res === 200) {
          addNewUser();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 400) {
            const { field } = error.response.data;
            if (field === 'userId') {
              toast.error('중복된 ID 입니다.');
            } else if (field === 'nickname') {
              toast.error('중복된 닉네임입니다.');
            }
          }
        }
      }
    }
  };

  const children: React.ReactNode = (
    <>
      <h2 css={{ margin: '50px 0 20px', fontSize: '28px' }}>회원가입</h2>
      <form css={{ width: '330px' }} onSubmit={(e) => onSignup(e)}>
        <div css={idAndPasswordArea}>
          <input css={idAndPassword} ref={nameRef} type="text" required />
          <label>NickName</label>
        </div>
        <div css={idAndPasswordArea}>
          <input css={idAndPassword} ref={idRef} type="text" required />
          <label>ID</label>
        </div>
        <div css={idAndPasswordArea}>
          <input css={idAndPassword} ref={passwordRef} type="password" required />
          <label>Password</label>
        </div>
        <div css={{ fontSize: '12px' }}>
          <label css={{ cursor: 'pointer', accentColor: `${colors.primaryGreen}` }} htmlFor="check">
            모두 확인 하셨습니까?
            <input css={{ cursor: 'pointer' }} type="checkBox" id="check" />
          </label>
        </div>
        <button css={submitBtn} type="submit" onClick={validation}>
          가입하기
        </button>
      </form>
      <p css={{ fontSize: '14px', marginBottom: '40px' }}>
        로그인하시겠습니까?
        <button css={modalMovementBtn} onClick={() => openSigninModal('signin')}>
          Go back to login
        </button>
      </p>
      <ToastContainer
        position="bottom-center"
        limit={2}
        closeButton={false}
        autoClose={3000}
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
