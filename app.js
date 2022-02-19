const express = require('express');

const app = express();
app.use(express.static('client'));

// app.get('/', (req, res) => {
//     res.end("hello world");
// });

app.listen(3000);