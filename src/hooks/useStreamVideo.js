import dashjs from 'dashjs';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useStreamVideo = (video, videoUuid, refresh) => {
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const VIDEO_STREAM_URL = '/stream-video/stream/';
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const streamVideo = async () => {
      try {
        // Mpd file url
        const url = `${API_URL}${VIDEO_STREAM_URL}${videoUuid}`;
        const videoElement = document.querySelector('#videoPlayer');
        let previousTime = 0;

        console.log('Stream URL:', url);

        // Reset the player if it already exists
        if (playerRef.current) {
          playerRef.current.reset();
        }

        // Create and initialize a new Dash.js player
        const player = dashjs.MediaPlayer().create();
        playerRef.current = player;

        // Add authorization headers to the player's requests
        player.extend(
          'RequestModifier',
          () => {
            return {
              modifyRequestHeader: xhr => {
                const accessToken = localStorage.getItem('accessToken');
                console.log('Access Token:', accessToken);

                console.log('Modifying request header');
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
                return xhr;
              },
              modifyRequestURL: url => {
                let modifiedUrl = url;
                let currentTime = Math.floor(videoElement.currentTime);

                if (currentTime === previousTime) {
                  return modifiedUrl;
                }

                if (currentTime > 0) {
                  console.log(`current time: ${currentTime}`);
                  previousTime = currentTime;

                  // Append the playback time as a query parameter
                  modifiedUrl = `${url}?playbackTime=${currentTime}`;
                }

                console.log(`modified url: ${modifiedUrl}`);

                return modifiedUrl;
              },
            };
          },
          true
        );

        let lastPlaybackTime = 0;

        // Adding error handling for the chunk files
        player.on(dashjs.MediaPlayer.events.ERROR, async e => {
          console.log(`Dash error found`);

          if (e.error.data.response.status === 401) {
            try {
              // Storing the last playback time where it failed
              lastPlaybackTime = player.time();

              // Received unauthorized error from backend
              // Attempt to refresh the access token
              await refresh();

              player.reset();
              player.initialize(videoElement, url, true);

              // Delay seeking to allow the player to stabilize
              setTimeout(() => {
                player.seek(lastPlaybackTime);
              }, 500);
            } catch (err) {
              console.error('Token refresh failed:', err);
              navigate('/login', { state: { from: location }, replace: true });
            }
          } else {
            console.error('Streaming error:', e.error);
          }
        });

        player.initialize(videoElement, url, true);
      } catch (err) {
        console.error('Error fetching video stream:', err);

        if (err.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    if (video) {
      streamVideo();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.reset();
      }
    };
  }, [video, videoUuid, API_URL, location, navigate, refresh]);
};

export default useStreamVideo;
