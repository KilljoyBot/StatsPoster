#!/usr/bin/env -S deno run --allow-read and --allow-net
import { Client } from "./deps.ts";
import { Credentials, ShardStats } from "./interfaces.ts";
import { getCredentialsPath, port, postStatsForWebsite } from "./utils.ts";

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

    if (!botID) throw new Error(`botID value was not found on credentials file ${credentialsPath}`)
    if (!credentials.websites || credentials.websites.length <= 0) throw new Error(`Websites array was not found on credentials file ${credentialsPath}`)

    const client = new Client({
        hostname: credentials.database.host,
        port: port(credentials.database.port),
        user: credentials.database.username,
        password: credentials.database.password,
        database: credentials.database.name
    })

    console.info("⏳ Connecting with the database...")
    try {
        await client.connect()
        console.info("✅ Successfully connected with the database!")
    } catch(e) {
        console.error(`❌ Error connecting with database ${credentials.database.host}:${port(credentials.database.port)}`)
        throw e
    }

    const shardStats = (await client.queryObject<ShardStats>("SELECT guild_count FROM shard_stats")).rows;

    const totalGuilds = shardStats.map(s => s.guild_count).reduce((a, b) => a + b)

    console.info(`The following stats will be posted:\n - Total Guilds: ${totalGuilds}`)

    await client.end()

    let message = "Results for stats posting:"

    for (const website of credentials.websites) {
        const resultStatus = await postStatsForWebsite(website, botID, totalGuilds)
        message += `\n - ${website.name}: [${resultStatus.status}] ${resultStatus.statusText}`
    }
    
    console.info(message)
})()
