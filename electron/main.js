const { app, BrowserWindow, ipcMain } = require("electron");
const { startStaticServer } = require("./statisServerHandler");
const path = require("path");
const { log, initializeLogger } = require("./log");

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 隐藏菜单栏
  mainWindow.setMenu(null);

  // 加载应用的 index.html
  let localLink;
  log.info("__dirname");
  log.info(__dirname);
  const env = __dirname.split(path.sep).indexOf("app.asar") >= 0 ? "production" : "development";
  if (env === "development") {
    localLink = "http://localhost:5532/";
  } else {
    localLink = "http://localhost:5536/";
  }
  mainWindow.loadURL(localLink);

  if (env === "development") {
    mainWindow.webContents.openDevTools();
  }

  // 当窗口关闭时触发
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  // 当用户尝试关闭窗口时，隐藏窗口而不是关闭
  mainWindow.on("close", function (event) {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });
}

// IPC通信处理程序
// 在这里添加您的自定义IPC处理器

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(async () => {
  // 初始化日志模块
  initializeLogger();

  //开启静态页面服务器
  startStaticServer();

  createWindow();
});

// 当所有窗口关闭时退出应用
app.on("window-all-closed", () => {
  // 在macOS上，除非用户使用Cmd + Q明确退出，
  // 否则保持应用程序和菜单栏活跃
  if (process.platform !== "darwin") {
    // 不要在这里直接退出应用
    // app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// IPC通信处理
ipcMain.on("send-message", (event, message) => {
  mainWindow.webContents.send("message-to-webviews", message);
});
