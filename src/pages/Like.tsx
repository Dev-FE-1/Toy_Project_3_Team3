/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import SkeletonGridItem from '@/components/SkeletonGridItem';
import TitleHeader from '@/components/TitleHeader';
import VideoGridItem from '@/components/VideoGridItem';

interface LikedPlaylistData {
  title: string;
  userId: string;
  tags: string[];
  imgUrl: string[];
  disclosureStatus: boolean;
  id: string;
}

interface UserInformation {
  profileImage: string;
  userName: string;
  userId: string;
}

const Like: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState(8);
  const [loading, setLoading] = useState(false);
  const [likedPlaylists, setLikedPlaylists] = useState<LikedPlaylistData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userInformation, setUserInformation] = useState<UserInformation | null>(null);

  const userInformationString = localStorage.getItem('userInformation');
  let userId: string | null = null;

  if (userInformationString) {
    try {
      const userInformation = JSON.parse(userInformationString);
      userId = userInformation.userId;
    } catch (e) {
      console.error('로컬 스토리지에서 사용자 정보를 파싱하는 중 오류 발생:', e);
    }
  }

  useEffect(() => {
    const fetchUserInformation = async () => {
      if (!userId) {
        setError('로그인된 사용자가 없습니다.');
        return;
      }

      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        }
        const data = await response.json();
        setUserInformation(data);
      } catch (e) {
        console.error('사용자 정보 요청 오류:', e);
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchUserInformation();
  }, [userId]);

  useEffect(() => {
    const fetchLikedPlaylists = async () => {
      if (!userId) {
        setError('로그인된 사용자가 없습니다.');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/likePage/${userId}`); // userId 기반으로 API 호출
        if (!response.ok) {
          throw new Error('좋아요한 플레이리스트 데이터를 가져오는 중 오류가 발생했습니다.');
        }
        const result = await response.json();
        setLikedPlaylists(result.likedPlaylists);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error('데이터 요청 오류:', error);
          setError(error.message);
        } else {
          console.error('알 수 없는 오류:', error);
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPlaylists();
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
        setLoading(true);
        setTimeout(() => {
          setVisibleItems((prev) => prev + 8);
          setLoading(false);
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div css={containerStyle}>
      <TitleHeader
        profileImage={userInformation?.profileImage || '없음'}
        nickname={userInformation?.userName || '손성오'}
        actionText="Liked Playlists"
      />

      {error && <div css={errorStyle}>{error}</div>}

      <div css={gridContainerStyle}>
        {likedPlaylists.slice(0, visibleItems).map((item, index) => (
          <VideoGridItem
            key={index}
            videoId={item.id} // imgUrl에서 videoId 추출
            title={item.title}
            user={item.userId}
            showDelete={true}
            showEdit={true}
            tags={item.tags}
            profileImage={userInformation?.profileImage || ''}
            userName={item.userId} // userName을 userId로 대체
            userId={item.userId}
            imgUrl={item.imgUrl[0]} // imgUrl 배열에서 첫 번째 요소 사용
          />
        ))}
        {loading && Array.from({ length: 8 }).map((_, index) => <SkeletonGridItem key={index} />)}
      </div>
    </div>
  );
};

const containerStyle = css`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 40px;
`;

const gridContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const errorStyle = css`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

export default Like;
