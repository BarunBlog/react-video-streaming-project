import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import './search-video.css';
import Navbar from '../../components/Navbar/Navbar';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const VIDEO_LIST_URL = '/stream-video/get-videos';

const SearchVideo = () => {
  const [videos, setVideos] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const title = new URLSearchParams(location.search).get('title');
  const category = new URLSearchParams(location.search).get('category');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosPrivate.get(VIDEO_LIST_URL, {
          params: {
            title: title || null,
            category: category || null,
          },
        });

        setVideos(response.data.results);
      } catch (err) {
        console.error('Error fetching videos:', err);

        // Check if the error is due to an invalid or expired refresh token
        if (err.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    fetchVideos();
  }, [title, category, axiosPrivate, navigate, location]);

  return (
    <>
      <Navbar />

      <div className="search-results">
        {videos.length > 0 ? (
          videos.map(video => (
            <Link to={`/videos/${video.uuid}`} key={video.uuid}>
              <div className="video-search-item">
                <img src={video.thumbnail} alt={video.title} className="video-search-thumbnail" />
                <div className="video-search-details">
                  <h3 className="video-search-title">{video.title}</h3>
                  <p className="video-search-author">By: {video.author_name}</p>
                  <p className="video-search-category">Category: {video.category}</p>
                  <p className="video-search-date">Uploaded: {moment(video.created_at).format('MMMM Do YYYY')}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No results found for "{title}"</p>
        )}
      </div>
    </>
  );
};

export default SearchVideo;
