const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { join } = require("path");
const fs = require("fs");

const allowlist = [
  /\.txt$/,
  /\.json$/,
  /^[\w\- !@#$%^&(){}\[\]';+=]+[^\.\s][\w\- !@#$%^&(){}\[\]';+=]+$/, //lengthy way to say match files with plaintext allowed by windows as filenames without extentions
];

const ignorelist = [/^Rubbish/];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const readFile = async (workingdir, filepath) => {
  if (fs.existsSync(join(workingdir))) {
    if (fs.existsSync(join(workingdir, filepath))) {
      return fs.readFileSync(join(workingdir, filepath), "utf-8");
    } else {
      return null;
    }
  }
};

const readDir = async (directorypath) => {
  if (fs.existsSync(join(directorypath))) {
    if (fs.statSync(join(directorypath)).isDirectory()) {
      return fs.readdirSync(join(directorypath)).map((file) => {
        if (
          allowlist
            .map((exp) => {
              return exp.test(file);
            })
            .includes(true) &&
          !ignorelist
            .map((exp) => {
              return exp.test(file);
            })
            .includes(true)
        ) {
          return {
            name: file,
            isDir: fs.statSync(join(directorypath, file)).isDirectory(),
            children: [],
          };
        }
      });
    }
  }
};

const writeFile = async (workingdir, filepath, data) => {
  fs.writeFileSync(join(workingdir, filepath), data, "utf-8");
};

const removeFile = async (workingdir, filepath) => {
  if (fs.existsSync(join(workingdir, filepath))) {
    fs.unlinkSync(join(workingdir, filepath));
  }
};

const createDir = async (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const chooseWorkDir = async () => {
  const res = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory", "propmtToCreate"],
  });
  if (res.canceled === false) {
    process.env.REACT_APP_WORKING_DIRECTORY = res.filePaths[0];
  }
  return process.env.REACT_APP_WORKING_DIRECTORY;
};

const getWorkDir = () => {
  return process.env.REACT_APP_WORKING_DIRECTORY;
};

ipcMain.handle("readFile", (e, [workingdir, filepath]) => {
  return readFile(workingdir, filepath);
});

ipcMain.handle("readDir", (e, directorypath) => {
  return readDir(directorypath);
});

ipcMain.on("writeFile", (e, [workingdir, filepath, data]) => {
  writeFile(workingdir, filepath, data);
});

ipcMain.handle("removeFile", (e, [workingdir, filepath]) => {
  return removeFile(workingdir, filepath);
});

ipcMain.handle("createDir", (e, dir) => {
  return createDir(dir);
});

ipcMain.handle("chooseWorkDir", (e) => {
  return chooseWorkDir();
});

ipcMain.handle("getWorkDir", (e) => {
  return getWorkDir();
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minHeight: 512,
    minWidth: 512,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  // load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.REACT_APP_WORKING_DIRECTORY === undefined) {
    chooseWorkDir();
  }

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
