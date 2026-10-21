/** Capítulo 14 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { warn, fig, figAgain } from '../../engine/blocks.js';

FIGS.c14_nat = {
  title:'Regulación de un monopolio natural (ejemplo ilustrativo)',
  intro:'Un monopolio natural tiene un costo fijo enorme y un costo marginal bajo: su costo medio baja siempre. Los reguladores pueden elegir entre tres reglas y ninguna es perfecta.',
  x:{label:'Cantidad (unidades por día)',max:22,ticks:[0,4,8,12,16,20]}, y:{label:'Precio y costo ($)',max:22,ticks:[0,4,8,12,16,20],fmt:v=>'$'+v},
  controls:[{id:'r',type:'seg',label:'Regla de regulación',value:'n',options:[['n','Sin regulación'],['a','Precio = costo medio'],['c','Precio = costo marginal']]}],
  build(s){
    const ATC=Q=>45/Q+2, MC=2;
    const R={n:{Q:9,P:11,t:'Sin regulación',d:'El monopolio produce donde IM = CM (9 unidades) y cobra $11. Gana un beneficio de $36, pero produce poco: pérdida irrecuperable.'},
             a:{Q:15,P:5,t:'Precio = costo medio (regla de la tasa de rendimiento)',d:'El regulador fija el precio donde la demanda corta al costo total medio: 15 unidades a $5. La empresa cubre todos sus costos (beneficio normal). Se produce más, aunque queda una pérdida irrecuperable pequeña.'},
             c:{Q:18,P:2,t:'Precio = costo marginal (regla de la eficiencia)',d:'Se produce la cantidad eficiente (18). Pero a $2 el precio queda por debajo del costo medio ($4.5): la empresa <b>pierde $45</b> (su costo fijo) y debería recibir un subsidio para no cerrar.'}}[s.r];
    const Q=R.Q,P=R.P,atc=ATC(Q),prof=(P-atc)*Q;
    const dwl=s.r==='n'?.5*9*9:s.r==='a'?.5*3*3:0;
    const els=[
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,20],[20,0]],label:'Demanda',lp:0,legend:'Demanda',info:['Demanda','Muestra la cantidad que se demanda a cada precio. P = 20 − Q.']},
     {k:'line',id:'im',color:'purple',w:3,pts:[[0,20],[10,0]],label:'IM',lp:1,legend:'Ingreso marginal',info:['Ingreso marginal','IM = 20 − 2Q.']},
     {k:'line',id:'cm',color:'red',w:3.6,pts:[[0,MC],[22,MC]],label:{t:'CM = $2',at:[22,MC],dx:-6,dy:-8,anchor:'end'},legend:'Costo marginal',info:['Costo marginal','Cada unidad adicional cuesta $2. Es bajo y constante.']},
     {k:'line',id:'ct',color:'teal',w:3.6,pts:curve(ATC,2.2,22,80),label:'CTMe',lp:60,legend:'Costo total medio (siempre decreciente)',info:['Costo total medio','Incluye el costo fijo de $45: CTMe = 45/Q + 2. Baja al repartirse el costo fijo en más unidades. Como siempre está por encima del CM, una empresa que cobre el CM perdería dinero.']}];
    if(Math.abs(prof)>.1) els.push({k:'area',id:'pf',color:prof>0?'green':'red',op:.32,pts:[[0,P],[Q,P],[Q,atc],[0,atc]],legend:prof>0?'Beneficio del monopolio':'Pérdida de la empresa',info:[prof>0?'Beneficio':'Pérdida',(prof>0?'Beneficio':'Pérdida')+' económico: ('+f$(P,2)+' − '+f$(atc,2)+') × '+Q+' = '+f$(prof,1)+'.']});
    if(dwl>0){ const pts=s.r==='n'?[[9,11],[18,2],[9,2]]:[[15,5],[18,2],[15,2]]; els.push({k:'area',id:'dwl',color:'amber',op:.65,pts,legend:'Pérdida irrecuperable',info:['Pérdida irrecuperable','Unidades que valen más de lo que cuestan pero no se producen: '+f$(dwl,1)+'.']}); }
    els.push({k:'pt',id:'e',color:'green',at:[Q,P],r:8,guides:true,label:{t:'Resultado',dx:12,dy:-12},legend:'Resultado con esta regla',info:[R.t,R.d]});
    return {els,read:[['Cantidad',Q,'blue'],['Precio',f$(P,2),'green'],['Beneficio de la empresa',f$(prof,0),prof>=0?'green':'red'],['Pérdida irrecuperable',f$(dwl,1),dwl>0?'amber':'green']],say:'<p><b>'+R.t+'.</b> '+R.d+'</p><p>Éste es el dilema: la regla eficiente (precio = CM) hace quebrar a la empresa; la que cubre costos (precio = CTMe) deja una pequeña ineficiencia; y sin regulación se abusa del poder de mercado.</p>'};
  }
};
FIGS.c14_merge = {
  title:'Calculadora: ¿cuánto sube la concentración con una fusión?',
  intro:'Dos empresas se fusionan. El IHH sube el doble del producto de sus participaciones (2 × a × b). Observa cuánto cambia y qué tipo de mercado resulta.',
  noplot:true,
  controls:[{id:'a',label:'Participación de la empresa A',min:2,max:40,step:1,value:20,fmt:v=>v+'%'},{id:'b',label:'Participación de la empresa B',min:2,max:40,step:1,value:15,fmt:v=>v+'%'},{id:'n',label:'Número de empresas pequeñas iguales en el resto',min:2,max:30,step:1,value:6,fmt:v=>v,hint:'El resto del mercado se reparte por igual entre ellas.'}],
  build(s){
    const a=s.a,b=Math.min(s.b,100-a-2), rest=100-a-b, n=s.n, oth=n*Math.pow(rest/n,2);
    const h0=a*a+b*b+oth, h1=Math.pow(a+b,2)+oth, d=h1-h0;
    const cl=h1<1000?'mercado muy competitivo':h1<=1800?'concentración moderada':'mercado concentrado (oligopolio)';
    const alerta=h1>1800&&d>50?'<p><b>Alerta:</b> el mercado resultante es concentrado y la fusión sube el IHH más de 50 puntos. Las autoridades suelen examinar a fondo (o impedir) una fusión así.</p>':h1>=1000&&d>100?'<p><b>Atención:</b> el mercado queda con concentración moderada y la fusión sube el IHH más de 100 puntos: podría examinarse.</p>':'<p>Es poco probable que esta fusión preocupe a la autoridad de competencia.</p>';
    return {read:[['IHH antes',fn(h0,0),'gray'],['IHH después',fn(h1,0),'amber'],['Aumento (2ab)',fn(d,0),'red'],['Tipo después',cl,'purple']],sayTitle:'Cómo se interpreta',
     say:`<p>IHH antes ≈ ${fn(h0,0)}. Al fusionarse A (${a}%) y B (${b}%), pasan a pesar ${a+b}%. El aumento es 2 × ${a} × ${b} = <b>${fn(2*a*b,0)}</b>, y el IHH queda en <b>${fn(h1,0)}</b> (${cl}).</p>${alerta}<p style="color:var(--muted);font-size:13px">Umbrales usados (referencia de las guías estadounidenses que el libro describe; pueden cambiar con el tiempo): IHH &lt; 1,000 competitivo; 1,000–1,800 moderado; &gt; 1,800 concentrado.</p>`};
  }
};
CHAPTERS.push({id:14,title:'Regulación y ley antimonopolio',
teaser:'La teoría económica del gobierno, la regulación de monopolios naturales y cárteles, y las leyes de competencia.',
bigq:'Cuando los mercados fallan, el gobierno interviene. Pero ¿lo hace siempre en favor de todos, o a veces a favor de grupos con intereses especiales? ¿Y cómo se evita que las empresas abusen de su poder?',
learn:['Distinguir las teorías del interés público y de la captura (interés especial) del gobierno.','Explicar cómo se regula un monopolio natural y un cártel, y los dilemas de cada regla.','Explicar para qué sirven las leyes antimonopolio y revisar los debates principales.','Analizar fusiones con el IHH.'],
html:`
<h2>1. La teoría económica del gobierno</h2>
<p>El gobierno interviene en los mercados por varias razones: regular monopolios y oligopolios, suministrar <b>bienes públicos</b> (como la defensa), controlar el uso de <b>recursos comunes</b> (pesca, bosques), corregir <b>externalidades</b> (contaminación) y <b>redistribuir</b> el ingreso. La pregunta de este capítulo: ¿cómo decide el gobierno qué hacer?</p>
<h3>Interés público vs. interés especial</h3>
<ul>
<li><b>Teoría del interés público:</b> el gobierno busca la <b>eficiencia</b>: corregir las fallas del mercado para maximizar el bienestar social. Los políticos son «benevolentes».</li>
<li><b>Teoría del interés especial / captura:</b> los políticos, funcionarios y reguladores actúan en <b>su propio interés</b>. Los grupos organizados con mucho que ganar (una industria regulada) presionan, y los reguladores terminan <b>capturados</b>: la regulación acaba protegiendo a las empresas en lugar de a los consumidores.</li>
</ul>
<h3>La elección pública y el mercado político</h3>
<p>La <b>elección pública</b> analiza la política con las herramientas de la economía: los actores buscan su propio interés y responden a incentivos.</p>
<ul>
<li><b>Votantes:</b> demandan políticas. Un votante «racionalmente ignorante» gasta poco en informarse porque su voto casi nunca decide una elección.</li>
<li><b>Políticos:</b> ofrecen políticas para obtener votos y mantenerse en el poder.</li>
<li><b>Burócratas:</b> quieren aumentar su presupuesto y su poder.</li>
</ul>
<p>Cuando los <b>beneficios</b> de una política se concentran en pocos (por ejemplo, un subsidio a una industria) y los <b>costos</b> se dispersan entre muchos (todos los contribuyentes), el grupo beneficiado presiona con fuerza y los costos casi nadie los vigila. El resultado: políticas que benefician a minorías organizadas. El <b>equilibrio político</b> es el punto en el que nadie puede mejorar con un cambio.</p>

<h2>2. Regulación de monopolio y oligopolio</h2>
<p>La <b>regulación</b> es un conjunto de reglas administradas por un organismo gubernamental que controlan precios, cantidades, entrada y calidad en una industria. Tiene dos teorías (la del interés público y la de la captura) y se puede evaluar con una pregunta: <i>¿los precios y la cantidad regulados se parecen a los de un mercado competitivo o a los de un monopolio?</i></p>
${figAgain('c12_mono')}
<h3>El monopolio natural</h3>
<p>Un monopolio natural tiene economías de escala tan grandes que una sola empresa abastece el mercado a un costo menor que varias. Sin regulación, cobraría precios altos. Tres opciones:</p>
<ul>
<li><b>Precio = costo marginal:</b> eficiente, pero la empresa pierde dinero (el CM está por debajo del costo medio). Se necesita un subsidio.</li>
<li><b>Precio = costo medio</b> (regulación de la tasa de rendimiento): la empresa obtiene beneficio normal. Pero hay una pequeña pérdida irrecuperable, y como se le reembolsan los costos, tiene <b>poca presión para reducirlos</b>. Se infla el costo.</li>
<li><b>Precios máximos (price cap):</b> se fija un tope al precio que puede subir cada año (ajustado por inflación menos una meta de productividad). Da incentivo a reducir costos, porque la empresa se queda con las ganancias de eficiencia.</li>
</ul>
${figAgain('c10_lr')}
${fig('c14_nat')}
<h3>Regulación de cárteles</h3>
<p>A veces la regulación ayuda a que las empresas actúen como cártel: fija precios que benefician a la industria (taxis con licencias, aerolíneas reguladas antes de la desregulación). La teoría de la captura predice que la regulación puede ser <b>un cártel con apoyo del gobierno</b>. La evidencia de muchos países es que la <b>desregulación</b> (aerolíneas, transporte, telecomunicaciones) redujo precios, aunque también trajo ajustes difíciles.</p>
${warn('<p>Tanto la teoría del interés público como la de la captura explican parte de la realidad. Algunas regulaciones se parecen a las ideas del interés público (regular un monopolio natural de agua); otras, a las de la captura (restricciones que protegen a unos pocos productores).</p>','Ningún modelo explica todo')}

<h2>3. Ley antimonopolios o de competencia económica</h2>
<p>Las <b>leyes antimonopolio</b> (o leyes de competencia) prohíben las prácticas que reducen la competencia: <b>fijación de precios entre competidores</b>, <b>abuso de posición dominante</b> y <b>fusiones</b> que crean poder de mercado. El principio básico es sencillo: mantener un mercado competitivo para que se obtenga eficiencia.</p>
<h3>Cuatro debates de políticas de competencia</h3>
<ul>
<li><b>Mantenimiento del precio de reventa:</b> un fabricante obliga a los minoristas a cobrar un precio mínimo. ¿Es abuso (fijar precios) o una forma de asegurar servicio y evitar que otro minorista se «cuelgue» del esfuerzo de venta de otros?</li>
<li><b>Ventas atadas:</b> obligar a comprar un producto junto con otro (software y navegador). ¿Es una forma de extender un monopolio o una forma eficiente de ofrecer paquetes?</li>
<li><b>Precios predatorios:</b> bajar el precio por debajo del costo para sacar a los rivales y luego subirlo. Es difícil de probar; muchas veces es simplemente competencia agresiva y beneficia al consumidor.</li>
<li><b>Fusiones:</b> las que aumentan el poder de mercado reducen la competencia; las que generan economías de escala pueden bajar los costos.</li>
</ul>
<h3>Fusiones</h3>
<p>Las autoridades usan el <b>índice Herfindahl-Hirschman (IHH)</b> como un primer filtro: un mercado con IHH menor a 1,000 se considera competitivo, y a partir de ciertos niveles revisan con más cuidado las fusiones que aumentan mucho el IHH. La fusión de dos empresas con participaciones <i>a</i> y <i>b</i> sube el IHH en <b>2ab</b>.</p>
${figAgain('c9_hhi')}
${fig('c14_merge')}
<h3>En México y en el mundo</h3>
<p>El libro describe la creación de la <b>Comisión Federal de Competencia (CFC)</b> y la Ley Federal de Competencia Económica de 1992, que regula las <b>prácticas monopólicas</b> (absolutas y relativas) y las <b>fusiones</b>. Menciona casos como el de Estados Unidos contra Microsoft (venta atada del navegador) y casos mexicanos de precedente. <i>(Nota fuera del libro: en 2014 la CFC fue sustituida por la Comisión Federal de Competencia Económica, COFECE, y las telecomunicaciones pasaron a otro regulador.)</i></p>
<p>Los países de América Latina tienen sus propias autoridades de competencia, con leyes y capacidades diferentes. Una constante es la tensión que ya conoces: ¿actúa la autoridad por interés público o es presionada por intereses especiales?</p>
`,
terms:[['Teoría del interés público','El gobierno busca la eficiencia y el bienestar social.'],['Teoría de la captura','El regulador acaba al servicio de la industria que regula.'],['Elección pública','Análisis económico de la política: votantes, políticos y burócratas buscan su propio interés.'],['Regulación de la tasa de rendimiento','El precio se fija para cubrir costos y dar una ganancia normal.'],['Precio máximo (price cap)','Tope al precio. Da incentivos a reducir costos.'],['Ley antimonopolio','Prohíbe prácticas que reducen la competencia.'],['Venta atada','Condicionar la venta de un producto a la compra de otro.'],['Precio predatorio','Precio bajo el costo para eliminar rivales.']],
quiz:[
 {q:'Según la teoría de la captura, la regulación termina:',o:['Beneficiando a la industria regulada','Maximizando el bienestar social siempre','Eliminando la industria','Bajando los precios'],a:0,why:'Los productores, organizados y con mucho que ganar, ejercen presión; el regulador acaba sirviendo sus intereses.'},
 {q:'Si se obliga a un monopolio natural a cobrar precio = costo marginal:',o:['Es eficiente pero la empresa pierde dinero','Gana beneficios enormes','Produce menos','Sube el precio'],a:0,why:'El CM está por debajo del costo medio (por el costo fijo), así que el precio no cubre los costos totales.'},
 {q:'Dos empresas con 25% y 15% de participación se fusionan. El IHH aumenta en:',o:['750','40','375','1,600'],a:0,why:'El aumento es 2 × 25 × 15 = 750.'},
 {q:'Un impuesto o subsidio que beneficia a pocos y cuesta poco a cada uno de muchos tiende a:',o:['Aprobarse, porque los beneficiados presionan y los demás casi no lo notan','Rechazarse por los votantes','Eliminarse pronto','Ser eficiente'],a:0,why:'Beneficios concentrados y costos dispersos favorecen a los grupos de interés (elección pública).'}]});
