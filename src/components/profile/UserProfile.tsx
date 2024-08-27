/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import Modal from '@/components/Modal';
import useModalStore from '@/stores/useModalStore';
import { IUser } from '@/stores/useUserStore';
import { colors } from '@/styles/colors';

interface ProfileProps {
  user: IUser;
}

export interface RealUserData {
  userid: string;
  profileimage: string;
  nickname: string;
  password: string;
  followers: string[];
  following: string[];
}

const UserProfile: React.FC<ProfileProps> = ({ user }) => {
  const { profileimage, nickname, userid } = user.information;
  const storageUserData = localStorage.getItem('userInformation');
  const realUserData: RealUserData | null = storageUserData ? JSON.parse(storageUserData) : null;

  const { openModal, closeModal, isModalOpen } = useModalStore();

  const handleOpenProfileModal = () => openModal('profileEdit');
  const handleCloseProfileModal = () => closeModal('profileEdit');

  return (
    <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
      <img css={profileimageArea} src={profileimage} alt="Profile" />
      <div css={{ marginLeft: '30px' }}>
        <h1 css={{ fontSize: '32px' }}>{nickname}</h1>
        <div
          css={{
            width: '300px',
            display: 'flex',
            justifyContent: 'space-between',
            margin: '30px 5px 20px',
            color: `${colors.lightestGray}`,
          }}
        >
          <p>@{userid}</p>
          <Link to="/follow" css={{ color: `${colors.lightestGray}` }}>
            팔로워 {user.followers.length}
          </Link>
          <Link to="/playlist" css={{ color: `${colors.lightestGray}` }}>
            플레이리스트 {user.following.length}
          </Link>
        </div>
        {realUserData?.userid === userid ? (
          <button css={profileEditOrFollowerBtn} onClick={handleOpenProfileModal}>
            프로필 수정
          </button>
        ) : (
          <button css={profileEditOrFollowerBtn}>팔로우</button>
        )}
      </div>

      <Modal
        modalName="profileEdit"
        isOpen={isModalOpen('profileEdit')}
        onClose={handleCloseProfileModal}
      >
        <h2 css={modalHeaderStyle}>프로필 수정</h2>
        <div css={formGroup}>
          <label css={labelStyle} htmlFor="nickname">
            닉네임
          </label>
          <input css={inputStyle} type="text" id="nickname" placeholder="닉네임 입력" />
        </div>
        <div css={formGroup}>
          <label css={labelStyle} htmlFor="profileImage">
            프로필 이미지 URL
          </label>
          <input
            css={inputStyle}
            type="text"
            id="profileImage"
            placeholder="프로필 이미지 URL 입력"
          />
        </div>
        <div css={buttonGroup}>
          <button css={modalButton}>저장</button>
          <button css={modalButton} onClick={handleCloseProfileModal}>
            취소
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;

const profileimageArea = css`
  width: 230px;
  height: 230px;
  border-radius: 50%;
`;

const profileEditOrFollowerBtn = css`
  width: 100px;
  height: 30px;
  background-color: ${colors.gray};
  color: ${colors.white};
  font-weight: 500;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  &:hover {
    background-color: #878787;
  }
`;

const modalHeaderStyle = css`
  margin-bottom: 20px;
  font-size: 24px;
  color: ${colors.white};
  text-align: center;
`;

const formGroup = css`
  margin-bottom: 15px;
  width: 100%;
`;

const labelStyle = css`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: ${colors.lightestGray};
`;

const inputStyle = css`
  width: calc(100% - 20px);
  padding: 8px 10px;
  font-size: 16px;
  border: 1px solid ${colors.gray};
  border-radius: 5px;
  background-color: #2c2c2c;
  color: ${colors.white};
`;

const buttonGroup = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const modalButton = css`
  width: 80px;
  height: 30px;
  background-color: ${colors.gray};
  color: ${colors.white};
  font-weight: 500;
  border: none;
  border-radius: 15px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-color: #878787;
  }
`;
