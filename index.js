require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Kazagumo, Plugins } = require('kazagumo');
const { Shoukaku, Connectors } = require('shoukaku');
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

// Nodos Lavalink públicos gratuitos
const nodes = [
  {
    name: 'Node1',
    url: 'lavalink.jirayu.net:13592',
    auth: 'youshallnotpass',
    secure: false,
  },
  {
    name: 'Node2', 
    url: 'lavalink.darrennathanael.com:80',
    auth: 'LL123',
    secure: false,
  },
  {
    name: 'Node3',
    url: 'lavalink.devz.cloud:80',
    auth: 'mathiscool',
    secure: false,
  }
];

const kazagumo = new Kazagumo({
  defaultSearchEngine: 'youtube',
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  }
}, new Connectors.DiscordJS(client), nodes);
kazagumo.shoukaku.on('error', (name, error) => {
  console.error(`Error en nodo ${name}:`, error.message);
});

client.kazagumo = kazagumo;
client.commands = new Collection();

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Eventos del player
kazagumo.on('playerStart', (player, track) => {
  const channel = client.channels.cache.get(player.textId);
  if (channel) channel.send(`▶️ Reproduciendo: **${track.title}** por **${track.author}**`);
});

kazagumo.on('playerEnd', (player) => {
  const channel = client.channels.cache.get(player.textId);
  if (channel) channel.send('✅ Cola vacía, desconectando...');
});

kazagumo.on('playerEmpty', (player) => {
  const channel = client.channels.cache.get(player.textId);
  if (channel) channel.send('✅ Cola vacía, desconectando...');
  player.destroy();
});

kazagumo.on('playerClosed', (player) => {
  player.destroy();
});

// Slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, kazagumo);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Error ejecutando el comando.', ephemeral: true });
  }
});

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);