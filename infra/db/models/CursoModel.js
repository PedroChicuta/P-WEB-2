const { DataTypes } = require('sequelize');

function defineCursoModel(sequelize) {
    const CursoModel = sequelize.define('Cursos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        cargaHoraria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate : {
                min:1,
            }
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true 
        },
    });

    return CursoModel;
}

module.exports = { defineCursoModel };
