const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la música y desconecta el bot'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue) return interaction.reply('❌ No hay música reproduciéndose.');
    queue.delete();
    await interaction.reply('⏹️ Música detenida. ¡Hasta luego!');
  }
};