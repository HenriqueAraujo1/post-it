const sqlite3 = require("sqlite3").verbose(); // importacaoo do sqlite3 
const db = new sqlite3.Database('./notes.db'); 

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS notes(
            id TEXT PRIMARY KEY,
            content TEXT,
            opened_at DATE DEFAULT null,
            created_at DATE DEFAULT (datetime('now', 'localtime'))
        )`);
})

const salvarNotas = (id, content) => new Promise((resolve, reject) =>
   db.run(`
        INSERT INTO notes (id, content) VALUES (?, ?)
        `, [  id, content ], (err) =>  err ? reject(err) : resolve())   
    )

    const listarNotas = () => new Promise((resolve, reject) => 
        db.get(`
            SELECT * FROM notes WHERE id = ?
            `, [id], (err, row) => err ? reject(err) : resolve(row))
            
        )

    const marcarNotaComoLida = (id) => new Promise((resolve, reject) =>
         db.run(`
             UPDATE notes SET opened_at = datetime('now', 'localtime') WHERE id = ?
              `, [id], (err) => err ? reject(err) : resolve())
            )

    const deletarNotas = (id) => new Promise((resolve, reject) =>
        db.run(`
            DELETE FROM notes
            WHERE opened_at < datetime('now', 'localtime', '-5 minutes')
            OR opened at IS NULL AND created_at < datetime('now', 'localtime', '-7 days')
            `, [id], (err) => err ? reject(err) : resolve())
        )

    module.exports = {
        salvarNotas
        , listarNotas
        , marcarNotaComoLida
        , deletarNotas
    }
