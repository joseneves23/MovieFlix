require('dotenv').config();
const express = require('express');
const path = require('path');
const moviesRoute = require('./api/movies');
const movieRoute = require('./api/movie');

const app = express();
const port = 3001;

app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/movies', require('./api/movies'));
app.use('/api/movie', require('./api/movie'));

// Servir páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/movie', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'movie.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
