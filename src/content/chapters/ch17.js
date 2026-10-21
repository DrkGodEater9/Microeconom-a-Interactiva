/** Capítulo 17 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, clamp, bisect } from '../../engine/math.js';
import { f$, fn, pct } from '../../engine/format.js';
import { ex, eqn, fig } from '../../engine/blocks.js';

FIGS.c17_lab = {
  title:'Demanda de trabajo de una empresa: ¿a cuántos contrata? (ejemplo ilustrativo)',
  intro:'Una empresa contrata a un trabajador más mientras lo que él aporta en ingreso supere su salario. Ese aporte se llama <b>valor del producto marginal</b>.',
  x:{label:'Trabajadores contratados',max:10,ticks:[0,2,4,6,8,10]}, y:{label:'Dólares por trabajador',max:36,ticks:[0,6,12,18,24,30,36],fmt:v=>'$'+v},
  controls:[
   {id:'p',label:'Precio al que se vende el producto',min:1,max:3,step:.1,value:2,fmt:v=>f$(v,2),hint:'Si el producto se vende más caro, cada unidad que produce el trabajador vale más: la demanda de trabajo sube.'},
   {id:'w',label:'Salario por trabajador',min:2,max:30,step:1,value:12,fmt:v=>f$(v,0),hint:'Un salario más alto reduce cuántos trabajadores conviene contratar (te mueves por la curva).'}],
  build(s){
    const MRP=L=>s.p*(12-1.2*L), Ls=clamp((12-s.w/s.p)/1.2,0,10);
    const els=[
     {k:'area',id:'ex',color:'green',op:.3,pts:[[0,MRP(0)],[Ls,MRP(Ls)],[Ls,s.w],[0,s.w]],legend:'Ganancia sobre el salario',info:['Ganancia por trabajador contratado','Cada trabajador hasta '+fn(Ls,1)+' aporta más ingreso que su salario. La zona verde es el beneficio que deja contratarlos.']},
     {k:'line',id:'mrp',color:'blue',w:3.8,pts:[[0,MRP(0)],[10,MRP(10)]],label:'VPM = demanda de trabajo',legend:'Valor del producto marginal (demanda de trabajo)',info:['Valor del producto marginal (VPM)','Ingreso extra que produce un trabajador adicional: precio × producto marginal. Baja por los rendimientos decrecientes. <b>Es la curva de demanda de trabajo de la empresa.</b>']},
     {k:'line',id:'w',color:'red',w:3.4,pts:[[0,s.w],[10,s.w]],label:{t:'Salario',at:[10,s.w],dx:-6,dy:-8,anchor:'end'},legend:'Salario de mercado',info:['Salario','Lo que cuesta cada trabajador. La empresa lo toma como dado.']},
     {k:'pt',id:'o',color:'green',at:[Ls,s.w],r:8,guides:true,label:{t:'Contratación óptima',dx:10,dy:-12},legend:'Contratación óptima (VPM = salario)',info:['Contratación óptima','La empresa contrata hasta que el ingreso que aporta el último trabajador iguala su salario: '+fn(Ls,1)+' trabajadores.']}];
    return {els,read:[['Trabajadores',fn(Ls,1),'green']],say:`<p>Con el producto a ${f$(s.p,2)} y salario de ${f$(s.w,0)}, conviene contratar <b>${fn(Ls,1)}</b> trabajadores. Más allá, cada uno cuesta más de lo que aporta.</p>`};
  }
};
FIGS.c17_mkt = {
  title:'El mercado de trabajo: salario y empleo de equilibrio (ejemplo ilustrativo)',
  intro:'Las empresas demandan trabajo; los hogares lo ofrecen. Mueve las curvas y mira qué ocurre con el salario y el empleo.',
  x:{label:'Horas de trabajo (millones)',max:20,ticks:[0,5,10,15,20]}, y:{label:'Salario por hora ($)',max:24,ticks:[0,4,8,12,16,20,24],fmt:v=>'$'+v},
  controls:[
   {id:'d',label:'Cambio en la demanda (productividad, precio del producto)',min:-4,max:4,step:.5,value:0,fmt:v=>v?(v>0?'+':'')+v:'sin cambio',hint:'Más productividad o más demanda del producto: las empresas quieren más trabajo a cada salario.'},
   {id:'o',label:'Cambio en la oferta (población, preferencias)',min:-4,max:4,step:.5,value:0,fmt:v=>v?(v>0?'+':'')+v:'sin cambio',hint:'Más población activa o más gente que quiere trabajar: se ofrece más trabajo a cada salario.'}],
  build(s){
    const L=(16+s.d+s.o)/2, W=20+s.d-L;
    const els=[
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,20+s.d],[20,s.d]],label:'Demanda',lp:0,legend:'Demanda de trabajo',info:['Demanda de trabajo','Suma de los VPM de todas las empresas.']},
     {k:'line',id:'o',color:'red',w:3.6,pts:[[0,4-s.o],[20,24-s.o]],label:'Oferta',lp:1,legend:'Oferta de trabajo',info:['Oferta de trabajo','Cuántas horas ofrecen los hogares a cada salario.']},
     {k:'pt',id:'e',color:'green',at:[L,W],r:8,guides:true,label:{t:'Equilibrio',dx:12,dy:-12},legend:'Salario y empleo de equilibrio',info:['Equilibrio','Salario '+f$(W,2)+' y '+fn(L,1)+' millones de horas.']}];
    return {els,read:[['Salario',f$(W,2),'green'],['Horas',fn(L,1)+' M','blue']],say:`<p>El salario de equilibrio es <b>${f$(W,2)}</b> por hora con <b>${fn(L,1)}</b> millones de horas. ${s.d>0?'Más demanda de trabajo sube salario y empleo. ':s.d<0?'Menos demanda de trabajo baja salario y empleo. ':''}${s.o>0?'Más oferta baja el salario y sube el empleo. ':s.o<0?'Menos oferta sube el salario y baja el empleo.':''}</p>`};
  }
};
FIGS.c17_rent = {
  title:'Renta económica: lo que se cobra por encima de lo necesario (ejemplo ilustrativo)',
  intro:'Cuando la oferta no puede aumentar (tierra, un talento único), todo el pago por encima del mínimo para ofrecerla es renta.',
  x:{label:'Cantidad del factor',max:20,ticks:[0,5,10,15,20]}, y:{label:'Precio del factor ($)',max:40,ticks:[0,10,20,30,40],fmt:v=>'$'+v},
  controls:[
   {id:'e',label:'Qué tan elástica es la oferta (0 = fija)',min:0,max:5,step:.25,value:0,fmt:v=>v===0?'fija (vertical)':fn(v,2),hint:'Si la oferta es fija, todo el pago es renta. Si es muy elástica, casi todo es costo de oportunidad.'},
   {id:'a',label:'Demanda del factor',min:20,max:36,step:1,value:28,fmt:v=>v,hint:'Más demanda sube el precio; con oferta fija, aumenta la renta.'}],
  build(s){
    const e=s.e, a=s.a;
    let Qe,Pe;
    if(e===0){Qe=10;Pe=a-10;}else{ const f=Q=>(a-Q)-(10+(Q-10)/e); Qe=bisect(f,0,20); Pe=a-Qe; }
    const sp=e===0?[[10,0],[10,40]]:null;
    const s2=e===0?sp:curve(Q=>10+(Q-10)/e,0,20,40).filter(p=>p[1]>=0&&p[1]<=40);
    const rentPts=e===0?[[0,0],[Qe,0],[Qe,Pe],[0,Pe]]:[[0,Pe],[Qe,Pe],...curve(Q=>10+(Q-10)/e,Qe,0,20).filter(p=>p[1]>=0)];
    const rent=e===0?Qe*Pe:(()=>{let t=0;const n=100;for(let i=0;i<n;i++){const q=Qe*(i+.5)/n;t+=Math.max(0,Pe-(10+(q-10)/e))*Qe/n;}return t;})();
    const els=[
     {k:'area',id:'r',color:'green',op:.3,pts:rentPts,legend:'Renta económica',info:['Renta económica','Es lo que recibe el dueño del factor por encima de lo mínimo que habría aceptado. Con oferta fija es todo el pago.']},
     {k:'line',id:'s',color:'red',w:3.6,pts:s2,label:'Oferta',lp:1,legend:'Oferta',info:['Oferta del factor','Muestra el precio mínimo al que se ofrece cada cantidad (su costo de oportunidad).']},
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,a],[a,0]].map(p=>p),label:'Demanda',lp:0,legend:'Demanda',info:['Demanda del factor','Cuánto valora cada unidad quien la contrata.']},
     {k:'pt',id:'e',color:'amber',at:[Qe,Pe],r:8,guides:true,legend:'Equilibrio',label:{t:'Equilibrio',dx:10,dy:-10},info:['Equilibrio','Precio '+f$(Pe,2)+' y cantidad '+fn(Qe,1)+'.']}];
    return {els,read:[['Precio',f$(Pe,2),'amber'],['Renta total',f$(rent,0),'green'],['Parte del pago que es renta',pct(rent/(Pe*Qe)),'green']],say:`<p>El precio es ${f$(Pe,2)} y la renta total ${f$(rent,0)}: el <b>${pct(rent/(Pe*Qe))}</b> del pago. ${e===0?'Con oferta fija, el precio lo fija solo la demanda y todo es renta (por eso gravar la tierra no cambia cuánta tierra hay).':''}</p>`};
  }
};
CHAPTERS.push({id:17,title:'Oferta y demanda en los mercados de factores',
teaser:'Salarios, intereses y rentas: cuánto se paga a trabajo, capital y tierra y por qué.',
bigq:'¿Por qué un cirujano gana más que un cajero, y por qué los ingresos de la tierra o del capital siguen leyes parecidas a las de los precios de bienes?',
learn:['Explicar la demanda de un factor como valor del producto marginal.','Analizar el mercado de trabajo y su equilibrio.','Distinguir capital, interés y renta económica.','Entender qué diferencia a los ingresos por trabajo, capital, tierra y capacidad empresarial.'],
html:`
<h2>1. Los mercados de factores</h2>
<p>Los factores de producción (trabajo, capital, tierra y capacidad empresarial) se compran y venden en <b>mercados de factores</b>. Sus precios son: <b>salario</b> (trabajo), <b>interés</b> (capital), <b>renta</b> (tierra) y <b>beneficio</b> (capacidad empresarial). Se determinan con oferta y demanda, igual que en los mercados de bienes. Pero ahora los <b>hogares ofrecen</b> y las <b>empresas demandan</b>.</p>
<p>Una diferencia clave: la demanda de un factor es una <b>demanda derivada</b>: se demanda no por sí misma, sino por lo que permite producir.</p>
<h2>2. El mercado de trabajo</h2>
<h3>Demanda de trabajo</h3>
<p>Una empresa contrata a un trabajador adicional si lo que aporta supera lo que cuesta:</p>
${eqn('Valor del producto marginal (VPM) = precio × producto marginal del trabajo','La curva de VPM es la curva de demanda de trabajo de la empresa. Contrata hasta que VPM = salario.')}
${fig('c17_lab')}
<p>Lo que desplaza la demanda de trabajo: el <b>precio del producto</b>, la <b>productividad</b> (tecnología, capital, educación) y los precios de otros factores.</p>
<h3>Oferta de trabajo</h3>
<p>Viene de las decisiones de trabajo y ocio (capítulo 8). Aumenta con el salario (a menos que domine el efecto ingreso) y se desplaza por cambios de población, preferencias y capacidades.</p>
<h3>Equilibrio</h3>
<p>El salario de equilibrio iguala la cantidad demandada con la ofrecida. Un aumento de productividad eleva la demanda y sube salarios y empleo; un aumento de la población activa reduce el salario.</p>
${fig('c17_mkt')}
<p>Las diferencias de salario entre ocupaciones se explican por diferencias en <b>productividad</b>, <b>capital humano</b> (educación, experiencia), <b>condiciones desagradables o riesgosas</b> y <b>escasez</b> de ciertas habilidades.</p>
<h2>3. Capital e interés</h2>
<p>El <b>capital</b> son las máquinas, edificios y herramientas. Su precio es el <b>interés</b>. Se invierte en capital si el rendimiento esperado supera el interés. Para comparar dinero hoy con dinero futuro se usa el <b>valor presente</b>: un peso dentro de un año vale hoy menos de un peso. La oferta de capital depende de cuánto ahorra la gente: ahorrar es dejar de consumir hoy; el interés es la recompensa por esperar.</p>
${ex('Valor presente','<p>Si la tasa de interés es 10% anual, $110 dentro de un año valen hoy $100 ($110 ÷ 1.10). Una inversión que promete $110 en un año solo conviene si cuesta menos de $100.</p>')}
<h2>4. Tierra y renta económica</h2>
<p>La tierra (y los recursos naturales) tiene una oferta casi fija. Su precio de mercado lo fija la demanda. Los economistas llaman <b>renta económica</b> a lo que se cobra por encima de lo mínimo necesario para ofrecer el recurso. Un jugador estrella con talento único o un terreno en el centro de la ciudad reciben mucha renta. Para los recursos <b>no renovables</b> (petróleo), el precio refleja también el valor de guardarlo para el futuro.</p>
${fig('c17_rent')}
`,
terms:[['Demanda derivada','Demanda de un factor por lo que permite producir.'],['Valor del producto marginal','Precio × producto marginal. Es la demanda de trabajo.'],['Capital humano','Conocimientos y habilidades de las personas.'],['Interés','Precio del uso del capital.'],['Valor presente','Valor de hoy de una cantidad que se recibirá en el futuro.'],['Renta económica','Pago por encima del mínimo necesario para ofrecer un factor.']],
quiz:[
 {q:'Una empresa contrata trabajadores hasta que:',o:['VPM = salario','Salario = 0','Producto total es máximo','Precio = costo fijo'],a:0,why:'Mientras un trabajador aporte más ingreso que su salario, conviene contratarlo.'},
 {q:'Un aumento de la productividad de los trabajadores:',o:['Aumenta la demanda de trabajo','Disminuye la demanda de trabajo','Disminuye la oferta','No cambia nada'],a:0,why:'El producto marginal sube y el VPM también: se desplaza la demanda.'},
 {q:'Con oferta de tierra perfectamente inelástica, la renta económica es:',o:['Todo el pago','Cero','La mitad','Igual al costo'],a:0,why:'No habría menos tierra aunque el pago fuera menor, así que todo es renta.'},
 {q:'$220 dentro de un año con interés de 10% valen hoy:',o:['$200','$242','$220','$198'],a:0,why:'220 ÷ 1.10 = 200.'}]});
