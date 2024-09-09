/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import SkeletonGridItem from '@/components/SkeletonGridItem';
import TitleHeader from '@/components/TitleHeader';
import VideoGridItem from '@/components/VideoGridItem';
import Loading from '@/components/Loading';
import useUserStore from '@/stores/useUserStore';
import { IPlaylistData } from '@/types/playlistTypes';
import { IUserInformation } from '@/types/userTypes';
import { useInfinityScrollStore } from '@/stores/useInfinityScrollStore'; // Infinity Scroll 상태 사용

const PlaylistPage: React.FC = () => {
  const { userIdParams } = useParams<{ userIdParams: string }>();
  const [playlists, setPlaylists] = useState<IPlaylistData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userInformation, setUserInformation] = useState<IUserInformation | null>(null);
  const [titleNickName, setTitleNickName] = useState<string>('');
  const [titleProfileImage, setTitleProfileImage] = useState<string>('');

  const user = useUserStore((state) => state.userInformation);

  const {
    visibleItems,
    loading,
    hasMore,
    setVisibleItems,
    setLoading,
    initializeScroll,
    resetScrollState,
    setHasMore,
  } = useInfinityScrollStore(); // zustand 상태 사용

  let userId: string | null = null;

  if (user.userId) {
    try {
      userId = user.userId;
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

  const fetchPlaylistData = async () => {
    if (!userId) {
      setError('로그인된 사용자가 없습니다.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/playlistPage/${userIdParams}`);
      if (!response.ok) {
        throw new Error('플레이리스트 데이터를 가져오는 중 오류가 발생했습니다.');
      }
      const result = await response.json();

      const filteredPlaylists = result.playlists.filter((playlist: IPlaylistData) => {
        if (userInformation?.userId === userIdParams) {
          return playlist.userId === userIdParams;
        } else {
          setTitleNickName(playlist.nickname);
          setTitleProfileImage(playlist.profileImage);
          return playlist.userId === userIdParams && playlist.disclosureStatus === true;
        }
      });

      setPlaylists(filteredPlaylists);
      setHasMore(result.playlists.length > visibleItems); // 더 로드할 데이터가 있는지 확인
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

  const fetchMoreItems = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleItems(visibleItems + 8); // 추가 데이터 로드
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchPlaylistData();
  }, [userId, userInformation, visibleItems]);

  useEffect(() => {
    const cleanup = initializeScroll(fetchMoreItems); // 스크롤 이벤트 등록
    return () => cleanup(); // 컴포넌트 언마운트 시 리스너 제거
  }, [loading, hasMore]);

  useEffect(() => {
    return () => resetScrollState(); // 컴포넌트가 언마운트 될 때 스크롤 상태 리셋
  }, []);

  const handleDeleteItem = (index: number) => {
    setPlaylists((prevPlaylists) => prevPlaylists.filter((_, i) => i !== index));
  };

  const isUserViewingOwnPage = userInformation?.userId === userIdParams;

  return (
    <div css={containerStyle}>
      <TitleHeader
        profileImage={titleProfileImage || '없음'}
        nickname={titleNickName || ''}
        actionText="플레이리스트"
        showAddPlaylistButton={isUserViewingOwnPage}
      />
      {error && <div css={errorStyle}>{error}</div>}
      {loading && (
        <>
          <div>
            <div css={LoadingStyle}>
              <Loading />
            </div>
            <div css={gridContainerStyle}>
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonGridItem key={index} />
              ))}
            </div>
          </div>
        </>
      )}
      <div css={gridContainerStyle}>
        {playlists.slice(0, visibleItems).map((item, index) => {
          return (
            <VideoGridItem
              key={index}
              videoId={item.id}
              title={item.title}
              user={item.userId}
              showDelete={isUserViewingOwnPage}
              showEdit={isUserViewingOwnPage}
              showMenuDot={isUserViewingOwnPage}
              tags={item.tags}
              profileImage={item.profileImage}
              userName={item.nickname}
              userId={item.userId}
              imgUrl={item.imgUrl[0]}
              videoCount={item.videoCount}
              index={index}
              deleteItem={handleDeleteItem}
            />
          );
        })}
      </div>
    </div>
  );
};

const containerStyle = css`
  width: 100%;
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

const LoadingStyle = css`
  position: absolute;
  top: 40%;
  left: 60%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const errorStyle = css`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

export default PlaylistPage;
