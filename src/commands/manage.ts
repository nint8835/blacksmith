import {
	InteractionResponseType,
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteractionData,
} from 'discord-api-types/v10';
import { respond } from '../utils';

async function handleAddCommand(
	interaction: APIApplicationCommandInteraction,
	env: Env,
	ctx: ExecutionContext,
): Promise<Response> {
	return respond({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: 'TODO - Add',
		},
	});
}

async function handleRemoveCommand(
	interaction: APIApplicationCommandInteraction,
	env: Env,
	ctx: ExecutionContext,
): Promise<Response> {
	return respond({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: 'TODO - Remove',
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
