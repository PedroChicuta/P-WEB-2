class Curso{
    constructor({
        id = null, 
        nome,
        cargaHoraria,
        ativo,
    }){
        this.id = id;
        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
        this.ativo = ativo;
    }
}

module.exports = Curso;