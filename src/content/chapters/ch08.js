/** Capítulo 8 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { curve } from '../../engine/math.js';
import { f$, fn, pct } from '../../engine/format.js';
import { def, eqn, fig } from '../../engine/blocks.js';

FIGS.c8_budget = {
  title:'Restricción presupuestaria (ejemplo del libro: ingreso $30, película $6, hamburguesa $3)',
  intro:'La línea de presupuesto muestra todo lo que puedes comprar gastando justo tu ingreso. Cambia ingreso y precios y mira qué le pasa a la línea.',
  x:{label:'Películas por mes',max:15,ticks:[0,3,6,9,12,15]}, y:{label:'Hamburguesas por mes',max:30,ticks:[0,5,10,15,20,25,30]},
  controls:[
   {id:'I',label:'Ingreso mensual',min:20,max:60,step:2,value:30,fmt:v=>f$(v,0),hint:'Más ingreso: la línea se mueve hacia afuera, <b>paralela</b>. La inclinación no cambia (los precios son los mismos).'},
   {id:'pM',label:'Precio de una película',min:4,max:12,step:1,value:6,fmt:v=>f$(v,0),hint:'Una película más cara: la línea gira hacia adentro sobre el eje de hamburguesas. Disminuyen las películas que puedes comprar.'},
   {id:'pH',label:'Precio de una hamburguesa',min:2,max:6,step:.5,value:3,fmt:v=>f$(v,2),hint:'Una hamburguesa más cara: la línea gira hacia adentro sobre el eje de películas.'},
   {id:'q',label:'Películas que compras',min:0,max:15,step:.5,value:2,fmt:v=>fn(v,1),hint:'Mira cuántas hamburguesas te quedan para el dinero que sobra.'}],
  build(s){
    const {I,pM,pH}=s, xi=I/pM, yi=I/pH, slope=pM/pH;
    const q=Math.min(s.q,xi), h=(I-pM*q)/pH;
    const els=[
     {k:'area',id:'asq',color:'blue',op:.2,pts:[[0,0],[xi,0],[0,yi]],label:{t:'Asequible',at:[xi/3,yi/3]},legend:'Combinaciones asequibles',info:['Combinaciones asequibles','Todo lo que puedes comprar con tu ingreso: sobre la línea (gastas todo) o dentro (te sobra dinero).']},
     {k:'area',id:'noasq',color:'red',op:.08,pts:[[xi,0],[15,0],[15,30],[0,30],[0,yi]],label:{t:'No asequible',at:[11,22]},legend:'Combinaciones no asequibles',info:['Combinaciones no asequibles','Cuestan más que tu ingreso: están fuera de tu alcance con estos precios.']},
     {k:'line',id:'pre',color:'blue',w:3.8,pts:[[0,yi],[xi,0]],label:'Restricción presupuestaria',lp:0,legend:'Restricción presupuestaria',info:['Restricción presupuestaria','Es el límite: las combinaciones que cuestan <b>exactamente</b> tu ingreso. Ecuación: '+f$(pM,0)+' × películas + '+f$(pH,2)+' × hamburguesas = '+f$(I,0)+'. Su pendiente es −'+fn(slope,2)+': el <b>costo de oportunidad</b> de una película son '+fn(slope,2)+' hamburguesas.']},
     {k:'pt',id:'ix',color:'blue',at:[xi,0],r:6,label:{t:'Solo películas',dx:-6,dy:-10,anchor:'end'},legend:'Todo en películas',info:['Si gastas todo en películas','Compras '+fn(xi,1)+' películas ('+f$(I,0)+' ÷ '+f$(pM,0)+') y ninguna hamburguesa.']},
     {k:'pt',id:'iy',color:'blue',at:[0,yi],r:6,label:{t:'Solo hamburguesas',dx:8,dy:-8},legend:'Todo en hamburguesas',info:['Si gastas todo en hamburguesas','Compras '+fn(yi,1)+' hamburguesas ('+f$(I,0)+' ÷ '+f$(pH,2)+') y ninguna película.']},
     {k:'pt',id:'ch',color:'green',at:[q,h],r:7,guides:true,label:'Tu compra',legend:'Tu elección',info:['Tu elección','Compras '+fn(q,1)+' películas ('+f$(pM*q,0)+') y '+fn(h,1)+' hamburguesas ('+f$(pH*h,0)+'). Gastas exactamente tu ingreso.']}];
    return {els,read:[['Máx. películas',fn(xi,1),'blue'],['Máx. hamburguesas',fn(yi,1),'blue'],['Precio relativo de una película',fn(slope,2)+' hamb.','red']],
     say:`<p>El <b>precio relativo</b> de una película es ${f$(pM,0)} ÷ ${f$(pH,2)} = <b>${fn(slope,2)} hamburguesas</b>: ese es su costo de oportunidad y es la pendiente de la línea.</p><p>Cada película extra que compras te obliga a renunciar a ${fn(slope,2)} hamburguesas. Recuerda: <b>ingreso</b> mueve la línea en paralelo; un <b>precio</b> la hace girar.</p>`};
  }
};
FIGS.c8_ic = {
  title:'Curvas de indiferencia y elección óptima (ingreso $30, hamburguesa $3)',
  intro:'La elección óptima es el punto donde la línea de presupuesto toca (es tangente a) la curva de indiferencia más alta posible. Sube el precio de la película y descompón el efecto.',
  x:{label:'Películas por mes',max:11,ticks:[0,2,4,6,8,10]}, y:{label:'Hamburguesas por mes',max:14,ticks:[0,2,4,6,8,10,12,14]},
  controls:[
   {id:'pM',label:'Precio de la película (antes: $6)',min:3,max:15,step:.5,value:12,fmt:v=>f$(v,1),hint:'El precio original es $6. Con un precio más alto, la línea gira hacia adentro y la mejor elección se mueve a una curva de indiferencia más baja.'},
   {id:'a',label:'Cuánto te gustan las películas',min:.3,max:.7,step:.05,value:.5,fmt:v=>pct(v),hint:'Con más afición por las películas, las curvas se inclinan distinto y gastas una mayor parte de tu ingreso en ellas.'},
   {id:'dec',type:'toggle',label:'Mostrar efecto sustitución e ingreso',value:true}],
  build(s){
    const I=30,pH=3,p0=6,a=s.a,p1=s.pM;
    const x0=a*I/p0, y0=(1-a)*I/pH, x1=a*I/p1, y1=(1-a)*I/pH;
    const U=(x,y)=>Math.pow(x,a)*Math.pow(y,1-a), U0=U(x0,y0), U1=U(x1,y1);
    const ic=(Uv)=>curve(x=>Math.pow(Uv/Math.pow(x,a),1/(1-a)),.25,11,90).filter(p=>p[1]<=14&&p[1]>=0);
    const els=[
     {k:'line',id:'b0',color:'gray',dash:'6 5',w:2.4,pts:[[0,I/pH],[I/p0,0]],legend:'Presupuesto original',info:['Presupuesto original','Con película a $6: puedes comprar hasta 5 películas o 10 hamburguesas.']},
     {k:'line',id:'ic0',color:'gray',dash:'3 4',w:2.4,pts:ic(U0),legend:'Curva de indiferencia original',info:['Curva de indiferencia original','Todas las combinaciones que te daban la <b>misma satisfacción</b> que tu elección original.']},
     {k:'line',id:'b1',color:'blue',w:3.8,pts:[[0,I/pH],[I/p1,0]],label:'Nuevo presupuesto',lp:0,legend:'Nuevo presupuesto',info:['Presupuesto con el nuevo precio','Con película a '+f$(p1,1)+': hasta '+fn(I/p1,1)+' películas o 10 hamburguesas. La línea giró sobre el eje vertical.']},
     {k:'line',id:'ic1',color:'red',w:3.6,pts:ic(U1),label:'Nueva curva',legend:'Nueva curva de indiferencia',info:['Curva de indiferencia alcanzada','La mejor curva que puedes tocar con el nuevo presupuesto. Todas sus combinaciones te dan igual satisfacción. Las curvas más altas (más al noreste) dan más satisfacción pero no puedes pagarlas.']},
     {k:'pt',id:'A',color:'ink',at:[x0,y0],r:6,label:{t:'A (original)',dx:8,dy:-8},legend:'Elección original (A)',info:['Elección original (A)','Con precio $6 comprabas '+fn(x0,1)+' películas y '+fn(y0,1)+' hamburguesas. En A la línea de presupuesto es <b>tangente</b> a la curva de indiferencia: la tasa a la que estás dispuesto a cambiar (TMS) iguala el precio relativo.']},
     {k:'pt',id:'B',color:'red',at:[x1,y1],r:7,guides:true,label:{t:'B (nueva)',dx:10,dy:24},legend:'Nueva elección (B)',info:['Nueva elección (B)','Con el nuevo precio compras '+fn(x1,1)+' películas y '+fn(y1,1)+' hamburguesas. Es el punto donde el nuevo presupuesto es tangente a la nueva curva de indiferencia.']}];
    let say;
    const rr=((1-a)/a)*(p1/pH), xc=U0/Math.pow(rr,1-a), yc=rr*xc;
    if(s.dec&&Math.abs(p1-p0)>.01){
      els.push({k:'line',id:'bc',color:'amber',dash:'5 4',w:2.6,pts:[[0,yc+(p1/pH)*xc],[(yc+(p1/pH)*xc)/(p1/pH),0]],legend:'Presupuesto compensado',info:['Presupuesto compensado','Un presupuesto imaginario con los <b>precios nuevos</b> pero con el ingreso necesario para que sigas igual de contento que antes (en la curva original). Sirve para separar los dos efectos.']});
      els.push({k:'pt',id:'C',color:'amber',at:[xc,yc],r:6,label:{t:'C',dx:8,dy:-8},legend:'Punto compensado (C)',info:['Punto compensado (C)','Es lo que comprarías con los precios nuevos si el ingreso te compensara para quedar igual que antes. De A a C ves el <b>efecto sustitución</b> puro; de C a B, el <b>efecto ingreso</b>.']});
      const es=xc-x0, ei=x1-xc;
      say=`<p><b>Efecto total:</b> de ${fn(x0,2)} a ${fn(x1,2)} películas (${fn(x1-x0,2)}).</p><p><b>Efecto sustitución</b> (A→C): ${fn(es,2)}. La película se encareció respecto a la hamburguesa, así que la sustituyes.</p><p><b>Efecto ingreso</b> (C→B): ${fn(ei,2)}. Con el mismo dinero ahora te alcanza menos: eres «más pobre».</p>`;
    } else say=`<p>Con el precio igual al original no hay cambio: la elección es A.</p>`;
    return {els,read:[['Películas: antes → ahora',fn(x0,2)+' → '+fn(x1,2),'red'],['Utilidad relativa',fn(U1/U0*100,0)+'% de la original','gray']],say,sayTitle:'Qué cambió y por qué'};
  }
};
FIGS.c8_forma = {
  title:'El grado de sustitución cambia la forma de las curvas de indiferencia',
  intro:'Cuanto más fácilmente sustituyes un bien por otro, más rectas son las curvas. Elige un caso.',
  x:{label:'Bien A (por ejemplo, café)',max:10,ticks:[0,2,4,6,8,10]}, y:{label:'Bien B',max:10,ticks:[0,2,4,6,8,10]},
  controls:[{id:'t',type:'seg',label:'Relación entre los bienes',value:'n',options:[['s','Sustitutos perfectos'],['n','Sustitutos imperfectos (lo normal)'],['c','Complementos perfectos']]}],
  build(s){
    const lv=[3,5,7], cols=['blue','teal','purple'], els=[]; let say;
    lv.forEach((k,i)=>{
      let pts;
      if(s.t==='s') pts=[[0,k*1.2],[Math.min(10,k*1.2),Math.max(0,k*1.2-Math.min(10,k*1.2))]];
      else if(s.t==='c') pts=[[k,10],[k,k],[10,k]];
      else pts=curve(x=>k*k/x/1.6,k*k/16/1.6*1+.05>0.5?0.3:0.3,10,80).filter(p=>p[1]<=10);
      if(s.t==='s') pts=[[0,k*1.2],[k*1.2,0]].map(p=>[Math.min(10,p[0]),p[1]]);
      els.push({k:'line',id:'u'+i,color:cols[i],w:3.4,pts,label:'U'+(i+1),lp:s.t==='c'?2:pts.length-1,legend:'Curva de indiferencia U'+(i+1),info:['Curva de indiferencia U'+(i+1),'Todas las combinaciones sobre esta curva te dan <b>la misma satisfacción</b>. '+(i<2?'Las curvas más lejanas del origen dan <b>más</b> satisfacción.':'Es la que te da más satisfacción de las tres.')]});
    });
    if(s.t==='s') say='<p><b>Sustitutos perfectos</b> (por ejemplo, dos marcas idénticas de agua): las curvas son <b>líneas rectas</b>. Aceptas cambiar un bien por otro a una tasa fija y no te importa cuál tienes. La tasa marginal de sustitución es constante.</p>';
    else if(s.t==='c') say='<p><b>Complementos perfectos</b> (zapato izquierdo y derecho): las curvas tienen forma de «L». Un zapato extra sin su par no te da nada. La tasa marginal de sustitución es cero o infinita según el tramo.</p>';
    else say='<p><b>Caso normal</b>: curvas suaves, convexas hacia el origen. Cuando tienes mucho de un bien, aceptas dar mucho de él por poco del otro (porque su utilidad marginal es baja). Eso es una <b>tasa marginal de sustitución decreciente</b>.</p>';
    return {els,say,sayTitle:'Qué significa'};
  }
};
FIGS.c8_trab = {
  title:'Oferta de trabajo: ¿por qué la curva se puede «doblar hacia atrás»?',
  intro:'Un mayor salario hace más caro el tiempo libre (efecto sustitución: trabajas más) pero también te hace más rico (efecto ingreso: puedes permitirte más ocio). (Curva ilustrativa.)',
  x:{label:'Horas de trabajo por semana',max:45,ticks:[0,10,20,30,40]}, y:{label:'Salario por hora ($)',max:14,ticks:[0,2,4,6,8,10,12,14],fmt:v=>'$'+v},
  controls:[{id:'w',label:'Salario por hora',min:1,max:13.5,step:.25,value:3,fmt:v=>f$(v,2),hint:'Sube el salario y observa cómo, primero, trabajas más; después, trabajas menos.'}],
  build(s){
    const L=w=>9*w-.55*w*w, wm=9/(2*.55), w=s.w, l=L(w), sub=w<wm;
    const els=[
     {k:'line',id:'sus',color:'teal',w:4,pts:curve(L,0.05,wm,50).map(([w,l])=>[l,w]),legend:'Domina el efecto sustitución',info:['Tramo donde domina el efecto sustitución','Al subir el salario, cada hora libre «cuesta» más (en dinero que dejas de ganar), así que sustituyes ocio por trabajo. La oferta de trabajo <b>sube</b> con el salario.']},
     {k:'line',id:'ing',color:'red',w:4,pts:curve(L,wm,13.8,40).map(([w,l])=>[l,w]),legend:'Domina el efecto ingreso',info:['Tramo donde domina el efecto ingreso','Ya ganas tanto que puedes «comprar» más tiempo libre. Al subir el salario <b>reduces</b> tus horas. La curva se dobla hacia atrás.']},
     {k:'pt',id:'p',color:sub?'teal':'red',at:[l,w],r:7,guides:true,gx:fn(l,1)+' h',gy:f$(w,2),legend:false,info:['Tu punto','A '+f$(w,2)+' la hora trabajas '+fn(l,1)+' horas por semana.']},
     {k:'pt',id:'mx',color:'amber',at:[L(wm),wm],r:6,label:{t:'Máximo de horas',dx:10,dy:-8},legend:'Punto de inflexión',info:['Punto donde se doblan las horas','Es el salario a partir del cual cada aumento reduce las horas ofrecidas: el efecto ingreso supera al sustitución.']}];
    return {els,read:[['Horas trabajadas',fn(l,1),sub?'teal':'red']],say:sub?`<p>A este salario domina el <b>efecto sustitución</b>: un salario mayor te anima a trabajar <b>más</b>.</p>`:`<p>Ya ganas bastante: domina el <b>efecto ingreso</b>. Un salario mayor te permite trabajar <b>menos</b> horas y disfrutar más tiempo libre.</p>`};
  }
};
CHAPTERS.push({id:8,title:'Posibilidades, preferencias y elecciones',
teaser:'Restricción presupuestaria, curvas de indiferencia, efectos sustitución e ingreso y oferta de trabajo.',
bigq:'Otra forma de ver cómo elige un consumidor, sin necesidad de medir la utilidad en números: con un mapa de lo que puede comprar (la restricción presupuestaria) y otro de lo que le gusta (las curvas de indiferencia).',
learn:['Dibujar y modificar una restricción presupuestaria.','Interpretar las curvas de indiferencia y la tasa marginal de sustitución.','Encontrar la elección óptima y predecir cambios de precio e ingreso.','Separar los efectos sustitución e ingreso.','Explicar la oferta de trabajo.'],
html:`
<h2>1. Las posibilidades de consumo</h2>
<p>Lo que puedes comprar depende de tu <b>ingreso</b> y de los <b>precios</b>. La <b>restricción presupuestaria</b> es el límite de tus posibilidades. El libro lo explica con Isabel, que tiene $30 al mes para gastar en películas ($6 cada una) y hamburguesas ($3 cada una). Si gasta todo en películas, compra 5; si gasta todo en hamburguesas, 10. En medio hay combinaciones como 2 películas y 6 hamburguesas.</p>
<h3>La ecuación presupuestaria</h3>
${eqn('Gasto en películas + gasto en hamburguesas = Ingreso','P<sub>M</sub>·Q<sub>M</sub> + P<sub>H</sub>·Q<sub>H</sub> = I &nbsp; → &nbsp; Q<sub>H</sub> = I/P<sub>H</sub> − (P<sub>M</sub>/P<sub>H</sub>)·Q<sub>M</sub>')}
<p>Fíjate en el último término: la pendiente de la línea es <b>−P<sub>M</sub>/P<sub>H</sub></b>, el <b>precio relativo</b>, que es el costo de oportunidad de una película medido en hamburguesas. Con tus datos: $6 ÷ $3 = 2 hamburguesas por película.</p>
${fig('c8_budget')}
<h3>Cómo cambia la línea</h3>
<ul>
<li><b>Cambio del ingreso:</b> la línea se desplaza <b>en paralelo</b> (misma pendiente). Con más ingreso puedes comprar más de todo.</li>
<li><b>Cambio de un precio:</b> la línea <b>gira</b>. El precio del bien que baja hace que puedas comprar más de él (el intercepto se aleja), y el precio relativo cambia.</li>
</ul>

<h2>2. Las preferencias y las curvas de indiferencia</h2>
<p>La restricción presupuestaria dice qué <i>puedes</i> comprar. Falta lo que <i>quieres</i>. Las preferencias se describen con un mapa de <b>curvas de indiferencia</b>.</p>
${def('Curva de indiferencia','<p>Una línea que une todas las combinaciones de dos bienes que le dan a la persona <b>la misma satisfacción</b> (es «indiferente» entre ellas). Las curvas más lejanas del origen representan más satisfacción.</p>')}
<p>Propiedades importantes: son decrecientes (para tener más de un bien tienes que renunciar a algo del otro para quedar igual), no se cruzan jamás (porque se contradirían) y son convexas hacia el origen.</p>
<h3>Tasa marginal de sustitución</h3>
<p>La <b>tasa marginal de sustitución (TMS)</b> es la cantidad del bien en el eje y a la que estás dispuesto a renunciar a cambio de una unidad más del bien en el eje x, manteniéndote igual de satisfecho. Es la pendiente (en valor absoluto) de la curva de indiferencia. A medida que tienes más del bien x y menos del y, la TMS disminuye: <b>TMS decreciente</b>. Esto da a las curvas su forma convexa.</p>
<h3>El grado de sustitución</h3>
${fig('c8_forma')}

<h2>3. Predicción del comportamiento del consumidor</h2>
<p>Ahora junta las dos piezas: la restricción presupuestaria y el mapa de indiferencia. El consumidor elige el punto alcanzable con mayor satisfacción: aquel donde la línea de presupuesto <b>toca justo</b> una curva de indiferencia sin cruzarla. En ese punto de tangencia:</p>
${eqn('TMS = precio relativo','Lo que estás dispuesto a cambiar = lo que el mercado te permite cambiar.')}
<p>Si la TMS fuera mayor que el precio relativo, valorarías el bien x más de lo que cuesta: comprarías más. Si fuera menor, comprarías menos. El óptimo se alcanza cuando se igualan (y es el mismo resultado que «UM/precio igual», del capítulo 7).</p>
${fig('c8_ic')}
<h3>Un cambio en el precio</h3>
<p>Cuando sube el precio de las películas, la línea gira hacia adentro. El consumidor termina en una curva de indiferencia <b>más baja</b> y compra menos películas. De ese cambio sale la curva de demanda: es el recorrido de las elecciones óptimas a distintos precios.</p>
<h3>Un cambio en el ingreso</h3>
<p>Un aumento del ingreso desplaza la línea hacia afuera en paralelo: el consumidor llega a una curva más alta. En los <b>bienes normales</b> compra más; en los <b>bienes inferiores</b>, menos.</p>
<h3>Efecto sustitución y efecto ingreso</h3>
<p>Cuando sube el precio de un bien ocurren dos cosas a la vez:</p>
<ul>
<li><b>Efecto sustitución:</b> el bien se volvió más caro <i>respecto</i> a los otros, así que lo sustituyes por otros. Es el movimiento por la curva de indiferencia original hacia un punto con el nuevo precio relativo.</li>
<li><b>Efecto ingreso:</b> aunque tu ingreso nominal no cambió, ahora te alcanza menos: eres «más pobre» y consumes menos de todo (si es un bien normal).</li>
</ul>
<p>La figura muestra los dos efectos con el punto C: de A a C es el efecto sustitución; de C a B, el efecto ingreso. En los bienes normales ambos reducen la compra del bien encarecido, por eso la demanda baja.</p>

<h2>4. Elecciones de trabajo y tiempo libre</h2>
<p>Trabajar es renunciar a tiempo libre: el <b>salario</b> es el precio del ocio (cada hora libre te «cuesta» el salario que dejas de ganar). Aplicando lo anterior, obtenemos la <b>oferta de trabajo</b>. Un aumento del salario produce dos efectos opuestos:</p>
<ul>
<li><b>Efecto sustitución:</b> el ocio se encarece, así que trabajas más.</li>
<li><b>Efecto ingreso:</b> eres más rico, así que compras más ocio y trabajas menos.</li>
</ul>
<p>A salarios bajos domina el efecto sustitución (la oferta de trabajo sube). A salarios muy altos puede dominar el efecto ingreso (la oferta se «dobla hacia atrás»). Esto se ve en las horas de trabajo de los países ricos: han bajado con el tiempo a pesar del aumento de los salarios.</p>
${fig('c8_trab')}

<h2>Apéndice: utilidad marginal y curvas de indiferencia</h2>
<p>Las dos teorías (capítulo 7 y 8) dan exactamente la misma respuesta. La TMS es el cociente entre las utilidades marginales: <b>TMS = UM<sub>x</sub> ÷ UM<sub>y</sub></b>. Como en el óptimo TMS = P<sub>x</sub>/P<sub>y</sub>, se cumple que <b>UM<sub>x</sub>/P<sub>x</sub> = UM<sub>y</sub>/P<sub>y</sub></b>. Son dos formas de expresar la misma idea: con curvas de indiferencia no hace falta medir la utilidad en números, sólo ordenar las preferencias.</p>
`,
terms:[['Restricción presupuestaria','Límite de lo que se puede comprar con el ingreso y los precios dados.'],['Precio relativo','Cociente de dos precios: el costo de oportunidad de un bien medido en el otro. Pendiente de la restricción.'],['Curva de indiferencia','Combinaciones que dan igual satisfacción.'],['Tasa marginal de sustitución','Cuánto del bien y se renuncia por una unidad más del x, sin cambiar la satisfacción. Pendiente de la curva.'],['Efecto sustitución','Cambio en el consumo por el cambio del precio relativo.'],['Efecto ingreso','Cambio en el consumo por el cambio del poder adquisitivo.'],['Bien normal / inferior','Normal: se compra más con más ingreso. Inferior: menos.'],['Oferta de trabajo','Horas que la gente quiere trabajar a cada salario.']],
quiz:[
 {q:'La pendiente de la restricción presupuestaria es:',o:['El precio relativo (cuánto del otro bien cuesta una unidad)','El ingreso','La utilidad marginal','Siempre 1'],a:0,why:'Es −Px/Py: el costo de oportunidad de una unidad del bien x en unidades del bien y.'},
 {q:'Un aumento del ingreso (sin cambios en precios) mueve la restricción presupuestaria:',o:['En paralelo, hacia afuera','Girándola hacia adentro','Girándola hacia afuera','Hacia el origen'],a:0,why:'Los precios no cambian, así que la pendiente es igual. Solo cambia el máximo alcanzable de ambos bienes.'},
 {q:'En el punto óptimo del consumidor:',o:['TMS = precio relativo','TMS = 0','La curva de indiferencia cruza la restricción','Se gasta menos que el ingreso'],a:0,why:'La línea presupuestaria es tangente a la curva de indiferencia: lo que estás dispuesto a cambiar es igual a lo que el mercado permite.'},
 {q:'Si el salario sube y una persona trabaja menos horas, domina:',o:['El efecto ingreso','El efecto sustitución','El efecto precio relativo','Ninguno'],a:0,why:'El efecto sustitución empuja a trabajar más; si la persona trabaja menos, el efecto ingreso (comprar más ocio) pesa más.'}]});
