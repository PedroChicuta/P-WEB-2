const { body, validationResult } = require('express-validator');

const regras = [
    body('aluno_id')
        .notEmpty().withMessage('Selecione um aluno.')
        .isInt().withMessage('ID de aluno inválido.'),

    body('curso_id')
        .notEmpty().withMessage('Selecione um curso.')
        .isInt().withMessage('ID de curso inválido.'),

    body('data_matricula')
        .optional()
        .isISO8601().withMessage('Data inválida.')
];

class MatriculaController {
    constructor(service) {
        this.service = service;
    }

    regrasCriar() { return regras; }
    regrasEditar() { return regras; }

    // LISTA
    async lista(req, res) {
        const busca = req.query.busca;

        const matriculas = busca
            ? await this.service.find(busca)
            : await this.service.getAll();

        res.render("matriculas/lista", {
            matriculas,
            busca
        });
    }

    // FORM - NOVO
    async novoForm(req, res) {
        // Possível: passar lista de alunos e cursos
        // const alunos = await this.service.getAlunos();
        // const cursos = await this.service.getCursos();

        res.render("matriculas/form", { matricula: {}, errors: {} });
    }

    // CREATE / UPDATE
    async salvar(req, res) {
        const errors = validationResult(req);

        const matricula = this._payload(req.body);
        matricula.id = req.body.id || null;

        if (!errors.isEmpty()) {
            return res.status(400).render("matriculas/form", {
                matricula,
                errors: errors.mapped()
            });
        }

        if (matricula.id) {
            await this.service.update(matricula.id, matricula);
        } else {
            await this.service.create(matricula);
        }

        return res.redirect("/matriculas");
    }

    // FORM EDITAR
    async editarForm(req, res) {
        const id = Number(req.params.id);
        const matricula = await this.service.find(id);

        if (!matricula) return res.redirect("/matriculas");

        res.render("matriculas/form", { matricula, errors: {} });
    }

    // EXCLUIR
    async excluir(req, res) {
        const id = Number(req.params.id);
        await this.service.delete(id);
        return res.redirect("/matriculas");
    }

    // TRATA OS CAMPOS DO FORM
    _payload(body) {
        return {
            aluno_id: body.aluno_id,
            curso_id: body.curso_id,
            data_matricula: body.data_matricula || null
        };
    }
}

module.exports = MatriculaController;
