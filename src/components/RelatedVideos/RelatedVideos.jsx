import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './related-videos.css';
import { Link } from 'react-router-dom';

const RELATED_VIDEOS_URL = '/stream-video/get-videos/?category=';

const RelatedVideos = ({ category }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const response = await axios.get(`${RELATED_VIDEOS_URL}${category}`);
        setRelatedVideos(response.data.results);
      } catch (err) {
        console.error('Error fetching related videos:', err);
      }
    };

    if (category) {
      fetchRelatedVideos();
    }
  }, [category]);

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
