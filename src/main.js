const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { join } = require("path");
const fs = require("fs");

const allowlist = [
  /\.txt$/,
  /\.json$/,
  /^[\w\- !@#$%^&(){}\[\]';+=]+[^\.\s][\w\- !@#$%^&(){}\[\]';+=]+$/, //lengthy way to say match files with plaintext allowed by windows as filenames without extentions
];

const ignorelist = [/^Rubbish/];
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const readFile = async (filepath) => {
  const workingdir = getWorkDir();
  if (fs.existsSync(join(workingdir, filepath))) {
    return fs.readFileSync(join(workingdir, filepath), "utf-8");
  } else {
    return null;
  }
};

const readDir = async (directorypath) => {
  const workingdir = getWorkDir();
  if (fs.existsSync(join(workingdir, directorypath))) {
    if (fs.statSync(join(workingdir, directorypath)).isDirectory()) {
      return fs.readdirSync(join(workingdir, directorypath)).map((file) => {
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
            isDir: fs
              .statSync(join(workingdir, directorypath, file))
              .isDirectory(),
            children: [],
          };
        }
      });
    }
  }
};

const writeFile = async (filepath, data) => {
  const workingdir = getWorkDir();
  fs.writeFileSync(join(workingdir, filepath), data, "utf-8");
};

const removeFile = async (filepath) => {
  const workingdir = getWorkDir();
  if (fs.existsSync(join(workingdir, filepath))) {
    fs.unlinkSync(join(workingdir, filepath));
  }
};

const rename = async (filepath, newfilepath, overwrite) => {
  const workingdir = getWorkDir();
  const oldexists = fs.existsSync(join(workingdir, filepath));
  const newdoesnotexist = !fs.existsSync(join(workingdir, newfilepath));
  // ensuring file exists to be renamed and that the file it will become does not
  if (oldexists && (newdoesnotexist || overwrite)) {
    fs.renameSync(join(workingdir, filepath), join(workingdir, newfilepath));
  }
};

const createDir = async (directorypath) => {
  const workingdir = getWorkDir();
  if (!fs.existsSync(join(workingdir, directorypath))) {
    fs.mkdirSync(join(workingdir, directorypath));
  }
};

const chooseWorkDir = async () => {
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory", "propmtToCreate"],
  });
  if (res.canceled === false) {
    process.env.REACT_APP_WORKING_DIRECTORY = res.filePaths[0];
  }
  return !res.canceled;
};

const getWorkDir = () => {
  return process.env.REACT_APP_WORKING_DIRECTORY;
};

ipcMain.handle("readFile", (e, filepath) => {
  return readFile(filepath);
});
ipcMain.handle("readDir", (e, directorypath) => {
  return readDir(directorypath);
});
ipcMain.on("writeFile", (e, [filepath, data]) => {
  writeFile(filepath, data);
});
ipcMain.handle("removeFile", (e, filepath) => {
  return removeFile(filepath);
});
ipcMain.handle("rename", (e, [filepath, newfilepath, overwrite]) => {
  return rename(filepath, newfilepath, overwrite);
});
ipcMain.handle("createDir", (e, directorypath) => {
  return createDir(directorypath);
});
ipcMain.handle("chooseWorkDir", (e) => {
  return chooseWorkDir();
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minHeight: 512,
    minWidth: 512,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
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
