export type GuildCount = {
    shards: number
    guilds: number
}

export type ConnectionParams = {
    hostname: string
    port: string | number | undefined
    user: string | undefined
    pass: string | undefined
    db: string | number | undefined
}

// deno-lint-ignore no-explicit-any
export function error(...message: any[]) {
    console.error(message)
    Deno.exit(1)
}