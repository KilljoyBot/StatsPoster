export interface WebsiteCredentials {
    name: string
    token: string
    url: string
    body: string
}

export interface Credentials {
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

export interface ShardStats {
    // deno-lint-ignore camelcase
    guild_count: number
}