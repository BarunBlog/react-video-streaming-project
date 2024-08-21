import { useEffect, useState } from 'react';
import './related-videos.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

let RELATED_VIDEOS_URL = '/stream-video/get-videos/?';

const RelatedVideos = ({ category, exceptVideoUuid }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  if (category) {
    RELATED_VIDEOS_URL += `&category=${category}`;
  }

  if (exceptVideoUuid) {
    RELATED_VIDEOS_URL += `&except_video_uuid=${exceptVideoUuid}`;
  }

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const response = await axiosPrivate.get(RELATED_VIDEOS_URL);
        setRelatedVideos(response.data.results);
      } catch (err) {
        console.error('Error fetching related videos:', err);

        // Check if the error is due to an invalid or expired refresh token
        if (err.response?.data?.code === 'token_not_valid') {
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };

    if (category) {
      fetchRelatedVideos();
    }
  }, [category, axiosPrivate, navigate, location]);

  return (
    <div className="sidebar">
      <h2>Related Videos</h2>
      {relatedVideos.map(relatedVideo => (
        <Link to={`/videos/${relatedVideo.uuid}`} key={relatedVideo.uuid} className="related-video-link">
          <div className="related-video">
            <img src={relatedVideo.thumbnail} alt={relatedVideo.title} />
            <div className="related-video-info">
              <p className="related-video-title">{relatedVideo.title}</p>
              <p className="related-video-author">{relatedVideo.author_name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedVideos;
