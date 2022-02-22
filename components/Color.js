import { useRecoilState, useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify";
import { ColorExtractor } from 'react-color-extractor'

function Color ( {order, track })  {
    const SpotifyAPI = useSpotify();
    const playlist = useRecoilValue(playlistState)
    state = { colors: [] };

    const { colors } = colors.map((color, id))

    return (
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                
                
        <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt="" />
        
        
        <div>
            <p>PLAYLIST</p>
            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                {playlist?.name}
            </h1>
        </div>
    </section>
    );
}

export default Color