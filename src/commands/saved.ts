import { InteractionResponseType, type APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { CommandData } from '../types';
import { respond } from '../utils';

export async function handleSavedCommand(
    interaction: APIApplicationCommandInteraction,
    env: Env,
    ctx: ExecutionContext,
): Promise<Response> {
    const commandDataStr = await env.COMMANDS.get(`${interaction.guild_id}:${interaction.data.name}`);

    if (!commandDataStr) {
        return respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Command ${interaction.data.name} does not exist. This should not be able to happen.`,
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
