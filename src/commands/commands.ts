import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { handleManageCommandsCommand } from './manage';
import { handleSavedCommand } from './saved';

export async function handleCommand(
    interaction: APIApplicationCommandInteraction,
    env: Env,
    ctx: ExecutionContext,
): Promise<Response> {
    if (interaction.data.name === 'commands') {
        return handleManageCommandsCommand(interaction, env, ctx);
    }

    return handleSavedCommand(interaction, env, ctx);
}
