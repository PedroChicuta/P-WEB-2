const AlunoService = require('../../application/services/AlunoService');
const FakeAlunoRepository = require('../testUtils/FakeAlunoRepository');

describe('AlunoService (Testes Básicos)', () => {
    let service;
    let repo;

    beforeEach(() => {
        repo = new FakeAlunoRepository();
        service = new AlunoService(repo);
    });

    test('Deve criar um aluno com sucesso', async () => {
        const dadosAluno = {
            nome: 'Luiz Claudio',
            email: 'luiz@ifal.edu.br',
            matricula: '2023001'
        };

        const resultado = await service.create(dadosAluno);

        // Verificação
        expect(resultado).toHaveProperty('id');
        expect(resultado.id).toBeDefined();
        expect(resultado.nome).toBe('Luiz Claudio');
        expect(resultado.email).toBe('luiz@ifal.edu.br');
        expect(resultado.matricula).toBe('2023001');
    });

    test('Deve listar todos os alunos cadastrados', async () => {
        await service.create({ nome: 'Pedro', email: 'p@test.com', matricula: '001' });
        await service.create({ nome: 'Luiz', email: 'l@test.com', matricula: '002' });

        const lista = await service.getAll();

        expect(lista).toHaveLength(2);
        expect(lista[0].nome).toBe('Pedro');
        expect(lista[1].nome).toBe('Luiz');
    });

    test('Deve encontrar um aluno pelo ID', async () => {
        const criado = await service.create({ nome: 'Aluno Teste', email: 'teste@email.com', matricula: '123' });

        const encontrado = await service.find(criado.id);

        expect(encontrado).toBeDefined();
        expect(encontrado.id).toBe(criado.id);
        expect(encontrado.email).toBe('teste@email.com');
    });

    test('Deve atualizar os dados de um aluno', async () => {
        const criado = await service.create({ nome: 'Nome Errado', email: 'errado@email.com', matricula: '000' });

        // Atualiza o nome e email
        const atualizado = await service.update(criado.id, { 
            nome: 'Nome Correto', 
            email: 'correto@email.com' 
        });

        expect(atualizado.nome).toBe('Nome Correto');
        expect(atualizado.email).toBe('correto@email.com');

        // Verifica se persistiu no repositório
        const busca = await service.find(criado.id);
        expect(busca.nome).toBe('Nome Correto');
    });

    test('Deve excluir um aluno', async () => {
        const criado = await service.create({ nome: 'Para Deletar', email: 'del@email.com', matricula: '999' });

        await service.delete(criado.id);

        const busca = await service.find(criado.id);
        expect(busca).toBeUndefined();
    });
});