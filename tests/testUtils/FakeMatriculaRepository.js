const MatriculaRepository = require('../../domain/ports/MatriculaRepository');

class FakeMatriculaRepository extends MatriculaRepository {
    constructor() {
        super();
        this.matriculas = []; 
        this.idCounter = 1;
    }

    async create(matricula) {
        const nova = { ...matricula, id: this.idCounter++ };
        this.matriculas.push(nova);
        return nova;
    }

    async findAll() { 
        return this.matriculas; 
    }

    async findById(id) { 
        return this.matriculas.find(m => m.id === id); 
    }
    
    async update(matricula) {
        const index = this.matriculas.findIndex(m => m.id === matricula.id);
        if (index !== -1) {
            this.matriculas[index] = matricula;
            return matricula;
        }
        return null;
    }

    async deleteById(id) {
        const index = this.matriculas.findIndex(m => m.id === id);
        if (index !== -1) {
            this.matriculas.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = FakeMatriculaRepository;