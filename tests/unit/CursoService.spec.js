const CursoService = require('../../application/services/CursoService');
const FakeCursoRepository = require('../testUtils/FakeCursoRepository');

describe('CursoService (Testes Básicos)', () => {
    let service;
    let repo;

    beforeEach(() => {
        repo = new FakeCursoRepository();
        service = new CursoService(repo);
    });

    test('Deve criar um curso com sucesso', async () => {
        const dadosCurso = {
            nome: 'Sistemas de Informacao',
            data: new Date(),
            ativo: true, 
            cargaHoraria: '3000H'
        };

        const resultado = await service.create(dadosCurso);

        // Verificação
        expect(resultado).toHaveProperty('id'); 
        expect(resultado.id).toBeDefined();
        expect(resultado.nome).toBe('Sistemas de Informacao')
        expect(resultado.ativo).toBe(true);      
        expect(resultado.cargaHoraria).toBe('3000H');
    });

    test('Deve listar todos os cursos cadastrados', async () => {
        // Cria dois cursos
        await service.create({ nome: 'SI', ativo: true, cargaHoraria: '3000H'});
        await service.create({ nome: 'Quimica', ativo: false, cargaHoraria: '2500H'});

        // Pede a lista
        const lista = await service.getAll();

        // Verifica se vieram 2 itens
        expect(lista).toHaveLength(2);
        expect(lista[0].ativo).toBe(true);
        expect(lista[1].ativo).toBe(false);
    });

    test('Deve encontrar um curso pelo ID', async () => {
        const criada = await service.create({ nome: 'SI', ativo: true, cargaHoraria: '3000H' });

        const encontrada = await service.find(criada.id);

        expect(encontrada).toBeDefined();
        expect(encontrada.id).toBe(criada.id);
    });

    test('Deve atualizar o status (ativo) de um curso', async () => {
        const criada = await service.create({ nome: 'SI', ativo: true, cargaHoraria: '3000H' });

        // Atualiza para false (desativado)
        const atualizada = await service.update(criada.id, { ativo: false });

        expect(atualizada.ativo).toBe(false);
        
        // Verifica se no "banco" também mudou
        const buscada = await service.find(criada.id);
        expect(buscada.ativo).toBe(false);
    });

    test('Deve excluir um curso', async () => {
        const criada = await service.create({ nome: 'SI', ativo: true, cargaHoraria: '3000H' });

        await service.delete(criada.id);

        // Tenta buscar e espera que venha vazio
        const buscada = await service.find(criada.id);
        expect(buscada).toBeUndefined();
    });
});