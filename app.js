const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
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

// method-override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// flash
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//index route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    });
});

//about page
app.get('/about', (req, res) => {
    res.render('about');
});

// ideas page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {ideas:ideas})
        })
})

// add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        })
    })
});

// process form
app.post('/ideas', (req, res) => {
    let errors = []
    
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    
    if(!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }
    
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas')
            })
        }
    })
    
    // edit form process
    app.put('/ideas/:id', (req, res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title,
            idea.details = req.body.details
            
            idea.save()
            .then(idea => {
                    req.flash('success_msg', 'Video idea updated');
                    res.redirect('/ideas')
                })
        })
})

// delete
app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Video idea removed')
            res.redirect('/ideas')
        })
})
const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
