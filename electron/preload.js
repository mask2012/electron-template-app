const { ipcRenderer } = require("electron");
const path = require("path");
const packageJson = require(path.join(__dirname, "..", "package.json"));

// 将IPC渲染器暴露给渲染进程
window.ipcRenderer = ipcRenderer;

// 暴露版本号和环境变量
window.VERSION = packageJson.version;
window.ENV = packageJson.env;

// 基础的Electron API接口
window.electronAPI = {
  // 在这里添加您需要的自定义API
};
