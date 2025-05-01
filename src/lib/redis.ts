import { Redis } from "@upstash/redis";

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error("Vercel KV environment variables (KV_REST_API_URL, KV_REST_API_TOKEN) are not set.");
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    if (data) {
      console.log(`Cache hit for key: ${key}`);
    }
    return data;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  try {
    // Use 'set' with no 'ex' or 'px' options for permanent storage
    await redis.set(key, value);
    console.log(`Cache set for key: ${key}`);
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
}
