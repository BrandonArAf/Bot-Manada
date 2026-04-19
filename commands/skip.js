const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue) return interaction.reply('❌ No hay música reproduciéndose.');
    queue.node.skip();
    await interaction.reply('⏭️ Saltando canción...');
  }
};