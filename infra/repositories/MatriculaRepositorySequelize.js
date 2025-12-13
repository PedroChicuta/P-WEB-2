const MatriculaRepository = require('../../domain/ports/MatriculaRepository');
const Matricula = require('../../domain/entities/Matricula');

class MatriculaRepositorySequelize extends MatriculaRepository {
    constructor(MatriculaModel) {
        super();
        this.MatriculaModel = MatriculaModel;
    }

    _rowToEntity(row) {
        if (!row) return null;
        // Precisamos retornar o JSON puro para levar os objetos Aluno e Curso juntos para a View
        return row.toJSON(); 
    }

    async create(matricula) {
        const row = await this.MatriculaModel.create(matricula);
        return this._rowToEntity(row);
    }

    async update(matricula) {
        await this.MatriculaModel.update(matricula, { where: { id: matricula.id } });
        return this.findById(matricula.id);
    }

    async deleteById(id) {
        await this.MatriculaModel.destroy({ where: { id } });
    }

    async findAll() {
        const rows = await this.MatriculaModel.findAll({
            include: ['Aluno', 'Curso'], // Traz os dados das tabelas relacionadas
            order: [['data', 'DESC']]
        });
        return rows.map(r => this._rowToEntity(r));
    }

    async findById(id) {
        const row = await this.MatriculaModel.findByPk(id, {
            include: ['Aluno', 'Curso']
        });
        return this._rowToEntity(row);
    }
}

module.exports = MatriculaRepositorySequelize;