//#region src/node/server/index.ts
function createServer(inlineConfig) {
	return _createServer(inlineConfig, { listen: true });
}
function _createServer(inlineConfig = {}, options) {}

//#endregion
export { createServer };