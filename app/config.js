const path = require('path');
const fs = require('fs');

module.exports = function(app){
	let config_file = path.join(app.getPath('userData'), 'config.cfg');
	let config = {};

	config.set = function(settings){
		Object.assign(this, settings);
		fs.writeFile(config_file, JSON.stringify(this), err => {if(err) throw err;});
		return this;
	},

	config.load = function(){
		if(!fs.existsSync(config_file)) return false;
		try{
			Object.assign(this, JSON.parse(fs.readFileSync(config_file)));	
		}catch(err){}
		return this;
	}

	return config;
};