const express = require('express')
const app = express()
const mustache = require('mustache-express')
const session = require('express-session')
const parseurl = require('parseurl')
const bodyParser = require('body-parser')
let userName = ''
let password = ''
const users = [{userName: 'bob', password: '1234'}, {userName: 'ajclose', password: 'password!'}]
let sess;
let clicks = 0

app.set('view engine', 'mustache')
app.engine('mustache', mustache())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.listen(3000, function() {
  console.log("App is live!")
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/verify', function(req, res) {
  sess = req.session
  userName = req.body.userName
  password = req.body.password

  for (var i = 0; i < users.length; i++) {
    const user = users[i]
    if (user.userName === userName && user.password === password) {
      sess.userName = userName
      return res.redirect('/')
    }
  }
  res.redirect('/login')
})

app.get('/', function(req, res) {
  sess = req.session
  if (sess.userName) {
    res.render('index', {
      userName: userName,
      clicks: clicks
    })
  } else {
    res.redirect('/login')
  }
})

app.post('/click', function(req, res) {
  sess = req.session
  clicks += 1
  res.redirect('/')
})

app.get('/signup', function(req, res) {
  res.render('signup')
})

app.post('/register', function(req, res) {
  const newUserName = req.body.userName
  const newPassword = req.body.password
  users.push({userName: newUserName, password: newPassword})
  res.redirect('/login')
})

app.get('/logout', function(req, res) {
  sess = req.session
  sess.userName = ''
  clicks = 0
  res.render('logout')
})
