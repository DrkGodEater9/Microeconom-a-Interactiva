/** Capítulo 12 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, bisect, interp, smooth } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { tip, eqn, fig, table } from '../../engine/blocks.js';

const TC12=[20,21,24,30,40,55]; const tc12=smooth(TC12.map((c,q)=>[q,c]));
const mc12=interp(TC12.slice(1).map((c,i)=>[i+.5,c-TC12[i]]));
const atc12=smooth(TC12.slice(1).map((c,i)=>[i+1,c/(i+1)]));
const D12=Q=>20-2*Q, MR12=Q=>20-4*Q;
const Qm12=bisect(Q=>MR12(Q)-mc12(Q),.5,4.9), Qc12=bisect(Q=>D12(Q)-mc12(Q),.5,5);
FIGS.c12_mono = {
  title:'Un monopolio de precio único (datos del libro: cortes de cabello de Renata)',
  intro:'El monopolio sabe que para vender más debe bajar el precio <i>a todos</i>. Por eso su ingreso marginal es menor que el precio. Elige cuántos cortes producir y compara con la competencia.',
  x:{label:'Cortes de cabello por hora',max:10,ticks:[0,1,2,3,4,5,6,7,8,9,10]}, y:{label:'Dólares por corte',max:22,ticks:[0,4,8,12,16,20],fmt:v=>'$'+v},
  controls:[{id:'q',label:'Cortes de cabello que produce',min:0,max:5,step:.1,value:2,fmt:v=>fn(v,1),hint:'Cuanto más produce, menor es el precio que puede cobrar a todos sus clientes.'},
            {id:'cmp',type:'toggle',label:'Comparar con competencia perfecta',value:false,hint:'En competencia perfecta el precio sería igual al costo marginal.'}],
  build(s){
    const q=s.q, P=D12(q), TR=q*P, TCq=tc12(q), prof=TR-TCq, atcq=q>0.3?atc12(q):atc12(1), Pm=D12(Qm12), profm=Qm12*Pm-tc12(Qm12);
    const els=[
      {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,20],[10,0]],label:'Demanda = IMe',lp:0,legend:'Demanda (= precio = ingreso medio)',info:['Demanda','Es la demanda del mercado, que enfrenta el monopolio entera: para vender más debe bajar el precio. Muestra el precio al que se vende cada cantidad.']},
      {k:'line',id:'im',color:'purple',w:3.6,pts:[[0,20],[5,0]],label:'IM',lp:1,legend:'Ingreso marginal (IM)',info:['Ingreso marginal (IM)','Ingreso adicional por vender un corte más. <b>Es menor que el precio</b>: para vender una unidad más hay que bajar el precio de <i>todas</i>. La ganancia por la unidad extra se reduce por lo que se pierde en las anteriores. IM = 20 − 4Q.']},
      {k:'line',id:'cm',color:'red',w:3.6,pts:curve(mc12,.5,5,30),label:'CM',legend:'Costo marginal (CM)',info:['Costo marginal (CM)','Costo de un corte más.']},
      {k:'line',id:'ct',color:'teal',w:3.2,pts:curve(atc12,1,5,30),label:'CTMe',lp:25,legend:'Costo total medio (CTMe)',info:['Costo total medio','Costo total por corte.']},
      {k:'pt',id:'mx',color:'green',at:[Qm12,Pm],r:8,guides:true,gx:fn(Qm12,1),gy:f$(Pm,2),label:{t:'Máximo beneficio',dx:12,dy:-12},legend:'Elección que maximiza el beneficio',info:['Máximo beneficio del monopolio','El monopolio produce donde <b>IM = CM</b> (donde las curvas violeta y roja se cruzan): '+fn(Qm12,1)+' cortes. Luego mira la <b>demanda</b> para ver el precio máximo que puede cobrar por esa cantidad: '+f$(Pm,2)+'. Beneficio: '+f$(profm,1)+'.']},
      {k:'pt',id:'ch',color:'ink',at:[q,P],r:6,legend:'Tu elección',label:{t:'Tu elección',dx:10,dy:-10},info:['Tu elección actual','Con '+fn(q,1)+' cortes cobra '+f$(P,2)+' por corte. IT = '+f$(TR,1)+'; CT = '+f$(TCq,1)+'; beneficio = '+f$(prof,1)+'.']}];
    if(q>.2) els.push({k:'area',id:'pf',color:prof>=0?'green':'red',op:.3,pts:[[0,P],[q,P],[q,atcq],[0,atcq]],legend:prof>=0?'Beneficio económico':'Pérdida',info:[prof>=0?'Beneficio económico':'Pérdida','(precio − CTMe) × cantidad = ('+f$(P,2)+' − '+f$(atcq,2)+') × '+fn(q,1)+' = '+f$(prof,1)+'.']});
    if(s.cmp){
      const Pc=D12(Qc12);
      els.push({k:'area',id:'dwl',color:'amber',op:.65,pts:[[Qm12,Pm],[Qc12,Pc],[Qm12,mc12(Qm12)]],legend:'Pérdida irrecuperable del monopolio',info:['Pérdida irrecuperable del monopolio','Cortes que valen más para los clientes que su costo, pero que el monopolio no produce para mantener el precio alto. Es la ineficiencia del monopolio.']});
      els.push({k:'pt',id:'cp',color:'teal',at:[Qc12,Pc],r:7,label:{t:'Competencia perfecta',dx:10,dy:16},legend:'Competencia perfecta (D = CM)',info:['Resultado en competencia perfecta','Con muchas empresas, el precio se iguala al costo marginal: '+fn(Qc12,2)+' cortes a '+f$(Pc,2)+'. Más producción y menor precio que en el monopolio.']});
    }
    const cmpTxt=s.cmp?`<p>Competencia perfecta: <b>${fn(Qc12,2)}</b> cortes a <b>${f$(D12(Qc12),2)}</b>. El monopolio produce <b>menos</b> (${fn(Qm12,1)}) y cobra <b>más</b> (${f$(Pm,2)}).</p>`:'';
    return {els,read:[['Precio',f$(P,2),'blue'],['Ingreso marginal',f$(MR12(q),2),'purple'],['Beneficio',f$(prof,1),prof>=0?'green':'red']],
     say:`<p>Con <b>${fn(q,1)}</b> cortes: precio ${f$(P,2)}, IM = ${f$(MR12(q),2)}, CM ≈ ${f$(q>.5?mc12(q):1,2)}.</p><p>${Math.abs(q-Qm12)<.12?'¡Estás en el máximo! IM ≈ CM: el beneficio es el mayor posible ('+f$(profm,1)+').':MR12(q)>mc12(q)?'IM &gt; CM: una unidad más aporta más ingreso que costo. <b>Conviene producir más</b>.':'IM &lt; CM: una unidad más cuesta más de lo que aporta. <b>Conviene producir menos</b>.'}</p>${cmpTxt}`};
  }
};
FIGS.c12_pd = {
  title:'Discriminación de precios: cobrar lo que cada cliente está dispuesto a pagar (ejemplo ilustrativo)',
  intro:'Con un solo precio, un monopolio deja clientes sin atender y deja un excedente al consumidor. Si puede cobrar distinto a cada quien, se queda con ese excedente.',
  x:{label:'Cantidad',max:10,ticks:[0,2,4,6,8,10]}, y:{label:'Precio y costo ($)',max:22,ticks:[0,4,8,12,16,20],fmt:v=>'$'+v},
  controls:[{id:'m',type:'seg',label:'Estrategia de precios',value:'u',options:[['u','Un solo precio'],['d','Dos precios'],['p','Discriminación perfecta']]}],
  build(s){
    const MC=4, els=[]; let CS=0,PS=0,DWL,Q,desc;
    els.push({k:'line',id:'d',color:'blue',w:3.6,pts:[[0,20],[10,0]],label:'Demanda',lp:0,legend:'Demanda',info:['Demanda','Muestra cuánto está dispuesto a pagar cada cliente por la unidad número Q.']});
    els.push({k:'line',id:'cm',color:'red',w:3.6,pts:[[0,MC],[10,MC]],label:{t:'CM = $4',at:[10,MC],dx:-6,dy:-8,anchor:'end'},legend:'Costo marginal',info:['Costo marginal','Cada unidad cuesta $4 producirla.']});
    if(s.m==='u'){
      Q=4; const P=12;
      els.push({k:'line',id:'im',color:'purple',w:3,pts:[[0,20],[5,0]],label:'IM',lp:1,legend:'Ingreso marginal',info:['Ingreso marginal','IM = 20 − 4Q. El monopolio produce donde IM = CM: Q = 4.']});
      els.push({k:'area',id:'cs',color:'blue',op:.3,pts:[[0,20],[Q,P],[0,P]],legend:'Excedente del consumidor',info:['Excedente del consumidor','Lo que ganan los compradores: pagan $12 por unidades que valoran más.']});
      els.push({k:'area',id:'ps',color:'green',op:.35,pts:[[0,MC],[Q,MC],[Q,P],[0,P]],legend:'Beneficio del monopolio',info:['Beneficio (excedente del productor)','Lo que gana el monopolio: ($12 − $4) × 4 unidades = $32.']});
      els.push({k:'area',id:'dwl',color:'amber',op:.65,pts:[[Q,P],[8,MC],[Q,MC]],legend:'Pérdida irrecuperable',info:['Pérdida irrecuperable','Unidades que valían más de $4 para los clientes, pero no se producen. Ineficiencia: $16.']});
      CS=.5*4*8; PS=8*4; DWL=.5*4*8;
      desc='<p><b>Un solo precio</b>: el monopolio produce 4 unidades y cobra $12 a todos. Los clientes con alta disposición a pagar ($20, $18…) se quedan con excedente (azul); los de baja disposición (entre $4 y $12) no compran: eso es ineficiente.</p>';
    } else if(s.m==='p'){
      Q=8;
      els.push({k:'area',id:'ps',color:'green',op:.4,pts:[[0,20],[8,MC],[0,MC]],legend:'Beneficio del monopolio',info:['Beneficio con discriminación perfecta','Cobrando a cada cliente su máxima disposición a pagar, el monopolio se queda con <b>todo el excedente</b>: el triángulo entre la demanda y el costo marginal = $64.']});
      PS=64; DWL=0;
      desc='<p><b>Discriminación perfecta</b> (de primer grado): cada cliente paga exactamente lo máximo que estaría dispuesto a pagar. El monopolio vende hasta que demanda = CM (8 unidades): <b>¡sin pérdida irrecuperable!</b> Es eficiente… pero <b>todo</b> el excedente va al vendedor y el consumidor no gana nada. El monopolio no necesita restringir la producción porque no baja el precio de las unidades anteriores.</p>';
    } else {
      const Q1=8/3,Q2=16/3,P1=D12(Q1),P2=D12(Q2); Q=Q2;
      [[0,Q1,P1],[Q1,Q2,P2]].forEach(([a,b,P],i)=>{
        els.push({k:'area',id:'cs'+i,color:'blue',op:.3,pts:[[a,P],[a,D12(a)],[b,P]],legend:i===0?'Excedente del consumidor (restante)':false,info:['Excedente del consumidor','Lo que aún queda a los clientes de este tramo.']});
        els.push({k:'area',id:'ps'+i,color:'green',op:.38,pts:[[a,MC],[b,MC],[b,P],[a,P]],legend:i===0?'Beneficio del monopolio':false,info:['Beneficio del tramo '+(i+1),'Precio '+f$(P,2)+' menos costo $4, por '+fn(b-a,2)+' unidades.']});
        CS+=(b-a)*(D12(a)-P)/2; PS+=(b-a)*(P-MC); });
      els.push({k:'area',id:'dwl',color:'amber',op:.65,pts:[[Q2,P2],[8,MC],[Q2,MC]],legend:'Pérdida irrecuperable',info:['Pérdida irrecuperable','Se reduce respecto al precio único.']});
      DWL=.5*(8-Q2)*(P2-MC);
      desc='<p><b>Dos precios</b> (por ejemplo, tarifa normal y tarifa con descuento): el monopolio cobra '+f$(P1,2)+' al primer grupo y '+f$(P2,2)+' al segundo. Se produce más que con precio único (5.3 vs 4), crece su beneficio y se reduce la pérdida irrecuperable. Cuantos más precios distintos, más se parece a la discriminación perfecta.</p>';
    }
    return {els,read:[['Cantidad',fn(Q,1),'gray'],['Excedente del consumidor',f$(CS,1),'blue'],['Beneficio del monopolio',f$(PS,1),'green'],['Pérdida irrecuperable',f$(DWL,1),DWL>0?'amber':'green']],say:desc+'<p>Para discriminar, el monopolio necesita <b>(1)</b> separar a los compradores según lo que pagarían y <b>(2)</b> evitar que revendan (por eso los pasajes de avión llevan nombre). Ejemplos reales: descuentos de estudiantes, cupones, tarifas de cine por la tarde.</p>'};
  }
};
CHAPTERS.push({id:12,title:'Monopolio',
teaser:'Poder de mercado, ingreso marginal, pérdida irrecuperable, búsqueda de rentas y discriminación de precios.',
bigq:'Cuando una empresa es la única que vende un producto, ¿cuánto produce y qué precio cobra? ¿Y por qué eso es malo para la sociedad aunque a veces sea inevitable?',
learn:['Explicar cómo surge un monopolio y cómo fija precio y cantidad (IM = CM).','Entender por qué el ingreso marginal es menor que el precio.','Comparar monopolio y competencia perfecta: precio, cantidad, eficiencia y redistribución.','Explicar la búsqueda de rentas y la discriminación de precios.'],
html:`
<h2>1. El poder de mercado</h2>
<p>Un <b>monopolio</b> es una empresa que produce un bien <b>sin sustitutos cercanos</b> y que está protegida por <b>barreras a la entrada</b> que impiden que otras empresas compitan. A diferencia de la empresa competitiva, tiene <b>poder de mercado</b>: puede influir en el precio.</p>
<h3>Cómo surge el monopolio</h3>
<ul>
<li><b>Monopolio natural:</b> cuando una sola empresa puede producir a un costo medio menor que varias (hay economías de escala muy grandes). Ejemplo: redes de distribución de agua.</li>
<li><b>Propiedad de un recurso clave:</b> una empresa controla el único recurso necesario.</li>
<li><b>Barreras legales:</b> el gobierno otorga derechos exclusivos: patentes, derechos de autor, licencias.</li>
</ul>
<h3>Estrategias de precios</h3>
<p>Un monopolio puede cobrar un <b>precio único</b> a todos (lo que se estudia primero) o aplicar <b>discriminación de precios</b> (cobrar distinto a distintos clientes por el mismo producto).</p>

<h2>2. Decisión de producción y precio de un monopolio de precio único</h2>
<h3>Precio e ingreso marginal</h3>
<p>Aquí está la idea más importante del capítulo. Para vender más, un monopolio de precio único debe <b>bajar el precio de todas las unidades</b>. Al hacerlo gana por la unidad extra, pero pierde por haber bajado el precio de las anteriores. Por eso su <b>ingreso marginal es menor que el precio</b>.</p>
<p>Con el ejemplo del libro (Renata, que corta cabello):</p>
${table(['Precio ($)','Cantidad','Ingreso total ($)','Ingreso marginal ($)'],[[20,0,0,'—'],[18,1,18,18],[16,2,32,14],[14,3,42,10],[12,4,48,6],[10,5,50,2]])}
<p>Al pasar de 2 a 3 cortes, el precio baja de $16 a $14. El tercer corte le da $14, pero ahora cobra $2 menos por cada uno de los dos primeros ($4 menos). Ingreso marginal = $14 − $4 = <b>$10</b>, menor que el precio de $14.</p>
${eqn('Con demanda lineal P = a − bQ: &nbsp; IM = a − 2bQ','La curva de IM tiene el mismo intercepto y el doble de pendiente.')}
<h3>Ingreso marginal y elasticidad</h3>
<p>Cuando la demanda es <b>elástica</b>, bajar el precio aumenta el ingreso total: IM &gt; 0. Cuando es <b>inelástica</b>, bajarlo reduce el ingreso total: IM &lt; 0. Cuando la elasticidad es 1, IM = 0 e ingreso total es máximo. Por eso un monopolio <b>nunca produce donde la demanda es inelástica</b>: allí podría subir el precio, producir menos, ganar más y gastar menos.</p>
<h3>Decisión de producción y precio</h3>
<p>El monopolio busca maximizar su beneficio. Sigue los mismos pasos que la empresa competitiva, con <b>IM en lugar de precio</b>:</p>
<ol>
<li>Produce donde <b>IM = CM</b>.</li>
<li>Cobra el <b>precio máximo</b> que logre vender esa cantidad: se lee en la <b>curva de demanda</b>.</li>
</ol>
<p>En el ejemplo de Renata: IM = CM en 3 cortes. El precio es $14, el ingreso total $42, el costo total $30 y el beneficio $12.</p>
${fig('c12_mono')}

<h2>3. Comparación entre el monopolio de precio único y la competencia perfecta</h2>
<h3>Producción y precio</h3>
<p>Si una industria competitiva se volviera un monopolio (con los mismos costos), la producción <b>disminuiría</b> y el precio <b>aumentaría</b>. La competencia produce donde precio = CM; el monopolio, donde IM = CM, con IM &lt; precio.</p>
<h3>Eficiencia</h3>
<p>Con competencia, precio = beneficio marginal = costo marginal: se alcanza la eficiencia. En el monopolio, el beneficio marginal (el precio) <b>excede</b> al costo marginal: algunas unidades que valen más de lo que cuestan no se producen. El triángulo de la figura es la <b>pérdida irrecuperable</b> del monopolio.</p>
<h3>Redistribución de excedentes</h3>
<p>El monopolio <b>transfiere</b> excedente de los consumidores al productor: parte del excedente del consumidor se convierte en beneficio del monopolio (un rectángulo), y otra parte se pierde para siempre (el triángulo).</p>
<h3>Búsqueda de rentas</h3>
<p>Cualquier actividad para obtener un monopolio exclusivo se llama <b>búsqueda de rentas</b>: contratar abogados y cabilderos, financiar campañas, comprar licencias. Esas actividades usan recursos reales sin producir nada útil. Si hay libre competencia por el monopolio, los costos de la búsqueda pueden igualar al beneficio esperado, y entonces la sociedad pierde <b>tanto la pérdida irrecuperable como el costo de la búsqueda de rentas</b>.</p>

<h2>4. Discriminación de precios</h2>
<p>Muchas empresas cobran precios distintos por el mismo producto: descuentos para estudiantes, tarifas de aerolíneas según cuándo compras, cupones. Eso es <b>discriminación de precios</b>. La diferencia de precios no responde a diferencias de costos, sino a diferencias en la disposición a pagar.</p>
<p>¿Por qué les conviene? Porque se quedan con parte del <b>excedente del consumidor</b> y atienden a clientes que antes quedaban fuera. Requiere: poder de mercado, poder separar a los clientes y evitar la reventa.</p>
${fig('c12_pd')}
<p>La <b>discriminación perfecta</b> logra eficiencia (sin pérdida irrecuperable) pero deja al consumidor sin excedente. En la práctica la discriminación puede ser buena o mala para la eficiencia, pero casi siempre aumenta los beneficios del vendedor.</p>

<h2>5. Aspectos políticos del monopolio</h2>
<p>El monopolio no es malo en todo. Puede traer ventajas: <b>economías de escala</b> (costos más bajos que muchas empresas), <b>incentivo a innovar</b> (las patentes recompensan la investigación). La pregunta de política pública es cómo conseguir los beneficios sin los costos. Dos respuestas: <b>leyes de competencia</b> y <b>regulación</b> de los monopolios naturales (se estudia en el capítulo 14).</p>
${tip('<p>Un monopolio natural enfrenta un dilema: si cobra el precio eficiente (precio = CM), pierde dinero (porque el CM está bajo el costo medio). Si cobra el precio que cubre costos (precio = CTMe), hay una pequeña pérdida irrecuperable. El capítulo 14 muestra las salidas.</p>','Adelanto del capítulo 14')}
`,
terms:[['Monopolio','Una sola empresa, sin sustitutos cercanos y con barreras a la entrada.'],['Barreras a la entrada','Obstáculos legales o naturales que impiden la llegada de competidores.'],['Monopolio natural','Una sola empresa abastece el mercado a menor costo que varias.'],['Ingreso marginal del monopolio','Menor que el precio: para vender más hay que bajar el precio de todas las unidades.'],['Pérdida irrecuperable','Valor de las unidades que no se producen por la restricción del monopolio.'],['Búsqueda de rentas','Gasto de recursos para obtener o mantener un monopolio.'],['Discriminación de precios','Cobrar precios distintos por el mismo bien según la disposición a pagar.'],['Discriminación perfecta','Cobrar a cada cliente su máxima disposición a pagar.']],
quiz:[
 {q:'Un monopolio de precio único produce donde:',o:['IM = CM, y cobra el precio de la demanda para esa cantidad','Precio = CM','IM = 0','Precio = costo medio'],a:0,why:'Igual que cualquier empresa, iguala ingreso y costo marginales; luego mira la curva de demanda para fijar el precio.'},
 {q:'¿Por qué el ingreso marginal del monopolio es menor que el precio?',o:['Para vender una unidad más debe bajar el precio de todas las anteriores','Porque el costo marginal sube','Porque hay impuestos','Porque la demanda es inelástica'],a:0,why:'Ganas por la unidad nueva pero pierdes por rebajar las demás; el efecto neto es menor que el precio.'},
 {q:'Comparado con la competencia perfecta, el monopolio produce:',o:['Menos y a un precio mayor','Más y a un precio menor','Lo mismo','Más y a un precio mayor'],a:0,why:'Restringe la producción para subir el precio: la diferencia con el óptimo es la pérdida irrecuperable.'},
 {q:'Con discriminación de precios perfecta:',o:['No hay pérdida irrecuperable, pero el consumidor pierde todo su excedente','Aumenta la pérdida irrecuperable','Los precios bajan','El monopolio produce menos'],a:0,why:'Produce la cantidad eficiente (D = CM), pero cobra a cada cliente su máxima disposición a pagar.'}]});
