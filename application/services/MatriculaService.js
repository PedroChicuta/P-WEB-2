const Matricula = require('../../domain/entities/Matricula');
const AppError = require('../../errors/AppError');
const MatriculaError = require('../../errors/MatriculaError');

class MatriculaService {
    /**
     * @param {MatriculaRepository} repo
     * @param {AlunoService} alunoService
     * @param {CursoService} cursoService
     */
    constructor(
        repo, 
        alunoService, 
        cursoService,
    ) { 
        this.repo = repo; 
        this.alunoService = alunoService;
        this.cursoService=cursoService;
    }

    async prepararFormulario(){
        const alunos = await this.alunoService.getAll();
        const cursosTodos = await this.cursoService.getAll();
        const cursosAtivos = cursosTodos.filter(c => c.ativo);
        
        return {
            matricula: {}, 
            alunos, 
            cursos: cursosAtivos, 
            errors: {} 
        }

    }

    async verificarMatriculaExiste(aluno_id, curso_id) {
        const todasMatriculas = await this.getAll();
        
        const temMatriculaAtiva = todasMatriculas.some((matricula)=>{
            return(
                matricula.Aluno.id === aluno_id
                && matricula.Curso.id === curso_id 
                && matricula.status === 'ativa'
            );
        });

        return temMatriculaAtiva;
    }

    async create(payload) {
        try{
            const aluno = await this.alunoService.find(payload.alunoId);
            const curso = await this.cursoService.find(payload.cursoId);
            
            if(!aluno) throw new AppError('Aluno não encontrado', 404);
            if(!curso) throw new AppError('Curso não encontrado', 404);
            
            const matriculaExiste = await this.verificarMatriculaExiste(aluno.id, curso.id);
            
            if(matriculaExiste){
                throw new AppError('Aluno já matriculado no curso selecionado',409);
            }

            const matricula = new Matricula(payload);
            return await this.repo.create(matricula);
        }
        catch(err){
            const alunos = await this.alunoService.getAll();
            const cursos = await this.cursoService.getAll();

            throw new MatriculaError(err.message, err.statusCode, { 
                alunos,
                cursos,
                errors: {matricula : err.message,}
            })
        }
    }

    async getAll(statusFiltro) {
        let matriculas = await this.repo.findAll();
        
        if(statusFiltro){
            matriculas = matriculas.filter(m => m.status === statusFiltro);
        }

        return matriculas;
    }

    async find(id) {
        return await this.repo.findById(Number(id));
    }

    async update(id, payload) {
        const atual = await this.repo.findById(Number(id));
        if (!atual) return null;
        const matricula = new Matricula({ ...atual, ...payload, id: Number(id) });
        return await this.repo.update(matricula);
    }

    async delete(id) {
        await this.repo.deleteById(Number(id));
    }
}

module.exports = MatriculaService;