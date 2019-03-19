const express = require('express'); //CommonJS Modules
    // same as import express from 'express'
const db = require('./data/db.js');
const server = express();

server.use(express.json()); // add to make POST and PUT work

server.get('/', (req, res) => {  res.send("Hello Mom");  })

server.get('/now', (req, res) => { 
    const now = new Date().toISOString();
    res.send(now)   
} )

server.get('/hubs', (req, res) => {
    db.hubs.find().then( hubs => {
            // 200-299 = success
            // 300-399 = redirect
            // 400-499 client error
            // 500-599 server error

        res.status(200).json(hubs);
        }).catch( error => {
            //handle error
            res.status(500).json({ message: 'error retrieving hubs' });
        })
    })

server.post('/hubs', (req, res) =>  {
        //read the data for the hub
        const hubInfo = req.body;

        //add the hub to our database
        db.hubs.add(hubInfo)
        .then(hub => {
            //let the client know what happened
            res.status(201).json(hub);
        })
        .catch( error => {
            res.status(500).json({ message: 'error retrieving hubs' });
        })
        //let the client know what happened
})

server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id;

    db.hubs.remove(id).then(deleted => {
        res.status(204).json({ message: 'error deleting the hub' }) //end();   // tell client request completed
    })
    .catch( error => {
        res.status(500).json({ message: 'error deleting the hub' })
    })
}) // end delete

server.put('/hubs/:id', (req, res) => {
    const { id } = req.params; //destructuring for variety, can also be done as above
    const changes = req.body;

    db.hubs.update( id, changes ).then( updated => {
        if(updated) { //
            res.status(200).json(updated);
        } else {  // if can't find element
            res.status(404).json( { message: ' could not find hub '  } )
        } })
        .catch( error => {
            res.status(500).json({ message: 'error updating the hub' });
        })


    })// end put

 
server.listen(4000, () => {
    console.log('\n** API up'     );
})