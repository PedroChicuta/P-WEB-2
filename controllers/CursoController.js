const { body, validationResult } = require('express-validator');

const regras = [
    body('nome')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('O nome deve ter entre 3 e 60 caracteres.')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9' -]+$/).withMessage('Nome inválido (letras e números apenas).')
        .escape(),

    body('cargaHoraria')
        .trim()
        .notEmpty().withMessage('Carga horária é obrigatória.')
        .isInt({ min: 1 }).withMessage('A carga horária deve ser um número inteiro positivo (ex: 60).')
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

        const todosCursos = await this.service.getAll();

        let cursosFiltrados = todosCursos;
        if (busca) {
            cursosFiltrados = todosCursos.filter(c => 
                c.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }

        // Mensagens de Feedback
        let mensagem = null;
        if (req.query.msg === 'criado') mensagem = 'Curso criado com sucesso!';
        if (req.query.msg === 'editado') mensagem = 'Curso atualizado com sucesso!';
        if (req.query.msg === 'deletado') mensagem = 'Curso excluído com sucesso!';
        if (req.query.msg === 'status') mensagem = 'Status do curso alterado!';

        res.render("cursos/lista", {
            cursos: cursosFiltrados,
            busca: busca,
            mensagem: mensagem
        });
    }

    // FORM - NOVO
    async novoForm(req, res) {
        res.render("cursos/form", { curso: {}, errors: {} });
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
            return res.redirect("/cursos?msg=editado");
        } else {
            await this.service.create(curso);
            return res.redirect("/cursos?msg=criado");
        }
    }

    // MÉTODO NOVO: Alternar Status (Ativo/Inativo)
    async toggleStatus(req, res) {
        const id = Number(req.params.id);
        const curso = await this.service.find(id);
        
        if (curso) {
            curso.ativo = !curso.ativo; 
            await this.service.update(id, curso);
        }
        
        return res.redirect("/cursos?msg=status");
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
        return res.redirect("/cursos?msg=deletado");
    }

    // TRATAMENTO DO PAYLOAD
    _payload(body) {
        return {
            nome: body.nome,
            cargaHoraria: body.cargaHoraria,
            // Checkbox HTML envia 'on' se marcado, ou undefined se desmarcado.
            ativo: body.ativo === 'on' 
        };
    }
}

module.exports = CursoController;