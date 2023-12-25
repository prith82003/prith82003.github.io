const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

app.use(express.static('static'));

app.get('/pages', (req, res) => {
    const data = fs.readFileSync('./static/data.json');

    // get json object from data
    const json = JSON.parse(data);

    res.send(json);
});

app.put('/pages', (req, res) => {
    const data = fs.readFileSync('./static/data.json');

    // get json object from data
    const json = JSON.parse(data);

    // add new page to json object
    json.push(req.body);

    // write json object to data
    fs.writeFileSync('./static/data.json', JSON.stringify(json));

    res.send(json);
});