import { SlashCommandBuilder } from '@discordjs/builders';
import {
    APIApplicationCommand,
    InteractionResponseType,
    MessageFlags,
    Routes,
    type APIApplicationCommandInteraction,
    type APIChatInputApplicationCommandInteractionData,
} from 'discord-api-types/v10';
import type { CommandData } from '../types';
import { getSubcommandOptionValue, respond } from '../utils';

const BASE_URL = 'https://discord.com/api/v10/';

async function handleAddCommand(
    interaction: APIApplicationCommandInteraction,
    env: Env,
    ctx: ExecutionContext,
): Promise<Response> {
    const name = getSubcommandOptionValue<string>(interaction, 'name');
    const description = getSubcommandOptionValue<string>(interaction, 'description');
    const response = getSubcommandOptionValue<string>(interaction, 'response');
    const guildId = interaction.guild_id!;

    const existingCommand = await env.COMMANDS.get(`${guildId}:${name}`);

    if (existingCommand) {
        return respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: `Command ${name} already exists.`,
            },
        });
    }

    try {
        const resp = await fetch(BASE_URL + Routes.applicationGuildCommands(env.DISCORD_APP_ID, guildId), {
            method: 'POST',
            headers: {
                Authorization: `Bot ${env.DISCORD_TOKEN}`,
                'User-Agent': 'Blacksmith/2.0.0 (https://github.com/nint8835/blacksmith)',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(new SlashCommandBuilder().setName(name).setDescription(description).toJSON()),
        });
        const commandRespData = (await resp.json()) as APIApplicationCommand;

        await env.COMMANDS.put(
            `${guildId}:${name}`,
            JSON.stringify({
                text: response,
                owner: interaction.member!.user.id,
                commandId: commandRespData.id,
            } satisfies CommandData),
        );
    } catch (err) {
        console.error('Error adding command', err);
    }

    return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: `Command ${name} added.`,
        },
    });
}

async function handleRemoveCommand(
    interaction: APIApplicationCommandInteraction,
    env: Env,
    ctx: ExecutionContext,
): Promise<Response> {
    const name = getSubcommandOptionValue<string>(interaction, 'name');
    const guildId = interaction.guild_id!;
    const commandDataStr = await env.COMMANDS.get(`${guildId}:${name}`);

    if (!commandDataStr) {
        return respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: `Command ${name} does not exist.`,
            },
        });
    }

    const commandData = JSON.parse(commandDataStr) as CommandData;
    if (commandData.owner !== interaction.member!.user.id && interaction.member!.user.id !== env.DISCORD_APP_OWNER_ID) {
        return respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: `You do not own command ${name}.`,
            },
        });
    }

    try {
        await fetch(BASE_URL + Routes.applicationGuildCommand(env.DISCORD_APP_ID, guildId, commandData.commandId), {
            method: 'DELETE',
            headers: {
                Authorization: `Bot ${env.DISCORD_TOKEN}`,
                'User-Agent': 'Blacksmith/2.0.0 (https://github.com/nint8835/blacksmith)',
            },
        });

        await env.COMMANDS.delete(`${guildId}:${name}`);
    } catch (e) {
        console.error('Error removing command', e);
    }

    return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: `Command ${name} removed.`,
        },
    });
}

export async function handleManageCommandsCommand(
    interaction: APIApplicationCommandInteraction,
    env: Env,
    ctx: ExecutionContext,
): Promise<Response> {
    const interactionData = interaction.data as APIChatInputApplicationCommandInteractionData;

    switch (interactionData.options![0].name) {
        case 'add':
            return handleAddCommand(interaction, env, ctx);
        case 'remove':
            return handleRemoveCommand(interaction, env, ctx);
        default:
            return respond({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: 'Invalid subcommand.',
                },
            });
    }
}
