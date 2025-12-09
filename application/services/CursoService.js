const Curso = require('../../domain/entities/Curso');

class CursoService {
    /**
     * @param {CursoRepository} repo
     */
    constructor(repo) { this.repo = repo; }

    async create(payload) {
        const curso = new Curso(payload);
        return await this.repo.create(curso);
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
        const curso = new Curso({ ...atual, ...payload, id: Number(id) });
        return await this.repo.update(curso);
    }

    async delete(id) {
        await this.repo.deleteById(Number(id));
    }
}

module.exports = CursoService;