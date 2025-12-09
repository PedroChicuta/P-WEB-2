class Matricula{
    constructor({
         id = null,
        alunoId, 
        cursoId, 
        data, 
        status,
    }){
        this.id = id,
        this.alunoId = alunoId;
        this.cursoId =  cursoId; 
        this.data =  data; 
        this.status = status;
    };
}

module.exports = Matricula;