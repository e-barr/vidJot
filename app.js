const express = require('express');
const exphbs = require('express-handlebars')

const app = express();


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
});