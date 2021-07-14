# StatsPoster
 
StatsPoster is a simple Deno script for post Killjoy stats to listing services.

## How to run this script (with script installation)
1. [Install Deno](https://deno.land/#installation).
2. Install this script ``deno install --allow-net --allow-read https://raw.githubusercontent.com/KilljoyBot/StatsPoster/main/cli.ts --name statsposter``.
3. Create a [credentials.json](credentials.json.example) file.
4. Run ``statsposter ./credentials.conf``.

## How to run this script (without script installation)
1. [Install Deno](https://deno.land/#installation).
2. Create a [credentials.json](credentials.json.example) file.
3. Run ``deno run --allow-net --allow-read https://raw.githubusercontent.com/KilljoyBot/StatsPoster/main/cli.ts ./credentials.conf``.

### credentials.json (type)
```json
{
    "botID": string, 
    "database": {
        "host": string,
        "port": number,
        "username": string,
        "password": string,
        "name": string
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