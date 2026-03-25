const { app, Menu, shell, ipcMain, BrowserWindow, dialog }= require('electron');
const fs= require('fs');


const template= [
    {
        label: 'File',
        submenu:[
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click(){
                    const window = BrowserWindow.getFocusedWindow();
                    if(window){
                        dialog.showOpenDialog(window,{
                            properties: ['openFile'],
                            filters: [{name: 'Markdown', extensions: ['md', 'markdown', 'txt']}]
                        }).then(result =>{
                            if(!result.canceled && result.filePaths.length > 0){
                                const content=fs.readFileSync(result.filePaths[0], 'utf-8');
                                window.webContents.send('load-content', content);
                            }
                        });
                    }
                }
            }
        ]
    },
    {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click(){
            const window= BrowserWindow.getFocusedWindow();
            if(window){
                window.webContents.send('get-content');
            }
        }
    },
    {
        label: 'Format',
        submenu:[
            {
                label: 'Toggle Bold',
                click(){
                    const window= BrowserWindow.getFocusedWindow();
                    if(window) window.webContents.send(
                        'editor-event',
                        'toggle-bold'
                    );
                }
            }
        ]
    },
    {
        label: 'Toggle Italic',
        click(){
            const window = BrowserWindow.getFocusedWindow();
            if(window) window.webContents.send('editor-event', 'toggle-italic');
        }
    },
    {
        label: 'Toggle Strikethrough',
        click(){
            const window= BrowserWindow.getFocusedWindow();
            if (window) window.webContents.send('editor-event', 'toggle-strikethrough');
        }
    },

    {
    role: 'help', 
    submenu: [
        {
            label: 'About Editor Component',
            click(){
                shell.openExternal('https://simplemde.com/');
            }
        }        
    ]
    }
];

if (process.env.DEBUG){
        template.push({
            label:'Debugging',
            submenu: [
                {
                    label: 'Dev Tools',
                    role: 'toggleDevTools'
                },
                { type:'separator'},
                {
                    role: 'reload',
                    accelerator: 'Alt+R'
                }
            ]
        });
    }


if(process.platform==='darwin'){
    template.unshift({
        label: app.getName(), 
        submenu: [
            {role : 'about'},
            { type: 'separator'},
            {role: 'quit'}
        ]
    })
};
const menu = Menu.buildFromTemplate(template);
module.exports= menu;

ipcMain.on('editor-reply', (event,arg)=>{
    console.log(`Received reply from web page: ${arg}`);
});

ipcMain.on('save-content', (event, content)=>{
    const window= BrowserWindow.getFocusedWindow();
    if(window){
        dialog.showSaveDialog(window, {
            title: 'Save Markdown',
            defaultPath: 'untitled.md',
            filters: [{name: 'Markdown', extensions: ['md', 'markdown', 'txt']}]
        }).then(result =>{
            if(!result.canceled && result.filePath){
                fs.writeFileSync(result.filePath, content);
                console.log('File successfully saved!');
            }
        })
    }
})