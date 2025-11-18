import * as prompts from "@clack/prompts";
import mri from "mri";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import colors from "picocolors";

const {
  blue,
  blueBright,
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  reset,
  yellow,
} = colors;

const defaultTargetDir = "pvite-project";
const cwd = process.cwd();

const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);

const cancel = () => prompts.cancel("Operation cancelled");

type ColorFunc = (str: string | number) => string;
type Framework = {
  name: string;
  display: string;
  color: ColorFunc;
  variants: FrameworkVariant[];
};

type FrameworkVariant = {
  name: string;
  display: string;
  color: ColorFunc;
  customCommand?: string;
};

const FRAMEWORKS: Framework[] = [
  {
    name: "vue",
    display: "Vue",
    color: green,
    variants: [
      {
        name: "vue-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
  {
    name: "react",
    display: "React",
    color: cyan,
    variants: [
      {
        name: "react-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
];

const TEMPLATES = FRAMEWORKS.map((f) => f.variants.map((v) => v.name)).reduce(
  (a, b) => a.concat(b),
  []
);
console.log("TEMPLATES", TEMPLATES);

const argv = mri(process.argv.slice(2), {
  // alias: { h: "help", t: "template", i: "immdiate" },
});

console.log("process.stdin.isTTY", process.stdin.isTTY);

async function init() {
  const argTargetDir = argv._[0] ? formatTargetDir(argv._[0]) : undefined;
  const argTemplate = argv.template;
  const argImmediate = argv.immediate;
  const argInteractive = argv.interactive;
  const interactive = argInteractive ?? process.stdin.isTTY;

  let targetDir = argTargetDir;
  if (!targetDir) {
    if (interactive) {
      const projectName = await prompts.text({
        message: "Project name:",
        defaultValue: defaultTargetDir,
        placeholder: defaultTargetDir,
        validate: (value) => {
          return value.length === 0 || formatTargetDir(value).length > 0
            ? undefined
            : "Invalid project name";
        },
      });

      if (prompts.isCancel(projectName)) return cancel();
      targetDir = formatTargetDir(projectName);
    } else {
      targetDir = defaultTargetDir;
    }
  }

  let packageName = path.basename(path.resolve(targetDir));
  console.log("packageName", packageName);

  // 选择模板
  let template = argTemplate;
  let hasInvalidArgTemplate = false;
  if (argTemplate && !TEMPLATES.includes(argTemplate)) {
    template = undefined;
    hasInvalidArgTemplate = true;
  }
  if (!template) {
    if (interactive) {
      const framework = await prompts.select({
        message: hasInvalidArgTemplate
          ? `当前的template:【${argTemplate}】是无效的，请重新选择：`
          : "选择使用的框架:",
        options: FRAMEWORKS.map((framework) => {
          const frameworkColor = framework.color;
          return {
            label: frameworkColor(framework.display || framework.name),
            value: framework,
          };
        }),
      });

      if (prompts.isCancel(framework)) return cancel();

      const variant = await prompts.select({
        message: "选择使用的语言:",
        options: framework.variants.map((variant) => {
          const variantColor = variant.color;
          return {
            label: variantColor(variant.display || variant.name),
            value: variant.name,
          };
        }),
      });

      if (prompts.isCancel(variant)) return cancel();

      template = variant;
    } else {
      template = "vanilla-ts";
    }
  }

  // rolldown
  const rolldownViteValue = await prompts.select({
    message: "选择是否使用rolldown:",
    options: [
      {
        label: "是",
        value: true,
      },
      {
        label: "否",
        value: false,
      },
    ],
    initialValue: false,
  });

  if (prompts.isCancel(rolldownViteValue)) return cancel();

  const pkgManager = pkgInfo ? pkgInfo.name : "npm";

  let immediate = argImmediate;

  if (immediate === undefined) {
    const immediateResult = await prompts.confirm({
      message: `Install with ${pkgManager} and start now?`,
    });
    if (prompts.isCancel(immediateResult)) return cancel();

    immediate = immediateResult;
  }

  const root = path.join(cwd, targetDir);
  // 允许一次性创建多级嵌套目录结构，即使父目录不存在也会自动创建。
  fs.mkdirSync(root, { recursive: true });

  prompts.log.step(`Scaffolding project in ${root}...`);
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template-${template}`
  );

  const files = fs.readdirSync(templateDir);

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      // 将template中的文件 复制到 root 目录下
      copy(path.join(templateDir, file), targetPath);
    }
  };

  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
  );

  pkg.name = packageName;

  write("package.json", JSON.stringify(pkg, null, 2) + "\n");

  if (immediate) {
    // 立即启动
    console.log("root", root, pkgManager);
  }
}

// 移除字符串末尾的所有正斜杠
function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, "");
}

interface PkgInfo {
  name: string;
  version: string;
}

/**
 * 从 User-Agent 字符串提取首个包名/版本
 * @param userAgent - 原始 UA，可能为空
 * @returns 包信息对象或 undefined
 */
function pkgFromUserAgent(userAgent: string | undefined): PkgInfo | undefined {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

/**
 * 复制文件或目录（同步）
 * @param src  源路径
 * @param dest 目标路径（存在即覆盖）
 */
function copy(src: string, dest: string) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    // 同步复制文件 这是一个阻塞操作，会等待复制完成后才继续执行后续代码 如果目标文件已存在，它会被覆盖
    fs.copyFileSync(src, dest);
  }
}

/**
 * 递归复制整个目录
 * @param srcDir  源目录路径
 * @param destDir 目标目录路径
 */
function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

init();
