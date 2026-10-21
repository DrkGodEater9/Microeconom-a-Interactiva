/** Capítulo 1 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { def, ex, warn, eqn, fig } from '../../engine/blocks.js';

FIGS.c1_margen = {
  title:'La elección en el margen: ¿cuántas horas más estudio?',
  intro:'Cada hora extra de estudio tiene un beneficio (azul) y un costo de oportunidad (rojo). Decidir «en el margen» es comparar esas dos cosas, hora por hora.',
  x:{label:'Horas de estudio por día',max:8,ticks:[0,1,2,3,4,5,6,7,8]}, y:{label:'Valor de una hora más (en $)',max:24,ticks:[0,6,12,18,24],fmt:v=>'$'+v},
  controls:[
    {id:'w',label:'Lo que dejas de ganar por hora de estudio',min:2,max:14,step:.5,value:8,fmt:v=>'$'+fn(v,1),
     hint:'Es el costo de oportunidad: lo mejor que podrías hacer con esa hora (trabajar, descansar). Si sube, estudiar «sale más caro» y conviene estudiar menos.'},
    {id:'h',label:'Horas que decides estudiar',min:0,max:8,step:.1,value:3,fmt:v=>fn(v,1)+' h',
     hint:'Arrástralo y mira si la última hora que agregas vale más de lo que cuesta.'}],
  build(s){
    const MB=h=>24-3*h, MC=s.w, hs=(24-s.w)/3, h=s.h;
    const els=[
      {k:'line',id:'mb',color:'blue',pts:[[0,24],[8,0]],label:'BM',legend:'Beneficio marginal (BM)',info:['Beneficio marginal (BM)','Lo que te aporta <b>una hora más</b> de estudio. Baja al aumentar las horas: la primera hora te enseña mucho; la octava, casi nada nuevo. Por eso la línea desciende.']},
      {k:'line',id:'mc',color:'red',pts:[[0,MC],[8,MC]],label:'CM',legend:'Costo marginal (CM)',info:['Costo marginal (CM)','Lo que <b>cuesta</b> una hora más: es lo que dejas de ganar o disfrutar (costo de oportunidad). Aquí lo suponemos constante, por eso es una línea horizontal.']}];
    const gain=[[0,MB(0)],[Math.min(h,hs),MB(Math.min(h,hs))],[Math.min(h,hs),MC],[0,MC]];
    els.push({k:'area',id:'gan',color:'green',pts:gain,op:.3,legend:'Beneficio neto ganado',info:['Beneficio neto ganado','Entre 0 horas y el óptimo, cada hora aporta <b>más de lo que cuesta</b>. Esta zona verde es lo que ganas por estudiar esas horas: el beneficio extra menos el costo.']});
    if(h>hs) els.push({k:'area',id:'per',color:'red',pts:[[hs,MC],[h,MC],[h,MB(h)]],op:.35,legend:'Pérdida por estudiar de más',info:['Pérdida por estudiar de más','Después del óptimo, cada hora cuesta <b>más de lo que aporta</b>. Este triángulo rojo es lo que pierdes por pasarte: estás gastando tiempo valioso en algo que ya no rinde.']});
    els.push({k:'pt',id:'opt',color:'green',at:[hs,MC],guides:true,gx:fn(hs,1)+' h',gy:'$'+fn(MC,1),label:'Óptimo',legend:'Punto óptimo (BM = CM)',info:['Punto óptimo: BM = CM','Aquí la última hora aporta exactamente lo que cuesta. Si estudias menos, desperdicias horas que valían la pena. Si estudias más, pierdes horas que ya no valen la pena. <b>La elección racional se detiene donde BM = CM.</b>']});
    els.push({k:'pt',id:'elec',color:'purple',at:[h,MB(h)],r:5,label:'Tu elección',legend:'Tu elección actual',info:['Tu elección actual','Estás estudiando '+fn(h,1)+' horas. La última hora que agregaste aporta '+f$(MB(h),1)+' y cuesta '+f$(MC,1)+'.']});
    const dif=MB(h)-MC;
    return {els,read:[['Horas óptimas',fn(hs,1)+' h','green'],['Tu elección',fn(h,1)+' h','purple'],['BM − CM de tu última hora',f$(dif,1),dif>=0?'green':'red']],
      say: hs<=0?'<p>El costo es tan alto que no conviene estudiar ni una hora.</p>':
       `<p>Con un costo de ${f$(s.w,1)} por hora, lo mejor es estudiar <b>${fn(hs,1)} horas</b>, donde la curva azul cruza la roja.</p>`+
       (Math.abs(h-hs)<0.15?'<p>¡Estás en el óptimo! La última hora aporta casi lo mismo que cuesta.</p>':
        h<hs?`<p>Estás estudiando <b>poco</b>: la última hora aporta ${f$(MB(h),1)} y solo cuesta ${f$(MC,1)}. Conviene seguir.</p>`:
        `<p>Estás estudiando <b>de más</b>: la última hora aporta ${f$(MB(h),1)} pero cuesta ${f$(MC,1)}. Conviene parar antes.</p>`)};
  }
};
FIGS.c1_pendiente = {
  title:'La pendiente: cuánto sube (o baja) la línea por cada paso',
  intro:'Pendiente = cambio en y ÷ cambio en x (cuánto subes dividido entre cuánto avanzas). Mueve los controles y mira cómo cambia el triángulo.',
  x:{label:'Variable x (eje horizontal)',max:10,ticks:[0,2,4,6,8,10]}, y:{label:'Variable y (eje vertical)',max:24,ticks:[0,6,12,18,24]},
  controls:[
    {id:'a',label:'Dónde empieza la línea (cuando x = 0)',min:6,max:12,step:.5,value:8,fmt:v=>fn(v,1),hint:'Es el «intercepto»: la altura donde la línea toca el eje vertical.'},
    {id:'b',label:'Pendiente de la línea',min:-.6,max:1.2,step:.1,value:.6,fmt:v=>fn(v,1),hint:'Positiva: la línea sube (x e y se mueven juntas). Negativa: baja (se mueven en sentido contrario). Cero: horizontal.'},
    {id:'x1',label:'Punto inicial (x)',min:1,max:6,step:.5,value:2,fmt:v=>fn(v,1)},
    {id:'dx',label:'Cuánto avanzas en x',min:1,max:3,step:.5,value:3,fmt:v=>fn(v,1)}],
  build(s){
    const y=x=>s.a+s.b*x, x2=s.x1+s.dx, p1=[s.x1,y(s.x1)], p2=[x2,y(x2)], dy=p2[1]-p1[1];
    const els=[
      {k:'line',id:'rec',color:'blue',pts:[[0,y(0)],[10,y(10)]],legend:'La línea',label:'y = '+fn(s.a,1)+(s.b<0?' − ':' + ')+fn(Math.abs(s.b),1)+'x',info:['La línea (relación entre x e y)','Cada punto de la línea es una pareja (x, y) que cumple la relación. Su inclinación es la pendiente: '+fn(s.b,1)+'. Es la misma en todos los tramos porque es una línea recta.']},
      {k:'line',id:'run',color:'amber',pts:[p1,[x2,p1[1]]],w:3.4,legend:'Avance en x (Δx)',info:['Avance horizontal: Δx = '+fn(s.dx,1),'Es cuánto te mueves hacia la derecha. La letra griega Δ («delta») significa «cambio en».']},
      {k:'line',id:'rise',color:'red',pts:[[x2,p1[1]],p2],w:3.4,legend:'Subida o bajada en y (Δy)',info:['Cambio vertical: Δy = '+fn(dy,1),'Es cuánto sube (si es positivo) o baja (si es negativo) la línea al avanzar Δx. Pendiente = Δy ÷ Δx = '+fn(dy,1)+' ÷ '+fn(s.dx,1)+' = '+fn(s.b,1)+'.']},
      {k:'pt',id:'p1',color:'ink',at:p1,r:5,label:'Inicio',info:['Punto inicial','Desde aquí empezamos a medir. Sus coordenadas: x = '+fn(p1[0],1)+', y = '+fn(p1[1],1)+'.'],legend:false},
      {k:'pt',id:'p2',color:'ink',at:p2,r:5,label:'Final',info:['Punto final','Después de avanzar Δx. Sus coordenadas: x = '+fn(p2[0],1)+', y = '+fn(p2[1],1)+'.'],legend:false}];
    return {els,read:[['Δx',fn(s.dx,1),'amber'],['Δy',fn(dy,1),'red'],['Pendiente = Δy ÷ Δx',fn(s.b,1),'blue']],
     say:`<p>Avanzas <b>${fn(s.dx,1)}</b> a la derecha y la línea ${dy>0?'sube':dy<0?'baja':'no cambia'} <b>${fn(Math.abs(dy),1)}</b>. Pendiente = ${fn(dy,1)} ÷ ${fn(s.dx,1)} = <b>${fn(s.b,1)}</b>.</p><p>${s.b>0?'Pendiente positiva: x e y suben juntas (por ejemplo, más horas de trabajo, más ingreso).':s.b<0?'Pendiente negativa: cuando una sube, la otra baja (por ejemplo, un precio más alto, menor cantidad demandada).':'Pendiente cero: y no depende de x.'}</p>`};
  }
};
const REL={
 pos:{n:'Misma dirección (relación positiva)',f:x=>1+.9*x,d:()=>.9,ex:'Más horas de trabajo → más ingreso. Cuando una variable sube, la otra también.'},
 neg:{n:'Direcciones opuestas (relación negativa)',f:x=>9-.8*x,d:()=>-.8,ex:'Mayor precio de un bien → menor cantidad que la gente quiere comprar. Una sube y la otra baja.'},
 max:{n:'Con un máximo',f:x=>9-.5*(x-5)**2,d:x=>-(x-5),ex:'Horas de estudio y bienestar: al principio más estudio mejora todo, pero pasado cierto punto el cansancio empeora las cosas. Hay una cima.'},
 min:{n:'Con un mínimo',f:x=>1.5+.5*(x-5)**2,d:x=>(x-5),ex:'Costo por unidad y producción: producir muy poco o demasiado sale caro por unidad; en medio hay un punto de costo más bajo.'},
 none:{n:'Sin relación',f:()=>5,d:()=>0,ex:'El precio del café en Colombia y la temperatura en Marte: no tienen nada que ver; una cambia sin que la otra se mueva.'}};
FIGS.c1_relaciones = {
  title:'Los cinco tipos de relación entre dos variables',
  intro:'Elige un tipo y recorre la curva con el control. La línea corta que se dibuja sobre la curva es la pendiente en ese punto.',
  x:{label:'Variable x',max:10,ticks:[0,2,4,6,8,10]}, y:{label:'Variable y',max:10,ticks:[0,2,4,6,8,10]},
  controls:[{id:'t',type:'seg',label:'Tipo de relación',value:'pos',options:Object.keys(REL).map(k=>[k,REL[k].n.split(' (')[0]])},
            {id:'x',label:'Punto de la curva donde miras',min:.5,max:9.5,step:.1,value:2,fmt:v=>fn(v,1),hint:'La pendiente en cada punto te dice hacia dónde va la relación justo ahí.'}],
  build(s){
    const R=REL[s.t], x=s.x, y=R.f(x), m=R.d(x), L=1.3;
    const tan=[[x-L,y-L*m],[x+L,y+L*m]];
    const els=[
      {k:'line',id:'cur',color:'blue',pts:curve(R.f,0,10,80),legend:'La relación',info:[R.n,R.ex]},
      {k:'line',id:'tan',color:'red',pts:tan,w:4,legend:'Pendiente en el punto',info:['Pendiente en el punto elegido','Es la inclinación de la curva justo aquí: '+fn(m,2)+'. '+(m>.05?'Positiva: si x aumenta un poco, y también.':m<-.05?'Negativa: si x aumenta un poco, y baja.':'Cero: la curva está plana; si x cambia un poco, y casi no cambia. Aquí está el máximo o el mínimo (o no hay relación).')]},
      {k:'pt',id:'p',color:'purple',at:[x,y],guides:true,legend:false,info:['El punto donde miras','Coordenadas: x = '+fn(x,1)+', y = '+fn(y,1)+'.']}];
    let extra='';
    if(s.t==='max') extra=Math.abs(m)<.15?'<p><b>¡Estás en la cima!</b> La pendiente es cero: es el máximo.</p>':m>0?'<p>Antes del máximo la pendiente es positiva (la curva sube).</p>':'<p>Después del máximo la pendiente es negativa (la curva baja).</p>';
    if(s.t==='min') extra=Math.abs(m)<.15?'<p><b>¡Estás en el fondo!</b> La pendiente es cero: es el mínimo.</p>':m<0?'<p>Antes del mínimo la pendiente es negativa (la curva baja).</p>':'<p>Después del mínimo la pendiente es positiva (la curva sube).</p>';
    return {els,read:[['Pendiente aquí',fn(m,2),'red'],['x',fn(x,1),'purple'],['y',fn(y,1),'purple']],say:`<p>${R.ex}</p>${extra}`};
  }
};
CHAPTERS.push({id:1,title:'¿Qué es la economía?',
teaser:'Escasez, elección, costo de oportunidad, incentivos y cómo leer gráficas.',
bigq:'Cada día decides en qué usar tu tiempo y tu dinero, y todos tus compañeros hacen lo mismo. ¿Cómo piensa un economista esas decisiones, y cuándo lo que es bueno para cada uno resulta bueno para todos?',
learn:['Explicar qué significa escasez y por qué obliga a elegir.','Distinguir micro de macroeconomía y las preguntas «qué, cómo y para quién».','Calcular el costo de oportunidad de una decisión y decidir «en el margen».','Leer una gráfica: ejes, pendiente y los cinco tipos de relación.'],
html:`
<h2>1. Una definición de economía</h2>
<p>Piensa en tu fin de semana. Tienes 48 horas y mucho que podrías hacer: dormir, estudiar, trabajar, salir con amigos. No alcanzan las horas para todo. Esa situación tiene nombre: <b>escasez</b>. La escasez significa que nuestros deseos son mayores que lo que podemos obtener con los recursos que tenemos.</p>
${def('Escasez','<p>Tus deseos no tienen fin, pero tu tiempo, tu dinero y los recursos del planeta sí. Como no puedes tenerlo todo, siempre tienes que <b>elegir</b>.</p>')}
<p>La <b>economía</b> es la ciencia social que estudia las <b>elecciones</b> que hacen las personas, las empresas y los gobiernos para enfrentar la escasez, y cómo esas elecciones se combinan e influyen unas en otras. Fíjate: no se trata solo de dinero. Se trata de elegir.</p>
<h3>Micro y macro</h3>
<ul>
<li><b>Microeconomía:</b> estudia las decisiones individuales —un consumidor, una empresa, un trabajador— y cómo interactúan en mercados concretos (el mercado de pizzas, el de computadoras, el de trabajo). Este curso es de microeconomía.</li>
<li><b>Macroeconomía:</b> estudia la economía como un todo: la inflación, el desempleo, el crecimiento de un país entero.</li>
</ul>
<p>Una forma fácil de recordarlo: la micro mira un árbol; la macro mira el bosque.</p>

<h2>2. Dos grandes preguntas de la economía</h2>
<h3>Pregunta 1: ¿qué, cómo y para quién?</h3>
<p>Toda sociedad tiene que resolver tres problemas, porque sus recursos son limitados:</p>
<ul>
<li><b>¿Qué bienes y servicios se producen?</b> ¿Más computadoras o más hospitales? ¿Más autos o más escuelas?</li>
<li><b>¿Cómo se producen?</b> ¿Con muchas máquinas y pocos trabajadores, o al revés? ¿Con qué tecnología?</li>
<li><b>¿Para quién se producen?</b> ¿Quién recibe lo producido? Depende de los ingresos que obtiene cada persona por su trabajo, su tierra, su capital o su talento empresarial.</li>
</ul>
<h3>Pregunta 2: ¿el interés personal sirve también al interés social?</h3>
<p>Cada uno de nosotros busca su propio beneficio (<b>interés personal</b>). Pero la sociedad como conjunto tiene un <b>interés social</b>: lo que es mejor para todos. La gran pregunta es: <i>¿cuándo la suma de millones de decisiones egoístas produce un buen resultado para todos?</i></p>
<p>Adam Smith, el padre de la economía, llamó a esto la <b>«mano invisible»</b>: en un mercado competitivo, cada persona al buscar su beneficio es guiada, sin proponérselo, a promover el bien común. Pero esto no siempre ocurre. Cuando una empresa contamina un río, su interés personal (ganar más) choca con el interés social (agua limpia). A lo largo del curso verás cuándo la mano invisible funciona y cuándo falla.</p>

<h2>3. El razonamiento económico</h2>
<p>Los economistas usan cinco ideas una y otra vez. Aprenderlas bien es la mitad del curso.</p>
<h3>Elecciones e intercambios (trade-offs)</h3>
<p>Un <b>intercambio</b> o disyuntiva significa que para obtener algo tienes que renunciar a otra cosa. Más tiempo en el gimnasio significa menos tiempo para dormir. Más gasto en defensa significa menos gasto en educación.</p>
<h3>Costo de oportunidad</h3>
${def('Costo de oportunidad','<p>Es el valor de <b>la mejor alternativa a la que renuncias</b> cuando tomas una decisión. No es la suma de todo lo que sacrificas: es solo la <b>mejor</b> opción que dejaste.</p>')}
${ex('Ejemplo','<p>Tienes una tarde libre y puedes (a) trabajar en una tienda y ganar $400, (b) estudiar para tu examen o (c) ver una película con amigos. Eliges la película. El costo de oportunidad de la película no es $400 + estudiar; es lo mejor de las dos que dejaste. Si estudiar para tu examen valía más que $400 para ti, ése es el costo.</p>')}
${warn('<p>Mucha gente cree que el costo de oportunidad es solo el dinero que pagas. No. Si un boleto de cine cuesta $8, el costo de oportunidad también incluye <b>lo que podrías haber hecho con esas dos horas y con esos $8</b>.</p>')}
<h3>Elegir en el margen</h3>
<p>Rara vez decides entre «todo o nada». Decides <b>un poco más o un poco menos</b>: una hora más de estudio, una pizza más, un trabajador más. Eso se llama elegir en el <b>margen</b>. Para cada paso comparas dos cosas:</p>
<ul>
<li><b>Beneficio marginal (BM):</b> lo que ganas con la unidad adicional.</li>
<li><b>Costo marginal (CM):</b> lo que cuesta la unidad adicional.</li>
</ul>
<p>Si BM &gt; CM, haz una más. Si BM &lt; CM, detente. El mejor punto está donde se igualan. Prueba esto en la gráfica.</p>
${fig('c1_margen')}
<p>Fíjate en algo clave: no importa cuánto ya estudiaste; lo que importa es si la <i>siguiente</i> hora vale más de lo que cuesta. Esa lógica se usa en todo el libro.</p>
<h3>Respuesta a los incentivos</h3>
<p>Un <b>incentivo</b> es una recompensa que anima a hacer algo o un castigo que desanima. La gente responde a incentivos: si sube el precio de la gasolina, usas menos el auto; si hay un descuento, compras más. «Si cambian los incentivos, cambia el comportamiento» es una de las ideas más poderosas de la economía.</p>

<h2>4. Economía: una ciencia social</h2>
<p>Los economistas trabajan como científicos: <b>observan y miden</b> hechos, construyen <b>modelos</b> (versiones simplificadas de la realidad, como un mapa) y <b>prueban</b> esos modelos contra los datos. Un mapa no muestra cada casa y por eso sirve. Un modelo económico deja fuera detalles para concentrarse en lo importante.</p>
<p>Un truco fundamental de los modelos es <i>ceteris paribus</i> («todo lo demás constante»). Para saber cómo afecta el precio a la cantidad que compras, imaginamos que tu ingreso, tus gustos y los demás precios no cambian. Sin ese supuesto no podríamos separar causas.</p>
${warn('<p><b>Falacia de la composición:</b> lo que es cierto para una parte no siempre es cierto para el todo. Si una persona se pone de pie en un estadio, ve mejor; si todos se ponen de pie, nadie ve mejor.<br><b>Falacia post hoc:</b> pensar que si B ocurrió después de A, entonces A causó B. El gallo canta y luego sale el sol, pero el gallo no causa el amanecer.</p>','Dos errores de razonamiento que debes evitar')}
<p>Algo más: los economistas distinguen entre <b>enunciados positivos</b> (lo que es: «el salario mínimo reduce el empleo») y <b>normativos</b> (lo que debería ser: «el salario mínimo debería subir»). Los primeros se pueden probar con datos; los segundos dependen de valores. Los economistas pueden coincidir en lo positivo y discrepar en lo normativo.</p>

<h2>Apéndice: cómo leer gráficas (desde cero)</h2>
<p>En economía una gráfica vale más que mil palabras, así que dominarlas es indispensable. Una gráfica tiene dos <b>ejes</b>: el horizontal (eje <i>x</i>) y el vertical (eje <i>y</i>). Cada punto muestra el valor de dos variables a la vez. Por ejemplo, si en el eje x pones «horas estudiadas» y en el y tu «nota», un punto en (3, 7) significa «estudié 3 horas y saqué 7».</p>
<h3>La pendiente</h3>
<p>La <b>pendiente</b> mide qué tan inclinada está una línea. Es el cambio en la variable vertical (<i>Δy</i>) dividido entre el cambio en la horizontal (<i>Δx</i>):</p>
${eqn('Pendiente = Δy ÷ Δx','Δ (delta) significa «cambio en». Es «cuánto subes entre cuánto avanzas».')}
${fig('c1_pendiente')}
<h3>Cinco tipos de relación</h3>
<p>Dos variables pueden estar relacionadas de cinco maneras. Para curvas, la pendiente cambia de punto en punto: la pendiente en un punto es la de una línea recta que apenas toca la curva allí (la «tangente»).</p>
${fig('c1_relaciones')}
<div class="tip"><b>Cómo reconocer un máximo o un mínimo</b><p>En la cima o en el fondo de una curva la pendiente es cero (la curva se «aplana» un instante). Antes de la cima la pendiente es positiva y después es negativa. Esta idea reaparece al estudiar cuánto producir para tener máximo beneficio.</p></div>
<p>Una última advertencia sobre gráficas: cuando dos variables parecen moverse juntas, no necesariamente una causa a la otra. Un economista siempre pregunta: <i>¿qué otra variable podría estar cambiando al mismo tiempo?</i></p>
`,
terms:[['Escasez','Deseos ilimitados frente a recursos limitados. Obliga a elegir.'],['Economía','Ciencia que estudia las elecciones ante la escasez y cómo se combinan.'],['Microeconomía','Estudia las decisiones de consumidores, empresas y mercados individuales.'],['Macroeconomía','Estudia la economía en conjunto: inflación, desempleo, crecimiento.'],['Costo de oportunidad','Valor de la mejor alternativa a la que renuncias al decidir.'],['Margen','Un pequeño cambio: una unidad más o una menos. Elegir en el margen es comparar BM y CM.'],['Incentivo','Premio o castigo que cambia el comportamiento.'],['Ceteris paribus','«Todo lo demás constante». Permite aislar el efecto de una sola variable.'],['Mano invisible','Idea de Adam Smith: en mercados competitivos, el interés personal puede llevar al interés social.'],['Pendiente','Δy ÷ Δx: cuánto cambia y por cada unidad que cambia x.']],
quiz:[
 {q:'El año pasado Ana dejó un empleo de $1,200 al mes para estudiar. Podía haber (b) viajar o (c) descansar, que valían menos para ella. ¿Cuál es el costo de oportunidad de estudiar?',o:['Los $1,200 del empleo (la mejor alternativa)','$1,200 más el viaje más el descanso','Solo la matrícula','Cero, porque estudiar es una inversión'],a:0,why:'El costo de oportunidad es el valor de la <b>mejor</b> alternativa sacrificada, no la suma de todas.'},
 {q:'Una empresa contrata un trabajador más si:',o:['Su beneficio marginal es mayor que su costo marginal','El trabajador es el más barato del mercado','Su costo total ya es muy bajo','Todas las demás empresas lo hacen'],a:0,why:'Elegir en el margen es comparar el beneficio de la unidad adicional con su costo. Si BM &gt; CM, conviene.'},
 {q:'Si la pendiente de una relación es negativa, entonces:',o:['Cuando x sube, y baja','Cuando x sube, y sube','y no depende de x','Hay un máximo'],a:0,why:'Pendiente negativa = variables que se mueven en direcciones opuestas, como precio y cantidad demandada.'},
 {q:'«Los aumentos de salario mínimo reducen el empleo» es un enunciado:',o:['Positivo: se puede contrastar con datos','Normativo: expresa un valor','Sin sentido económico','Ceteris paribus siempre falso'],a:0,why:'Un enunciado positivo describe lo que es y puede probarse. «Debería subir» sería normativo.'}]});
