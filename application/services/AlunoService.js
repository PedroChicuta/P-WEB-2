const Aluno = require('../../domain/entities/Aluno');

class AlunoService {
    /**
     * @param {AlunoRepository} repo
     */
    constructor(repo) { this.repo = repo; }

    async create(payload) {
        const aluno = new Aluno(payload);
        return await this.repo.create(aluno);
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
        const aluno = new Aluno({ ...atual, ...payload, id: Number(id) });
        return await this.repo.update(aluno);
    }

    async delete(id) {
        await this.repo.deleteById(Number(id));
    }
}

module.exports = AlunoService;