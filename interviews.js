// Keep interviews from playing over each other.
const interviewPlayers = [...document.querySelectorAll('.interview-card audio')];
for (const player of interviewPlayers) {
  player.addEventListener('play', () => {
    for (const other of interviewPlayers) if (other !== player) other.pause();
  });
  const showError = () => {
    player.closest('.interview-card').querySelector('.audio-error').hidden = false;
  };
  player.addEventListener('error', showError);
  player.querySelector('source').addEventListener('error', showError);
}
