import { redis, chunk } from "./deps.ts";
import { RedisCredentials } from "./interfaces.ts";
import { ConnectionParams, error, GuildCount } from "./mod.ts";

const getShards = (stats: any[]) => {
    const map = []

    for (const shard of stats) {
        const index = stats.indexOf(shard)
        const state = index % 2 == 0

        if (!state) map.push(JSON.parse(shard))
    }

    return map
}

export async function getRedisShardStats(credentials: RedisCredentials): Promise<GuildCount> {
    let client: redis.Redis

    try {
        console.info("⏳ Connecting with the database...")
        client = await redis.connect({
            hostname: credentials.host,
            port: credentials.port,
            password: credentials.password,
            db: credentials.db
        })
        console.info("✅ Successfully connected with Redis!")
    } catch (e) {
        console.error(`❌ Error connecting with Redis.`)
        throw e
    }

    const stats = await client.hgetall("shard-stats")

    const shards = getShards(stats)

    return {
        shards: shards.length,
        guilds: shards.map(s => s.guildsCacheSize).reduce((a, b) => a + b)
    }
}