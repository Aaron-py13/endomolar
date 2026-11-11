/* Endomolar · Portal del Paciente · PROTOTIPO ESTÁTICO.
   Toda la información es ficticia. No se conecta a la clínica ni protege datos reales.
   Nunca usar este login demostrativo con pacientes reales. */
(() => {
  'use strict';
  const UNIFIED_KEY = 'dentalflow_unified_auth_demo_v1';
  let currentUser=null;
  try{currentUser=JSON.parse(sessionStorage.getItem(UNIFIED_KEY))}catch{}
  if(!currentUser&&window.name.startsWith('DentalFlowDemo:')){
    try{currentUser=JSON.parse(window.name.slice('DentalFlowDemo:'.length));sessionStorage.setItem(UNIFIED_KEY,JSON.stringify(currentUser))}catch{}
  }
  window.name='';
  const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const displayName = () => currentUser?.kind === 'new' ? currentUser.name : 'Valeria Ramos';
  const initials = name => String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0].toUpperCase()).join('');
  const $ = (selector, root=document) => root.querySelector(selector);
  const app = $('#app');
  let page = 'inicio';
  let selectedTooth = '11';
  let toastTimeout;

  const svg = (name, extra='') => `<svg class="icon ${extra}" aria-hidden="true" focusable="false"><use href="#ico-${name}"></use></svg>`;
  const money = n => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(n);
  const nav = [
    ['inicio','home','Inicio'],
    ['tratamientos','activity','Mi tratamiento'],
    ['citas','calendar','Mis citas'],
    ['odontograma','tooth','Odontograma'],
    ['pagos','wallet','Mis pagos'],
    ['perfil','user','Mi perfil']
  ];
  const milestones = [
    ['Evaluación inicial','10 de junio de 2026','done'],
    ['Diagnóstico y planificación','24 de junio de 2026','done'],
    ['Inicio del tratamiento','08 de julio de 2026','done'],
    ['Control y ajustes 1','05 de agosto de 2026','done'],
    ['Control y ajustes 2','02 de septiembre de 2026','done'],
    ['Control y ajustes 3','04 de noviembre de 2026','done'],
    ['Control y revisión 4','24 de noviembre de 2026','current'],
    ['Control y ajustes 5','Pendiente de programación','todo'],
    ['Evaluación final','Pendiente de programación','todo'],
    ['Cierre del tratamiento','Pendiente de programación','todo']
  ];
  const statusRecords = { '16': { type:'watch',title:'Pieza 16 · En seguimiento',text:'El odontólogo registró una revisión de esta pieza. Consulta las observaciones en tu próxima cita.' }, '36': { type:'watch',title:'Pieza 36 · En seguimiento',text:'Se mantiene bajo observación durante los controles programados.' }, '11':{type:'checked',title:'Pieza 11 · Evaluada',text:'Pieza evaluada en la última consulta. Sin nuevas indicaciones registradas.'}, '21':{type:'checked',title:'Pieza 21 · Evaluada',text:'Pieza evaluada durante el seguimiento del tratamiento.'} };
  const toothNumbers = [
    ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'],
    ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38']
  ];
  function toast(message){
    const t=$('#toast');
    t.textContent=message;t.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout=setTimeout(()=>t.classList.remove('show'),3200);
  }
  function login(){window.DentalFlowDemo.logout()}
  function navButton(item,className){
    return `<button type="button" class="${className}${item[0]===page?' active':''}" data-nav="${item[0]}" aria-current="${item[0]===page?'page':'false'}">${svg(item[1])}<span>${item[2]}</span></button>`;
  }
  function renderShell(){
    app.innerHTML = `<div class="portal-shell"><aside class="sidebar" aria-label="Navegación de paciente"><a href="index.html" class="side-brand" aria-label="Endomolar, inicio de la demo"><span class="brand-icon">${svg('tooth')}</span><span>Endo<span class="brand-purple">molar</span></span><sup>DEMO</sup></a>
      <div class="clinic-mini"><span class="clinic-icon">${svg('tooth','small-ico')}</span><div><span>${currentUser?.kind==='new'?'CLÍNICA':'TU CLÍNICA'}</span><strong>${currentUser?.kind==='new'?(linkedData()?'Endomolar':'Sin vincular'):'Endomolar'}</strong></div></div><div class="side-label">MI ESPACIO</div><nav class="nav-list">${nav.map(i=>navButton(i,'nav-item')).join('')}</nav>
      <div class="sidebar-tip"><div class="tip-icon">${svg('shield','small-ico')}</div><strong>Diseñado para ti</strong><p>En la versión final, solo tú podrías consultar tus datos clínicos.</p></div><button class="logout" data-logout="1" type="button">${svg('logout')}<span>Cerrar sesión</span></button></aside>
      <div class="portal-main"><header class="topbar"><div class="topbar-left"><span>Mi espacio</span>${svg('chevron','small-ico')}<b id="breadcrumb">Inicio</b></div><div class="topbar-right"><span class="topbar-demo">MODO DEMOSTRACIÓN</span><button type="button" class="notification" id="notification" aria-label="Notificaciones">${svg('bell','small-ico')}</button><button type="button" class="profile-short" data-nav="perfil" aria-label="Ir a mi perfil"><span class="avatar">${esc(initials(displayName()))}</span><div><b>${esc(displayName())}</b><small>Paciente</small></div></button></div></header>
      <main id="page-container" class="page-container"></main></div></div>
      <nav class="mobile-nav" aria-label="Navegación móvil">${nav.filter(x=>x[0]!=='perfil').map(i=>navButton(i,'mobile-link')).join('')}</nav>`;
    renderPage();
  }
  function pageHeading(label,title,desc){return `<header class="subpage-head"><div class="intro-label"><span class="eyebrow-dot"></span>${label}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${desc}</p></header>`;}
  function note(){return `<div class="note-line">${svg('info')} <span><b>Información de demostración.</b> Los datos de la cuenta predefinida son ficticios y no están vinculados al dashboard. Las cuentas nuevas pueden compartir registros de prueba en este mismo navegador.</span></div>`;}
  function heading(title,desc='',button=''){
    return `<header class="section-heading"><div><h2>${title}</h2>${desc?`<p>${desc}</p>`:''}</div>${button?`<button type="button" class="btn btn-link" data-nav="${button}">Ver todo ${svg('arrow','small-ico')}</button>`:''}</header>`;
  }
  function timelineItem(item){
    const [name,date,state] = item;
    const icon = state==='done'?'check':state==='current'?'clock':'calendar';
    return `<div class="milestone"><span class="mile-dot ${state==='current'?'current':state==='todo'?'upcoming':''}">${svg(icon)}</span><div><strong>${name}</strong><p>${date}</p></div></div>`;
  }
  function home(){
    return `<div class="welcome-header"><div class="intro-label"><span class="eyebrow-dot"></span> TU ESPACIO PERSONAL</div><h1>¡Hola, <span>Valeria!</span> 👋</h1><p>Aquí puedes seguir cada paso de tu sonrisa. Qué bueno tenerte por aquí.</p></div>
    <div class="hero-grid"><section class="progress-hero" aria-label="Avance del tratamiento"><div class="hero-tooth">${svg('tooth')}</div><div class="hero-eyebrow">TRATAMIENTO EN CURSO</div><h2>Tu sonrisa está avanzando</h2><p>Ortodoncia · Plan personalizado</p><div class="progress-figure"><strong>60%</strong><span>6 de 10 etapas completadas</span></div><div class="progress-track" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Avance del tratamiento"><i></i></div><button type="button" class="progress-action" data-nav="tratamientos">Ver mi tratamiento ${svg('arrow','small-ico')}</button></section>
      <section class="card appointment-hero"><div class="appointment-title"><strong>Tu próxima cita</strong><span class="badge badge-green"><i class="dot"></i> Confirmada</span></div><div class="cal-icon">${svg('calendar')}</div><h2>24 de noviembre</h2><p>Martes · 10:30 a. m. · 2026</p><div class="appointment-detail"><span>${svg('clock','small-ico')} Control de ortodoncia</span><button class="btn btn-link" data-nav="citas" aria-label="Ver detalles de citas">${svg('chevron')}</button></div></section></div>
    <div class="info-grid"><section class="card info-card"><span class="info-icon">${svg('activity')}</span><div><small>Tratamiento activo</small><strong>Ortodoncia</strong></div></section><section class="card info-card"><span class="info-icon">${svg('check')}</span><div><small>Etapas completadas</small><strong>6 de 10</strong></div></section><section class="card info-card"><span class="info-icon">${svg('wallet')}</span><div><small>Pagos realizados</small><strong>${money(900)}</strong></div></section></div>
    <div class="bottom-grid"><section class="card milestones-card">${heading('Tu evolución','Estos son tus últimos avances.','tratamientos')}${milestones.slice(3,7).map(timelineItem).join('')}</section>
    <section class="card quick-card">${heading('Mi odontograma','Consulta la información de tus piezas dentales.')}<div class="quick-art"><div><b>Tu salud, a la vista.</b><p>Conoce tu registro odontológico de forma sencilla.</p></div>${svg('tooth')}</div><button class="btn btn-outline" data-nav="odontograma">Ver mi odontograma ${svg('arrow','small-ico')}</button></section></div>${note()}`;
  }
  function treatments(){
    return `${pageHeading('MI TRATAMIENTO','Mi tratamiento','Consulta el plan de atención, tu progreso y las etapas que has completado.')}
    <div class="treatment-summary"><section class="card surface-pad treatment-overview"><span class="badge badge-purple">${svg('activity','small-ico')} En proceso</span><h2>Plan de ortodoncia</h2><p>Plan de seguimiento ficticio organizado por etapas y controles programados.</p><div class="treatment-progress"><div class="treatment-progress-head"><span>Progreso general</span><b>60%</b></div><div class="treatment-track" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Tratamiento completado"><span></span></div><p style="margin-top:9px">6 de 10 etapas completadas</p></div></section><section class="card surface-pad summary-doctor">${svg('user')}<div><span>ODONTÓLOGA ASIGNADA</span><h2 style="font-size:20px;margin:9px 0 0">Dra. Mariana Solís</h2><p>Seguimiento de ortodoncia</p></div></section></div>
    <section class="card surface-pad main-section">${heading('Etapas de mi tratamiento','Historial de avance registrado para la demostración.')}
    <div class="steps-list">${milestones.map((step,i)=>`<div class="step-row"><div class="step-icon ${step[2]}">${svg(step[2]==='done'?'check':step[2]==='current'?'clock':'calendar','small-ico')}</div><div class="step-text"><strong>${String(i+1).padStart(2,'0')} · ${step[0]}</strong><p>${step[1]}</p></div><span class="step-status">${step[2]==='done'?'Completado':step[2]==='current'?'Próximo':'Pendiente'}</span></div>`).join('')}</div></section>${note()}`;
  }
  function appointment(date,month,title,time,doctor,status,upcoming=true){
    return `<article class="card apt-row"><div class="date-tile"><strong>${date}</strong><span>${month}</span></div><div class="apt-text"><strong>${title}</strong><p>${svg('clock')} ${time} · ${doctor}</p><p>${svg('location')} Endomolar (dirección de ejemplo)</p></div><span class="badge ${upcoming?'badge-green':'badge-gray'}">${status}</span></article>`;
  }
  function appointments(){
    return `${pageHeading('MIS CITAS','Mis próximas citas','Organiza tus visitas y revisa las consultas registradas.')}<section class="main-section" style="margin-top:0">${heading('Próximas citas','Las citas son ejemplos y no corresponden a una agenda real.')}
      <div class="appointment-list">${appointment('24','NOV','Control de ortodoncia','10:30 a. m.','Dra. Mariana Solís','Confirmada')}${appointment('15','DIC','Seguimiento de tratamiento','11:00 a. m.','Dra. Mariana Solís','Programada')}</div></section>
      <section class="main-section">${heading('Consultas anteriores','Registro ficticio de atenciones realizadas.')}<div class="appointment-list">${appointment('04','NOV','Control y ajustes 3','09:00 a. m.','Dra. Mariana Solís','Finalizada',false)}</div></section>${note()}`;
  }
  function toothButton(number){
    const status=statusRecords[number]?.type||'default';
    return `<button type="button" class="tooth-btn ${status}${selectedTooth===number?' selected':''}" data-tooth="${number}" aria-label="Consultar pieza ${number}" aria-pressed="${selectedTooth===number?'true':'false'}">${svg('tooth')}<small>${number}</small></button>`;
  }
  function toothDetail(){
    const record=statusRecords[selectedTooth];
    return `<div class="tooth-detail"><span class="tooth-detail-icon">${svg('tooth')}</span><div><b>${record?record.title:'Pieza '+selectedTooth+' · Sin observaciones registradas'}</b><p>${record?record.text:'No hay observaciones de demostración para esta pieza. Selecciona otra para conocer su estado.'}</p></div></div>`;
  }
  function odontogram(){
    return `${pageHeading('MI SALUD DENTAL','Mi odontograma','Selecciona una pieza para ver su estado de demostración. No sustituye una evaluación odontológica.')}
    <section class="card tooth-panel"><div class="section-heading"><div><h2>Mi registro dental</h2><p>Vista de ejemplo del odontograma del paciente.</p></div><span class="badge badge-purple">32 piezas</span></div>
      <div class="tooth-legend"><span><i class="legend-circle"></i> Sin observaciones</span><span><i class="legend-circle checked"></i> Evaluada</span><span><i class="legend-circle watch"></i> En seguimiento</span></div>
      <div class="tooth-group-title">ARCADA SUPERIOR</div><div class="tooth-row">${toothNumbers[0].map(toothButton).join('')}</div><div class="arch-divider"></div><div class="tooth-group-title">ARCADA INFERIOR</div><div class="tooth-row">${toothNumbers[1].map(toothButton).join('')}</div><div id="tooth-detail">${toothDetail()}</div>
      <p class="mini-chart-note" style="margin:18px 0 0">La numeración de las piezas utiliza el sistema FDI. Todos los estados son ficticios.</p></section>${note()}`;
  }
  function paymentHistory(label,date,amount){
    return `<article class="card payment-row"><div class="payment-circle">${svg('check')}</div><div><strong>${label}</strong><p>${date} · Pago de ejemplo</p></div><span class="payment-amount">+ ${money(amount)}</span></article>`;
  }
  function payments(){
    return `${pageHeading('MIS PAGOS','Estado de mis pagos','Revisa los importes asociados a tu tratamiento y los abonos registrados.')}
      <div class="payment-grid"><section class="card payment-summary"><span>Costo del plan</span><strong>${money(1800)}</strong><small>Importe total del ejemplo</small></section><section class="card payment-summary"><span>Total abonado</span><strong>${money(900)}</strong><small>3 pagos de demostración</small></section><section class="card payment-summary highlight"><span>Saldo por pagar</span><strong>${money(900)}</strong><small>Información ficticia</small></section></div>
      <section class="main-section">${heading('Historial de pagos','Movimientos de ejemplo, sin transacciones reales.')}<div class="payment-history">${paymentHistory('Tercer abono','05 de noviembre de 2026',300)}${paymentHistory('Segundo abono','12 de agosto de 2026',300)}${paymentHistory('Primer abono','10 de junio de 2026',300)}</div></section>${note()}`;
  }
  function profile(){
    return `${pageHeading('MIS DATOS','Mi perfil','Así podría verse la información vinculada a tu cuenta personal.')}
      <div class="profile-wrap"><section class="card profile-card"><div class="profile-head"><div class="profile-avatar">VR</div><div><h2>Valeria Ramos</h2><p>Paciente de Endomolar · Cuenta de prueba</p></div></div><div class="profile-fields"><div class="profile-field"><label>Identificador</label><strong>DF-PAC-0021</strong></div><div class="profile-field"><label>Correo electrónico</label><strong>paciente@demo.com</strong></div><div class="profile-field"><label>Clínica</label><strong>Endomolar</strong></div><div class="profile-field"><label>Odontóloga asignada</label><strong>Dra. Mariana Solís</strong></div></div><button type="button" class="btn btn-outline" data-logout="1" style="margin-top:30px">${svg('logout','small-ico')} Cerrar sesión de prueba</button></section>
      <aside class="card profile-side">${svg('shield')}<h3>Tu información es importante</h3><p>En una versión real, el acceso se protegería mediante autenticación en el servidor y cada paciente tendría permisos solo para su propio historial.</p><p style="margin-top:13px"><b>Esta vista es una maqueta funcional.</b> No ingreses información personal o clínica verdadera.</p></aside></div>${note()}`;
  }
  // Lectura del mismo estado local del dashboard. Exclusivamente para la demo.
  const CLINIC_STORE='dentalflow_dashboard_local_v1';
  function linkedData(){
    if(currentUser?.kind!=='new'||!currentUser?.patientId)return null;
    let db;try{db=JSON.parse(localStorage.getItem(CLINIC_STORE)||'null')}catch{return null}
    if(!db||!Array.isArray(db.patients))return null;
    const patient=db.patients.find(x=>x.id===currentUser.patientId);
    if(!patient)return null;
    const filter=type=>(Array.isArray(db[type])?db[type]:[]).filter(x=>x.patientId===patient.id);
    return {db,patient,treatments:filter('treatments'),appointments:filter('appointments'),payments:filter('payments'),history:filter('dentalHistory')};
  }
  const shortDate=v=>{if(!v)return 'Sin fecha';const d=new Date(v+'T12:00:00');return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'})};
  const pct=t=>Array.isArray(t.steps)&&t.steps.length?Math.round(t.steps.filter(s=>s.done).length*100/t.steps.length):Number(t.progress)||0;
  const cash=x=>Number(x)||0;
  function linkedNote(){return `<div class="note-line">${svg('info')} <span><b>Vista conectada para demostración.</b> Los registros se comparten solo en este navegador y en el mismo sitio local. Usa exclusivamente información ficticia.</span></div>`}
  function linkedEmpty(title,message){return `<section class="card new-empty"><span class="new-empty-icon">${svg('activity')}</span><h2>${title}</h2><p>${message}</p></section>`}
  function linkedPage(data){
    const {patient:p,db,treatments:ts,appointments:as,payments:ps,history:hs}=data;
    const doctor=db.staff?.find(x=>x.id===p.doctorId)?.name||'Por asignar';
    const rows=(title,items)=>`<section class="card surface-pad main-section">${heading(title)}<div class="linked-list">${items}</div></section>`;
    const upcoming=[...as].filter(a=>a.date>=new Date().toISOString().slice(0,10)&&a.status!=='Cancelada').sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
    const next=upcoming[0];
    const total=ts.reduce((n,t)=>n+cash(t.price),0),paid=ps.reduce((n,v)=>n+cash(v.amount),0);
    const balance=ts.reduce((n,t)=>n+Math.max(0,cash(t.price)-ps.filter(x=>x.treatmentId===t.id).reduce((s,v)=>s+cash(v.amount),0)),0);
    const planRows=ts.map(t=>{const progress=pct(t);const steps=Array.isArray(t.steps)?t.steps:[];return `<article class="linked-item"><div class="linked-top"><strong>${esc(t.title)}</strong><span class="badge badge-purple">${esc(t.status||'Pendiente')}</span></div><p>Pieza: ${esc(t.tooth||'—')} · Avance: <b>${progress}%</b></p><div class="linked-track"><span style="width:${Math.max(0,Math.min(100,progress))}%"></span></div>${steps.length?`<p>${steps.filter(x=>x.done).length} de ${steps.length} etapas completadas</p>`:''}</article>`}).join('')||'<p>Aún no hay planes de tratamiento registrados por tu odontólogo.</p>';
    const appointmentRows=[...as].sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)).map(a=>`<article class="linked-item"><div class="linked-top"><strong>${esc(a.type)}</strong><span class="badge badge-purple">${esc(a.status)}</span></div><p>${esc(shortDate(a.date))} · ${esc(a.time)} · ${esc(doctor)}</p></article>`).join('')||'<p>La clínica todavía no ha programado citas.</p>';
    const paymentRows=[...ps].sort((a,b)=>b.date.localeCompare(a.date)).map(v=>`<article class="linked-item"><div class="linked-top"><strong>${esc(v.concept)}</strong><b>${money(cash(v.amount))}</b></div><p>${esc(shortDate(v.date))} · ${esc(v.method||'Pago')}</p></article>`).join('')||'<p>No hay pagos de demostración registrados.</p>';
    if(page==='inicio')return `${pageHeading('MI ESPACIO',`¡Hola, ${esc(displayName().split(' ')[0])}!`,'Esta es la información que el odontólogo registró en tu expediente de prueba.')}
      <div class="linked-summary"><section class="card info-card"><span class="info-icon">${svg('activity')}</span><div><small>Tratamientos</small><strong>${ts.length}</strong></div></section><section class="card info-card"><span class="info-icon">${svg('calendar')}</span><div><small>Próxima cita</small><strong>${esc(next?shortDate(next.date):'Sin citas')}</strong></div></section><section class="card info-card"><span class="info-icon">${svg('wallet')}</span><div><small>Total abonado</small><strong>${money(paid)}</strong></div></section></div>
      ${rows('Mis tratamientos',planRows)}${rows('Mis próximas citas',upcoming.length?`<p>${esc(shortDate(next.date))} · ${esc(next.time)} · ${esc(next.type)}</p>`:'<p>La clínica todavía no ha programado citas.</p>')}${linkedNote()}`;
    if(page==='tratamientos')return `${pageHeading('MI TRATAMIENTO','Mis tratamientos','Planes y avances registrados por el odontólogo en esta demostración.')}${rows('Planes y etapas',planRows)}${linkedNote()}`;
    if(page==='citas')return `${pageHeading('MIS CITAS','Mis citas','Consultas programadas por la clínica.')}${rows('Historial de citas',appointmentRows)}${linkedNote()}`;
    if(page==='pagos')return `${pageHeading('MIS PAGOS','Mis pagos','Movimientos de prueba registrados en la clínica.')}<div class="linked-summary"><section class="card info-card"><div><small>Presupuesto</small><strong>${money(total)}</strong></div></section><section class="card info-card"><div><small>Abonado</small><strong>${money(paid)}</strong></div></section><section class="card info-card"><div><small>Saldo según planes</small><strong>${money(balance)}</strong></div></section></div>${rows('Movimientos',paymentRows)}${linkedNote()}`;
    if(page==='perfil')return `${pageHeading('MI CUENTA','Mi perfil','Datos del registro web de prueba.')}
      <section class="card new-profile"><div class="new-avatar">${esc(initials(p.name))}</div><h2>${esc(p.name)}</h2><p>${esc(p.email)}</p><span class="badge badge-purple">Vinculado a Endomolar (demo)</span><div class="new-profile-foot">Odontólogo asignado: <b>${esc(doctor)}</b></div></section>${linkedNote()}`;
    if(page==='odontograma'){
      const conditions={sano:['Evaluado sin hallazgos','checked'],caries:['Caries','watch'],restauracion:['Restauración','watch'],endodoncia:['Tratamiento de conductos','watch'],ausente:['Pieza ausente','watch'],corona:['Corona','watch'],fractura:['Fractura','watch'],otro:['Otro hallazgo','watch']};
      const latestByTooth={};[...hs].sort((a,b)=>(a.recordedAt||a.date||'').localeCompare(b.recordedAt||b.date||'')).forEach(h=>{latestByTooth[h.tooth]=h});
      const toothHtml=number=>{const h=latestByTooth[number],type=h?(conditions[h.condition]?.[1]||'watch'):'default';return `<button type="button" class="tooth-btn ${type} ${selectedTooth===number?'selected':''}" data-tooth="${number}" aria-label="Consultar pieza ${number}" aria-pressed="${selectedTooth===number}">${svg('tooth')}<small>${number}</small></button>`};
      const h=latestByTooth[selectedTooth];
      const detail=h?`${esc(conditions[h.condition]?.[0]||'Hallazgo registrado')}. ${esc(h.note||'Sin observación')}`:'Sin registros para esta pieza. No significa que haya sido evaluada ni que esté sana.';
      return `${pageHeading('MI SALUD DENTAL','Mi odontograma','Consulta los hallazgos anotados en tu expediente de demostración.')}<section class="card tooth-panel"><div class="section-heading"><div><h2>Mi registro dental</h2><p>${hs.length} hallazgos registrados · Selecciona un diente</p></div></div><div class="tooth-group-title">ARCADA SUPERIOR</div><div class="tooth-row">${toothNumbers[0].map(toothHtml).join('')}</div><div class="arch-divider"></div><div class="tooth-group-title">ARCADA INFERIOR</div><div class="tooth-row">${toothNumbers[1].map(toothHtml).join('')}</div><div id="tooth-detail" class="tooth-detail"><span class="tooth-detail-icon">${svg('tooth')}</span><div><b>Pieza ${selectedTooth}</b><p>${detail}</p></div></div></section>${linkedNote()}`;
    }
    return linkedEmpty('Sin información disponible','La clínica todavía no ha registrado datos.');
  }
  function emptyPage(){
    const titles={inicio:'Bienvenido a tu espacio',tratamientos:'Mis tratamientos',citas:'Mis citas',odontograma:'Mi odontograma',pagos:'Mis pagos',perfil:'Mi perfil'};
    const label=page==='inicio'?'MI ESPACIO':page==='perfil'?'MI CUENTA':'SECCIÓN DEL PACIENTE';
    if(page==='perfil')return `${pageHeading(label,'Mi perfil','Información de tu cuenta de demostración')}<section class="card new-profile"><div class="new-avatar">${esc(initials(displayName()))}</div><h2>${esc(displayName())}</h2><p>${esc(currentUser.email)}</p><span class="badge badge-purple">Cuenta de demostración</span><div class="new-profile-foot">La clínica de prueba aún no ha importado tu cuenta. Entra como doctor y vuelve a revisar.</div></section>${note()}`;
    const detail=page==='inicio'?'Has creado tu cuenta de prueba. Entra como doctor de demostración para que se agregue tu registro a Pacientes. Después podrás consultarlo aquí.':`Todavía no hay registros vinculados a esta cuenta de demostración. En una versión real, la clínica tendría que verificar tu identidad y asociar tu expediente.`;
    return `${pageHeading(label,titles[page],page==='inicio'?`¡Hola, ${esc(displayName().split(' ')[0])}!`:'Consulta tu información desde un solo lugar.')}<section class="card new-empty"><span class="new-empty-icon">${svg(page==='citas'?'calendar':page==='pagos'?'wallet':page==='odontograma'?'tooth':'user')}</span><h2>${page==='inicio'?'Tu cuenta está lista': 'Aún no tienes información disponible'}</h2><p>${detail}</p><div class="new-empty-tag">✓ Cuenta de paciente creada · Solo demostración</div></section>${note()}`;
  }
  const pages={inicio:home,tratamientos:treatments,citas:appointments,odontograma:odontogram,pagos:payments,perfil:profile};
  const pageLabels={inicio:'Inicio',tratamientos:'Mi tratamiento',citas:'Mis citas',odontograma:'Odontograma',pagos:'Mis pagos',perfil:'Mi perfil'};
  function renderPage(){
    const content=$('#page-container');if(!content)return;
    const linked=linkedData();
    content.innerHTML=currentUser?.kind==='new'?(linked?linkedPage(linked):emptyPage()):pages[page]();
    $('#breadcrumb').textContent=pageLabels[page];
    document.querySelectorAll('[data-nav]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.nav===page);
      if(btn.classList.contains('nav-item') || btn.classList.contains('mobile-link')){
        btn.setAttribute('aria-current',btn.dataset.nav===page?'page':'false');
      }
    });
    window.scrollTo({top:0,behavior:'auto'});
  }
  document.addEventListener('click',event=>{
    const n=event.target.closest('[data-nav]');
    if(n&&pages[n.dataset.nav]){page=n.dataset.nav;renderPage();return;}
    const t=event.target.closest('[data-tooth]');
    if(t){selectedTooth=t.dataset.tooth;if(currentUser?.kind==='new'){renderPage();return;}document.querySelectorAll('.tooth-btn').forEach(el=>{const active=el.dataset.tooth===selectedTooth;el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active));});$('#tooth-detail').innerHTML=toothDetail();return;}
    if(event.target.closest('[data-logout]')){
      try{sessionStorage.removeItem(UNIFIED_KEY);}catch(e){}
      currentUser=null;window.name='';window.DentalFlowDemo.logout();return;
    }
    if(event.target.closest('#notification'))toast('Demo: no hay notificaciones reales.');
  });
  if(currentUser?.role==='paciente')renderShell();else login();

  window.addEventListener('storage',event=>{if(event.key===CLINIC_STORE&&currentUser?.kind==='new')renderPage()});
  window.addEventListener('focus',()=>{if(currentUser?.kind==='new')renderPage()});
})();
