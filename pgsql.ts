import { Client } from "./deps.ts";
import { PostgresCredentials, ShardStats } from "./interfaces.ts";
import { GuildCount } from "./mod.ts";
import { port } from "./utils.ts";

export async function getPgsqlShardStats(credentials: PostgresCredentials): Promise<GuildCount> {
    const client = new Client({
        hostname: credentials.host,
        port: port(credentials.port),
        user: credentials.username,
        password: credentials.password,
        database: credentials.name
    })

    console.info("⏳ Connecting with the database...")
    try {
        await client.connect()
        console.info("✅ Successfully connected with PostgreSQL!")
    } catch(e) {
        console.error(`❌ Error connecting with postgres ${credentials.host}:${port(credentials.port)}`)
        throw e
    }

    const shardStats = (await client.queryObject<ShardStats>("SELECT guild_count FROM shard_stats")).rows;

    const totalGuilds = shardStats.map(s => s.guild_count).reduce((a, b) => a + b)

    await client.end()

    return {
        shards: shardStats.length,
        guilds: totalGuilds
    }
}