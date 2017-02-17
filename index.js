const {app, BrowserWindow, globalShortcut, ipcMain, dialog} = require('electron');
const path = require('path');
const url = require('url');

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

/***IPC events***/
ipcMain.on('highlight', function(event, data){
	console.log(data.join(', '));
});

ipcMain.on('directory-change', function(event, data){
	dialog.showOpenDialog({properties: ['openDirectory']});
});

/***Main app events***/
app.on('ready', () => {
	createWindow();	
});

app.on('window-all-closed', () => { (process.platform !== 'darwin') ? app.quit() : null });

app.on('activate', () => { (win === null) ? createWindow() : null });