const express = require('express'); 
const router = express.Router(); 
const { validationResult } = require('express-validator');

const MatriculaController = require('../controllers/MatriculaController');

module.exports = function (MatriculaService) {
  const router = express.Router();

  // cria instâncias aqui dentro usando o que foi recebido
  const controller = new MatriculaController(MatriculaService);

  router.get('/', (req, res) => controller.lista(req, res));

  router.get('/novo', (req, res) => controller.novoForm(req, res));

  router.post('/salvar', controller.regrasCriar(), (req, res) =>
      controller.salvar(req, res)
  );

  router.get('/editar/:id', (req, res) => controller.editarForm(req, res));

  router.post('/delete/:id', (req, res) => controller.excluir(req, res));

  return router;
};
