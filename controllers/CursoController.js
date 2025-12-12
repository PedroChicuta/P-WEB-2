const { body, validationResult } = require('express-validator');

const regras = [
    body('nome')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('O nome deve ter entre 3 e 60 caracteres.')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9' -]+$/).withMessage('Nome inválido.')
        .escape(),

    body('descricao')
        .trim()
        .isLength({ min: 5, max: 255 }).withMessage('A descrição deve ter entre 5 e 255 caracteres.')
        .escape()
];

class CursoController {
    constructor(service) {
        this.service = service;
    }

    regrasCriar() { return regras; }
    regrasEditar() { return regras; }

    // LISTA CURSOS
    async lista(req, res) {
        const busca = req.query.busca;

        const cursos = busca
            ? await this.service.find(busca)
            : await this.service.getAll();

        res.render("cursos/lista", {
            cursos,
            busca
        });
    }

    // FORM - NOVO
    async novoForm(req, res) {
        res.render("cursos/form", { curso: {} });
    }

    // CREATE / UPDATE
    async salvar(req, res) {
        const errors = validationResult(req);

        const curso = this._payload(req.body);
        curso.id = req.body.id || null;

        if (!errors.isEmpty()) {
            return res.status(400).render("cursos/form", {
                curso,
                errors: errors.mapped()
            });
        }

        if (curso.id) {
            await this.service.update(curso.id, curso);
        } else {
            await this.service.create(curso);
        }

        return res.redirect("/cursos");
    }

    // FORM EDITAR
    async editarForm(req, res) {
        const id = Number(req.params.id);
        const curso = await this.service.find(id);

        if (!curso) return res.redirect("/cursos");

        res.render("cursos/form", { curso, errors: {} });
    }

    // EXCLUIR
    async excluir(req, res) {
        const id = Number(req.params.id);
        await this.service.delete(id);
        return res.redirect("/cursos");
    }

    // TRATAMENTO DO PAYLOAD
    _payload(body) {
        return {
            nome: body.nome,
            descricao: body.descricao
        };
    }
}

module.exports = CursoController;
