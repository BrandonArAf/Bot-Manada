require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const player = new Player(client, {
  skipFFmpeg: false,
  useLegacyFFmpeg: false,
});

// Cargar extractors
(async () => {
  await player.extractors.loadMulti(DefaultExtractors);
  console.log('Extractors cargados:', player.extractors.store.map(e => e.identifier));
})();

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`▶️ Reproduciendo: **${track.title}** por ${track.author}`);
});

player.events.on('audioTrackAdd', (queue, track) => {
  queue.metadata.channel.send(`✅ Agregado a la cola: **${track.title}**`);
});

player.events.on('emptyQueue', (queue) => {
  queue.metadata.channel.send('✅ Cola vacía, desconectando...');
});

player.events.on('error', (queue, error) => {
  console.error('Error en el player:', error);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, player);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Hubo un error ejecutando este comando.', ephemeral: true });
  }
});

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);