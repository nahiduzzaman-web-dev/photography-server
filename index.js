const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// for env
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// connection to cluster mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n56y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('photography').collection('service');

        // api data load
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // single data info load
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // post (send data to server)
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('photography running server here');
});

app.listen(port, () => {
    console.log('listening to port', port);
});

