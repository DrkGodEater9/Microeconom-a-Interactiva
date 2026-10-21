/** Capítulo 15 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { f$, fn } from '../../engine/format.js';
import { def, tip, eqn, fig, table } from '../../engine/blocks.js';

FIGS.c15_neg = {
  title:'Externalidad negativa: la contaminación (ejemplo ilustrativo)',
  intro:'El productor solo cuenta <i>su</i> costo. Pero su producción también daña a otros (costo externo). El mercado produce de más. Mira cómo corregirlo.',
  x:{label:'Cantidad producida (unidades por día)',max:16,ticks:[0,4,8,12,16]}, y:{label:'Precio y costo ($)',max:24,ticks:[0,4,8,12,16,20,24],fmt:v=>'$'+v},
  controls:[
   {id:'e',label:'Costo externo por unidad (daño a terceros)',min:0,max:8,step:.5,value:4,fmt:v=>f$(v,1),hint:'Es lo que pierden los vecinos, el medio ambiente o la salud por cada unidad producida. Nadie se lo cobra al productor.'},
   {id:'p',type:'seg',label:'Política',value:'n',options:[['n','Sin intervención'],['t','Impuesto pigouviano'],['l','Permisos de contaminación']]}],
  build(s){
    const e=s.e, MB=Q=>18-Q, MC=Q=>2+Q, Qm=8, Pm=10, Qe=(16-e)/2, Pe=MB(Qe);
    const dwl=e*e/4;
    const Q=s.p==='n'?Qm:Qe, P=MB(Q);
    const els=[
     {k:'line',id:'mb',color:'blue',w:3.6,pts:[[0,18],[16,2]],label:'Demanda = BMS',legend:'Demanda (beneficio marginal)',info:['Demanda = beneficio marginal','Cuánto valoran los consumidores cada unidad. Aquí no hay externalidades de consumo, así que beneficio privado = social.']},
     {k:'line',id:'mc',color:'red',w:3.6,pts:[[0,2],[16,18]],label:'Oferta = CM privado',lp:1,legend:'Oferta (costo marginal privado)',info:['Oferta = costo marginal privado','Solo incluye lo que el productor paga de su bolsillo: mano de obra, materiales, energía.']}];
    if(e>0) els.push({k:'line',id:'msc',color:'purple',dash:'7 5',w:3.2,pts:[[0,2+e],[16,18+e]].map(p=>p),label:'CM social',lp:1,legend:'Costo marginal social (CMS)',info:['Costo marginal social (CMS)','Es el costo marginal privado <b>más el costo externo</b> que se carga a otros. La distancia vertical entre CMS y CM privado es el daño por unidad ('+f$(e,1)+').']});
    if(e>0&&s.p==='n') els.push({k:'area',id:'dwl',color:'amber',op:.7,pts:[[Qe,MB(Qe)],[Qm,Pm],[Qm,Pm+e]],legend:'Pérdida irrecuperable (sobreproducción)',info:['Pérdida irrecuperable','Se producen unidades cuyo <b>costo social supera su beneficio</b> (el daño es mayor que lo que valen). Es el tamaño de la ineficiencia: '+f$(dwl,2)+'.']});
    if(s.p==='t'&&e>0) els.push({k:'area',id:'imp',color:'green',op:.35,pts:[[0,MC(0)],[Qe,MC(Qe)],[Qe,MC(Qe)+e],[0,2+e]],legend:'Recaudación del impuesto',info:['Recaudación del impuesto','Un impuesto igual al daño por unidad ('+f$(e,1)+') hace que el productor «internalice» el costo externo. Recauda '+f$(e*Qe,1)+', que podría compensar a los afectados.']});
    if(s.p==='l'&&e>0) els.push({k:'line',id:'lim',color:'green',w:4,pts:[[Qe,0],[Qe,24]],label:{t:'Límite de permisos',at:[Qe,24],dx:6,dy:-4},legend:'Límite total de permisos',info:['Límite de permisos negociables','La autoridad emite solo los permisos que corresponden a la producción eficiente. Las empresas los compran y venden entre sí; su precio revela el costo marginal de reducir la contaminación (≈ '+f$(e,1)+').']});
    els.push({k:'pt',id:'m',color:'gray',at:[Qm,Pm],r:6,label:{t:'Mercado libre',dx:10,dy:18},legend:'Equilibrio del mercado libre',info:['Equilibrio del mercado libre','Cantidad 8 y precio $10: el productor ignora el daño y produce de más (si e > 0).']});
    els.push({k:'pt',id:'ef',color:'green',at:[Qe,Pe],r:8,guides:true,gx:fn(Qe,1),gy:f$(Pe,2),label:{t:'Eficiente',dx:12,dy:-12},legend:'Producción eficiente (BM = CMS)',info:['Producción eficiente','Donde el beneficio marginal iguala al <b>costo marginal social</b>: '+fn(Qe,1)+' unidades. Menos contaminación, pero no cero: dejar de producir también cuesta.']});
    return {els,read:[['Producción',fn(Q,1),'blue'],['Precio al consumidor',f$(P,2),'gray'],['Producción eficiente',fn(Qe,1),'green'],['Pérdida irrecuperable',s.p==='n'?f$(dwl,2):'$0.00',s.p==='n'&&e>0?'amber':'green']],
     say:e===0?'<p>Sin costo externo el mercado ya es eficiente: producción 8. Sube el costo externo.</p>':s.p==='n'?`<p>El productor solo mira su costo privado y produce <b>8</b>. Pero la cantidad eficiente es <b>${fn(Qe,1)}</b>: se sobreproduce ${fn(Qm-Qe,1)} unidades y se pierden <b>${f$(dwl,2)}</b>. Los afectados cargan con un costo que nadie les compensa.</p>`:s.p==='t'?`<p>Con un <b>impuesto igual al daño</b> (${f$(e,1)} por unidad), el costo privado sube hasta el social: el mercado produce la cantidad eficiente (${fn(Qe,1)}) sin que nadie se lo ordene. Es la solución de <b>Pigou</b>: ponerle precio a la contaminación.</p>`:`<p>Con <b>permisos negociables</b> se limita la contaminación total al nivel eficiente, y se deja a las empresas decidir quién contamina: las que reducen contaminación más barato venden sus permisos a las que no. Se logra el mismo resultado con el menor costo total.</p>`};
  }
};
FIGS.c15_pos = {
  title:'Externalidad positiva: el conocimiento y la educación (ejemplo ilustrativo)',
  intro:'Cuando alguien aprende, también beneficia a otros (los demás se aprovechan de sus ideas). El mercado produce de menos. Un subsidio puede corregirlo.',
  x:{label:'Cantidad (años de educación por persona)',max:14,ticks:[0,2,4,6,8,10,12,14]}, y:{label:'Beneficio y costo ($ miles)',max:22,ticks:[0,4,8,12,16,20],fmt:v=>'$'+v},
  controls:[
   {id:'e',label:'Beneficio externo por unidad (beneficia a otros)',min:0,max:8,step:.5,value:4,fmt:v=>f$(v,1),hint:'Es lo que ganan los demás por cada año extra que tú estudias: empresas que contratan personal mejor, ciudadanos mejor informados, ideas que se difunden.'},
   {id:'p',type:'seg',label:'Política',value:'n',options:[['n','Sin intervención'],['s','Subsidio igual al beneficio externo']]}],
  build(s){
    const e=s.e, MC=Q=>2+Q, MSB=Q=>14+e-Q, Qm=6, Pm=8, Qe=(12+e)/2, dwl=e*e/4;
    const els=[
     {k:'line',id:'mb',color:'blue',w:3.6,pts:[[0,14],[14,0]],label:'BM privado',legend:'Beneficio marginal privado (demanda)',info:['Beneficio marginal privado','Lo que valora la persona que consume: su demanda.']},
     {k:'line',id:'mc',color:'red',w:3.6,pts:[[0,2],[14,16]],label:'CM',lp:1,legend:'Costo marginal (oferta)',info:['Costo marginal','Lo que cuesta producir cada unidad de educación.']}];
    if(e>0) els.push({k:'line',id:'msb',color:'purple',dash:'7 5',w:3.2,pts:[[0,14+e],[14,e]],label:'BM social',legend:'Beneficio marginal social (BMS)',info:['Beneficio marginal social (BMS)','Es el beneficio privado <b>más el beneficio externo</b> para otros. Para la sociedad, cada unidad vale más de lo que la persona está dispuesta a pagar.']});
    if(e>0&&s.p==='n') els.push({k:'area',id:'dwl',color:'amber',op:.7,pts:[[Qm,MSB(Qm)],[Qe,MSB(Qe)],[Qm,MC(Qm)]],legend:'Pérdida irrecuperable (subproducción)',info:['Pérdida irrecuperable','Unidades que valían más para la sociedad (con los beneficios externos) que lo que cuestan, pero que no se producen: '+f$(dwl,2)+'.']});
    if(e>0&&s.p==='s') els.push({k:'area',id:'sub',color:'green',op:.35,pts:[[0,2],[Qe,2+Qe],[Qe,2+Qe-e],[0,2-e]],legend:'Costo del subsidio',info:['Costo del subsidio','El gobierno paga '+f$(e,1)+' por unidad: '+f$(e*Qe,1)+' en total. Es el precio de lograr la cantidad eficiente.']});
    els.push({k:'pt',id:'m',color:'gray',at:[Qm,Pm],r:6,label:{t:'Mercado libre',dx:10,dy:18},legend:'Equilibrio del mercado libre',info:['Equilibrio del mercado libre','Cantidad 6 y precio $8: nadie toma en cuenta el beneficio que se lleva otro.']});
    els.push({k:'pt',id:'ef',color:'green',at:[Qe,MC(Qe)],r:8,guides:true,gx:fn(Qe,1),gy:f$(MC(Qe),2),label:{t:'Eficiente',dx:12,dy:-12},legend:'Cantidad eficiente (BMS = CM)',info:['Cantidad eficiente','Donde el beneficio marginal social iguala al costo marginal: '+fn(Qe,1)+' unidades. Mayor que la del mercado libre.']});
    const Q=s.p==='n'?Qm:Qe;
    return {els,read:[['Cantidad',fn(Q,1),'blue'],['Cantidad eficiente',fn(Qe,1),'green'],['Pérdida irrecuperable',s.p==='n'?f$(dwl,2):'$0.00',s.p==='n'&&e>0?'amber':'green']],
     say:e===0?'<p>Sin beneficio externo el mercado ya es eficiente. Sube el beneficio externo.</p>':s.p==='n'?`<p>Solo se compran <b>6</b> unidades, porque cada persona valora solo su beneficio privado. Pero la sociedad ganaría hasta <b>${fn(Qe,1)}</b>: se pierde <b>${f$(dwl,2)}</b>. Es la razón por la que casi todos los gobiernos financian la educación y la ciencia.</p>`:`<p>Con un <b>subsidio</b> igual al beneficio externo (${f$(e,1)} por unidad) el costo privado baja y se compra la cantidad eficiente: <b>${fn(Qe,1)}</b>. Otras opciones: educación pública gratuita, pagos directos a los investigadores, becas, patentes que dan un monopolio temporal.</p>`};
  }
};
FIGS.c15_coase = {
  title:'El teorema de Coase: ¿importa a quién se le da el derecho? (ejemplo ilustrativo)',
  intro:'Una fábrica puede contaminar y sus vecinos sufren el daño. Si pueden negociar, el resultado eficiente aparece sin importar quién tenga el derecho… siempre que negociar sea barato.',
  noplot:true,
  controls:[
   {id:'bf',label:'Ganancia de la fábrica por contaminar (por mes)',min:0,max:100,step:5,value:60,fmt:v=>f$(v,0)},
   {id:'dn',label:'Daño total a los vecinos por la contaminación',min:0,max:100,step:5,value:40,fmt:v=>f$(v,0)},
   {id:'r',type:'seg',label:'¿Quién tiene el derecho?',value:'v',options:[['v','Los vecinos (aire limpio)'],['f','La fábrica (puede contaminar)']]},
   {id:'tc',label:'Costo de negociar (reunir a los vecinos, abogados)',min:0,max:60,step:5,value:0,fmt:v=>f$(v,0),hint:'Con muchos afectados, negociar es caro: el costo de coordinarlos puede impedir el acuerdo.'}],
  build(s){
    const {bf,dn,tc,r}=s, ef=bf>dn?'contaminar':'no contaminar';
    let res,exp;
    if(r==='v'){ // vecinos tienen derecho: la fábrica debe pagarles para contaminar
      if(bf>dn+tc){res='contamina';exp=`La fábrica gana ${f$(bf,0)} contaminando y el daño es ${f$(dn,0)}: puede <b>comprarles el permiso</b> (pagando entre ${f$(dn,0)} y ${f$(bf-tc,0)}) y todos quedan mejor. Hay acuerdo.`;}
      else{res='no contamina';exp=bf<=dn?`La fábrica gana menos (${f$(bf,0)}) de lo que cuesta compensar el daño (${f$(dn,0)}): no le conviene pagar. Aire limpio.`:`Contaminar sería eficiente, pero el costo de negociar (${f$(tc,0)}) se come la ganancia: no hay acuerdo y queda el aire limpio. Es una <b>falla por costos de transacción</b>.`;}
    } else {
      if(dn>bf+tc){res='no contamina';exp=`El daño (${f$(dn,0)}) supera la ganancia de la fábrica (${f$(bf,0)}): los vecinos le <b>pagan para que no contamine</b> (entre ${f$(bf,0)} y ${f$(dn-tc,0)}) y todos ganan.`;}
      else{res='contamina';exp=dn<=bf?`La fábrica gana más (${f$(bf,0)}) de lo que los vecinos pierden (${f$(dn,0)}): ningún vecino pagaría tanto. Contamina.`:`Dejar de contaminar sería eficiente, pero el costo de negociar (${f$(tc,0)}) lo impide: la fábrica contamina por defecto.`;}
    }
    const efi=res===ef||bf===dn;
    return {read:[['Resultado eficiente',ef,'green'],['Resultado de la negociación',res,efi?'green':'red'],['¿Se logró la eficiencia?',efi?'Sí':'No',efi?'green':'red']],sayTitle:'Qué pasa en la negociación',
     say:`<p>${exp}</p><p>${efi?'El resultado es <b>eficiente</b>: contamina quien más gana contaminando que lo que perjudica.':'El resultado <b>no es eficiente</b>: quedó atrapado por los costos de transacción. Aquí el gobierno puede ayudar con un impuesto, una regulación o facilitando la negociación.'}</p><p>Observa que, con costo de negociar cero, el resultado eficiente es el mismo <b>sin importar quién tenga el derecho</b>; solo cambia quién paga a quién (distribución). Ésa es la idea del <b>teorema de Coase</b>.</p>`};
  }
};
CHAPTERS.push({id:15,title:'Externalidades',
teaser:'Contaminación, conocimiento, derechos de propiedad, teorema de Coase, impuestos y subsidios.',
bigq:'Cuando una fábrica contamina un río, ¿quién paga? Los mercados fallan cuando las acciones de unos afectan a otros sin que se les cobre ni se les pague. ¿Cómo logramos que quien daña cargue con el costo?',
learn:['Definir externalidades positivas y negativas de producción y consumo.','Explicar por qué un mercado con externalidades es ineficiente.','Describir soluciones: derechos de propiedad (Coase), impuestos, permisos, subsidios.','Distinguir el costo (beneficio) privado del social.'],
html:`
<h2>1. Externalidades en nuestras vidas</h2>
<p>Una <b>externalidad</b> es un costo o beneficio que recae sobre alguien que <b>no participó</b> en la transacción. Hay cuatro tipos:</p>
${table(['','Negativa (costo para otros)','Positiva (beneficio para otros)'],[['De producción','Una fábrica contamina un río. Una planta de energía emite humo.','Una empresa de investigación crea conocimiento que otros copian. Un apicultor poliniza los árboles de su vecino.'],['De consumo','Fumar cerca de otros. Escuchar música a todo volumen.','Vacunarse protege también a los demás. Embellecer tu casa mejora el barrio.']])}
<p>Como el que decide solo mira su propio costo y beneficio, <b>ignora</b> el efecto sobre los demás, y el mercado produce una cantidad que no es eficiente.</p>

<h2>2. Externalidades negativas: la contaminación</h2>
<p>La contaminación es la externalidad negativa clásica. Su demanda no es «cuánta contaminación queremos», sino «cuánto aire limpio estamos dispuestos a pagar». Las fuentes pueden ser fábricas, autos, plantas eléctricas. Para analizar necesitamos dos conceptos:</p>
<ul>
<li><b>Costo marginal privado (CMP):</b> el que paga el productor (la oferta).</li>
<li><b>Costo marginal externo:</b> el daño a terceros por cada unidad.</li>
<li><b>Costo marginal social (CMS) = CMP + costo marginal externo.</b></li>
</ul>
<p>El mercado produce donde la demanda cruza al CMP; la cantidad <b>eficiente</b> está donde la demanda cruza al CMS (menor). Entre ambas hay una <b>pérdida irrecuperable</b>.</p>
${fig('c15_neg')}
<h3>Derechos de propiedad y el teorema de Coase</h3>
<p>Una raíz del problema es que el aire limpio, el río o el silencio no tienen dueño: nadie cobra por usarlos. Los <b>derechos de propiedad</b> son reglas que establecen quién es dueño de qué y qué puede hacer con ello. Ronald Coase se preguntó: si se definen y se puede negociar, ¿el mercado se arregla solo?</p>
${def('Teorema de Coase','<p>Si los derechos de propiedad están bien definidos, hay pocos afectados y los <b>costos de transacción son bajos</b>, el mercado logra el resultado eficiente <b>sin importar quién tenga el derecho inicial</b> (cambia solo quién paga a quién).</p>')}
${fig('c15_coase')}
<p>El problema real es que los costos de transacción suelen ser altos (miles de afectados, difícil de medir el daño), y entonces la negociación no funciona. Ahí entra el gobierno.</p>
<h3>Acciones gubernamentales ante los costos externos</h3>
<ul>
<li><b>Impuestos (pigouvianos):</b> un impuesto por unidad igual al costo marginal externo. El productor internaliza el daño. Es eficiente y recauda ingresos.</li>
<li><b>Permisos de contaminación negociables:</b> la autoridad fija el total de contaminación permitido y emite permisos que se pueden comprar y vender. Las empresas que reducen su contaminación a menor costo venden los permisos sobrantes. Se logra la meta con el menor costo total.</li>
<li><b>Regulaciones directas:</b> fijar límites o tecnologías obligatorias. Sencillas, pero menos flexibles y a menudo más costosas.</li>
</ul>
<p>Cuando los tomadores de decisiones están bien informados, impuestos y permisos son eficientes. En la práctica, medir el costo externo es difícil.</p>

<h2>3. Externalidades positivas: el conocimiento</h2>
<p>Cuando alguien adquiere conocimiento, además de beneficiarse él, beneficia a otros: las empresas se aprovechan de personas más preparadas, las ideas se difunden. Aquí hay un <b>beneficio marginal externo</b>.</p>
${eqn('Beneficio marginal social = beneficio marginal privado + beneficio marginal externo')}
<p>Como el individuo solo ve su beneficio privado, <b>compra de menos</b>. La cantidad eficiente (donde BMS = CM) es mayor que la del mercado.</p>
${fig('c15_pos')}
<h3>Acciones gubernamentales ante los beneficios externos</h3>
<ul>
<li><b>Subsidios:</b> pagos que reducen el costo privado (becas, educación subsidiada, subsidios a investigación).</li>
<li><b>Provisión pública:</b> el gobierno produce el bien (escuelas públicas, universidades).</li>
<li><b>Vales (vouchers):</b> el gobierno entrega dinero para gastarlo en educación, y las familias eligen escuela.</li>
<li><b>Patentes y derechos de autor:</b> dan al inventor un monopolio temporal, para que reciba parte del beneficio y quiera invertir en innovar. Hay un costo: el monopolio genera ineficiencias.</li>
</ul>
${tip('<p>Pregúntate siempre: ¿a quién le toca el costo (o el beneficio) que no está pasando por el precio? Si alguien lo recibe sin participar, hay una externalidad, y el mercado produce demasiado (si es costo) o demasiado poco (si es beneficio).</p>','Para detectar una externalidad')}
`,
terms:[['Externalidad','Costo o beneficio que recae en alguien ajeno a la transacción.'],['Costo marginal externo','Costo para terceros por una unidad adicional.'],['Costo marginal social','CM privado + costo marginal externo.'],['Beneficio marginal social','BM privado + beneficio marginal externo.'],['Derechos de propiedad','Reglas sobre quién posee y puede usar un recurso.'],['Teorema de Coase','Con costos de transacción bajos, la negociación logra la eficiencia sin importar quién tenga el derecho.'],['Impuesto pigouviano','Impuesto igual al costo externo: corrige la sobreproducción.'],['Permisos negociables','Derechos transferibles a contaminar con un límite total.'],['Subsidio','Pago para aumentar la producción de un bien con externalidad positiva.']],
quiz:[
 {q:'Con una externalidad negativa de producción, el mercado libre produce:',o:['Más que la cantidad eficiente','Menos que la cantidad eficiente','La cantidad eficiente','Cero'],a:0,why:'El productor ignora el costo externo, así que su costo privado queda por debajo del costo social y produce de más.'},
 {q:'Un impuesto pigouviano eficiente es igual a:',o:['El costo marginal externo (daño por unidad)','El precio del bien','Cero','La ganancia del productor'],a:0,why:'Así el productor enfrenta el costo social completo y escoge la cantidad eficiente.'},
 {q:'El teorema de Coase dice que, si los costos de transacción son bajos:',o:['Se llega al resultado eficiente sin importar quién tenga el derecho','El gobierno siempre debe intervenir','Los derechos de propiedad no importan','El que contamina siempre paga'],a:0,why:'La asignación inicial del derecho solo cambia quién paga a quién, no la eficiencia del resultado.'},
 {q:'La educación genera un beneficio externo. Sin intervención se compra:',o:['Menos de lo eficiente','Más de lo eficiente','Lo eficiente','Nada'],a:0,why:'Cada persona considera solo su beneficio privado. El beneficio social es mayor, así que se subinvierte.'}]});
