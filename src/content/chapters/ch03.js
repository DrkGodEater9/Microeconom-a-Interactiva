/** Capítulo 3 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, bisect, smooth } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { def, ex, warn, tip, eqn, fig, table } from '../../engine/blocks.js';

const DEMP=[[0,12.5],[0.5,9],[1,6],[1.5,4],[2,3],[2.5,2],[3,1.2],[4,0.2]];  // P -> Q demandada (CD-R, libro)
const SUPP=[[0.5,0],[1,3],[1.5,4],[2,5],[2.5,6],[3,7],[4,9]];         // P -> Q ofrecida (CD-R, libro)
const Qd0=smooth(DEMP), Qs0=smooth(SUPP);
const PMAX=3.5;
const demandPts=(sh)=>curve(P=>Math.max(0,Qd0(P)+sh),0.02,PMAX,80).map(([P,Q])=>[Q,P]);
const supplyPts=(sh)=>curve(P=>Math.max(0,Qs0(P)+sh),0.02,PMAX,80).map(([P,Q])=>[Q,P]);
const eqSolve=(sd,ss)=>{ const f=P=>(Qd0(P)+sd)-(Qs0(P)+ss); const lo=.05,hi=4; if(f(lo)<=0) return {P:lo,Q:Math.max(0,Qs0(lo)+ss)}; if(f(hi)>=0) return {P:hi,Q:Qd0(hi)+sd}; const P=bisect(f,lo,hi); return {P,Q:Qd0(P)+sd}; };
const ax3={x:{label:'Cantidad (millones de CD-R por semana)',max:15,ticks:[0,3,6,9,12,15]},y:{label:'Precio ($ por CD-R)',max:3.5,ticks:[0,0.5,1,1.5,2,2.5,3,3.5],fmt:v=>'$'+fn(v,2)}};

FIGS.c3_dem = Object.assign({},ax3,{
  title:'La curva de demanda (datos del libro: CD-R)',
  intro:'Dos controles, dos ideas distintas: el <b>precio</b> te mueve <i>a lo largo</i> de la curva; los <b>otros factores</b> mueven la curva entera.',
  controls:[
   {id:'P',label:'Precio del CD-R',min:.4,max:3.2,step:.05,value:1.5,fmt:v=>f$(v,2),hint:'Cambiar el precio es moverte por la curva. Eso es un <b>cambio en la cantidad demandada</b>.'},
   {id:'sh',label:'Otro factor: precio del quemador de discos (complemento)',min:-3,max:5,step:.5,value:0,fmt:v=>v===0?'sin cambio':(v>0?'+':'')+fn(v,1)+' M',hint:'Mueve este control: la curva se desplaza. Eso es un <b>cambio en la demanda</b> (a +4 es el caso del libro: quemadores de $100 en vez de $300).'}],
  build(s){
    const q0=Math.max(0,Qd0(s.P)), q1=Math.max(0,Qd0(s.P)+s.sh);
    const els=[];
    if(s.sh!==0) els.push({k:'line',id:'d0',color:'blue',dash:'6 5',w:2.6,pts:demandPts(0),label:'D₀ (original)',legend:'Demanda original',info:['Demanda original (D₀)','La demanda antes del cambio. Está punteada para que veas de dónde partió la nueva.']});
    els.push({k:'line',id:'d1',color:s.sh!==0?'red':'blue',w:3.8,pts:demandPts(s.sh),label:s.sh!==0?'D₁ (nueva)':'D',legend:s.sh!==0?'Nueva demanda':'Curva de demanda',info:[s.sh!==0?'Nueva demanda (D₁)':'Curva de demanda','Muestra la cantidad que los consumidores <b>planean comprar</b> a cada precio, manteniendo todo lo demás constante. Tiene pendiente negativa: a mayor precio, menor cantidad demandada (ley de la demanda). También se lee como la <b>máxima disposición a pagar</b> por cada unidad.']});
    if(s.sh!==0) els.push({k:'area',id:'des',color:s.sh>0?'green':'red',op:.18,pts:[...demandPts(0).filter(p=>p[1]>=.02),...demandPts(s.sh).reverse()],legend:s.sh>0?'Aumento de demanda':'Disminución de demanda',info:[s.sh>0?'Aumento de la demanda':'Disminución de la demanda','La franja entre las dos curvas mide cuánto más ('+(s.sh>0?'aumento':'disminución')+') se compra <b>a cada precio</b>: '+fn(Math.abs(s.sh),1)+' millones de CD-R en este caso.']});
    if(s.sh!==0) els.push({k:'pt',id:'p0',color:'blue',at:[q0,s.P],r:5,fill:'blue',legend:false,info:['Cantidad demandada original','Antes del cambio se demandaban '+fn(q0,1)+' millones a este precio.']});
    els.push({k:'pt',id:'p1',color:s.sh!==0?'red':'blue',at:[q1,s.P],r:7,guides:true,gx:fn(q1,1),gy:f$(s.P,2),label:'Cantidad demandada',legend:'Cantidad demandada a este precio',info:['Cantidad demandada','Es un <b>punto</b> de la curva: la cantidad que se quiere comprar a <i>este</i> precio. No confundas «cantidad demandada» (un punto) con «demanda» (toda la curva).']});
    return {els,read:[['Precio',f$(s.P,2),'gray'],['Cantidad demandada',fn(q1,1)+' M','blue'],['Cambio por el factor externo',(q1-q0>0?'+':'')+fn(q1-q0,1)+' M',q1-q0>=0?'green':'red']],
     say:`<p>A ${f$(s.P,2)} por CD-R se quieren comprar <b>${fn(q1,1)} millones</b> por semana.</p>`+(s.sh===0?'<p>Si cambias el <b>precio</b>, el punto se mueve por la curva: es un cambio en la <b>cantidad demandada</b>. Para que la curva entera se mueva, tiene que cambiar otro factor (ingreso, gustos, precios de otros bienes…).</p>':`<p>La curva completa se ${s.sh>0?'movió a la <b>derecha</b>':'movió a la <b>izquierda</b>'}: a cualquier precio la gente quiere comprar ${s.sh>0?'más':'menos'}. Eso es un ${s.sh>0?'<b>aumento</b>':'<b>disminución</b>'} de la <b>demanda</b>. Sucede porque bajó el precio de un complemento (el quemador).</p>`)};
  }
});
FIGS.c3_ofe = Object.assign({},ax3,{
  title:'La curva de oferta (datos del libro: CD-R)',
  intro:'Igual que antes: el <b>precio</b> te mueve por la curva (cantidad ofrecida); otros factores desplazan toda la curva (oferta).',
  controls:[
   {id:'P',label:'Precio del CD-R',min:.6,max:3.2,step:.05,value:1.5,fmt:v=>f$(v,2),hint:'Si sube el precio, a los productores les conviene producir más: te mueves hacia arriba por la curva de oferta.'},
   {id:'sh',label:'Otro factor: tecnología o costo de los insumos',min:-3,max:4,step:.5,value:0,fmt:v=>v===0?'sin cambio':(v>0?'+':'')+fn(v,1)+' M',hint:'Positivo = una tecnología mejor o insumos más baratos: la oferta aumenta (se mueve a la derecha). Negativo = insumos más caros: la oferta disminuye.'}],
  build(s){
    const q1=Math.max(0,Qs0(s.P)+s.sh), els=[];
    if(s.sh!==0) els.push({k:'line',id:'s0',color:'red',dash:'6 5',w:2.6,pts:supplyPts(0),label:'O₀',legend:'Oferta original',info:['Oferta original (O₀)','La oferta antes del cambio.']});
    els.push({k:'line',id:'s1',color:s.sh!==0?'purple':'red',w:3.8,pts:supplyPts(s.sh),label:s.sh!==0?'O₁':'Oferta',legend:s.sh!==0?'Nueva oferta':'Curva de oferta',info:[s.sh!==0?'Nueva oferta (O₁)':'Curva de oferta','Muestra la cantidad que los productores <b>planean vender</b> a cada precio, con todo lo demás constante. Sube de izquierda a derecha: a mayor precio, más cantidad ofrecida (ley de la oferta). También se lee como el <b>precio mínimo</b> al que alguien aceptaría vender cada unidad: su costo marginal.']});
    els.push({k:'pt',id:'q',color:s.sh!==0?'purple':'red',at:[q1,s.P],r:7,guides:true,gx:fn(q1,1),gy:f$(s.P,2),label:'Cantidad ofrecida',legend:'Cantidad ofrecida a este precio',info:['Cantidad ofrecida','Es el punto de la curva a <i>este</i> precio. «Cantidad ofrecida» es un punto; «oferta» es toda la curva.']});
    return {els,read:[['Precio',f$(s.P,2),'gray'],['Cantidad ofrecida',fn(q1,1)+' M','red']],
     say:`<p>A ${f$(s.P,2)} los productores ofrecen <b>${fn(q1,1)} millones</b> de CD-R.</p>`+(s.sh===0?'<p>Moverte por la curva (cambiar el precio) cambia la <b>cantidad ofrecida</b>. Para <b>desplazar</b> la curva, debe cambiar la tecnología, el precio de los insumos, el número de vendedores o los precios esperados.</p>':`<p>La curva completa se movió a la ${s.sh>0?'derecha (<b>aumento de la oferta</b>)':'izquierda (<b>disminución de la oferta</b>)'}: a cada precio se ofrece ${s.sh>0?'más':'menos'}.</p>`)};
  }
});
FIGS.c3_eq = Object.assign({},ax3,{
  title:'Equilibrio de mercado: oferta y demanda juntas',
  intro:'El punto donde se cruzan las curvas es el precio y la cantidad a la que el mercado «se vacía». Mueve la demanda, la oferta o el precio y observa qué pasa.',
  controls:[
   {id:'sd',label:'Cambio en la demanda',min:-4,max:5,step:.5,value:0,fmt:v=>v===0?'sin cambio':(v>0?'+':'')+fn(v,1)+' M',hint:'Positivo: más compradores, mayor ingreso o gustos favorables (la curva azul se desplaza a la derecha). Negativo: lo contrario.'},
   {id:'ss',label:'Cambio en la oferta',min:-3,max:4,step:.5,value:0,fmt:v=>v===0?'sin cambio':(v>0?'+':'')+fn(v,1)+' M',hint:'Positivo: una tecnología mejor o insumos más baratos (curva roja a la derecha). Negativo: insumos más caros o menos productores.'},
   {id:'P',label:'Precio al que se vende',min:.4,max:3.4,step:.05,value:1,fmt:v=>f$(v,2),hint:'Prueba precios por debajo y por encima del equilibrio: verás un faltante o un excedente, y por qué el precio tiende a moverse hacia el equilibrio.'},
   {type:'btn',label:'Dejar que el mercado ajuste el precio',act:(st,draw)=>{ const e=eqSolve(st.sd,st.ss); const P0=st.P, t0=performance.now(); const step=t=>{ const k=Math.min(1,(t-t0)/900); st.P=P0+(e.P-P0)*k; draw(); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }}],
  build(s){
    const e=eqSolve(s.sd,s.ss), qd=Math.max(0,Qd0(s.P)+s.sd), qs=Math.max(0,Qs0(s.P)+s.ss), gap=qd-qs;
    const els=[
      {k:'line',id:'d',color:'blue',w:3.8,pts:demandPts(s.sd),label:'Demanda',legend:'Demanda',info:['Curva de demanda','Cuánto quieren comprar los consumidores a cada precio. Baja de izquierda a derecha porque a precios menores se compra más.']},
      {k:'line',id:'o',color:'red',w:3.8,pts:supplyPts(s.ss),label:'Oferta',legend:'Oferta',info:['Curva de oferta','Cuánto quieren vender los productores a cada precio. Sube porque un precio mayor justifica producir más.']},
      {k:'pt',id:'eq',color:'green',at:[e.Q,e.P],r:8,guides:true,gx:fn(e.Q,1),gy:f$(e.P,2),label:{t:'Equilibrio',dx:14,dy:-12},legend:'Equilibrio de mercado',info:['Equilibrio de mercado','Es el único precio donde la cantidad que la gente quiere comprar <b>es igual</b> a la que los productores quieren vender. No hay faltante ni excedente: nadie tiene motivo para cambiar de plan, y por eso el precio deja de moverse.']}];
    if(Math.abs(gap)>.05) els.push({k:'line',id:'gap',color:gap>0?'amber':'purple',w:7,pts:[[Math.min(qs,qd),s.P],[Math.max(qs,qd),s.P]],label:{t:gap>0?'Faltante de '+fn(gap,1):'Excedente de '+fn(-gap,1),at:[(qs+qd)/2,s.P],dx:0,dy:gap>0?-12:20,anchor:'middle'},legend:gap>0?'Faltante':'Excedente',info:[gap>0?'Faltante (exceso de demanda)':'Excedente (exceso de oferta)',gap>0?'A este precio la gente quiere comprar <b>'+fn(qd,1)+'</b> pero solo se ofrecen <b>'+fn(qs,1)+'</b>. Los compradores compiten por lo poco que hay, y el precio <b>sube</b> hasta el equilibrio.':'A este precio se ofrecen <b>'+fn(qs,1)+'</b> pero solo se quieren comprar <b>'+fn(qd,1)+'</b>. Los vendedores se quedan con inventario sin vender y bajan el precio hasta el equilibrio.']});
    els.push({k:'line',id:'pl',color:'gray',dash:'3 4',w:1.8,pts:[[0,s.P],[15,s.P]],legend:false});
    const dP=e.P-1.5, dQ=e.Q-4;
    let msg;
    if(s.sd===0&&s.ss===0) msg='';
    else if(s.sd>0&&s.ss===0) msg='<p>Aumento de la demanda: <b>sube el precio</b> y <b>sube la cantidad</b>.</p>';
    else if(s.sd<0&&s.ss===0) msg='<p>Disminución de la demanda: <b>baja el precio</b> y <b>baja la cantidad</b>.</p>';
    else if(s.ss>0&&s.sd===0) msg='<p>Aumento de la oferta: <b>baja el precio</b> pero <b>sube la cantidad</b>.</p>';
    else if(s.ss<0&&s.sd===0) msg='<p>Disminución de la oferta: <b>sube el precio</b> y <b>baja la cantidad</b>.</p>';
    else msg='<p>Cambian ambas curvas a la vez: la <b>cantidad</b> '+(s.sd>0&&s.ss>0?'aumenta seguro':s.sd<0&&s.ss<0?'disminuye seguro':'puede subir o bajar')+', y el <b>precio</b> '+(s.sd>0&&s.ss<0?'sube seguro':s.sd<0&&s.ss>0?'baja seguro':'puede subir o bajar')+'. Depende de qué desplazamiento sea mayor.</p>';
    return {els,read:[['Precio de equilibrio',f$(e.P,2),'green'],['Cantidad de equilibrio',fn(e.Q,1)+' M','green'],['A tu precio ('+f$(s.P,2)+')',Math.abs(gap)<.05?'equilibrio':(gap>0?'faltan '+fn(gap,1):'sobran '+fn(-gap,1)),gap>0.05?'amber':gap<-.05?'purple':'green']],
     say:`<p>El equilibrio está en <b>${f$(e.P,2)}</b> y <b>${fn(e.Q,1)}</b> millones. ${(dP||dQ)&&(s.sd||s.ss)?`Respecto al original (${f$(1.5,2)}, 4 M), el precio ${dP>=0?'subió':'bajó'} ${f$(Math.abs(dP),2)} y la cantidad ${dQ>=0?'subió':'bajó'} ${fn(Math.abs(dQ),1)} M.`:''}</p>${msg}<p>${Math.abs(gap)<.05?'Tu precio coincide con el equilibrio: el mercado está en reposo.':gap>0?'A tu precio hay <b>faltante</b>: sobra gente queriendo comprar, así que el precio tenderá a <b>subir</b>.':'A tu precio hay <b>excedente</b>: sobran productos, así que el precio tenderá a <b>bajar</b>.'}</p>`};
  }
});

CHAPTERS.push({id:3,title:'Oferta y demanda',
teaser:'Cómo se forman los precios: curvas de demanda y oferta, equilibrio y qué las mueve.',
bigq:'¿Por qué el precio del petróleo, de los boletos de avión o de los tomates sube y baja? Detrás de casi cualquier precio hay dos fuerzas: lo que la gente quiere comprar y lo que los productores quieren vender.',
learn:['Distinguir «demanda» de «cantidad demandada» y «oferta» de «cantidad ofrecida».','Nombrar los factores que desplazan la demanda y la oferta.','Encontrar el equilibrio y explicar por qué el precio tiende hacia él.','Predecir cómo cambian el precio y la cantidad cuando se mueve una o ambas curvas.'],
html:`
<h2>1. Mercados y precios</h2>
<p>Un <b>mercado</b> es cualquier arreglo que reúne a compradores y vendedores de un bien: puede ser una plaza, una tienda en línea o una bolsa de valores. Un <b>mercado competitivo</b> es aquel en el que hay tantos compradores y vendedores que ninguno, por sí solo, puede influir en el precio.</p>
<p>En el capítulo anterior viste el costo de oportunidad. Aquí es útil una idea más: el <b>precio relativo</b>. El precio relativo de un bien es su costo de oportunidad: cuánto de <i>otras cosas</i> tienes que dejar para tenerlo. Si un CD cuesta $200 y una hamburguesa $50, un CD «cuesta» 4 hamburguesas. Es el precio relativo lo que determina las decisiones, y lo que determinan la oferta y la demanda.</p>

<h2>2. Demanda</h2>
<p>Si <b>quieres</b> algo, <b>puedes pagarlo</b> y <b>planeas comprarlo</b>, entonces lo demandas. Los simples deseos no cuentan: la demanda exige que quieras y que puedas pagar.</p>
<h3>La ley de la demanda</h3>
${def('Ley de la demanda','<p>Si <b>todo lo demás permanece igual</b> (ceteris paribus), cuanto <b>mayor</b> es el precio de un bien, <b>menor</b> es la cantidad demandada; y cuanto menor es el precio, mayor es la cantidad demandada.</p>')}
<p>¿Por qué? Hay dos razones. El <b>efecto sustitución</b>: si un bien se encarece respecto a otros parecidos, lo reemplazas (si el pollo sube, compras más pescado). Y el <b>efecto ingreso</b>: si un bien se encarece, tu dinero rinde menos, así que puedes comprar menos.</p>
<h3>Curva de demanda y plan de demanda</h3>
<p>El <b>plan de demanda</b> es una tabla con las cantidades demandadas a diferentes precios. La <b>curva de demanda</b> es su dibujo. El libro muestra el caso de los CD-R (discos grabables):</p>
${table(['Punto','Precio ($ por CD-R)','Cantidad demandada (M por semana)'],[['A','0.50',9],['B','1.00',6],['C','1.50',4],['D','2.00',3],['E','2.50',2]])}
<p>La curva de demanda también se puede leer como una curva de <b>disposición a pagar</b>: para la unidad número 4, la gente está dispuesta a pagar como máximo $1.50. La disposición a pagar baja a medida que tienes más unidades (beneficio marginal decreciente).</p>
${fig('c3_dem')}
<h3>Cambio en la cantidad demandada vs. cambio en la demanda</h3>
${warn('<p>Éste es el error más frecuente de todo el curso. <b>Un cambio en el precio del bien</b> mueve el punto <i>a lo largo</i> de la misma curva: es un <b>cambio en la cantidad demandada</b>. <b>Un cambio en cualquier otro factor</b> desplaza la <i>curva entera</i>: es un <b>cambio en la demanda</b>.</p>')}
<h3>Seis factores que desplazan la demanda</h3>
<ol>
<li><b>Precios de bienes relacionados.</b> <i>Sustitutos</i> (pueden usarse en lugar del bien: té y café): si el sustituto se encarece, aumenta la demanda de tu bien. <i>Complementos</i> (se usan juntos: CD-R y quemadores): si el complemento se abarata, aumenta la demanda de tu bien.</li>
<li><b>Precios futuros esperados.</b> Si esperas que el precio suba mañana, hoy compras más.</li>
<li><b>Ingreso.</b> Con más ingreso, la demanda de <i>bienes normales</i> aumenta; la de <i>bienes inferiores</i> (como el transporte en autobús cuando te compras un auto) disminuye.</li>
<li><b>Ingreso futuro esperado y crédito.</b> Si esperas ganar más o consigues crédito, compras más hoy.</li>
<li><b>Población.</b> Más gente, más demanda.</li>
<li><b>Preferencias.</b> Gustos y modas: cuando una música se pone de moda, aumenta su demanda.</li>
</ol>

<h2>3. Oferta</h2>
<p>Un bien se ofrece si los productores <b>pueden</b> y <b>quieren</b> producirlo, y tienen un <b>plan</b> de venderlo.</p>
${def('Ley de la oferta','<p>Si todo lo demás permanece igual, cuanto <b>mayor</b> es el precio de un bien, <b>mayor</b> es la cantidad ofrecida; y cuanto menor es el precio, menor es la cantidad ofrecida.</p>')}
<p>La razón es el <b>costo marginal creciente</b>: producir cada unidad adicional cuesta más que la anterior (al principio usas tus mejores recursos). Para que valga la pena producir unidades más caras, el precio debe subir. Por eso la curva de oferta también se lee como una curva de <b>precio mínimo de oferta</b>: el precio mínimo que alguien aceptaría para vender cada unidad.</p>
${table(['Punto','Precio ($ por CD-R)','Cantidad ofrecida (M por semana)'],[['A','0.50',0],['B','1.00',3],['C','1.50',4],['D','2.00',5],['E','2.50',6]])}
${fig('c3_ofe')}
<h3>Factores que desplazan la oferta</h3>
<ol>
<li><b>Precios de los factores productivos</b> (salarios, materias primas, energía): si se encarecen, la oferta disminuye.</li>
<li><b>Precios de bienes relacionados.</b> Si el precio de un bien que puedes producir con los mismos recursos sube, ofreces más de ese y menos del otro.</li>
<li><b>Precios futuros esperados.</b> Si esperas que el precio suba, retienes producto hoy: la oferta actual disminuye.</li>
<li><b>Número de oferentes.</b> Más empresas, más oferta.</li>
<li><b>Tecnología.</b> Una mejor tecnología baja costos y aumenta la oferta. Algo similar sucede con el clima en los productos agrícolas.</li>
</ol>
${warn('<p>Igual que en la demanda: el precio del propio bien mueve la cantidad ofrecida <i>a lo largo</i> de la curva. Todo lo demás, desplaza la curva.</p>')}

<h2>4. Equilibrio de mercado</h2>
<p>Pongamos oferta y demanda en el mismo gráfico. El <b>precio de equilibrio</b> es aquel al cual la cantidad demandada es igual a la cantidad ofrecida; esa cantidad es la <b>cantidad de equilibrio</b>. En el ejemplo del libro es $1.50 y 4 millones de CD-R.</p>
${table(['Precio','Cantidad demandada','Cantidad ofrecida','Faltante (−) / Excedente (+)'],[['$0.50',9,0,'−9'],['$1.00',6,3,'−3'],['<b>$1.50</b>','<b>4</b>','<b>4</b>','<b>0 (equilibrio)</b>'],['$2.00',3,5,'+2'],['$2.50',2,6,'+4']])}
<h3>¿Por qué el precio se mueve hacia el equilibrio?</h3>
<ul>
<li>Si el precio está <b>por debajo</b>, la cantidad demandada es mayor que la ofrecida: hay un <b>faltante</b>. Los compradores se disputan los pocos productos y los vendedores notan que pueden cobrar más. El precio <b>sube</b>.</li>
<li>Si el precio está <b>por encima</b>, la cantidad ofrecida es mayor que la demandada: hay un <b>excedente</b>. Los vendedores acumulan inventario y rebajan para vender. El precio <b>baja</b>.</li>
<li>En el precio de equilibrio nadie tiene motivo para cambiar de plan: el precio descansa.</li>
</ul>
<p>Prueba esto en la gráfica. Mueve el control de precio por debajo y por encima del equilibrio, y luego pulsa «Dejar que el mercado ajuste el precio».</p>
${fig('c3_eq')}

<h2>5. Predicción de cambios en precios y cantidades</h2>
<p>La herramienta más poderosa del capítulo: dado un acontecimiento, ¿qué pasa con el precio y la cantidad? Siempre sigue estos tres pasos:</p>
<ol>
<li>¿Qué curva se mueve: la demanda, la oferta o ambas? (Si el hecho no cambia el precio del propio bien, es un desplazamiento.)</li>
<li>¿Hacia dónde se mueve: a la derecha (aumento) o a la izquierda (disminución)?</li>
<li>Lee el nuevo punto de cruce comparado con el viejo.</li>
</ol>
${table(['Qué ocurre','Precio de equilibrio','Cantidad de equilibrio'],[['Aumenta la demanda','Sube','Aumenta'],['Disminuye la demanda','Baja','Disminuye'],['Aumenta la oferta','Baja','Aumenta'],['Disminuye la oferta','Sube','Disminuye']])}
${ex('Ejemplo real: el precio del petróleo','<p>Si China crece rápido, sus fábricas y autos necesitan más petróleo: <b>aumenta la demanda mundial</b>. La curva de demanda se desplaza a la derecha; con una oferta que no se ajusta tan rápido, el precio sube y se produce más. Si además hay conflictos que interrumpen la extracción, la oferta disminuye y el precio sube aún más (pero la cantidad puede quedar casi igual).</p>')}
<h3>Cuando cambian ambas curvas</h3>
<p>Aquí solo puedes estar seguro de una variable. Si aumentan <b>demanda y oferta</b> a la vez, la cantidad sin duda sube, pero el precio puede subir, bajar o quedarse igual (depende de qué curva se mueve más). Si aumenta la demanda y disminuye la oferta, el precio sin duda sube, pero la cantidad es incierta. Combínalas en la gráfica para verlo.</p>
${tip('<p>Cuando duden, dibuja primero la situación inicial, luego dibuja la nueva curva y observa el nuevo cruce. Nunca intentes razonarlo «de memoria»: dibujar evita errores.</p>','Consejo de estudio')}

<h2>Nota matemática: demanda, oferta y equilibrio con ecuaciones</h2>
<p>Las curvas pueden escribirse como ecuaciones lineales. Si <i>P</i> es el precio y <i>Q</i> la cantidad:</p>
${eqn('Demanda: Q<sub>d</sub> = a − b·P &nbsp;&nbsp;&nbsp; Oferta: Q<sub>o</sub> = c + d·P','b y d dicen cuánto responde la cantidad al precio. «a» se mueve cuando cambian otros factores de la demanda; «c», los de la oferta.')}
<p>En el equilibrio Q<sub>d</sub> = Q<sub>o</sub>, así que a − b·P = c + d·P. Despejando:</p>
${eqn('P* = (a − c) ÷ (b + d) &nbsp;&nbsp;&nbsp; Q* = c + d·P*')}
${ex('Ejemplo ilustrativo con números','<p>Sea Q<sub>d</sub> = 10 − 4P y Q<sub>o</sub> = −2 + 4P. Entonces 10 − 4P = −2 + 4P → 12 = 8P → <b>P* = $1.50</b>, y Q* = 10 − 4(1.5) = <b>4</b>. Si aumenta «a» a 14 (más demanda): P* = (14 + 2) ÷ 8 = $2.00 y Q* = 6.</p>')}
`,
terms:[['Mercado competitivo','Hay tantos compradores y vendedores que ninguno influye en el precio.'],['Precio relativo','Costo de oportunidad de un bien: cuánto de otros bienes cuesta.'],['Demanda','Relación completa entre precio y cantidad que se quiere comprar, con todo lo demás constante. Toda la curva.'],['Cantidad demandada','Cantidad que se quiere comprar a un precio dado. Un punto de la curva.'],['Bien sustituto','Se usa en lugar de otro. Si el sustituto sube, aumenta la demanda del bien.'],['Bien complementario','Se usa junto con otro. Si el complemento baja, aumenta la demanda del bien.'],['Bien normal / inferior','Normal: demanda sube con el ingreso. Inferior: demanda baja con el ingreso.'],['Oferta','Relación completa entre precio y cantidad que se quiere vender. Toda la curva.'],['Equilibrio','Precio y cantidad donde cantidad demandada = cantidad ofrecida.'],['Faltante / Excedente','Faltante: Qd > Qo (el precio sube). Excedente: Qo > Qd (el precio baja).']],
quiz:[
 {q:'Baja el precio de los CD-R de $2.00 a $1.50. Esto provoca:',o:['Un aumento de la cantidad demandada (movimiento a lo largo de la curva)','Un aumento de la demanda (la curva se desplaza)','Una disminución de la oferta','Una disminución de la demanda'],a:0,why:'El precio del propio bien nunca desplaza su curva de demanda: solo mueve el punto a lo largo de ella.'},
 {q:'Sube el precio de los quemadores de discos (complemento de los CD-R). ¿Qué pasa en el mercado de CD-R?',o:['Disminuye la demanda de CD-R: baja el precio y la cantidad de equilibrio','Aumenta la demanda de CD-R','Aumenta la oferta de CD-R','No pasa nada'],a:0,why:'Un complemento más caro reduce su compra y, con ella, la demanda de CD-R. La curva de demanda se desplaza a la izquierda: precio y cantidad bajan.'},
 {q:'A un precio por encima del equilibrio:',o:['Hay un excedente y el precio tiende a bajar','Hay un faltante y el precio tiende a subir','El mercado está en equilibrio','La demanda disminuye'],a:0,why:'Con precio alto la cantidad ofrecida supera a la demandada. Los vendedores rebajan hasta vaciar el mercado.'},
 {q:'Aumentan a la vez la demanda y la oferta. Con seguridad:',o:['Aumenta la cantidad de equilibrio; el precio es incierto','Sube el precio; la cantidad es incierta','Baja el precio y la cantidad','Todo queda igual'],a:0,why:'Ambos desplazamientos empujan la cantidad hacia arriba. Pero el precio sube con la demanda y baja con la oferta: el resultado depende de cuál se mueve más.'}]});
