# Blacksmith

Blacksmith is a simple, Cloudflare Workers-based bot for adding custom slash commands to your server.

Want to see it in action? You can see a quick demo video [here](https://www.youtube.com/watch?v=c5Z_nn8qYH4).

## Getting Started

To get started, add Blacksmith to your server with the button below:

[Add to Server](https://discord.com/api/oauth2/authorize?client_id=885641264165433374&scope=applications.commands){ .md-button .md-button--primary }

## Commands

### `/commands add`

Add a new command to this server.

#### Args

| Name          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `name`        | Name of the command to add to the server.                       |
| `description` | Description of the command to add to the server.                |
| `response`    | Message that should be responded with when this command is ran. |

#### Example

```
/commands add name:invite description:Invite Blacksmith to your own server. response:https://discord.com/api/oauth2/authorize?client_id=885641264165433374&scope=applications.commands
```

### `/commands remove`

Remove a command that was added to this server by Blacksmith. Can only be used by the person who added the command.

#### Args

| Name   | Description                                    |
| ------ | ---------------------------------------------- |
| `name` | Name of the command to remove from the server. |

#### Example

```
/commands remove name:invite
```
