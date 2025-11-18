import { cac } from "cac";

const cli = cac("pvite");

console.log("cli");

cli
  .command("[root]", "start dev server")
  .alias("dev")
  .option("--port <port>", `[number] specify port`)
  .action(async (root, options) => {
    console.log("root", root, options);
    const { createServer } = await import("./server");

    const server = createServer({});
  });

// 开始处理命令
cli.parse();
