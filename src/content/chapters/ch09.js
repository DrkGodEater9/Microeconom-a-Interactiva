/** Capítulo 9 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { f$, fn } from '../../engine/format.js';
import { def, warn, fig, table } from '../../engine/blocks.js';

FIGS.c9_cuentas = {
  title:'Beneficio contable vs. beneficio económico (calculadora, ejemplo ilustrativo)',
  intro:'Una empresa pequeña: ingresos, costos que se pagan en efectivo y costos «invisibles» (lo que el dueño renuncia a ganar). Mueve los valores y compara.',
  noplot:true,
  controls:[
   {id:'ing',label:'Ingresos por ventas al año (miles de $)',min:100,max:400,step:10,value:260,fmt:v=>'$'+v},
   {id:'exp',label:'Costos explícitos: sueldos, materiales, alquiler (miles de $)',min:50,max:250,step:10,value:150,fmt:v=>'$'+v,hint:'Son los que se pagan en dinero a terceros. Los registra cualquier contador.'},
   {id:'sal',label:'Sueldo que el dueño ganaría trabajando para otro',min:0,max:120,step:5,value:60,fmt:v=>'$'+v,hint:'Costo de oportunidad de su tiempo. Si trabaja en su propio negocio, no se paga un sueldo… pero renuncia a este.'},
   {id:'cap',label:'Rendimiento normal sobre el dinero que el dueño invirtió',min:0,max:80,step:5,value:30,fmt:v=>'$'+v,hint:'Lo que ese dinero habría ganado en su mejor uso alternativo (banco, otro negocio). También es un costo de oportunidad.'}],
  build(s){
    const bc=s.ing-s.exp, impl=s.sal+s.cap, be=bc-impl;
    return {read:[['Beneficio contable',f$(bc*1000,0),'blue'],['Costos implícitos',f$(impl*1000,0),'amber'],['Beneficio económico',f$(be*1000,0),be>=0?'green':'red']],
     sayTitle:'Cómo se calcula',
     say:`<p><b>Beneficio contable</b> = ingresos − costos explícitos = ${f$(s.ing*1000,0)} − ${f$(s.exp*1000,0)} = <b>${f$(bc*1000,0)}</b>.</p><p><b>Costos implícitos</b> (de oportunidad) = sueldo alternativo + rendimiento normal del capital = ${f$(s.sal*1000,0)} + ${f$(s.cap*1000,0)} = ${f$(impl*1000,0)}.</p><p><b>Beneficio económico</b> = ingresos − <i>todos</i> los costos de oportunidad = <b>${f$(be*1000,0)}</b>.</p>`+(be>0?'<p>Hay beneficio económico positivo: el negocio rinde más que la mejor alternativa del dueño. Es una señal que atrae a nuevos competidores.</p>':be===0?'<p><b>Beneficio económico cero</b> = <i>beneficio normal</i>: el dueño gana justo lo que ganaría en su mejor alternativa. Es una situación estable: nadie entra ni sale.</p>':'<p>El negocio parece rentable en los libros ('+f$(bc*1000,0)+' de beneficio contable), pero <b>el dueño estaría mejor haciendo otra cosa</b>. A largo plazo cerrará.</p>')};
  }
};
FIGS.c9_tec = {
  title:'Eficiencia tecnológica y eficiencia económica (producir 10 camisas al día; ejemplo ilustrativo)',
  intro:'Hay cuatro técnicas. Una es tecnológicamente ineficiente (usa de más). Entre las eficientes, la más barata depende de los precios de los insumos.',
  x:{label:'Técnica',max:5,ticks:[1,2,3,4],fmt:v=>['','A','B','C','D'][v]||''}, y:{label:'Costo diario ($)',max:1200,ticks:[0,300,600,900,1200],fmt:v=>'$'+v},
  controls:[
   {id:'w',label:'Salario diario de un trabajador',min:20,max:200,step:10,value:100,fmt:v=>'$'+v,hint:'Si los trabajadores se encarecen, conviene sustituirlos por máquinas (técnicas C, B, A de derecha a izquierda).'},
   {id:'r',label:'Costo diario de alquilar una máquina',min:20,max:200,step:10,value:100,fmt:v=>'$'+v,hint:'Si las máquinas se encarecen, conviene usar más trabajo.'}],
  build(s){
    const T=[{n:'A',L:10,K:1,t:'Casi todo a mano'},{n:'B',L:6,K:2,t:'Mixta'},{n:'C',L:3,K:4,t:'Muy mecanizada'},{n:'D',L:8,K:4,t:'Ineficiente'}];
    const costs=T.map(t=>s.w*t.L+s.r*t.K), eff=[0,1,2], best=eff.reduce((b,i)=>costs[i]<costs[b]?i:b,0);
    const els=T.map((t,i)=>{ const x=i+1, c=costs[i], ok=i<3, isb=i===best;
      return {k:'area',id:'b'+i,color:!ok?'gray':isb?'green':'blue',op:!ok?.25:isb?.55:.3,pts:[[x-.35,0],[x+.35,0],[x+.35,c],[x-.35,c]],label:{t:f$(c,0),at:[x,c],dy:-8},legend:'Técnica '+t.n+' ('+t.L+' trab., '+t.K+' máq.)',
       info:['Técnica '+t.n+': '+t.t,t.L+' trabajadores y '+t.K+' máquinas producen las 10 camisas. Costo = '+t.L+' × '+f$(s.w,0)+' + '+t.K+' × '+f$(s.r,0)+' = <b>'+f$(c,0)+'</b>. '+(!ok?'<b>Tecnológicamente ineficiente:</b> usa más trabajadores que la técnica C con las mismas máquinas. Nunca se elegiría, sin importar los precios.':isb?'<b>Económicamente eficiente:</b> es la de menor costo con estos precios.':'Es tecnológicamente eficiente, pero con estos precios cuesta más que la mejor.')]}; });
    return {els,read:[['Más barata',['A','B','C'][best],'green'],['Su costo',f$(costs[best],0),'green']],
      say:`<p>Con salario ${f$(s.w,0)} y máquina ${f$(s.r,0)}, la técnica <b>económicamente eficiente</b> es la <b>${['A','B','C'][best]}</b> (${f$(costs[best],0)} al día).</p><p>La técnica D usa más insumos que C para producir lo mismo: es <b>tecnológicamente ineficiente</b> y se descarta siempre. La eficiencia <b>económica</b> exige además elegir la de menor costo, y ésa depende de los precios de los insumos.</p>`};
  }
};
FIGS.c9_hhi = {
  title:'Medir la concentración de un mercado (calculadora)',
  intro:'Asigna las participaciones de mercado de las cuatro empresas más grandes. El resto del mercado queda en manos de muchas empresas pequeñas.',
  noplot:true,
  controls:[{id:'a',label:'Empresa 1 (% de las ventas)',min:0,max:60,step:1,value:30,fmt:v=>v+'%'},{id:'b',label:'Empresa 2',min:0,max:60,step:1,value:25,fmt:v=>v+'%'},{id:'c',label:'Empresa 3',min:0,max:60,step:1,value:15,fmt:v=>v+'%'},{id:'d',label:'Empresa 4',min:0,max:60,step:1,value:10,fmt:v=>v+'%'}],
  build(s){
    let sh=[s.a,s.b,s.c,s.d]; const tot=sh.reduce((x,y)=>x+y,0); if(tot>100) sh=sh.map(v=>v*100/tot);
    const r4=sh.reduce((x,y)=>x+y,0), hhi=sh.reduce((x,y)=>x+y*y,0);
    const tipo=hhi>=9000?'monopolio (casi)':hhi>1800?'oligopolio (mercado concentrado)':hhi>=1000?'competencia monopolística':'mercado muy competitivo';
    return {read:[['Razón de concentración de 4 empresas',fn(r4,0)+'%','blue'],['Índice Herfindahl-Hirschman',fn(hhi,0),'amber'],['Tipo de mercado',tipo,'purple']],
     sayTitle:'Cómo se calcula',
     say:`<p><b>Razón de concentración de las cuatro empresas más grandes</b> = suma de sus participaciones = ${sh.map(v=>fn(v,0)).join(' + ')} = <b>${fn(r4,0)}%</b>.</p><p><b>Índice de Herfindahl-Hirschman (IHH)</b> = suma de los <i>cuadrados</i> de las participaciones = ${sh.map(v=>fn(v,0)+'²').join(' + ')} = <b>${fn(hhi,0)}</b> (aprox.; las empresas pequeñas suman casi cero).</p><p>Guía (la del libro): IHH <b>&lt; 1,000</b>: muy competitivo; <b>1,000 a 1,800</b>: competencia monopolística; <b>&gt; 1,800</b>: oligopolio. Un monopolio puro (una sola empresa con 100%) tiene IHH = 10,000. Elevar al cuadrado hace que las empresas grandes pesen mucho más.</p><p>Resultado: <b>${tipo}</b>.</p>`};
  }
};
CHAPTERS.push({id:9,title:'Organización de la producción',
teaser:'Qué busca una empresa, cómo medir sus beneficios, tipos de empresa, el problema agente-principal y estructuras de mercado.',
bigq:'Millones de personas trabajan en empresas. ¿Qué buscan esas empresas, cómo deciden cómo producir y por qué existen empresas en lugar de que cada uno venda por su cuenta?',
learn:['Explicar qué es una empresa y cuál es su objetivo.','Calcular beneficio económico con los costos de oportunidad implícitos.','Distinguir eficiencia tecnológica de eficiencia económica.','Describir el problema agente-principal y los tipos de empresa.','Medir la concentración de un mercado con la razón de cuatro empresas y el IHH.'],
html:`
<h2>1. La empresa y su problema económico</h2>
<p>Una <b>empresa</b> es una organización que contrata factores de producción y los transforma en bienes y servicios que vende. Su objetivo es <b>maximizar el beneficio económico</b>. Si no lo hace, los competidores la desplazarán o los dueños la venderán a quienes sí lo hagan.</p>
<h3>Cómo se mide el beneficio de una empresa</h3>
<p>Aquí hay una diferencia que sorprende: lo que un contador llama beneficio no es lo mismo que lo que llama beneficio un economista. Todo depende de qué costos se cuenten.</p>
${def('Costo de oportunidad de una empresa','<p>Es la suma de los costos <b>explícitos</b> (pagos en dinero a quienes suministran factores: sueldos, materiales, alquiler) y los costos <b>implícitos</b> (el valor de los recursos propios de la empresa que podrían tener otro uso: el tiempo del dueño y su dinero invertido).</p>')}
${def('Beneficio económico','<p>Es el ingreso total menos el <b>costo total de oportunidad</b> (explícitos + implícitos). Un beneficio económico <b>cero</b> se llama <b>beneficio normal</b>: el dueño gana lo mismo que en su mejor alternativa.</p>')}
${fig('c9_cuentas')}
<p>Un contador, por lo general, mide solo los costos explícitos. Un economista incluye <i>todos</i> los costos de oportunidad. Por eso la utilidad económica suele ser menor que la contable. Incluir los costos implícitos importa porque determina si conviene seguir con el negocio.</p>
<h3>Las restricciones de la empresa</h3>
<p>Tres cosas limitan lo que una empresa puede ganar: la <b>tecnología</b> (qué se sabe producir), las <b>restricciones de información</b> (no se sabe todo sobre el futuro, ni sobre las preferencias o el esfuerzo de los empleados) y las <b>restricciones de mercado</b> (lo que puede vender y a qué precio).</p>

<h2>2. Tecnología y eficiencia económica</h2>
<ul>
<li><b>Eficiencia tecnológica:</b> se logra cuando <i>no se puede producir lo mismo usando menos de algún insumo sin usar más de otro</i>.</li>
<li><b>Eficiencia económica:</b> se logra cuando se produce una cantidad dada al <b>costo mínimo</b>.</li>
</ul>
<p>Una técnica puede ser tecnológicamente eficiente y no ser económicamente eficiente. La eficiencia económica depende de los precios de los insumos. Si la mano de obra es cara, conviene usar máquinas; si es barata, usar mano de obra. Esto explica por qué un país con salarios bajos produce con técnicas distintas a las de uno con salarios altos.</p>
${fig('c9_tec')}
${warn('<p>Toda técnica económicamente eficiente es tecnológicamente eficiente, pero no al revés. Primero se descartan las técnicas «desperdiciadoras» y luego se elige la más barata.</p>')}

<h2>3. Información y organización</h2>
<p>Cada empresa debe resolver cómo lograr que sus trabajadores hagan lo que más le conviene. Se usan dos sistemas, casi siempre combinados:</p>
<ul>
<li><b>Sistema de órdenes:</b> una cadena de mando. Jerarquías, supervisores. Funciona cuando las tareas son sencillas y observables.</li>
<li><b>Sistema de incentivos:</b> premios que alinean el interés del trabajador con el de la empresa (comisiones, bonos, participación en utilidades). Funciona cuando es difícil observar el esfuerzo.</li>
</ul>
<h3>El problema agente-principal</h3>
<p>El <b>principal</b> es quien contrata (el dueño o accionista); el <b>agente</b> es quien actúa por él (el gerente o empleado). El problema aparece cuando los intereses divergen: el gerente puede preferir lujos, o evitar riesgos, mientras que el dueño desea el mayor beneficio. Como el principal no puede vigilar todo, diseña <b>contratos de incentivos</b>: participación en las utilidades, opciones sobre acciones, ascensos, contratos de largo plazo, reputación. Los escándalos corporativos recientes son ejemplos de fallas en estos incentivos.</p>
<h3>Formas de organización de las empresas</h3>
${table(['Tipo','Qué es','Ventajas','Desventajas'],[['Propietario único','Un solo dueño, que responde con todos sus bienes','Sencilla, control total, impuestos simples','Responsabilidad ilimitada, poco capital, vida limitada'],['Sociedad','Dos o más dueños que comparten beneficios y deudas','Más capital y habilidades','Responsabilidad ilimitada, conflictos entre socios'],['Corporación (sociedad anónima)','Persona jurídica con accionistas','Responsabilidad limitada, más capital, vida ilimitada','Doble tributación en muchos países, problema agente-principal fuerte']])}

<h2>4. Los mercados y el ambiente competitivo</h2>
<p>No todas las empresas compiten en el mismo ambiente. Para clasificar un mercado se usan dos medidas de concentración:</p>
<ul>
<li><b>Razón de concentración de las cuatro empresas más grandes:</b> el porcentaje de las ventas que realizan las cuatro mayores. Va de 0 (competencia perfecta) a 100 (monopolio u oligopolio total).</li>
<li><b>Índice de Herfindahl-Hirschman (IHH):</b> la suma de los cuadrados de las participaciones de <i>todas</i> las empresas. Va de casi 0 a 10,000.</li>
</ul>
${fig('c9_hhi')}
<p>Limitaciones: estas medidas no consideran el alcance <b>geográfico</b> del mercado (una panadería compite localmente, un aeropuerto, no), las <b>barreras a la entrada</b> (¿es fácil que lleguen competidores?) ni la diferencia entre <b>mercado e industria</b> (una industria puede tener varios mercados).</p>
<h3>Estructuras de mercado</h3>
${table(['','Competencia perfecta','Competencia monopolística','Oligopolio','Monopolio'],[['Número de empresas','Muchísimas','Muchas','Pocas','Una'],['Producto','Idéntico','Diferenciado','Idéntico o diferenciado','Sin sustitutos cercanos'],['Barreras a la entrada','Ninguna','Ninguna','Sí','Bloqueada'],['Control del precio','Ninguno','Algo','Considerable','Considerable'],['Ejemplo','Trigo','Restaurantes','Aerolíneas, cerveza','Agua de un municipio']])}
<h3>¿Por qué existen las empresas?</h3>
<p>Coordinar mediante mercados tiene costos: buscar proveedores, negociar, redactar contratos y vigilar su cumplimiento (<b>costos de transacción</b>). Una empresa existe cuando coordinar internamente (con órdenes e incentivos) es más barato que usar el mercado. Las empresas ganan con las <b>economías de escala</b> (producir más baja el costo promedio), las <b>economías de alcance</b> (producir varios bienes juntos) y el <b>trabajo en equipo</b>.</p>
`,
terms:[['Empresa','Organización que contrata factores y los transforma en bienes y servicios para vender.'],['Costo explícito','Pago en dinero a quien suministra un factor.'],['Costo implícito','Costo de oportunidad de los recursos propios de la empresa (tiempo y dinero del dueño).'],['Beneficio económico','Ingresos menos todos los costos de oportunidad.'],['Beneficio normal','Beneficio económico igual a cero.'],['Eficiencia tecnológica','No se puede producir lo mismo con menos de un insumo sin más de otro.'],['Eficiencia económica','Producir una cantidad al costo mínimo.'],['Problema agente-principal','El agente puede actuar en contra de los intereses del principal que lo contrató.'],['Razón de concentración','Suma de las participaciones de las cuatro mayores empresas.'],['IHH','Suma de cuadrados de las participaciones de todas las empresas.'],['Costos de transacción','Costos de usar el mercado: buscar, negociar, vigilar contratos.']],
quiz:[
 {q:'Un dueño gana $50 000 en libros pero podría ganar $70 000 trabajando para otra empresa. Su beneficio económico es:',o:['Negativo','Positivo','Cero','No se puede calcular'],a:0,why:'El costo implícito (el mejor empleo alternativo) supera al beneficio contable: 50 000 − 70 000 = −20 000.'},
 {q:'Una técnica tecnológicamente eficiente:',o:['No es necesariamente la más barata','Siempre es la más barata','Usa más insumos','Es la única que se puede usar'],a:0,why:'Para ser económicamente eficiente, además debe ser la de menor costo, y eso depende de los precios de los insumos.'},
 {q:'Un mercado tiene IHH de 2,500. Según el libro es probablemente:',o:['Un oligopolio','Muy competitivo','Competencia monopolística','Competencia perfecta'],a:0,why:'IHH mayor a 1,800 indica un mercado concentrado (oligopolio). Menos de 1,000 sería muy competitivo.'},
 {q:'El problema agente-principal aparece porque:',o:['Los intereses del gerente y del dueño no coinciden y el dueño no puede vigilarlo todo','Los dueños no quieren ganar dinero','El gobierno regula a las empresas','Los trabajadores no son productivos'],a:0,why:'El agente actúa por el principal pero con información privada; hay que diseñar incentivos que alineen intereses.'}]});
