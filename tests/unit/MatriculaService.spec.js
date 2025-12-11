const MatriculaService = require('../../application/services/MatriculaService');
const FakeMatriculaRepository = require('../testUtils/FakeMatriculaRepository');

describe('MatriculaService (Testes Básicos)', () => {
    let service;
    let repo;

    // Antes de cada teste, tudo e limpo para começar do zero
    beforeEach(() => {
        repo = new FakeMatriculaRepository();
        service = new MatriculaService(repo);
    });

    test('Deve criar uma matrícula com sucesso', async () => {
        const dadosMatricula = {
            alunoId: 1,
            cursoId: 101,
            data: new Date(),
            status: 'ativa'
        };

        const resultado = await service.create(dadosMatricula);

        // Verificação
        expect(resultado).toHaveProperty('id'); // Verifica se ganhou um ID
        expect(resultado.alunoId).toBe(1);      // Verifica se guardou o aluno certo
        expect(resultado.status).toBe('ativa');
    });

    test('Deve listar todas as matrículas cadastradas', async () => {
        //Cria duas matrículas
        await service.create({ alunoId: 1, cursoId: 101, status: 'ativa' });
        await service.create({ alunoId: 2, cursoId: 202, status: 'trancada' });

        //Pede a lista
        const lista = await service.getAll();

        //Verifica se vieram 2 itens
        expect(lista).toHaveLength(2);
        expect(lista[0].status).toBe('ativa');
        expect(lista[1].status).toBe('trancada');
    });

    test('Deve encontrar uma matrícula pelo ID', async () => {
        const criada = await service.create({ alunoId: 5, cursoId: 50 });

        const encontrada = await service.find(criada.id);

        expect(encontrada).toBeDefined();
        expect(encontrada.id).toBe(criada.id);
    });

    test('Deve atualizar o status de uma matrícula', async () => {
        const criada = await service.create({ alunoId: 1, cursoId: 10, status: 'ativa' });

        const atualizada = await service.update(criada.id, { status: 'concluída' });

       
        expect(atualizada.status).toBe('concluída');
        
        // Verifica se no "banco" também mudou
        const buscada = await service.find(criada.id);
        expect(buscada.status).toBe('concluída');
    });

    test('Deve excluir uma matrícula', async () => {
        const criada = await service.create({ alunoId: 2, cursoId: 20 });

        await service.delete(criada.id);

        //Tenta buscar e espera que venha vazio (undefined ou null)
        const buscada = await service.find(criada.id);
        expect(buscada).toBeUndefined();
    });
});