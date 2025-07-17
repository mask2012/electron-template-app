const log = require("electron-log");
// 不需要fs模块，因为实际上没有直接使用
const iconv = require("iconv-lite");

// 日志控制开关：是否写入日志
let enableFileLogging = true;

// 保存原始的文件日志处理函数
const originalFileLog = log.transports.file.log;

// 保存原始控制台方法的引用
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
};

// 重写原始的log方法，以确保支持中文显示
const originalLog = log.info;
const originalWarn = log.warn;
const originalError = log.error;
const originalDebug = log.debug;

// 配置日志
log.transports.file.level = "info"; // 设置文件日志级别
log.transports.console.level = "debug"; // 设置控制台日志级别

// 自定义日志格式
log.transports.file.format = "{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}";

// 确保日志文件使用UTF-8编码
log.transports.file.encoding = "utf8";
// 添加BOM标记可以帮助某些编辑器正确识别UTF-8
log.transports.file.writeOptions = {
  encoding: "utf8",
  mode: 0o666,
  flag: "a",
  // 添加BOM标记
  withBOM: true,
};

// 切换文件日志记录状态的函数
function toggleFileLogging(enable) {
  // 更新状态
  enableFileLogging = enable;

  if (enableFileLogging) {
    // 恢复原始的文件日志处理函数
    log.transports.file.log = originalFileLog;
    // 日志启用时可以写入日志
    originalLog.apply(log, ["文件日志记录已启用"]);
  } else {
    // 禁用文件日志记录
    log.transports.file.log = () => {};
    // 日志已禁用，使用控制台输出而不写入日志文件
    console.log("文件日志记录已禁用（仅输出到控制台）");
  }

  return enableFileLogging;
}

// 获取日志文件路径
function getLogFilePath() {
  return log.transports.file.getFile().path;
}

// 重写log.info方法
log.info = function (...args) {
  // 只有在enableFileLogging为true时才调用原始方法写入文件
  if (enableFileLogging) {
    originalLog.apply(log, args);
  }

  // 然后处理控制台输出
  if (process.platform === "win32") {
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    // 转换为GBK编码并输出到控制台
    try {
      const gbkBuffer = iconv.encode("[INFO] " + output, "gbk");
      process.stdout.write(gbkBuffer);
      process.stdout.write("\n");
    } catch (error) {
      console.error("日志输出错误:", error);
    }
  }
};

// 重写log.warn方法
log.warn = function (...args) {
  // 只有在enableFileLogging为true时才调用原始方法写入文件
  if (enableFileLogging) {
    originalWarn.apply(log, args);
  }

  // 然后处理控制台输出
  if (process.platform === "win32") {
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    // 转换为GBK编码并输出到控制台
    try {
      const gbkBuffer = iconv.encode("[WARN] " + output, "gbk");
      process.stdout.write(gbkBuffer);
      process.stdout.write("\n");
    } catch (error) {
      console.error("日志输出错误:", error);
    }
  }
};

// 重写log.error方法
log.error = function (...args) {
  // 只有在enableFileLogging为true时才调用原始方法写入文件
  if (enableFileLogging) {
    originalError.apply(log, args);
  }

  // 然后处理控制台输出
  if (process.platform === "win32") {
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    // 转换为GBK编码并输出到控制台
    try {
      const gbkBuffer = iconv.encode("[ERROR] " + output, "gbk");
      process.stderr.write(gbkBuffer);
      process.stderr.write("\n");
    } catch (error) {
      console.error("日志输出错误:", error);
    }
  }
};

// 重写log.debug方法
log.debug = function (...args) {
  // 只有在enableFileLogging为true时才调用原始方法写入文件
  if (enableFileLogging) {
    originalDebug.apply(log, args);
  }

  // 然后处理控制台输出
  if (process.platform === "win32" && log.transports.console.level === "debug") {
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    // 转换为GBK编码并输出到控制台
    try {
      const gbkBuffer = iconv.encode("[DEBUG] " + output, "gbk");
      process.stdout.write(gbkBuffer);
      process.stdout.write("\n");
    } catch (error) {
      console.error("日志输出错误:", error);
    }
  }
};

// 修复文件日志中的中文编码问题
const originalFileWriteText = log.transports.file.writeText;
log.transports.file.writeText = (message) => {
  try {
    // 确保是UTF-8编码，防止乱码
    if (Buffer.isBuffer(message)) {
      message = message.toString("utf8");
    }
    return originalFileWriteText.call(log.transports.file, message);
  } catch (error) {
    console.error("日志写入出错:", error);
    return originalFileWriteText.call(log.transports.file, message);
  }
};

// 关闭electron-log默认的控制台输出，避免双重输出
log.transports.console = {
  level: log.transports.console.level,
  format: log.transports.console.format,
  // 空实现，因为已经手动处理了控制台输出
  log: () => {},
};

