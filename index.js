const express = require('express');
const { salvarNotas, listarNotas, marcarNotaComoLida, deletarNotas } = require('./db');
const app = express();
const port = 3000;

app.use(express.static('public')); // conceder acesso aos arquivos estáticos na pasta public

app.use(express.urlencoded({ extended: true })); // permitir o envio de dados via formulário

app.use(salvarNotas)


app.get('/', (req, res) => { // rota raiz
  res.sendFile(__dirname + '/index.html'); // direciona para a página index.html
});

app.get('/note/:id',  (req, res) => {
    res.sendFile(__dirname + '/public/note.html'); 
})

app.post('/note', async (req, res) => {
   const { content } = req.body
   if(!content) {
    return res.send('<span>Erro inesperado</span>')
   }

   const id = crypto.randomUUID()
   await savenote (id, content)
   res.send(`
        <p>Compartilhe sua nota através do link
        <br>
        <span>${req.headers.origin}/note/${id}</span>
        </p>
    `)
})

app.get('/share/:id', async (req, res) => {
   await deletarNotas()

  const { id } = req.params
  const note = await getNote(id)
  if(!note ) {
    return res.send('<span>Nota não encontrada</span>')
  }
  if(!note.opened_at){
    await markNoteAsOpened(id)
  }
  res.send(note.content)

})
 
app.listen(port, (error) => { // inicia o servidor
   if(error) {
    console.log(`não foi possivel iniciar o servidor ${error}`); // caso de erro
  }else 
  console.log(`Conectado na porta ${port}`);
});