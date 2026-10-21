/** Capítulo 16 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, bisect } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { warn, fig, figAgain } from '../../engine/blocks.js';

FIGS.c16_class = {
  title:'Cuatro tipos de bienes: rivalidad y exclusión',
  intro:'Dos preguntas clasifican casi cualquier bien: ¿si yo lo uso, queda menos para otros (rival)? ¿Se puede impedir que alguien lo use sin pagar (excluible)? Toca cada caja.',
  axes:false, x:{max:100}, y:{max:100}, h:380,
  build(){
    const els=[
     {k:'txt',at:[31,96],t:'EXCLUIBLE\n(se puede impedir el uso)',plain:true,bold:true,size:13},
     {k:'txt',at:[74,96],t:'NO EXCLUIBLE\n(no se puede impedir)',plain:true,bold:true,size:13},
     {k:'txt',at:[4,64],t:'RIVAL',plain:true,bold:true,size:13,anchor:'start'},
     {k:'txt',at:[4,28],t:'NO\nRIVAL',plain:true,bold:true,size:13,anchor:'start'},
     {k:'box',id:'priv',color:'blue',at:[34,62],w:36,h:30,t:'BIEN PRIVADO\nPizza, ropa, auto',legend:'Bien privado',info:['Bien privado','<b>Rival y excluible.</b> Si tú comes la pizza, yo no puedo; y la pizzería puede negármela si no pago. El mercado funciona bien: los precios señalan costos y beneficios.']},
     {k:'box',id:'com',color:'red',at:[76,62],w:36,h:30,t:'RECURSO COMÚN\nPeces del mar, pastos',legend:'Recurso común',info:['Recurso común','<b>Rival pero no excluible.</b> Lo que pesca un barco ya no lo pesca otro, pero nadie puede impedir que pesque. Resultado típico: <b>sobreexplotación</b> (la «tragedia de los comunes»).']},
     {k:'box',id:'club',color:'amber',at:[34,26],w:36,h:30,t:'BIEN DE CLUB\nCine, TV de paga, internet',legend:'Bien de club / monopolio natural',info:['Bien de club (monopolio natural)','<b>No rival pero excluible.</b> Un asiento de más en un cine casi no cuesta (cuando hay lugar) y se puede excluir a quien no paga. Suelen ser monopolios naturales: costos fijos altos y costo marginal bajo.']},
     {k:'box',id:'pub',color:'green',at:[76,26],w:36,h:30,t:'BIEN PÚBLICO\nDefensa, faro, aire limpio',legend:'Bien público',info:['Bien público','<b>No rival y no excluible.</b> La defensa nacional protege a todos por igual, y no puedes dejar a nadie sin protección. Genera el <b>problema del polizón</b>: nadie quiere pagar porque se beneficia igual si otros pagan.']}];
    return {els,say:'<p>Los <b>bienes públicos</b> y los <b>recursos comunes</b> son los casos de falla de mercado porque <b>no se puede cobrar por el uso</b>: sin precio no hay incentivo a producir (el primero) ni a cuidar (el segundo).</p><p>Un mismo objeto puede cambiar de categoría: una carretera sin tráfico es no rival; con congestión, se vuelve rival.</p>',sayTitle:'Cómo usarla'};
  }
};
FIGS.c16_public = {
  title:'Cuánto bien público conviene producir: sumar beneficios verticalmente (ejemplo ilustrativo)',
  intro:'Un bien público lo disfrutan todos a la vez. Por eso el beneficio social es la <b>suma vertical</b> de lo que cada persona está dispuesta a pagar, no la suma horizontal como en un bien privado.',
  x:{label:'Cantidad del bien público (por ejemplo, alumbrado)',max:16,ticks:[0,4,8,12,16]}, y:{label:'Disposición a pagar y costo ($)',max:20,ticks:[0,4,8,12,16,20],fmt:v=>'$'+v},
  controls:[
   {id:'a',label:'Cuánto valora la persona A el bien',min:6,max:14,step:.5,value:10,fmt:v=>fn(v,1),hint:'Mayor valoración desplaza la curva de A hacia arriba.'},
   {id:'b',label:'Cuánto valora la persona B el bien',min:4,max:12,step:.5,value:8,fmt:v=>fn(v,1)}],
  build(s){
    const {a,b}=s, MBa=Q=>Math.max(0,a-Q), MBb=Q=>Math.max(0,b-.5*Q), MSB=Q=>MBa(Q)+MBb(Q), MC=Q=>2+Q;
    const Qe=bisect(Q=>MSB(Q)-MC(Q),0,16), Qa=Math.max(0,(a-2)/2), Qb=Math.max(0,(b-2)/1.5), Qp=Math.max(Qa,Qb);
    const dwl=.5*(Qe-Qp)*(MSB(Qp)-MC(Qp));
    const els=[
     {k:'line',id:'a',color:'blue',w:3.2,pts:curve(MBa,0,a,30),label:'A',legend:'Disposición a pagar de A',info:['Disposición a pagar de A','Cuánto pagaría A por cada unidad del bien público.']},
     {k:'line',id:'b',color:'teal',w:3.2,pts:curve(MBb,0,2*b,30).filter(p=>p[0]<=16),label:'B',legend:'Disposición a pagar de B',info:['Disposición a pagar de B','Cuánto pagaría B por cada unidad.']},
     {k:'line',id:'msb',color:'purple',w:3.8,pts:curve(MSB,0,16,60).filter(p=>p[1]>0),label:'Beneficio social',legend:'Beneficio marginal social (A + B)',info:['Beneficio marginal social','Como los dos disfrutan <b>la misma unidad</b>, se <b>suman las disposiciones a pagar</b> (verticalmente). Es la curva de demanda social del bien público.']},
     {k:'line',id:'mc',color:'red',w:3.6,pts:[[0,2],[16,18]],label:'CM',lp:1,legend:'Costo marginal',info:['Costo marginal','Lo que cuesta producir cada unidad del bien público.']},
     {k:'pt',id:'e',color:'green',at:[Qe,MC(Qe)],r:8,guides:true,label:{t:'Eficiente',dx:12,dy:-12},legend:'Cantidad eficiente (BMS = CM)',info:['Cantidad eficiente','Producimos hasta que el beneficio marginal social iguala al costo marginal: '+fn(Qe,1)+'. A esa cantidad A paga '+f$(MBa(Qe),2)+' y B '+f$(MBb(Qe),2)+' (se llaman precios de Lindahl).']},
     {k:'pt',id:'p',color:'amber',at:[Qp,MC(Qp)],r:7,label:{t:'Provisión privada',dx:-8,dy:20,anchor:'end'},legend:'Lo que pagaría el más interesado solo',info:['Provisión privada con polizón','Si cada uno decide solo, el que más valora lo compra hasta que su propio beneficio iguala al costo: '+fn(Qp,1)+'. El otro se queda de <b>polizón</b>: disfruta sin pagar. Se produce de menos.']}];
    if(Qe>Qp+.1) els.push({k:'area',id:'dwl',color:'amber',op:.6,pts:[[Qp,MSB(Qp)],[Qe,MC(Qe)],[Qp,MC(Qp)]],legend:'Pérdida por provisión insuficiente',info:['Pérdida irrecuperable','Hay unidades cuyo beneficio <b>social</b> supera su costo, pero que nadie compra por su cuenta: '+f$(dwl,2)+'.']});
    return {els,read:[['Cantidad eficiente',fn(Qe,1),'green'],['Si lo compra solo uno',fn(Qp,1),'amber'],['Pérdida por polizón',f$(dwl,1),'amber']],
     say:`<p>La cantidad <b>eficiente</b> es <b>${fn(Qe,1)}</b>: a esa cantidad, A estaría dispuesto a pagar ${f$(MBa(Qe),2)} y B ${f$(MBb(Qe),2)}; juntos cubren el costo marginal (${f$(MC(Qe),2)}).</p><p>Pero si cada uno decide por su cuenta, el mercado produce solo <b>${fn(Qp,1)}</b>: el que valora menos espera que el otro pague (<b>problema del polizón</b>). Por eso el gobierno suele producir bienes públicos y cobrar impuestos.</p>`};
  }
};
FIGS.c16_commons = {
  title:'La tragedia de los comunes: la pesca en un lago abierto (ejemplo ilustrativo)',
  intro:'Si nadie es dueño del lago, cada pescador entra mientras gane algo, sin pensar que su barco reduce la pesca de los demás. Resultado: demasiados barcos.',
  x:{label:'Barcos pesqueros',max:12,ticks:[0,2,4,6,8,10,12]}, y:{label:'Pescado por barco y costo ($)',max:12.5,ticks:[0,2,4,6,8,10,12],fmt:v=>'$'+v},
  controls:[{id:'w',label:'Costo de operar un barco (por periodo)',min:1,max:8,step:.5,value:3,fmt:v=>f$(v,1),hint:'Si operar un barco sale barato, entran muchos.'}],
  build(s){
    const w=s.w, MP=n=>12-2*n, nc=12-w, ne=(12-w)/2;
    const dw=.5*(nc-ne)*(w-MP(nc))>0?.5*(nc-ne)*(w-MP(nc)):0;
    const els=[
     {k:'line',id:'ap',color:'blue',w:3.6,pts:[[0,12],[12,0]],label:'Ingreso medio',legend:'Ingreso medio por barco',info:['Ingreso medio por barco','Lo que gana en promedio cada barco. Cada barco nuevo reparte la misma pesca entre más barcos, así que el promedio baja. Es lo que mira un pescador al decidir si entra.']},
     {k:'line',id:'mp',color:'purple',w:3.6,pts:[[0,12],[6,0]],label:'Ingreso marginal',legend:'Ingreso marginal (lo que aporta el barco extra a todos)',info:['Ingreso marginal social','Lo que aporta de verdad un barco más al total de la pesca. Es menor que el promedio porque, además de lo que pesca, <b>reduce lo que pescan los demás</b> (externalidad negativa).']},
     {k:'line',id:'w',color:'red',w:3.4,pts:[[0,w],[12,w]],label:{t:'Costo por barco',at:[12,w],dx:-6,dy:-8,anchor:'end'},legend:'Costo por barco',info:['Costo por barco','Lo que cuesta mantener un barco en operación.']},
     {k:'pt',id:'c',color:'red',at:[nc,w],r:8,guides:true,label:{t:'Acceso libre',dx:6,dy:-12},legend:'Equilibrio con acceso libre',info:['Equilibrio con acceso libre','Entran barcos hasta que el ingreso medio iguala al costo: se disipa toda la ganancia. Número de barcos: '+fn(nc,1)+'.']},
     {k:'pt',id:'e',color:'green',at:[ne,w],r:8,guides:true,label:{t:'Eficiente',dx:6,dy:20},legend:'Cantidad eficiente de barcos',info:['Número eficiente de barcos','Donde el ingreso marginal social iguala al costo: '+fn(ne,1)+' barcos. Aquí se maximiza la ganancia total de pescar.']}];
    if(dw>0) els.push({k:'area',id:'dwl',color:'amber',op:.6,pts:[[ne,w],[nc,w],[nc,MP(nc)]],legend:'Pérdida por sobrepesca',info:['Pérdida por sobreexplotación','Los barcos entre '+fn(ne,1)+' y '+fn(nc,1)+' cuestan más de lo que aportan a la sociedad. Es la tragedia de los comunes: '+f$(dw,1)+'.']});
    return {els,read:[['Barcos con acceso libre',fn(nc,1),'red'],['Barcos eficientes',fn(ne,1),'green'],['Exceso de barcos',fn(nc-ne,1),'amber']],
     say:`<p>Con acceso libre entran <b>${fn(nc,1)}</b> barcos; lo eficiente serían <b>${fn(ne,1)}</b>. Sobran ${fn(nc-ne,1)} barcos que gastan recursos sin aumentar el beneficio social.</p><p>Soluciones: <b>derechos de propiedad</b> (alguien es dueño del lago y cuida su valor), <b>cuotas individuales transferibles</b> (cada pescador recibe un derecho a pescar cierta cantidad), <b>impuestos o licencias</b> que suben el costo, o <b>acuerdos comunitarios</b>.</p>`};
  }
};
CHAPTERS.push({id:16,title:'Bienes públicos y recursos comunes',
teaser:'Polizones, provisión eficiente de bienes públicos y la tragedia de los comunes.',
bigq:'¿Por qué los privados no producen defensa nacional ni alumbrado público, y por qué los océanos y los bosques tropicales se agotan si nadie los cuida?',
learn:['Clasificar bienes por rivalidad y exclusión.','Explicar el problema del polizón y la provisión eficiente de bienes públicos.','Explicar la tragedia de los comunes y sus soluciones.'],
html:`
<h2>1. Clasificación de bienes y recursos</h2>
<p>Los bienes se clasifican con dos preguntas:</p>
<ul>
<li><b>Exclusión:</b> ¿se puede impedir que alguien use el bien si no paga?</li>
<li><b>Rivalidad:</b> ¿el uso por una persona reduce lo que queda para otras?</li>
</ul>
${fig('c16_class')}
<p>Aparecen dos problemas: el <b>problema del polizón</b> (bienes públicos) y el de la <b>sobreexplotación</b> (recursos comunes). En ambos, la falta de precios elimina los incentivos y el mercado falla.</p>

<h2>2. Bienes públicos</h2>
<p>Un <b>bien público</b> es no rival y no excluible. El <b>polizón</b> es la persona que disfruta de un bien sin pagar su parte. Como no se puede excluir a nadie, nadie tiene motivo para pagar: si los demás lo pagan, disfrutas igual; si nadie lo paga, tú solo no lo harías. Resultado: <b>subprovisión</b>.</p>
<h3>Cuánto producir: suma vertical</h3>
<p>Para un bien <b>privado</b>, la demanda del mercado suma <i>horizontalmente</i> (cantidades) porque cada persona consume unidades distintas. Para un bien <b>público</b>, todos consumen la <i>misma</i> unidad, así que se suman <b>verticalmente</b> las disposiciones a pagar. La cantidad eficiente es donde el <b>beneficio marginal social</b> (la suma vertical) iguala al <b>costo marginal</b>.</p>
${figAgain('c3_dem')}
${fig('c16_public')}
<h3>Provisión privada, pública y voto</h3>
<ul>
<li><b>Privada:</b> produce de menos por el polizón (aunque a veces funciona: televisión abierta con publicidad, donaciones).</li>
<li><b>Pública:</b> el gobierno produce y cobra impuestos. ¿Cuánto producir? Se decide votando. El <b>votante mediano</b> tiende a decidir, y los políticos que quieren votos ofrecen lo que prefiere. No hay garantía de eficiencia: puede haber exceso o falta.</li>
<li><b>Burócratas:</b> quieren más presupuesto: tienden a producir más de lo eficiente.</li>
</ul>
<p>La mejor decisión: comparar el beneficio marginal social con el costo marginal (análisis costo-beneficio). Es difícil porque los beneficios no se observan en precios.</p>
${figAgain('c15_pos')}

<h2>3. Recursos comunes</h2>
<p>Un recurso común es rival pero no excluible: <b>peces en el océano, pastizales, bosques tropicales, el agua subterránea</b>. Como nadie puede ser excluido, todos lo explotan hasta el punto en que ya no obtienen ganancia. El resultado se conoce como <b>tragedia de los comunes</b>.</p>
${fig('c16_commons')}
<p>El problema es una <b>externalidad</b>: cada pescador que entra reduce la pesca de todos los demás, pero no lo toma en cuenta. Por eso hay sobrepesca y desaparición de bosques.</p>
${figAgain('c15_neg')}
<h3>Soluciones</h3>
<ul>
<li><b>Derechos de propiedad:</b> si alguien es dueño, cuida el recurso (privatización, comunidades con reglas).</li>
<li><b>Cuotas de producción:</b> el gobierno limita el total que se puede extraer y reparte derechos; si son <b>transferibles</b>, los más eficientes los compran.</li>
<li><b>Impuestos o licencias:</b> encarecen el uso y reducen el número de usuarios.</li>
<li><b>Acuerdos comunitarios:</b> comunidades pequeñas con reglas y vigilancia mutua pueden evitar la tragedia (caso estudiado por la economista Elinor Ostrom).</li>
</ul>
${warn('<p>Un recurso común no se acaba solo por maldad de quienes lo usan: la estructura de incentivos lleva a cada uno a sobreexplotarlo aunque todos preferirían que se conservara. Por eso las soluciones cambian incentivos, no solo predican conciencia.</p>')}
`,
terms:[['Bien público','No rival y no excluible: defensa, faro, alumbrado.'],['Recurso común','Rival y no excluible: peces, bosques.'],['Problema del polizón','Disfrutar de un bien sin pagar, porque no se puede excluir.'],['Suma vertical','Se suman las disposiciones a pagar para obtener la demanda de un bien público.'],['Tragedia de los comunes','Sobreexplotación de un recurso sin dueño.'],['Cuota individual transferible','Derecho a extraer una cantidad, que se puede vender.'],['Votante mediano','El votante que decide una elección de mayoría simple.']],
quiz:[
 {q:'La defensa nacional es un bien:',o:['Público: no rival y no excluible','Privado','De club','Recurso común'],a:0,why:'Proteger a un ciudadano más no reduce la protección de los demás, y no puedes dejar a nadie sin protección.'},
 {q:'La demanda del mercado de un bien público se obtiene:',o:['Sumando verticalmente las disposiciones a pagar','Sumando horizontalmente las cantidades','Multiplicando precios','Restando costos'],a:0,why:'Todos disfrutan la misma unidad; el beneficio social de esa unidad es la suma de lo que cada uno pagaría.'},
 {q:'En un recurso común con acceso libre, los usuarios:',o:['Lo explotan más allá de lo eficiente','Lo cuidan al máximo','Lo explotan lo eficiente','No lo usan'],a:0,why:'Cada usuario ignora que reduce lo que ganan los demás, así que entra mientras gane algo.'},
 {q:'¿Cuál de estas es una solución a la tragedia de los comunes?',o:['Cuotas transferibles o derechos de propiedad','Eliminar los precios','Subsidiar el uso','Prohibir toda extracción'],a:0,why:'Cambian los incentivos: el usuario toma en cuenta el valor futuro del recurso o paga por usarlo.'}]});
