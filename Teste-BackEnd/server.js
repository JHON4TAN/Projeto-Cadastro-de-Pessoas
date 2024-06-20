// Importando os modúlos Express, SQLite3, Body-Parser e Cors;
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// Criando uma instância do Express e definindo uma porta para o servidor;
const app = express();
const port = 3001;


app.use(bodyParser.json()); // Usando o body-parser para interpretar JSON;
app.use(cors()); // Usando o cors para permitir requisições de outras origens;


// Conectando ao banco de dados SQLite;
const db = new sqlite3.Database(':memory:');


// Criando a tabela Pessoa;
db.serialize(() => {
    db.run('CREATE TABLE Pessoa (id INTEGER PRIMARY KEY, nome TEXT, rua TEXT, numero TEXT, bairro TEXT, cidade TEXT, estado TEXT)');
});


// Endpoint para criar uma nova pessoa;
app.post('/pessoas', (req, res) => {
    const {nome, rua, numero, bairro, cidade, estado } = req.body;
    db.run('INSERT INTO Pessoa (nome, rua, numero, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)', 
        [nome, rua, numero, bairro, cidade, estado], function(err) { // Insere uma nova pessoa no Banco de Dados;
            if (err) {
                return res.status(500).send(err.message); // Retorna um erro 500 se tiver algum problema;
            }
            res.status(201).send({ id: this.lastID }); // Retorna o ID da nova pessoa que foi criada;
        });
});

// Endpoint para listar todas as pessoas;
app.get('/pessoas', (req, res) => {
    db.all('SELECT * FROM Pessoa', [], (err, rows) => { // Está selecionando todas as pessoas que estão no Banco de Dados;
        if (err) {
            return res.status(500).send(err.message); // Retorna um erro 500 se tiver algum problema;
        }
        res.status(200).json(rows); // Retorna a lista de pessoas em formato JSON
    });
});

// Endpoint para atualizar uma pessoa pelo ID;
app.put('/pessoas/:id', (req, res) => {
    const { nome, rua, numero, bairro, cidade, estado } = req.body;
    db.run('UPDATE Pessoa SET nome = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ? WHERE id = ?', 
        [nome, rua, numero, bairro, cidade, estado, req.params.id], function(err) { // Atualiza a pessoa no banco de dados;
        if (err) {
            return res.status(500).send(err.message); // Retorna um erro 500 se houver um problema
        }
        res.status(200).send({ changes: this.changes });
    });
});

// Endpoint para deletar uma pessoa pelo ID;
app.delete('/pessoas/:id', (req, res) => {
    db.run('DELETE FROM Pessoa WHERE id = ?', req.params.id, function(err) { // Deleta a pessoa do Banco de Dados;
        if (err) {
            return res.status(500).send(err.message); // Retorna um erro 500 se houver um problema
        }
        res.status(200).send({ changes: this.changes }); 
    });
});

// Iniciando o servidor;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});