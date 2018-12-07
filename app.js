const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjjot-dev', {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

//index route
app.get('/', (req, resp) => {
    const title = 'Welcome'
    resp.render('index', {
        title: title
    })
}) 

//about page
app.get('/about', (req, resp) => {
    resp.render('about')
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})