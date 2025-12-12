const { body } = require('express-validator');

const regras = [
    body('nome')
        .trim()
        .isLength({ min: 3, max: 60 })
        .withMessage('Nome deve ter entre 3 e 60.')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
        .withMessage('Nome inválido.')
        .escape(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('E-mail inválido.')
        .normalizeEmail(),
    body('matricula')
        .trim()
        .isLength({ min: 8, max: 8 })
        .withMessage('A matrícula deve conter exatamente 8 dígitos.')
        .isNumeric()
        .withMessage('A matrícula deve conter apenas números.')
];

class AlunoController {
  constructor(service) { this.service = service; }

  regrasCriar() { return regras; }
  regrasEditar() { return regras; }

  async form(req, res) {
    res.render('aluno', { title: 'Formulário de Aluno', data: {}, errors: {} });
  }

  async create(req, res) {
    if (req.validationMapped) {
      return res.status(400).render('aluno', {
        title: 'Formulário de Contato',
        data: this._payload(req.body),
        errors: req.validationMapped
      });
    }
    const aluno = await this.service.create(this._payload(req.body));
    return res.render('sucesso', { title: 'Enviado com sucesso', data: aluno });
  }

  async lista(req, res) {
    const alunos = await this.service.getAll();
    res.render('listar-contatos', { title: 'Lista de Contatos', alunos });
  }

  async editarForm(req, res) {
    const id = Number(req.params.id);
    const aluno = await this.service.find(id);
    if (!aluno) return res.redirect('/aluno/lista');
    res.render('aluno-editar', { title: 'Editar aluno', data: aluno, errors: {} });
  }

  async editar(req, res) {
    const id = Number(req.params.id);
    if (req.validationMapped) {
      const data = this._payload(req.body); data.id = id;
      return res.status(400).render('aluno-editar', { title: 'Editar aluno', data, errors: req.validationMapped });
    }
    await this.service.update(id, this._payload(req.body));
    return res.redirect('/aluno/lista');
  }

  async excluir(req, res) {
    const id = Number(req.params.id);
    await this.service.excluir(id);
    res.redirect('/contato/lista');
  }

  _payload(body) {
    return {
      nome: body.nome,
      email: body.email,
      idade: body.idade || null,
      genero: body.genero || '',
      interesses: body.interesses || [],
      mensagem: body.mensagem,
      aceite: body.aceite === 'on'
    };
  }
}

module.exports = AlunoController;
