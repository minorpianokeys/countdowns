if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const { isLoggedIn } = require('./middleware')

const User = require('./models/user')
const Card = require('./models/card');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/countdownCards';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => {
    console.log("MONGO CONNECTION OPEN!")
})
.catch(err => {
    console.log("MONGO ERROR")
    console.log(err)
})

const secret = process.env.SECRET
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    secret
})

store.on("error", function(e) {
    console.log("SESSOIN STORE ERROR", e)
})

const sessionConfig = { 
    store,
    secret,
    resave: false, 
    saveUninitialized: false 
};


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/index', isLoggedIn, async (req, res) => {
    const cards = await Card.find({ author: res.locals.currentUser._id }).sort({ date: 1 });
    res.render('index', { cards })
})

app.get('/add', isLoggedIn, (req, res) => {
    res.render('add')
})

app.post('/index', async (req, res) => {
    const newCard = new Card(req.body);
    newCard.author = req.user._id;
    await newCard.save();
    console.log(newCard)
    res.redirect('index')
})

app.get('/index/:id/edit', async (req, res) => {
    const card = await Card.findById(req.params.id)
    res.render('edit', { card })
})

app.put('/index/:id', async (req, res) => {
    const { id } = req.params;
    await Card.findByIdAndUpdate(id, { ...req.body }, { useFindAndModify: false });
    res.redirect('/index')
})

app.delete('/index/:id', async (req, res) => {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.redirect('/index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res) => {
    await res.redirect('index')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = new User({ username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next (err);
            console.log(registeredUser)
            res.redirect('/index')
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!')
    res.redirect('/')
})

app.listen(3000, () => {
    console.log("APP IS LISTENING")
})
