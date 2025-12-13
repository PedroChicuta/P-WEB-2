const express = require('express');
const MatriculaController = require('../controllers/MatriculaController');


module.exports = function (matriculaService, alunoService, cursoService) {
  const router = express.Router();

  // Injeta os 3 services no Controller
  const controller = new MatriculaController(matriculaService, alunoService, cursoService);

  router.get('/', (req, res) => controller.lista(req, res));
  
  router.get('/nova', (req, res) => controller.novoForm(req, res)); 

  router.get('/novo', (req, res) => controller.novoForm(req, res));

  router.post('/salvar', controller.regrasCriar(), (req, res) => controller.salvar(req, res));

  router.post('/status/:id', (req, res) => controller.alterarStatus(req, res));

  router.post('/delete/:id', (req, res) => controller.excluir(req, res));

  return router;
};