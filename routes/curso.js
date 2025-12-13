const express = require('express'); 
// const router = express.Router(); // <-- Essa linha fora da função não é necessária nesse padrão, pode apagar.
const { validationResult } = require('express-validator');

const CursoController = require('../controllers/CursoController');

module.exports = function (CursoService) {
  const router = express.Router();

  // Cria a instância do Controller injetando o Service recebido
  const controller = new CursoController(CursoService);

  // Listar Cursos
  router.get('/', (req, res) => controller.lista(req, res));

  // Formulário Novo
  router.get('/novo', (req, res) => controller.novoForm(req, res));

  // Salvar (Criar ou Editar) com validações
  router.post('/salvar', controller.regrasCriar(), (req, res) =>
      controller.salvar(req, res)
  );

  // Formulário Editar
  router.get('/editar/:id', (req, res) => controller.editarForm(req, res));

  // --- NOVA ROTA: Alternar Status (Ativar/Desativar) ---
  // Necessária para o botão da view 'lista.ejs' funcionar
  router.post('/toggle/:id', (req, res) => controller.toggleStatus(req, res));

  // Excluir
  router.post('/delete/:id', (req, res) => controller.excluir(req, res));

  return router;
};