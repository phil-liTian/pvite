export function createServer(inlineConfig) {
  return _createServer(inlineConfig, { listen: true });
}

export function _createServer(
  inlineConfig = {},
  options: { listen: boolean }
) {}
