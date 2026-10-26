export interface AbuseStore {
  count(key: string, ttl: number): Promise<number>;
  claim(key: string, ttl: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl: number): Promise<void>;
  remove(key: string): Promise<void>;
}
const countScript =
  "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
export class RestStore implements AbuseStore {
  constructor(
    private url: string,
    private token: string,
  ) {}
  async cmd(args: (string | number)[]) {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw Error("store_unavailable");
    const data = (await res.json()) as { result: unknown; error?: string };
    if (data.error) throw Error("store_unavailable");
    return data.result;
  }
  async count(k: string, t: number) {
    return Number(await this.cmd(["EVAL", countScript, 1, k, t]));
  }
  async claim(k: string, t: number) {
    return (await this.cmd(["SET", k, "locked", "EX", t, "NX"])) === "OK";
  }
  async get(k: string) {
    return (await this.cmd(["GET", k])) as string | null;
  }
  async set(k: string, v: string, t: number) {
    await this.cmd(["SET", k, v, "EX", t]);
  }
  async remove(k: string) {
    await this.cmd(["DEL", k]);
  }
}
let singleton: Promise<AbuseStore> | undefined;
export async function getStore(): Promise<AbuseStore> {
  return (singleton ??= createStore().catch((e) => {
    singleton = undefined;
    throw e;
  }));
}
async function createStore(): Promise<AbuseStore> {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  )
    return new RestStore(
      process.env.UPSTASH_REDIS_REST_URL,
      process.env.UPSTASH_REDIS_REST_TOKEN,
    );
  if (process.env.REDIS_URL) {
    const { Redis } = await import("ioredis");
    const redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    });
    await redis.connect();
    return {
      count: async (k, t) => Number(await redis.eval(countScript, 1, k, t)),
      claim: async (k, t) =>
        (await redis.set(k, "locked", "EX", t, "NX")) === "OK",
      get: (k) => redis.get(k),
      set: async (k, v, t) => {
        await redis.set(k, v, "EX", t);
      },
      remove: async (k) => {
        await redis.del(k);
      },
    };
  }
  throw Error("store_not_configured");
}
