import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import './videos.css';
import Video from './Video/Video';

const VIDEO_LIST_URL = '/stream-video/get-videos';

const Videos = () => {
  const [videos, setVideos] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosPrivate.get(VIDEO_LIST_URL);
        setVideos(response.data.results);
      } catch (error) {
        console.error('Error fetching videos:', error);

        // Check if the error is due to an invalid or expired refresh token
        if (error.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    fetchVideos();
  }, [axiosPrivate, navigate, location]);

  return (
    <div className="home-container">
      <div className="videos-grid">
        {videos.map(video => (
          <Video
            key={video.uuid}
            uuid={video.uuid}
            title={video.title}
            thumbnail={video.thumbnail}
            author_name={video.author_name}
            created_at={video.created_at}
            lastPlayedSecond={video.last_streamed_second || 0} // Add last played second
            duration={video.duration || 1} // Ensure duration is not zero to avoid division errors
          />
        ))}
      </div>
    </div>
  );
};

export default Videos;
