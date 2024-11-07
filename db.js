const sqlite3 = require("sqlite3").verbose(); // importacaoo do sqlite3 
const db = new sqlite3.Database('./notes.db'); 

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS notes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Alteração aqui
            content TEXT,
            opened_at DATE DEFAULT null,
            created_at DATE DEFAULT (datetime('now', 'localtime'))
        )`);
});

const salvarNotas = (content) => new Promise((resolve, reject) =>
        db.run(`
            INSERT INTO notes (content) VALUES (?)  -- Não passamos o id manualmente
            `, [content], function(err) {  // A função `this.lastID` irá pegar o id gerado
                if (err) return reject(err);
                resolve(this.lastID);  // Retorna o id gerado automaticamente
            })
    );
    const listarNotas = (id) => new Promise((resolve, reject) => 
        db.get(`
            SELECT * FROM notes WHERE id = ?  -- Alterado para aceitar o parâmetro id
            `, [id], (err, row) => err ? reject(err) : resolve(row))
    );
    
    const marcarNotaComoLida = (id) => new Promise((resolve, reject) =>
         db.run(`
             UPDATE notes SET opened_at = datetime('now', 'localtime') WHERE id = ?
              `, [id], (err) => err ? reject(err) : resolve())
            )

            const deletarNotas = () => new Promise((resolve, reject) =>
                db.run(`
                  DELETE FROM notes
                  WHERE (opened_at IS NULL AND created_at < datetime('now', 'localtime', '-7 days'))
                  OR (opened_at < datetime('now', 'localtime', '-5 minutes'))
                `, (err) => err ? reject(err) : resolve())
              );
              

    module.exports = {
        salvarNotas
        , listarNotas
        , marcarNotaComoLida
        , deletarNotas
    }
