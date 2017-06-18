'use strict';

const express = require('express');
const volleyball = require('volleyball');
const path = require('path');

const app = express();

app.use(volleyball);
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(express.static(__dirname));

app.get("*", (req, res, next) => {
  res.sendFile("/home/sam/stackathon/client/index.html")
})

app.listen(3000, function () {
  console.log('Server listening on port', 3000);
});

