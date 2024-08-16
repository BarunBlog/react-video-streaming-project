import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Navbar from '../../components/Navbar/Navbar';
import RelatedVideos from '../../components/RelatedVideos/RelatedVideos';
import './video-details.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useRefreshToken } from '../../hooks/useRefreshToken';
import useStreamVideo from '../../hooks/useStreamVideo';

const VIDEO_DETAILS_URL = '/stream-video/get-videos/';

const VideoDetails = () => {
  const { videoUuid } = useParams();
  const [video, setVideo] = useState(null);

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

  // Streaming the video
  useStreamVideo(video, videoUuid, refresh);

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
