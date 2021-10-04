const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on("closed", () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "ADD NEW TODO",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  /*jab hum addwindow ko close krenge to vo object ko null bhi kr de
   jissike vo jab band ho too usse js garbage manke collect kr le */
  addWindow.on("closed", () => (addWindow = null));
};

let menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New ToDo",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Delete ToDo",
        click() {
          deleteTodo();
        },
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "command+q" : "ctrl+q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

ipcMain.on("todo:add", (event, todo) => {
  mainWindow.webContents.send("todo:add", todo);
  addWindow.close();
});

if (process.platform === "darwin") {
  menuTemplate = [{ label: "" }, ...menuTemplate];
  /* console.log(menuTemplate); */
}

//ADD DEVELOPER TOOL AS JAB HUMNE MENU BANAYA TO VO OVERRIDE HO GYA
/* production
developemtn
staging
test */
if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload", //shortcut to add reload property to code
      },
      {
        label: "Toggle Developer Tool",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator:
          process.platform === "darwin" ? "command+alt+i" : "ctrl+shift+i",
      },
    ],
  });
}
