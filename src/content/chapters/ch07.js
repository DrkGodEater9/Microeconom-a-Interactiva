/** Capítulo 7 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { linspace, curve, clamp } from '../../engine/math.js';
import { f$, fn } from '../../engine/format.js';
import { def, warn, tip, eqn, fig, figAgain } from '../../engine/blocks.js';

FIGS.c7_ut = {
  title:'Utilidad total y utilidad marginal (ejemplo ilustrativo)',
  intro:'La <b>utilidad total</b> es la satisfacción acumulada; la <b>utilidad marginal</b> es la satisfacción de la <i>última</i> unidad. Mueve la cantidad y observa cómo la segunda es la pendiente de la primera.',
  panels:[{title:'Utilidad total (satisfacción acumulada)',x:{label:'Cantidad consumida',max:10,ticks:[0,2,4,6,8,10]},y:{label:'Útiles',max:70,ticks:[0,20,40,60]},h:310},
          {title:'Utilidad marginal (satisfacción de la última unidad)',x:{label:'Cantidad consumida',max:10,ticks:[0,2,4,6,8,10]},y:{label:'Útiles por unidad adicional',min:-4,max:18,ticks:[-4,0,4,8,12,16]},h:310}],
  controls:[{id:'q',label:'Cantidad consumida',min:0,max:10,step:.1,value:3,fmt:v=>fn(v,1)+' unidades',hint:'Piensa en películas al mes, o en rebanadas de pizza en una comida: ¿cuánto te aporta una más?'}],
  build(s){
    const UT=q=>16*q-q*q, UM=q=>16-2*q, q=s.q, m=UM(q), t=UT(q);
    const A=[{k:'line',id:'ut',color:'blue',w:3.8,pts:curve(UT,0,10,70),label:'UT',legend:'Utilidad total (UT)',info:['Utilidad total (UT)','La satisfacción <b>total</b> que obtienes consumiendo cierta cantidad. Sube mientras cada unidad adicional te aporte algo positivo, y cae si ya te hace daño (comer de más).']},
      {k:'line',id:'tg',color:'red',w:4,pts:[[Math.max(0,q-1.6),t+m*(Math.max(0,q-1.6)-q)],[Math.min(10,q+1.6),t+m*(Math.min(10,q+1.6)-q)]],legend:'Pendiente = utilidad marginal',info:['La pendiente de la UT es la utilidad marginal','La inclinación de la curva en este punto es '+fn(m,1)+'. Esa pendiente <b>es</b> la utilidad marginal: cuánto sube la UT por una unidad más.']},
      {k:'pt',id:'p',color:'ink',at:[q,t],r:7,guides:true,gx:fn(q,1),gy:fn(t,1),legend:false,info:['Tu punto','Con '+fn(q,1)+' unidades la utilidad total es '+fn(t,1)+' útiles.']},
      {k:'pt',id:'sat',color:'amber',at:[8,64],r:6,label:{t:'Saturación',dx:-6,dy:-10,anchor:'end'},legend:'Punto de saturación',info:['Punto de saturación','Con 8 unidades la utilidad total es máxima (64). Una unidad más ya no aporta satisfacción: la utilidad marginal es cero.']}];
    const pos=Math.min(q,8);
    const B=[{k:'area',id:'ar',color:'blue',op:.28,pts:[[0,16],[pos,UM(pos)],[pos,0],[0,0]],legend:'Área = utilidad total',info:['Área bajo la UM = utilidad total','Si sumas la satisfacción de cada unidad (todas las barritas bajo la curva) obtienes la utilidad total acumulada. Aquí: '+fn(t,1)+'.']}];
    if(q>8) B.push({k:'area',id:'neg',color:'red',op:.4,pts:[[8,0],[q,UM(q)],[q,0]],legend:'Satisfacción negativa',info:['Utilidad marginal negativa','Pasada la saturación, cada unidad extra te hace sentir peor: resta utilidad total.']});
    B.push({k:'line',id:'um',color:'red',w:3.8,pts:[[0,16],[10,-4]],label:'UM',legend:'Utilidad marginal (UM)',info:['Utilidad marginal (UM)','La satisfacción adicional de la <b>última</b> unidad. Baja a medida que consumes más: es el <b>principio de la utilidad marginal decreciente</b>. La primera pizza sabe mejor que la quinta.']});
    B.push({k:'line',id:'z',color:'gray',w:1.4,pts:[[0,0],[10,0]],legend:false});
    B.push({k:'pt',id:'pm',color:'red',at:[q,m],r:7,guides:true,gx:fn(q,1),gy:fn(m,1),legend:false,info:['Utilidad marginal en tu punto','La unidad número '+fn(q,1)+' te aporta '+fn(m,1)+' útiles.']});
    return {panels:[A,B],read:[['Utilidad total',fn(t,1),'blue'],['Utilidad marginal',fn(m,1),m>=0?'red':'amber']],
     say:`<p>Consumes <b>${fn(q,1)}</b> unidades: tienes <b>${fn(t,1)}</b> útiles en total, y la última unidad te dio <b>${fn(m,1)}</b>.</p>`+(q<7.9?'<p>Fíjate: la utilidad total sigue subiendo, pero cada vez <b>menos</b> (la pendiente baja). Ese es el efecto «saciedad».</p>':q<8.1?'<p><b>Saturación:</b> la utilidad total llegó a su máximo y la marginal es cero. Una más no suma nada.</p>':'<p>Pasaste la saturación: la utilidad marginal es <b>negativa</b> y la total empieza a caer. Comer de más se vuelve desagradable.</p>')};
  }
};
const MUA=(q,pA)=>(20-2*q)/pA;
FIGS.c7_eq = {
  title:'Maximizar la utilidad: igualar la utilidad marginal por cada dólar',
  intro:'Con un presupuesto fijo, tienes que repartirlo entre películas y hamburguesas. Cada dólar debe ir adonde da más satisfacción: en el mejor reparto, un dólar extra rinde lo mismo en las dos cosas (ejemplo ilustrativo).',
  x:{label:'Películas por mes (el resto del dinero va a hamburguesas)',max:20,ticks:[0,4,8,12,16,20]}, y:{label:'Útiles por dólar gastado',max:12,ticks:[0,2,4,6,8,10,12]},
  controls:[
   {id:'q',label:'Películas que eliges comprar',min:0,max:20,step:.5,value:3,fmt:v=>fn(v,1),hint:'Al comprar más películas te quedan menos dólares para hamburguesas.'},
   {id:'pA',label:'Precio de cada película',min:3,max:8,step:.5,value:4,fmt:v=>f$(v,2),hint:'Una película más cara rinde menos satisfacción por dólar: la curva azul baja y conviene comprar menos películas.'},
   {id:'M',label:'Tu ingreso mensual',min:20,max:60,step:2,value:40,fmt:v=>f$(v,0),hint:'Con más ingreso compras más de todo (los dos bienes son normales).'}],
  build(s){
    const {pA,M}=s; const qmax=M/pA;
    const MUB=q=>10-.5*(M-pA*q);
    const qs=clamp((20/pA-10+.5*M)/(.5*pA+2/pA),0,qmax), eq=MUA(qs,pA);
    const q=clamp(s.q,0,qmax), a=MUA(q,pA), b=MUB(q);
    const ptsA=curve(x=>MUA(x,pA),0,Math.min(qmax,10),50).filter(p=>p[1]>=0&&p[1]<=12);
    const ptsB=curve(MUB,0,qmax,60).filter(p=>p[1]>=0&&p[1]<=12&&M-pA*p[0]>=0);
    const els=[
     {k:'line',id:'a',color:'blue',w:3.6,pts:ptsA,label:'Películas',legend:'Útiles por dólar en películas',info:['Utilidad marginal por dólar: películas','Cuánta satisfacción te da <b>el último dólar</b> gastado en películas. Es la utilidad marginal de la película dividida entre su precio. Baja al ir más al cine (cada función te emociona menos).']},
     {k:'line',id:'b',color:'red',w:3.6,pts:ptsB,label:'Hamburguesas',legend:'Útiles por dólar en hamburguesas',info:['Utilidad marginal por dólar: hamburguesas','Cuánta satisfacción te da el último dólar en hamburguesas. <b>Sube hacia la derecha</b> porque, cuantas más películas compras, menos hamburguesas te quedan y cada una vale más para ti.']},
     {k:'pt',id:'opt',color:'green',at:[qs,eq],r:8,guides:true,gx:fn(qs,1)+' pelis',gy:fn(eq,1),label:{t:'Óptimo',dx:12,dy:-12},legend:'Reparto óptimo',info:['Reparto que maximiza la utilidad','Aquí un dólar adicional rinde <b>lo mismo</b> en películas que en hamburguesas ('+fn(eq,1)+' útiles). Si cambias dinero de un bien al otro, pierdes más de lo que ganas. Es la condición «UM/precio igual en todos los bienes».']},
     {k:'pt',id:'ca',color:'blue',at:[q,a],r:6,legend:false,info:['Rendimiento del último dólar en películas','Con '+fn(q,1)+' películas, el último dólar da '+fn(a,1)+' útiles.']},
     {k:'pt',id:'cb',color:'red',at:[q,b],r:6,legend:false,info:['Rendimiento del último dólar en hamburguesas','Con tus '+fn(M-pA*q,1)+' dólares restantes en hamburguesas, el último dólar da '+fn(b,1)+' útiles.']},
     {k:'line',id:'cv',color:'purple',dash:'4 4',w:2.2,pts:[[q,0],[q,Math.max(a,b,0)]],legend:false}];
    const hb=M-pA*q;
    let msg;
    if(Math.abs(a-b)<.25) msg='<p><b>¡Cerca del óptimo!</b> Un dólar rinde casi igual en ambos bienes.</p>';
    else if(a>b) msg=`<p>Un dólar en <b>películas</b> te da ${fn(a,1)} útiles; en hamburguesas, solo ${fn(b,1)}. Conviene <b>mover dinero hacia películas</b> (comprar más).</p>`;
    else msg=`<p>Un dólar en <b>hamburguesas</b> te da ${fn(b,1)} útiles; en películas, solo ${fn(a,1)}. Conviene <b>mover dinero hacia hamburguesas</b> (comprar menos películas).</p>`;
    return {els,read:[['Reparto óptimo',fn(qs,1)+' pelis y '+fn(M-pA*qs,1)+' $ en hamburg.','green'],['Tu reparto',fn(q,1)+' pelis, '+f$(hb,0)+' en hamburg.','purple'],['Útiles por $ (óptimo)',fn(eq,1),'gray']],
     say:`<p>Tu presupuesto es ${f$(M,0)}. Cada película cuesta ${f$(pA,2)}, así que puedes comprar hasta ${fn(qmax,1)}. ${msg}</p><p>El óptimo ocurre donde se cruzan las dos curvas: ${fn(qs,1)} películas y el resto en hamburguesas. Cambia el precio de la película y verás cómo se mueve el cruce: de ahí sale la curva de demanda.</p>`};
  }
};
FIGS.c7_dem = {
  title:'De la utilidad marginal a la curva de demanda',
  intro:'Cada punto de la demanda es una elección óptima a un precio distinto. Cambia el precio (moverse por la curva) o el ingreso (desplazar la curva).',
  x:{label:'Películas por mes',max:20,ticks:[0,4,8,12,16,20]}, y:{label:'Precio por película ($)',max:10,ticks:[0,2,4,6,8,10],fmt:v=>'$'+v},
  controls:[
   {id:'pA',label:'Precio de la película',min:3,max:9,step:.25,value:4,fmt:v=>f$(v,2),hint:'Al subir el precio, la cantidad óptima baja: te mueves por la curva.'},
   {id:'M',label:'Tu ingreso mensual',min:20,max:60,step:2,value:40,fmt:v=>f$(v,0),hint:'Al subir el ingreso, a cada precio compras más: la curva entera se desplaza hacia la derecha.'}],
  build(s){
    const f=(pA,M)=>Math.max(0,(20/pA-10+.5*M)/(.5*pA+2/pA));
    const mk=M=>linspace(3,9.5,60).map(pA=>[f(pA,M),pA]).filter(p=>p[0]<=20);
    const q=f(s.pA,s.M), els=[];
    if(s.M!==40) els.push({k:'line',id:'d0',color:'blue',dash:'6 5',w:2.6,pts:mk(40),legend:'Demanda con ingreso de $40',info:['Demanda original (ingreso $40)','Así era la demanda antes de cambiar el ingreso.']});
    els.push({k:'line',id:'d',color:s.M!==40?'red':'blue',w:3.8,pts:mk(s.M),label:'Demanda',lp:0,legend:'Curva de demanda de películas',info:['Curva de demanda de películas','Cada punto es la cantidad que <b>maximiza tu utilidad</b> a cada precio, con tu ingreso dado. Por eso la demanda tiene pendiente negativa: precios altos hacen caer la cantidad óptima.']});
    els.push({k:'pt',id:'p',color:'green',at:[q,s.pA],r:7,guides:true,gx:fn(q,1),gy:f$(s.pA,2),label:'Tu elección',legend:'Elección óptima a este precio',info:['Elección óptima','A '+f$(s.pA,2)+' por película, con ingreso de '+f$(s.M,0)+', lo mejor que puedes hacer es comprar '+fn(q,1)+' películas y gastar el resto en hamburguesas.']});
    return {els,read:[['Película',f$(s.pA,2),'gray'],['Cantidad óptima',fn(q,1),'green'],['Dinero para hamburguesas',f$(s.M-s.pA*q,1),'red']],
     say:`<p>A <b>${f$(s.pA,2)}</b> por película, tu mejor decisión es ver <b>${fn(q,1)}</b> películas al mes.</p><p>${s.M===40?'Si subes el precio, la cantidad baja: es un movimiento <b>a lo largo</b> de la demanda. Si cambias el ingreso, la demanda se <b>desplaza</b>.':'Con un ingreso de '+f$(s.M,0)+' la curva se desplazó '+(s.M>40?'a la derecha: a cada precio compras más.':'a la izquierda: a cada precio compras menos.')}</p>`};
  }
};
CHAPTERS.push({id:7,title:'Utilidad y demanda',
teaser:'Utilidad total y marginal, cómo maximiza un consumidor y de dónde sale realmente la curva de demanda.',
bigq:'Detrás de cada curva de demanda hay personas decidiendo en qué gastar su dinero. ¿Cómo eligen y por qué un diamante cuesta mucho más que el agua si el agua es indispensable para vivir?',
learn:['Explicar utilidad total, utilidad marginal y su relación.','Enunciar y aplicar la regla para maximizar la utilidad.','Derivar la curva de demanda a partir de decisiones óptimas del consumidor.','Resolver la «paradoja del valor» con utilidad marginal.'],
html:`
<h2>1. Elecciones de consumo</h2>
<p>Las decisiones de un consumidor dependen de tres cosas: sus <b>posibilidades de consumo</b> (lo que puede comprar con su ingreso y los precios), sus <b>preferencias</b> (sus gustos) y la <b>utilidad</b>, que es la forma de medir la satisfacción.</p>
${def('Utilidad','<p>Es el beneficio o satisfacción que una persona obtiene del consumo de bienes y servicios. No se puede medir en kilos ni en pesos: la medimos con unidades imaginarias («útiles») para poder comparar situaciones.</p>')}
<h3>Utilidad total y utilidad marginal</h3>
<ul>
<li><b>Utilidad total (UT):</b> la satisfacción total que te da consumir cierta cantidad.</li>
<li><b>Utilidad marginal (UM):</b> el <b>cambio</b> en la utilidad total cuando consumes <b>una unidad más</b>.</li>
</ul>
${eqn('UM = cambio en la utilidad total ÷ cambio en la cantidad')}
<p>Piensa en tu temperatura corporal como analogía: la utilidad total es la temperatura; la utilidad marginal es cuánto cambia (sube o baja) con cada nuevo grado de ejercicio. Una persona con 38.5° de temperatura mejora poco con un día más de reposo, porque ya casi está sana.</p>
<h3>El principio de la utilidad marginal decreciente</h3>
<p>Mientras más consumes de un bien en un periodo, <b>menos satisfacción te da cada unidad adicional</b>. La primera pizza después de un día sin comer es riquísima; la sexta, ya no tanto; la décima, quizá te haga daño. La UM disminuye, aunque la UT siga subiendo (hasta la saturación).</p>
${fig('c7_ut')}
${warn('<p>La utilidad total puede estar subiendo y la marginal bajando <i>al mismo tiempo</i>. No son contradictorias: la utilidad marginal baja, pero mientras sea positiva sigue sumando a la total. Solo cuando la marginal es cero la total deja de crecer.</p>')}

<h2>2. Maximización de la utilidad</h2>
<p>Un consumidor tiene un ingreso limitado y quiere el mayor bienestar posible. Su problema: ¿cómo repartir el dinero entre todos los bienes? La respuesta tiene dos condiciones:</p>
<ol>
<li><b>Gastar todo el ingreso</b> (si no, estarías dejando satisfacción sin usar).</li>
<li><b>Igualar la utilidad marginal por dólar gastado</b> en todos los bienes.</li>
</ol>
${figAgain('c7_ut')}
${eqn('UM de películas ÷ precio de películas = UM de hamburguesas ÷ precio de hamburguesas','Cada dólar adicional debe rendir lo mismo en todos los usos.')}
<h3>¿Por qué esa regla?</h3>
<p>Supón que un dólar adicional en películas te da 6 útiles y en hamburguesas 3. Entonces te conviene gastar un dólar menos en hamburguesas (pierdes 3) y uno más en películas (ganas 6): ganas 3 útiles. Mientras exista una diferencia, puedes mejorar moviendo dinero. Cuando se igualan, ya no hay mejora posible: ése es el máximo.</p>
${fig('c7_eq')}
<h3>Predicciones de la teoría</h3>
<p>Con esta regla, la teoría explica la ley de la demanda:</p>
<ul>
<li><b>Si baja el precio de las películas</b>, la UM por dólar de películas sube (cada dólar compra más película), así que compras más películas y menos hamburguesas.</li>
<li><b>Si sube el precio de las hamburguesas</b>, compras menos hamburguesas y, si son sustitutos, más películas.</li>
<li><b>Si sube el ingreso</b>, compras más de todo (bienes normales).</li>
</ul>
<h3>Demanda individual y demanda del mercado</h3>
<p>Si repites el ejercicio con cada precio de la película, obtienes la <b>curva de demanda individual</b>: cada punto es una cantidad óptima. La <b>demanda del mercado</b> se obtiene sumando las cantidades demandadas por todos los consumidores a cada precio.</p>
${fig('c7_dem')}
<h3>Utilidad marginal y elasticidad</h3>
<p>Si la utilidad marginal de un bien cae rápido a medida que consumes más, la demanda será <b>inelástica</b>: un precio menor no te anima a comprar mucho más. Si la UM cae lentamente (como cuando los sustitutos son buenos), la demanda será elástica.</p>
${figAgain('c4_cte')}

<h2>3. Eficiencia, precio y valor</h2>
<p>La curva de demanda es a la vez el beneficio marginal (capítulo 5). Un consumidor es eficiente cuando iguala su UM por dólar entre bienes. Y el <b>excedente del consumidor</b> es la diferencia entre lo que estaría dispuesto a pagar (la utilidad de cada unidad, en dinero) y lo que paga.</p>
${figAgain('c7_dem')}
<h3>La paradoja del valor</h3>
<p>El agua es indispensable para vivir y cuesta casi nada; los diamantes no sirven para nada vital y cuestan muchísimo. ¿Por qué? Porque confundimos <b>utilidad total</b> con <b>utilidad marginal</b>.</p>
<ul>
<li>El agua tiene una <b>utilidad total enorme</b> (sin ella morimos), pero como hay tanta, la <b>utilidad marginal</b> de un vaso más es muy baja. Como el precio refleja la utilidad marginal, es barata.</li>
<li>Los diamantes tienen poca utilidad total, pero son tan escasos que la utilidad marginal de uno más es muy alta. Y el precio es alto.</li>
</ul>
${tip('<p>Cuando una pregunta dice «¿por qué X es tan caro?», piensa en la utilidad <b>marginal</b> (la última unidad), no en la total. Y recuerda el excedente del consumidor: del agua obtenemos un gran excedente aunque paguemos poco.</p>')}
`,
terms:[['Utilidad','Satisfacción obtenida del consumo, medida en «útiles».'],['Utilidad total','Satisfacción total por consumir una cantidad.'],['Utilidad marginal','Cambio en la utilidad total por una unidad adicional.'],['Utilidad marginal decreciente','Cada unidad adicional te da menos satisfacción que la anterior.'],['Maximización de la utilidad','Repartir el ingreso para lograr la mayor utilidad total posible.'],['UM por dólar','Utilidad marginal dividida por el precio. Debe ser igual en todos los bienes en el óptimo.'],['Paradoja del valor','El agua es muy valiosa en total pero barata porque su UM es baja; los diamantes lo contrario.']],
quiz:[
 {q:'La utilidad marginal de un bien es:',o:['El cambio en la utilidad total por una unidad más','La utilidad total dividida entre la cantidad','El precio del bien','El gasto total'],a:0,why:'Es cuánto aporta la unidad adicional. Gráficamente, la pendiente de la utilidad total.'},
 {q:'Un consumidor compra películas y hamburguesas. La UM por dólar en películas es 6 y en hamburguesas 3. ¿Qué le conviene hacer?',o:['Comprar más películas y menos hamburguesas','Comprar más hamburguesas y menos películas','Quedarse igual','Gastar menos en total'],a:0,why:'Un dólar en películas rinde el doble. Mientras no se iguale, conviene mover dinero hacia películas.'},
 {q:'¿Qué ocurre con la utilidad total cuando la utilidad marginal es positiva pero decreciente?',o:['Sigue aumentando, pero cada vez más despacio','Disminuye','Se queda constante','Se vuelve cero'],a:0,why:'Mientras la UM sea positiva, cada unidad suma. Que sea decreciente solo significa que suma cada vez menos.'},
 {q:'La paradoja del valor se explica porque el precio refleja:',o:['La utilidad marginal','La utilidad total','El tamaño del mercado','La cantidad de oferentes'],a:0,why:'El agua tiene utilidad total altísima, pero como es abundante su utilidad marginal es baja y por eso es barata.'}]});
