const { body, validationResult } = require('express-validator');
const MatriculaError = require('../errors/MatriculaError');


const regras = [
    body('alunoId').notEmpty().withMessage('Selecione um aluno.').isInt().toInt(),
    body('cursoId').notEmpty().withMessage('Selecione um curso.').isInt().toInt(),
    body('data').optional().isISO8601().withMessage('Data inválida.')
];

class MatriculaController {
    constructor(matriculaService) {
        this.service = matriculaService;
    }

    regrasCriar() { return regras; }

    async lista(req, res) {
        const statusFiltro = req.query.status; 
        const matriculas = await this.service.getAll(statusFiltro);

       const mensagens = {
            criada: 'Matrícula realizada com sucesso!',
            status: 'Status da matrícula alterado!',
            deletada: 'Matrícula excluída!'
        };

        const mensagem = mensagens[req.query.msg] ?? null;

        res.render("matriculas/lista", {
            matriculas,
            status: statusFiltro,
            mensagem
        });
    }

    async novoForm(req, res) {
        try {
            const formulario = await this.service.prepararFormulario();
            res.render("matriculas/form", formulario);
        } catch (erro) {
            res.redirect('/matriculas');
        }
    }

    // SALVAR 
    async salvar(req, res) {
        try{
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                throw new MatriculaError('Erro de validação', 422, errors.mapped()); 
            }
            
            const dados = {
                alunoId: req.body.alunoId,
                cursoId: req.body.cursoId,
                data: req.body.data || new Date(),
                status: 'ativa'
            };

            await this.service.create(dados);

            return res.redirect("/matriculas?msg=criada");
        }
        catch(err){
            return res.status(err.statusCode).render("matriculas/form", err.body);
        }
    }

    async alterarStatus(req, res) {
        const id = Number(req.params.id);
        const novoStatus = req.body.status; 
        
        const mat = await this.service.find(id);
        if (mat) {
            mat.status = novoStatus;
            await this.service.update(id, mat);
        }
        res.redirect('/matriculas?msg=status');
    }

    async excluir(req, res) {
        const id = Number(req.params.id);
        await this.service.delete(id);
        return res.redirect("/matriculas?msg=deletada");
    }
}

module.exports = MatriculaController;