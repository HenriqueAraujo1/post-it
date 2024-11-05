const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => { // rota raiz
  res.send('Hello World!');
});

app.listen(port, (error) => { // inicia o servidor
   if(error) {
    console.log(`não foi possivel iniciar o servidor ${error}`); // caso de erro
  }else 
  console.log(`Conectado na porta ${port}`);
});