const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');



// Server Setup
const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'images')));


// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'payweek',
  database: 'movies',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected');
  }
});

// JWT Configuration
const ACCESS_TOKEN_SECRET = 'your_access_secret';
const REFRESH_TOKEN_SECRET = 'your_refresh_secret';
const ACCESS_TOKEN_LIFETIME = '1h';
const REFRESH_TOKEN_LIFETIME = '7d';

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ accessToken });
  });
});

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token required' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
    res.status(200).json({ accessToken: newAccessToken });
  });
});

app.get('/welcome', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const query = 'SELECT username FROM users WHERE id = ?';
    db.query(query, [user.id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: `Welcome, ${results[0].username}!` });
    });
  });
});


app.get('/movie/:id', (req, res) => {
  const movieId = parseInt(req.params.id, 10);

  const movie =
    horror.find((film) => film.id === movieId) ||
    suspense.find((film) => film.id === movieId);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  
  const relatedMovies =
    movie.genreIds.includes('Horror') ? horror.filter((film) => film.id !== movie.id) :
    movie.genreIds.includes('Suspense') ? suspense.filter((film) => film.id !== movie.id) :
    [];

  res.json({ movie, relatedMovies });
});




app.get('/films/horror', (req, res) => {
  res.json(horror);
});


app.get('/films/suspense', (req, res) => {
  res.json(suspense);
});




//5 feature films to choose from
const suspense = [
  { id: 1, title: 'The Dark Knight', genreIds: ['Suspense'],  image: 'http://localhost:5000/images/knight.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=B9wbHZM-L8g',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 2, title: 'The Matrix', genreIds: ['Suspense'], image: 'http://localhost:5000/images/matrix.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 4, title: 'Shawshank Redemption', genreIds: ['Suspense'],  image: 'http://localhost:5000/images/shawshank.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 5, title: 'The Shining', genreIds: ['Suspense'], image: 'http://localhost:5000/images/shining.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
  },
  { id: 6, title: 'No Country for Old Men', genreIds: ['Suspense'],  image: 'http://localhost:5000/images/country.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 7, title: 'A Beautiful Mind', genreIds: ['Suspense'], image: 'http://localhost:5000/images/beautiful.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 8, title: 'Fargo', genreIds: ['Suspense'],  image: 'http://localhost:5000/images/fargo.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 9, title: 'Hangover', genreIds: ['Suspense'],  image: 'http://localhost:5000/images/hangover.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
   },
  { id: 10, title: 'Borat', genreIds: ['Suspense'], image: 'http://localhost:5000/images/borat.jpg',
    links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
  },

];

