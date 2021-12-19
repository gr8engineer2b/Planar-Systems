const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("fs", {
  readFile: (workingdir, filename) =>
    ipcRenderer.invoke("readFile", [workingdir, filename]),
  readDir: (dirpath) => ipcRenderer.invoke("readDir", dirpath),
  writeFile: (workingdir, filename, data) =>
    ipcRenderer.send("writeFile", [workingdir, filename, data]),
  removeFile: (workingdir, filename) =>
    ipcRenderer.invoke("removeFile", [workingdir, filename]),
  createDir: (dir) => ipcRenderer.invoke("createDir", dir),
});

contextBridge.exposeInMainWorld("workspace", {
  choose: () => ipcRenderer.invoke("chooseWorkDir"),
  get: () => ipcRenderer.invoke("getWorkDir"),
});
