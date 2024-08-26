import React from 'react';
import moment from 'moment';
import { FaPlayCircle } from 'react-icons/fa';
import './video.css';
import { Link } from 'react-router-dom';

const Video = ({ uuid, title, thumbnail, author_name, created_at }) => {
  return (
    <Link to={`/videos/${uuid}`} className="video-link">
      <div key={uuid} className="video-card">
        <div className="thumbnail-container">
          <img src={thumbnail} alt={title} className="video-thumbnail" />
          <div className="play-button">
            <FaPlayCircle />
          </div>
        </div>
        <div className="video-info">
          <p className="video-title">{title}</p>

          <div className="video-author-info">
            <p className="video-author">{author_name}</p>
            <p className="video-time">{moment(created_at).fromNow()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Video;
