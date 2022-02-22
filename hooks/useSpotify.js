import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import SpotifyAPI from "../lib/spotify"

function useSpotify() {
    const { data: session } = useSession();

    useEffect (() => {
        if (session) {
            // if refresh access token attempt fails, direct user to login...
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }
            SpotifyAPI.setAccessToken(session.user.accessToken);
        }
    }, [session]);

    return SpotifyAPI;
}

export default useSpotify;