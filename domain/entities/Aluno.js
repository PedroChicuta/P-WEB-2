class Aluno{
  constructor({ 
    id = null, 
    nome, 
    email, 
    matricula = null, 
    }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.matricula = matricula;
    }
}

module.exports = Aluno;