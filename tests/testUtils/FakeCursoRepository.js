const CursoRepository = require('../../domain/ports/CursoRepository');

class FakeCursoRepository extends CursoRepository {
    constructor() {
        super();
        this.cursos = []; 
        this.idCounter = 1;
    }

    async create(curso) {
        const novo = { ...curso, id: this.idCounter++ };
        this.cursos.push(novo);
        return novo;
    }

    async findAll() { 
        return this.cursos; 
    }

    async findById(id) { 
        return this.cursos.find(c => c.id === id); 
    }
    
    async update(curso) {
        const index = this.cursos.findIndex(c => c.id === curso.id);
        if (index !== -1) {
            this.cursos[index] = curso;
            return curso;
        }
        return null;
    }

    async deleteById(id) {
        const index = this.cursos.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cursos.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = FakeCursoRepository;