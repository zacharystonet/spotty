import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import { SwitchHorizontalIcon, 
        HeartIcon, 
        VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { RewindIcon, 
        FastForwardIcon, 
        PauseIcon, 
        PlayIcon, 
        ReplyIcon, 
        VolumeUpIcon,
        SwitchVerticalIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player () {
const SpotifyAPI = useSpotify();
const songInfo = useSongInfo();

const { data: session } = useSession();
const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
const [volume, setVolume] = useState(50);

const fetchCurrentSong = () => {
    if (!songInfo) {
        SpotifyAPI.getMyCurrentPlayingTrack().then((data) => {
            console.log("Now playing: ", data.body?.item)
            setCurrentTrackId(data.body?.item?.id);

            SpotifyAPI.getMyCurrentPlaybackState().then((data) => {
                setIsPlaying(data.body?.is_playing);
            });
        });
    }
};

const handlePlayPause = () => {
    SpotifyAPI.getMyCurrentPlaybackState().then((data) => {
        if(data.body.is_playing) {
            SpotifyAPI.pause();
            setIsPlaying(false);
        } else {
            SpotifyAPI.play();
            setIsPlaying(true);
        }
    });
};

useEffect(() => {
    if (SpotifyAPI.getAccessToken() && !currentTrackId) {
        fetchCurrentSong();
        setVolume(50);
    }
}, [currentTrackIdState, SpotifyAPI, session])

useEffect(() => {
    if(volume > 0 && volume < 100) {
        debouncedAdjustVolume(volume);
    }
}, [volume])

const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
        SpotifyAPI.setVolume(volume).catch((err) => {});
    }, 500, [])
)


    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
            
                <div>
                    <h3>
                        {songInfo?.name}
                    </h3>
                    <p>
                        {songInfo?.artists?.[0]?.name}
                    </p>
                </div>
            </div>
            {/* center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />  

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause}  className="button w-10 h-10" />
                ): (
                    <PlayIcon onClick={handlePlayPause}  className="button w-10 h-10" />
                )}

                <FastForwardIcon className="button" />{/* add onclick */}
                <ReplyIcon className="button" />

            </div>

            {/* right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon 
                    onClick={() => volume > 0  && setVolume(volume -10)} 
                    className="button"
                />

                <input 
                    className="w-14 md:w-28" 
                    type="range" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0} 
                    max={100} />
                <VolumeUpIcon 
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                    className="button" 
                />
            </div>       

        </div>
    );
}

export default Player