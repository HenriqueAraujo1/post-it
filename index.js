const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // conceder acesso aos arquivos estáticos na pasta public

app.get('/', (req, res) => { // rota raiz
  res.sendFile(__dirname + '/index.html'); // direciona para a página index.html
});

app.get('/note/:id', (req, res) => {
    res.sendFile(__dirname + '/public/note.html'); 
})
 
app.listen(port, (error) => { // inicia o servidor
   if(error) {
    console.log(`não foi possivel iniciar o servidor ${error}`); // caso de erro
  }else 
  console.log(`Conectado na porta ${port}`);
});