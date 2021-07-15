#!/usr/bin/env -S deno run --allow-net --allow-env
import { pathJoin, Client } from "./deps.ts";


interface WebsiteCredentials {
    name: string
    token: string
    url: string
    body: string
}

interface Credentials {
    botID: string
    database: {
        host: string
        port?: string
        username: string
        password: string
        name: string
    }
    websites: WebsiteCredentials[]
}

interface ShardStats {
    // deno-lint-ignore camelcase
    guild_count: number
}

const getCredentialsPath = (): string => {
    if (Deno.args.length <= 0) return pathJoin("./credentials.json")

    return pathJoin(Deno.args[0])
}

const port = (str?: string): number => {

    if (!str) return 5432
    try {
        return parseInt(str)
    } catch(_e) {
        console.warn("Cannot parse database.port "+str+", using default port 5432.")
        return 5432
    }

}

const buildWebsiteUrl = (url: string, botID: string): string => {
    return url.replace("{ID}", botID)
}

const buildBodyKey = (website: WebsiteCredentials): string => {
    return website.body ?? "server_count"
}

const postStatsForWebsite = async (website: WebsiteCredentials, botID: string, totalGuilds: number): Promise<number> => {

    const body = {
        [buildBodyKey(website)]: totalGuilds
    }

    const response = await fetch(buildWebsiteUrl(website.url, botID),
        {
            method: "post",
            headers: {
                "Authorization": website.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    )

    return response.status
}

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

    const results = new Map<string, number>()

    for (const website of credentials.websites) {
        const resultStatus = await postStatsForWebsite(website, botID, totalGuilds)
        results.set(website.name, resultStatus)
    }

    let message = "Results for stats posting:"

    results.forEach((v, k) => {
        message += `\n - ${k}: ${v}`
    })
    
    console.info(message)
})()