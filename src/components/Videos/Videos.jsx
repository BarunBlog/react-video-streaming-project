import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './videos.css';
import Video from './Video/Video';

const VIDEO_LIST_URL = '/stream-video/get-videos';

const Videos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(VIDEO_LIST_URL);
        setVideos(response.data.results);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

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
          />
        ))}
      </div>
    </div>
  );
};

export default Videos;
