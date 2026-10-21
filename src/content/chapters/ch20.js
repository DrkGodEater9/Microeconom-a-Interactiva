/** Capítulo 20 */
import { FIGS, CHAPTERS } from '../../engine/registry.js';
import { f$, fn } from '../../engine/format.js';
import { warn, fig } from '../../engine/blocks.js';

FIGS.c20_trade = {
  title:'Importaciones, ganadores y perdedores y aranceles (ejemplo ilustrativo)',
  intro:'Compara el mercado cerrado con el comercio internacional. Mueve el precio mundial y agrega un arancel (impuesto a las importaciones).',
  x:{label:'Cantidad de un bien (miles de unidades)',max:12,ticks:[0,2,4,6,8,10,12]}, y:{label:'Precio ($)',max:26,ticks:[0,4,8,12,16,20,24],fmt:v=>'$'+v},
  controls:[
   {id:'pw',label:'Precio mundial',min:4,max:22,step:.5,value:8,fmt:v=>f$(v,1),hint:'Sin comercio el precio interno es $14. Un precio mundial menor significa que el país importa; mayor, que exporta.'},
   {id:'t',label:'Arancel por unidad importada',min:0,max:8,step:.5,value:0,fmt:v=>f$(v,1),hint:'Solo tiene efecto si el país importa. Encarece el bien importado y protege a los productores locales.'}],
  build(s){
    const D=P=>(24-P)/2, S=P=>(P-4)/2, pw=s.pw, imp=pw<14, t=imp?Math.min(s.t,14-pw):0, pd=pw+t;
    const qd=D(pd), qs=S(pd), M=qd-qs, qdW=D(pw), qsW=S(pw);
    const els=[
     {k:'line',id:'d',color:'blue',w:3.6,pts:[[0,24],[12,0]],label:'Demanda',lp:0,legend:'Demanda interna',info:['Demanda interna','Cuánto quieren comprar los consumidores del país a cada precio.']},
     {k:'line',id:'s',color:'red',w:3.6,pts:[[0,4],[12,28]],label:'Oferta',lp:1,legend:'Oferta interna',info:['Oferta interna','Cuánto producen las empresas del país a cada precio.']},
     {k:'line',id:'pw',color:'teal',dash:'7 5',w:3,pts:[[0,pw],[12,pw]],label:{t:'Precio mundial',at:[12,pw],dx:-6,dy:-8,anchor:'end'},legend:'Precio mundial',info:['Precio mundial','El país es pequeño: toma el precio del mercado mundial. Con comercio libre, este es el precio interno.']},
     {k:'pt',id:'a',color:'gray',at:[5,14],r:6,label:{t:'Sin comercio',dx:8,dy:-8},legend:'Equilibrio sin comercio',info:['Equilibrio sin comercio','Precio $14 y cantidad 5: lo que ocurre en una economía cerrada.']}];
    let say, read;
    if(imp){
      if(t>0) els.push({k:'line',id:'ar',color:'amber',w:3,dash:'3 4',pts:[[0,pd],[12,pd]],label:{t:'Precio con arancel',at:[12,pd],dx:-6,dy:-8,anchor:'end'},legend:'Precio con arancel',info:['Precio con arancel','Precio mundial + arancel = '+f$(pd,1)+'. Los consumidores internos pagan este precio.']});
      els.push({k:'area',id:'imp',color:'purple',op:.25,pts:[[qs,pd],[qd,pd],[qd,pw],[qs,pw]],label:{t:'Importaciones '+fn(M,1),at:[(qs+qd)/2,(pd+pw)/2]},legend:t>0?'Ingreso del arancel':'Importaciones',info:t>0?['Ingreso del arancel','Arancel × unidades importadas = '+f$(t*M,1)+' mil. Lo cobra el gobierno.']:['Importaciones','Diferencia entre lo que se quiere comprar y lo que producen las empresas locales: '+fn(M,1)+' mil unidades.']});
      const dwl=t>0?.5*t*(qs-S(pw))+.5*t*(D(pw)-qd):0;
      if(t>0){ els.push({k:'area',id:'d1',color:'amber',op:.7,pts:[[S(pw),pw],[qs,pd],[qs,pw]],legend:'Pérdida irrecuperable (producir de más)',info:['Pérdida por producción ineficiente','Los productores locales fabrican unidades que cuestan más que el precio mundial.']});
        els.push({k:'area',id:'d2',color:'amber',op:.7,pts:[[qd,pd],[D(pw),pw],[qd,pw]],legend:'Pérdida irrecuperable (consumir de menos)',info:['Pérdida por consumo reducido','Los consumidores dejan de comprar unidades que valían más que el precio mundial.']}); }
      const cs0=.5*(24-14)*5, csW=.5*(24-pd)*qd, ps0=.5*(14-4)*5, psW=.5*(pd-4)*qs;
      read=[['Importaciones',fn(M,1)+' mil','purple'],['Cambio en excedente del consumidor',f$(csW-cs0,1),csW>=cs0?'green':'red'],['Cambio en excedente del productor',f$(psW-ps0,1),psW>=ps0?'green':'red'],['Ingreso del arancel',f$(t*M,1),'amber']];
      say=`<p>Con precio mundial ${f$(pw,1)} (menor que el interno de $14) el país <b>importa</b> ${fn(M,1)} mil unidades. Los <b>consumidores ganan</b> (precio menor) y los <b>productores locales pierden</b> (venden menos y más barato). La suma es positiva: las <b>ganancias del comercio</b>.</p>`+(t>0?`<p>El arancel de ${f$(t,1)} sube el precio interno a ${f$(pd,1)}: protege a los productores, da ingresos al gobierno, pero los consumidores pierden más: la <b>pérdida irrecuperable</b> es ${f$(dwl,1)} mil.</p>`:'<p>Prueba agregar un arancel.</p>');
    } else {
      els.push({k:'area',id:'exp',color:'green',op:.25,pts:[[qdW,pw],[qsW,pw],[qsW,14],[qdW,14]],legend:'Exportaciones',info:['Exportaciones','Lo que producen las empresas locales por encima de lo que consumen los locales: '+fn(qsW-qdW,1)+' mil.']});
      read=[['Exportaciones',fn(qsW-qdW,1)+' mil','green']];
      say=`<p>Con precio mundial ${f$(pw,1)} (mayor que $14) el país <b>exporta</b> ${fn(qsW-qdW,1)} mil unidades. Ganan los <b>productores</b> (venden más y más caro) y pierden los <b>consumidores</b> (pagan más). El país en conjunto gana.</p>`;
    }
    return {els,read,say};
  }
};
CHAPTERS.push({id:20,title:'El comercio internacional',
teaser:'Ganancias del comercio, importaciones y exportaciones, aranceles y los argumentos a favor del proteccionismo.',
bigq:'¿Por qué comerciar con otros países nos beneficia, quién gana y quién pierde, y por qué muchos gobiernos protegen a sus industrias?',
learn:['Explicar por qué se comercia (ventaja comparativa).','Identificar ganadores y perdedores de importar y exportar.','Analizar aranceles y cuotas.','Evaluar los argumentos proteccionistas.'],
html:`
<h2>1. Cómo funciona el comercio internacional</h2>
<p>Los bienes y servicios que compramos del exterior son <b>importaciones</b>; los que vendemos, <b>exportaciones</b>. El comercio surge por la <b>ventaja comparativa</b> del capítulo 2: cada país produce lo que le cuesta menos sacrificar y lo intercambia. Así, todos pueden consumir más de lo que producirían aislados. Un país importa un bien si su <b>precio mundial</b> es menor que su precio interno sin comercio, y lo exporta si es mayor.</p>
<h2>2. Ganadores y perdedores</h2>
<p>Cuando el precio mundial es <b>menor</b> que el interno, el país importa. Los <b>consumidores</b> se benefician (menor precio, más cantidad) y los <b>productores locales</b> pierden (venden menos y a menor precio). Pero la ganancia de los consumidores supera la pérdida de los productores: hay <b>ganancia neta</b>. Con exportaciones, ocurre lo contrario: ganan los productores, pierden los consumidores, y el país gana en conjunto.</p>
${fig('c20_trade')}
<h2>3. Restricciones al comercio</h2>
<h3>Aranceles</h3>
<p>Un <b>arancel</b> es un impuesto a las importaciones. Eleva el precio interno, aumenta la producción local, reduce el consumo y las importaciones, y genera ingreso para el gobierno. Pero causa <b>pérdida irrecuperable</b> (dos triángulos) y los consumidores pierden más de lo que ganan los productores y el gobierno.</p>
<h3>Cuotas de importación</h3>
<p>Una <b>cuota</b> limita la cantidad que se puede importar. Sus efectos en precios y cantidades son parecidos a los de un arancel, pero el «ingreso» (la diferencia de precios) lo reciben los importadores con licencia o el gobierno extranjero, no el gobierno nacional.</p>
<h2>4. Argumentos a favor de restringir el comercio</h2>
<ul>
<li><b>Seguridad nacional:</b> no depender del exterior en bienes estratégicos.</li>
<li><b>Industrias nuevas (infantes):</b> proteger un tiempo para que aprendan y se vuelvan competitivas. Se argumenta con la ventaja comparativa dinámica.</li>
<li><b>Competencia desleal / dumping:</b> vender por debajo del costo para eliminar rivales.</li>
<li><b>Salvar empleos:</b> real pero visible solo en un sector; los costos recaen en los consumidores, y en otras industrias se pierden empleos de exportación.</li>
<li><b>Diversificación, impuestos y cultura</b>, entre otros.</li>
</ul>
<p>Los economistas suelen ser escépticos: casi siempre existen políticas más eficientes (subsidios directos, capacitación) que restringir el comercio. Y las <b>represalias</b> de otros países pueden dejar a todos peor. Aun así, los efectos distributivos importan: quienes pierden con la apertura suelen estar concentrados y organizados, y por eso presionan por protección (elección pública, capítulo 14).</p>
${warn('<p>«Importar quita empleos» y «exportar da empleos» son medias verdades. El comercio mueve trabajo de unos sectores a otros. Lo relevante es que el país en conjunto gana y se puede compensar a los perdedores.</p>')}
`,
terms:[['Importación / exportación','Compra / venta de bienes al exterior.'],['Precio mundial','Precio al que se comercia en el mercado internacional.'],['Arancel','Impuesto a las importaciones.'],['Cuota de importación','Límite a la cantidad importada.'],['Dumping','Vender en el exterior por debajo del costo.'],['Ganancias del comercio','Aumento del excedente total por comerciar.']],
quiz:[
 {q:'Si el precio mundial es menor que el interno sin comercio, el país:',o:['Importa el bien','Exporta el bien','No comercia','Prohíbe el bien'],a:0,why:'Es más barato comprarlo afuera que producirlo adentro.'},
 {q:'Con importaciones, quienes ganan son:',o:['Los consumidores','Los productores locales','Nadie','Solo el gobierno'],a:0,why:'Pagan un precio menor y consumen más; los productores locales pierden.'},
 {q:'Un arancel genera:',o:['Pérdida irrecuperable y beneficios para productores locales y gobierno','Más importaciones','Menores precios internos','Un aumento del excedente del consumidor'],a:0,why:'Sube el precio interno: ganan productores y fisco, pierden consumidores más de lo que se gana.'},
 {q:'El argumento de la industria naciente se basa en:',o:['Ventaja comparativa dinámica','Ventaja absoluta','Menores impuestos','Mayor consumo'],a:0,why:'Protegiendo temporalmente, la industria aprende y puede volverse competitiva.'}]});
