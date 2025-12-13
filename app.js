var express = require('express');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {
  sequelize,
  AlunoModel,
  CursoModel,
  MatriculaModel,
  alunoService,
  cursoService,
  matriculaService
} = require('./container/index.js');

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

// Rota de Aluno recebe 1 serviço
app.use('/alunos', alunoRouter(alunoService));

// Rota de Curso recebe 1 serviço
app.use('/cursos', cursoRouter(cursoService));

// Rota de Matrícula recebe 3 serviços (Matricula, Aluno, Curso)
// Isso permite que o controller busque a lista de alunos e cursos para o formulário
app.use('/matriculas', matriculaRouter(matriculaService, alunoService, cursoService));

module.exports = app;