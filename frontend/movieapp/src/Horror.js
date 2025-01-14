import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Horror() {
  const [horrorMovies, setHorrorMovies] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchHorrorMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/films/horror');
        setHorrorMovies(response.data);
      } catch (error) {
        console.error('Error fetching horror movies:', error);
      }
    };

    fetchHorrorMovies();
  }, []);

  const handleFilmClick = (filmId) => {
    navigate(`/movie/${filmId}`);
  };

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 200; // Adjust scroll distance
      containerRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
      <h3>Horror Movies</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <button
          onClick={() => handleScroll('previous')}
          style={{
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '30px',
            color: 'white',
          }}
        >
          &#8592;
        </button>

        <div
          ref={containerRef}
          style={{
            display: 'flex',
            gap: '15px',
            overflow: 'hidden',
            width: '80%',
          }}
        >
          {horrorMovies.map((film) => (
            <div
              key={film.id}
              onClick={() => handleFilmClick(film.id)}
              style={{
                cursor: 'pointer',
                border: '3px solid transparent',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <img
                src={film.image}
                alt={film.title}
                style={{
                  width: '150px',
                  height: '225px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  padding: '5px 0',
                  marginTop: '5px',
                  fontSize: '14px',
                }}
              >
                {film.title}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleScroll('next')}
          style={{
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '30px',
            color: 'white',
          }}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}

export default Horror;
