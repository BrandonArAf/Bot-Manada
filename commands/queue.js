const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de canciones'),

  async execute(interaction, kazagumo) {
    const player = kazagumo.players.get(interaction.guild.id);
    if (!player || !player.queue.current) {
      return interaction.reply('❌ No hay música en la cola.');
    }

    const tracks = player.queue.slice(0, 10);
    const embed = new EmbedBuilder()
      .setTitle('🎵 Cola de música')
      .setColor(0x5865F2)
      .addFields({
        name: '▶️ Reproduciendo ahora',
        value: `${player.queue.current.title} — ${player.queue.current.author}`
      });

    if (tracks.length > 0) {
      embed.addFields({
        name: '📋 Siguiente en la cola',
        value: tracks.map((t, i) => `${i + 1}. ${t.title} — ${t.author}`).join('\n')
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};