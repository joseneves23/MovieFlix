// api/movies.js
const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = process.env.MONGODB_URI
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  const { page = 1, limit = 12, search = '' } = req.query;
  try {
    await client.connect();
    const db = client.db('sample_mflix');
    const movies = db.collection('movies');

    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const cursor = movies
      .find(query)
      .sort({ year: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const results = await cursor.toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar filmes' });
  }
};
