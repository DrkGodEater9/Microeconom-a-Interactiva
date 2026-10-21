/** Capítulo 4 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { linspace, curve } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { def, ex, warn, eqn, fig, table } from '../../engine/blocks.js';

const D4=Q=>25-.5*Q;   // demanda lineal de pizzas: pasa por (10,20) -> elasticidad 4 (libro)
FIGS.c4_elas = {
  title:'Elasticidad a lo largo de una demanda en línea recta (ejemplo de las pizzas)',
  intro:'La elasticidad cambia de punto en punto aunque la línea sea recta. Mueve el punto y observa la elasticidad y el ingreso total (precio × cantidad).',
  panels:[{title:'Demanda de pizzas',x:{label:'Cantidad (pizzas por hora)',max:50,ticks:[0,10,20,25,30,40,50]},y:{label:'Precio ($ por pizza)',max:26,ticks:[0,5,10,15,20,25],fmt:v=>'$'+v},h:330},
          {title:'Ingreso total (IT = precio × cantidad)',x:{label:'Cantidad (pizzas por hora)',max:50,ticks:[0,10,20,25,30,40,50]},y:{label:'Ingreso total ($ por hora)',max:340,ticks:[0,100,200,300],fmt:v=>'$'+v},h:300}],
  controls:[{id:'Q',label:'Punto de la curva (cantidad)',min:2,max:48,step:.5,value:10,fmt:v=>fn(v,1)+' pizzas',hint:'Moverte a la izquierda = precios altos; a la derecha = precios bajos. Mira qué le pasa a la elasticidad y al ingreso total.'}],
  build(s){
    const Q=s.Q,P=D4(Q),e=2*P/Q,IT=P*Q;
    const A=[{k:'line',id:'dem',color:'blue',pts:[[0,25],[50,0]],w:3.6,label:'Demanda',legend:'Curva de demanda',info:['Curva de demanda (línea recta)','La pendiente es la misma en toda la línea (cada pizza más obliga a bajar el precio 50 centavos). Pero la <b>elasticidad</b> sí cambia: arriba la demanda es elástica y abajo, inelástica.']},
      {k:'line',id:'el',color:'purple',w:7,pts:[[0,25],[25,12.5]],legend:'Tramo elástico (e > 1)',info:['Tramo elástico (e > 1)','Con precios altos, un cambio de 1% en el precio provoca un cambio <b>mayor que 1%</b> en la cantidad. Los consumidores reaccionan mucho. Aquí, bajar el precio <b>aumenta</b> el ingreso total.']},
      {k:'line',id:'in',color:'teal',w:7,pts:[[25,12.5],[50,0]],legend:'Tramo inelástico (e < 1)',info:['Tramo inelástico (e < 1)','Con precios bajos, un cambio de 1% en el precio mueve la cantidad <b>menos de 1%</b>. Los consumidores reaccionan poco. Aquí, bajar el precio <b>reduce</b> el ingreso total.']},
      {k:'pt',id:'u',color:'amber',at:[25,12.5],r:6,label:{t:'Elasticidad unitaria',dx:6,dy:-10},legend:'Punto medio (e = 1)',info:['Punto medio: elasticidad unitaria (e = 1)','Justo en el punto medio de una demanda lineal, un cambio de 1% en el precio provoca un cambio de 1% en la cantidad. Es el punto de <b>máximo ingreso total</b>.']},
      {k:'area',id:'rect',color:e>1?'purple':e<1?'teal':'amber',op:.28,pts:[[0,0],[Q,0],[Q,P],[0,P]],label:{t:'IT = '+f$(IT,0),at:[Q/2,P/2]},legend:'Rectángulo: ingreso total',info:['Ingreso total (o gasto de los compradores)','Es el área del rectángulo: <b>precio × cantidad</b>. Lo que gastan los compradores y lo que ingresan los vendedores en una hora. Aquí: '+f$(P,2)+' × '+fn(Q,1)+' = '+f$(IT,1)+'.']},
      {k:'pt',id:'pt',color:'ink',at:[Q,P],r:7,guides:true,legend:false,info:['Punto elegido','Precio '+f$(P,2)+' y cantidad '+fn(Q,1)+' pizzas por hora.']}];
    const B=[{k:'line',id:'it',color:'green',w:3.6,pts:curve(q=>q*D4(q),0,50,60),label:'IT',legend:'Curva de ingreso total',info:['Curva de ingreso total','Muestra cuánto ingresan los vendedores a cada cantidad. Sube mientras la demanda es elástica, llega a su máximo cuando e = 1 y baja cuando es inelástica.']},
      {k:'pt',id:'itmax',color:'amber',at:[25,312.5],r:6,label:{t:'Máximo',dx:8,dy:-10},legend:'Ingreso máximo (e = 1)',info:['Ingreso total máximo','Ocurre en el punto de elasticidad unitaria (cantidad 25, precio $12.50). Más allá, bajar el precio hace caer el ingreso.']},
      {k:'pt',id:'itp',color:e>1?'purple':e<1?'teal':'amber',at:[Q,IT],r:7,guides:true,gx:fn(Q,1),gy:f$(IT,0),legend:false,info:['Tu ingreso total actual',f$(IT,1)+' por hora.']}];
    return {panels:[A,B],read:[['Precio',f$(P,2),'gray'],['Elasticidad',fn(e,2),e>1?'purple':e<1?'teal':'amber'],['Ingreso total',f$(IT,1),'green']],
     say:`<p>Con el precio en <b>${f$(P,2)}</b>, la elasticidad es <b>${fn(e,2)}</b>: la demanda es <b>${Math.abs(e-1)<.05?'de elasticidad unitaria':e>1?'elástica':'inelástica'}</b>.</p>`+(Math.abs(e-1)<.05?'<p>Estás en el punto de <b>ingreso máximo</b>: subir o bajar el precio reduce el ingreso total.</p>':e>1?'<p>Como es elástica, <b>bajar el precio</b> haría que la cantidad suba proporcionalmente más: el ingreso total <b>aumentaría</b>. Subirlo lo reduciría.</p>':'<p>Como es inelástica, <b>subir el precio</b> haría que la cantidad baje proporcionalmente menos: el ingreso total <b>aumentaría</b>. Bajarlo lo reduciría.</p>')};
  }
};
FIGS.c4_cte = {
  title:'¿Qué tan empinada o plana es la curva? Elasticidad de demanda y de oferta',
  intro:'Compara curvas con distinta elasticidad que pasan por el mismo punto (10 unidades a $20). Luego cambia el precio y mira cuánto responde la cantidad.',
  x:{label:'Cantidad',max:40,ticks:[0,10,20,30,40]}, y:{label:'Precio ($)',max:40,ticks:[0,10,20,30,40],fmt:v=>'$'+v},
  controls:[
   {id:'t',type:'seg',label:'Curva',value:'d',options:[['d','Demanda'],['o','Oferta']]},
   {id:'e',label:'Elasticidad (valor absoluto)',min:0,max:5,step:.1,value:1,fmt:v=>v===0?'0 (perfectamente inelástica)':v>=4.9?'∞ (casi perfectamente elástica)':fn(v,1),hint:'0: la cantidad no reacciona al precio (vertical). Grande: la cantidad reacciona muchísimo (casi horizontal). 1: reacciona en la misma proporción.'},
   {id:'dp',label:'Cambio porcentual del precio',min:-30,max:30,step:1,value:10,fmt:v=>(v>0?'+':'')+v+'%',hint:'Simula un alza o una baja del precio y mira cuánto cambia la cantidad.'}],
  build(s){
    const sg=s.t==='d'?-1:1, e=s.e, f=P=>10*Math.pow(P/20,sg*e);
    const pts=linspace(4,40,160).map(P=>[f(P),P]).filter(p=>p[0]<=40);
    if(e===0) pts.splice(0,pts.length,[10,0],[10,40]);
    const P2=20*(1+s.dp/100), Q2=e===0?10:f(P2), dq=(Q2/10-1)*100;
    const color=s.t==='d'?'blue':'red';
    const els=[{k:'line',id:'cur',color,w:3.8,pts,label:s.t==='d'?'Demanda':'Oferta',legend:s.t==='d'?'Curva de demanda':'Curva de oferta',info:[s.t==='d'?'Curva de demanda':'Curva de oferta','Cuanto más <b>plana</b> es, más elástica (la cantidad reacciona mucho al precio). Cuanto más <b>vertical</b>, más inelástica. Elasticidad actual: '+fn(e,1)+'.']},
      {k:'pt',id:'a',color:'ink',at:[10,20],r:6,guides:true,label:'Inicio',legend:'Punto inicial',info:['Punto inicial','Precio $20 y cantidad 10. Todas las curvas pasan por aquí para que las compares.']},
      {k:'pt',id:'b',color:'green',at:[Q2,P2],r:7,guides:true,gx:fn(Q2,1),gy:f$(P2,1),label:'Nuevo',legend:'Punto tras el cambio de precio',info:['Punto tras el cambio de precio','El precio cambia '+(s.dp>0?'+':'')+s.dp+'% y la cantidad cambia '+(dq>0?'+':'')+fn(dq,1)+'%.']}];
    const cls=e<.05?'perfectamente inelástica':e<1?'inelástica':Math.abs(e-1)<.05?'de elasticidad unitaria':e<4.9?'elástica':'casi perfectamente elástica';
    return {els,read:[['Precio',(s.dp>0?'+':'')+s.dp+'%','gray'],['Cantidad',(dq>0?'+':'')+fn(dq,1)+'%',s.t==='d'?'blue':'red'],['Tipo',cls,'purple']],
     say:`<p>Una curva ${cls}: si el precio cambia <b>${s.dp>0?'+':''}${s.dp}%</b>, la cantidad ${s.t==='d'?'demandada':'ofrecida'} cambia <b>${dq>0?'+':''}${fn(dq,1)}%</b>.</p>`+(s.t==='d'?`<p>Con demanda ${e>1?'elástica':e<1?'inelástica':'unitaria'}, ${s.dp>0?'subir':'bajar'} el precio ${(s.dp>0)===(e<1)?'hace <b>aumentar</b>':'hace <b>caer</b>'} el gasto total de los compradores.</p>`:'<p>Una oferta más elástica significa que los productores aumentan rápido la producción cuando sube el precio (tienen capacidad ociosa, insumos disponibles o tiempo para ajustar).</p>')};
  }
};
FIGS.c4_calc = {
  title:'Calculadora de elasticidad paso a paso (fórmula del punto medio)',
  intro:'Introduce dos precios y las cantidades demandadas. Los valores iniciales son del libro: el precio baja de $20.50 a $19.50 y las pizzas pasan de 9 a 11 por hora.',
  noplot:true,
  controls:[{id:'p1',label:'Precio inicial',min:5,max:40,step:.5,value:20.5,fmt:v=>f$(v,2)},{id:'p2',label:'Precio nuevo',min:5,max:40,step:.5,value:19.5,fmt:v=>f$(v,2)},
            {id:'q1',label:'Cantidad inicial',min:2,max:60,step:1,value:9,fmt:v=>v},{id:'q2',label:'Cantidad nueva',min:2,max:60,step:1,value:11,fmt:v=>v}],
  build(s){
    const dP=s.p2-s.p1, dQ=s.q2-s.q1, Pm=(s.p1+s.p2)/2, Qm=(s.q1+s.q2)/2;
    if(dP===0) return {read:[],say:'<p>El precio no cambió: no se puede calcular la elasticidad (hay que dividir entre cero). Cambia uno de los precios.</p>'};
    const pp=dP/Pm*100, pq=dQ/Qm*100, e=Math.abs(pq/pp), cls=Math.abs(e-1)<.03?'unitaria (e = 1)':e>1?'elástica (e > 1)':'inelástica (e < 1)';
    const IT1=s.p1*s.q1, IT2=s.p2*s.q2;
    return {read:[['Cambio % del precio',fn(pp,1)+'%','gray'],['Cambio % de la cantidad',fn(pq,1)+'%','blue'],['Elasticidad',fn(e,2),'purple'],['Ingreso total',f$(IT1,0)+' → '+f$(IT2,0),IT2>IT1?'green':'red']],
     sayTitle:'El cálculo, paso a paso',
     say:`<p><b>1.</b> Cambio en el precio: ${f$(s.p2,2)} − ${f$(s.p1,2)} = ${f$(dP,2)}. Precio promedio: (${f$(s.p1,2)} + ${f$(s.p2,2)}) ÷ 2 = ${f$(Pm,2)}.</p><p><b>2.</b> Cambio % del precio = ${fn(dP,2)} ÷ ${fn(Pm,2)} × 100 = <b>${fn(pp,1)}%</b>.</p><p><b>3.</b> Cambio en la cantidad: ${s.q2} − ${s.q1} = ${dQ}. Cantidad promedio: ${fn(Qm,1)}. Cambio % = ${dQ} ÷ ${fn(Qm,1)} × 100 = <b>${fn(pq,1)}%</b>.</p><p><b>4.</b> Elasticidad = |${fn(pq,1)}% ÷ ${fn(pp,1)}%| = <b>${fn(e,2)}</b>. La demanda es <b>${cls}</b>.</p><p><b>5.</b> Ingreso total: ${f$(s.p1,2)} × ${s.q1} = ${f$(IT1,1)} antes y ${f$(s.p2,2)} × ${s.q2} = ${f$(IT2,1)} después: ${IT2>IT1?'<b>subió</b>':IT2<IT1?'<b>bajó</b>':'no cambió'}. ${(IT2>IT1)===(dP<0)?'Eso es coherente con una demanda '+(dP<0?'elástica':'inelástica')+'.':''}</p>`};
  }
};
FIGS.c4_otras = {
  title:'Otras elasticidades: cruzada e ingreso',
  intro:'Elige un tipo de bien y mueve el cambio porcentual. Verás cuánto cambia la cantidad demandada y por qué el signo de la elasticidad cuenta una historia.',
  noplot:true,
  controls:[{id:'t',type:'seg',label:'Relación',value:'sus',options:[['sus','Sustituto (precio de otro bien)'],['com','Complemento (precio de otro bien)'],['nor','Bien normal (ingreso)'],['lux','Bien de lujo (ingreso)'],['inf','Bien inferior (ingreso)']]},
            {id:'x',label:'Cambio % del precio del otro bien, o del ingreso',min:-20,max:20,step:1,value:10,fmt:v=>(v>0?'+':'')+v+'%'}],
  build(s){
    const M={sus:{e:1.5,n:'cruzada',who:'el precio del sustituto',ex:'Si el precio de la carne de res sube 10%, la gente compra más pollo. Elasticidad cruzada positiva = sustitutos.'},
             com:{e:-1.5,n:'cruzada',who:'el precio del complemento',ex:'Si sube el precio de los autos, la demanda de gasolina cae. Elasticidad cruzada negativa = complementos.'},
             nor:{e:.8,n:'ingreso',who:'el ingreso',ex:'Alimentos básicos: al subir el ingreso se compra algo más, pero en menor proporción. Elasticidad ingreso entre 0 y 1.'},
             lux:{e:2,n:'ingreso',who:'el ingreso',ex:'Viajes al extranjero o restaurantes caros: al subir el ingreso su compra crece más que proporcionalmente. Elasticidad ingreso &gt; 1 (bien de lujo o «elástico al ingreso»).'},
             inf:{e:-.5,n:'ingreso',who:'el ingreso',ex:'Transporte colectivo o ropa de segunda mano: cuando sube el ingreso se compra menos. Elasticidad ingreso negativa = bien inferior.'}}[s.t];
    const dq=M.e*s.x;
    return {read:[['Elasticidad '+M.n,fn(M.e,1),'purple'],['Cambio % de '+M.who,(s.x>0?'+':'')+s.x+'%','gray'],['Cambio % cantidad demandada',(dq>0?'+':'')+fn(dq,1)+'%',dq>=0?'green':'red']],
     sayTitle:'Cómo leer el signo',say:`<p>${M.ex}</p><p>Aquí: ${s.x>0?'+':''}${s.x}% en ${M.who} × elasticidad ${fn(M.e,1)} = <b>${dq>0?'+':''}${fn(dq,1)}%</b> en la cantidad demandada.</p>`};
  }
};
CHAPTERS.push({id:4,title:'Elasticidad',
teaser:'Qué tan sensibles son compradores y vendedores a un cambio de precio, ingreso u otros precios.',
bigq:'Si una empresa sube su precio, ¿le conviene? Depende de cuánto reaccionen los compradores. La elasticidad mide esa reacción y permite pronosticar cómo se mueven precios, cantidades e ingresos.',
learn:['Definir la elasticidad precio de la demanda y calcularla con el método del punto medio.','Clasificar la demanda en elástica, inelástica o unitaria y relacionarla con el ingreso total.','Reconocer los factores que hacen más o menos elástica una demanda.','Interpretar las elasticidades cruzada e ingreso, y la elasticidad de la oferta.'],
html:`
<h2>1. La elasticidad precio de la demanda</h2>
<p>La ley de la demanda dice que si el precio sube, la cantidad demandada baja. Pero no dice <b>cuánto</b> baja. Esa es la gran pregunta: ¿un alza de 10% en el precio hace caer la cantidad 2%, o 30%? La respuesta es muy distinta para la sal que para los viajes de vacaciones.</p>
<p>Una primera idea sería medir la pendiente de la curva. Pero la pendiente depende de las unidades: si mides el precio en dólares o centavos, cambia. Los economistas usan algo mejor: comparan cambios <b>en porcentajes</b>, que no dependen de las unidades.</p>
${def('Elasticidad precio de la demanda','<p>Es una medida, sin unidades, de la sensibilidad de la cantidad demandada a un cambio en el precio, con todo lo demás constante.</p>')}
${eqn('Elasticidad = cambio porcentual de la cantidad demandada ÷ cambio porcentual del precio','Se reporta en valor absoluto (sin el signo negativo) porque el precio y la cantidad se mueven en sentidos opuestos.')}
<h3>Cálculo con el método del punto medio</h3>
<p>Aparece un problema: si el precio sube de $20 a $22, es +10%; pero si baja de $22 a $20, es −9.1%. Para evitar esa inconsistencia usamos el <b>precio promedio</b> y la <b>cantidad promedio</b> como base de cada porcentaje:</p>
${eqn('% cambio del precio = ΔP ÷ P<sub>promedio</sub> × 100 &nbsp;&nbsp; % cambio de la cantidad = ΔQ ÷ Q<sub>promedio</sub> × 100')}
<p>El libro usa las pizzas: el precio baja de $20.50 a $19.50 y la cantidad sube de 9 a 11. El precio promedio es $20: una baja de $1 es <b>5%</b>. La cantidad promedio es 10: un aumento de 2 es <b>20%</b>. La elasticidad es 20% ÷ 5% = <b>4</b>. Puedes comprobarlo y probar tus propios números aquí:</p>
${fig('c4_calc')}
<h3>Demanda elástica, inelástica y unitaria</h3>
<ul>
<li><b>Elástica</b> (elasticidad &gt; 1): la cantidad cambia en un porcentaje <b>mayor</b> que el precio. Los compradores reaccionan mucho (viajes, restaurantes caros).</li>
<li><b>Inelástica</b> (elasticidad &lt; 1): la cantidad cambia en un porcentaje <b>menor</b>. Reaccionan poco (sal, medicinas para una enfermedad grave).</li>
<li><b>Unitaria</b> (elasticidad = 1): la cantidad cambia exactamente en el mismo porcentaje.</li>
<li><b>Perfectamente inelástica</b> (0): la cantidad no cambia nunca. Curva vertical.</li>
<li><b>Perfectamente elástica</b> (infinito): un mínimo cambio de precio hace que la cantidad se vaya a cero o crezca sin límite. Curva horizontal.</li>
</ul>
${fig('c4_cte')}
${warn('<p>Elasticidad <b>no es lo mismo que pendiente</b>. Una demanda en línea recta tiene la misma pendiente en todos sus puntos, pero su elasticidad cambia de punto en punto (la siguiente figura lo muestra). Una curva plana parece más elástica, pero depende de las unidades; la elasticidad no.</p>')}
<h3>Elasticidad a lo largo de una curva de demanda en línea recta</h3>
<p>Mira en la siguiente figura cómo la elasticidad es alta arriba (donde el precio es alto y la cantidad baja) y baja abajo. Esto sucede porque un mismo cambio absoluto de, digamos, $1 es un porcentaje enorme de un precio bajo y uno pequeño de un precio alto. En el punto medio la elasticidad es exactamente 1.</p>
<h3>Ingreso total y elasticidad: la prueba del ingreso total</h3>
<p>El <b>ingreso total</b> de los vendedores (o gasto total de los compradores) es el precio multiplicado por la cantidad. La elasticidad nos dice qué pasa con él cuando cambia el precio:</p>
${table(['Si la demanda es…','Y el precio sube','Y el precio baja'],[['Elástica','El ingreso total <b>baja</b>','El ingreso total <b>sube</b>'],['Inelástica','El ingreso total <b>sube</b>','El ingreso total <b>baja</b>'],['Unitaria','No cambia','No cambia']])}
${fig('c4_elas')}
${ex('Una aplicación','<p>Los agricultores suelen preocuparse por las cosechas abundantes. La demanda de alimentos básicos es inelástica: una cosecha grande baja mucho el precio pero la gente casi no compra más, así que el ingreso total de los agricultores <b>cae</b>. Por eso, a veces los productores prefieren una cosecha pequeña.</p>')}
<h3>Factores que influyen en la elasticidad de la demanda</h3>
<ul>
<li><b>Disponibilidad de sustitutos cercanos.</b> Cuantos más sustitutos buenos tenga un bien, más elástica es su demanda. «Pizza de una pizzería específica» es muy elástica; «alimentos» en general, poco.</li>
<li><b>Proporción del ingreso gastado.</b> Cuanto mayor es el gasto en un bien respecto al ingreso, más elástica es su demanda. Si los chicles suben 10%, ni lo notas; si el alquiler sube 10%, sí.</li>
<li><b>Horizonte temporal.</b> Cuanto más tiempo pasa, más elástica es la demanda: en el corto plazo no puedes cambiar de auto si sube la gasolina, pero en cinco años sí.</li>
</ul>

<h2>2. Más elasticidades de la demanda</h2>
<h3>Elasticidad cruzada</h3>
<p>Mide cuánto cambia la cantidad demandada de un bien cuando cambia el <b>precio de otro bien</b>:</p>
${eqn('Elasticidad cruzada = % cambio de la cantidad demandada de un bien ÷ % cambio del precio de otro bien')}
<ul><li><b>Positiva</b>: los bienes son <b>sustitutos</b> (si sube el precio de uno, se compra más del otro).</li>
<li><b>Negativa</b>: son <b>complementos</b> (si sube el precio de uno, se compra menos de ambos).</li></ul>
<h3>Elasticidad ingreso de la demanda</h3>
<p>Mide cuánto cambia la cantidad demandada cuando cambia el <b>ingreso</b>:</p>
${eqn('Elasticidad ingreso = % cambio de la cantidad demandada ÷ % cambio del ingreso')}
<ul><li><b>Mayor que 1</b>: bien de lujo (elástico al ingreso).</li>
<li><b>Entre 0 y 1</b>: bien normal básico (inelástico al ingreso).</li>
<li><b>Negativa</b>: bien inferior.</li></ul>
${fig('c4_otras')}
<p>Esto explica un fenómeno histórico: cuando un país se enriquece, la parte de su ingreso gastada en alimentos baja (elasticidad ingreso &lt; 1) y la gastada en ocio, viajes y servicios sube (elasticidad &gt; 1).</p>

<h2>3. Elasticidad de la oferta</h2>
<p>Se calcula de forma idéntica pero con la cantidad <i>ofrecida</i>:</p>
${eqn('Elasticidad de la oferta = % cambio de la cantidad ofrecida ÷ % cambio del precio')}
<p>Es positiva (ley de la oferta). Será <b>elástica</b> si la producción puede aumentar fácilmente cuando sube el precio, e <b>inelástica</b> si no. Depende de:</p>
<ul>
<li><b>Posibilidad de sustituir recursos.</b> Los bienes que se producen con recursos de uso común (camisetas) tienen oferta elástica; los que requieren recursos únicos (vino de una región, pinturas de un artista) la tienen inelástica.</li>
<li><b>Tiempo desde el cambio de precio.</b> Con el tiempo, la oferta es más elástica: el productor puede construir más fábricas o plantar más árboles. Se distinguen tres plazos: <i>instantáneo</i> (oferta inelástica, no puedes producir más ya), <i>corto plazo</i> (ajusta algo, ej. más horas de trabajo) y <i>largo plazo</i> (puede cambiar todo, incluido el capital).</li>
</ul>
<p>Cambia a «Oferta» en la figura de curvas (arriba) para ver cómo se ve una oferta elástica e inelástica.</p>
`,
terms:[['Elasticidad precio de la demanda','% cambio de la cantidad demandada ÷ % cambio del precio. Mide la sensibilidad de los compradores.'],['Método del punto medio','Usa promedios como base de los cambios porcentuales para que el resultado sea igual subiendo o bajando el precio.'],['Demanda elástica','Elasticidad mayor que 1: la cantidad reacciona más que proporcionalmente al precio.'],['Demanda inelástica','Elasticidad menor que 1: la cantidad reacciona menos que proporcionalmente.'],['Elasticidad unitaria','Elasticidad igual a 1.'],['Ingreso total','Precio × cantidad.'],['Elasticidad cruzada','Respuesta de la cantidad de un bien al precio de otro. Positiva: sustitutos; negativa: complementos.'],['Elasticidad ingreso','Respuesta de la cantidad al ingreso. &gt;1 lujo; 0–1 normal; &lt;0 inferior.'],['Elasticidad de la oferta','% cambio de la cantidad ofrecida ÷ % cambio del precio.']],
quiz:[
 {q:'El precio de un bien sube 10% y la cantidad demandada cae 25%. La demanda es:',o:['Elástica, y el ingreso total de los vendedores cae','Inelástica, y el ingreso sube','Elástica, y el ingreso sube','Unitaria'],a:0,why:'Elasticidad = 25% ÷ 10% = 2,5 &gt; 1. Con demanda elástica, subir el precio reduce el ingreso total.'},
 {q:'En el punto medio de una demanda lineal:',o:['La elasticidad es 1 y el ingreso total es máximo','La elasticidad es 0','El ingreso total es cero','La demanda es perfectamente elástica'],a:0,why:'Arriba del punto medio es elástica (bajar el precio sube el ingreso) y abajo inelástica (bajar el precio lo reduce). El máximo está en medio.'},
 {q:'¿Cuál de estos bienes probablemente tiene la demanda MÁS inelástica?',o:['La insulina para un diabético','Una marca específica de refrescos','Un viaje de vacaciones','Una pizza de una pizzería concreta'],a:0,why:'No tiene sustitutos cercanos y es una necesidad. Cuantos más sustitutos, más elástica es la demanda.'},
 {q:'Si la elasticidad cruzada entre los bienes A y B es negativa, entonces A y B son:',o:['Complementos','Sustitutos','Bienes inferiores','Bienes de lujo'],a:0,why:'Si sube el precio de B y baja la cantidad comprada de A, se usan juntos: son complementos.'}]});
