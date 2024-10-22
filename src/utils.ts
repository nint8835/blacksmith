import type { APIInteractionResponse } from 'discord-api-types/v10';

export function respond(response: APIInteractionResponse) {
    return new Response(JSON.stringify(response), {
        headers: { 'content-type': 'application/json' },
    });
}
