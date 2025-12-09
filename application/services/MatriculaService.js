const Matricula = require('../../domain/entities/Matricula');

class MatriculaService {
    /**
     * @param {MatriculaRepository} repo
     */
    constructor(repo) { this.repo = repo; }

    async create(payload) {
        const matricula = new Matricula(payload);
        return await this.repo.create(matricula);
    }

    async getAll() {
        return await this.repo.findAll();
    }

    async find(id) {
        return await this.repo.findById(Number(id));
    }

    async update(id, payload) {
        const atual = await this.repo.findById(Number(id));
        if (!atual) return null;
        const matricula = new Matricula({ ...atual, ...payload, id: Number(id) });
        return await this.repo.update(matricula);
    }

    async delete(id) {
        await this.repo.deleteById(Number(id));
    }
}

module.exports = MatriculaService;