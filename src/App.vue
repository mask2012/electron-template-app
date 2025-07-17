<template>
  <div id="app">
    <div class="main-container">
      <div class="header">
        <h1>Electron Vue 应用模板</h1>
        <p>您的应用内容从这里开始</p>
      </div>

      <div class="content">
        <!-- 在这里添加您的应用内容 -->
        <div class="welcome-card">
          <h2>欢迎使用 Electron Vue 模板</h2>
          <p>应用版本: {{ VERSION || "Unknown" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      VERSION: window.VERSION || process.env.VERSION,
    };
  },
  methods: {
    // 在这里添加您的方法
    setDocumentTitle() {
      document.title = "Electron Vue 应用" + (this.VERSION ? " v" + this.VERSION : "");
    },
  },
  mounted() {
    // 设置文档标题
    this.setDocumentTitle();

    // 在这里添加您的初始化逻辑
  },
  beforeDestroy() {
    // 在这里添加清理逻辑
  },
};
</script>

<style lang="less" scoped>
// 颜色变量
@primary-color: #4a90e2;
@primary-hover: #357abd;
@text-color: #333;
@text-secondary: #666;
@background-light: #f5f5f5;
@border-color: #e8e8e8;

#app {
  padding: 20px;
  height: 100vh;
  background: @background-light;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 60px;
}

.header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    color: @text-color;
    margin-bottom: 10px;
    font-weight: 600;
  }

  p {
    font-size: 16px;
    color: @text-secondary;
  }
}

.content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  min-height: 400px;
}

.welcome-card {
  text-align: center;
  padding: 40px;

  h2 {
    font-size: 24px;
    color: @primary-color;
    margin-bottom: 20px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    color: @text-secondary;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 通用按钮样式
.btn-primary {
  background: linear-gradient(135deg, @primary-color 0%, @primary-hover 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(74, 144, 226, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.btn-secondary {
  background: white;
  border: 1px solid @border-color;
  color: @text-color;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
    background: rgba(74, 144, 226, 0.05);
  }

  &:active {
    background: rgba(74, 144, 226, 0.1);
  }
}
</style>

<style lang="less">
body,
html {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
}
</style>
