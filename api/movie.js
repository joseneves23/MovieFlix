// api/movie.js

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();


const uri = process.env.MONGODB_URI
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  const { id } = req.query;

  try {
    await client.connect();
    const db = client.db('sample_mflix');
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });

    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });

    // Buscar comentários relacionados ao filme
    const comments = await db.collection('comments').find({ movie_id: new ObjectId(id) }).toArray();

    res.status(200).json({ movie, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar filme e comentários' });
  }
};
