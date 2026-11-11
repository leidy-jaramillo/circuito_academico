const uncomfortableQuestions = [
 '¿Estamos formando ingenieros o simplemente cumpliendo procesos académicos en la era de la inteligencia artificial?',
 '¿Qué sentido tiene enseñar, aprender y evaluar aquello que una inteligencia artificial puede hacer por nosotros, si no somos capaces de reconocer qué estamos aprendiendo y para qué?',
 '¿Qué estamos formando realmente cuando un estudiante puede aprobar una asignatura sin necesariamente comprender lo que hizo?',
 'Si la inteligencia artificial puede hacer gran parte de lo que enseñamos, de lo que los estudiantes entregan y de lo que los docentes evaluamos, ¿qué sentido tiene hoy estudiar Ingeniería de Sistemas?',
 '¿Estamos formando personas que saben producir software o profesionales capaces de comprender problemas que merecen ser resueltos?',
 '¿Qué debería aprender un ingeniero cuando generar código ya no es necesariamente la parte más difícil de su trabajo?',
 '¿Estamos enseñando a utilizar herramientas o a desarrollar criterio para decidir cuándo, cómo y para qué utilizarlas?',
 '¿Qué capacidades humanas deberían fortalecerse precisamente porque la tecnología puede realizar una parte creciente del trabajo técnico?',
 '¿Estamos preparando profesionales para responder a necesidades existentes o para imaginar posibilidades que todavía no existen?'
];
function shuffledQuestions(items) {
 const result = [...items];
 for (let i = result.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [result[i], result[j]] = [result[j], result[i]];
 }
 return result;
}
const questionsDialog = document.getElementById('questions-dialog');
const questionsButton = document.getElementById('open-questions');
const questionTitle = document.getElementById('questions-title');
const nextQuestion = document.getElementById('next-question');
const dismissQuestion = document.getElementById('dismiss-question');
const burstStatus = document.createElement('span');
burstStatus.className = 'burst-status';
burstStatus.setAttribute('role', 'status');
questionsButton.after(burstStatus);
let questionQueue = [], questionIndex = 0, lastCorner = -1;
function positionQuestion(changeCorner = true) {
 const viewport = window.visualViewport;
 const width = viewport ? viewport.width : document.documentElement.clientWidth;
 const height = viewport ? viewport.height : window.innerHeight;
 const offsetX = viewport ? viewport.offsetLeft : 0;
 const offsetY = viewport ? viewport.offsetTop : 0;
 questionsDialog.style.width = `${Math.min(560, width - 32)}px`;
 questionsDialog.style.maxHeight = `${height - 32}px`;
 const bounds = questionsDialog.getBoundingClientRect();
 const availableX = Math.max(0, width - bounds.width - 32);
 const availableY = Math.max(0, height - bounds.height - 32);
 if (changeCorner) {
  const choices = [0, 1, 2, 3].filter(corner => corner !== lastCorner);
  lastCorner = choices[Math.floor(Math.random() * choices.length)];
 }
 const x = (lastCorner % 2 ? .75 : 0) + Math.random() * .25;
 const y = (lastCorner >= 2 ? .75 : 0) + Math.random() * .25;
 questionsDialog.style.left = `${offsetX + 16 + availableX * x}px`;
 questionsDialog.style.top = `${offsetY + 16 + availableY * y}px`;
}
function finishQuestions(completed = false) {
 questionsDialog.close();
 burstStatus.textContent = completed ? 'Nueve preguntas. La reflexión sigue abierta.' : 'Ráfaga detenida. Puedes volver a iniciarla.';
 questionsButton.focus({ preventScroll: true });
}
function showQuestion() {
 questionTitle.textContent = questionQueue[questionIndex];
 document.getElementById('burst-counter').textContent = `PREGUNTA INCÓMODA ${questionIndex + 1} / ${questionQueue.length}`;
 const last = questionIndex === questionQueue.length - 1;
 dismissQuestion.textContent = last ? 'Cerrar y seguir pensando' : 'Cerrar esta pregunta →';
 nextQuestion.setAttribute('aria-label', last ? 'Cerrar la última pregunta' : 'Cerrar esta pregunta y mostrar la siguiente');
 document.getElementById('burst-hint').textContent = last ? 'Última pregunta. La conversación no termina aquí.' : '¿La cierras? Otra pregunta te espera.';
 questionsDialog.classList.remove('burst-enter');
 questionsDialog.showModal();
 positionQuestion();
 questionsDialog.scrollTop = 0;
 void questionsDialog.offsetWidth;
 questionsDialog.classList.add('burst-enter');
 nextQuestion.focus({ preventScroll: true });
}
function advanceQuestion() {
 questionsDialog.close();
 questionIndex++;
 if (questionIndex >= questionQueue.length) finishQuestions(true);
 else showQuestion();
}
questionsButton.addEventListener('click', () => {
 questionQueue = shuffledQuestions(uncomfortableQuestions);
 questionIndex = 0;
 burstStatus.textContent = '';
 showQuestion();
});
nextQuestion.addEventListener('click', advanceQuestion);
dismissQuestion.addEventListener('click', advanceQuestion);
document.getElementById('stop-questions').addEventListener('click', () => finishQuestions());
questionsDialog.addEventListener('cancel', event => { event.preventDefault(); finishQuestions(); });
const reposition = () => { if (questionsDialog.open) positionQuestion(false); };
window.addEventListener('resize', reposition);
window.visualViewport?.addEventListener('resize', reposition);
