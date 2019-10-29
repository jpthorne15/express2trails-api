const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const monk=require("monk");
const bodyParser=require("body-parser");
const cors=require("cors");
const url='mongodb://JimmyHendrix:813moveOverRover@cluster0-shard-00-00-ffkvd.mongodb.net:27017,cluster0-shard-00-01-ffkvd.mongodb.net:27017,cluster0-shard-00-02-ffkvd.mongodb.net:27017/TRAILS?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
const db=monk(url);
//Lines 1-3 require the express framework, set the localport variable to port 4000
//Lines 4-5 require the database connection framework monk and requires the body parser parse data in an object
// The body parser convert http string input into a javascript object
//Line 6 requires cross origin resource sharing so that the browser can load items outside the original domain of the webpage
//Lines 7-8 const url is the mongo connection string which is passed into const db in case the connection string changes

db.then(() => {
    console.log("Connected correctly to database");
})
//the db.then function verifies that the datbase is correctly connected
const images = db.get('IMAGES-RECORDINGS');
// The constant images is now set equal to the data collection that is used from Mongo
app.use(cors());
app.use(bodyParser.json());
//app variables use the 'use' method to implement cors and body parser

//app.get('/', (req, res) => res.send('Hello World!'))

//Works per postman as per 10-16
// This is the GET endpoint or READ
app.get('/', async function (req, res,next) {
    const results = await images.find ({})
   res.send(results)
  });

//Works per postman as of 10-16
//This is the POST endpoint or CREATE
// An async function defines an asynchonous function so the API has time to reach out to the database
// and gather the info. The await operator inside the async function will not let
// the function execute until the promise is settled
  app.post('/', async function (req, res) {
    const data = req.body
    //Constant that uses the request method to bring up the body of data
    console.log(data)
    //Places the results of the constant data onto the console for testing purposes 
    const results = await images.insert(data);
    //Actual channel to place newly added contents into Mongo / insert method is out of Monk
    console.log("createImage",results)
    //Places the results of the createImage constant from ui onto console 
    //Sends resulting changes from UI per the method after await on line 44
    res.send(results)
  })
  

  //Works per postman as of 10-16
  //This is the PUT endpoint which acts the method to UPDATE
  app.put('/image/:id', async function (req, res){
    const data = req.body
    console.log('data',data) 
    const results = await images.update({_id:req.params.id}, {$set: data});
    //Adding $set:data makes it so a particular property in the onject can be opened and changed
    // Its not needed in the deleteImage because you just need the datbase ID to identify it as unique
    console.log('updateImage')
    //Just updateImage without results image will simplify console log results
    res.send(results)
    
  })
  
//Works per postman 10-16
// This is the delete endpoint or DELETE method
  app.delete('/image/:id', async function (req, res){
    const results = await images.remove ({_id:req.params.id});
    // remove by finding the Mongo id then request the parameter id of the item remove method is Monk
    console.log('deleteImage')
    res.send(results)
  })






app.listen(port, () => console.log(`Example app listening on port ${port}!`))