/** Capítulo 11 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, bisect, interp, smooth } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { warn, eqn, fig } from '../../engine/blocks.js';

const TC11=[22,45,66,85,100,114,126,141,160,183,210,245,300,360];
const tcS=smooth(TC11.map((c,q)=>[q,c]));
const MC11pts=TC11.slice(1).map((c,i)=>[i+.5,c-TC11[i]]);
const mc11=interp(MC11pts);
const atcS=smooth(TC11.slice(1).map((c,i)=>[i+1,c/(i+1)]));
const avcS=smooth(TC11.slice(1).map((c,i)=>[i+1,(c-22)/(i+1)]));
const minOf=(f,a,b)=>{let bx=a,bv=1e9;for(let x=a;x<=b;x+=.01){const v=f(x);if(v<bv){bv=v;bx=x}}return [bx,bv]};
const [qATC,pATC]=minOf(atcS,2,13), [qAVC,pAVC]=minOf(avcS,2,13);
const q11=P=>{ if(P<pAVC) return 0; const f=q=>mc11(q)-P; if(f(13)<0) return 13; if(f(5.5)>0) return 0; return bisect(f,5.5,13); };
FIGS.c11_firm = {
  title:'La decisión de una empresa competitiva (datos del libro: fábrica de camisas)',
  intro:'Una empresa competitiva no puede elegir el precio: lo toma del mercado. Solo elige cuánto producir. Mueve el precio del mercado y mira cuánto produce y cuánto gana.',
  x:{label:'Camisas por día',max:14,ticks:[0,2,4,6,8,10,12,14]}, y:{label:'Dólares por camisa',max:42,ticks:[0,10,20,30,40],fmt:v=>'$'+v},
  controls:[{id:'P',label:'Precio de mercado de una camisa',min:8,max:40,step:.5,value:25,fmt:v=>f$(v,2),hint:'Sube o baja el precio del mercado. Una empresa competitiva toma este precio como un dato: no puede cambiarlo vendiendo más o menos.'}],
  build(s){
    const P=s.P, q=q11(P), tc=q>0?tcS(q):22, ingr=P*q, prof=q>0?ingr-tc:-22, atcq=q>0?atcS(q):0;
    const els=[
     {k:'line',id:'mc',color:'red',w:3.6,pts:curve(mc11,.5,13,60),label:'CM',legend:'Costo marginal (CM)',info:['Costo marginal (CM)','Lo que cuesta producir una camisa más. Sube con la producción (rendimientos decrecientes). <b>La parte del CM por encima del mínimo del CVMe es la curva de oferta de la empresa.</b>']},
     {k:'line',id:'atc',color:'blue',w:3.4,pts:curve(atcS,1,13,60),label:'CTMe',legend:'Costo total medio (CTMe)',info:['Costo total medio (CTMe)','Costo total por camisa. Si el precio está por encima del CTMe, la empresa gana en cada camisa; si está por debajo, pierde.']},
     {k:'line',id:'avc',color:'teal',w:3.2,pts:curve(avcS,1,13,60),label:'CVMe',legend:'Costo variable medio (CVMe)',info:['Costo variable medio (CVMe)','Costo variable por camisa (sin contar los $22 de costo fijo). Si el precio cae debajo de su mínimo, a la empresa le conviene <b>cerrar</b> (perdería más produciendo que sin producir).']},
     {k:'line',id:'pr',color:'amber',w:3,pts:[[0,P],[14,P]],label:{t:'Precio = IM = $'+fn(P,1),at:[0,P],dx:6,dy:-8},legend:'Precio = ingreso marginal',info:['Precio = ingreso marginal','Como la empresa es pequeña frente al mercado, cada camisa extra la vende al mismo precio: el ingreso marginal es igual al precio. Por eso es una línea horizontal.']},
     {k:'pt',id:'be',color:'purple',at:[qATC,pATC],r:6,label:{t:'Equilibrio',dx:8,dy:-8},legend:'Punto de equilibrio (mín. CTMe)',info:['Punto de equilibrio','Con este precio ('+f$(pATC,2)+') el ingreso cubre justo todos los costos: beneficio económico cero, que equivale al beneficio normal.']},
     {k:'pt',id:'sd',color:'gray',at:[qAVC,pAVC],r:6,label:{t:'Cierre',dx:8,dy:16},legend:'Punto de cierre (mín. CVMe)',info:['Punto de cierre','Con un precio menor a '+f$(pAVC,2)+' no se cubren ni los costos variables: conviene cerrar y perder solo el costo fijo.']}];
    if(q>0){
      els.push({k:'area',id:'pf',color:prof>=0?'green':'red',op:.32,pts:[[0,P],[q,P],[q,atcq],[0,atcq]],label:{t:(prof>=0?'Beneficio ':'Pérdida ')+f$(Math.abs(prof),0),at:[q/2,(P+atcq)/2]},legend:prof>=0?'Beneficio económico':'Pérdida económica',info:[prof>=0?'Beneficio económico':'Pérdida económica','Es el rectángulo entre el precio y el CTMe, multiplicado por las camisas producidas: (precio − CTMe) × cantidad = ('+f$(P,2)+' − '+f$(atcq,2)+') × '+fn(q,1)+' = '+f$(prof,1)+'.']});
      els.push({k:'pt',id:'mx',color:'green',at:[q,P],r:8,guides:true,gx:fn(q,1),gy:f$(P,2),label:{t:'Producción óptima',dx:10,dy:-12},legend:'Producción que maximiza el beneficio',info:['Producción que maximiza el beneficio','La empresa produce hasta que <b>el ingreso marginal (precio) iguala al costo marginal</b>. Si produjera menos, perdería camisas que cuestan menos de lo que se venden; si produjera más, cada camisa extra costaría más de lo que ingresa.']});
    }
    let say;
    if(q===0) say=`<p>A ${f$(P,2)} el precio está <b>por debajo del mínimo del CVMe</b> (${f$(pAVC,2)}). La empresa <b>cierra</b>: producir le haría perder más que el costo fijo de $22 que debe pagar de todas formas.</p>`;
    else say=`<p>La empresa produce donde <b>precio = CM</b>: <b>${fn(q,1)} camisas</b>. Ingreso = ${f$(ingr,0)}; costo total = ${f$(tc,0)}.</p><p>${prof>.5?`Obtiene un <b>beneficio económico</b> de ${f$(prof,0)}. Esto atraerá a nuevos competidores.`:prof>-.5?'Beneficio económico <b>cero</b> (beneficio normal): se cubren todos los costos de oportunidad.':`Tiene una <b>pérdida económica</b> de ${f$(-prof,0)}, pero sigue produciendo porque eso pierde menos que cerrar (pierde ${f$(22,0)} si cierra). A largo plazo, saldrá del negocio.`}</p>`;
    return {els,read:[['Producción',fn(q,1)+' camisas','green'],['Beneficio',f$(prof,0),prof>=0?'green':'red'],['Decisión',q===0?'Cerrar':prof>=0?'Producir':'Producir (pierde menos)',q===0?'gray':'amber']],say};
  }
};
FIGS.c11_mkt = {
  title:'Del corto al largo plazo: entrada y salida de empresas (ejemplo ilustrativo)',
  intro:'A la izquierda, el mercado; a la derecha, una empresa típica. Si hay beneficio, entran empresas; si hay pérdidas, salen. Aumenta la demanda y pulsa el botón.',
  panels:[{title:'El mercado',x:{label:'Cantidad de la industria',max:340,ticks:[0,100,200,300]},y:{label:'Precio ($)',max:34,ticks:[0,6,12,18,24,30],fmt:v=>'$'+v},h:330},
          {title:'Una empresa típica',x:{label:'Cantidad de la empresa',max:14,ticks:[0,2,4,6,8,10,12,14]},y:{label:'Precio y costo ($)',max:34,ticks:[0,6,12,18,24,30],fmt:v=>'$'+v},h:330}],
  controls:[
   {id:'a',label:'Demanda del mercado',min:180,max:330,step:10,value:240,fmt:v=>v===240?'inicial':(v>240?'aumento (+':'disminución (')+(v-240)+')',hint:'Subir: más compradores o mejores gustos. Baja: lo contrario. La demanda es Q = a − 10P.'},
   {id:'n',label:'Número de empresas en la industria',min:8,max:44,step:1,value:20,fmt:v=>fn(v,0),hint:'En el corto plazo este número está fijo. En el largo plazo cambia por entrada y salida.'},
   {type:'btn',label:'Dejar que entren o salgan empresas (largo plazo)',act:(st,draw)=>{ const nlr=(st.a-120)/6, n0=st.n, t0=performance.now(); const step=t=>{ const k=Math.min(1,(t-t0)/1200); st.n=n0+(nlr-n0)*k; draw(); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }}],
  build(s){
    const {a,n}=s, P=a/(10+n/2), Q=a-10*P, q=P/2, prof=P*q-(36+q*q);
    const MCf=q=>2*q, ATCf=q=>36/q+q;
    const M=[{k:'line',id:'d',color:'blue',w:3.6,pts:[[0,a/10],[a,0]],label:'Demanda',lp:0,legend:'Demanda del mercado',info:['Demanda del mercado','Cuánto quieren comprar los consumidores a cada precio.']},
      {k:'line',id:'s',color:'red',w:3.6,pts:[[0,0],[Math.min(34*n/2,340),Math.min(34*n/2,340)*2/n]].map(p=>[p[0],p[1]]),label:'Oferta (corto plazo)',lp:1,legend:'Oferta de la industria',info:['Oferta de la industria','Suma, para cada precio, de lo que ofrecen todas las empresas (n × CM de cada una). Más empresas = oferta más a la derecha.']},
      {k:'line',id:'lp',color:'green',dash:'6 5',w:2.4,pts:[[0,12],[340,12]],label:{t:'Precio de largo plazo $12',at:[0,12],dx:6,dy:-8},legend:'Precio de largo plazo',info:['Precio de largo plazo','A largo plazo, con libre entrada y salida, el precio se ajusta hasta ser igual al mínimo del costo medio: $12. Allí el beneficio económico es cero.']},
      {k:'pt',id:'eq',color:'amber',at:[Q,P],r:8,guides:true,gx:fn(Q,0),gy:f$(P,2),label:{t:'Equilibrio',dx:12,dy:-12},legend:'Equilibrio del mercado',info:['Equilibrio del mercado','Precio y cantidad de la industria con '+fn(n,0)+' empresas.']}];
    const Fm=[{k:'line',id:'mc',color:'red',w:3.4,pts:curve(MCf,0,12,30),label:'CM',legend:'Costo marginal de la empresa',info:['Costo marginal','Cuánto cuesta una unidad más. Aquí CM = 2q.']},
      {k:'line',id:'atc',color:'blue',w:3.4,pts:curve(ATCf,1.1,14,60).filter(p=>p[1]<=34),label:'CTMe',legend:'Costo total medio',info:['Costo total medio','Costo por unidad. Su mínimo es $12 con 6 unidades.']},
      {k:'line',id:'pf',color:'amber',w:3,pts:[[0,P],[14,P]],label:{t:'Precio $'+fn(P,2),at:[0,P],dx:6,dy:-8},legend:'Precio del mercado',info:['Precio del mercado','La empresa lo toma como dado.']}];
    if(Math.abs(prof)>.2) Fm.push({k:'area',id:'pr',color:prof>0?'green':'red',op:.35,pts:[[0,P],[q,P],[q,ATCf(q)],[0,ATCf(q)]],legend:prof>0?'Beneficio económico':'Pérdida económica',info:[prof>0?'Beneficio económico':'Pérdida económica','Por cada empresa: '+f$(prof,1)+' al día. '+(prof>0?'Es una señal de que conviene entrar a este negocio.':'Es una señal de que conviene salir.')]});
    Fm.push({k:'pt',id:'fq',color:'green',at:[q,P],r:7,guides:true,legend:false,info:['Producción de la empresa','Produce donde precio = CM: '+fn(q,1)+' unidades.']});
    const nlr=(a-120)/6;
    return {panels:[M,Fm],read:[['Precio',f$(P,2),'amber'],['Empresas',fn(n,1)+' (equilibrio LP: '+fn(nlr,1)+')','gray'],['Beneficio por empresa',f$(prof,1),prof>.2?'green':prof<-.2?'red':'gray']],
     say:Math.abs(prof)<.2?'<p><b>Equilibrio de largo plazo:</b> precio = costo medio mínimo ($12), beneficio económico cero. Nadie quiere entrar ni salir.</p><p>Aumenta o disminuye la demanda para ver cómo se llega a un nuevo equilibrio.</p>':prof>0?`<p>Cada empresa gana <b>${f$(prof,1)}</b>: hay beneficio económico. Atrae a nuevos entrantes: la oferta aumentará, el precio bajará y el beneficio desaparecerá. Pulsa el botón para verlo.</p>`:`<p>Cada empresa pierde <b>${f$(-prof,1)}</b>. Algunas saldrán: la oferta disminuirá, el precio subirá y las pérdidas desaparecerán. Pulsa el botón.</p>`,sayTitle:'Qué señal envía el mercado'};
  }
};
CHAPTERS.push({id:11,title:'Competencia perfecta',
teaser:'Tomadores de precios, maximización del beneficio, oferta, entrada y salida y eficiencia.',
bigq:'¿Qué hace una empresa que no puede fijar el precio de lo que vende? ¿Y por qué, a largo plazo, ninguna empresa competitiva gana más que lo normal?',
learn:['Explicar qué es la competencia perfecta y por qué sus empresas son tomadoras de precios.','Determinar la producción que maximiza el beneficio (IM = CM) y cuándo cerrar.','Derivar la oferta de la empresa y de la industria.','Explicar el equilibrio de largo plazo con entrada y salida y su eficiencia.'],
html:`
<h2>1. ¿Qué es la competencia perfecta?</h2>
<p>La <b>competencia perfecta</b> es una estructura de mercado en la que:</p>
<ul>
<li>Hay <b>muchas empresas</b>, cada una vendiendo un producto idéntico.</li>
<li>Hay <b>muchos compradores</b>.</li>
<li>No hay <b>barreras a la entrada</b>: cualquiera puede entrar o salir.</li>
<li>Las empresas y los compradores están bien informados.</li>
</ul>
<p>La consecuencia es que cada empresa es <b>tomadora de precios</b>: es tan pequeña respecto al mercado que no puede cambiar el precio. Si cobra más que el precio de mercado, no vende nada (hay muchos sustitutos idénticos); si cobra menos, no tiene sentido porque puede vender todo al precio de mercado. Ejemplos aproximados: el trigo, el maíz, algunos servicios sencillos.</p>
<h3>Beneficio económico e ingreso</h3>
<p>La empresa maximiza su <b>beneficio económico</b> = ingreso total (IT) − costo total (CT). Hay tres conceptos de ingreso:</p>
${eqn('Ingreso total = precio × cantidad &nbsp;&nbsp; Ingreso marginal (IM) = ΔIT ÷ ΔQ &nbsp;&nbsp; Ingreso medio = IT ÷ Q','En competencia perfecta: IM = precio = ingreso medio.')}
<p>El <b>ingreso marginal</b> es el ingreso por vender una unidad más. Para una empresa tomadora de precios es igual al precio: la curva de demanda que enfrenta es una línea <b>horizontal</b> (perfectamente elástica).</p>

<h2>2. Las decisiones de la empresa en competencia perfecta</h2>
<p>La empresa debe decidir cuánto producir. Usa la lógica marginal:</p>
<ul>
<li>Si el <b>ingreso marginal es mayor que el costo marginal</b> (IM &gt; CM), una unidad más agrega más ingreso que costo: conviene producirla.</li>
<li>Si <b>IM &lt; CM</b>, esa unidad cuesta más de lo que da: conviene producir menos.</li>
<li>El beneficio es máximo cuando <b>IM = CM</b>, es decir, <b>precio = CM</b>.</li>
</ul>
<p>El libro usa una fábrica de camisas con $25 como precio de mercado. Su costo total es $22 con cero producción, y la producción óptima es 9 camisas, donde el beneficio es máximo ($42). Si produce 4 o 12, el beneficio es cero (punto de equilibrio).</p>
${fig('c11_firm')}
<h3>Beneficios y pérdidas en el corto plazo</h3>
<p>Para saber si hay beneficio, compara el precio con el costo total medio en la producción óptima:</p>
<ul>
<li><b>Precio &gt; CTMe:</b> beneficio económico positivo.</li>
<li><b>Precio = CTMe:</b> beneficio cero (punto de equilibrio).</li>
<li><b>Precio &lt; CTMe pero ≥ mín. CVMe:</b> pérdida, pero se <b>sigue produciendo</b> (se pierde menos que cerrando, pues los costos fijos se pagan igual).</li>
<li><b>Precio &lt; mín. CVMe:</b> <b>cerrar</b> (producir es perder más que el costo fijo).</li>
</ul>
${warn('<p>Cerrar «temporalmente» no es lo mismo que salir de la industria. Si cierras, pierdes tu costo fijo. Si vendes algo, aunque pierdas, puedes contribuir a pagar parte de los costos fijos. Mientras el ingreso cubra los costos variables, conviene seguir produciendo en el corto plazo.</p>')}
<h3>La curva de oferta de la empresa y de la industria</h3>
<p>La <b>curva de oferta de corto plazo de la empresa</b> es la parte de su curva de <b>costo marginal</b> que está por encima del mínimo del CVMe: para cada precio, produce donde precio = CM. Y la <b>oferta de la industria</b> se obtiene sumando horizontalmente las ofertas de todas las empresas.</p>

<h2>3. Producción, precio y beneficios en competencia perfecta</h2>
<p>Con la oferta de la industria y la demanda del mercado se determina el precio. Si el precio sube, las empresas se anticipan con beneficios; si cae, con pérdidas. En el <b>corto plazo</b>, el número de empresas es fijo.</p>
<h3>Ajustes a largo plazo: entrada y salida</h3>
<p>Con libre entrada y salida:</p>
<ul>
<li>Si las empresas ganan <b>beneficios económicos</b>, <b>entran</b> nuevas empresas: la oferta aumenta, el precio baja y el beneficio se reduce hasta desaparecer.</li>
<li>Si las empresas sufren <b>pérdidas</b>, algunas <b>salen</b>: la oferta cae, el precio sube y las pérdidas desaparecen.</li>
</ul>
<p>El mercado llega a un <b>equilibrio de largo plazo</b> cuando el beneficio económico es cero: el precio es igual al <b>costo total medio mínimo</b>.</p>
${fig('c11_mkt')}
<h3>Un cambio permanente en la demanda</h3>
<p>Si aumenta la demanda de un bien: <b>(1)</b> el precio sube (corto plazo) y las empresas ganan beneficios; <b>(2)</b> atraídas por ellos, entran empresas; <b>(3)</b> el precio vuelve a su nivel original en el largo plazo y la producción de la industria aumentó gracias a más empresas. Si la demanda cae ocurre lo opuesto.</p>
<p>El precio de largo plazo puede variar si hay <b>economías externas</b> (la industria crece y los costos de cada empresa bajan, por ejemplo, mejor infraestructura y proveedores especializados, como en Silicon Valley) o <b>deseconomías externas</b> (al crecer la industria suben los costos de todas, por congestión o por encarecerse un recurso limitado). El <b>cambio tecnológico</b> baja los costos: el nuevo equilibrio es a un precio menor y con más producción; las empresas que no adoptan la nueva tecnología quedan fuera.</p>

<h2>4. Competencia y eficiencia</h2>
<p>En el equilibrio de largo plazo de competencia perfecta se logra la <b>eficiencia</b> en sentido de capítulo 5:</p>
<ul>
<li>El <b>consumidor</b> elige donde el beneficio marginal (precio) iguala al costo marginal de producir.</li>
<li>La <b>empresa</b> produce donde precio = CM.</li>
<li>Por lo tanto, <b>BM = CM</b>: no hay pérdida irrecuperable.</li>
<li>Además, la producción se hace al <b>costo medio mínimo</b> (eficiencia productiva).</li>
</ul>
<p>Éste es el mejor argumento a favor de los mercados competitivos. Como los siguientes capítulos muestran, cuando la competencia falla (monopolio, oligopolio, externalidades) este resultado ya no se garantiza.</p>
`,
terms:[['Competencia perfecta','Muchas empresas, producto idéntico, libre entrada y salida.'],['Tomador de precios','Empresa que no puede influir en el precio de mercado.'],['Ingreso marginal','Ingreso adicional por una unidad más. En competencia perfecta = precio.'],['Producción que maximiza el beneficio','Cantidad donde IM = CM.'],['Punto de equilibrio','Precio igual al mínimo del CTMe: beneficio económico cero.'],['Punto de cierre','Precio igual al mínimo del CVMe: debajo conviene cerrar.'],['Entrada y salida','Las empresas entran si hay beneficios y salen si hay pérdidas.'],['Equilibrio de largo plazo','Precio = mínimo del CTMe; beneficio económico cero.'],['Economías externas','Al crecer la industria bajan los costos de todas las empresas.']],
quiz:[
 {q:'Una empresa competitiva maximiza su beneficio cuando:',o:['Precio = costo marginal','Precio = costo fijo','Costo medio es mínimo','Ingreso total es máximo'],a:0,why:'Precio = IM en competencia perfecta; el beneficio se maximiza cuando IM = CM, es decir, precio = CM.'},
 {q:'Si el precio cae por debajo del mínimo del costo variable medio, la empresa:',o:['Cierra temporalmente','Produce lo mismo','Entra otra empresa','Sube el precio'],a:0,why:'Producir pierde más que el costo fijo; cerrando solo pierde el costo fijo.'},
 {q:'En una industria perfectamente competitiva hay beneficios económicos positivos. A largo plazo:',o:['Entran empresas, baja el precio y el beneficio se reduce a cero','Salen empresas y sube el precio','El beneficio sigue siendo positivo','El precio sube'],a:0,why:'Los beneficios atraen nuevas empresas hasta que el precio iguala al costo medio mínimo.'},
 {q:'La curva de oferta de corto plazo de la empresa competitiva es:',o:['Su costo marginal por encima del mínimo del CVMe','Su costo fijo medio','Una línea horizontal','Su costo total medio'],a:0,why:'A cada precio produce donde precio = CM; por debajo del mínimo del CVMe, cierra.'}]});
