const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// map global promise
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjjot-dev', {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//index route
app.get('/', (req, resp) => {
    const title = 'Welcome'
    resp.render('index', {
        title: title
    });
});

//about page
app.get('/about', (req, resp) => {
    resp.render('about');
});

// add idea form
app.get('/ideas/add', (req, resp) => {
    resp.render('ideas/add');
});

// process form
app.post('/ideas', (req, resp) => {
    let errors = []

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }

    if(!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if(errors.length > 0) {
        resp.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        resp.send('passed')
    }
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
