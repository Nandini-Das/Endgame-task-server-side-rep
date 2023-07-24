const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://endgame-task:iTpLfMVW3UWRgaG3@cluster0.qhdslp1.mongodb.net/?retryWrites=true&w=majority";

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
    client.connect();
    const collegeCollection = client.db('Endgame_taskDB').collection('colleges');
    const admittedCollegeCollection = client.db('Endgame_taskDB').collection('admittedCollege');
    const reviewCollection = client.db('Endgame_taskDB').collection('collegeReviews');
    const usersCollection = client.db('Endgame_taskDB').collection('users');
    app.get('/colleges', async (req, res) => {
      const cursor =  collegeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/colleges/:id', async (req, res) => {
        try {
          const id = req.params.id;
      
      const query = { _id: new ObjectId(id) }
  
          const result = await collegeCollection.findOne(query);
          
          if (!result) {
            return res.status(404).json({ error: 'College not found' });
          }
          
          res.send(result);
        } catch (error) {
          console.error('Error fetching college data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      app.post('/admittedCollege', async (req, res) => {
        try {
          const myCollege = req.body;
          const result = await admittedCollegeCollection.insertOne(myCollege);
          console.log('College admission form submitted:', myCollege);
          res.status(201).json(result);
        } catch (error) {
          console.error('Error submitting college admission form:', error);
          res.status(500).json({ error: 'Failed to submit college admission form' });
        }
      });
      app.get('/admittedCollege', async (req, res) => {
        const cursor =  admittedCollegeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
      app.get('/collegeReviews', async (req, res) => {
        const cursor =  reviewCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
      app.post('/collegeReviews', async (req, res) => {
        try {
          const myReview = req.body;
          const result = await reviewCollection.insertOne(myReview);
          
          res.status(201).json(result);
        } catch (error) {
          console.error('Error submitting college admission form:', error);
          res.status(500).json({ error: 'Failed to submit college admission form' });
        }
      });
      app.get('/users', async (req, res) => {
        const cursor =  usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
      app.post('/users', async (req, res) => {
        try {
          const users = req.body;
          const result = await usersCollection.insertOne(users);
          
          res.status(201).json(result);
        } catch (error) {
          console.error('Error :', error);
          res.status(500).json({ error: 'Failed ' });
        }
      });
      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Endgame is running');
  });

  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });