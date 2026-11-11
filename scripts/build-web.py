"""Build a static site with lightweight interview copies; keep original WAVs intact."""
from pathlib import Path
import json
import shutil
import subprocess
import wave

root = Path(__file__).resolve().parents[1]
out = root / 'dist'
out.mkdir(exist_ok=True)
(out / 'assets' / 'audio').mkdir(parents=True, exist_ok=True)
for name in ['index.html', 'styles.css', 'app.js', 'questions.js', 'interviews.js']:
    shutil.copy2(root / name, out / name)
shutil.copytree(root / 'vendor', out / 'vendor', dirs_exist_ok=True)
for source in (root / 'assets').glob('*.png'):
    shutil.copy2(source, out / 'assets' / source.name)
for index in range(1, 4):
    source = root / 'assets' / 'audio' / f'entrevista-{index}.wav'
    target = out / 'assets' / 'audio' / f'entrevista-{index}.mp3'
    with wave.open(str(source), 'rb') as audio:
        duration = audio.getnframes() / audio.getframerate()
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-vn', '-codec:a', 'libmp3lame', '-b:a', '128k', str(target)], check=True)
    probe = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(target)], text=True)
    actual = float(json.loads(probe)['format']['duration'])
    if abs(actual - duration) > 1:
        raise RuntimeError(f'Duración incorrecta para la entrevista {index}')
    print(f'Entrevista {index}: {actual:.1f} s, {target.stat().st_size / 1_000_000:.1f} MB')
html = (out / 'index.html').read_text(encoding='utf-8')
html = html.replace('.wav" type="audio/wav"', '.mp3" type="audio/mpeg"')
if '.wav"' in html:
    raise RuntimeError('Quedaron referencias WAV en la publicación')
(out / 'index.html').write_text(html, encoding='utf-8')
(out / '.nojekyll').touch()
