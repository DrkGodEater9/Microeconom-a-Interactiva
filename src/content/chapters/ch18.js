/** Capítulo 18 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve, bisect } from '../../engine/math.js';
import { fn, pct } from '../../engine/format.js';
import { def, warn, fig, figAgain } from '../../engine/blocks.js';

FIGS.c18_lorenz = {
  title:'Curva de Lorenz y coeficiente de Gini',
  intro:'Ordena a la población de la más pobre a la más rica y mira qué parte del ingreso total recibe cada fracción. Cuanto más se curva la línea, más desigualdad.',
  x:{label:'% acumulado de la población (de la más pobre a la más rica)',max:100,ticks:[0,20,40,60,80,100],fmt:v=>v+'%'}, y:{label:'% acumulado del ingreso',max:100,ticks:[0,20,40,60,80,100],fmt:v=>v+'%'},
  controls:[
   {id:'G',label:'Desigualdad inicial (Gini del ingreso de mercado)',min:0,max:.8,step:.01,value:.5,fmt:v=>fn(v,2),hint:'0 = todos ganan igual; cerca de 1 = casi todo para unos pocos. Gini ≈ 0.25–0.30 en países nórdicos y ≈ 0.45–0.55 en muchos países latinoamericanos (cifras aproximadas).'},
   {id:'t',label:'Redistribución (impuestos y transferencias)',min:0,max:.6,step:.05,value:0,fmt:v=>pct(v),hint:'Cobrar a los ricos y transferir a los pobres acerca la curva a la línea de igualdad, aunque puede reducir incentivos a producir.'}],
  build(s){
    const G=s.G*(1-s.t), gk=k=>1-2*(1/k-1/(Math.exp(k)-1)), kk=G<.005?0:bisect(z=>gk(z)-G,.05,40), L=x=>kk===0?x:100*(Math.exp(kk*x/100)-1)/(Math.exp(kk)-1);
    const q=[1,2,3,4,5].map(i=>L(i*20)-L((i-1)*20));
    const els=[
     {k:'area',id:'a',color:'amber',op:.3,pts:[[0,0],...curve(L,0,100,50),[100,100]],label:{t:'Área A',at:[62,38]},legend:'Área entre la línea de igualdad y Lorenz (A)',info:['Área A (desigualdad)','Es el espacio entre la igualdad perfecta y la distribución real. Gini = A ÷ (A + B). Cuanto mayor, más desigualdad.']},
     {k:'area',id:'b',color:'blue',op:.18,pts:[[0,0],...curve(L,0,100,50),[100,0]],label:{t:'Área B',at:[76,16]},legend:'Área bajo la curva de Lorenz (B)',info:['Área B','El espacio bajo la curva de Lorenz. Con igualdad perfecta A = 0.']},
     {k:'line',id:'eq',color:'gray',dash:'6 5',w:2.4,pts:[[0,0],[100,100]],label:{t:'Igualdad perfecta',at:[40,40],dx:-6,dy:-8,anchor:'end'},legend:'Línea de igualdad perfecta',info:['Línea de igualdad','Si el 20% más pobre recibiera 20% del ingreso, el 40% recibiera 40%, etc.']},
     {k:'line',id:'lz',color:'blue',w:3.8,pts:curve(L,0,100,60),label:'Curva de Lorenz',lp:30,legend:'Curva de Lorenz',info:['Curva de Lorenz','Para cada % de población (más pobre primero), el % del ingreso total que recibe. Siempre queda debajo de la línea de igualdad.']},
     {k:'pt',id:'p20',color:'red',at:[20,L(20)],r:6,guides:true,legend:'El 20% más pobre',info:['El 20% más pobre','Recibe '+fn(L(20),1)+'% del ingreso total.']},
     {k:'pt',id:'p80',color:'green',at:[80,L(80)],r:6,guides:true,legend:'El 80% más pobre',info:['El 80% más pobre','Recibe '+fn(L(80),1)+'% del ingreso; el 20% más rico recibe el '+fn(100-L(80),1)+'% restante.']}];
    return {els,read:[['Gini',fn(G,2),'amber'],['20% más pobre',fn(q[0],1)+'%','red'],['20% más rico',fn(q[4],1)+'%','green'],['Razón rico/pobre',fn(q[4]/Math.max(.01,q[0]),1)+' veces','gray']],
     say:`<p>El coeficiente de Gini es <b>${fn(G,2)}</b>. Por quintiles recibe: ${q.map(v=>fn(v,1)+'%').join(' · ')} (del más pobre al más rico).</p><p>${s.t>0?'La redistribución redujo el Gini de '+fn(s.G,2)+' a '+fn(G,2)+'. ':''}Gini = A ÷ (A + B): 0 es igualdad total y 1 desigualdad total.</p>`};
  }
};
CHAPTERS.push({id:18,title:'Desigualdad económica',
teaser:'Distribución del ingreso y la riqueza, curva de Lorenz, Gini y redistribución.',
bigq:'¿Cuánta desigualdad hay, por qué existe y qué se puede hacer sin dañar los incentivos a trabajar y producir?',
learn:['Medir la desigualdad con la curva de Lorenz y el coeficiente de Gini.','Explicar sus causas.','Describir los instrumentos de redistribución y su costo en eficiencia.'],
html:`
<h2>1. Medir la desigualdad</h2>
<p>La <b>distribución del ingreso</b> muestra qué parte del ingreso total recibe cada grupo. Una forma sencilla es dividir la población en cinco partes iguales (<b>quintiles</b>) y ver qué porcentaje recibe cada una. Pero para ver todo de una vez se usa la <b>curva de Lorenz</b>.</p>
${def('Coeficiente de Gini','<p>Mide el área entre la línea de igualdad perfecta y la curva de Lorenz, dividida entre el área total bajo la línea de igualdad. Va de 0 (igualdad total) a 1 (un solo hogar tiene todo). Desde esta edición el libro lo usa para analizar tendencias.</p>')}
${fig('c18_lorenz')}
<h3>Ingreso y riqueza</h3>
<p>El <b>ingreso</b> es lo que se recibe por periodo; la <b>riqueza</b> es lo que se posee (casas, ahorros, acciones). La riqueza suele estar <b>más concentrada</b> que el ingreso. Y la desigualdad cambia según se mida antes o después de impuestos y transferencias.</p>
<h2>2. ¿Por qué existe desigualdad?</h2>
${figAgain('c17_mkt')}
<ul>
<li><b>Diferencias de capital humano:</b> educación, experiencia y habilidades llevan a salarios distintos.</li>
<li><b>Discriminación</b> por género, raza o lugar de origen.</li>
<li><b>Herencias</b> de riqueza y de oportunidades.</li>
<li><b>Mercados de superestrellas:</b> unos pocos talentos con enorme alcance de mercado ganan mucho más.</li>
<li><b>Cambio tecnológico y globalización:</b> aumentan el premio de las habilidades más demandadas.</li>
<li><b>Suerte</b> y diferencias en la propensión a ahorrar y a arriesgar.</li>
</ul>
<h2>3. Redistribución</h2>
<p>Los gobiernos redistribuyen con: <b>impuestos progresivos</b> (pagan un porcentaje mayor los que más ganan), <b>transferencias</b> (programas de asistencia, pensiones, subsidios) y <b>provisión pública</b> de educación y salud. Hay una <b>gran disyuntiva</b>: redistribuir reduce la desigualdad, pero los impuestos reducen incentivos y generan pérdida irrecuperable (capítulo 6). Cuánto redistribuir es una decisión de valores (capítulo 5: Rawls, utilitarismo, Nozick), no solo técnica. Prueba el control de redistribución en la figura.</p>
${figAgain('c6_tax')}
${warn('<p>Un Gini alto no dice por qué hay desigualdad ni si es injusta; es solo una medida. Hay que analizar sus causas (oportunidades vs. esfuerzo) y las políticas que la afectan.</p>')}
`,
terms:[['Quintil','Una quinta parte de la población.'],['Curva de Lorenz','Gráfica del % acumulado del ingreso frente al % acumulado de la población.'],['Coeficiente de Gini','Mide la desigualdad entre 0 y 1.'],['Impuesto progresivo','El porcentaje aumenta con el ingreso.'],['Transferencia','Pago del gobierno sin contraprestación.'],['Capital humano','Conocimientos y habilidades.']],
quiz:[
 {q:'Si la curva de Lorenz coincide con la línea de 45°:',o:['Hay igualdad perfecta','Hay máxima desigualdad','Gini = 1','No hay ingreso'],a:0,why:'Cada porcentaje de la población recibe el mismo porcentaje del ingreso: Gini = 0.'},
 {q:'Un Gini más alto significa:',o:['Más desigualdad','Menos desigualdad','Más ingreso promedio','Menos pobreza siempre'],a:0,why:'El área entre la igualdad y la curva de Lorenz es mayor.'},
 {q:'La riqueza suele estar:',o:['Más concentrada que el ingreso','Menos concentrada','Igual distribuida','No se mide'],a:0,why:'La riqueza acumulada y heredada se concentra aún más que el ingreso anual.'},
 {q:'La «gran disyuntiva» de la redistribución es que:',o:['Reduce desigualdad pero puede reducir eficiencia','Siempre aumenta la eficiencia','No tiene costos','Elimina la pobreza sin costo'],a:0,why:'Los impuestos y transferencias alteran incentivos y producen pérdidas de eficiencia.'}]});
