// api/movie.js

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  const { id } = req.query;

  try {
    await client.connect();
    const db = client.db('sample_mflix');

    if (req.method === 'GET') {
      // Buscar detalhes do filme e comentários
      const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });

      if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });

      const comments = await db.collection('comments').find({ movie_id: new ObjectId(id) }).toArray();
      return res.status(200).json({ movie, comments });
    }

    if (req.method === 'POST') {
      const { name, text } = req.body;
    
      if (!name || !text) {
        return res.status(400).json({ error: 'Nome e texto do comentário são obrigatórios' });
      }
    
      const newComment = {
        movie_id: new ObjectId(id),
        name,
        text,
        date: new Date(),
      };
    
      const result = await db.collection('comments').insertOne(newComment);
      return res.status(201).json({ 
        message: 'Comentário adicionado com sucesso', 
        commentId: result.insertedId // Retorna o ID do comentário
      });
    }

    if (req.method === 'PUT') {
      try {
        const { commentId, name, text } = req.body;
      
        if (!commentId || !name || !text) {
          return res.status(400).json({ error: 'ID do comentário, nome e texto são obrigatórios' });
        }
      
        const result = await db.collection('comments').updateOne(
          { _id: new ObjectId(commentId) },
          { $set: { name, text, date: new Date() } }
        );
      
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'Comentário não encontrado' });
        }
      
        return res.status(200).json({ message: 'Comentário atualizado com sucesso' });
      } catch (err) {
        console.error('Erro ao atualizar comentário:', err);
        return res.status(500).json({ error: 'Erro ao processar a solicitação' });
      }
    }

    if (req.method === 'DELETE') {
      const { commentId } = req.query;
    
      if (!commentId) {
        return res.status(400).json({ error: 'ID do comentário é obrigatório' });
      }
    
      try {
        const result = await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Comentário não encontrado' });
        }
    
        return res.status(200).json({ message: 'Comentário removido com sucesso' });
      } catch (err) {
        console.error('Erro ao remover comentário:', err);
        return res.status(500).json({ error: 'Erro ao processar a solicitação' });
      }
    }

    res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};