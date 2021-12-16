const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("editorfile", {
  readfile: (workingdir, filename) =>
    ipcRenderer.invoke("readFile", [workingdir, filename]),
  readdir: (directorypath) => ipcRenderer.invoke("readDir", directorypath),
  writefile: (workingdir, filename, data) =>
    ipcRenderer.send("writeFile", [workingdir, filename, data]),
  removefile: (workingdir, filename) =>
    ipcRenderer.invoke("removeFile", [workingdir, filename]),
});
