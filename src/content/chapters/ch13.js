/** Capítulo 13 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { def, warn, fig, figAgain } from '../../engine/blocks.js';

const F13=30, aLR13=2+Math.sqrt(180);
FIGS.c13_mc = {
  title:'Competencia monopolística: del beneficio al beneficio cero (ejemplo ilustrativo)',
  intro:'Cada empresa vende un producto diferenciado y, por eso, tiene una demanda inclinada. Si gana beneficios, entran rivales y su demanda se reduce hasta que no hay beneficio económico.',
  x:{label:'Cantidad de la empresa',max:16,ticks:[0,2,4,6,8,10,12,14,16]}, y:{label:'Precio y costo ($)',max:24,ticks:[0,4,8,12,16,20,24],fmt:v=>'$'+v},
  controls:[
   {id:'a',label:'Demanda que enfrenta la empresa',min:12,max:24,step:.1,value:22,fmt:v=>fn(v,1)+(v>aLR13+.2?' (alta)':v<aLR13-.2?' (baja)':' (equilibrio)'),hint:'Cuando entran más empresas con productos parecidos, la demanda de cada una disminuye (se desplaza a la izquierda).'},
   {type:'btn',label:'Dejar que entren/salgan empresas (largo plazo)',act:(st,draw)=>{ const a0=st.a,t0=performance.now(); const step=t=>{ const k=Math.min(1,(t-t0)/1200); st.a=a0+(aLR13-a0)*k; draw(); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }}],
  build(s){
    const a=s.a, q=(a-2)/3, P=a-q, MCq=2+q, ATC=q=>F13/q+2+q/2, atc=ATC(q), prof=(P-atc)*q, qm=Math.sqrt(2*F13), idle=qm-q;
    const els=[
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,a],[Math.min(16,a),Math.max(0,a-16)]],label:'Demanda',legend:'Demanda de la empresa',info:['Demanda de la empresa','Como su producto es <b>diferenciado</b> (hay sustitutos, pero no idénticos), puede subir el precio sin perder a todos sus clientes: la demanda tiene pendiente negativa. Pero cuantos más rivales, más elástica y más a la izquierda.']},
     {k:'line',id:'im',color:'purple',w:3.2,pts:[[0,a],[a/2,0]],label:'IM',lp:1,legend:'Ingreso marginal',info:['Ingreso marginal','Igual que en el monopolio: menor que el precio porque para vender más hay que bajar el precio.']},
     {k:'line',id:'cm',color:'red',w:3.4,pts:[[0,2],[16,18]],label:'CM',lp:1,legend:'Costo marginal',info:['Costo marginal','CM = 2 + q.']},
     {k:'line',id:'ct',color:'teal',w:3.4,pts:curve(ATC,1.8,16,70).filter(p=>p[1]<=24),label:'CTMe',lp:60,legend:'Costo total medio',info:['Costo total medio','Forma de U. Su mínimo está en q ≈ '+fn(qm,1)+'.']},
     {k:'area',id:'pf',color:prof>=0?'green':'red',op:.32,pts:[[0,P],[q,P],[q,atc],[0,atc]],label:{t:Math.abs(prof)>.3?(prof>0?'Beneficio ':'Pérdida ')+f$(Math.abs(prof),1):'',at:[q/2,(P+atc)/2]},legend:prof>=0?'Beneficio económico':'Pérdida económica',info:[prof>=0?'Beneficio económico':'Pérdida económica','(precio − CTMe) × cantidad = ('+f$(P,2)+' − '+f$(atc,2)+') × '+fn(q,2)+' = '+f$(prof,1)+'. '+(prof>.3?'Atrae a nuevos competidores.':prof<-.3?'Hará que algunas empresas salgan.':'Equilibrio de largo plazo: sin entradas ni salidas.')]},
     {k:'pt',id:'e',color:'green',at:[q,P],r:8,guides:true,gx:fn(q,1),gy:f$(P,2),label:{t:'Óptimo',dx:12,dy:-12},legend:'Producción y precio',info:['Producción y precio de la empresa','Produce donde <b>IM = CM</b> y cobra el precio de la demanda: '+f$(P,2)+', por encima del costo marginal ('+f$(MCq,2)+'). Hay un margen: precio − CM.']},
     {k:'pt',id:'m',color:'amber',at:[qm,ATC(qm)],r:6,label:{t:'Escala eficiente',dx:-6,dy:-12,anchor:'end'},legend:'Escala eficiente (mín. CTMe)',info:['Escala eficiente','Donde el costo medio es mínimo. En competencia perfecta cada empresa produciría aquí; en competencia monopolística, no.']}];
    if(idle>.2) els.push({k:'line',id:'ex',color:'amber',w:6,pts:[[q,.8],[qm,.8]],label:{t:'Capacidad ociosa',at:[(q+qm)/2,.8],dy:-10},legend:'Capacidad ociosa',info:['Capacidad ociosa','Es la diferencia entre la <b>escala eficiente</b> y lo que realmente produce la empresa. Se produce menos de lo que la planta podría hacer al menor costo medio: es el precio de tener variedad de productos.']});
    return {els,read:[['Producción',fn(q,2),'green'],['Precio',f$(P,2),'blue'],['Beneficio',f$(prof,1),prof>.3?'green':prof<-.3?'red':'gray'],['Margen (P − CM)',f$(P-MCq,2),'amber']],
     say:Math.abs(prof)<.3?`<p><b>Equilibrio de largo plazo</b>: la curva de demanda es <b>tangente</b> al costo total medio. Beneficio económico cero. Pero fíjate: el precio (${f$(P,2)}) es mayor que el CM y la empresa produce <b>menos</b> que la escala eficiente: hay <b>capacidad ociosa</b> de ${fn(idle,1)} unidades.</p>`:prof>0?`<p>La empresa gana <b>${f$(prof,1)}</b>. Como no hay barreras a la entrada, llegan rivales con productos parecidos: la demanda de cada empresa baja. Pulsa el botón.</p>`:`<p>La empresa pierde <b>${f$(-prof,1)}</b>: algunas saldrán, y la demanda de las que quedan aumenta. Pulsa el botón.</p>`};
  }
};
FIGS.c13_game = {
  title:'El dilema de los prisioneros en un duopolio (pagos ilustrativos, en millones de $)',
  intro:'Dos empresas pueden mantener un acuerdo de precio alto o romperlo con un precio bajo. Elige la estrategia de cada una y mira el resultado. Activa «mejores respuestas» para ver por qué el acuerdo es inestable.',
  axes:false, x:{max:100}, y:{max:100}, h:380,
  controls:[
   {id:'a',type:'seg',label:'Empresa A elige…',value:'r',options:[['m','Mantener precio alto'],['r','Romper el acuerdo']]},
   {id:'b',type:'seg',label:'Empresa B elige…',value:'r',options:[['m','Mantener precio alto'],['r','Romper el acuerdo']]},
   {id:'br',type:'toggle',label:'Mostrar mejores respuestas',value:true}],
  build(s){
    const pay={mm:[3,3],mr:[0,5],rm:[5,0],rr:[1,1]}; // clave: (A,B)
    const cells=[{k:'mm',at:[33,58],A:'m',B:'m'},{k:'mr',at:[75,58],A:'m',B:'r'},{k:'rm',at:[33,22],A:'r',B:'m'},{k:'rr',at:[75,22],A:'r',B:'r'}];
    const els=[];
    els.push({k:'txt',at:[36,92],t:'B mantiene',plain:true,bold:true,size:14});
    els.push({k:'txt',at:[78,92],t:'B rompe',plain:true,bold:true,size:14});
    els.push({k:'txt',at:[1,58],t:'A\nmantiene',plain:true,bold:true,size:14,anchor:'start'});
    els.push({k:'txt',at:[1,22],t:'A\nrompe',plain:true,bold:true,size:14,anchor:'start'});
    const nameC={mm:'Ambos mantienen el acuerdo (cártel)',mr:'A mantiene y B rompe',rm:'A rompe y B mantiene',rr:'Ambos rompen: guerra de precios'};
    cells.forEach(c=>{ const [pa,pb]=pay[c.A+c.B]; const sel=(c.A===s.a&&c.B===s.b);
      const bestA=pay[c.A+c.B][0]>=pay[(c.A==='m'?'r':'m')+c.B][0], bestB=pay[c.A+c.B][1]>=pay[c.A+(c.B==='m'?'r':'m')][1];
      const nash=bestA&&bestB;
      els.push({k:'box',id:'c'+c.k,color:nash&&s.br?'green':sel?'blue':'gray',op:sel?.34:nash&&s.br?.2:.08,at:[c.at[0]+3,c.at[1]],w:36,h:30,t:'A: '+f$(pa,0).replace('$','$')+' M\nB: '+f$(pb,0)+' M'+(s.br?'\n'+(bestA?'A ✔ ':'')+(bestB?'B ✔':''):''),legend:nameC[c.k],
        info:[nameC[c.k],'Beneficio de A: <b>$'+pa+' millones</b>; de B: <b>$'+pb+' millones</b>. '+(c.k==='rr'?'Es el <b>equilibrio de Nash</b>: ninguna empresa puede mejorar cambiando sola su estrategia. Pero ambas ganan menos que si cooperaran.':c.k==='mm'?'Es lo mejor para las dos en conjunto, pero <b>no es estable</b>: cada una gana más si rompe el acuerdo mientras la otra lo mantiene.':'Quien rompe gana mucho ($5M); quien mantiene el acuerdo queda con $0.')]}); });
    const [ga,gb]=pay[s.a+s.b];
    const say=`<p>Resultado: <b>${nameC[s.a+s.b]}</b>. A gana $${ga}M y B gana $${gb}M.</p>`+(s.br?`<p><b>Mejores respuestas (✔):</b> sea lo que haga B, a A le conviene <b>romper</b> (gana 5 en vez de 3, o 1 en vez de 0). Igual a B. Por eso las dos rompen y terminan en (1, 1), aunque con (3, 3) estarían mejor. Es el <b>dilema de los prisioneros</b>: la búsqueda del interés personal no conduce al mejor resultado conjunto.</p>`:'<p>Prueba distintas combinaciones y activa las mejores respuestas.</p>')+'<p>Por eso los cárteles son inestables: todos tienen incentivo a hacer trampa. Solo se sostienen con castigos creíbles (juegos repetidos), vigilancia o, en muchos países, no se permiten por ley.</p>';
    return {els,read:[['Beneficio de A',f$(ga,0)+' M','blue'],['Beneficio de B',f$(gb,0)+' M','red'],['Total conjunto',f$(ga+gb,0)+' M','gray']],say,sayTitle:'Qué pasa'};
  }
};
FIGS.c13_kink = {
  title:'Demanda quebrada: por qué los precios en un oligopolio son rígidos (ejemplo ilustrativo)',
  intro:'Si una empresa sube el precio, los rivales <i>no</i> la siguen (pierde muchos clientes); si lo baja, <i>sí</i> la siguen (gana pocos). Resultado: la demanda tiene un «quiebre» en el precio actual.',
  x:{label:'Cantidad',max:20,ticks:[0,4,8,12,16,20]}, y:{label:'Precio y costo ($)',max:26,ticks:[0,5,10,15,20,25],fmt:v=>'$'+v},
  controls:[{id:'c',label:'Costo marginal',min:1,max:22,step:.5,value:8,fmt:v=>f$(v,1),hint:'Mientras el CM se mueva dentro del «salto» del ingreso marginal (entre $0 y $16), el precio y la cantidad no cambian.'}],
  build(s){
    const c=s.c, inGap=c<=16, Q=inGap?10:(24-c)/.8, P=inGap?20:24-.4*Q;
    const els=[
     {k:'line',id:'d1',color:'blue',w:3.6,pts:[[0,24],[10,20]],label:'Demanda elástica',legend:'Tramo elástico (precio arriba)',info:['Tramo elástico','Si la empresa <b>sube</b> su precio por encima de $20, los rivales no la imitan y los clientes se van con ellos: la demanda es muy elástica (plana).']},
     {k:'line',id:'d2',color:'teal',w:3.6,pts:[[10,20],[20,0]],label:'Demanda inelástica',legend:'Tramo inelástico (precio abajo)',info:['Tramo inelástico','Si la empresa <b>baja</b> su precio, los rivales la imitan para no perder clientes: casi no gana participación. La demanda es muy inelástica (empinada).']},
     {k:'line',id:'m1',color:'purple',w:3,pts:[[0,24],[10,16]],legend:'IM del tramo elástico',info:['Ingreso marginal (tramo elástico)','IM = 24 − 0.8Q, hasta Q = 10.']},
     {k:'line',id:'gap',color:'amber',w:7,pts:[[10,0],[10,16]],label:{t:'Salto del IM',at:[10,8],dx:8,dy:0,anchor:'start'},legend:'Salto («gap») del ingreso marginal',info:['El salto del ingreso marginal','En el quiebre el IM salta de $16 a $0 (y sigue cayendo en el tramo inelástico). Cualquier CM que cruce el salto produce <b>la misma cantidad y el mismo precio</b>. Ésa es la explicación de la rigidez de precios.']},
     {k:'line',id:'cm',color:'red',w:3.4,pts:[[0,c],[20,c]],label:{t:'CM',at:[0,c],dx:6,dy:-8},legend:'Costo marginal',info:['Costo marginal','Mueve el control: dentro del salto no pasa nada.']},
     {k:'pt',id:'e',color:'green',at:[Q,P],r:8,guides:true,gx:fn(Q,1),gy:f$(P,2),label:{t:'Óptimo',dx:12,dy:-12},legend:'Producción y precio',info:['Producción y precio óptimos',inGap?'El CM cruza el salto del IM: la empresa produce donde está el quiebre: 10 unidades a $20.':'El CM es tan alto que ya cruza el tramo de IM elástico: la empresa reduce la producción y sube el precio.']}];
    return {els,read:[['Cantidad',fn(Q,1),'green'],['Precio',f$(P,2),'blue']],
     say:inGap?`<p>Con un CM de ${f$(c,1)}, <b>cae dentro del salto</b> del ingreso marginal ($0 a $16): el precio se queda en <b>$20</b> y la producción en <b>10</b>. Aunque los costos cambien bastante, no cambia el precio. Por eso se observa que los precios en oligopolios tienden a ser rígidos.</p>`:`<p>El CM (${f$(c,1)}) superó el salto: ahora sí conviene subir el precio. Es un cambio de costos <b>grande</b> el que mueve el precio.</p>`};
  }
};
CHAPTERS.push({id:13,title:'Competencia monopolística y oligopolio',
teaser:'Productos diferenciados, publicidad, pocas empresas, teoría de juegos y el dilema de los prisioneros.',
bigq:'Entre la competencia perfecta y el monopolio hay dos mundos muy comunes: muchas empresas con productos distintos (restaurantes, ropa) y pocas empresas gigantes que se vigilan entre sí (aerolíneas, cerveza, celulares). ¿Cómo deciden precios y cantidades?',
learn:['Describir la competencia monopolística y explicar su equilibrio de largo plazo y su ineficiencia.','Explicar el papel de la diferenciación, la innovación y la publicidad.','Describir el oligopolio y sus modelos: demanda quebrada y empresa dominante.','Aplicar la teoría de juegos: dilema de los prisioneros, juegos repetidos y secuenciales.'],
html:`
<h2>1. Competencia monopolística</h2>
<p>La <b>competencia monopolística</b> es una estructura de mercado con estas características:</p>
<ul>
<li>Un <b>gran número de empresas</b>, cada una con una pequeña participación del mercado.</li>
<li><b>Diferenciación del producto</b>: cada empresa vende una versión algo distinta (marca, sabor, ubicación, diseño).</li>
<li><b>Competencia</b> en calidad, precio y marketing.</li>
<li><b>Libre entrada y salida</b>.</li>
</ul>
<p>Ejemplos: restaurantes, peluquerías, ropa, pasta de dientes. Al ser el producto diferenciado, cada empresa tiene algo de <b>poder de mercado</b> (como un pequeño monopolio sobre su propia variedad), pero compite con muchas empresas parecidas.</p>
<h3>Precio y producción</h3>
<p>Cada empresa enfrenta una demanda con pendiente negativa. Decide cantidad y precio como un monopolio: produce donde <b>IM = CM</b> y cobra el precio de su curva de demanda.</p>
${figAgain('c12_mono','Decide igual que un monopolio: IM = CM y el precio sale de la demanda.')}
<ul>
<li><b>Corto plazo:</b> puede ganar beneficio económico.</li>
<li><b>Largo plazo:</b> como no hay barreras, el beneficio atrae a nuevos competidores con productos parecidos. La demanda de cada empresa baja (se desplaza hacia la izquierda y se vuelve más elástica) hasta que el beneficio económico es cero: la curva de demanda es <b>tangente</b> a la curva de costo total medio.</li>
</ul>
${fig('c13_mc')}
<h3>¿Es eficiente la competencia monopolística?</h3>
<p>No del todo, por dos razones que se ven en la figura:</p>
<ul>
<li><b>El precio es mayor que el costo marginal</b>: hay un margen sobre el costo, lo que genera una pequeña pérdida irrecuperable.</li>
<li><b>Capacidad ociosa:</b> cada empresa produce menos de la escala eficiente (donde el CTMe es mínimo).</li>
</ul>
${figAgain('c5_sur')}
<p>Pero hay algo a favor: la <b>variedad</b>. Los consumidores valoran poder elegir entre muchas marcas, y ese valor compensa, al menos en parte, la ineficiencia. Además, el costo de la capacidad ociosa es una «cuota» por esa variedad.</p>
<h3>Desarrollo del producto y marketing</h3>
<p>Como el beneficio de corto plazo desaparece por la entrada de rivales, las empresas compiten con <b>innovación</b> (nuevos productos y mejoras) para mantenerse delante. Esa innovación es valiosa, pero tiene costos. También usan <b>publicidad</b>: puede aumentar los costos y los precios, pero también <b>informa</b>, ayuda a comparar y funciona como <b>señal de calidad</b> (una marca conocida tiene mucho que perder si baja la calidad). La publicidad también puede hacer más inelástica la demanda y crear lealtad a la marca.</p>

<h2>2. Oligopolio</h2>
<p>Un <b>oligopolio</b> es una estructura de mercado en la que:</p>
<ul>
<li>Hay <b>pocas empresas</b> y cada una tiene una participación grande.</li>
<li>Existen <b>barreras a la entrada</b> (economías de escala, patentes, marcas).</li>
<li>Las empresas son <b>interdependientes</b>: lo que hace una afecta a las demás y cada una lo sabe.</li>
</ul>
<p>La interdependencia hace que sea difícil predecir precios: cada empresa debe anticipar la reacción de las demás. Por eso hay varios modelos.</p>
<h3>Demanda quebrada</h3>
<p>Según este modelo, si una empresa sube el precio, los rivales no la acompañan y pierde clientes (demanda elástica). Si lo baja, los rivales la imitan y gana poco (demanda inelástica). La curva de demanda tiene un <b>quiebre</b> en el precio actual, y el ingreso marginal tiene un <b>salto</b>. Esto explica por qué los precios en oligopolios tienden a ser rígidos.</p>
${fig('c13_kink')}
<p>Pero el modelo tiene una debilidad: <b>no explica cómo se llegó al precio inicial</b>, y la evidencia de que los precios no cambian es discutida.</p>
<h3>Oligopolio de empresa dominante</h3>
<p>Una empresa grande (la dominante) fija el precio y las demás, pequeñas, lo toman como dado (como en competencia perfecta). La dominante calcula su demanda restando de la demanda del mercado lo que ofrecen las pequeñas, y produce donde IM = CM de esa demanda residual.</p>
${figAgain('c11_firm')}

<h2>3. Juegos de oligopolio</h2>
<p>La <b>teoría de juegos</b> estudia cómo se comportan los individuos que toman decisiones estratégicas: decisiones en las que el resultado de cada uno depende de lo que hagan los demás. Es la herramienta natural del oligopolio. Un juego tiene: <b>jugadores</b>, <b>estrategias</b> (opciones) y <b>pagos</b> (resultados de cada combinación).</p>
<h3>El dilema de los prisioneros</h3>
<p>Dos sospechosos están en celdas separadas. Si ambos callan, salen con una pena leve; si uno delata y el otro calla, el que delata sale libre y el otro recibe una pena enorme; si ambos delatan, reciben una pena media. Delatar es la mejor jugada <b>haga lo que haga el otro</b> (estrategia dominante). Resultado: los dos delatan y ambos quedan peor que si hubieran callado.</p>
${def('Equilibrio de Nash','<p>Es la situación en la que <b>cada jugador hace lo mejor que puede dado lo que hace el otro</b>: nadie quiere cambiar su estrategia mientras los demás mantengan las suyas. Lleva el nombre del matemático John Nash.</p>')}
<h3>Un juego de oligopolio para la fijación de precios</h3>
<p>Dos empresas (un duopolio) pueden formar un <b>cártel</b> y fijar un precio alto (como un monopolio) o competir. Si cooperan, comparten el beneficio de monopolio. Pero cada una gana más si rompe el acuerdo mientras la otra lo cumple. Como las dos piensan igual, ambas rompen y el resultado es la <b>guerra de precios</b>: el mismo equilibrio de Nash, con precios cercanos a competencia y beneficios bajos.</p>
${figAgain('c12_mono','El cártel busca replicar este resultado de monopolio.')}
${fig('c13_game')}
<h3>Otros juegos de oligopolio</h3>
<ul>
<li><b>Juego de I+D (investigación y desarrollo):</b> dos empresas deciden si invierten en investigación. Si ambas invierten, ambas bajan costos y la ventaja se anula (se compite en precios y el beneficio es bajo); si solo una invierte, gana mucho; el equilibrio de Nash suele ser que <b>ambas inviertan</b>, aunque estarían mejor si ninguna lo hiciera. Pero la sociedad sale ganando con la innovación.</li>
</ul>
<h3>Juegos repetidos y secuenciales</h3>
<ul>
<li><b>Juego repetido:</b> si el mismo dilema se juega muchas veces, puede sostenerse la cooperación con estrategias como <b>«ojo por ojo»</b>: cooperar al inicio y luego copiar lo que hizo el otro. Si rompes, el otro te castiga en la siguiente ronda y pierdes la cooperación futura. Cuanto más probable es que el juego continúe, más fácil es cooperar.</li>
<li><b>Juego secuencial de entrada en un mercado disputable:</b> una empresa ya establecida enfrenta a un posible entrante. Si la amenaza de la guerra de precios es <b>creíble</b>, el entrante no entra. Si no lo es (porque a la establecida no le conviene pelear), el entrante entra. Hasta una sola empresa se comporta como si hubiera competencia si temen la entrada: eso se llama <b>mercado disputable</b>.</li>
</ul>
${warn('<p>Las leyes de competencia prohíben los acuerdos de precios (cárteles) justamente porque los beneficios de cooperar son tentadores. Si fuera fácil mantenerlos sin la ley, no haría falta prohibirlos.</p>','Un aviso legal')}
`,
terms:[['Competencia monopolística','Muchas empresas, productos diferenciados, libre entrada.'],['Diferenciación del producto','Cada empresa vende una variedad algo distinta, lo que le da algo de poder de mercado.'],['Capacidad ociosa','Producir menos que la escala eficiente.'],['Oligopolio','Pocas empresas con barreras a la entrada e interdependencia.'],['Demanda quebrada','Modelo con un quiebre en la demanda que genera rigidez de precios.'],['Teoría de juegos','Estudio de decisiones estratégicas interdependientes.'],['Dilema de los prisioneros','Juego donde la estrategia dominante de cada uno deja a ambos peor.'],['Equilibrio de Nash','Cada jugador hace lo mejor dado lo que hacen los demás.'],['Cártel','Acuerdo entre empresas para fijar precios y repartirse el mercado.'],['Ojo por ojo','Estrategia de juego repetido: cooperar y luego copiar al rival.']],
quiz:[
 {q:'En el equilibrio de largo plazo de la competencia monopolística:',o:['El beneficio económico es cero y hay capacidad ociosa','Hay beneficios positivos','El precio es igual al costo marginal','Se produce en la escala eficiente'],a:0,why:'La entrada de rivales reduce la demanda de cada empresa hasta que es tangente al CTMe (beneficio cero), a la izquierda de su mínimo (capacidad ociosa).'},
 {q:'Un cártel de dos empresas es inestable porque:',o:['Cada una gana más rompiendo el acuerdo si la otra lo cumple','Es ilegal en todos los países','Los consumidores lo rechazan','Los costos suben'],a:0,why:'Es el dilema de los prisioneros: romper es la mejor respuesta a cualquier estrategia del otro.'},
 {q:'En el modelo de demanda quebrada, un cambio moderado en el costo marginal:',o:['No cambia el precio ni la cantidad','Cambia mucho el precio','Aumenta la cantidad','Elimina el quiebre'],a:0,why:'Mientras el CM cruce el salto del IM, el óptimo sigue en el quiebre.'},
 {q:'Un equilibrio de Nash es:',o:['Una situación en la que nadie quiere cambiar su estrategia dado lo que hacen los demás','El mejor resultado para todos','Un acuerdo de precios','Una situación con beneficio cero'],a:0,why:'No tiene por qué ser el mejor resultado conjunto (en el dilema de los prisioneros no lo es).'}]});
