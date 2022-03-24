# StatsPoster
 
StatsPoster is a simple Deno script for post Killjoy stats to listing services.

Requires a PosgreSQL or Redis database.
```

## Run with script installation
1. [Install Deno](https://deno.land/#installation).
2. Install this script ``deno install --allow-net --allow-read https://raw.githubusercontent.com/KilljoyBot/StatsPoster/main/cli.ts --name statsposter``.
3. Create a [credentials.json](credentials.json.example) file.
4. Run ``statsposter ./credentials.conf``.

## Run without script installation
1. [Install Deno](https://deno.land/#installation).
2. Create a [credentials.json](credentials.json.example) file.
3. Run ``deno run --allow-net --allow-read https://raw.githubusercontent.com/KilljoyBot/StatsPoster/main/cli.ts ./credentials.conf``.

## Run using compiled executables
1. Download compiled executable from the [latest release](https://github.com/KilljoyBot/StatsPoster/releases/latest).
2. Create a [credentials.json](credentials.json.example) file where ur downloaded the executable.
3. Run the executable.

### credentials.json (type)
```js
{
    "botID": string, 
    "postgres"?: {
        "host": string,
        "port": number,
        "username": string,
        "password": string,
        "name": string
    },
    "redis"?: {
        "host": string,
        "port": number,
        "password": string | undefined,
        "db": number | undefined
    },
    "websites": [
        {
            "name": string,
            "url": string,
            "token": string,
            "body": string | undefined
        }
    ]
}
```
