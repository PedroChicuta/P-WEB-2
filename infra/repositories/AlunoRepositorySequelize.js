const AlunoRepository = require('../../domain/ports/AlunoRepository');
const Aluno = require('../../domain/entities/Aluno');

class AlunoRepositorySequelize extends AlunoRepository {
  /**
   * @param {Model} AlunoModel
   */
  constructor(AlunoModel) {
    super();
    this.AlunoModel = AlunoModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    return new Aluno({
      id: row.id,
      nome: row.nome,
      email: row.email,
      matricula: row.matricula,
    });
  }

  async create(aluno) {
    const row = await this.AlunoModel.create({
      nome: aluno.nome,
      email: aluno.email,
      matricula: aluno.matricula,
    });

    return this._rowToEntity(row.toJSON());
  }

  async update(aluno) {
    await this.AlunoModel.update({
      nome: aluno.nome,
      email: aluno.email,
      matricula: aluno.matricula,
    }, {
      where: { id: aluno.id }
    });

    const row = await this.AlunoModel.findByPk(aluno.id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async deleteById(id) {
    await this.AlunoModel.destroy({ where: { id } });
  }

  async findAll() {
    const rows = await this.AlunoModel.findAll();
    return rows.map(r => this._rowToEntity(r.toJSON()));
  }

  async findById(id) {
    const row = await this.AlunoModel.findByPk(id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }
}

module.exports = AlunoRepositorySequelize;