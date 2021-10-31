# Cloudflare Developer Challenge

This project was initially developed as part of the [Cloudflare Developer Challenge](https://challenge.developers.cloudflare.com/), a challenge to build an open-source project using Cloudflare's developer platform products.

## Products

This project makes use of the following products:

### Cloudflare Workers

The Discord bot is implemented as an interaction-based Discord bot, configured for webhook-based interactions. The target webhook that receives and responds to all interactions is a Cloudflare Worker, of which the source code can be found in [this repo](https://github.com/nint8835/blacksmith/).

### Workers KV

For persistence of command data (guild commands, command owners, and command responses), the Discord bot uses a Workers KV namespace, storing keypairs mapping `guild_id:command_name` to a JSON object containing data on the command.

### Cloudflare Pages

This very site is hosted on Cloudflare Pages and built using MkDocs (with the Material for MkDocs theme).

## Intended Project

This project was not the original project I intended to submit for the challenge, it was just meant as a simple project to learn the platform. The project I intended to submit was Portcullis, a Discord account identity verification solution designed to replace the MUN Computer Science Society's [DiscordAuth](https://github.com/MUNComputerScienceSociety/DiscordAuth) Google OAuth-based identity verification solution. Unfortunately, due to me starting the challenge late and having a variety of things that took up my time (school, work, etc.) I was unable to get it to a presentable state in time for the due date. I intend to still keep working on it in the coming months.

### Products

Portcullis uses the following products:

#### Cloudflare Workers

The Portcullis Discord bot & API were implemented / planned on being implemented as Cloudflare Workers. A basic version of the API exists and the source can be found [here](https://github.com/nint8835/portcullis/). The Discord bot does not yet exist.

#### Workers KV

Workers KV is used for storing all persistent data on verified accounts, users, guild settings, etc.

#### Cloudflare Pages

Portcullis currently consists of 3 different Cloudflare Pages sites:

- [https://withportcullis.com](https://withportcullis.com) - Main landing page, planned to advertise and explain what the service does.
    - [Source Code](https://github.com/nint8835/withportcullis.com)
- [https://docs.withportcullis.com](https://docs.withportcullis.com) - Documentation site, planned to explain all the details and intricacies on how the service works and how to use it, both from a guild owner and a joining user perspective.
    - [Source Code](https://github.com/nint8835/docs.withportcullis.com)
- [https://join.withportcullis.com](https://join.withportcullis.com) - Single-page app forming the frontend of the actual service. To be used for joining servers, managing server settings, viewing logs, etc.
    - [Source Code](https://github.com/nint8835/join.withportcullis.com)

#### Cloudflare Registrar

Not a product listed as scope of the competition, but the domain name `withportcullis.com` has been registered via Cloudflare Registrar.
