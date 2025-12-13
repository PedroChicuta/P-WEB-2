const { body, validationResult } = require('express-validator');

const regras = [
    body('nome')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('Nome deve ter entre 3 e 60 caracteres.')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome inválido (apenas letras).')
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

    // LISTAR 
    async lista(req, res) {
        const busca = req.query.busca;

        // 1. Busca todos os alunos
        const todosAlunos = await this.service.getAll();

     
        let alunosFiltrados = todosAlunos;
        if (busca) {
            alunosFiltrados = todosAlunos.filter(a => 
                a.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }

        // 3. Verifica se há mensagem de sucesso na URL
        let mensagem = null;
        if (req.query.msg === 'criado') mensagem = 'Aluno(a) cadastrado com sucesso!';
        if (req.query.msg === 'editado') mensagem = 'Dados do aluno atualizados com sucesso!';
        if (req.query.msg === 'deletado') mensagem = 'Aluno excluído com sucesso!';

        res.render("alunos/lista", {
            alunos: alunosFiltrados,
            busca: busca,
            mensagem: mensagem // Envia para a view
        });
    }

    // FORM DE CRIAÇÃO
    async novoForm(req, res) {
        // Importante passar errors: {} para a view não quebrar
        res.render("alunos/form", { aluno: {}, errors: {} });
    }

    // SALVAR (CREATE ou UPDATE)
    async salvar(req, res) {
        const errors = validationResult(req);
        const aluno = this._payload(req.body);
        aluno.id = req.body.id || null; 

        // Se houver erro de validação
        if (!errors.isEmpty()) {
            return res.status(400).render("alunos/form", {
                aluno, 
                errors: errors.mapped() 
            });
        }

        // Se tem ID, atualiza. Se não, cria.
        if (aluno.id) {
            await this.service.update(aluno.id, aluno);
            return res.redirect("/alunos?msg=editado"); 
        } else {
            await this.service.create(aluno);
            return res.redirect("/alunos?msg=criado"); 
        }
    }

    // FORM EDITAR
    async editarForm(req, res) {
        const id = Number(req.params.id);
        const aluno = await this.service.find(id);

        if (!aluno) return res.redirect("/alunos");

        res.render("alunos/form", { aluno, errors: {} });
    }

    // EXCLUIR
    async excluir(req, res) {
        const id = Number(req.params.id);
        await this.service.delete(id);
        return res.redirect("/alunos?msg=deletado"); 
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