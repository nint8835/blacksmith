import {
  APIApplicationCommandInteraction,
  APIMessageApplicationCommandGuildInteraction,
  APIMessageApplicationCommandInteractionData,
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v9';
import { respond } from './utils';
import { verify } from './verify';

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
    interaction.data as APIMessageApplicationCommandInteractionData;

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `\`\`\`js\n${JSON.stringify(interactionData)}\n\`\`\``,
    },
  });
}
