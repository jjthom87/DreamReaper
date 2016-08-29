var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Dream = sequelize.define('dream', {
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  }
});

var User = sequelize.define('user', {
  email: Sequelize.STRING
});

Dream.belongsTo(User);
User.hasMany(Dream);

sequelize.sync({
  // force: true
}).then(function() {
  console.log('Everything is synced');

  User.findById(1).then(function(user){
    user.getDreams().then(function(dreams){
      dreams.forEach(function(dream){
        console.log(dream.toJSON());
      });
    });
  });
  // User.create({
  //   email: 'jared@jared.com'
  // }).then(function(){
  //   return Dream.create({
  //     description: 'Scary'
  //   });
  // });
});