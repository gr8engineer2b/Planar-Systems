const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("editorfile", {
  read: (filename) => ipcRenderer.invoke("readFile", filename),
  write: (filename, data) => ipcRenderer.send("writeFile", [filename, data]),
});
