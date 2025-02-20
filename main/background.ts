import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

// File Writing
const appPath = () => {
  switch(process.platform) {
    case 'darwin': {
      return path.join(process.env.HOME, 'Library', 'Application Support');
    }
    case 'win32': {
      return process.env.APPDATA;
    }
    case 'linux': {
      return process.env.HOME;
    }
  }
}

const writeToFile = async (fileName, data) => {
  const fullPath = path.join(appPath(), "\\", fileName);
  fs.writeFile(fullPath, data, ((err) => {
    console.log(err);
    if (err) throw err;
  }));

  console.log("Wrote file " + path.join(appPath(), "\\", fileName));
}

const loadFile = (fileName) => {
  try {
    const fullPath = path.join(appPath(), "\\", fileName);
    const data = fs.readFileSync(fullPath, 'utf-8');
    console.log("Loaded file " + fileName);
    return data;
  } catch(e) {
    console.log(e);
    return null;
  }
}

;(async () => {
  await app.whenReady();

  ipcMain.handle('loadFile', async (event, args) => {
    const data = loadFile(args.fileName);
    return data;
  });

  const win = createWindow('main', {
    width: 1280,
    height: 760,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await win.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await win.loadURL(`http://localhost:${port}/home`);
    win.webContents.openDevTools();
  }
})()

app.on('window-all-closed', () => {
  app.quit()
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
});

ipcMain.on('write_file', async(event, arg) => {
  writeToFile(arg.fileName, arg.data);
});

// ipcMain.on("askToRead", (event, filePath) => {
  
// 	fs.readFile(filePath, (error, data) => {
// 		win.webContents.send("sendReadContent", data);
// 	})
// })
