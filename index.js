// NODE_MODULES
const express = require('express');
const md5 = require('md5');
const app = express();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const env = require('dotenv').config();
const port = 3001;
const cors = require("cors");
const Redis = require('ioredis');

// REDIS CONNECTION
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
});
console.log("connected successfully to Redis ...");

// body: raw -> json
app.use(express.json({ extended: true }));
const { urlencoded } = require('express');
app.use(cors());

// IMPORT CONNECTION MODULE
const config = require('./connection.js');
var connection = config.connection;

// redis.set('c81e728d9d4c2f636f067f89cc14862c', '{ "id_kategori": "c81e728d9d4c2f636f067f89cc14862c", "kategori": "bahan makanan", "deskripsi": "data bahan makanan seperti tepung terigu, minyak dll" }', 'EX', 10);

// redis.get("c81e728d9d4c2f636f067f89cc14862c", (err, result) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(result); // Prints "value"
//     }
// });

app.get('/', (req, res) => {
    res.status(200).send("Backend is running ...");
});

app.get('/api/kategori', (req, res) => {
    connection.query("SELECT id_kategori, kategori, deskripsi FROM kategori_barang", (error, results, fields) => { 
      if (error) throw error;
      res.status(200);
      res.json(
        { 
            status: "OK",
            data: results
        }
      )
    });
});

app.get('/api/kategori/:id', (req, res) => {
    let reqId = req.params.id;
    redis.get(reqId, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            //  jika data ada diredis
            if(result != null){
                // result = "data: "+result+"";
                res.status(200).send(result);
            // jika data tidak ada diredis
            } else {
                connection.query("SELECT id_kategori, kategori, deskripsi FROM kategori_barang WHERE id_kategori = '"+req.params.id+"'", (error, results, fields) => { 
                    if (error) throw error;
                    // results = JSON.stringify(results);
                    res.status(200).send(JSON.stringify(results));
                    let myKey = results[0].id_kategori;
                    let myValue = [{ id_kategori: results[0].id_kategori, kategori: results[0].kategori, deskripsi: results[0].deskripsi}];
                    redis.set(myKey, JSON.stringify(myValue));
                    // redis.set(myKey, "[{ id_kategori: "+results[0].id_kategori+",kategori: "+results[0].kategori+", deskripsi: "+results[0].deskripsi+"}]");
                    // console.log(JSON.stringify(results));
                    // console.log(myValue);
                });
            }
        }
    });
});

app.listen(port, () => {
    console.log("== BACKEND-RUNNING ==");
    console.log(`server listening at http://localhost:${port}`);
});