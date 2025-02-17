import path from 'path'
import { app, ipcMain, dialog, net, protocol } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import fs from 'fs'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'media-loader',
//     privileges: {
//       secure: true,
//       bypassCSP: true,
//       stream: true,
//     }
//   }
// ])

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
}

;(async () => {
  await app.whenReady()

  ipcMain.handle('dialog:openFile', handleFileOpen);

  // protocol.registerFileProtocol("media-loader", (request, callback) => {
  //   const url = request.url.replace("media-loader://", "");
  //   try {
  //     return callback(url);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

  // protocol.handle('media-loader', (request) => {
  //   let thing =  net.fetch('file://' + request.url.slice('media-loader://'.length))
  //   thing
  //   .then((t) => {
  //     console.log(t)
  //     console.log("SUCCESS BITCH")
  //   })
  //   .catch((t) => {
  //     console.log(t)
  //   })
  //   return thing;
  // });
  // console.log("FUCK YOU")

  const win = createWindow('main', {
    width: 1280,
    height: 760,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await win.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await win.loadURL(`http://localhost:${port}/home`)
    win.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

// ipcMain.on("askToRead", (event, filePath) => {
  
// 	fs.readFile(filePath, (error, data) => {
// 		win.webContents.send("sendReadContent", data);
// 	})
// })
