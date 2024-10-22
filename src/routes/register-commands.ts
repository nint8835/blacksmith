import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsResult, Routes } from 'discord-api-types/v10';
import type { IRequest } from 'itty-router';

export async function handleRegisterCommands(request: IRequest, env: Env, ctx: ExecutionContext): Promise<Response> {
	const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

	try {
		const resp = (await rest.post(Routes.applicationCommands(env.DISCORD_APP_ID), {
			body: new SlashCommandBuilder()
				.setName('commands')
				.setDescription('Manage custom commands.')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('add')
						.setDescription('Add a new command.')
						.addStringOption((option) =>
							option.setName('name').setRequired(true).setDescription('The name of the command.'),
						)
						.addStringOption((option) =>
							option
								.setName('description')
								.setDescription('The description of the command.')
								.setRequired(true),
						)
						.addStringOption((option) =>
							option.setName('response').setRequired(true).setDescription('The response of the command.'),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('remove')
						.setDescription('Remove a command.')
						.addStringOption((option) =>
							option.setName('name').setRequired(true).setDescription('The name of the command.'),
						),
				)
				.toJSON(),
		})) as RESTPostAPIApplicationCommandsResult;
		console.log('Registered commands with resp', resp);

		return new Response('Registered commands.', { status: 200 });
	} catch (err) {
		console.error('Failed to register commands', err);
		return new Response('Failed to register commands.', { status: 500 });
	}
}
