import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import dashjs from 'dashjs';
import Navbar from '../../components/Navbar/Navbar';
import RelatedVideos from '../../components/RelatedVideos/RelatedVideos';
import './video-details.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useRefreshToken } from '../../hooks/useRefreshToken';

const API_URL = process.env.REACT_APP_API_URL;

const VIDEO_DETAILS_URL = '/stream-video/get-videos/';
const VIDEO_STREAM_URL = '/stream-video/stream/';

const VideoDetails = () => {
  const { videoUuid } = useParams();
  const [video, setVideo] = useState(null);
  const playerRef = React.useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axiosPrivate.get(`${VIDEO_DETAILS_URL}${videoUuid}`);
        setVideo(response.data);
      } catch (err) {
        console.error('Error fetching video details:', err);

        // Check if the error is due to an invalid or expired refresh token
        if (err.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    fetchVideoDetails();
  }, [videoUuid, axiosPrivate, navigate, location]);

  useEffect(() => {
    const streamVideo = async () => {
      try {
        // Mpd file url
        const url = `${API_URL}${VIDEO_STREAM_URL}${videoUuid}`;
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
            };
          },
          true
        );

        let newAccessToken = null;
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
              newAccessToken = await refresh();
              console.log('New Access Token:', newAccessToken);

              player.reset();
              player.initialize(document.querySelector('#videoPlayer'), url, true);

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

        player.initialize(document.querySelector('#videoPlayer'), url, true);
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

    // Cleanup function to reset the player when the component unmounts or videoUuid changes
    return () => {
      if (playerRef.current) {
        playerRef.current.reset();
      }
    };
  }, [video, videoUuid, axiosPrivate, navigate, location, refresh]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="video-details-container">
        <div className="main-content">
          <div className="video-player">
            <video id="videoPlayer" controls></video>
          </div>
          <div className="video-details-info">
            <h1 className="video-details-title">{video.title}</h1>

            <div className="video-details-author-info">
              <p className="video-details-author">Uploaded by {video.author_name}</p>
              <p className="video-details-time">{moment(video.created_at).fromNow()}</p>
            </div>

            <p className="video-details-description">{video.description}</p>
          </div>
        </div>

        <RelatedVideos category={video.category} />
      </div>
    </>
  );
};

export default VideoDetails;
