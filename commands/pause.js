const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa o reanuda la música'),

  async execute(interaction, kazagumo) {
    const player = kazagumo.players.get(interaction.guild.id);
    if (!player) return interaction.reply('❌ No hay música reproduciéndose.');
    player.paused ? player.pause(false) : player.pause(true);
    await interaction.reply(player.paused ? '⏸️ Pausado.' : '▶️ Reanudado.');
  }
};