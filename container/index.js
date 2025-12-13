const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineAlunoModel } = require('../infra/db/models/AlunoModel');
const { defineCursoModel } = require('../infra/db/models/CursoModel');
const { defineMatriculaModel } = require('../infra/db/models/MatriculaModel');

const AlunoRepositorySequelize = require('../infra/repositories/AlunoRepositorySequelize');
const CursoRepositorySequelize = require('../infra/repositories/CursoRepositorySequelize');
const MatriculaRepositorySequelize = require('../infra/repositories/MatriculaRepositorySequelize');

const AlunoService = require('../application/services/AlunoService');
const CursoService = require('../application/services/CursoService');
const MatriculaService = require('../application/services/MatriculaService');


const sequelize = createSequelizeInstance();


const AlunoModel = defineAlunoModel(sequelize);
const CursoModel = defineCursoModel(sequelize);
const MatriculaModel = defineMatriculaModel(sequelize);


// Isso ensina ao Sequelize que existe uma ligação entre as tabelas.
// O "as: 'Aluno'" é o apelido que usamos no 'include' do repositório.

MatriculaModel.belongsTo(AlunoModel, { foreignKey: 'alunoId', as: 'Aluno' });
MatriculaModel.belongsTo(CursoModel, { foreignKey: 'cursoId', as: 'Curso' });

//define o caminho inverso (Um aluno tem várias matrículas)
AlunoModel.hasMany(MatriculaModel, { foreignKey: 'alunoId' });
CursoModel.hasMany(MatriculaModel, { foreignKey: 'cursoId' });



sequelize.sync()
  .then(() => console.log('Banco sincronizado com Sequelize (ORM).'))
  .catch(err => console.error('Erro ao sincronizar banco:', err));


const alunoRepository = new AlunoRepositorySequelize(AlunoModel);
const cursoRepository = new CursoRepositorySequelize(CursoModel);
const matriculaRepository = new MatriculaRepositorySequelize(MatriculaModel);


const alunoService = new AlunoService(alunoRepository);
const cursoService = new CursoService(cursoRepository);
const matriculaService = new MatriculaService(matriculaRepository);

module.exports = {
  sequelize,
  AlunoModel,
  CursoModel,
  MatriculaModel,
  alunoRepository,
  cursoRepository,
  matriculaRepository,
  alunoService,
  cursoService,
  matriculaService,
};