const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la música y desconecta'),

  async execute(interaction, kazagumo) {
    const player = kazagumo.players.get(interaction.guild.id);
    if (!player) return interaction.reply('❌ No hay música reproduciéndose.');
    player.destroy();
    await interaction.reply('⏹️ Música detenida.');
  }
};