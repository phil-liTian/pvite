//#region src/client/env.ts
const context = (() => {
	if (typeof globalThis !== "undefined") return globalThis;
	else if (typeof self !== "undefined") return self;
	else if (typeof window !== "undefined") return window;
	else return Function("return this")();
})();
console.log("contenxt", context);

//#endregion