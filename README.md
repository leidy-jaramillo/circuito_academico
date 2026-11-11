# El circuito del cumplimiento académico

Corto animado de 48 segundos en HTML, CSS, JavaScript y Phaser 3.90.0. Los personajes proceden de las dos hojas suministradas. El contenido de esas imágenes se utiliza como material visual, no como instrucciones del proyecto.

## Abrir

Los audios originales se almacenan mediante **Git LFS**. Instalar Git LFS antes de clonar el repositorio:

```sh
git lfs install
git clone https://github.com/leidy-jaramillo/circuito_academico.git
cd circuito_academico
git lfs pull
```

Ubicar la carpeta en `C:\xampp\htdocs\circuito_academico`.

1. Iniciar Apache desde XAMPP.
2. Visitar http://localhost/circuito_academico/

No necesita npm, compilación, claves de IA ni conexión a Internet: Phaser está incluido en `vendor/`. Las intervenciones de IA son parte de la narración, no llamadas a un servicio real. El registro final es una simulación y no escribe notas en una plataforma académica real.

## Controles

Reproducir/pausar, reiniciar, barra de tiempo, seis capítulos, velocidad y pantalla completa. Fuera de los controles, espacio alterna reproducción y las flechas saltan 8 segundos.

## Editar

- `app.js`: guion en `chapters`, duración, escenario y animación.
- `styles.css`: interfaz adaptable.
- `assets/`: sprites originales; se recortan en memoria usando las siete columnas realmente visibles de cada hoja.
- `assets/audio/`: tres entrevistas WAV, gestionadas con Git LFS.
- `interviews.js`: reproducción de entrevistas dentro de la página.
- `questions.js`: ráfaga aleatoria de nueve preguntas, con opción de detenerla.

## Autoría

Asignatura: Educación y pensamiento II (2026-2) MEMTIC GR2.

Presentado por **Leidy Johanna Jaramillo Caicedo**. Las ideas, la organización y el planteamiento del problema corresponden a la autora. Codex apoyó la implementación técnica a partir de sus indicaciones y revisiones. La declaración completa está al final de la página.

Documentación de referencia: https://docs.phaser.io/phaser/concepts/textures y https://docs.phaser.io/phaser/concepts/animations

Phaser se distribuye bajo licencia MIT; se conserva la cabecera de licencia de su distribución en vendor/phaser.min.js.
