import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from './forest.jpg';
import youtubeIcon from './images/youtube.png';
import dailyIcon from './images/daily.png';
import primeIcon from './images/prime.jpg';


function MovieInfo() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/movie/${movieId}`);
        setMovie(response.data.movie);
        setRelatedMovies(response.data.relatedMovies);
      } catch (error) {
        console.error('Error fetching movie info:', error);
      }
    };

    fetchMovieInfo();
  }, [movieId]);

  const handleRelatedMovieClick = (id) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/movie/${id}`);
  };

  return (
    <div style={{ textAlign: 'center',
            padding: '20px', 
            color: 'white',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start', 
            overflowY: 'auto', }}>
            <button
          onClick={() => navigate('/welcome')}
          style={{
            position: 'absolute',
            top: '3%',
            right: '3%',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'blue',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            width: '150px',
          }}
        >
          Home
        </button>
      {movie ? (
        <>
          <h1>{movie.title}</h1>
          <img
            src={movie.image}
            alt={movie.title}
            style={{
              width: '300px',
              height: '450px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          />
          <div style={{ marginBottom: '20px' }}>
            <h3>Watch on</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
              {movie.links?.youtube && (
                <a href={movie.links.youtube} target="_blank" rel="noopener noreferrer">
                  <img
                    src={youtubeIcon}
                    alt="YouTube"
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                  />
                </a>
              )}
              {movie.links?.dailymotion && (
                <a href={movie.links.dailymotion} target="_blank" rel="noopener noreferrer">
                  <img
                    src={dailyIcon}
                    alt="Dailymotion"
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                  />
                </a>
              )}
              {movie.links?.prime && (
                <a href={movie.links.prime} target="_blank" rel="noopener noreferrer">
                  <img
                    src={primeIcon}
                    alt="Prime Video"
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                  />
                </a>
              )}
            </div>
          </div>

          <h3>Related Movies</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            {relatedMovies.map((related) => (
              <div
                key={related.id}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={() => handleRelatedMovieClick(related.id)}
              >
                <img
                  src={related.image}
                  alt={related.title}
                  style={{
                    width: '150px',
                    height: '225px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <p style={{ marginTop: '10px', color: 'white' }}>{related.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading movie info...</p>
      )}
    </div>
  );
}

export default MovieInfo;
