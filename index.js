const express = require('express');
const { salvarNotas, listarNotas, marcarNotaComoLida, deletarNotas } = require('./db');
const crypto = require('crypto'); // Remover o uso de crypto
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/note/:id', (req, res) => {
  res.sendFile(__dirname + '/public/note.html');
});

app.post('/note', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.send('<span>Erro inesperado</span>');
  }

  try {
    const id = await salvarNotas(content);  // A função agora retorna o id gerado
    res.send(`
      <p>Compartilhe sua nota através do link
      <br>
      <span>${req.headers.origin}/note/${id}</span>
      </p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('<span>Erro ao salvar nota</span>');
  }
});

app.get('/share/:id', async (req, res) => {
  const { id } = req.params;
  const note = await listarNotas(id);  // Alterei para usar listarNotas corretamente

  if (!note) {
    return res.send('<span>Nota não encontrada</span>');
  }

  if (!note.opened_at) {
    await marcarNotaComoLida(id);
  }

  res.send(note.content);
});

app.listen(port, (error) => {
  if (error) {
    console.log(`Não foi possível iniciar o servidor: ${error}`);
  } else {
    console.log(`Servidor rodando na porta ${port}`);
  }
});
