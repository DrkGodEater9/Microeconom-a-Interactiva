/** Capítulo 10 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { linspace, curve } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { eqn, fig, table } from '../../engine/blocks.js';

const PT=L=>6*L+3*L*L-.25*L*L*L, MPf=L=>6+6*L-.75*L*L, APf=L=>6+3*L-.25*L*L;
FIGS.c10_prod = {
  title:'Producto total, marginal y medio (ejemplo ilustrativo)',
  intro:'Contratas trabajadores para una fábrica con tamaño fijo. Mira cómo el producto total sube, pero cada trabajador extra aporta cada vez menos.',
  panels:[{title:'Producto total (PT): cuánto produce la fábrica',x:{label:'Trabajadores contratados',max:9,ticks:[0,1,2,3,4,5,6,7,8,9]},y:{label:'Unidades por día',max:130,ticks:[0,30,60,90,120]},h:300},
          {title:'Producto marginal (PM) y producto medio (PMe)',x:{label:'Trabajadores contratados',max:9,ticks:[0,1,2,3,4,5,6,7,8,9]},y:{label:'Unidades por trabajador',max:21,ticks:[0,5,10,15,20]},h:300}],
  controls:[{id:'L',label:'Trabajadores',min:.5,max:9,step:.1,value:3,fmt:v=>fn(v,1),hint:'Los primeros trabajadores se «ayudan» (especializan). Después, la fábrica se llena y cada nuevo trabajador aporta menos: rendimientos decrecientes.'}],
  build(s){
    const L=s.L, pt=PT(L), pm=MPf(L), pa=APf(L);
    const A=[{k:'line',id:'pt',color:'blue',w:3.8,pts:curve(PT,0,9,70),label:'PT',legend:'Producto total (PT)',info:['Producto total','Cantidad total producida con cada número de trabajadores, con el tamaño de planta fijo. Sube, pero cada vez más despacio (rendimientos decrecientes).']},
      {k:'line',id:'tg',color:'red',w:4,pts:[[Math.max(0,L-1.3),pt+pm*(Math.max(0,L-1.3)-L)],[Math.min(9,L+1.3),pt+pm*(Math.min(9,L+1.3)-L)]],legend:'Pendiente = producto marginal',info:['La pendiente del PT es el producto marginal','Aquí, '+fn(pm,1)+': es lo que aporta un trabajador adicional.']},
      {k:'pt',id:'p',color:'ink',at:[L,pt],r:7,guides:true,gx:fn(L,1),gy:fn(pt,1),legend:false,info:['Tu punto','Con '+fn(L,1)+' trabajadores producen '+fn(pt,1)+' unidades por día.']}];
    const B=[{k:'line',id:'pm',color:'red',w:3.8,pts:curve(MPf,0,9,70),label:'PM',lp:20,legend:'Producto marginal (PM)',info:['Producto marginal (PM)','Cuánto aumenta la producción por contratar <b>un trabajador más</b>. Primero sube (especialización), luego baja (<b>ley de los rendimientos decrecientes</b>): al agregar más de un factor variable a un factor fijo, su aporte adicional termina cayendo.']},
      {k:'line',id:'pa',color:'blue',w:3.8,pts:curve(APf,0,9,70),label:'PMe',lp:55,legend:'Producto medio (PMe)',info:['Producto medio (PMe)','Producción total dividida entre el número de trabajadores: lo que produce <b>en promedio</b> cada uno. Sube mientras el PM está por encima de él y baja cuando el PM está por debajo.']},
      {k:'pt',id:'cross',color:'amber',at:[6,15],r:6,label:{t:'PM = PMe',dx:10,dy:-8},legend:'Cruce: máximo del PMe',info:['El PM corta al PMe en su máximo','Si lo que aporta el último trabajador (PM) es mayor que el promedio, el promedio sube. Si es menor, baja. Igual que tu promedio de notas: una nota nueva mayor que tu promedio lo sube. En el cruce, el promedio está en su cima.']},
      {k:'pt',id:'pm1',color:'red',at:[L,pm],r:6,legend:false,info:['PM aquí','El trabajador número '+fn(L,1)+' aporta '+fn(pm,1)+' unidades.']},
      {k:'pt',id:'pa1',color:'blue',at:[L,pa],r:6,legend:false,info:['PMe aquí','En promedio, cada trabajador produce '+fn(pa,1)+' unidades.']}];
    return {panels:[A,B],read:[['Producción total',fn(pt,1),'blue'],['Producto marginal',fn(pm,1),'red'],['Producto medio',fn(pa,1),'blue']],
     say:`<p>Con <b>${fn(L,1)}</b> trabajadores se producen <b>${fn(pt,1)}</b> unidades. El último trabajador aporta <b>${fn(pm,1)}</b>; el promedio por trabajador es <b>${fn(pa,1)}</b>.</p><p>${pm>pa?'El PM está <b>por encima</b> del PMe: el promedio <b>sube</b>.':pm<pa?'El PM está <b>por debajo</b> del PMe: el promedio <b>baja</b>.':'PM = PMe: el promedio está en su máximo.'}</p><p>${L<4?'Todavía hay <b>rendimientos crecientes</b>: cada trabajador nuevo aporta más que el anterior.':'Hay <b>rendimientos decrecientes</b>: cada trabajador nuevo aporta menos que el anterior.'}</p>`};
  }
};
FIGS.c10_cost = {
  title:'Curvas de costos a corto plazo',
  intro:'Los costos fijos no cambian con la producción; los variables sí. El <b>costo marginal</b> (CM) corta al costo medio en su punto más bajo. Cambia costos fijos o el precio de los insumos y mira qué curvas se mueven.',
  x:{label:'Producción (unidades por día)',max:14,ticks:[0,2,4,6,8,10,12,14]}, y:{label:'Costo por unidad ($)',max:16,ticks:[0,4,8,12,16],fmt:v=>'$'+v},
  controls:[
   {id:'q',label:'Producción',min:1,max:14,step:.25,value:5,fmt:v=>fn(v,2),hint:'Mira cómo cada curva pasa por la línea vertical.'},
   {id:'F',label:'Costo fijo total (alquiler, maquinaria)',min:0,max:60,step:5,value:25,fmt:v=>'$'+v,hint:'Un costo fijo mayor eleva el costo total medio y el costo fijo medio, <b>pero no el costo marginal</b>: el CM solo depende de lo variable.'},
   {id:'v',label:'Precio de los insumos variables (salarios, materiales)',min:.6,max:1.6,step:.1,value:1,fmt:v=>'×'+fn(v,1),hint:'Insumos más caros suben el costo variable y el marginal: se desplazan CM, CVMe y CTMe.'}],
  build(s){
    const {F,v}=s, MC=q=>v*(6-1.8*q+.21*q*q), AVC=q=>v*(6-.9*q+.07*q*q), AFC=q=>F/q, ATC=q=>AFC(q)+AVC(q);
    const q=s.q;
    let qm=.5,best=1e9; for(let x=.5;x<=14;x+=.01){ if(ATC(x)<best){best=ATC(x);qm=x;} }
    const els=[
     {k:'line',id:'cm',color:'red',w:3.6,pts:curve(MC,.3,14,80),label:'CM',legend:'Costo marginal (CM)',info:['Costo marginal (CM)','Lo que cuesta producir <b>una unidad más</b>. Primero baja (especialización), luego sube (rendimientos decrecientes). Corta al CVMe y al CTMe en sus puntos mínimos.']},
     {k:'line',id:'ctm',color:'blue',w:3.6,pts:curve(ATC,.6,14,90),label:'CTMe',legend:'Costo total medio (CTMe)',info:['Costo total medio (CTMe)','Costo total ÷ unidades producidas: lo que cuesta cada unidad <b>en promedio</b>. Forma de U: baja al repartirse el costo fijo; sube por rendimientos decrecientes.']},
     {k:'line',id:'cvm',color:'teal',w:3.2,pts:curve(AVC,.3,14,80),label:'CVMe',legend:'Costo variable medio (CVMe)',info:['Costo variable medio (CVMe)','Costo variable total ÷ unidades. También forma de U, pero su mínimo está a una producción menor que el del CTMe.']},
     {k:'line',id:'cfm',color:'purple',w:3,pts:curve(AFC,.9,14,60),label:'CFMe',lp:3,legend:'Costo fijo medio (CFMe)',info:['Costo fijo medio (CFMe)','Costo fijo ÷ unidades. <b>Siempre baja</b> al producir más: el costo fijo se «reparte» entre más unidades («efecto de repartir el costo fijo»). La distancia vertical entre el CTMe y el CVMe es el CFMe.']},
     {k:'pt',id:'min',color:'amber',at:[qm,best],r:7,label:{t:'Mínimo del CTMe',dx:10,dy:-12},legend:'Escala eficiente (mín. CTMe)',info:['Mínimo del costo total medio','Es la producción con el menor costo por unidad: la <b>escala eficiente</b>. Aquí CM = CTMe. Si el CM está por debajo del CTMe, el promedio baja; si está por encima, sube.']},
     {k:'line',id:'vq',color:'ink',dash:'4 4',w:2,pts:[[q,0],[q,16]],legend:false}];
    const rd=[['CM',f$(MC(q),2),'red'],['CTMe',f$(ATC(q),2),'blue'],['CVMe',f$(AVC(q),2),'teal'],['CFMe',f$(AFC(q),2),'purple']];
    return {els,read:rd,
     say:`<p>Con <b>${fn(q,2)}</b> unidades: CM = ${f$(MC(q),2)}; CTMe = ${f$(ATC(q),2)} = CFMe (${f$(AFC(q),2)}) + CVMe (${f$(AVC(q),2)}).</p><p>${MC(q)<ATC(q)?'El CM está <b>por debajo</b> del CTMe, así que el costo medio <b>baja</b>.':'El CM está <b>por encima</b> del CTMe, así que el costo medio <b>sube</b>.'}</p><p>El costo medio es más bajo en <b>${fn(qm,1)}</b> unidades (${f$(best,2)}). Si lo produces, estás en tu <i>escala eficiente</i>.</p>`};
  }
};
FIGS.c10_lr = {
  title:'Costos a largo plazo: la envolvente de las plantas',
  intro:'A largo plazo puedes elegir el tamaño de la planta. Cada tamaño tiene su propia curva de costo medio a corto plazo; la curva de largo plazo toma, para cada producción, la planta más barata (ejemplo ilustrativo).',
  x:{label:'Producción (unidades por día)',max:18,ticks:[0,3,6,9,12,15,18]}, y:{label:'Costo medio por unidad ($)',max:16,ticks:[0,4,8,12,16],fmt:v=>'$'+v},
  controls:[{id:'sz',label:'Tamaño de la planta',min:1,max:8,step:.25,value:3,fmt:v=>fn(v,2),hint:'Una planta pequeña es barata para producir poco; una grande lo es para producir mucho.'}],
  build(s){
    const m=z=>14-3.2*z+.32*z*z, c=z=>.9/z, SR=(z,Q)=>m(z)+c(z)*(Q-2*z)*(Q-2*z);
    const grid=linspace(1,8,140), LR=Q=>Math.min(...grid.map(z=>SR(z,Q)));
    const z=s.sz, Qm=2*z, els=[];
    els.push({k:'line',id:'sr',color:'purple',w:3,pts:curve(Q=>SR(z,Q),0,18,70).filter(p=>p[1]<=16),label:'CTMe de esta planta',lp:62,legend:'Costo medio a corto plazo (esta planta)',info:['Costo medio a corto plazo de esta planta','Si construyes la planta de tamaño '+fn(z,2)+', éste es tu costo medio al producir distintas cantidades: lo más bajo posible está en '+fn(Qm,1)+' unidades.']});
    els.push({k:'line',id:'lr',color:'blue',w:4,pts:curve(LR,.6,18,100).filter(p=>p[1]<=16),label:'CTMe largo plazo',lp:5,legend:'Costo medio a largo plazo (envolvente)',info:['Costo medio a largo plazo (CTMeLP)','Para cada producción, el menor costo medio que se puede lograr eligiendo la planta ideal. Se llama <b>envolvente</b> porque rodea por debajo a todas las curvas de corto plazo. Tiene forma de U por las economías y deseconomías de escala.']});
    els.push({k:'area',id:'eco',color:'green',op:.14,pts:[[0.6,0],[10,0],[10,16],[0.6,16]],label:{t:'Economías de escala',at:[5.2,14.2]},legend:'Economías de escala (CTMeLP baja)',info:['Economías de escala','Al aumentar la producción, el costo medio de largo plazo <b>baja</b>. Causas: especialización de trabajadores, uso de maquinaria más productiva y mejor aprovechamiento de recursos.']});
    els.push({k:'area',id:'dec',color:'red',op:.1,pts:[[10,0],[18,0],[18,16],[10,16]],label:{t:'Deseconomías de escala',at:[14.2,14.2]},legend:'Deseconomías de escala (CTMeLP sube)',info:['Deseconomías de escala','Al aumentar demasiado la producción, el costo medio sube. Causa típica: coordinar una organización enorme es difícil (burocracia, comunicación, supervisión).']});
    els.push({k:'pt',id:'esc',color:'amber',at:[10,6],r:7,label:{t:'Escala mínima eficiente',dx:-8,dy:24,anchor:'middle'},legend:'Escala mínima eficiente',info:['Escala mínima eficiente','Es la producción donde el costo medio de largo plazo es el más bajo posible ($6.00 con una planta de tamaño 5). Si el mercado es lo bastante grande como para varias empresas de esa escala, habrá competencia; si no, tenderá a haber una sola empresa (monopolio natural).']});
    const cmP=SR(z,Qm), lrp=LR(Qm);
    return {els,read:[['Producción de menor costo con esta planta',fn(Qm,1),'purple'],['Costo medio ahí',f$(cmP,2),'purple'],['Mejor costo posible (LP) ahí',f$(lrp,2),'blue']],
     say:`<p>La planta de tamaño <b>${fn(z,2)}</b> alcanza su costo más bajo (${f$(cmP,2)}) al producir ${fn(Qm,1)}. Si quisieras producir ${fn(Qm,1)} con el mejor tamaño posible, pagarías ${f$(lrp,2)}.</p><p>${z<4.9?'Esta planta es <b>pequeña</b>: aún estamos en la zona de economías de escala (conviene crecer).':z>5.1?'Esta planta es <b>grande</b>: ya estamos en deseconomías de escala (demasiado grande).':'Esta planta está en la <b>escala eficiente</b>.'}</p>`};
  }
};
CHAPTERS.push({id:10,title:'Producción y costos',
teaser:'Corto y largo plazo, rendimientos decrecientes, curvas de producto y de costos.',
bigq:'¿Por qué producir más unidades a veces sale más barato por unidad y a veces más caro? La respuesta está en cómo se relacionan lo que produce la empresa y lo que le cuesta.',
learn:['Distinguir corto y largo plazo y factores fijos de variables.','Interpretar producto total, marginal y medio, y la ley de rendimientos decrecientes.','Explicar la forma de las curvas de costo y por qué CM corta a los costos medios en su mínimo.','Explicar economías y deseconomías de escala.'],
html:`
<h2>1. La estructura de tiempo en la toma de decisiones</h2>
<p>No es lo mismo cambiar la cantidad de trabajadores que construir una nueva fábrica. Por eso los economistas distinguen dos plazos:</p>
<ul>
<li><b>Corto plazo:</b> el periodo en el que la cantidad de al menos <b>un factor</b> (generalmente el capital: maquinaria, edificios) no puede cambiarse. Se llama factor <b>fijo</b>. Los factores que sí pueden cambiar (trabajo, materiales) son <b>variables</b>.</li>
<li><b>Largo plazo:</b> el periodo en el que <b>todos</b> los factores pueden cambiarse, incluida la planta.</li>
</ul>
<p>No hay una cantidad de meses o años que defina cada plazo: depende de cada empresa. Una pizzería cambia de horno en semanas; una siderúrgica, en años.</p>

<h2>2. La restricción tecnológica a corto plazo</h2>
<p>En el corto plazo la empresa solo puede aumentar su producción contratando más trabajo (por ejemplo). Se estudian tres conceptos:</p>
<ul>
<li><b>Producto total (PT):</b> la producción total con cierto número de trabajadores.</li>
<li><b>Producto marginal (PM):</b> el aumento del producto total al contratar <b>un trabajador más</b>.</li>
<li><b>Producto medio (PMe):</b> el producto total ÷ el número de trabajadores.</li>
</ul>
${fig('c10_prod')}
<h3>La ley de los rendimientos decrecientes</h3>
<p>Al principio, un trabajador extra aporta más que el anterior (se especializan: uno corta, otro cose). Pero la planta tiene un tamaño fijo. Con cada trabajador adicional aparecen filas, esperas y estorbos. Llega un punto en que el producto marginal <b>empieza a bajar</b>. Esa es la <b>ley de los rendimientos decrecientes</b>: <i>si se aumenta un factor variable manteniendo fijos los otros, su producto marginal llega a disminuir</i>. Es una ley física y no de gustos.</p>
<h3>PM y PMe: la analogía de las calificaciones</h3>
<p>Imagina que tienes 7 de promedio. Si en el siguiente curso obtienes un 8 (nota marginal mayor al promedio), tu promedio sube. Si luego sacas 6 (menor al promedio), tu promedio baja. Igual con el producto: <b>si el PM es mayor que el PMe, el PMe sube; si es menor, baja</b>. Por eso el PM corta al PMe justo en su máximo.</p>

<h2>3. Costos a corto plazo</h2>
<p>Los costos de la empresa salen de la tecnología y de los precios de los insumos. Hay tres costos totales:</p>
<ul>
<li><b>Costo fijo total (CFT):</b> el costo de los factores fijos (renta, maquinaria). No cambia con la producción. Se paga aunque produzcas cero.</li>
<li><b>Costo variable total (CVT):</b> el costo de los factores variables (trabajo, materiales). Sube con la producción.</li>
<li><b>Costo total (CT) = CFT + CVT.</b></li>
</ul>
<p>Y de ellos salen los costos por unidad:</p>
${eqn('Costo marginal: CM = ΔCT ÷ ΔQ &nbsp;&nbsp; Costo fijo medio: CFMe = CFT ÷ Q &nbsp;&nbsp; Costo variable medio: CVMe = CVT ÷ Q &nbsp;&nbsp; Costo total medio: CTMe = CT ÷ Q = CFMe + CVMe')}
<p>El libro usa el ejemplo de una fábrica de camisas con CFT de $25 al día y trabajadores a $25 por día:</p>
${table(['Camisas por día','CFT','CVT','CT','CM','CFMe','CVMe','CTMe'],[[0,25,0,25,'—','—','—','—'],[4,25,25,50,'6.25','6.25','6.25','12.50'],[10,25,50,75,'4.17','2.50','5.00','7.50'],[13,25,75,100,'8.33','1.92','5.77','7.69'],[15,25,100,125,'12.50','1.67','6.67','8.33'],[16,25,125,150,'25.00','1.56','7.81','9.38']])}
<p>El costo marginal es $4.17 al pasar de 4 a 10 camisas ($25 más para 6 camisas más) y sube a $25 de 15 a 16: producir cada camisa extra cuesta más.</p>
${fig('c10_cost')}
<h3>¿Por qué el costo medio tiene forma de U?</h3>
<ul>
<li><b>Baja al principio</b> por dos razones: el costo fijo se reparte entre más unidades (CFMe cae) y al principio hay rendimientos crecientes.</li>
<li><b>Sube después</b> por los rendimientos decrecientes: cada unidad extra exige proporcionalmente más trabajo, así que el CVMe crece.</li>
</ul>
<p>La curva de <b>costo marginal</b> corta a las curvas de CVMe y CTMe en sus <b>mínimos</b>, por la misma lógica del promedio de notas: si el costo de la última unidad es menor que el promedio, el promedio baja.</p>
<h3>Relación entre curvas de costo y de producto</h3>
<p>Son «imágenes especulares»: cuando el producto marginal sube, el costo marginal baja; cuando el PM llega a su máximo, el CM llega a su mínimo; cuando el PMe llega a su máximo, el CVMe llega a su mínimo. Es lógico: si cada trabajador aporta más, producir cada unidad cuesta menos.</p>
<h3>Qué mueve las curvas de costo</h3>
<ul>
<li><b>Tecnología:</b> una mejor técnica aumenta la productividad y desplaza hacia abajo las curvas de costo.</li>
<li><b>Precios de los factores:</b> si sube un factor variable (salarios), suben CVT, CM, CVMe y CTMe. Si sube un factor fijo, suben el CFT, el CFMe y el CTMe, pero <b>no el CM ni el CVMe</b>.</li>
</ul>

<h2>4. Costos a largo plazo</h2>
<p>A largo plazo todo se puede ajustar. La relación entre los factores y la producción se llama <b>función de producción</b>. Si tienes una planta de cierto tamaño, tu costo medio en el corto plazo es una curva en forma de U. Pero si puedes cambiar el tamaño de planta, para cada nivel de producción elegirías la planta con el costo medio más bajo. La curva que resulta —el <b>costo medio a largo plazo</b>— es la envolvente inferior de todas las curvas de corto plazo.</p>
${fig('c10_lr')}
<h3>Economías y deseconomías de escala</h3>
<ul>
<li><b>Economías de escala:</b> al aumentar la producción, el costo medio de largo plazo <b>baja</b>. Es porque se aprovechan mejor la especialización, las máquinas grandes y la compra de insumos al por mayor.</li>
<li><b>Deseconomías de escala:</b> cuando el costo medio de largo plazo <b>sube</b>. Una empresa enorme se vuelve difícil de coordinar y supervisar.</li>
<li><b>Escala mínima eficiente:</b> la menor producción en la que se alcanza el costo medio mínimo de largo plazo. Si es grande comparada con el mercado, hay pocas empresas.</li>
</ul>
`,
terms:[['Corto plazo','Periodo con al menos un factor fijo.'],['Largo plazo','Periodo con todos los factores variables.'],['Producto marginal','Aumento del producto total por un trabajador adicional.'],['Producto medio','Producto total ÷ trabajadores.'],['Rendimientos decrecientes','El PM de un factor variable acaba disminuyendo si los demás factores son fijos.'],['Costo fijo / variable','Fijo no cambia con la producción; variable sí.'],['Costo marginal','Costo de una unidad adicional.'],['Costo total medio','Costo total ÷ cantidad. Forma de U.'],['Economías de escala','Costo medio de largo plazo baja al producir más.'],['Deseconomías de escala','Costo medio de largo plazo sube al producir más.']],
quiz:[
 {q:'El costo marginal es menor que el costo total medio. Entonces el costo total medio:',o:['Está bajando','Está subiendo','Está en su mínimo','No se puede saber'],a:0,why:'Igual que una nota menor a tu promedio lo baja: si la última unidad cuesta menos que el promedio, el promedio cae.'},
 {q:'Sube el alquiler de la fábrica (costo fijo). ¿Qué curva NO se mueve?',o:['Costo marginal','Costo total medio','Costo fijo medio','Costo total'],a:0,why:'El costo marginal depende solo de lo variable. El alquiler no cambia el costo de producir una unidad más.'},
 {q:'La ley de los rendimientos decrecientes dice que:',o:['Al agregar un factor variable a uno fijo, su producto marginal acaba disminuyendo','Los precios bajan al producir más','El producto total siempre baja','Las empresas pierden dinero'],a:0,why:'Es una ley tecnológica: con la planta fija, cada trabajador extra aporta menos que el anterior (después de cierto punto).'},
 {q:'Si al duplicar todos los factores la producción se multiplica por más de dos:',o:['Hay economías de escala','Hay deseconomías de escala','Hay rendimientos decrecientes','El costo total medio sube'],a:0,why:'Producir más del doble con el doble de insumos reduce el costo medio de largo plazo: economías de escala.'}]});
