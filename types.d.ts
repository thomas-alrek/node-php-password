declare module "node-php-password" {
  interface Info {
    algoName: string;
    options: {
      cost: number;
    };
  }

  function getInfo(hash: string): Info;
  function hash(password: string, algorithm?: string, options?: Record<string, any>): string;
  function needsRehash(hash: string, algorithm: string, options?: Record<string, any>): boolean;
  function verify(password: string, hash: string): boolean;

  export { Info, getInfo, hash, needsRehash, verify };
}
