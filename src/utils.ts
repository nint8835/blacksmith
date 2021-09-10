import { APIInteractionResponse } from 'discord-api-types/payloads/v9';

export function respond(response: APIInteractionResponse) {
  return new Response(JSON.stringify(response), {
    headers: { 'content-type': 'application/json' },
  });
}
