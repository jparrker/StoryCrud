const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

dotenv.config({path: "./config/config.env"})

// Passport config

require('./config/passport')(passport)

const app = express()
connectDB()



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





const PORT = process.env.PORT || 5000
app.listen(PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))

