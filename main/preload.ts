import { contextBridge } from 'electron'
const {ipcRenderer} = eval('require(\'electron\')');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: (channel, args) => {
    return ipcRenderer.invoke('loadFile', args);
  },
  selectMediaDir: (channel, args) => {
    return ipcRenderer.invoke('selectMediaDir', args);
  },
  selectMediaFile: (channel, args) => {
    return ipcRenderer.invoke('selectMediaFile', args);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  }
});
