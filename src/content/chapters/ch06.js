/** Capítulo 6 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { clamp } from '../../engine/math.js';
import { f$, fn, pct } from '../../engine/format.js';
import { warn, tip, eqn, fig, figAgain } from '../../engine/blocks.js';

FIGS.c6_rent = {
  title:'Precio tope en los alquileres (ejemplo ilustrativo)',
  intro:'Si la ley fija un alquiler máximo por debajo del de equilibrio, aparece un faltante de viviendas. Compara el corto plazo (la oferta casi no se mueve) con el largo plazo (se construye menos).',
  x:{label:'Viviendas disponibles (miles)',max:600,ticks:[0,100,200,300,400,500,600]}, y:{label:'Alquiler ($ por mes)',max:1200,ticks:[0,200,400,600,800,1000,1200],fmt:v=>'$'+v},
  controls:[
   {id:'pl',type:'seg',label:'Plazo de análisis',value:'l',options:[['c','Corto plazo'],['l','Largo plazo']],hint:'En el corto plazo no se pueden construir ni demoler viviendas (oferta casi vertical). En el largo plazo los propietarios dejan de construir y mantener.'},
   {id:'tope',label:'Alquiler máximo que fija la ley',min:200,max:900,step:10,value:400,fmt:v=>'$'+v,hint:'Un tope por encima de $600 (el precio de equilibrio) no tiene ningún efecto: no «aprieta». Solo importa si es más bajo que el equilibrio.'}],
  build(s){
    const D=Q=>1200-2*Q;
    const Sf=s.pl==='l'?(Q=>300+Q):(Q=>600+5*(Q-300)); const Sinv=s.pl==='l'?(P=>P-300):(P=>300+(P-600)/5);
    const tope=s.tope, bind=tope<600;
    const Qs=bind?clamp(Sinv(tope),0,600):300, Qd=(1200-tope)/2;
    const pblack=D(Qs);
    const els=[
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,1200],[600,0]],label:'Demanda',legend:'Demanda de viviendas',info:['Demanda de viviendas','Cuántas viviendas quieren alquilar las personas a cada precio. Es más baja cuanto más caro es el alquiler.']},
     {k:'line',id:'s',color:'red',w:3.6,pts:s.pl==='l'?[[0,300],[600,900]]:[[240,0],[360,1200]],label:'Oferta',legend:'Oferta de viviendas ('+(s.pl==='l'?'largo':'corto')+' plazo)',info:['Oferta de viviendas','Cuántas viviendas ofrecen los propietarios a cada precio. '+(s.pl==='l'?'A largo plazo es más elástica: si el alquiler baja, se construyen y mantienen menos viviendas.':'A corto plazo es casi vertical: las viviendas que ya existen no desaparecen de la noche a la mañana.')]},
     {k:'pt',id:'eq',color:'green',at:[300,600],r:7,guides:true,gx:'300',gy:'$600',label:{t:'Equilibrio sin tope',dx:10,dy:18},legend:'Equilibrio sin regulación',info:['Equilibrio sin regulación','Sin tope, el alquiler es $600 y se alquilan 300 mil viviendas.']}];
    if(bind){
      els.push({k:'line',id:'tope',color:'amber',dash:'8 5',w:3,pts:[[0,tope],[600,tope]],label:{t:'Tope $'+tope,at:[0,tope],dx:6,dy:-8},legend:'Tope legal del alquiler',info:['Alquiler máximo (precio tope)','La ley prohíbe cobrar más que esto. Como queda <b>debajo</b> del precio de equilibrio, es obligatorio y genera problemas.']});
      els.push({k:'line',id:'falt',color:'purple',w:7,pts:[[Qs,tope],[Qd,tope]],label:{t:'Faltante '+fn(Qd-Qs,0)+' mil',at:[(Qs+Qd)/2,tope],dy:20},legend:'Faltante de viviendas',info:['Faltante de viviendas','Al precio tope se quieren alquilar <b>'+fn(Qd,0)+' mil</b> viviendas, pero solo hay <b>'+fn(Qs,0)+' mil</b>. La diferencia es gente que busca y no encuentra.']});
      els.push({k:'area',id:'bus',color:'purple',op:.25,pts:[[0,tope],[Qs,tope],[Qs,pblack],[0,pblack]],legend:'Costo de búsqueda y mercado negro',info:['Actividad de búsqueda y mercado negro','Como hay más gente dispuesta a pagar que viviendas, algunos buscan durante meses o pagan «por debajo de la mesa». Los inquilinos están dispuestos a pagar hasta <b>$'+fn(pblack,0)+'</b> por la última vivienda: eso es lo que «gasta» la sociedad entre el precio legal y su disposición real. Parte de la ganancia se evapora en búsquedas y sobornos.']});
      els.push({k:'area',id:'dwl',color:'amber',op:.6,pts:[[Qs,pblack],[300,600],[Qs,Sf(Qs)]],legend:'Pérdida irrecuperable',info:['Pérdida irrecuperable','Son viviendas que <b>valían más de lo que costaba construirlas</b> y no existen por culpa del tope. Es ganancia que nadie recibe.']});
      els.push({k:'pt',id:'pb',color:'red',at:[Qs,pblack],r:6,legend:false,info:['Precio máximo que se pagaría','Los inquilinos pagarían hasta $'+fn(pblack,0)+' por la última vivienda ofrecida. Esa es la «tentación» del mercado negro.']});
    }
    const nl=bind?`<p>El tope de <b>$${tope}</b> está por debajo del equilibrio ($600) y <b>sí aprieta</b>. Los propietarios ofrecen solo <b>${fn(Qs,0)} mil</b> viviendas, mientras que ${fn(Qd,0)} mil personas quieren alquilar: faltan <b>${fn(Qd-Qs,0)} mil</b>. Los inquilinos que consiguen vivienda pagan menos, pero muchos otros no encuentran y se pierden <b>${fn(300-Qs,0)} mil</b> viviendas en total.</p><p>${s.pl==='c'?'En el corto plazo el efecto es pequeño porque la oferta no se ajusta. Cambia a <b>largo plazo</b>: el faltante crece mucho.':'A largo plazo el efecto es mayor: construir y mantener deja de ser negocio.'}</p>`:'<p>Este tope <b>no aprieta</b> (está por encima del equilibrio): el mercado sigue donde estaba. Bájalo por debajo de $600.</p>';
    return {els,read:[['Viviendas disponibles',fn(Qs,0)+' mil','red'],['Faltante',bind?fn(Qd-Qs,0)+' mil':'0','purple'],['Precio «real» que pagaría el inquilino',bind?f$(pblack,0):'$600','amber']],say:nl};
  }
};
FIGS.c6_wage = {
  title:'Salario mínimo en el mercado de trabajo (ejemplo ilustrativo)',
  intro:'En el mercado de trabajo, los hogares <b>ofrecen</b> horas de trabajo (curva roja) y las empresas las <b>demandan</b> (azul). El «precio» es el salario.',
  x:{label:'Trabajadores empleados (miles)',max:1400,ticks:[0,200,400,600,800,1000,1200,1400]}, y:{label:'Salario ($ por hora)',max:16,ticks:[0,4,8,12,16],fmt:v=>'$'+v},
  controls:[{id:'w',label:'Salario mínimo legal',min:2,max:14,step:.5,value:10,fmt:v=>'$'+fn(v,1),hint:'Si es menor que el salario de equilibrio ($8) no tiene efecto. Si es mayor, algunos ganan más, pero otros pierden el empleo.'}],
  build(s){
    const Ld=w=>(14-w)/.01, Ls=w=>(w-2)/.01, bind=s.w>8;
    const L=bind?Ld(s.w):600, supply=bind?Ls(s.w):600, un=supply-L;
    const els=[
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,14],[1400,0]],label:'Demanda de trabajo',lp:0,legend:'Demanda de trabajo (empresas)',info:['Demanda de trabajo','Cuánto trabajo quieren contratar las empresas a cada salario. Baja con el salario: un trabajo más caro se usa menos. Se lee también como el valor de la última hora trabajada para la empresa.']},
     {k:'line',id:'s',color:'red',w:3.6,pts:[[0,2],[1400,16]],label:'Oferta de trabajo',lp:1,legend:'Oferta de trabajo (hogares)',info:['Oferta de trabajo','Cuántas personas quieren trabajar a cada salario. Sube: salarios altos atraen a más gente. Se lee también como el «valor del tiempo libre» de cada persona.']},
     {k:'pt',id:'eq',color:'green',at:[600,8],r:7,guides:true,gx:'600',gy:'$8',label:{t:'Equilibrio',dx:12,dy:-12},legend:'Equilibrio sin salario mínimo',info:['Equilibrio del mercado de trabajo','Con salarios libres, el salario es $8 y se emplean 600 mil personas. Nadie busca trabajo sin encontrarlo (a ese salario).']}];
    if(bind){
      els.push({k:'line',id:'min',color:'amber',dash:'8 5',w:3,pts:[[0,s.w],[1400,s.w]],label:{t:'Mínimo $'+fn(s.w,1),at:[0,s.w],dx:6,dy:-8},legend:'Salario mínimo',info:['Salario mínimo','La ley prohíbe pagar menos que esto. Como está por <b>encima</b> del equilibrio, las empresas contratan menos y más gente quiere trabajar.']});
      els.push({k:'line',id:'des',color:'purple',w:7,pts:[[L,s.w],[supply,s.w]],label:{t:'Desempleo '+fn(un,0)+' mil',at:[(L+supply)/2,s.w],dy:-12},legend:'Desempleo',info:['Desempleo','A este salario hay <b>'+fn(supply,0)+' mil</b> personas que quieren trabajar pero las empresas solo contratan a <b>'+fn(L,0)+' mil</b>. La diferencia ('+fn(un,0)+' mil) es desempleo causado por el salario mínimo.']});
      els.push({k:'area',id:'dwl',color:'amber',op:.6,pts:[[L,s.w],[600,8],[L,2+L*.01]],legend:'Pérdida irrecuperable',info:['Pérdida irrecuperable','Son trabajos que <b>valían más para la empresa de lo que costaba sacrificar el tiempo libre</b> y no existen. Son ganancias del comercio que se perdieron.']});
      els.push({k:'area',id:'ganan',color:'green',op:.22,pts:[[0,8],[L,8],[L,s.w],[0,s.w]],legend:'Ganancia de los que siguen empleados',info:['Ganan los que siguen empleados','Los trabajadores que conservan su empleo ganan un salario más alto. Es el beneficio buscado por la ley. Pero otros pierden el trabajo y quedan en el desempleo.']});
    }
    return {els,read:[['Empleo',fn(L,0)+' mil','blue'],['Desempleados por el mínimo',bind?fn(un,0)+' mil':'0','purple'],['Salario',f$(bind?s.w:8,1),'amber']],
     say:bind?`<p>Con un mínimo de <b>${f$(s.w,1)}</b>, ${fn(L,0)} mil personas conservan su empleo (ganan más) y <b>${fn(600-L,0)} mil</b> empleos desaparecen. Además ${fn(supply-600,0)} mil personas nuevas buscan trabajo atraídas por el salario alto. Total sin empleo: <b>${fn(un,0)} mil</b>.</p><p>La magnitud depende de la elasticidad de la demanda de trabajo: cuanto más elástica, mayor el desempleo.</p>`:'<p>El mínimo está por debajo (o igual) al equilibrio: <b>no tiene efecto</b>. Súbelo por encima de $8.</p>'};
  }
};
FIGS.c6_tax = {
  title:'Impuesto o subsidio: ¿quién lo paga realmente?',
  intro:'Ponle un impuesto a los vendedores y mira cuánto se traslada a los compradores. Un valor negativo representa un subsidio. Cambia la pendiente de las curvas para ver el papel de la elasticidad.',
  x:{label:'Cantidad',max:20,ticks:[0,5,10,15,20]}, y:{label:'Precio ($)',max:24,ticks:[0,4,8,12,16,20,24],fmt:v=>'$'+v},
  controls:[
   {id:'t',label:'Impuesto por unidad (negativo = subsidio)',min:-4,max:6,step:.5,value:4,fmt:v=>(v<0?'subsidio ':'')+f$(Math.abs(v),1),hint:'El impuesto desplaza la oferta hacia arriba: producir y vender cuesta más. El subsidio la desplaza hacia abajo.'},
   {id:'b',label:'Pendiente de la demanda (más pendiente = más inelástica)',min:.3,max:2.5,step:.1,value:1,fmt:v=>fn(v,1),hint:'Con demanda inelástica (empinada), los compradores no pueden escapar del impuesto y cargan con casi todo.'},
   {id:'d',label:'Pendiente de la oferta (más pendiente = más inelástica)',min:.3,max:2.5,step:.1,value:1,fmt:v=>fn(v,1),hint:'Con oferta inelástica (empinada), los vendedores no pueden reducir producción y cargan con casi todo.'}],
  build(s){
    const {t,b,d}=s, Q0=10,P0=10, Qt=Q0-t/(b+d), Pb=P0+b*t/(b+d), Ps=Pb-t;
    const els=[];
    const word=t>=0?'impuesto':'subsidio';
    if(Math.abs(t)>.01){
      els.push({k:'area',id:'cb',color:'blue',op:.3,pts:[[0,P0],[Qt,P0],[Qt,Pb],[0,Pb]],legend:t>0?'Parte del impuesto que pagan los compradores':'Parte del subsidio que reciben los compradores',info:[t>0?'Parte del impuesto que pagan los compradores':'Beneficio del subsidio para compradores','Los compradores ahora pagan '+f$(Pb,2)+' en vez de $10.00: '+f$(Math.abs(Pb-P0),2)+' por unidad de diferencia. Multiplicado por las '+fn(Qt,1)+' unidades, son '+f$(Math.abs(Pb-P0)*Qt,1)+'.']});
      els.push({k:'area',id:'cs',color:'red',op:.3,pts:[[0,P0],[Qt,P0],[Qt,Ps],[0,Ps]],legend:t>0?'Parte del impuesto que pagan los vendedores':'Parte del subsidio que reciben los vendedores',info:[t>0?'Parte del impuesto que pagan los vendedores':'Beneficio del subsidio para vendedores','Los vendedores reciben '+f$(Ps,2)+' en vez de $10.00: '+f$(Math.abs(Ps-P0),2)+' menos por unidad (o más, si es subsidio). Total: '+f$(Math.abs(Ps-P0)*Qt,1)+'.']});
      els.push({k:'area',id:'dwl',color:'amber',op:.7,pts:[[Q0,P0],[Qt,Pb],[Qt,Ps]],legend:'Pérdida irrecuperable',info:['Pérdida irrecuperable','Son las transacciones que se dejaron de hacer'+(t<0?' (o que se hicieron de más)':'')+' por culpa del '+word+'. Las unidades entre '+fn(Math.min(Q0,Qt),1)+' y '+fn(Math.max(Q0,Qt),1)+' '+(t>0?'valían más para los compradores de lo que costaban, pero ya no se producen.':'costaban más de lo que valían, pero se producen por el subsidio.')]});
    }
    els.push({k:'line',id:'d',color:'blue',w:3.6,pts:[[0,P0+b*Q0],[20,P0-b*10]],label:'Demanda',lp:1,legend:'Demanda',info:['Demanda','Su pendiente ('+fn(b,1)+') refleja qué tan sensibles son los compradores al precio.']});
    els.push({k:'line',id:'s',color:'red',w:3.6,pts:[[0,P0-d*Q0],[20,P0+d*10]],label:'Oferta',lp:1,dy:14,legend:'Oferta original',info:['Oferta original','Su pendiente ('+fn(d,1)+') refleja qué tan sensibles son los vendedores al precio.']});
    if(Math.abs(t)>.01) els.push({k:'line',id:'st',color:'purple',dash:'7 5',w:3,pts:[[0,P0-d*Q0+t],[20,P0+d*10+t]],label:{t:'Oferta con '+word,at:[20,P0+d*10+t],dx:-4,dy:-8,anchor:'end'},legend:'Oferta con '+word,info:['Oferta con '+word,t>0?'El impuesto aumenta el costo de cada unidad en '+f$(t,1)+': para cualquier cantidad, los vendedores piden ese monto más. La oferta se desplaza hacia arriba.':'El subsidio reduce el costo de cada unidad en '+f$(-t,1)+'. La oferta se desplaza hacia abajo.']});
    els.push({k:'pt',id:'e0',color:'ink',at:[Q0,P0],r:6,guides:false,label:{t:'Original',dx:8,dy:16},legend:'Equilibrio original',info:['Equilibrio original','Precio $10 y cantidad 10, antes del '+word+'.']});
    if(Math.abs(t)>.01){
      els.push({k:'pt',id:'eb',color:'blue',at:[Qt,Pb],r:6,gy:f$(Pb,2),gx:fn(Qt,1),guides:true,legend:'Lo que pagan los compradores',info:['Precio que pagan los compradores',f$(Pb,2)+' por unidad.']});
      els.push({k:'pt',id:'es',color:'red',at:[Qt,Ps],r:6,legend:'Lo que reciben los vendedores',info:['Precio neto que reciben los vendedores',f$(Ps,2)+' por unidad (el precio pagado menos el impuesto).']});
    }
    const shB=Math.abs(t)>.01?b/(b+d):0.5, rev=t*Qt, dwl=.5*Math.abs(t)*Math.abs(Q0-Qt);
    return {els,read:[['Precio compradores',f$(Pb,2),'blue'],['Precio neto vendedores',f$(Ps,2),'red'],['Cantidad',fn(Qt,2),'gray'],[t>=0?'Recaudación':'Costo del subsidio',f$(Math.abs(rev),1),'green'],['Pérdida irrecuperable',f$(dwl,2),'amber'],['Compradores cargan',pct(shB),'blue']],
     say:Math.abs(t)<.01?'<p>Sin impuesto ni subsidio no hay distorsión: el mercado queda en equilibrio.</p>':`<p>Con un ${word} de ${f$(Math.abs(t),1)}, los compradores ${t>0?'pagan':'pagan solo'} <b>${f$(Pb,2)}</b> y los vendedores ${t>0?'se quedan con':'reciben'} <b>${f$(Ps,2)}</b>. La cantidad pasa a <b>${fn(Qt,2)}</b>.</p><p>De cada dólar del ${word}, los compradores se llevan el <b>${pct(shB)}</b> y los vendedores el ${pct(1-shB)}. <i>Quién paga no depende de a quién se le cobre legalmente, sino de la elasticidad.</i> Prueba a cambiar la pendiente de la demanda.</p><p>La pérdida irrecuperable (${f$(dwl,2)}) crece con el <b>cuadrado</b> del ${word}: duplicarlo cuadruplica la pérdida.</p>`};
  }
};
CHAPTERS.push({id:6,title:'Los mercados en la práctica',
teaser:'Topes de precios, salario mínimo, impuestos, subsidios y mercados de bienes ilegales.',
bigq:'Los gobiernos intervienen en los mercados todo el tiempo: fijan alquileres, salarios, impuestos. ¿Qué pasa cuando alguien «manda» sobre un precio, y quién termina pagando un impuesto?',
learn:['Explicar los efectos de un precio tope (alquileres) y de un precio mínimo (salario mínimo).','Determinar cómo se reparte un impuesto entre compradores y vendedores según la elasticidad.','Reconocer la pérdida irrecuperable de impuestos, subsidios y cuotas.','Analizar el mercado de un bien ilegal y qué cambia al legalizarlo o gravarlo.'],
html:`
<h2>1. Mercados de vivienda y precios tope en los alquileres</h2>
<p>Un <b>precio tope</b> es una regulación que fija un precio <b>máximo</b> legal. Un tope por encima del precio de equilibrio no hace nada. Uno <b>por debajo</b> sí aprieta y tiene efectos fuertes. El caso clásico es el control de alquileres.</p>
${figAgain('c3_eq','Compara el tope con el precio de equilibrio: si queda por encima, no hace nada.')}
<h3>Qué pasa a corto y largo plazo</h3>
<p>Imagina que un terremoto o una migración repentina eleva la demanda y el alquiler sube. El gobierno responde fijando un tope más bajo. A <b>corto plazo</b>, las viviendas que existen ya están ahí (oferta casi vertical): los propietarios pocas opciones tienen, así que el faltante es pequeño. A <b>largo plazo</b>, construir, mantener y alquilar deja de ser rentable: se construyen menos viviendas y las existentes se deterioran. El faltante crece y las ciudades con controles prolongados suelen tener menos oferta y peor calidad.</p>
${fig('c6_rent')}
<h3>Tres consecuencias de un tope vinculante</h3>
<ul>
<li><b>Faltante.</b> Más gente quiere alquilar de lo que hay.</li>
<li><b>Actividad de búsqueda.</b> Como los precios no «racionan», lo hacen el tiempo y las conexiones. Se pierden horas buscando.</li>
<li><b>Mercado negro.</b> Algunos pagan sobornos o «llaves» para conseguir un departamento. El precio real puede superar al de equilibrio.</li>
</ul>
<p>El resultado es <b>ineficiente</b> (pérdida irrecuperable) y discutible en equidad: gana quien tiene la suerte o los contactos para obtener una vivienda barata, no necesariamente quien más la necesita. Por eso los economistas suelen preferir ayudas directas a los inquilinos que el control de precios.</p>

<h2>2. El mercado de trabajo y el salario mínimo</h2>
<p>El <b>salario mínimo</b> es un precio mínimo legal para el trabajo. Es el espejo del precio tope: si queda <b>por encima</b> del salario de equilibrio, la cantidad ofrecida de trabajo supera a la demandada y aparece <b>desempleo</b>.</p>
${figAgain('c6_rent','Es el espejo del tope de alquileres: mira cómo se ve un precio regulado que se aparta del equilibrio.')}
${fig('c6_wage')}
<p>Lo que ocurre: los trabajadores que conservan su empleo ganan más; otros lo pierden; y el salario alto atrae a nuevos buscadores de empleo, aumentando el desempleo. Es un conflicto entre beneficiarios y perjudicados.</p>
${warn('<p>El tamaño del efecto depende de la elasticidad de la demanda de trabajo y de qué tan por encima queda el mínimo. La evidencia empírica es debatida: algunos estudios encuentran efectos pequeños sobre el empleo cuando el mínimo es moderado. Los modelos de este capítulo son la base de ese debate, no la última palabra.</p>','Matiz importante')}
<p>En América Latina, además, una parte grande del empleo es informal y el salario mínimo legal no siempre se aplica a ese sector: allí, el efecto del mínimo puede transmitirse de otras maneras (por ejemplo, empujando a algunos trabajadores hacia la informalidad). Es otra razón para ser cuidadosos con las conclusiones.</p>

<h2>3. Impuestos</h2>
<p>Los gobiernos cobran impuestos para financiar bienes y servicios. Dos preguntas importan: <b>¿quién carga realmente con el impuesto?</b> (incidencia) y <b>¿cuánta eficiencia se pierde?</b></p>
<h3>Incidencia del impuesto</h3>
<p>La ley puede decir «el vendedor paga el impuesto», pero eso no determina quién lo soporta de verdad. Si se pone un impuesto de $4 por unidad a los vendedores, sus costos suben $4 y la curva de oferta se desplaza hacia arriba por $4. El nuevo equilibrio tiene un precio más alto para los compradores y una cantidad menor. Los vendedores no pueden pasar todo el impuesto a los compradores: reciben, después del impuesto, un precio menor que antes. Así se reparte la carga.</p>
${eqn('Lo que pagan los compradores − lo que reciben los vendedores = impuesto por unidad','El impuesto «abre una cuña» entre ambos precios.')}
<p>Una consecuencia sorprendente: es <b>equivalente</b> poner el impuesto a los compradores o a los vendedores. Lo que cambia es la curva que se desplaza, pero el resultado (precio que paga el comprador, precio neto del vendedor, cantidad) es idéntico.</p>
${fig('c6_tax')}
<h3>Elasticidad e incidencia</h3>
<ul>
<li>Cuanto más <b>inelástica</b> es la demanda (y más elástica la oferta), <b>mayor parte del impuesto pagan los compradores</b>. (Los fumadores pagan casi todo el impuesto al cigarro porque casi no cambian su consumo.)</li>
<li>Cuanto más <b>inelástica</b> es la oferta (y más elástica la demanda), <b>mayor parte pagan los vendedores</b>. (Un impuesto a la tierra: el dueño no puede crear más tierra, así que lo absorbe él.)</li>
</ul>
<p>Regla de oro: <i>paga más quien tiene menos alternativas.</i></p>
<h3>Impuestos y eficiencia</h3>
<p>Un impuesto reduce la cantidad comerciada. Las transacciones que dejan de ocurrir eran mutuamente beneficiosas: el comprador pagaba menos de lo que valoraba, el vendedor recibía más de lo que costaba. Ese beneficio perdido es la <b>pérdida irrecuperable</b> (o «carga excesiva»). Es el costo oculto de los impuestos. Además, es mayor cuando la oferta y la demanda son más elásticas, y crece con el cuadrado de la tasa del impuesto.</p>
${figAgain('c5_sur','El triángulo de pérdida irrecuperable es el mismo de la eficiencia.')}

<h2>4. Subsidios y cuotas</h2>
<h3>Subsidios</h3>
<p>Un <b>subsidio</b> es un pago del gobierno a los productores. Es como un impuesto negativo: desplaza la oferta hacia abajo, el precio que pagan los compradores baja, el que reciben los vendedores sube y la cantidad aumenta por encima de la eficiente. El subsidio cuesta dinero a los contribuyentes y genera una pérdida irrecuperable por <b>sobreproducción</b>. Úsalo en la figura de arriba llevando el control a valores negativos.</p>
${figAgain('c6_tax')}
<h3>Cuotas de producción</h3>
<p>Una <b>cuota</b> limita la cantidad que se puede producir. Se usa en agricultura para sostener precios. Al restringirse la producción, el precio sube sobre el equilibrio, los vendedores ganan y los consumidores pierden. Es parecida a un monopolio autorizado por la ley.</p>
<h3>Fluctuaciones de la cosecha</h3>
<p>Como la demanda de alimentos es inelástica, una cosecha abundante hace caer mucho el precio y el ingreso de los agricultores. Y una cosecha escasa lo sube y el ingreso aumenta. Por eso se crean políticas de apoyo, que tienen un costo para el resto de la sociedad.</p>
${figAgain('c4_elas')}

<h2>5. Mercados para bienes ilegales</h2>
<p>¿Qué pasa si se prohíbe una droga? Supongamos que antes de la prohibición existe un mercado libre con su equilibrio. La prohibición aplica sanciones tanto a vendedores como a compradores.</p>
${figAgain('c3_eq')}
<ul>
<li><b>Sanciones a los vendedores</b> elevan el costo de ofrecer la droga (riesgo, sobornos): la <b>oferta disminuye</b>.</li>
<li><b>Sanciones a los compradores</b> reducen su disposición a pagar: la <b>demanda disminuye</b>.</li>
</ul>
<p>El resultado: la cantidad consumida baja, pero el precio <b>puede subir o bajar</b> según qué efecto domine. En la práctica, la demanda de drogas adictivas es muy inelástica y las sanciones a vendedores son más fuertes, por lo que el precio suele subir mucho. El libro analiza la <b>legalización con impuestos</b>: se eliminan los costos de ilegalidad y la oferta crece. Dependiendo del impuesto, el consumo puede quedar por encima o por debajo del nivel actual. No hay respuesta única: depende de cuánto se grave y de los costos sociales del consumo.</p>
${tip('<p>Este es un ejemplo de por qué la economía no dice «qué hacer», sino «qué ocurre si». Los efectos sobre precios y cantidades se calculan con oferta y demanda; la decisión final depende además de valores y de otros costos (salud, crimen).</p>','Para pensar')}
`,
terms:[['Precio tope','Precio máximo legal. Solo importa si queda debajo del equilibrio. Produce faltante.'],['Mercado negro','Mercado ilegal donde se paga un precio mayor al legal por una oferta restringida.'],['Salario mínimo','Salario mínimo legal. Si es mayor que el equilibrio, genera desempleo.'],['Incidencia del impuesto','Cómo se reparte la carga de un impuesto entre compradores y vendedores.'],['Pérdida irrecuperable','Beneficio de intercambios que dejan de ocurrir por una distorsión.'],['Subsidio','Pago del gobierno a productores. Aumenta la cantidad por encima del nivel eficiente.'],['Cuota de producción','Límite legal a la cantidad producida.']],
quiz:[
 {q:'Un precio tope por encima del equilibrio:',o:['No tiene efecto','Produce un faltante','Produce un excedente','Aumenta el precio de equilibrio'],a:0,why:'El mercado ya funciona a un precio menor al tope, así que la regla no es obligatoria.'},
 {q:'¿Quién paga la mayor parte de un impuesto si la demanda es muy inelástica?',o:['Los compradores','Los vendedores','El gobierno','Nadie'],a:0,why:'Los compradores no tienen alternativas y casi no reducen su compra, así que el precio sube casi todo el impuesto.'},
 {q:'Un salario mínimo por encima del equilibrio produce:',o:['Desempleo (la cantidad ofrecida de trabajo supera a la demandada)','Un faltante de trabajadores','Mayor eficiencia','Ningún cambio'],a:0,why:'Hay más gente dispuesta a trabajar de la que las empresas quieren contratar a ese salario más alto.'},
 {q:'Duplicar el impuesto por unidad (con las mismas curvas):',o:['Cuadruplica la pérdida irrecuperable','Duplica la pérdida irrecuperable','No la cambia','La elimina'],a:0,why:'El triángulo de pérdida tiene base (impuesto) y altura (caída de cantidad), ambas proporcionales al impuesto: el área crece con su cuadrado.'}]});
