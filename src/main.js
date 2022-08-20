const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const crypto = require("crypto");
const { join } = require("path");
const fs = require("fs");

const allowlist = [
  /\.dmd$/,
  /\.json$/,
  /^[\w\- !@#$%^&(){}\[\]';+=]+[^\.\s][\w\- !@#$%^&(){}\[\]';+=]+$/, //lengthy way to say match files with plaintext allowed by windows as filenames without extentions
];

const ignorelist = [/^Rubbish/, /^settings\.cfg$/];
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const readSettings = () => {
  let userDataPath = app.getPath("userData");
  if (!fs.existsSync(join(userDataPath, "settings.cfg"))) {
    fs.writeFileSync(join(userDataPath, "settings.cfg"), JSON.stringify({}));
  }
  return fs.readFileSync(join(userDataPath, "settings.cfg"), "utf-8");
};

const saveSettings = async (data) => {
  let userDataPath = app.getPath("userData");
  fs.writeFileSync(join(userDataPath, "settings.cfg"), data, "utf-8");
};

const readFile = async (filepath) => {
  if (fs.existsSync(join(process.env.REACT_APP_WORKING_DIRECTORY, filepath))) {
    return fs.readFileSync(
      join(process.env.REACT_APP_WORKING_DIRECTORY, filepath),
      "utf-8"
    );
  } else {
    return null;
  }
};

const readDir = async (directorypath) => {
  if (
    fs.existsSync(join(process.env.REACT_APP_WORKING_DIRECTORY, directorypath))
  ) {
    if (
      fs
        .statSync(join(process.env.REACT_APP_WORKING_DIRECTORY, directorypath))
        .isDirectory()
    ) {
      return fs
        .readdirSync(
          join(process.env.REACT_APP_WORKING_DIRECTORY, directorypath)
        )
        .map((file) => {
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
                .statSync(
                  join(
                    process.env.REACT_APP_WORKING_DIRECTORY,
                    directorypath,
                    file
                  )
                )
                .isDirectory(),
              children: [],
            };
          }
        });
    }
  }
};

const writeFile = async (filepath, data) => {
  fs.writeFileSync(
    join(process.env.REACT_APP_WORKING_DIRECTORY, filepath),
    data,
    "utf-8"
  );
};

const removeFile = async (filepath) => {
  if (fs.existsSync(join(process.env.REACT_APP_WORKING_DIRECTORY, filepath))) {
    fs.unlinkSync(join(process.env.REACT_APP_WORKING_DIRECTORY, filepath));
  }
};

const rename = async (filepath, newfilepath, overwrite) => {
  const oldexists = fs.existsSync(
    join(process.env.REACT_APP_WORKING_DIRECTORY, filepath)
  );
  const newdoesnotexist = !fs.existsSync(
    join(process.env.REACT_APP_WORKING_DIRECTORY, newfilepath)
  );
  // ensuring file exists to be renamed and that the file it will become does not
  if (oldexists && (newdoesnotexist || overwrite)) {
    fs.renameSync(
      join(process.env.REACT_APP_WORKING_DIRECTORY, filepath),
      join(process.env.REACT_APP_WORKING_DIRECTORY, newfilepath)
    );
  }
};

const createDir = async (directorypath) => {
  if (
    !fs.existsSync(join(process.env.REACT_APP_WORKING_DIRECTORY, directorypath))
  ) {
    fs.mkdirSync(join(process.env.REACT_APP_WORKING_DIRECTORY, directorypath));
  }
};

const chooseWorkDir = async () => {
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory"],
  });
  if (res.canceled === false) {
    setWorkDir(res.filePaths[0]);
  }
  return [!res.canceled, res.filePaths[0]];
};

const setWorkDir = async (directorypath) => {
  if (fs.existsSync(join(directorypath))) {
    process.env.REACT_APP_WORKING_DIRECTORY = directorypath;
  }
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
ipcMain.handle("setWorkDir", (e, directorypath) => {
  return setWorkDir(directorypath);
});
ipcMain.handle("readSettings", (e) => {
  return readSettings();
});
ipcMain.handle("saveSettings", (e, data) => {
  return saveSettings(data);
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

nonce = crypto.randomBytes(16).toString("base64");

if (process.defaultApp) {
  scriptval = "'unsafe-eval'";
  styleval = "'unsafe-inline'";
} else {
  scriptval = `'nonce-${nonce}'`;
  styleval = `'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-81cVITyjUgT4d5du04QDijucqQ23bP6rflqY6DZs+Rs=' 'sha256-lTNfXrIKCFTK3ALy9loqQ1Orh2If5/OBGelnPprU1e4=' 'sha256-55vlWI+xuVB9s+++Qot4CTKACLskAG81O+sz4wsxjl4='`;
}

contentPolicy = `default-src 'self'; style-src 'self' ${styleval} http://localhost/ https://fonts.googleapis.com/; script-src ${scriptval} 'self'; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; base-uri 'none'; form-action 'self'; img-src https: data:`;

// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  // App must be ready before manipulating session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [contentPolicy],
      },
    });
  });
});

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
