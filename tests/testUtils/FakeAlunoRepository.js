const AlunoRepository = require('../../domain/ports/AlunoRepository'); 

class FakeAlunoRepository extends AlunoRepository {
    constructor() {
        super();
        this.alunos = []; 
        this.idCounter = 1;
    }

    async create(aluno) {
        const novo = { ...aluno, id: this.idCounter++ };
        this.alunos.push(novo);
        return novo;
    }

    async findAll() { 
        return this.alunos; 
    }

    async findById(id) { 
        return this.alunos.find(a => a.id === id); 
    }
    
    async update(aluno) {
        const index = this.alunos.findIndex(a => a.id === aluno.id);
        if (index !== -1) {
            this.alunos[index] = aluno;
            return aluno;
        }
        return null;
    }

    async deleteById(id) {
        const index = this.alunos.findIndex(a => a.id === id);
        if (index !== -1) {
            this.alunos.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = FakeAlunoRepository;