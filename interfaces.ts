export interface WebsiteCredentials {
    name: string
    token: string
    url: string
    body: string
}

export interface PostgresCredentials {
    host: string
    port?: string
    username: string
    password: string
    name: string
}

export interface RedisCredentials {
    host: string
    port?: number
    password?: string
    db?: number
}

export interface Credentials {
    botID: string
    postgres?: PostgresCredentials
    redis?: RedisCredentials
    websites: WebsiteCredentials[]
}

export interface ShardStats {
    // deno-lint-ignore camelcase
    guild_count: number
}