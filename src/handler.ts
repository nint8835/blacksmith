import {
  APIApplicationCommand,
  APIApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIPingInteraction,
  ApplicationCommandInteractionDataOptionString,
  ApplicationCommandInteractionDataOptionSubCommand,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v9';
import { CommandData, respond } from './utils';
import { verify } from './verify';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';

// const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
const BASE_URL = 'https://discord.com/api/v9/';

async function handleAddCommand(
  options: ApplicationCommandInteractionDataOptionSubCommand,
  guildId: string,
  authorId: string,
): Promise<Response> {
  const commandName = (
    options.options[0] as ApplicationCommandInteractionDataOptionString
  ).value;
  const commandDescription = (
    options.options[1] as ApplicationCommandInteractionDataOptionString
  ).value;
  const commandText = (
    options.options[2] as ApplicationCommandInteractionDataOptionString
  ).value;

  const existingCommand = await COMMANDS.get(`${guildId}:${commandName}`);

  if (existingCommand !== null) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: `Command ${commandName} already exists.`,
      },
    });
  }

  const resp = await fetch(
    BASE_URL + Routes.applicationGuildCommands(DISCORD_APP_ID, guildId),
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        'User-Agent':
          'Blacksmith/1.0.0 (https://github.com/nint8835/blacksmith)',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        new SlashCommandBuilder()
          .setName(commandName)
          .setDescription(commandDescription)
          .toJSON(),
      ),
    },
  );

  const commandRespData = (await resp.json()) as APIApplicationCommand;

  await COMMANDS.put(
    `${guildId}:${commandName}`,
    JSON.stringify({
      text: commandText,
      owner: authorId,
      commandId: commandRespData.id,
    }),
  );

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Command ${commandName} added.`,
    },
  });
}

async function handleRemoveCommand(
  options: ApplicationCommandInteractionDataOptionSubCommand,
  guildId: string,
  authorId: string,
): Promise<Response> {
  const commandName = (
    options.options[0] as ApplicationCommandInteractionDataOptionString
  ).value;

  const commandDataStr = await COMMANDS.get(`${guildId}:${commandName}`);

  if (commandDataStr === null) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: `Command ${commandName} does not exist.`,
      },
    });
  }
  const commandData = JSON.parse(commandDataStr) as CommandData;
  if (commandData.owner !== authorId) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: `You do not own command ${commandName}.`,
      },
    });
  }

  await fetch(
    BASE_URL +
      Routes.applicationGuildCommand(
        DISCORD_APP_ID,
        guildId,
        commandData.commandId,
      ),
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        'User-Agent':
          'Blacksmith/1.0.0 (https://github.com/nint8835/blacksmith)',
      },
    },
  );

  await COMMANDS.delete(`${guildId}:${commandName}`);

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Command ${commandName} removed.`,
    },
  });
}

export async function handleRequest(request: Request): Promise<Response> {
  if (
    !request.headers.get('X-Signature-Ed25519') ||
    !request.headers.get('X-Signature-Timestamp')
  )
    return new Response('', { status: 401 });
  if (!(await verify(request))) return new Response('', { status: 401 });

  const interaction = (await request.json()) as
    | APIPingInteraction
    | APIApplicationCommandInteraction;

  if (interaction.type === InteractionType.Ping) {
    console.log('Got ping');
    return respond({
      type: InteractionResponseType.Pong,
    });
  }

  const interactionData =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  if (interactionData.name === 'commands') {
    if (
      interactionData.options === undefined ||
      interactionData.options[0].type !==
        ApplicationCommandOptionType.Subcommand
    ) {
      return new Response('', { status: 400 });
    }
    if (interactionData.options![0].name === 'add') {
      return handleAddCommand(
        interactionData.options[0],
        interaction.guild_id!,
        interaction.member!.user.id,
      );
    } else if (interactionData.options![0].name === 'remove') {
      return handleRemoveCommand(
        interactionData.options[0],
        interaction.guild_id!,
        interaction.member!.user.id,
      );
    }
  }

  const commandDataStr = await COMMANDS.get(
    `${interaction.guild_id}:${interactionData.name}`,
  );

  if (commandDataStr === null) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Command ${interactionData.name} does not exist. This should not be able to happen.`,
      },
    });
  }

  const commandData = JSON.parse(commandDataStr) as CommandData;

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: commandData.text,
    },
  });
}
