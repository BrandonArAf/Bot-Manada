require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');

// 1. Cliente
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// 2. Player
const player = new Player(client, {
  skipFFmpeg: false,
});

// 3. Cargar extractors con debug
player.extractors.loadMulti(DefaultExtractors).then(() => {
  console.log('Extractors cargados:', player.extractors.store.map(e => e.identifier));
});

// 4. Comandos
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// 5. Eventos del player
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

// 6. Slash commands
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

// 7. Ready
client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);