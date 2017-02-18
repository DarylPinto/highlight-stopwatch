const {app, BrowserWindow, globalShortcut, dialog} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const fs = require('fs');

//User config
let config = require('./config.js')(app);

//global window object
let win;

//Main window
function createWindow(){
	win = new BrowserWindow({
		width: 400,
		height: 300
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	win.on('closed', () => win = null);
}

/*** IPC Listeners ***/
ipc.on('highlight', function(event, data){
	console.log(data.join(', '));
});

ipc.on('directory-change', function(event, data){
	let selected_folders = dialog.showOpenDialog({properties: ['openDirectory']});
	if(selected_folders === undefined) return false;

	let watch_path = selected_folders[0];
	config.set({watch_path});
	event.sender.send('directory-change', watch_path);
});

ipc.on('config-request', function(event, data){
	event.sender.send('config-reply', config);
});

/*** Main app events ***/
app.on('ready', () => {
	createWindow();
	config.load();
});

app.on('window-all-closed', () => { (process.platform !== 'darwin') ? app.quit() : null });

app.on('activate', () => { (win === null) ? createWindow() : null });