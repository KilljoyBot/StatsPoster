#!/usr/bin/env -S deno run --allow-read and --allow-net
import { Client } from "./deps.ts";
import { Credentials, ShardStats } from "./interfaces.ts";
import { error, GuildCount } from "./mod.ts";
import { getCredentialsPath, postStatsForWebsite } from "./utils.ts";
import { getPgsqlShardStats } from "./pgsql.ts";
import { getRedisShardStats } from "./redis.ts";

/**
 * Initial function for the CLI.
 * 
 * Needs --allow-read and --allow-net flags.
 * 
 * Example ``deno run --allow-read --allow-net cli.ts
 */
(async () => {
    const credentialsPath = getCredentialsPath()
    const credentials: Credentials = JSON.parse(Deno.readTextFileSync(credentialsPath))

    const botID = credentials.botID

    if (!botID) error(`botID value was not found on credentials file ${credentialsPath}`)
    if (!credentials.websites || credentials.websites.length <= 0) error(`Websites array was not found on credentials file ${credentialsPath}`)

    if (!credentials.postgres && !credentials.redis) error("Must provide postgresql or redis credentials... exiting.")

    let count: GuildCount

    if (credentials.postgres) {
        count = await getPgsqlShardStats(credentials.postgres)
    } else if (credentials.redis) {
        count = await getRedisShardStats(credentials.redis)
    } else {
        throw new Error("Exception 1")
    }

    console.info(`The following stats will be posted:\n - Total Guilds: ${count.guilds}\n - Shards count: ${count.shards}`)

    let message = "Results for stats posting:"

    for (const website of credentials.websites) {
        const resultStatus = await postStatsForWebsite(website, botID, count.guilds)
        message += `\n - ${website.name}: [${resultStatus.status}] ${resultStatus.statusText}`
    }
    
    console.info(message)
})()
