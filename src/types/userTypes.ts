import { IPlaylist } from '@/types/playlistTypes';

export interface IUserData {
  userId: string;
  password: string;
  profileImage: string;
  nickname: string;
  likes: string[];
  following: FollowingFollowers[];
  followers: FollowingFollowers[];
  myPlaylists: IPlaylist[];
}

export interface IUserInformation {
  userId: string;
  password: string;
  profileImage: string;
  nickname: string;
}

type FollowingFollowers = Omit<IUserInformation, 'password'>;
