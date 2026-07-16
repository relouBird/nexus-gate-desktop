import { app, shell, BrowserWindow, ipcMain, session, screen, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SocketCreatePayload } from './type'
import { TunnelProcessManager } from './tunnelManager'

let mainWindow: BrowserWindow
let isQuitting = false
const tunnelManager = new TunnelProcessManager()

function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Nexus-Gate-Desktop',
    width: width - 150,
    height: height - 100,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (!mainWindow) return

  // Intercepter les en-têtes pour autoriser le chargement
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders }

    // Supprimer les protections qui bloquent l'affichage
    delete headers['x-frame-options']
    delete headers['X-Frame-Options']
    delete headers['content-security-policy'] // Optionnel, si CSP est trop restrictif

    callback({ responseHeaders: headers })
  })

  const menu = Menu.buildFromTemplate([])
  mainWindow.setMenu(menu)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Relai des events du manager vers le renderer
  tunnelManager.on('status', (serverId, status) => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed())
      mainWindow.webContents.send('tunnel:status', { serverId, status })
  })
  tunnelManager.on('log', (serverId, line) => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed())
      mainWindow.webContents.send('tunnel:log', { serverId, line })
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('tunnel:start', (_event, payload: SocketCreatePayload) => {
    console.log('Tunnel Started')
    tunnelManager.start(
      {
        serverId: payload.serverId,
        token: payload.token,
        localTarget: 'http://localhost:8080',
        url: 'ws://localhost:9006/tunnel'
      },
      app.isPackaged
    )
    return tunnelManager.status(payload.serverId)
  })

  ipcMain.on('tunnel:stop', async (_event, serverId: string) => {
    console.log('Tunnel Stopped')
    await tunnelManager.stop(serverId)
    return tunnelManager.status(serverId)
  })

  ipcMain.on('tunnel:status', (_event, serverId: string) => tunnelManager.status(serverId))
  ipcMain.on('tunnel:logs', (_event, serverId: string) => tunnelManager.logs(serverId))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', (event) => {
  if (isQuitting) return
  event.preventDefault()
  isQuitting = true
  tunnelManager.stopAll().finally(() => app.quit())
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
