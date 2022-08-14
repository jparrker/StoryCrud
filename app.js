const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')


// load config 
dotenv.config({path: "./config/config.env"})

// Passport config

require('./config/passport')(passport)

const app = express()
connectDB()

//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())



if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

//handlebars
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs'
  })
)

//Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: {secure: true}
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}))


//passport middleware

app.use(passport.initialize())
app.use(passport.session())
app.set("view engine", '.hbs')
//static folder
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))




const PORT = process.env.PORT || 5000
app.listen(PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))

