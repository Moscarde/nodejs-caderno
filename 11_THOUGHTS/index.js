const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// Models
const Tought = require('./models/Tought')
const User = require('./models/User')

// Import Routes
const toughtRoutes = require('./routes/toughtsRoutes')

// Import Controller
const ToughtController = require('./controllers/ToughtController')

// Handlebars
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Receber resposta do body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// Flash messages
app.use(flash())

// public path
app.use(express.static('public'))

// Set sessions to res
app.use((req, res, next) => {
    if (req.sessionStore.userid) {
        req.locals.session = req.session
    }

    next()
})

// Routes
app.use('/toughts', toughtRoutes)
app.get('/', ToughtController.showToughts)

// conn.sync({force: true})
conn.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.log(err)
    })