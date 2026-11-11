/* Timeline in seconds: deterministic rendering makes pause, seeking and replay exact. */
const chapters = [
 {title:'Diseñar con IA',who:'PROFESOR',line:'«Necesito una actividad con instrucciones claras y criterios de evaluación». El profesor diseña la propuesta con ayuda de una IA.',tag:'IA · DISEÑO',heading:'Una actividad toma forma',items:['Analizar una situación','Argumentar una solución','Presentar un producto'],note:'Criterios definidos',color:0xabf5cf},
 {title:'Recibir la actividad',who:'ESTUDIANTE',line:'El estudiante recibe las instrucciones: analiza la situación, propone una solución y entrega un producto que responda a los criterios.',tag:'INSTRUCCIONES',heading:'La consigna llega al estudiante',items:['Leer las instrucciones','Revisar los criterios','Identificar la entrega'],note:'Actividad recibida',color:0xabf5cf},
 {title:'Resolver con otra IA',who:'ESTUDIANTE',line:'«Ayúdame a desarrollar una solución siguiendo estos criterios». El estudiante utiliza otra IA para elaborar el producto solicitado.',tag:'OTRA IA · SOLUCIÓN',heading:'Una solución se construye',items:['Procesar la consigna','Desarrollar la propuesta','Preparar el documento'],note:'Producto generado',color:0xbab2ff},
 {title:'Entregar el producto',who:'NARRADOR',line:'El estudiante entrega el producto. El documento cumple los criterios establecidos y queda disponible para su revisión.',tag:'ENTREGA',heading:'El producto cumple los criterios',items:['Análisis incluido','Propuesta desarrollada','Formato solicitado'],note:'Entrega confirmada',color:0xabf5cf},
 {title:'Revisar con IA',who:'PROFESOR',line:'El profesor utiliza IA para revisar el trabajo según los criterios y generar una retroalimentación que acompaña la evaluación.',tag:'IA · REVISIÓN',heading:'La evaluación vuelve al circuito',items:['Contrastar con la rúbrica','Revisar el producto','Generar retroalimentación'],note:'Retroalimentación lista',color:0xf5ce91},
 {title:'Registrar la evidencia',who:'PLATAFORMA',line:'Finalmente, la plataforma registra una calificación y una evidencia de aprendizaje. El circuito del cumplimiento académico se completa.',tag:'REGISTRO ACADÉMICO',heading:'El circuito se completa',items:['Calificación registrada','Evidencia de aprendizaje','Retroalimentación disponible'],note:'Registro completado',color:0xabf5cf}
];
let clock=0,playing=false,rate=1,current=-1,scene;
const $=id=>document.getElementById(id), sceneDuration=8, duration=sceneDuration*chapters.length;
// Position and gait share the same timeline, including pause and scrubbing.
function studentMotion(progress){
 const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 const outbound=ease((progress-.08)/.30),inbound=ease((progress-.65)/.30);
 const walking=(progress>.08&&progress<.38)||(progress>.65&&progress<.95);
 const distance=180*(outbound+inbound);
 const step=Math.floor(distance/9)%12;
 return {x:1000-180*outbound+180*inbound,walking,flipX:progress<.38&&walking,frame:7+(step<=6?step:12-step)};
}
chapters.forEach((c,i)=>{const b=document.createElement('button');b.innerHTML=`<b>0${i+1}</b>${c.title}`;b.onclick=()=>jump(i*sceneDuration);$('chapters').append(b)});
function jump(t){clock=Math.max(0,Math.min(duration,t));if(clock===duration)playing=false;renderUI();if(scene)scene.renderStory()}
function renderUI(){const n=Math.min(5,Math.floor(clock/sceneDuration));$('play').textContent=playing?'Ⅱ Pausar':clock===duration?'↺ Repetir':'▶ Reproducir';$('status').textContent=clock===duration?'CIRCUITO COMPLETADO':playing?'REPRODUCIENDO':clock===0?'LISTO PARA COMENZAR':'EN PAUSA';$('elapsed').textContent=`${String(Math.floor(clock/60)).padStart(2,'0')}:${String(Math.floor(clock%60)).padStart(2,'0')}`;$('seek').value=clock;$('counter').textContent=`ESCENA 0${n+1} / 06`;if(n!==current){current=n;$('speaker').textContent=chapters[n].who;$('caption').textContent=chapters[n].line;[...$('chapters').children].forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-current',i===n?'step':'false')})}}
function toggle(){if(clock>=duration)clock=0;playing=!playing;renderUI()}
$('replay-result').onclick=()=>{playing=true;jump(0)};
$('play').onclick=toggle;$('restart').onclick=()=>{playing=false;jump(0)};$('seek').oninput=e=>jump(+e.target.value);$('speed').onchange=e=>rate=+e.target.value;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.player').requestFullscreen()}catch{$('status').textContent='PANTALLA COMPLETA NO DISPONIBLE'}};
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','BUTTON'].includes(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();if(scene)toggle()}if(e.code==='ArrowRight')jump(clock+sceneDuration);if(e.code==='ArrowLeft')jump(clock-sceneDuration)});
if(!window.Phaser){$('caption').textContent='No se pudo cargar Phaser. Comprueba que exista vendor/phaser.min.js y abre el proyecto mediante localhost.';throw Error('Phaser unavailable')}
class Circuito extends Phaser.Scene{
 preload(){this.load.image('prof','assets/sprite_profe.png');this.load.image('student','assets/sprite_estudiante.png');this.load.on('loaderror',()=>{$('caption').textContent='No se pudo cargar una imagen. Revisa la carpeta assets.'})}
 text(x,y,text,size=16,color='#e3efeb'){return this.add.text(x,y,text,{fontFamily:'Arial',fontSize:size,color}).setOrigin(0,0)}
 rect(x,y,w,h,color,r=12,alpha=1){const g=this.add.graphics();g.fillStyle(color,alpha);g.fillRoundedRect(x,y,w,h,r);return g}
 create(){
  scene=this;
  // The supplied boards have 7 visible columns, not the 8 stated in their labels.
  for(const key of ['prof','student']){
   const texture=this.textures.get(key),img=texture.getSourceImage(),sx=img.width/2048,sy=img.height/683;
   // New sheets have different column spacing. Include hands and thought bubbles.
   const layout=key==='student'
    ?{x:150,stride:217,rows:[0,177,345,514],height:684}
    :{x:160,stride:230,rows:[0,175,343,513],height:683};
   const rowScale=img.height/layout.height;
   for(let row=0;row<4;row++)for(let col=0;col<7;col++){
    const x=Math.round((layout.x+col*layout.stride)*sx),y=Math.round(layout.rows[row]*rowScale);
    texture.add(row*7+col,0,x,y,Math.round(200*sx),Math.min(Math.round(170*rowScale),img.height-y));
   }
  }
  this.rect(0,0,1200,490,0x14252b,0);
  const grid=this.add.graphics().lineStyle(1,0x294047,.35);
  for(let x=0;x<1200;x+=40)grid.lineBetween(x,0,x,490);
  for(let y=10;y<490;y+=40)grid.lineBetween(0,y,1200,y);
  this.rect(0,362,1200,128,0x1d3035,0);
  this.add.graphics().lineStyle(1,0x55736f,.45).lineBetween(0,362,1200,362);
  this.text(1025,22,'●  SIMULACIÓN',11,'#abf5cf');
  this.text(170,74,'ESPACIO DOCENTE',12,'#a9d8c9').setOrigin(.5);
  this.text(1030,74,'ESPACIO ESTUDIANTE',12,'#ccc5f0').setOrigin(.5);
  // Central display remains above the characters and carries the current action.
  this.rect(376,48,446,205,0x0b191f,12,.70);this.outline=this.add.graphics();this.tag=this.text(398,66,'',11,'#abf5cf');this.head=this.text(398,91,'',20);this.rows=[];for(let i=0;i<3;i++)this.rows.push(this.text(398,132+i*30,'',15,'#c4d7d4'));
  // Vector cloud: readable on the scenery without depending on an emoji font.
  this.add.ellipse(600,332,148,72,0x102029,.85);
  const cloud=this.add.graphics().fillStyle(0xe3fff5,1);
  cloud.fillRoundedRect(546,321,108,29,14);
  cloud.fillCircle(571,321,20);cloud.fillCircle(598,312,25);cloud.fillCircle(629,323,19);
  this.text(600,358,'PLATAFORMA',12,'#ffffff').setOrigin(.5,0).setShadow(0,1,'#102029',3,true,true);
  this.add.ellipse(200,411,78,11,0x071115,.5);this.studentShadow=this.add.ellipse(1000,411,78,11,0x071115,.5);
  this.prof=this.add.sprite(200,411,'prof',0).setOrigin(.4,1).setDisplaySize(120,113);this.student=this.add.sprite(1000,411,'student',0).setOrigin(.4,1).setDisplaySize(120,109);
  this.text(163,436,'PROFESOR',11,'#abf5cf');this.studentLabel=this.text(1000,436,'ESTUDIANTE',11,'#c2b9ff').setOrigin(.5,0);
  this.packet=this.add.container(0,0);const paper=this.rect(-19,-25,38,50,0xe4f5e9,5),lines=this.add.graphics().lineStyle(2,0x3c7567);for(let i=0;i<3;i++)lines.lineBetween(-10,-10+i*9,10,-10+i*9);this.packet.add([paper,lines]);
  this.noteBox=this.rect(424,386,352,48,0x2b4b43,24);this.note=this.text(600,410,'',14,'#bdf6d7').setOrigin(.5);
  this.resultHit=this.add.zone(600,410,352,48).setInteractive({useHandCursor:true});
  this.resultHit.on('pointerdown',()=>{if(clock>=5*sceneDuration){playing=false;jump(duration);$('result').scrollIntoView({behavior:'smooth',block:'nearest'})}});
  this.progress=this.add.graphics();this.renderStory();$('play').disabled=false;renderUI();
 }
 renderStory(){
  const n=Math.min(5,Math.floor(clock/sceneDuration)),p=Math.min(1,(clock-n*sceneDuration)/sceneDuration),c=chapters[n],frame=Math.floor(clock*6)%7;
  this.tag.setText(`0${n+1}  /  ${c.tag}`);this.head.setText(c.heading);this.outline.clear().lineStyle(1,c.color,.6).strokeRoundedRect(376,48,446,205,12);
  this.rows.forEach((t,i)=>t.setText(`${p>(i+1)*.17?'✓':'○'}   ${c.items[i]}`).setAlpha(p>(i+1)*.17?1:.4));
  const prow=n===0?3:n===4?2:0,srow=n===2?3:n===1?2:0;
  const motion=n===3?studentMotion(p):{x:1000,walking:false,flipX:false};
  this.prof.setFrame(prow*7+frame);
  this.student.setFrame(motion.walking?motion.frame:srow===0?0:srow*7+frame).setFlipX(motion.flipX);
  this.prof.y=411;this.student.y=411;
  this.student.x=motion.x;this.studentShadow.x=motion.x;this.studentLabel.x=motion.x;
  const starts=[[230,355],[600,330],[970,355],[790,355],[600,330],[230,355]],ends=[[600,330],[970,355],[600,330],[600,330],[230,355],[970,355]];
  const a=starts[n],b=ends[n],q=Phaser.Math.Clamp(n===3?(p-.40)/.23:(p-.15)/.65,0,1);
  this.packet.setPosition(Phaser.Math.Linear(a[0],b[0],q),Phaser.Math.Linear(a[1],b[1],q)-Math.sin(q*Math.PI)*22).setVisible(n===3?p>.40&&p<.64:p>.12&&p<.87);
  this.note.setText(p>.73?'✓  '+c.note:n===5?'Guardando el registro…':'●  '+['Diseñando la actividad…','Compartiendo instrucciones…','Desarrollando la solución…','Enviando el producto…','Revisando la entrega…'][n]);
  this.resultHit.input.enabled=n===5;
  const registered=n===5&&p>.73;
  $('result').hidden=!registered;
  if(registered){this.head.setText('Registro académico completado');this.rows[0].setText('✓   Calificación: 4.5 / 5.0 (ejemplo)');this.rows[1].setText('✓   Evidencia: producto entregado');this.rows[2].setText('✓   Retroalimentación archivada')}
  this.progress.clear().fillStyle(c.color,.8).fillRect(0,486,1200*(clock/duration),4);
 }
 update(_time,delta){if(playing){clock=Math.min(duration,clock+Math.min(delta,100)/1000*rate);if(clock===duration)playing=false;this.renderStory();renderUI()}}
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1200,height:490,backgroundColor:'#14252b',transparent:false,render:{antialias:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Circuito});
