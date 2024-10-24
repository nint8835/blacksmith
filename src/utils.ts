import type {
    APIApplicationCommandInteraction,
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandInteractionDataSubcommandOption,
    APIChatInputApplicationCommandInteractionData,
    APIInteractionDataOptionBase,
    APIInteractionResponse,
} from 'discord-api-types/v10';

export function respond(response: APIInteractionResponse) {
    return new Response(JSON.stringify(response), {
        headers: { 'content-type': 'application/json' },
    });
}

export function getOptionValue<T>(options: APIApplicationCommandInteractionDataOption[], name: string): T {
    return (options.find((option) => option.name === name)! as APIInteractionDataOptionBase<any, T>).value;
}

export function getCommandOptionValue<T>(interaction: APIApplicationCommandInteraction, name: string): T {
    return getOptionValue<T>((interaction.data as APIChatInputApplicationCommandInteractionData).options!, name);
}

export function getSubcommandOptionValue<T>(interaction: APIApplicationCommandInteraction, name: string): T {
    return getOptionValue<T>(
        (
            (interaction.data as APIChatInputApplicationCommandInteractionData)
                .options![0] as APIApplicationCommandInteractionDataSubcommandOption
        ).options!,
        name,
    );
}
