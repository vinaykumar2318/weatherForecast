//jshint esversion:6

import express from "express";
import https from "https";
import bodyParser from "body-parser";

import path, { parse } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();  

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    var cityName = req.body.cityName;
    const apiKey = "f9309a5040673cfda080ea9ee4dfd358";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units=metric";
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgAdress = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.write("<p>The weather in "+cityName+" is "+weatherDescription+".</p>");
            res.write("<h1>The temperature in "+cityName+" is "+temp+"Degree Celcius.</h1>");
            res.write("<img src="+imgAdress+" \>");
            res.send();   
        });
    });
});


app.listen(3000,function(){
    console.log("Server is running on port 3000");
});