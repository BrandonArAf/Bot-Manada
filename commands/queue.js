const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de canciones'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      return interaction.reply('❌ No hay música en la cola.');
    }

    const tracks = queue.tracks.toArray().slice(0, 10);
    const embed = new EmbedBuilder()
      .setTitle('🎵 Cola de música')
      .setColor(0x5865F2)
      .addFields({
        name: '▶️ Reproduciendo ahora',
        value: `${queue.currentTrack.title} — ${queue.currentTrack.author}`
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