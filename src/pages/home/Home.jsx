import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './home.css';
import moment from 'moment';

const VIDEO_LIST_URL = '/stream-video/get-videos';

const Home = () => {
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
  }, [videos]);

  return (
    <div className="home-container">
      <div className="videos-grid">
        {videos.map(video => (
          <div key={video.uuid} className="video-card">
            <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
            <div className="video-info">
              <p className="video-title">{video.title}</p>

              <div className="video-author-info">
                <p className="video-author">Uploaded By {video.author_name}</p>
                <p className="video-time">{moment(video.created_at).fromNow()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
