const { DataTypes } = require('sequelize');

function defineAlunoModel(sequelize) {
    const AlunoModel = sequelize.define('Alunos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        matricula: {
            type: DataTypes.STRING(8),
            allowNull: false,
            validate: {
                isNumeric: true,  
                len: [8, 8]       
            }
        },
    });

    return AlunoModel;
}

module.exports = { defineAlunoModel };
