const { body, validationResult } = require('express-validator');


const regras = [
    body('alunoId').notEmpty().withMessage('Selecione um aluno.').isInt(),
    body('cursoId').notEmpty().withMessage('Selecione um curso.').isInt(),
    body('data').optional().isISO8601().withMessage('Data inválida.')
];

class MatriculaController {
    constructor(matriculaService, alunoService, cursoService) {
        this.service = matriculaService;
        this.alunoService = alunoService;
        this.cursoService = cursoService;
    }

    regrasCriar() { return regras; }

    // LISTA
    async lista(req, res) {
        const statusFiltro = req.query.status; 
        const todas = await this.service.getAll();

        let matriculas = todas;
        if (statusFiltro) {
            matriculas = todas.filter(m => m.status === statusFiltro);
        }

        let mensagem = null;
        if (req.query.msg === 'criada') mensagem = 'Matrícula realizada com sucesso!';
        if (req.query.msg === 'status') mensagem = 'Status da matrícula alterado!';
        if (req.query.msg === 'deletada') mensagem = 'Matrícula excluída!';

        res.render("matriculas/lista", {
            matriculas,
            status: statusFiltro,
            mensagem
        });
    }

    // FORM - NOVO (Carrega Alunos e Cursos)
    async novoForm(req, res) {
        try {
            const alunos = await this.alunoService.getAll();
            // Filtra apenas cursos ativos para nova matrícula
            const cursosTodos = await this.cursoService.getAll();
            const cursosAtivos = cursosTodos.filter(c => c.ativo);

            res.render("matriculas/form", { 
                matricula: {}, 
                alunos, 
                cursos: cursosAtivos, 
                errors: {} 
            });
        } catch (erro) {
            console.log(erro);
            res.redirect('/matriculas');
        }
    }

    // SALVAR 
    async salvar(req, res) {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            // Se der erro, precisamos recarregar as listas para o select não sumir
            const alunos = await this.alunoService.getAll();
            const cursos = await this.cursoService.getAll();
            return res.status(400).render("matriculas/form", {
                matricula: req.body,
                alunos,
                cursos,
                errors: errors.mapped()
            });
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

    // ALTERAR STATUS (Trancar/Concluir)
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