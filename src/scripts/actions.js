const ipcRenderer = window.ipc;

const getSpells = async () => {
    return new Promise((resolve, _) => {
        ipcRenderer.send('get-spells', 'all')
        ipcRenderer.on('get-spells-reply', (event, args) => {
            resolve(args)
        })
    })
}
