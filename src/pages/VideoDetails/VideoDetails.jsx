import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import moment from 'moment';
import dashjs from 'dashjs';
import './video-details.css';

const API_URL = process.env.REACT_APP_API_URL;

const VIDEO_DETAILS_URL = '/stream-video/get-videos/';
const VIDEO_STREAM_URL = API_URL + '/stream-video/stream/';

const VideoDetails = () => {
  const { videoUuid } = useParams();
  const [video, setVideo] = useState(null);

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
    const streamVideo = async () => {
      const url = VIDEO_STREAM_URL + videoUuid;

      try {
        const player = dashjs.MediaPlayer().create();
        player.initialize(document.querySelector('#videoPlayer'), url, true);
      } catch (err) {
        console.error('Error streaming the video:', err);
      }
    };

    streamVideo();
  }, [videoUuid, video]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-details-container">
      <div className="video-player">
        <video id="videoPlayer" controls></video>
      </div>
      <div className="video-details-info">
        <h1 className="video-details-title">{video.title}</h1>
        <p className="video-details-author">Uploaded by {video.author_name}</p>
        <p className="video-details-time">{moment(video.created_at).fromNow()}</p>
        <p className="video-details-description">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoDetails;