//Selection of 9 related films per genre
const actionFilms = [
    { id: 101, title: 'Leon the Professional', genreIds: ['Action']},
    { id: 102, title: 'John Wick', genreIds: ['Action']},
    { id: 103, title: 'Full Metal Jacket', genreIds: ['Action']},
    { id: 104, title: 'Crouching Tiger, Hidden Dragon', genreIds: ['Action']},
    { id: 105, title: 'Gladiator', genreIds: ['Action']},
    { id: 106, title: 'Kill Bill: Volume 1', genreIds: ['Action']},
    { id: 107, title: 'Goldfinger', genreIds: ['Action']},
    { id: 108, title: 'The Warriors', genreIds: ['Action']},
    { id: 109, title: 'Apocalypse Now', genreIds: ['Action']},
  ];
  
  const sciFi = [
    { id: 201, title: 'District 9', genreIds: ['Sci-Fi']},
    { id: 202, title: 'Alien', genreIds: ['Sci-Fi']},
    { id: 203, title: 'Moon', genreIds: ['Sci-Fi']},
    { id: 204, title: 'Starship Troopers', genreIds: ['Sci-Fi']},
    { id: 205, title: 'Star Wars: Episode III - Revenge of the Sith', genreIds: ['Sci-Fi']},
    { id: 206, title: '2001: A Space Odyssey', genreIds: ['Sci-Fi']},
    { id: 207, title: 'Donnie Darko', genreIds: ['Sci-Fi']},
    { id: 208, title: 'Blade Runner', genreIds: ['Sci-Fi']},
    { id: 209, title: 'Ex Machina', genreIds: ['Sci-Fi']},
  ];
  const comedy = [
    { id: 3, title: 'Napoleon Dynamite', genreIds: ['Comedy'],  image: 'http://localhost:5000/images/napolean.jpg' },
    { id: 301, title: 'Shaun of the Dead', genreIds: ['Comedy']},
    { id: 302, title: 'Friday', genreIds: ['Comedy']},
    { id: 303, title: 'Borat', genreIds: ['Comedy']},
    { id: 304, title: 'Snatch', genreIds: ['Comedy']},
    { id: 305, title: 'Lock, Stock and Two Smoking Barrels', genreIds: ['Comedy']},
    { id: 306, title: 'The Other Guys', genreIds: ['Comedy']},
    { id: 307, title: 'Anchorman', genreIds: ['Comedy']},
    { id: 308, title: 'The Big Lebowski', genreIds: ['Comedy']},
    { id: 309, title: 'Hot Fuzz', genreIds: ['Comedy']},
  ];
  const drama = [
    { id: 401, title: 'Scarface', genreIds: ['Drama']},
    { id: 402, title: 'City of God', genreIds: ['Drama']},
    { id: 403, title: 'The Green Mile', genreIds: ['Drama']},
    { id: 404, title: 'The Godfather', genreIds: ['Drama']},
    { id: 405, title: 'Trainspotting', genreIds: ['Drama']},
    { id: 406, title: 'One Flew Over the Cuckoos Nest', genreIds: ['Drama']},
    { id: 407, title: 'Goodfellas', genreIds: ['Drama']},
    { id: 408, title: 'The Truman Show', genreIds: ['Drama']},
    { id: 409, title: 'Taxi Driver', genreIds: ['Drama']},
  ];
  const horror = [
    { id: 501, title: '28 Days Later', genreIds: ['Horror'],  image: 'http://localhost:5000/images/28days.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 502, title: '28 Weeks Later', genreIds: ['Horror'],  image: 'http://localhost:5000/images/28weeks.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 503, title: 'Rosemarys Baby', genreIds: ['Horror'],  image: 'http://localhost:5000/images/rosemary.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 504, title: 'Requiem for a Dream', genreIds: ['Horror'],  image: 'http://localhost:5000/images/dream.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 505, title: 'Jacobs Ladder', genreIds: ['Horror'],  image: 'http://localhost:5000/images/jacob.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 506, title: 'American Psycho', genreIds: ['Horror'],  image: 'http://localhost:5000/images/psycho.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 507, title: 'House', genreIds: ['Horror'],  image: 'http://localhost:5000/images/house.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 508, title: 'Silence of the Lambs', genreIds: ['Horror'],  image: 'http://localhost:5000/images/silence.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
    { id: 509, title: 'Resident Evil', genreIds: ['Horror'],  image: 'http://localhost:5000/images/evil.jpg',
      links: {
      youtube: 'https://www.youtube.com/watch?v=abc123',
      dailymotion: 'https://www.dailymotion.com/video/xyz123',
      prime: 'https://www.primevideo.com/detail/abc123',
    },
    },
  ];


// function getRelatedMoviesByGenres(genres) {
//   const related = [];
//   genres.forEach(genre => {
//     if (relatedFilms[genre]) {
//       related.push(...relatedFilms[genre]);
//     }
//   });

//   const seen = new Set();
//   const uniqueMovies = related.filter(movie => {
//     if (seen.has(movie.id)) {
//         return false;
//     }
//     seen.add(movie.id);
//     return true;
//   });
//   return uniqueMovies;
// }


// function displayRelatedMovies(movies) {
//   const relatedMoviesElement = document.getElementById('related-movies');
//   relatedMoviesElement.innerHTML = ''; 

//   if (movies.length === 0) {
//     relatedMoviesElement.innerHTML = '<p>No related movies found.</p>';
//   } else {
//     movies.forEach(movie => {
//       const movieElement = document.createElement('div');
//       movieElement.classList.add('related-movie');
//       movieElement.textContent = movie.title;
//       relatedMoviesElement.appendChild(movieElement);
//     });
//   }
// }

app.use(express.static('public'));

app.get('/related-movies', (req, res) => {
  const selectedFilmIds = req.query.ids ? req.query.ids.split(',').map(Number) : [];

  if (selectedFilmIds.length === 0) {
    return res.status(400).json({ error: 'No films selected' });
  }

  const selectedFilms = films.filter(film => selectedFilmIds.includes(film.id));
  if (selectedFilms.length === 0) {
    return res.status(404).json({ error: 'Selected films not found' });
  }

  const allGenres = [...new Set(selectedFilms.flatMap(film => film.genreIds))];
  const relatedFilms = getRelatedMoviesByGenres(allGenres);

  // Returns related films
  if (relatedFilms.length > 0) {
    return res.json(relatedFilms);  
  } else {
    return res.status(404).json({ error: 'No related movies found' });  
  }
});


//Starts server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));