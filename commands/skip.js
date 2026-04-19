const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual'),

  async execute(interaction, kazagumo) {
    const player = kazagumo.players.get(interaction.guild.id);
    if (!player) return interaction.reply('❌ No hay música reproduciéndose.');
    player.skip();
    await interaction.reply('⏭️ Canción saltada.');
  }
};