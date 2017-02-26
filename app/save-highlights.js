const fs = require('fs');
const path = require('path');

module.exports = function(folder, highlight_data){

	//stop if watch path doesn't exist
	if(!fs.existsSync(folder)) return false;

	//Get paths of watch_path contents
	let dir_contents = fs.readdirSync(folder).map(name => {
		return {
			name: name,
			path: path.join(folder, name)
		}
	});

	//Get list of files (not directories or .txt files) and their relevant stats
	let files = dir_contents.filter(file_or_folder => {
		let stats = fs.statSync(file_or_folder.path);

		file_or_folder.is_file = stats.isFile();
		file_or_folder.creation_time = stats.birthtime.getTime();

		return file_or_folder.is_file && !file_or_folder.name.endsWith('.txt');
	});

	let newest_file;
	
	//Get most recently created file
	if(files.length > 0){
		newest_file = files.find((file, index, array) => {
			return file.creation_time === Math.max(...array.map(f => f.creation_time));
		});
	}
	//if watch_dir is empty, use a blank name
	else{
		newest_file = {name: ''};
	}

	let highlight_filename = newest_file.name.substr(0, newest_file.name.lastIndexOf('.')) + '_highlights.txt';

	fs.writeFile(path.join(folder, highlight_filename), highlight_data.join('\r\n'), err => {if(err) throw err});

}