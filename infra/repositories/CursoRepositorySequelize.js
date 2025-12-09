const CursoRepository = require('../../domain/ports/CursoRepository');
const Curso = require('../../domain/entities/Curso');

class CursoRepositorySequelize extends CursoRepository {
  /**
   * @param {Model} CursoModel
   */
  constructor(CursoModel) {
    super();
    this.CursoModel = CursoModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    return new Curso({
      id: row.id,
      nome: row.nome,
      cargaHoraria: row.cargaHoraria,
      ativo: row.ativo,
    });
  }

  async create(curso) {
    const row = await this.CursoModel.create({
      nome: curso.nome,
      cargaHoraria: curso.cargaHoraria,
      ativo: curso.ativo,
    });

    return this._rowToEntity(row.toJSON());
  }

  async update(curso) {
    await this.CursoModel.update({
      nome: curso.nome,
      cargaHoraria: curso.cargaHoraria,
      ativo: curso.ativo,
    }, {
      where: { id: curso.id }
    });

    const row = await this.CursoModel.findByPk(curso.id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async deleteById(id) {
    await this.CursoModel.destroy({ where: { id } });
  }

  async findAll() {
    const rows = await this.CursoModel.findAll();
    return rows.map(r => this._rowToEntity(r.toJSON()));
  }

  async findById(id) {
    const row = await this.CursoModel.findByPk(id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }
}

module.exports = CursoRepositorySequelize;