var express = require('express');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const alunoRouter = require('./routes/aluno');
const cursoRouter = require('./routes/curso');
const matriculaRouter = require('./routes/matricula');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/aluno', alunoRouter);
app.use('/curso', cursoRouter);
app.use('/matricula', matriculaRouter);

module.exports = app;
