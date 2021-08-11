const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const password = 'QmgEDTDYAQLD0iB6';
// const uri = 'mongodb+srv://organicUser:QmgEDTDYAQLD0iB6@cluster0.2eutk.mongodb.net/organicdb?retryWrites=true&w=majority';
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = 4200;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
client.connect(err => {
    const MyDataBase = client.db("organicdb");
    const collection = MyDataBase.collection("products");
    // perform actions on the collection object
    if (err) {
        console.log('connection failed');
    }
    else {
        console.log('connection successfully');

        app.post("/addProduct", (req, res) => {
            const product = req.body;
            // console.log(product)
            insertData(collection, product);
            // res.send('data insert success');
            res.redirect('/')
        });

        app.get('/products', (req, res) => {
            findAllData(collection, res);
        });

        app.delete('/delete/:id', (req, res) => {
            const item = ObjectId(req.params.id);
            console.log(item)
            deleteData(collection, item, res)
        })

        app.get('/product/:id', (req, res) => {
            const item = ObjectId(req.params.id);
            findDataWithCondition(collection, item, res);
        })

        app.patch('/update/:id',(req, res) =>{
            const item = ObjectId(req.params.id);
            updateMyData(collection, item, req, res)
        })

    }



});

app.listen(PORT, () => console.log(`server is run ${PORT}`));

const insertData = (collection, product) => {
    // const myData = { name: 'Habib', Roll: '01', class: 'Ten' };
    collection.insertOne(product, (error) => {
        if (error) {
            console.log('data insert file');
        } else {
            console.log('data insert success');
        }
    })
}

const findAllData = (collection, res) => {
    collection.find().toArray((error, documents) => {
        if (error) {
            console.log("Data FindAll fail");
        }
        else {
            console.log("Data FindAll success");
            res.send(documents);
        }
    });
}

const deleteData = (collection, item, res) => {
    collection.deleteOne({ _id: item }, (error, result) => {
        if (error) {
            console.log("Data delete fail");
        }
        else {
            console.log("Data delete success");
            // console.log(result)
            res.send(result.deletedCount > 0);
        }
    })
}

const findDataWithCondition = (collection, item, res) => {
    collection.find({ _id: item }).toArray((error, documents) => {
        if (error) {
            console.log('single data find file');
        }
        else {
            console.log('single data find success');
            res.send(documents[0])
        }
    })
}

const updateMyData = (collection, item, req, res) =>{
    const myQuery = {_id : item};
    const newValues = {$set: {price : req.body.price, quantity: req.body.quantity}};

    collection.updateOne(myQuery, newValues, (error, documents)=>{
        if (error) {
            console.log("Data updata fail");
        }
        else {
            console.log("Data updata success");
            res.send(documents.modifiedCount > 0);
        }
    })
}