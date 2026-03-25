const {app, BrowserWindow, Menu} = require('electron');
const menuTemplate = require('./menu');
let window;
app.on('ready', ()=>{
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    window.loadFile('index.html');

    Menu.setApplicationMenu(menuTemplate);
});
