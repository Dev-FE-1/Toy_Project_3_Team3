import axios from 'axios';
import { IPlaylist } from '@/types/playlistTypes';

export const searchPlaylists = async (
  searchTerm: string,
  filter: 'recent' | 'popular',
): Promise<IPlaylist[]> => {
  try {
    const response = await axios.get('/api/searchs', {
      params: { term: searchTerm, filter },
    });
    return response.data;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    throw error;
  }
};
