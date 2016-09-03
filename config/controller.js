var models = require('../models');
models.sequelize.sync();

var user = require('../models').user;
var dream = require('../models').dream;

var userExperience = {
	UserProfile: function(id, cb){
		user.findOne({ where {id: id}}).then(function(success){
			cb(success);
		})
	},
	AddDreams: function(dream, id, logger, cb){
		user.findOne({ where {id: id}}).then(function(){
			dream.create({
				description: dream
			}).then(function(dream){
				logger.addDream(dream).then(function(success){
					cb(success);
				})
			})
		})
	}
};

module.exports['controllers'] = userExperience;