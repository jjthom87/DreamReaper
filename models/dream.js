module.exports = function(sequelize, DataTypes){
	return sequelize.define('dream', {
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}
	});
};