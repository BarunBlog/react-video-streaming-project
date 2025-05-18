import dashjs from 'dashjs';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
// import { axiosPrivate } from '../api/axios';

let segmentFileNames = new Set();
const TIME_INTERVAL = 10;

const useStreamVideo = (video, videoUuid, refresh) => {
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const VIDEO_STREAM_URL = '/stream-video/stream/';
  const UPDATE_STREAMING_TIME_URL = `stream-video/stream/${videoUuid}/update-last-streamed-point/`;
  const SAVE_SEGMENT_ACTIVITY_URL = `stream-video/stream/${videoUuid}/save-segment-activity/`;
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const updateStreamingTime = async lastPlayedTime => {
      try {
        await axiosPrivate.post(UPDATE_STREAMING_TIME_URL, { last_played_second: lastPlayedTime });
      } catch (err) {
        console.error('Error updating streaming time:', err);

        // Check if the error is due to an invalid or expired refresh token
        if (err.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    const saveSegmentActivity = async () => {
      try {
        await axiosPrivate.post(SAVE_SEGMENT_ACTIVITY_URL, { segments: Array.from(segmentFileNames) });
      } catch (err) {
        console.log('Error saving segment activity:', err);

        // Check if the error is due to an invalid or expired refresh token
        if (err.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    const streamVideo = async () => {
      try {
        // Mpd file url
        const url = `${API_URL}${VIDEO_STREAM_URL}${videoUuid}#t=${video.last_streamed_second}`;
        const videoElement = document.querySelector('#videoPlayer');

        // Reset the player if it already exists
        if (playerRef.current) {
          playerRef.current.reset();
        }

        // Create and initialize a new Dash.js player
        const player = dashjs.MediaPlayer().create();
        playerRef.current = player;

        let lastRequestedURL = null;

        // Add authorization headers to the player's requests
        player.extend(
          'RequestModifier',
          () => {
            return {
              modifyRequestHeader: xhr => {

                const accessToken = localStorage.getItem('accessToken');

                if (lastRequestedURL && lastRequestedURL.includes('/api/')) {
                  if (accessToken) {
                    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
                  }
                }

                return xhr;
              },
              modifyRequestURL: url => {
                lastRequestedURL = url;

                const fileName = url.replace(/\/$/, '').split('/').pop();
                if (fileName.includes('#t=')) {
                  // Which means that this url is of mpd file
                  return url;
                }

                if (
                  video.presigned_urls &&
                  video.presigned_urls[fileName] &&
                  video.presigned_urls[fileName]['is_cached'] === true
                ) {
                  return url;
                }

                segmentFileNames.add(fileName);

                if (video.presigned_urls && video.presigned_urls[fileName] && video.presigned_urls[fileName]['url']) {
                  lastRequestedURL = video.presigned_urls[fileName]['url'];
                  return video.presigned_urls[fileName]['url'];
                } else {
                  console.warn(`Segment ${fileName} not found in presigned URLs`);
                  return null; // or handle it gracefully, maybe return a placeholder URL
                }
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

        let previousTime = 0;

        player.on(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, async e => {
          let currentTime = Math.floor(videoElement.currentTime);

          if (currentTime - previousTime > TIME_INTERVAL) {
            // Updating streaming time for the user after a certain time interval
            updateStreamingTime(currentTime);

            // Saving segment activity for the user after a certain time interval
            if (segmentFileNames.size > 0) {
              saveSegmentActivity();
              segmentFileNames.clear();
            }

            previousTime = currentTime;
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
  }, [video, videoUuid, API_URL, location, navigate, refresh, UPDATE_STREAMING_TIME_URL, SAVE_SEGMENT_ACTIVITY_URL]);
};

export default useStreamVideo;
