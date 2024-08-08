import React, { useRef, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './upload-video.css';
import Navbar from '../../components/Navbar/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';

const UPLOAD_VIDEO_URL = '/stream-video/upload-video/';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const videoFileRef = useRef(null);
  const thumbnailFileRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!videoFileRef || !thumbnailFileRef) {
      setError('Please select a video and a thumbnail to upload.');
      setSuccess(null);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('video', videoFileRef.current.files[0]);
    formData.append('thumbnail', thumbnailFileRef.current.files[0]);

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosPrivate.post(UPLOAD_VIDEO_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      setSuccess('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setCategory('');
      videoFileRef.current.value = null;
      thumbnailFileRef.current.value = null;
    } catch (err) {
      // Check if the error is due to an invalid or expired refresh token
      if (err.response?.data?.code === 'token_not_valid') {
        navigate('/login', { state: { from: location }, replace: true });
      }

      setError('Error uploading video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="upload-video-container">
        <h2>Upload Video</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Add a title that describe your video"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Tell viewers about your video"
              rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Technology">Technology</option>
              <option value="Gaming">Gaming</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="video">Video File</label>
            <input type="file" id="video" accept="video/*" ref={videoFileRef} required />
          </div>
          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail File</label>
            <input type="file" id="thumbnail" accept="image/*" ref={thumbnailFileRef} required />
          </div>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </>
  );
};

export default UploadVideo;
