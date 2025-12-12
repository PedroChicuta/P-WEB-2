const { body, validationResult } = require('express-validator');

const regras = [
    body('nome')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('Nome deve ter entre 3 e 60.')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome inválido.')
        .escape(),

    body('email')
        .trim()
        .isEmail().withMessage('E-mail inválido.')
        .normalizeEmail(),

    body('matricula')
        .trim()
        .isLength({ min: 8, max: 8 }).withMessage('A matrícula deve conter exatamente 8 dígitos.')
        .isNumeric().withMessage('A matrícula deve conter apenas números.')
];

class AlunoController {
    constructor(service) {
        this.service = service;
    }

    regrasCriar() { return regras; }
    regrasEditar() { return regras; }

    
    async lista(req, res) {
        console.log(req);
        const busca = req.query.busca;

        const alunos = busca
            ? await this.service.find(busca)
            : await this.service.getAll();

        res.render("alunos/lista", {
            alunos,
            busca
        });
    }

    // FORM DE CRIAÇÃO
    async novoForm(req, res) {
        res.render("alunos/form", { aluno: {} });
    }

    // SALVAR (CREATE ou UPDATE)
    async salvar(req, res) {
        const errors = validationResult(req);

        const aluno = this._payload(req.body);
        aluno.id = req.body.id || null;

        if (!errors.isEmpty()) {
            return res.status(400).render("alunos/form", {
                aluno,
                errors: errors.mapped()
            });
        }

        if (aluno.id) {
            await this.service.update(aluno.id, aluno);
        } else {
            await this.service.create(aluno);
        }

        return res.redirect("/alunos");
    }

    // FORM EDITAR
    async editarForm(req, res) {
        const id = Number(req.params.id);
        const aluno = await this.service.find(id);

        if (!aluno) return res.redirect("/alunos");

        res.render("aluno/form", { aluno, errors: {} });
    }

    // EXCLUIR
    async excluir(req, res) {
        const id = Number(req.params.id);
        await this.service.delete(id);
        return res.redirect("/alunos");
    }

    // TRATAMENTO DOS CAMPOS DO FORM
    _payload(body) {
        return {
            nome: body.nome,
            email: body.email,
            matricula: body.matricula
        };
    }
}

module.exports = AlunoController;
