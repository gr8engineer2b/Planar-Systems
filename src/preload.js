const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("fs", {
  readFile: (filepath) => ipcRenderer.invoke("readFile", filepath),
  readDir: (directorypath) => ipcRenderer.invoke("readDir", directorypath),
  writeFile: (filepath, data) =>
    ipcRenderer.send("writeFile", [filepath, data]),
  removeFile: (filepath) => ipcRenderer.invoke("removeFile", filepath),
  rename: (filepath, newfilepath, overwrite) =>
    ipcRenderer.invoke("rename", [filepath, newfilepath, overwrite]),
  createDir: (directorypath) => ipcRenderer.invoke("createDir", directorypath),
  readSettings: () => ipcRenderer.invoke("readSettings"),
  saveSettings: (data) => ipcRenderer.invoke("saveSettings", data),
});

contextBridge.exposeInMainWorld("workspace", {
  choose: () => ipcRenderer.invoke("chooseWorkDir"),
});
