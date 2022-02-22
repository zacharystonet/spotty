
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

function useSongInfo() {
  const SpotifyAPI = useSpotify();
  const [currentIdTrack, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${SpotifyAPI.getAccessToken()}`,
            },
          }
        );
        const res = await trackInfo.json();
        setSongInfo(res);
      }
    };
    fetchSongInfo();
  }, [currentIdTrack, SpotifyAPI]);

  return songInfo;
}

export default useSongInfo;