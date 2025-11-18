export interface UserConfig {
  /**
   * @default process.cwd()
   */
  root?: string;
}

export interface ConfigEnv {
  command: "build" | "serve";
  mode: string;
}

export type UserConfigFnObject = (env: ConfigEnv) => UserConfig;
export type UserConfigFnPromise = (env: ConfigEnv) => Promise<UserConfig>;
export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;

export type UserConfigExport =
  | UserConfig
  | Promise<UserConfig>
  | UserConfigFnObject
  | UserConfigFnPromise
  | UserConfigFn;

export function defineConfig(config: UserConfig): UserConfig;
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>;
export function defineConfig(config: UserConfigFnObject): UserConfigFnObject;
export function defineConfig(config: UserConfigFnPromise): UserConfigFnPromise;
export function defineConfig(config: UserConfigFn): UserConfigFn;

export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config;
}