// 自定义控制台写入函数以处理Windows下中文乱码问题
if (process.platform === "win32") {
  // 替换所有控制台输出方法 - 但不做log记录，避免重复
  console.log = function (...args) {
    // 不再调用log.info，避免重复输出
    // 处理终端输出
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    // 转换为GBK编码并输出
    try {
      const gbkBuffer = iconv.encode(output, "gbk");
      process.stdout.write(gbkBuffer);
      process.stdout.write("\n");
    } catch (error) {
      // 如果转换失败，使用原始方法
      originalConsole.log(...args);
    }
  };

  // 控制台错误消息
  console.error = function (...args) {
    // 不再调用log.error，避免重复输出
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    try {
      const gbkBuffer = iconv.encode("[ERROR] " + output, "gbk");
      process.stderr.write(gbkBuffer);
      process.stderr.write("\n");
    } catch (error) {
      originalConsole.error(...args);
    }
  };

  // 控制台警告消息
  console.warn = function (...args) {
    // 不再调用log.warn，避免重复输出
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    try {
      const gbkBuffer = iconv.encode("[WARN] " + output, "gbk");
      process.stdout.write(gbkBuffer);
      process.stdout.write("\n");
    } catch (error) {
      originalConsole.warn(...args);
    }
  };

  // 控制台信息消息
  console.info = function (...args) {
    // 不再调用log.info，避免重复输出
    let output = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      output += (i > 0 ? " " : "") + (typeof arg === "string" ? arg : JSON.stringify(arg));
    }

    try {
      const gbkBuffer = iconv.encode("[INFO] " + output, "gbk");
      process.stdout.write(gbkBuffer);
      process.stdout.write("\n");
    } catch (error) {
      originalConsole.info(...args);
    }
  };

  // 也替换electron-log的控制台输出
  log.transports.console = {
    level: log.transports.console.level,
    format: log.transports.console.format,
    // 修改为自定义实现，支持中文输出
    log: (message) => {
      try {
        // 提取日志级别和文本
        const level = message.level;
        let text = "";

        // 确保message.data是数组
        if (Array.isArray(message.data)) {
          text = message.data.map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item))).join(" ");
        } else {
          text = String(message.data || "");
        }

        // 根据日志级别添加前缀
        let prefix = "";
        if (level === "error") prefix = "[ERROR] ";
        else if (level === "warn") prefix = "[WARN] ";
        else if (level === "info") prefix = "[INFO] ";
        else if (level === "verbose") prefix = "[VERBOSE] ";
        else if (level === "debug") prefix = "[DEBUG] ";
        else if (level === "silly") prefix = "[SILLY] ";

        // 转换为GBK编码并输出
        const gbkBuffer = iconv.encode(prefix + text, "gbk");
        if (level === "error") {
          process.stderr.write(gbkBuffer);
          process.stderr.write("\n");
        } else {
          process.stdout.write(gbkBuffer);
          process.stdout.write("\n");
        }

        // 打印调试消息以验证log方法被调用
        process.stdout.write(iconv.encode(`日志被处理: ${level} - ${text.substring(0, 20)}...`, "gbk"));
        process.stdout.write("\n");
      } catch (error) {
        // 如果转换失败，使用原始方法记录错误
        originalConsole.error("日志输出错误:", error);
      }
    },
  };
}

// 覆盖console.log，解决终端输出中文乱码问题
const originalConsoleLog = console.log;
console.log = function () {
  // 使用electron-log记录到文件（只有在enableFileLogging为true时）
  if (enableFileLogging) {
    log.info(...arguments);
  }

  // 在Windows平台上处理编码问题
  if (process.platform === "win32") {
    for (let i = 0; i < arguments.length; i++) {
      let message = arguments[i];
      if (typeof message === "string") {
        const gbkBuffer = iconv.encode(message, "gbk");
        process.stdout.write(gbkBuffer);
        if (i < arguments.length - 1) {
          process.stdout.write(" ");
        }
      } else {
        process.stdout.write(String(message));
        if (i < arguments.length - 1) {
          process.stdout.write(" ");
        }
      }
    }
    process.stdout.write("\n");
  } else {
    // 其他平台使用原始console.log
    originalConsoleLog.apply(console, arguments);
  }
};

// 初始化日志并输出日志的位置信息
function initializeLogger() {
  // 获取命令行参数
  const args = process.argv.slice(1);

  // 根据命令行参数设置日志行为
  if (args.includes("--no-file-log")) {
    toggleFileLogging(false);
    log.info("通过命令行参数禁用了文件日志记录");
  } else {
    // 默认启用文件日志
    toggleFileLogging(enableFileLogging);
  }

  // 打印日志路径便于查找
  if (enableFileLogging) {
    log.info("日志文件位置:", log.transports.file.getFile().path);
  } else {
    log.info("文件日志当前已禁用，日志仅输出到控制台");
  }

  log.debug("调试信息：这条消息只有在日志级别设为debug时才会显示");

  return log;
}

module.exports = {
  log,
  toggleFileLogging,
  getLogFilePath,
  initializeLogger,
  enableFileLogging,
};
