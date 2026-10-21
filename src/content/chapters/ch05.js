/** Capítulo 5 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { f$, fn } from '../../engine/format.js';
import { def, warn, fig, figAgain } from '../../engine/blocks.js';

FIGS.c5_unit = {
  title:'Excedente del consumidor y del productor, unidad por unidad',
  intro:'Antes de las curvas, los escalones. Cada barra es una unidad: cuánto estarías dispuesto a pagar (o cuánto te cuesta producirla). El excedente es la diferencia con el precio que realmente se paga.',
  x:{label:'Unidad número',max:9,ticks:[0,1,2,3,4,5,6,7,8,9]}, y:{label:'Dólares',max:18,ticks:[0,4,8,12,16],fmt:v=>'$'+v},
  controls:[{id:'v',type:'seg',label:'Mira el lado de…',value:'c',options:[['c','Consumidor (disposición a pagar)'],['p','Productor (costo mínimo)']]},
            {id:'P',label:'Precio de mercado',min:1,max:17,step:1,value:9,fmt:v=>'$'+v,hint:'Con un precio más alto el consumidor compra menos y gana menos; el productor vende más y gana más.'}],
  build(s){
    const els=[]; let sum=0, n=0; const P=s.P;
    if(s.v==='c'){
      for(let i=1;i<=8;i++){ const w=18-2*i, buy=w>=P; if(buy){sum+=w-P;n++;}
        els.push({k:'area',id:'u'+i,color:buy?'blue':'gray',op:buy?.25:.1,pts:[[i-.4,0],[i+.4,0],[i+.4,w],[i-.4,w]],legend:false,info:['Unidad '+i,'Estarías dispuesto a pagar hasta <b>'+f$(w,0)+'</b> por ella. '+(buy?'El precio es '+f$(P,0)+': <b>la compras</b> y te queda un excedente de '+f$(w-P,0)+'.':'El precio es '+f$(P,0)+', <b>mayor</b> que lo que vale para ti: no la compras.')]});
        if(buy&&w>P) els.push({k:'area',id:'x'+i,color:'green',op:.5,pts:[[i-.4,P],[i+.4,P],[i+.4,w],[i-.4,w]],legend:false,info:['Excedente de la unidad '+i,'Pagas '+f$(P,0)+' por algo que para ti vale '+f$(w,0)+'. Ganas '+f$(w-P,0)+'.']}); }
      els.push({k:'line',id:'pr',color:'amber',w:3,pts:[[0,P],[9,P]],label:'Precio $'+P,legend:'Precio de mercado',info:['Precio de mercado','Lo que pagan todos los consumidores por <b>cada</b> unidad, no importa cuánto les valga a ellos.']});
      els.push({k:'area',id:'cs',color:'green',op:0,pts:[[0,0],[0,0],[0,0]],legend:'Excedente del consumidor (verde)',info:['Excedente del consumidor','Es la diferencia entre lo que estás <b>dispuesto a pagar</b> y lo que <b>realmente pagas</b>, sumada sobre todas las unidades que compras. Es la ganancia del comprador.']});
    } else {
      for(let i=1;i<=8;i++){ const c=1+i, sell=c<=P; if(sell){sum+=P-c;n++;}
        els.push({k:'area',id:'u'+i,color:sell?'red':'gray',op:sell?.22:.1,pts:[[i-.4,0],[i+.4,0],[i+.4,c],[i-.4,c]],legend:false,info:['Unidad '+i,'Producirla te cuesta mínimo <b>'+f$(c,0)+'</b>. '+(sell?'El precio es '+f$(P,0)+': <b>la vendes</b> y ganas '+f$(P-c,0)+' extra.':'El precio es '+f$(P,0)+', <b>menor</b> que su costo: no la produces.')]});
        if(sell&&P>c) els.push({k:'area',id:'x'+i,color:'green',op:.5,pts:[[i-.4,c],[i+.4,c],[i+.4,P],[i-.4,P]],legend:false,info:['Excedente de la unidad '+i,'Recibes '+f$(P,0)+' por algo que te costó '+f$(c,0)+'. Ganas '+f$(P-c,0)+'.']}); }
      els.push({k:'line',id:'pr',color:'amber',w:3,pts:[[0,P],[9,P]],label:'Precio $'+P,legend:'Precio de mercado',info:['Precio de mercado','Lo que reciben todos los productores por <b>cada</b> unidad vendida.']});
      els.push({k:'area',id:'ps',color:'green',op:0,pts:[[0,0],[0,0],[0,0]],legend:'Excedente del productor (verde)',info:['Excedente del productor','Es la diferencia entre el <b>precio que recibes</b> y tu <b>costo mínimo</b> de producir, sumada sobre todas las unidades que vendes. Es la ganancia del vendedor.']});
    }
    return {els,read:[[s.v==='c'?'Unidades compradas':'Unidades vendidas',n,'gray'],[s.v==='c'?'Excedente del consumidor':'Excedente del productor',f$(sum,0),'green']],
     say:s.v==='c'?`<p>A $${P} compras <b>${n}</b> unidades (las que valen al menos eso para ti). Tu excedente total es la suma de las partes verdes: <b>${f$(sum,0)}</b>.</p><p>Con muchas unidades pequeñas, la figura se vuelve una curva de demanda y el excedente es el área triangular entre la curva y el precio.</p>`:`<p>A $${P} vendes <b>${n}</b> unidades (las que te cuestan menos que eso). Tu excedente es la suma de las partes verdes: <b>${f$(sum,0)}</b>.</p><p>Con muchas unidades, es el área entre el precio y la curva de oferta.</p>`};
  }
};
FIGS.c5_sur = {
  title:'Excedentes y eficiencia en un mercado competitivo',
  intro:'La demanda es el beneficio marginal para los compradores; la oferta es el costo marginal de los productores. El mercado competitivo produce donde se cruzan: ahí el excedente total es el mayor posible.',
  x:{label:'Cantidad (unidades)',max:10,ticks:[0,2,4,6,8,10]}, y:{label:'Precio ($)',max:22,ticks:[0,4,8,12,16,20],fmt:v=>'$'+v},
  controls:[{id:'Q',label:'Cantidad que se produce',min:0,max:10,step:.1,value:6,fmt:v=>fn(v,1),hint:'En un mercado competitivo la cantidad es 6. Pero imagina un monopolio que produce menos o un subsidio que lleva a producir más: ¿qué se pierde?'}],
  build(s){
    const MB=q=>20-2*q, MC=q=>2+q, Qe=6, Pe=8, Q=s.Q;
    const TS=18*Q-1.5*Q*Q, TSmax=54, dwl=TSmax-TS;
    const els=[
      {k:'area',id:'cs',color:'blue',op:.28,pts:[[0,20],[Qe,Pe],[0,Pe]],label:{t:'Excedente del consumidor',at:[1.8,11.2],anchor:'middle'},legend:'Excedente del consumidor',info:['Excedente del consumidor (EC)','El área entre la curva de demanda y el precio de mercado. Es lo que ganan los compradores: pagan $8 por unidades que valen para ellos hasta $20. En total: '+f$(36,0)+'.']},
      {k:'area',id:'ps',color:'red',op:.28,pts:[[0,2],[Qe,Pe],[0,Pe]],label:{t:'Excedente del productor',at:[1.8,5.3],anchor:'middle'},legend:'Excedente del productor',info:['Excedente del productor (EP)','El área entre el precio y la curva de oferta. Es lo que ganan los vendedores: reciben $8 por unidades que les cuestan desde $2. En total: '+f$(18,0)+'.']}];
    if(Q<Qe) els.push({k:'area',id:'dwl',color:'amber',op:.65,pts:[[Q,MB(Q)],[Qe,Pe],[Q,MC(Q)]],label:{t:'Pérdida irrecuperable',at:[(Q+Qe*2)/3,(MB(Q)+MC(Q)+Pe)/3],anchor:'middle'},legend:'Pérdida irrecuperable (subproducción)',info:['Pérdida irrecuperable: subproducción','Son las unidades que <b>valían más de lo que costaban</b> pero no se produjeron. Esa ganancia posible se perdió para siempre. Es el tamaño de la ineficiencia: '+f$(dwl,1)+'.']});
    if(Q>Qe) els.push({k:'area',id:'dwl',color:'amber',op:.65,pts:[[Qe,Pe],[Q,MB(Q)],[Q,MC(Q)]],label:{t:'Pérdida irrecuperable',at:[(2*Q+Qe)/3,(MB(Q)+MC(Q)+Pe)/3],anchor:'middle'},legend:'Pérdida irrecuperable (sobreproducción)',info:['Pérdida irrecuperable: sobreproducción','Son unidades que <b>costaron más de lo que valían</b>. Producirlas desperdicia recursos que valían más en otro uso. Tamaño de la ineficiencia: '+f$(dwl,1)+'.']});
    els.push({k:'line',id:'bm',color:'blue',w:3.6,pts:[[0,20],[10,0]],label:'Demanda = BM',legend:'Demanda (beneficio marginal)',info:['Demanda = beneficio marginal','Cada punto indica cuánto vale para los consumidores la unidad número Q. Baja porque la gente se satura.']});
    els.push({k:'line',id:'cm',color:'red',w:3.6,pts:[[0,2],[10,12]],label:'Oferta = CM',legend:'Oferta (costo marginal)',info:['Oferta = costo marginal','Cada punto es lo que cuesta producir la unidad número Q. Sube porque los recursos mejores se agotan.']});
    els.push({k:'pt',id:'eq',color:'green',at:[Qe,Pe],r:8,guides:true,gx:'6',gy:'$8',label:{t:'Eficiente',dx:12,dy:-12},legend:'Equilibrio eficiente',info:['Equilibrio competitivo = asignación eficiente','Aquí BM = CM: ninguna unidad adicional vale más de lo que cuesta, y no queda ninguna unidad valiosa por producir. El excedente total (EC + EP) es el <b>máximo posible</b>. Es la «mano invisible» funcionando.']});
    els.push({k:'line',id:'qq',color:'purple',dash:'4 4',w:2.2,pts:[[Q,0],[Q,Math.max(MB(Q),MC(Q))]],label:{t:'Q = '+fn(Q,1),at:[Q,0],dy:-6,dx:4},legend:false});
    return {els,read:[['Excedente total',f$(TS,1),'green'],['Máximo posible',f$(TSmax,0),'gray'],['Pérdida irrecuperable',f$(dwl,1),dwl>.2?'amber':'green']],
     say:Math.abs(Q-Qe)<.15?'<p>¡Eficiencia! Produces donde BM = CM: el excedente total es el máximo, <b>$54</b> ($36 de consumidores + $18 de productores).</p>':Q<Qe?`<p>Produces <b>poco</b>: hay unidades que valen más de lo que cuestan y no se hacen. Se pierden <b>${f$(dwl,1)}</b> de excedente. Típico de un monopolio.</p>`:`<p>Produces <b>demasiado</b>: las últimas unidades cuestan más de lo que valen. Se pierden <b>${f$(dwl,1)}</b> de excedente. Típico de un mercado con subsidio o con una externalidad negativa.</p>`};
  }
};
CHAPTERS.push({id:5,title:'Eficiencia y equidad',
teaser:'Excedente del consumidor y del productor, mano invisible y qué significa que un mercado sea justo.',
bigq:'Los mercados reparten muchísimas cosas. ¿Lo hacen bien? ¿Cómo medimos si un resultado es eficiente… y si es justo? Una cosa es producir de la mejor manera, otra repartir de manera justa.',
learn:['Explicar la eficiencia con beneficio marginal y costo marginal.','Calcular y dibujar el excedente del consumidor y del productor.','Explicar por qué el equilibrio competitivo es eficiente y qué lo obstaculiza.','Distinguir los criterios de equidad: resultado versus reglas.'],
html:`
<h2>1. Eficiencia e interés social</h2>
<p>En el capítulo 2 viste que usar eficientemente los recursos significa producir donde el beneficio marginal iguala al costo marginal. Veamos mejor esas dos ideas:</p>
<ul>
<li><b>Beneficio marginal (BM)</b> de un bien: lo que está dispuesto a pagar un consumidor por una unidad más. Se lee en la <b>curva de demanda</b>.</li>
<li><b>Costo marginal (CM)</b>: el costo de oportunidad de producir una unidad más. Se lee en la <b>curva de oferta</b>.</li>
</ul>
${figAgain('c3_eq','El beneficio marginal es la curva de demanda y el costo marginal es la de oferta; se cruzan en la cantidad eficiente.')}
<p>Una asignación de recursos es <b>eficiente</b> cuando no se puede mejorar a una persona sin empeorar a otra. En un solo mercado, es la cantidad en la que BM = CM. Si BM &gt; CM, producir una unidad más aumenta el bienestar; si BM &lt; CM, esa unidad le quita más a la sociedad de lo que da.</p>

<h2>2. Valor, precio y excedente del consumidor</h2>
<p>Valor y precio no son lo mismo. El <b>valor</b> es cuánto estás dispuesto a pagar por algo (su beneficio marginal). El <b>precio</b> es lo que realmente pagas. Casi siempre el valor supera al precio de lo que compras: ésa es la ganancia. Imagina que estarías dispuesto a pagar $16 por la primera unidad de algo, pero el precio es $9: obtuviste una ganancia de $7. A esa ganancia se la llama <b>excedente del consumidor</b>.</p>
${def('Excedente del consumidor','<p>Es la <b>suma</b>, sobre todas las unidades que compras, de la diferencia entre lo que estarías dispuesto a pagar y lo que realmente pagas. En la gráfica es el <b>área bajo la curva de demanda y sobre el precio</b>.</p>')}
${figAgain('c3_dem','El excedente es el área bajo esta curva y sobre el precio que pagas.')}
<h2>3. Costo, precio y excedente del productor</h2>
<p>Igual del lado de los vendedores. El <b>costo</b> es lo que cuesta producir (el mínimo al que alguien aceptaría vender). El <b>excedente del productor</b> es la diferencia entre el precio que recibe y ese mínimo, sumada sobre todas las unidades vendidas. En la gráfica es el <b>área sobre la curva de oferta y bajo el precio</b>.</p>
${figAgain('c3_ofe','El excedente del productor es el área sobre esta curva y bajo el precio.')}
${fig('c5_unit')}
<h2>4. ¿Es eficiente el mercado competitivo?</h2>
<p>Pongamos los dos excedentes juntos. En el equilibrio de un mercado competitivo, <b>el excedente total (EC + EP) es el máximo posible</b>. Por eso decimos que el mercado competitivo es eficiente: produce justo las unidades cuyo beneficio supera o iguala su costo, y no produce las demás.</p>
${fig('c5_sur')}
<h3>La mano invisible</h3>
<p>Cada comprador y cada vendedor busca su interés personal, pero el resultado es la cantidad que maximiza el beneficio total de la sociedad. Adam Smith lo describió como una «mano invisible». Para que funcione hacen falta condiciones: precios flexibles, derechos de propiedad claros, información y competencia. Cuando falla, aparece la ineficiencia.</p>
<h3>Obstáculos a la eficiencia</h3>
<p>Si el mercado produce <b>de menos</b> (subproducción) o <b>de más</b> (sobreproducción), aparece la <b>pérdida irrecuperable</b>, el triángulo naranja de la figura. Causas:</p>
<ul>
<li><b>Precios o cantidades reguladas</b>: topes de precios, cuotas (capítulo 6).</li>
<li><b>Impuestos y subsidios</b>: distorsionan lo que se compra y se vende (capítulo 6).</li>
<li><b>Monopolio</b>: restringe la producción para subir el precio (capítulo 12).</li>
<li><b>Externalidades</b>: costos o beneficios que recaen en terceros (capítulo 15).</li>
<li><b>Bienes públicos y recursos comunes</b>: sin precios no hay incentivos (capítulo 16).</li>
<li><b>Altos costos de transacción</b>.</li>
</ul>

${figAgain('c5_sur')}
<h2>5. ¿Es justo el mercado competitivo?</h2>
<p>Un resultado puede ser eficiente sin ser justo. Un mercado puede producir al máximo y aun así dejar a alguien con muy poco. Los economistas distinguen dos grandes enfoques sobre la <b>equidad</b> (justicia):</p>
<h3>Primer enfoque: es justo si el resultado es justo («todos reciben lo que merecen»)</h3>
<ul>
<li><b>Utilitarismo</b> (Bentham): lo justo es lo que maximiza la utilidad total. Como la utilidad marginal del ingreso disminuye, llevaría a una igualdad total de ingresos… pero eso reduce los incentivos a producir.</li>
<li><b>Principio de la diferencia de Rawls</b>: la distribución justa es la que más ayuda a los <b>más pobres</b>, como si no supiéramos en qué lugar de la sociedad nos tocará nacer.</li>
<li><b>«Gran disyuntiva»</b>: redistribuir (impuestos y transferencias) cuesta eficiencia, porque se reducen los incentivos para trabajar y producir. Entre más se redistribuya, más eficiencia se pierde.</li>
</ul>
<h3>Segundo enfoque: es justo si las reglas son justas</h3>
<p>Según Robert Nozick, no importa el resultado: importa que las reglas sean justas. Una asignación es justa si se deriva de dos reglas: <b>(1) el Estado respeta la propiedad privada y (2) la propiedad se transfiere por intercambio voluntario</b>. Si se cumplen, cualquier resultado es justo. Bajo este enfoque, la redistribución forzosa es injusta (es un robo).</p>
${warn('<p>«Eficiente» no significa «justo» ni «deseable». El libro advierte que la eficiencia es solo un criterio. Una asignación muy desigual puede ser eficiente (nadie puede mejorar sin perjudicar a otro) y, a la vez, injusta para muchos. La equidad depende de juicios de valor, no solo de cálculos.</p>')}
`,
terms:[['Beneficio marginal','Lo que gana el consumidor con una unidad más. Se lee en la curva de demanda.'],['Costo marginal','Lo que cuesta producir una unidad más. Se lee en la curva de oferta.'],['Excedente del consumidor','Valor que los compradores reciben por encima de lo que pagan.'],['Excedente del productor','Ganancia de los vendedores por encima de su costo mínimo.'],['Excedente total','Excedente del consumidor + excedente del productor. Es máximo en el equilibrio competitivo.'],['Pérdida irrecuperable','Excedente que se pierde cuando se produce más o menos que la cantidad eficiente.'],['Mano invisible','Resultado: el interés personal en un mercado competitivo lleva a la eficiencia.'],['Utilitarismo','Lo justo es lo que da mayor utilidad total.'],['Principio de la diferencia (Rawls)','Lo justo es lo que más beneficia al más pobre.']],
quiz:[
 {q:'El excedente del consumidor es:',o:['El área bajo la demanda y sobre el precio','El área bajo la oferta y sobre el precio','El precio por la cantidad','La diferencia entre oferta y demanda'],a:0,why:'Es la diferencia entre lo que estás dispuesto a pagar y lo que pagas, sumada en todas las unidades. Gráficamente: bajo la demanda y sobre el precio.'},
 {q:'Un monopolio produce menos que la cantidad competitiva. Esto genera:',o:['Una pérdida irrecuperable por subproducción','Mayor excedente total','Eficiencia','Un aumento del excedente del consumidor'],a:0,why:'Quedan sin producirse unidades que valían más de lo que costaban. La ganancia posible perdida es la pérdida irrecuperable.'},
 {q:'¿En qué cantidad se maximiza el excedente total?',o:['Donde BM = CM','Donde el precio es más bajo','Donde el CM es mínimo','Donde la demanda es cero'],a:0,why:'Producir una unidad extra suma excedente mientras BM &gt; CM y lo resta si BM &lt; CM. El máximo está donde se igualan.'},
 {q:'Según Nozick, un resultado de mercado es justo si:',o:['Surgió de reglas justas: propiedad privada e intercambio voluntario','Reparte los ingresos por igual','Beneficia más al más pobre','Maximiza la utilidad total'],a:0,why:'Nozick evalúa las reglas, no el resultado. Rawls evalúa a quién beneficia más; el utilitarismo evalúa la utilidad total.'}]});
