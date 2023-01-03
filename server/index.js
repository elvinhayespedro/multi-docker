const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // cross origin resource sharing

// parse incoming requests from react
// and turn the body into a json value
app.use(bodyParser.json());

// create and connect to postgress server
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
// replaced to delay the table query until
// after a connection is made
//pgClient.on('error', () => {
//    console.log('LOST PG CONNECTION');
//});
//pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
//    .catch((error) => console.log(error));
pgClient.on("connect", (client) => {
    client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

// Redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const pub = redisClient.duplicate();

// express route handlers
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) {
        return res.status(422).send('Input index too high!');
    }

    redisClient.hset('values', index, 'NEW INDEX');
    pub.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, (err) => {
    console.log('Listening on port 5000...');
});