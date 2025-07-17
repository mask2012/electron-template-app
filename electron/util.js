//从command中获取参数
function getCommandLineArgValue(argv, argName) {
  const filteredArgs = argv.filter((arg) => arg.startsWith("--"));
  for (let i = 0; i < filteredArgs.length; i++) {
    const arg = filteredArgs[i].substring(2); // 去除 "--" 前缀
    if (arg.startsWith(argName + "=")) {
      return arg.split("=")[1];
    }
  }
  return undefined;
}

function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}

module.exports = {
  getCommandLineArgValue,
  sleep,
};
