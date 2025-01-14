import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './forest.jpg';
import Horror from './Horror';
import Suspense from './Suspense';



function Welcome() {
  const [username, setUsername] = useState('');
  const [films, setFilms] = useState([]);
  const [selectedFilms, setSelectedFilms] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/welcome', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsername(response.data.message);
      } catch (error) {
        alert('Session expired. Please log in again.');
        navigate('/');
      }
    };

    const fetchFilms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/films'); 
        setFilms(response.data);
      } catch (error) {
        console.error("Error fetching films:", error);
      }
    };

    fetchWelcomeMessage();
    fetchFilms();
  }, [navigate]);

  useEffect(() => {
    if (selectedFilms.length > 0) {
      const fetchRelatedMovies = async () => {
        try {
          const response = await axios.get('http://localhost:5000/related-movies', {
            params: { ids: selectedFilms.join(',') },
          });
          setRelatedMovies(response.data);
        } catch (error) {
          console.error("Error fetching related movies:", error);
        }
      };
      fetchRelatedMovies();
    } else {
      setRelatedMovies([]); 
    }
  }, [selectedFilms]);

  const handleFilmSelect = (filmId) => {
    setSelectedFilms([filmId]); 
  };
  

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        justifyContent: 'flex-start', 
        overflowY: 'auto', 
      }}
    >
            <Suspense />

            <Horror />




      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: '20px', 
        borderRadius: '8px', 
        maxWidth: '90%', 
        width: '1000px', 
        marginTop: '30px',
      }}>
   
              <h1>{username}</h1>
            <div style={{ marginTop: '10px' }}>
              <h3>Select a Film to See Related Movies</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    padding: '10px',
                    gap: '20px',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  {films.map((film) => (
                    <div
                      key={film.id}
                      style={{
                        flex: '0 0 auto',
                        cursor: 'pointer',
                        border: selectedFilms.includes(film.id) ? '3px solid #df7474' : '3px solid transparent',
                        borderRadius: '8px',
                      }}
                      onClick={() => handleFilmSelect([film.id])} 
                    >
                      <img
                        src={film.image}
                        alt={film.title}
                        style={{
                          width: '200px',
                          height: '300px',
                          objectFit: 'cover',
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          color: 'white',
                          padding: '5px 0',
                          textAlign: 'center',
                          fontSize: '14px',
                        }}
                      >
                        {film.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {relatedMovies.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h3>Related Movies</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {relatedMovies.map((movie) => (
                    <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
                      <h4>{movie.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}


        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#df7474',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            width: '260px',
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Welcome;
