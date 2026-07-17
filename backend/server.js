const express = require("express");
const cors = require('cors');
const { STATUS_CODES } = require("http");
const { Pool } = require("pg");

const app = express()

app.use(express.json());
app.use(cors());

/*const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "pdcase",
    port: 5432
});*/

const connectionString = process.env.DATABASE_URL
const pool = new Pool({
    connectionString
})

const path = require('path'); 

app.use(express.static(path.join(__dirname, '../')));

app.get("/people", async(req, res)=>{
    const order = req.query["order"]

    const allowedColumns = ["id", "name", "cpf", "birthday"]; 
    
    const sortBy = allowedColumns.includes(order) ? order : "id";

    const result = await pool.query(`SELECT * FROM people ORDER BY ${sortBy};`)

    return res.json(result.rows)
})

app.get("/people/:personId", async(req, res)=>{
    const result = await pool.query("SELECT * FROM people WHERE id = $1", [req.params.personId])

    if(!result.rows[0]){
        return res.status(404).json("Pessoa não encontrada!")
    }
    return res.json(result.rows[0])
})

app.post("/people", async(req, res)=>{
    const people = req.body
    console.log(people)
    if(!people.name || !people.cpf) return res.status(400).json("É obrigatório o nome e o CPF")

    const data = [
        people.name,
        people.cpf,
        people.rg,
        people.birthday,
        people.telefone,
        people.numCartao,
        people.dataCartao,
        people.cvvCartao
    ]

    const result = await pool.query("INSERT INTO people(name, cpf, rg, birthday, telefone, numCartao, dataCartao, cvvCartao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);", data)

    return res.json(result.rows[0])
})

app.put("/people/:id", async(req, res)=>{
    const id = req.params.id
    const people = req.body

    if(!id) return res.status(400).json("Falta parâmetro ID")
    if(!people.name || !people.cpf) return res.status(400).json("É obrigatório o nome e o CPF")

    const resultQuery = await pool.query("SELECT * FROM people WHERE id=$1;", [id])

    if(!resultQuery.rows[0]) return res.status(404).json("Pessoa não encontrada")

    const data = [
        people.name,
        people.cpf,
        people.rg,
        people.birthday,
        people.telefone,
        people.numCartao,
        people.dataCartao,
        people.cvvCartao,
        id
    ]

    const result = await pool.query("UPDATE people SET name = $1, cpf = $2, rg = $3, birthday = $4, telefone = $5, numCartao = $6, dataCartao = $7, cvvCartao = $8 WHERE id = $9;", data)

    return res.json(result.rows[0])

})

app.delete("/people", async(req, res)=>{
    const id = req.query["id"]

    if(!id) return res.status(400).json("Falta parâmetro ID")

    const result = await pool.query("DELETE FROM people WHERE id = $1", [id])
    return res.status(204).json()
})

app.listen(3000)