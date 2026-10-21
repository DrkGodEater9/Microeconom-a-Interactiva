/** Capítulo 2 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, smooth } from '../../engine/math.js';
import { fn } from '../../engine/format.js';
import { def, warn, tip, eqn, fig, table, figAgain } from '../../engine/blocks.js';

const FPPpts=[[0,15],[1,14],[2,12],[3,9],[4,5],[5,0]]; // hamburguesas (x), CD (y): datos del libro
const fppF=smooth(FPPpts);
FIGS.c2_fpp = {
  title:'Frontera de posibilidades de producción (datos del libro: CD y hamburguesas)',
  intro:'La frontera separa lo que la economía <b>puede</b> producir de lo que no. Mueve el punto sobre la frontera y mira el costo de oportunidad.',
  x:{label:'Hamburguesas (millones por mes)',max:7,min:0,ticks:[0,1,2,3,4,5,6,7]}, y:{label:'CD (millones por mes)',max:20,ticks:[0,5,10,15,20]},
  controls:[
    {id:'h',label:'Hamburguesas que producimos',min:0,max:5,step:.05,value:2,fmt:v=>fn(v,2)+' millones',hint:'Moverte hacia la derecha por la frontera significa usar más recursos en hamburguesas… y sacarlos de la producción de CD.'},
    {id:'g',type:'toggle',label:'Hay crecimiento económico (+30% de recursos y tecnología)',value:false,hint:'Más trabajadores, más máquinas o mejor tecnología empujan la frontera hacia afuera.'}],
  build(s){
    const k=s.g?1.3:1, F=h=>k*fppF(h/k), hmax=5*k;
    const h=Math.min(s.h*k,hmax), cd=F(h);
    const e=.25, ocs=-(F(Math.min(h+e,hmax))-F(Math.max(h-e,0)))/(Math.min(h+e,hmax)-Math.max(h-e,0));
    const front=curve(F,0,hmax,70);
    const els=[
      {k:'area',id:'alc',color:'blue',op:.16,pts:[[0,0],...front,[hmax,0]],label:{t:'Alcanzable',at:[1.4*k,5*k]},legend:'Zona alcanzable',info:['Zona alcanzable','Todas las combinaciones de CD y hamburguesas que la economía <b>puede producir</b> con sus recursos y tecnología: en la frontera o dentro de ella.']},
      {k:'area',id:'ina',color:'red',op:.1,pts:[[0,20],[7,20],[7,0],[hmax,0],...front.slice().reverse()],label:{t:'Inalcanzable',at:[5.2,13.5]},legend:'Zona inalcanzable',info:['Zona inalcanzable','Combinaciones que <b>no se pueden producir</b> con los recursos y la tecnología actuales. Solo serían posibles si la frontera creciera.']},
      {k:'line',id:'fpp',color:'blue',pts:front,w:3.8,legend:'La frontera (FPP)',info:['Frontera de posibilidades de producción (FPP)','Es el límite entre lo alcanzable y lo inalcanzable. Cada punto de la curva es una combinación <b>eficiente</b>: para tener más de un bien tienes que producir menos del otro.']},
      {k:'pt',id:'z',color:'amber',at:[2*k,6*k],guides:false,label:'Z',legend:'Punto Z (ineficiente)',info:['Punto Z: dentro de la frontera','Aquí hay recursos <b>desempleados o mal asignados</b>. Es ineficiente porque se podría producir más de un bien sin producir menos del otro (moviéndose hacia la frontera).']},
      {k:'pt',id:'cur',color:'green',at:[h,cd],guides:true,gx:fn(h,2),gy:fn(cd,1),r:7,label:'Tu punto',legend:'Combinación elegida',info:['Combinación elegida (eficiente)','Producimos '+fn(h,2)+' millones de hamburguesas y '+fn(cd,1)+' millones de CD. Está en la frontera: producción eficiente.']}];
    const say=`<p>Estás produciendo <b>${fn(h,2)}</b> millones de hamburguesas y <b>${fn(cd,1)}</b> de CD.</p><p>Si quisieras <b>una hamburguesa más</b>, tendrías que renunciar a unos <b>${fn(ocs,1)} CD</b>. Ése es el costo de oportunidad de la hamburguesa aquí.</p><p>Observa: más a la derecha, la frontera es más empinada: el costo de oportunidad <b>aumenta</b>. Se debe a que los recursos no son igual de buenos en todo (un cocinero es mejor haciendo hamburguesas que grabando discos).</p>${s.g?'<p><b>Crecimiento económico:</b> la frontera se movió hacia afuera. Ahora es posible lo que antes era inalcanzable, pero tampoco es gratis: para crecer hay que sacrificar consumo hoy.</p>':''}`;
    return {els,read:[['Hamburguesas',fn(h,2)+' M','amber'],['CD',fn(cd,1)+' M','blue'],['CO de 1 hamburguesa más',fn(ocs,1)+' CD','red']],say};
  }
};
FIGS.c2_efi = {
  title:'Uso eficiente de recursos: cuántas hamburguesas conviene producir',
  intro:'La frontera dice qué <i>es posible</i>; las preferencias dicen qué <i>conviene</i>. La mejor combinación está donde el beneficio marginal iguala al costo marginal.',
  x:{label:'Hamburguesas (millones por mes)',max:5,ticks:[0,1,2,3,4,5]}, y:{label:'CD que valoramos o sacrificamos por hamburguesa',max:8,ticks:[0,2,4,6,8]},
  controls:[
    {id:'a',label:'Qué tanto nos gustan las hamburguesas',min:3,max:7.5,step:.1,value:6,fmt:v=>fn(v,1),hint:'Si cambian las preferencias (más fans de hamburguesas), el beneficio marginal sube y la mejor combinación cambia.'},
    {id:'h',label:'Hamburguesas que se producen',min:0,max:5,step:.1,value:1.5,fmt:v=>fn(v,1)+' M',hint:'Prueba producir menos o más que el punto eficiente.'}],
  build(s){
    const MB=h=>s.a-.8*h, MC=h=>1.2*h, hs=s.a/2.0, h=s.h;
    const els=[
      {k:'line',id:'bm',color:'blue',pts:[[0,s.a],[5,s.a-4]],label:'BM',legend:'Beneficio marginal (preferencias)',info:['Beneficio marginal (BM)','Cuántos CD estamos <b>dispuestos a entregar</b> por una hamburguesa más. Baja cuando tenemos más hamburguesas: la primera sabe riquísimo, la décima ya no tanto.']},
      {k:'line',id:'cm',color:'red',pts:[[0,0],[5,6]],label:'CM',legend:'Costo marginal (de la FPP)',info:['Costo marginal (CM)','Cuántos CD <b>se sacrifican</b> por una hamburguesa más, tomado de la pendiente de la frontera. Sube porque el costo de oportunidad crece al producir más hamburguesas.']}];
    const lo=Math.min(h,hs);
    els.push({k:'area',id:'gan',color:'green',pts:[[0,MB(0)],[lo,MB(lo)],[lo,MC(lo)],[0,0]],op:.3,legend:'Ganancia neta',info:['Ganancia neta','En esta zona cada hamburguesa vale más para nosotros (BM) de lo que cuesta sacrificar en CD (CM). Producir esas unidades es una ganancia.']});
    if(h>hs) els.push({k:'area',id:'per',color:'red',pts:[[hs,MB(hs)],[h,MB(h)],[h,MC(h)]],op:.4,legend:'Pérdida por producir de más',info:['Pérdida por sobreproducción','Si producimos más allá del punto eficiente, el CM supera al BM: estamos entregando más CD de lo que vale la hamburguesa extra.']});
    if(h<hs) els.push({k:'area',id:'perd',color:'amber',pts:[[h,MB(h)],[hs,MB(hs)],[h,MC(h)]],op:.4,legend:'Ganancia desaprovechada',info:['Ganancia desaprovechada','Si producimos de menos, nos perdemos hamburguesas que valían más de lo que costaban. Esa ganancia posible no se aprovecha.']});
    els.push({k:'pt',id:'e',color:'green',at:[hs,MC(hs)],guides:true,label:'Eficiente',legend:'Uso eficiente (BM = CM)',info:['Uso eficiente de los recursos','Aquí BM = CM. Producir más haría que cada hamburguesa extra cueste más de lo que vale; producir menos dejaría ganancias sin aprovechar. Es la mejor combinación posible para la sociedad.']});
    return {els,read:[['Eficiente',fn(hs,2)+' M','green'],['Producimos',fn(h,1)+' M','purple']],
     say:Math.abs(h-hs)<.12?'<p>¡Estás en el uso eficiente de recursos! La última hamburguesa vale justo lo que cuesta.</p>':h<hs?`<p>Producimos <b>poco</b>: la última hamburguesa vale ${fn(MB(h),1)} CD y cuesta ${fn(MC(h),1)} CD. Conviene producir más.</p>`:`<p>Producimos <b>demasiado</b>: la última hamburguesa vale ${fn(MB(h),1)} CD pero cuesta ${fn(MC(h),1)} CD. Se desperdician recursos.</p>`};
  }
};
FIGS.c2_trade = {
  title:'Ventaja comparativa: ¿quién debería producir qué?',
  intro:'Ana y Beto producen pan y pasteles en una hora. Ajusta lo que cada uno puede producir y el precio de intercambio, y mira quién gana con el comercio (ejemplo ilustrativo).',
  panels:[{title:'Ana',x:{label:'Panes',max:120,ticks:[0,30,60,90,120]},y:{label:'Pasteles',max:70,ticks:[0,20,40,60]},h:340},{title:'Beto',x:{label:'Panes',max:120,ticks:[0,30,60,90,120]},y:{label:'Pasteles',max:70,ticks:[0,20,40,60]},h:340}],
  controls:[
    {id:'ap',label:'Ana: máx. panes',min:20,max:100,step:5,value:60,fmt:v=>v},{id:'aq',label:'Ana: máx. pasteles',min:10,max:60,step:5,value:20,fmt:v=>v},
    {id:'bp',label:'Beto: máx. panes',min:10,max:100,step:5,value:30,fmt:v=>v},{id:'bq',label:'Beto: máx. pasteles',min:10,max:60,step:5,value:30,fmt:v=>v},
    {id:'p',label:'Precio de intercambio: panes por 1 pastel',min:.5,max:3,step:.05,value:2,fmt:v=>fn(v,2),hint:'Es la «tasa» a la que se cambian pan y pasteles entre ellos. Si no queda entre los dos costos de oportunidad, alguien sale perdiendo y no aceptará.'}],
  build(s){
    const ocA=s.ap/s.aq, ocB=s.bp/s.bq; // panes sacrificados por 1 pastel
    const aPas = ocA<=ocB;  // Ana tiene ventaja comparativa en pasteles
    const p=s.p;
    const mutual = aPas ? (p>ocA && p<ocB) : (p<ocA && p>ocB);
    const panelFor=(name,mp,mq,isPastel)=>{
      const els=[{k:'line',id:name+'ppf',color:'blue',pts:[[0,mq],[mp,0]],w:3.6,label:'FPP',legend:name==='A'?'Lo que Ana puede producir':'Lo que Beto puede producir',info:[(name==='A'?'Ana':'Beto')+': su frontera','Con una hora de trabajo, '+(name==='A'?'Ana':'Beto')+' puede producir cualquier combinación sobre esta línea. Su costo de oportunidad de 1 pastel es '+fn(mp/mq,2)+' panes.']}];
      let trade;
      if(isPastel){ trade=[[0,mq],[mq*p,0]]; } else { trade=[[mp,0],[0,mp/p]]; }
      const startPt = isPastel?[0,mq]:[mp,0];
      // área de ganancia: entre línea de comercio y FPP
      const gainPoly = isPastel ? [[0,mq],[mq*p,0],[mp,0]] : [[mp,0],[0,mp/p],[0,mq]];
      const gains = isPastel ? (p>mp/mq) : (p<mp/mq);
      if(gains) els.push({k:'area',id:name+'g',color:'green',pts:gainPoly,op:.3,label:'Ganancia',legend:'Ganancia por comerciar',info:['Ganancia por comerciar','Con el comercio puede consumir combinaciones <b>fuera de su frontera</b>, imposibles de lograr produciendo sola. Esta zona verde son las combinaciones nuevas.']});
      else els.push({k:'area',id:name+'l',color:'red',pts:gainPoly,op:.25,label:'Pérdida',legend:'Pérdida si comercia',info:['Perdería si comerciara','A este precio, Ana/Beto obtendría menos que produciendo por su cuenta. No aceptaría el trato.']});
      els.push({k:'line',id:name+'tr',color:'green',pts:trade,dash:'7 5',w:3,legend:'Con comercio (se especializa)',info:['Combinaciones con comercio','Si se <b>especializa</b> en el bien en el que tiene ventaja comparativa y vende parte al otro al precio acordado, puede consumir cualquier punto de esta línea punteada.']});
      els.push({k:'pt',id:name+'s',color:'purple',at:startPt,r:6,label:isPastel?'Solo pasteles':'Solo panes',legend:false,info:['Punto de especialización','Produce solo el bien en el que tiene menor costo de oportunidad.']});
      return els;
    };
    const panelA=panelFor('A',s.ap,s.aq,aPas), panelB=panelFor('B',s.bp,s.bq,!aPas);
    return {panels:[panelA,panelB],
      read:[['CO de 1 pastel: Ana',fn(ocA,2)+' panes','blue'],['CO de 1 pastel: Beto',fn(ocB,2)+' panes','blue'],['¿Ambos ganan?',mutual?'Sí':'No',mutual?'green':'red']],
      say:`<p>Costo de oportunidad de 1 pastel: Ana sacrifica <b>${fn(ocA,2)} panes</b>; Beto, <b>${fn(ocB,2)} panes</b>.</p><p>Por eso <b>${aPas?'Ana tiene ventaja comparativa en pasteles y Beto en pan':'Beto tiene ventaja comparativa en pasteles y Ana en pan'}</b>: cada uno debería producir lo que le cuesta menos sacrificar.</p>`+(Math.abs(ocA-ocB)<.01?'<p>Los costos son iguales: no hay ganancias del comercio.</p>':mutual?`<p>A un precio de ${fn(p,2)} panes por pastel, el trato queda <b>entre los dos costos de oportunidad</b>, así que ambos ganan.</p>`:`<p>Con un precio de ${fn(p,2)}, uno de los dos <b>no ganaría</b>. Para que ambos ganen, el precio debe quedar entre ${fn(Math.min(ocA,ocB),2)} y ${fn(Math.max(ocA,ocB),2)} panes por pastel.</p>`)};
  }
};
FIGS.c2_flujo = {
  title:'Flujos circulares: cómo se coordinan hogares, empresas y mercados',
  intro:'Toca cada caja o flecha. Las flechas azules son flujos reales (bienes, trabajo); las verdes son flujos de dinero.',
  axes:false, x:{max:100}, y:{max:100}, h:420,
  controls:[{id:'v',type:'seg',label:'Qué flujos mostrar',value:'ambos',options:[['ambos','Todos'],['real','Solo bienes y factores'],['dinero','Solo dinero']]}],
  build(s){
    const real=s.v!=='dinero', money=s.v!=='real';
    const els=[
     {k:'box',id:'hog',color:'purple',at:[15,50],w:26,h:26,t:'HOGARES\n(personas)',info:['Hogares','Las personas y familias. Son <b>dueños de los factores de producción</b> (trabajo, tierra, capital, capacidad empresarial) y también los <b>consumidores</b> de bienes y servicios. Deciden en qué trabajar y qué comprar.']},
     {k:'box',id:'emp',color:'amber',at:[85,50],w:26,h:26,t:'EMPRESAS',info:['Empresas','Organizaciones que contratan factores de producción y los transforman en bienes y servicios para vender. Buscan obtener beneficios.']},
     {k:'box',id:'mb',color:'blue',at:[50,86],w:34,h:14,t:'MERCADOS DE BIENES Y SERVICIOS',info:['Mercados de bienes y servicios','Donde las <b>empresas venden</b> y los <b>hogares compran</b> lo que consumen: pan, celulares, cortes de cabello. Allí los precios coordinan lo que se quiere comprar con lo que se quiere vender.']},
     {k:'box',id:'mf',color:'teal',at:[50,14],w:34,h:14,t:'MERCADOS DE FACTORES',info:['Mercados de factores','Donde los <b>hogares venden</b> sus factores (su trabajo, su tierra, su capital) y las <b>empresas los compran</b>. Aquí se determinan salarios, rentas, intereses y beneficios.']}];
    if(money){
      els.push({k:'arr',id:'gasto',color:'green',from:[9,66],to:[31,85],label:'Gasto de consumo',labelAt:[1,89],lanchor:'start',ldy:0,info:['Gasto de consumo (dinero)','Lo que los hogares pagan por los bienes y servicios que compran. Es dinero que va de los hogares a las empresas, pasando por el mercado.']});
      els.push({k:'arr',id:'ingv',color:'green',from:[69,85],to:[91,66],label:'Ingresos por ventas',labelAt:[99,89],lanchor:'end',ldy:0,info:['Ingresos por ventas (dinero)','El dinero que reciben las empresas cuando venden sus productos. Con él pagan sus costos y, si sobra, obtienen beneficios.']});
      els.push({k:'arr',id:'ingf',color:'green',from:[31,15],to:[9,34],label:'Ingresos de factores',labelAt:[1,10],lanchor:'start',ldy:0,info:['Ingresos de los hogares (dinero)','Lo que los hogares reciben por vender sus factores: <b>salarios</b> (trabajo), <b>rentas</b> (tierra), <b>intereses</b> (capital) y <b>beneficios</b> (capacidad empresarial). Es la base del gasto que harán después.']});
      els.push({k:'arr',id:'pagof',color:'green',from:[91,34],to:[69,15],label:'Pagos a factores',labelAt:[99,10],lanchor:'end',ldy:0,info:['Pagos a los factores (dinero)','Lo que las empresas pagan para contratar trabajo, tierra y capital. Para las empresas son costos; para los hogares, ingresos.']});
    }
    if(real){
      els.push({k:'arr',id:'bien',color:'blue',from:[40,77],to:[22,63],label:'Bienes',labelAt:[37,68],lanchor:'start',ldy:4,info:['Bienes y servicios hacia los hogares (flujo real)','Lo que fluye de los mercados a los hogares: lo que se compra y se consume. Es lo que de verdad satisface necesidades.']});
      els.push({k:'arr',id:'bien2',color:'blue',from:[78,63],to:[60,77],label:'Bienes',labelAt:[63,68],lanchor:'end',ldy:4,info:['Producción de las empresas (flujo real)','Las empresas llevan sus bienes y servicios a los mercados para venderlos.']});
      els.push({k:'arr',id:'fact',color:'blue',from:[22,37],to:[40,23],label:'Factores',labelAtt:0,labelAt:[37,32],lanchor:'start',ldy:4,info:['Servicios de factores (flujo real)','Los hogares ofrecen su <b>trabajo, tierra, capital y capacidad empresarial</b> a los mercados de factores.']});
      els.push({k:'arr',id:'fact2',color:'blue',from:[60,23],to:[78,37],label:'Factores',labelAt:[63,32],lanchor:'end',ldy:4,info:['Factores contratados (flujo real)','Las empresas obtienen en los mercados de factores lo que necesitan para producir.']});
    }
    return {els,say:`<p>El modelo muestra dos círculos que van en sentido contrario: lo <b>real</b> (bienes, trabajo) y lo <b>monetario</b> (el pago). Cada compra de un hogar es un ingreso para una empresa; cada pago de la empresa a los factores es un ingreso para un hogar. Los <b>precios</b> en los mercados coordinan todas esas decisiones sin que nadie dirija el conjunto.</p>`,sayTitle:'Cómo leerlo'};
  }
};
CHAPTERS.push({id:2,title:'El problema económico',
teaser:'La frontera de posibilidades de producción, costo de oportunidad creciente, ventaja comparativa y flujos circulares.',
bigq:'Una sociedad puede producir infinidad de cosas, pero no todas a la vez. ¿Cuánto de cada bien conviene producir, y cómo se logra que millones de personas se coordinen para hacerlo?',
learn:['Interpretar la frontera de posibilidades de producción (FPP): lo alcanzable, lo eficiente y lo inalcanzable.','Calcular el costo de oportunidad y explicar por qué crece.','Decidir el uso eficiente de recursos con beneficio y costo marginal.','Explicar por qué el comercio beneficia a todos (ventaja comparativa).','Describir los flujos circulares entre hogares, empresas y mercados.'],
html:`
<h2>1. Posibilidades de producción y costo de oportunidad</h2>
<p>En cada momento, una economía cuenta con una cantidad limitada de <b>factores de producción</b>: trabajo, tierra, capital (máquinas, edificios) y capacidad empresarial. También cuenta con cierta <b>tecnología</b> para transformarlos. Con ellos solo puede producir hasta cierto límite.</p>
${def('Frontera de posibilidades de producción (FPP)','<p>Es el <b>límite</b> entre las combinaciones de bienes y servicios que se pueden producir y las que no, dados los recursos y la tecnología. Para dibujarla en dos dimensiones suponemos que solo se producen dos bienes y que todo lo demás se mantiene igual.</p>')}
<p>El libro usa el ejemplo de una economía que produce <b>hamburguesas</b> y <b>discos compactos (CD)</b>. Si todos los recursos se dedican a CD, se producen 15 millones; si todos van a hamburguesas, 5 millones. En medio hay combinaciones, como 3 millones de hamburguesas y 9 de CD.</p>
${table(['Posibilidad','Hamburguesas (M)','CD (M)'],[['A',0,15],['B',1,14],['C',2,12],['D',3,9],['E',4,5],['F',5,0]])}
${fig('c2_fpp')}
<h3>Producción eficiente e ineficiente</h3>
<p>La producción es <b>eficiente</b> cuando no se puede producir más de un bien sin producir menos del otro. Eso ocurre solo en los puntos <i>sobre</i> la frontera. Un punto <i>dentro</i> de la frontera (el punto Z en la figura) es ineficiente: hay recursos desempleados (trabajadores sin empleo, fábricas paradas) o mal asignados (un cirujano atendiendo una caja registradora).</p>
<h3>Intercambio y costo de oportunidad</h3>
<p>La frontera es una imagen de la idea de <b>intercambio</b>: sobre ella, producir más de un bien implica producir menos del otro. El <b>costo de oportunidad</b> de una hamburguesa adicional es la cantidad de CD que se deja de producir. Sobre la frontera lo calculas con la pendiente: de B (1 hamburguesa, 14 CD) a C (2 hamburguesas, 12 CD) tienes que renunciar a 2 CD para ganar 1 hamburguesa: costo de oportunidad = 2 CD.</p>
${eqn('Costo de oportunidad de 1 hamburguesa = CD sacrificados ÷ hamburguesas ganadas','De C a D sacrificas 3 CD por 1 hamburguesa; de E a F, 5 CD por 1 hamburguesa.')}
<h3>¿Por qué el costo de oportunidad crece?</h3>
<p>Observa en la figura que la frontera se curva «hacia afuera»: cada hamburguesa extra cuesta más CD que la anterior. La razón es que los recursos no son igualmente buenos para todo. Al principio mueves a las personas mejores para hacer hamburguesas (poco sacrificio de CD). Cuando ya has movido a los mejores, empiezas a mover a quienes son excelentes grabando CD pero malos en la cocina: pierdes mucha producción de CD por cada hamburguesa extra. Es la <b>ley del costo de oportunidad creciente</b>. Si todos los recursos sirvieran igual para ambos bienes, la FPP sería una línea recta con costo constante.</p>
${warn('<p>La frontera no dice cuánto <i>se produce</i>, sino cuánto <i>se podría</i> producir. Elegir un punto de la frontera es una decisión adicional que depende de qué quiere la gente.</p>')}

<h2>2. Uso eficiente de los recursos</h2>
<p>Hay muchos puntos eficientes sobre la frontera. ¿Cuál es el <b>mejor</b>? Depende de lo que valora la gente. Aquí aparecen dos conceptos que ya conoces del capítulo 1:</p>
<ul>
<li><b>Costo marginal (CM):</b> el costo de oportunidad de producir una unidad más. Se mide en la FPP y aumenta conforme producimos más de ese bien.</li>
<li><b>Beneficio marginal (BM):</b> cuánto valoramos una unidad más, medido en lo que estamos dispuestos a entregar a cambio. Disminuye conforme tenemos más (principio del beneficio marginal decreciente).</li>
</ul>
${figAgain('c2_fpp','El costo marginal se lee en la frontera: cada unidad extra cuesta más unidades del otro bien.')}
${fig('c2_efi')}
<p>La regla de oro: se usa eficientemente los recursos cuando el <b>beneficio marginal iguala al costo marginal</b>. Si BM &gt; CM, conviene producir más; si BM &lt; CM, conviene producir menos.</p>

<h2>3. Crecimiento económico</h2>
<p>Cuando aumenta la capacidad productiva —más capital, más educación, mejor tecnología— la FPP se desplaza hacia afuera. Eso es el <b>crecimiento económico</b>. Actívalo en la primera figura del capítulo para verlo. Pero hay un costo: para invertir en capital o educación hoy hay que sacrificar consumo hoy. Por eso los países que invierten más crecen más rápido, pero consumen menos al principio. El libro compara a México y Corea del Sur: Corea sacrificó más consumo presente para invertir y creció mucho más.</p>
${figAgain('c2_fpp')}

<h2>4. Ganancias del comercio</h2>
<p>¿Por qué la gente no produce todo lo que necesita? Porque comerciar nos hace más ricos a todos. La explicación está en la <b>ventaja comparativa</b>.</p>
${def('Ventaja comparativa','<p>Una persona (o país) tiene ventaja comparativa en una actividad si puede realizarla con un <b>costo de oportunidad menor</b> que otra persona. No se trata de quién produce más, sino de a <b>cuánto sacrifica</b> para producirlo.</p>')}
${def('Ventaja absoluta','<p>Una persona tiene ventaja absoluta si es más productiva en general (produce más con los mismos recursos). Puede tener ventaja absoluta en todo y aun así beneficiarse del comercio, porque la ventaja que importa es la <b>comparativa</b>.</p>')}
<p>En la figura siguiente, Ana produce pan con más facilidad que Beto y también tiene mayor productividad total, pero su costo de oportunidad de un pastel es distinto del de Beto. Mueve el precio de intercambio y verás que <b>ambos</b> ganan solo si el precio queda entre sus dos costos de oportunidad. Para cada uno, la zona verde representa combinaciones que antes eran imposibles.</p>
${fig('c2_trade')}
${tip('<p>Piensa en un abogado que escribe a máquina más rápido que su secretaria. Tiene ventaja absoluta en ambos trabajos. Pero cada hora que pasa tecleando deja de cobrar como abogado (costo de oportunidad alto). Le conviene contratar a la secretaria y dedicarse a lo que le cuesta menos sacrificar.</p>')}
<h3>Ventaja comparativa dinámica</h3>
<p>Las ventajas no son eternas. Si un país se especializa en un bien, <i>aprende haciéndolo</i> (aprendizaje por la práctica), se vuelve más productivo y aumenta su ventaja en ese bien. Es la <b>ventaja comparativa dinámica</b>: cambia con la experiencia. Por eso especializarse produce ganancias que crecen con el tiempo.</p>

<h2>5. Coordinación económica</h2>
<p>Millones de personas toman decisiones diferentes y de algún modo todo funciona: hay pan en la tienda cada mañana. Esto requiere <b>coordinación</b>, que se logra con instituciones que funcionan juntas:</p>
<ul>
<li><b>Empresas:</b> organizaciones que contratan factores y producen bienes y servicios. Coordinan decisiones internamente.</li>
<li><b>Mercados:</b> mecanismos que reúnen a compradores y vendedores. Se coordinan con <b>precios</b>.</li>
<li><b>Derechos de propiedad:</b> reglas que protegen lo que cada quien posee y hacen posible el intercambio voluntario.</li>
<li><b>Dinero:</b> medio que facilita el intercambio sin trueque.</li>
</ul>
<p>El <b>modelo del flujo circular</b> muestra cómo se conectan:</p>
${fig('c2_flujo')}
<p>Los precios son señales: si falta pan, su precio sube y se produce más; si sobra, baja y se produce menos. Nadie ordena a todos qué hacer; los precios y los incentivos coordinan. Entender cómo funciona esa coordinación es el objetivo de los próximos capítulos.</p>
`,
terms:[['Factores de producción','Recursos para producir: trabajo, tierra, capital y capacidad empresarial.'],['Frontera de posibilidades de producción','Límite de lo que se puede producir con los recursos y tecnología disponibles.'],['Producción eficiente','No se puede producir más de un bien sin producir menos de otro. Ocurre sobre la frontera.'],['Costo de oportunidad creciente','Producir cada unidad adicional de un bien cuesta más unidades del otro, porque los recursos no son igual de útiles en todo.'],['Costo marginal','Costo de oportunidad de una unidad adicional.'],['Beneficio marginal','Valor que la gente da a una unidad adicional. Disminuye al tener más.'],['Crecimiento económico','Expansión de la capacidad productiva: la frontera se mueve hacia afuera.'],['Ventaja comparativa','Menor costo de oportunidad en una actividad. Es la base del comercio.'],['Ventaja absoluta','Mayor productividad general frente a otro productor.'],['Flujo circular','Modelo de cómo circulan bienes, factores y dinero entre hogares, empresas y mercados.']],
quiz:[
 {q:'Un punto dentro de la frontera de posibilidades de producción representa:',o:['Una producción ineficiente: hay recursos desempleados o mal asignados','Una producción imposible','La mejor combinación posible','Un costo de oportunidad cero'],a:0,why:'Dentro de la FPP es alcanzable, pero ineficiente: se podría producir más de un bien sin producir menos del otro.'},
 {q:'¿Por qué la FPP real es curva (bowed hacia afuera)?',o:['Porque el costo de oportunidad crece al producir más de un bien','Porque los precios suben','Porque los consumidores se cansan','Porque la tecnología es mala'],a:0,why:'Los recursos no son igual de buenos en todos los usos; al reasignarlos, cada unidad extra de un bien sacrifica más del otro.'},
 {q:'Una persona tiene ventaja comparativa en un bien cuando:',o:['Su costo de oportunidad de producirlo es menor','Produce más unidades en total','Vende más barato en dinero','Tiene mejor tecnología'],a:0,why:'Ventaja comparativa significa menor costo de oportunidad, no mayor productividad (eso es ventaja absoluta).'},
 {q:'¿Cuál es la condición del uso eficiente de los recursos?',o:['BM = CM','BM mayor que CM','CM = 0','Producir el máximo posible'],a:0,why:'Si BM &gt; CM conviene producir más; si BM &lt; CM, menos. Se alcanza la eficiencia cuando se igualan.'}]});
