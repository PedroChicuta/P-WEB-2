const { DataTypes } = require('sequelize');

function defineMatriculaModel(sequelize) {
    const MatriculaModel = sequelize.define('Matriculas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cursoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Cursos', key: 'id' }
        },
        alunoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Alunos', key: 'id' }
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ativa' // ativa, trancada, concluída
        }
    });

    return MatriculaModel;
}

module.exports = { defineMatriculaModel };