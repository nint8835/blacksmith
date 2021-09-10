import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config.mjs';

const rest = new REST({ version: '9' }).setToken(config.token);

const commandsResp = await rest.get(
  Routes.applicationGuildCommands(config.appId, config.testingGuildId),
);

for (let command of commandsResp) {
  await rest.delete(
    Routes.applicationGuildCommand(
      config.appId,
      config.testingGuildId,
      command.id,
    ),
  );
}
