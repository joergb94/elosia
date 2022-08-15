const express = require('express');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');


const { database } = require('./keys');

// INICIALIZACIONES
const app = express();
require('./lib/passport');

// CONFIGURACIONES
app.set('port', process.env.PORT || 4000);

// ===============================
// CARPETA DE LAS VISTAS
app.set('views', path.join(__dirname, 'views'));
// CONFIGURANDO EL  ENGINE PARA LAS VISTAS
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');
// ===============================

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
  secret: 'eloisa',
  resave:false,
  saveUninitialized:false,
  store: new MySqlStore(database)
}));
// mensajes de notificaciones
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// VARIABLES GLOBALES
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.acceso = req.flash('acceso');
    app.locals.noacceso = req.flash('noacceso');
    app.locals.accede = req.flash('accede');
    app.locals.user = req.user;
    app.locals.menu = req.menu;
    next();
});


// RUTAS
app.use(require('./routes'));

// MODULO USUARIOS
app.use(require('./routes/login'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/productos', require('./routes/productos'));
app.use('/inventario', require('./routes/inventario'));
app.use('/clientes', require('./routes/clientes'));
app.use('/pv', require('./routes/pv'));
app.use('/corteCaja', require('./routes/corteCaja'));
app.use('/reportes', require('./routes/reportes'));
app.use('/perfiles', require('./routes/perfiles'));

// ARCHIVOS PUBLICOS
app.use(express.static(path.join(__dirname, 'public')));

// SERVER
app.listen(app.get('port'), () => {
    console.log("Server is Running on port", app.get('port'));
});