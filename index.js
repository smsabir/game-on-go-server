const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctdrv.mongodb.net/${process.env.DB_NAME}e?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("GameOnGo").collection("products");
  
  app.post('/addProduct', (req, res) =>{
      const newProduct = req.body;
      console.log(newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  });

  app.get('/products', (req, res) => {
      productCollection.find()
      .toArray((error, items) => {
        res.send(items)
        console.log("from Data base", items)
      })
  })


  app.delete('/products/delete/:id', (req, res) => {
    console.log(req.params.id)
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })


});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)