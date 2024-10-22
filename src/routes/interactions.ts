import {
	InteractionResponseType,
	InteractionType,
	type APIApplicationCommandInteraction,
	type APIPingInteraction,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import type { IRequestStrict } from 'itty-router';
import { respond } from './utils';

export async function handleInteractions(request: IRequestStrict, env: Env, ctx: ExecutionContext): Promise<Response> {
	const signature = request.headers.get('X-Signature-Ed25519') || '';
	const timestamp = request.headers.get('X-Signature-Timestamp') || '';
	const body = await request.text();
	const isValidRequest = await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
	if (!isValidRequest) {
		console.log('Invalid request signature');
		return new Response('Invalid request signature.', { status: 401 });
	}

	const interaction = JSON.parse(body) as APIPingInteraction | APIApplicationCommandInteraction;

	if (interaction.type === InteractionType.Ping) {
		return respond({ type: InteractionResponseType.Pong });
	}

	return new Response('Todo');
}
