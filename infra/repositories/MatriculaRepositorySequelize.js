const MatriculaRepository = require('../../domain/ports/Matricula');
const Matricula = require('../../domain/entities/Matricula');

class MatriculaRepositorySequelize extends MatriculaRepository{

    /**
    * @param {Model} MatriculaModel
    */
    constructor(MatriculaModel) {
        super();
        this.MatriculaModel = MatriculaModel;
    }

    _rowToEntity(row) {
        if (!row) return null;
        return new Matricula({
            id: row.id,
            alunoId: row.alunoId,
            cursoId: row.cursoId,
            data: row.data,
            status: row.status,
        });
    }

    async create(matricula) {
        const row = await this.MatriculaModel.create({
            alunoId: matricula.alunoId,
            cursoId: matricula.cursoId,
            data: matricula.data,
            status: matricula.status,
        });

        return this._rowToEntity(row.toJSON());
    }

    async update(matricula) {
        await this.MatriculaModel.update({
            alunoId: matricula.alunoId,
            cursoId: matricula.cursoId,
            data: matricula.data,
            status: matricula.status,
        }, {
            where: { id: matricula.id }
        });

        const row = await this.MatriculaModel.findByPk(matricula.id);
        return this._rowToEntity(row ? row.toJSON() : null);
    }

    async deleteById(id) {
        await this.MatriculaModel.destroy({ where: { id } });
    }

    async findAll() {
        const rows = await this.MatriculaModel.findAll();
        return rows.map(r => this._rowToEntity(r.toJSON()));
    }

    async findById(id) {
        const row = await this.MatriculaModel.findByPk(id);
        return this._rowToEntity(row ? row.toJSON() : null);
    }


}

module.exports = MatriculaRepositorySequelize;