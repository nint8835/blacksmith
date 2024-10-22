import { InteractionResponseType, type APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { respond } from '../utils';

export async function handleManageCommandsCommand(
	interaction: APIApplicationCommandInteraction,
	env: Env,
	ctx: ExecutionContext,
): Promise<Response> {
	return respond({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: 'TODO - Manage',
		},
	});
}
