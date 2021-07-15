import { pathJoin } from "./deps.ts";
import { WebsiteCredentials } from "./interfaces.ts";

/**
 * Get the credentials file path from arguments or from current dir.
 * @returns The credentials file path
 */
export const getCredentialsPath = (): string => {
    if (Deno.args.length <= 0) return pathJoin("./credentials.json")

    return pathJoin(Deno.args[0])
}

/**
 * Returns the valid port for the given string
 * @param str Port string representation
 * @returns A valid port for the database connection
 */
export const port = (str?: string): number => {

    if (!str) return 5432
    try {
        return parseInt(str)
    } catch(_e) {
        console.warn("Cannot parse database.port "+str+", using default port 5432.")
        return 5432
    }

}

/**
 * Compile the website URL
 * @param url URL template
 * @param botID The bot id
 * @returns The compiled URL
 */
export const buildWebsiteUrl = (url: string, botID: string): string => {
    return url.replace("{ID}", botID)
}

/**
 * Compile the body key from website object or returns default ``server_count`` body key.
 * @param website WebsiteCredentials object
 * @returns The compiled body key
 */
export const buildBodyKey = (website: WebsiteCredentials): string => {
    return website.body ?? "server_count"
}

/**
 * Execute the request and returns the recived status code
 * @param website WebsiteCredentials object
 * @param botID The bot id
 * @param totalGuilds The total number of Discord Guilds (servers) to post
 * @returns The status code from the request
 */
export const postStatsForWebsite = async (website: WebsiteCredentials, botID: string, totalGuilds: number): Promise<{status: number, statusText: string}> => {

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

    return {
        status: response.status,
        statusText: response.statusText
    }
}