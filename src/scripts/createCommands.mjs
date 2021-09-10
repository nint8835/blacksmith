import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config.mjs';

const rest = new REST({ version: '9' }).setToken(config.token);

await rest.put(
  Routes.applicationGuildCommands(config.appId, config.testingGuildId),
  {
    body: [
      new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Manage custom commands.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Add a new command.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setRequired(true)
                .setDescription('The name of the command.'),
            )
            .addStringOption((option) =>
              option
                .setName('description')
                .setDescription('The description of the command.')
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName('response')
                .setRequired(true)
                .setDescription('The response of the command.'),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove')
            .setDescription('Remove a command.')
            .addStringOption((option) =>
              option
                .setName('name')
                .setRequired(true)
                .setDescription('The name of the command.'),
            ),
        )
        .toJSON(),
    ],
  },
);
