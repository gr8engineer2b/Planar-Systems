const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const readFile = async (filename = "default") => {
  return fs.existsSync(join(`${app.getPath("userData")}`, filename))
    ? fs.readFileSync(join(`${app.getPath("userData")}`, filename), "utf-8")
    : "";
};

const writeFile = async (filename, data) => {
  fs.writeFileSync(join(`${app.getPath("userData")}`, filename), data, "utf-8");
};

ipcMain.handle("readFile", (e, filename) => {
  return readFile(filename);
});

ipcMain.on("writeFile", (e, [filename, data]) => {
  writeFile(filename, data);
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  // load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // automatically open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
