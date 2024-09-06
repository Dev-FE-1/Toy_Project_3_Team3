/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Heart } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Tags from '@/components/Tags';
import User from '@/components/User';
import { colors } from '@/styles/colors';
import forkVideoId from '@/utils/forkVideoId';
import useYoutubeFetch from '@/hooks/useYoutubeFetch';
import useWatchDataFetch from '@/hooks/useWatchDataFetch';
import { useEffect, useState } from 'react';
import useUserStore from '@/stores/useUserStore';
import { If } from '@/components/IfElse';
import { useLikeCheck, useLikeUpdate } from '@/hooks/watch/useLike';
import { useFollowingCheck, useFollowingUpdate } from '@/hooks/watch/useFollowing';

function PlaylistInfo() {
  const navigate = useNavigate();
  const playlistId = useParams().playlistId as string;
  const urlParams = new URLSearchParams(useLocation().search);
  const playingVideoId = urlParams.get('v') as string;
  const userInformation = useUserStore((state) => state.userInformation);
  const { mutate: mutateForLike } = useLikeUpdate(playlistId);
  const { mutate: mutateForFollowing } = useFollowingUpdate(playlistId);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playlistOwner, setPlaylistOwner] = useState<string | null>(null);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const {
    isLoading: playlistLoading,
    data: playlistData,
    error: playlistError,
    refetch: playlistRefetch,
  } = useWatchDataFetch(playlistId);

  const {
    data: youtubeData,
    error: youtubeError,
    isLoading: youtubeIsLoading,
  } = useYoutubeFetch(videoId as string, !!videoId, playlistId);

  const { data: isFollowingData, isSuccess: isFollowingSuccess } = useFollowingCheck(
    playlistId,
    userInformation.userId,
    playlistOwner as string,
    !!playlistOwner,
  );

  const { data: isLikeData, isSuccess: isLikeSuccess } = useLikeCheck(
    playlistId,
    userInformation.userId,
    !!userInformation.userId,
  );

  useEffect(() => {
    if (playlistData) {
      const { link, userId, like } = playlistData;
      setVideoId(link.map((l) => forkVideoId(l)).join(','));
      setPlaylistOwner(userId);
      setLikeCount(like);
    }
  }, [playlistData]);

  useEffect(() => {
    if (isLikeSuccess && isLikeData !== null) {
      setIsLike(isLikeData);
    }
  }, [isLikeData, isLikeSuccess]);

  useEffect(() => {
    if (isFollowingSuccess && isFollowingData !== null) {
      setIsFollowing(isFollowingData);
    }
  }, [isFollowingData, isFollowingSuccess]);

  const handleEvent = {
    like() {
      const newIsLike = !isLike;
      const newLikeCount = newIsLike ? likeCount + 1 : likeCount - 1;

      setIsLike(newIsLike);
      setLikeCount(newLikeCount);

      const type = newIsLike ? 'likeAdd' : 'likeDelete';
      mutateForLike(
        { type, userId: userInformation.userId },
        {
          onError: () => {
            setIsLike(!newIsLike);
            setLikeCount(likeCount);
          },
          onSettled: () => {
            playlistRefetch();
          },
        },
      );
    },
    following() {
      const type = isFollowing ? 'followDelete' : 'follow';
      mutateForFollowing({
        type,
        followerUserId: userInformation.userId,
        targetUserId: playlistOwner as string,
      });
    },
  };

  if (playlistLoading || youtubeIsLoading) {
    return <div></div>;
  }

  if (playlistError) {
    alert('플레이리스트 조회에 오류가 발생했습니다.');
    navigate('/');
    return null;
  }

  if (youtubeError) {
    alert('유튜브 조회에 오류가 발생했습니다.');
    navigate('/');
    return null;
  }

  if (!youtubeData || !playlistData) {
    return null;
  }

  const { title, tags, content, date, userName, profileImage, userId } = playlistData;
  const videoTitle = youtubeData.items.filter((item) => item.id === playingVideoId)[0].snippet
    .title;

  return (
    <div className="playlist-info" css={playlistInfo}>
      <div className="info-header">
        <div className="title">
          <p className="playlist-title">{title}</p>
          <p className="video-title">{videoTitle}</p>
        </div>
        <div className="actions">
          <Button size="md" onClick={handleEvent.like}>
            <Heart
              size="18"
              fill={isLike ? colors.primaryGreen : 'transparent'}
              strokeWidth={isLike ? '0' : '2'}
            />
            <span>{likeCount}</span>
          </Button>
          <Tags tags={tags} />
        </div>
      </div>

      <div className="owner">
        <User profileImage={profileImage} nickname={userName} userId={userId} size="lg" />
        <If test={userId !== userInformation.userId}>
          <If.Then>
            <Button onClick={handleEvent.following}>{isFollowing ? '팔로잉 중' : '팔로잉'}</Button>
          </If.Then>
        </If>
      </div>
      <div className="content">
        <p>{date}</p>
        {content}
      </div>
    </div>
  );
}

export default PlaylistInfo;

const playlistInfo = css`
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 10px;
    margin-bottom: 20px;
    .title {
      flex-grow: 1;
      min-width: 0;
      .playlist-title {
        max-width: 100%;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .video-title {
        font-size: 16px;
      }
    }

    .actions {
      flex-shrink: 0;
      display: flex;
      gap: 5px;
      align-items: center;
    }
  }

  .owner {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
  }

  .content {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 1.3;
    p {
      margin-bottom: 5px;
      font-size: 13px;
      color: ${colors.lightestGray};
    }
  }
`;
