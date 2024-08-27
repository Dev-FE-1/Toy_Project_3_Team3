/** @jsxImportSource @emotion/react */
import { useState } from 'react';

import { css } from '@emotion/react';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '@/components/Button';
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
  const [newProfileImage, setNewProfileImage] = useState<string>(profileimage);
  const [newNickname, setNewNickname] = useState<string>(nickname);
  const [newPassword, setNewPassword] = useState<string>('');

  const handleOpenProfileModal = () => {
    setNewNickname(nickname);
    setNewPassword('');
    openModal('profileEdit');
  };

  const handleCloseProfileModal = () => closeModal('profileEdit');

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid,
          password: newPassword,
          profileimage: newProfileImage,
          nickname: newNickname,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Profile updated successfully');
        // 로컬 스토리지 업데이트
        localStorage.setItem(
          'userInformation',
          JSON.stringify({
            userid,
            profileimage: newProfileImage,
            nickname: newNickname,
            password: newPassword,
            followers: user.followers,
            following: user.following,
          }),
        );

        // 필요한 경우 상태 관리 스토어를 업데이트 (예시)
        // setUser({ ...user, information: { profileimage: newProfileImage, nickname: newNickname, password: newPassword } });

        handleCloseProfileModal(); // 모달 닫기
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageEdit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setNewProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

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
        <div css={modalContentStyle}>
          <div css={profileImageSection}>
            <img src={newProfileImage} alt="Profile" css={modalProfileImage} />
            <button css={editIconButton} onClick={handleImageEdit}>
              <Pencil size={20} color={colors.white} />
            </button>
          </div>
          <input
            css={inputStyle}
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="새 닉네임"
          />
          <input
            css={inputStyle}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
          />
          <div css={buttonWrapperStyle}>
            <Button size="md" onClick={handleProfileUpdate}>
              수정
            </Button>
          </div>
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

const modalContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 10px;
  width: 100%;
  padding: 40px 0;
`;

const profileImageSection = css`
  width: 180px;
  display: flex;
  margin-bottom: 30px;
  position: relative;
`;

const modalProfileImage = css`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #fff;
`;

const editIconButton = css`
  background-color: ${colors.gray};
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
  &:hover {
    background-color: #00cc75;
  }
`;

const inputStyle = css`
  width: 80%;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 15px;
  background-color: #333333;
  border: none;
  border-radius: 10px;
  color: white;
  &::placeholder {
    color: #888888;
  }
`;

const buttonWrapperStyle = css`
  width: 85%;
  margin-top: 15px;

  button {
    width: 100%;
    font-size: 16px;
    background-color: ${colors.primaryGreen};
    color: ${colors.white};
    text-align: center;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    &:hover {
      background-color: #00cc75;
    }
  }
`;
