const express = require('express');
const app = express();
app.get('/hello',(req,res)=>
    {
        res.send("hello from get api");
    }).listen(1200);
    console.log("hello from console")