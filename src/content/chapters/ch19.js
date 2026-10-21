/** Capítulo 19 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve } from '../../engine/math.js';
import { fn, pct } from '../../engine/format.js';
import { warn, fig } from '../../engine/blocks.js';

FIGS.c19_risk = {
  title:'Aversión al riesgo: utilidad esperada y prima de riesgo (ejemplo ilustrativo)',
  intro:'La utilidad de la riqueza crece cada vez más despacio (utilidad marginal decreciente). Por eso una persona prefiere un resultado seguro a una apuesta con el mismo valor esperado.',
  x:{label:'Riqueza ($ miles)',max:100,ticks:[0,20,40,60,80,100]}, y:{label:'Utilidad (útiles)',max:10.5,ticks:[0,2,4,6,8,10]},
  controls:[
   {id:'w1',label:'Riqueza si sale mal',min:10,max:60,step:5,value:20,fmt:v=>'$'+v},
   {id:'w2',label:'Riqueza si sale bien',min:50,max:100,step:5,value:90,fmt:v=>'$'+v},
   {id:'p',label:'Probabilidad de que salga bien',min:.1,max:.9,step:.05,value:.5,fmt:v=>pct(v),hint:'Mayor probabilidad de éxito sube la riqueza esperada.'}],
  build(s){
    const U=w=>Math.sqrt(w), {w1,w2,p}=s, EW=p*w2+(1-p)*w1, EU=p*U(w2)+(1-p)*U(w1), CE=EU*EU, prima=EW-CE;
    const els=[
     {k:'line',id:'u',color:'blue',w:3.8,pts:curve(U,0,100,60),label:'Utilidad',legend:'Utilidad de la riqueza',info:['Utilidad de la riqueza','Crece, pero cada dólar extra suma menos. Esa curvatura es la <b>aversión al riesgo</b>.']},
     {k:'line',id:'ch',color:'purple',dash:'6 5',w:2.8,pts:[[w1,U(w1)],[w2,U(w2)]],legend:'Cuerda: utilidad esperada de la apuesta',info:['Cuerda de la apuesta','Cada punto de esta línea es la utilidad esperada de la apuesta para distintas probabilidades. Queda <b>debajo</b> de la curva de utilidad porque la curva es cóncava.']},
     {k:'pt',id:'a',color:'ink',at:[w1,U(w1)],r:5,legend:false,info:['Si sale mal','Riqueza $'+w1+' mil.']},
     {k:'pt',id:'b',color:'ink',at:[w2,U(w2)],r:5,legend:false,info:['Si sale bien','Riqueza $'+w2+' mil.']},
     {k:'pt',id:'eu',color:'purple',at:[EW,EU],r:7,guides:true,gx:fn(EW,1),gy:fn(EU,2),label:{t:'Utilidad esperada',dx:8,dy:20},legend:'Utilidad esperada de la apuesta',info:['Utilidad esperada','Promedio de las utilidades, ponderado por la probabilidad: '+fn(EU,2)+'.']},
     {k:'pt',id:'ue',color:'blue',at:[EW,U(EW)],r:7,label:{t:'Utilidad de la riqueza esperada',dx:-8,dy:-12,anchor:'end'},legend:'Utilidad de recibir la riqueza esperada con certeza',info:['Riqueza esperada con certeza','Si recibieras $'+fn(EW,1)+' mil seguros, tu utilidad sería '+fn(U(EW),2)+': mayor que la de la apuesta.']},
     {k:'line',id:'ce',color:'green',w:5,pts:[[CE,0],[EW,0]],label:{t:'Prima de riesgo',at:[(CE+EW)/2,0],dy:-10},legend:'Prima de riesgo',info:['Prima de riesgo','Es lo que estarías dispuesto a perder (de la riqueza esperada) para evitar la incertidumbre: $'+fn(prima,1)+' mil. Es lo que pagas por un seguro.']},
     {k:'pt',id:'cep',color:'green',at:[CE,EU],r:7,guides:true,gx:fn(CE,1),legend:'Equivalente de certeza',info:['Equivalente de certeza','Cantidad segura que te da la misma utilidad que la apuesta: $'+fn(CE,1)+' mil.']}];
    return {els,read:[['Riqueza esperada','$'+fn(EW,1)+' mil','blue'],['Equivalente de certeza','$'+fn(CE,1)+' mil','green'],['Prima de riesgo','$'+fn(prima,1)+' mil','amber']],
     say:`<p>La apuesta vale en promedio <b>$${fn(EW,1)} mil</b>, pero para ti equivale solo a <b>$${fn(CE,1)} mil seguros</b>. La diferencia, <b>$${fn(prima,1)} mil</b>, es la prima de riesgo: lo que pagarías por eliminar la incertidumbre. De ahí nacen los seguros.</p><p>Cuanto más se curva la utilidad (más aversión) o más separados están los resultados, mayor la prima.</p>`};
  }
};
FIGS.c19_lemon = {
  title:'Información asimétrica: el mercado de autos usados («limones»; ejemplo ilustrativo)',
  intro:'Los vendedores conocen la calidad de su auto; los compradores no, y pagan según la calidad promedio. Los dueños de autos buenos se retiran y el promedio cae.',
  x:{label:'Calidad del auto (valor para su dueño, $ miles)',max:100,ticks:[0,20,40,60,80,100]}, y:{max:1,ticks:[0],fmt:()=>''},
  controls:[
   {id:'m',label:'Cuánto más valora un comprador un auto que su dueño',min:1,max:2.4,step:.05,value:1.5,fmt:v=>'×'+fn(v,2),hint:'Si los compradores valoran poco más que los vendedores (< ×2), el mercado se desmorona. Si valoran más del doble, no.'},
   {id:'r',label:'Ronda de ajuste',min:0,max:10,step:1,value:3,fmt:v=>v,hint:'En cada ronda los compradores ofrecen según el promedio de los autos que quedan.'}],
  build(s){
    let top=100, price=s.m*50; for(let i=0;i<s.r;i++){ top=Math.min(100,price); price=s.m*top/2; }
    const sold=Math.min(100,top);
    const els=[
     {k:'area',id:'sale',color:'green',op:.3,pts:[[0,0],[sold,0],[sold,1],[0,1]],legend:'Autos que siguen a la venta',info:['Autos a la venta','Autos cuyos dueños aceptan el precio actual (su valor es menor que lo que ofrecen): '+fn(sold,0)+'% del rango de calidad.']},
     {k:'area',id:'out',color:'red',op:.2,pts:[[sold,0],[100,0],[100,1],[sold,1]],legend:'Autos que se retiran',info:['Autos que se retiran','Sus dueños, que saben que valen más que el precio, no los venden.']},
     {k:'line',id:'pr',color:'amber',w:4,pts:[[price,0],[price,1]],label:{t:'Precio $'+fn(price,0),at:[price,1],dy:14,anchor:'middle'},legend:'Precio que ofrecen los compradores',info:['Precio ofrecido','Los compradores pagan según la calidad promedio de lo que esperan encontrar: ×'+fn(s.m,2)+' el promedio.']}];
    const fin=s.m<2?'se desmorona: el precio y los autos disponibles caen ronda tras ronda':'se mantiene: todos los autos se venden';
    return {els,read:[['Precio ofrecido','$'+fn(price,0)+' mil','amber'],['Autos que siguen a la venta',fn(sold,0)+'%','green']],
     say:`<p>Ronda <b>${s.r}</b>: precio <b>$${fn(price,0)} mil</b>; quedan en el mercado los autos de calidad hasta ${fn(sold,0)}.</p><p>Con ×${fn(s.m,2)} el mercado ${fin}. Es la <b>selección adversa</b>: la información oculta expulsa a los buenos. Soluciones: <b>garantías</b>, <b>inspecciones</b> certificadas, <b>reputación</b> de las marcas y <b>señales</b> de calidad.</p>`};
  }
};
CHAPTERS.push({id:19,title:'Incertidumbre e información',
teaser:'Riesgo, seguros, información asimétrica, selección adversa y riesgo moral.',
bigq:'Casi todas las decisiones se toman sin saber lo que ocurrirá y sin conocer toda la información. ¿Cómo se adaptan los mercados y funciona aquí la «mano invisible»?',
learn:['Explicar la aversión al riesgo con utilidad esperada.','Describir cómo funcionan los seguros y la diversificación.','Explicar información asimétrica: selección adversa y riesgo moral.','Describir señales y otras soluciones.'],
html:`
<h2>1. Incertidumbre y riesgo</h2>
<p>La <b>incertidumbre</b> es no saber qué ocurrirá. El <b>riesgo</b> es cuando se pueden asignar probabilidades a los resultados. La <b>utilidad esperada</b> es el promedio de las utilidades de los resultados posibles, ponderado por su probabilidad.</p>
<p>Como la utilidad marginal de la riqueza es decreciente, perder $10 000 duele más de lo que alegra ganar $10 000. Eso hace que la mayoría de las personas sean <b>aversas al riesgo</b>.</p>
${fig('c19_risk')}
<h2>2. Seguros y diversificación</h2>
<ul>
<li><b>Seguro:</b> pagas una prima pequeña y segura a cambio de que te cubran una pérdida grande e incierta. Funciona porque la empresa aseguradora, al reunir a muchas personas, puede predecir bien el total de siniestros (ley de los grandes números).</li>
<li><b>Diversificación:</b> «no pongas todos los huevos en la misma canasta». Repartir una inversión en activos distintos reduce el riesgo total.</li>
</ul>
<h2>3. Información asimétrica</h2>
<p>Hay <b>información asimétrica</b> cuando una de las partes de una transacción sabe más que la otra. Genera dos problemas clásicos:</p>
<ul>
<li><b>Selección adversa:</b> la información oculta se da <i>antes</i> del trato. Ejemplo: quienes saben que están enfermos compran más seguro médico, y la aseguradora atrae a los peores riesgos. Ejemplo clásico de Akerlof: autos usados («limones»).</li>
<li><b>Riesgo moral:</b> la acción oculta ocurre <i>después</i> del trato. Ejemplo: una persona asegurada contra robo se cuida menos de que le roben.</li>
</ul>
${fig('c19_lemon')}
<h3>Cómo se enfrentan</h3>
<ul>
<li><b>Señales:</b> acciones costosas que revelan calidad (títulos universitarios, garantías, marcas).</li>
<li><b>Selección de clientes y deducibles:</b> la aseguradora recoge información, pide revisiones médicas y hace que el asegurado pague una parte (deducible, coaseguro).</li>
<li><b>Monitoreo e incentivos:</b> contratos que ligan pagos con resultados (relación con el problema agente-principal del capítulo 9).</li>
<li><b>Reputación e intermediarios</b> que certifican calidad.</li>
</ul>
<h3>¿Funciona la mano invisible?</h3>
<p>Con información incompleta, los mercados pueden ser ineficientes: los seguros pueden no ofrecerse, los créditos racionarse o los buenos productos desaparecer. Pero muchas instituciones (garantías, marcas, regulaciones) surgen justamente para mitigar esos problemas.</p>
${warn('<p>Selección adversa = problema <i>antes</i> de firmar (información oculta de tipo). Riesgo moral = problema <i>después</i> de firmar (acción oculta). Pregúntate siempre en qué momento ocurre el ocultamiento.</p>')}
`,
terms:[['Incertidumbre','No saber qué ocurrirá.'],['Utilidad esperada','Promedio de utilidades ponderado por probabilidades.'],['Aversión al riesgo','Preferir un resultado seguro a una apuesta con el mismo valor esperado.'],['Prima de riesgo','Lo que se paga para evitar el riesgo.'],['Información asimétrica','Una parte sabe más que la otra.'],['Selección adversa','Los peores riesgos son los que más participan.'],['Riesgo moral','Cambio de conducta después de asegurarse.'],['Señal','Acción costosa que revela calidad.']],
quiz:[
 {q:'Una persona aversa al riesgo prefiere:',o:['$50 seguros a una apuesta con valor esperado de $50','La apuesta','Es indiferente siempre','Perder dinero'],a:0,why:'Por la utilidad marginal decreciente, la utilidad esperada de la apuesta es menor que la del valor esperado seguro.'},
 {q:'Quien sabe que está muy enfermo compra más seguro médico. Esto es:',o:['Selección adversa','Riesgo moral','Diversificación','Señalización'],a:0,why:'La información oculta existe antes de contratar y atrae a los peores riesgos.'},
 {q:'Alguien asegurado cuida menos su auto. Esto es:',o:['Riesgo moral','Selección adversa','Aversión al riesgo','Una señal'],a:0,why:'Cambia su conducta después de contratar el seguro.'},
 {q:'Una garantía de fábrica funciona como:',o:['Una señal de calidad','Un impuesto','Un subsidio','Una cuota'],a:0,why:'Solo un vendedor de producto bueno puede ofrecerla sin perder dinero.'}]});
