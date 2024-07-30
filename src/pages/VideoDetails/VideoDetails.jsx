import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import moment from 'moment';
import dashjs from 'dashjs';
import Navbar from '../../components/Navbar/Navbar';
import './video-details.css';

const API_URL = process.env.REACT_APP_API_URL;

const VIDEO_DETAILS_URL = '/stream-video/get-videos/';
const VIDEO_STREAM_URL = '/stream-video/stream/';

const VideoDetails = () => {
  const { videoUuid } = useParams();
  const [video, setVideo] = useState(null);
  const playerRef = React.useRef(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`${VIDEO_DETAILS_URL}${videoUuid}`);
        setVideo(response.data);
      } catch (err) {
        console.error('Error fetching video details:', err);
      }
    };

    fetchVideoDetails();
  }, [videoUuid]);

  useEffect(() => {
    if (video) {
      const url = `${API_URL}${VIDEO_STREAM_URL}${videoUuid}`;

      // Reset the player if it already exists
      if (playerRef.current) {
        playerRef.current.reset();
      }

      // Create and initialize a new Dash.js player
      const player = dashjs.MediaPlayer().create();
      playerRef.current = player;
      player.initialize(document.querySelector('#videoPlayer'), url, true);
    }

    // Cleanup function to reset the player when the component unmounts or videoUuid changes
    return () => {
      if (playerRef.current) {
        playerRef.current.reset();
      }
    };
  }, [video, videoUuid]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="video-details-container">
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
    </>
  );
};

export default VideoDetails;
