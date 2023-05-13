
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');

const app = express();


const port = process.env.PORT || 8000;



//middleware
app.use(cors())
app.use(express.json())


//mdarifur554

//jJeKZsXZqToKkNZX


//mongodb
const uri = "mongodb+srv://mdarifur554:jJeKZsXZqToKkNZX@cluster0.yaanftr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client.db("userDB").collection("users");
        // const userCollection = database.collection("users");

        // read data from mongoDB

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //Single api create for update

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        //update mongodb data 

        app.put('/user/:id', async (req, res) => {

            const id = req.params.id;
            const update = req.body;
            console.log(id, "Updateted User:-", update);

            const filter = { _id: new ObjectId(id) }

            const options = { upsert: true }

            const updateUser = {
                $set: {
                    name: update.name,
                    email: update.email
                }
            }

            const result = await userCollection.updateOne(filter, updateUser, options)
            res.send(result)

        })

        //posting data to mogodb start

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log("New_user", user);
            // const result = await userCollection.insertOne(user);
            //inserting data to mongodb
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        //posting data to mogodb end



        //Delete data from mongodb

        app.delete('/user/:id', async (req, res) => {
            const Id = req.params.id;
            console.log('Please delete this id:- ', Id);

            const query = { _id: new ObjectId(Id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//mongodb


app.get("/", (req, res) => {
    res.send("simple crud is running baby")
})


app.listen(port, () => {
    console.log(`The simple crud is running at port: ${port}`);
})