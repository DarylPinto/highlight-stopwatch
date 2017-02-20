//Place this file in the electron-packager output
//directory and run it after packing to change the .exe info

const rcedit = require('rcedit');
const path = require('path');

let exePath = path.join(__dirname, 'Highlight-Stopwatch.exe');

let options = {
	icon: path.join(__dirname, 'resources/app/resources/icon.ico'),
	'version-string': {
		FileDescription: 'Highlight Stopwatch',
		FileVersion: '1.0.0',
		ProductVersion: '1.0.0',
		InternalName: 'Highlight-Stopwatch',
		ProductName: 'Highlight Stopwatch',
		OriginalFilename: 'Highlight Stopwatch.exe',
		LegalCopyright: 'Copyright (C) 2016 Daryl Pinto'
	}
}

rcedit(exePath, options, () => console.log('Done!'));