const express = require('express');

const app = express();

//index route
app.get('/', (req, resp) => {
    resp.send('INDEX')
}) 

//about page
app.get('/about', (req, resp) => {
    resp.send('ABOUT1')
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});