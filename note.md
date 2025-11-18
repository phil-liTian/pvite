NOTE

### pnpm create 会自动下载对应的 create-xxx 包并执行它来设置项目结构

### import.meta.url 获取当前执行代码的路径

### process.cwd() 返回的是用户运行这个 create-vite 命令时的当前目录路径

### process.env.npm_config_user_agent 获取 npm 信息

### fs.readdirSync(templateDir); 读取当前文件夹中的文件

### fs.copyFileSync(src, dest);

同步复制文件 这是一个阻塞操作，会等待复制完成后才继续执行后续代码 如果目标文件已存在，它会被覆盖

### fs.statSync(src)

包含文件/目录的详细信息（大小、创建时间、修改时间等）

### fs.mkdirSync(destDir, { recursive: true });

创建文件夹, recursive 递归创建

### process.stdin.isTTY - 这是一个 Node.js 属性，用于检测当前是否在终端（TTY）环境中运行

#### 如果是在终端中运行（如命令行），isTTY 为 true，使用交互式模式

#### 如果是在非终端环境（如 CI/CD 管道、脚本重定向等），isTTY 为 false，使用非交互式模式

### vite

```json
{
  "bin": {
    "pvite": "bin/pvite.js"
  }
}
```

将包中的脚本或可执行文件注册为命令行命令，方便用户通过终端直接调用，无需手动指定脚本路径。这是开发命令行工具（CLI）的关键配置。
