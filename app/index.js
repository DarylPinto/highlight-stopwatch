const {app, BrowserWindow, globalShortcut, dialog} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const fs = require('fs');
const saveHighlights = require('./save-highlights.js');

//User config
let config = require('./config.js')(app);

//global window object
let win;

//Main window
function createWindow(){
	win = new BrowserWindow({
		title: 'Highlight Stopwatch',
		height: 250,
		width: 385,
		resizable: false,
		maximizable: false,
		icon: path.join(__dirname, 'resources/icon.ico'),
		autoHideMenuBar: true
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	win.on('closed', () => win = null);
}

/*** IPC Listeners ***/
ipc.on('save-highlights', function(event, data){
	saveHighlights(config.watch_path, data);
});

ipc.on('watch-path-change', function(event, data){
	let selected_folders = dialog.showOpenDialog({properties: ['openDirectory']});
	if(selected_folders === undefined) return false;

	let watch_path = selected_folders[0];
	config.set({watch_path});
	event.sender.send('watch-path-change', watch_path);
});

ipc.on('config-request', function(event, data){
	event.sender.send('config-reply', config);
});

/*** Main app events ***/
app.on('ready', () => {
	config.load();
	if(!fs.existsSync(config.watch_path)) config.set({watch_path: null});

	createWindow();
	
	globalShortcut.register('Shift+PageUp', () => {
    win.webContents.send('keyboard-shortcut', 'toggleTimer');
  });

  globalShortcut.register('PageDown', () => {
    win.webContents.send('keyboard-shortcut', 'highlight');
  });

});

app.on('window-all-closed', () => { (process.platform !== 'darwin') ? app.quit() : null });

app.on('activate', () => { (win === null) ? createWindow() : null });