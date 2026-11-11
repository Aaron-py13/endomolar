/* Endomolar DEMO local. Un solo index.html; sin localhost ni servidor.
   Únicamente datos inventados; NO usar pacientes reales. */
window.DentalFlowDemo = {
 open(role){
  const root=document.getElementById('login-root');
  const area=document.getElementById('workspace');
  root.style.display='none';
  area.style.display='block';
  // Se activan solo los estilos de la vista que abrió sesión.
  document.querySelector('link[href="styles.css"]').disabled=true;
  area.innerHTML=role==='clinica'?
   '<div id="app"></div><div id="modal-root"></div><div id="toast-root" aria-live="polite"></div>':
   document.getElementById('patient-symbols').innerHTML+'<div id="app"></div><div id="toast" role="status" aria-live="polite"></div>';
  const style=document.createElement('link');style.rel='stylesheet';style.href=role+'/styles.css';document.head.appendChild(style);
  const script=document.createElement('script');script.src=role+'/app.js';document.body.appendChild(script);
 },
 logout(){
  sessionStorage.removeItem('dentalflow_unified_auth_demo_v1');
  sessionStorage.removeItem('dentalflow_dashboard_session_v1');
  window.name='';
  // Restablece la vista y los eventos sin tocar los datos de demostración.
  location.reload();
 }
};
/* SOLO DEMO: acceso simulado sin servidor. NUNCA guardar datos reales de salud aquí. */
(()=>{
 'use strict';
 const SESSION='dentalflow_unified_auth_demo_v1';
 const CLINIC_SESSION='dentalflow_dashboard_session_v1';
 const ACCOUNTS='dentalflow_patient_demo_accounts_v1';
 // DEMO: los registros de pacientes se mostrarán en la clínica de prueba c1.
 const DEFAULT_CLINIC='c1', DEFAULT_DOCTOR='s2';
 const STAFF=[
  ['admin@sonrisa.demo','c1','s1'],['carlos@sonrisa.demo','c1','s2'],['valeria@sonrisa.demo','c1','s3'],['lucia@sonrisa.demo','c1','s4'],['ana@sonrisa.demo','c1','s5'],
  ['javier@nova.demo','c2','s6'],['diego@nova.demo','c2','s7'],['elena@nova.demo','c2','s8'],['sara@nova.demo','c2','s9']
 ];
 const $=selector=>document.querySelector(selector);
 const norm=s=>String(s||'').trim().toLowerCase();
 const readAccounts=()=>{try{const x=JSON.parse(localStorage.getItem(ACCOUNTS)||'[]');return Array.isArray(x)?x:[]}catch{return []}};
 const writeAccounts=accounts=>localStorage.setItem(ACCOUNTS,JSON.stringify(accounts));
 const bytesToHex=arr=>Array.from(arr,b=>b.toString(16).padStart(2,'0')).join('');
 const hexToBytes=hex=>new Uint8Array((hex.match(/.{2}/g)||[]).map(v=>parseInt(v,16)));
 async function derive(password,salt){
  if(!globalThis.crypto?.subtle)throw new Error('Este navegador requiere HTTPS o un contexto seguro para registrar cuentas de prueba.');
  const encoder=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
  return bytesToHex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:hexToBytes(salt),iterations:120000,hash:'SHA-256'},key,256)));
 }
 function show(which){
  $('#login-view').hidden=which!=='login';$('#register-view').hidden=which!=='register';
  $('#login-error').textContent='';$('#register-error').textContent='';
  document.title=which==='login'?'Endomolar | Iniciar sesión':'Endomolar | Crear cuenta de paciente';
 }
 function enter(auth){
  sessionStorage.setItem(SESSION,JSON.stringify(auth));
  // window.name es un respaldo solo para abrir archivos locales en la misma pestaña.
  try{window.name='DentalFlowDemo:'+JSON.stringify(auth)}catch{}
  if(auth.role==='clinica'){
   sessionStorage.setItem(CLINIC_SESSION,JSON.stringify({clinicId:auth.clinicId,userId:auth.userId}));
   window.DentalFlowDemo.open('clinica');
  }else{window.DentalFlowDemo.open('paciente')}
 }
 $('#show-register').addEventListener('click',()=>{show('register');$('#reg-name').focus()});
 $('#show-login').addEventListener('click',()=>{show('login');$('#login-email').focus()});
 document.querySelectorAll('[data-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
  const input=document.getElementById(btn.dataset.toggle);input.type=input.type==='password'?'text':'password';btn.setAttribute('aria-label',input.type==='password'?'Mostrar contraseña':'Ocultar contraseña');
 }));
 document.querySelectorAll('[data-demo]').forEach(btn=>btn.addEventListener('click',()=>{
  $('#login-email').value=btn.dataset.demo==='doctor'?'carlos@sonrisa.demo':'paciente@demo.com';$('#login-pass').value='demo123';$('#login-error').textContent='';$('#login-email').focus();
 }));
 $('#login-form').addEventListener('submit',async e=>{
  e.preventDefault();const error=$('#login-error');error.textContent='';
  const email=norm($('#login-email').value),password=$('#login-pass').value;
  if(!email||!password){error.textContent='Ingresa tu correo y contraseña.';return}
  const staff=STAFF.find(s=>s[0]===email);
  if(staff&&password==='demo123'){enter({role:'clinica',clinicId:staff[1],userId:staff[2]});return}
  if(email==='paciente@demo.com'&&password==='demo123'){enter({role:'paciente',kind:'demo',name:'Valeria Ramos',email});return}
  const account=readAccounts().find(x=>x.email===email);
  if(account){
   try{if(await derive(password,account.salt)===account.hash){
    // Migrar cuentas creadas con una versión anterior de la demo.
    if(!account.patientId){account.patientId='pweb-'+crypto.randomUUID();account.clinicId=DEFAULT_CLINIC;account.doctorId=DEFAULT_DOCTOR;const list=readAccounts();const old=list.find(x=>x.email===account.email);if(old)Object.assign(old,account);writeAccounts(list)}
    enter({role:'paciente',kind:'new',name:account.name,email:account.email,patientId:account.patientId});return}}
   catch(ex){error.textContent=ex.message;return}
  }
  error.textContent='Correo o contraseña incorrectos. Revisa tus datos o crea una cuenta de paciente.';
 });
 $('#register-form').addEventListener('submit',async e=>{
  e.preventDefault();const error=$('#register-error');error.textContent='';
  const name=$('#reg-name').value.trim().replace(/\s+/g,' '),email=norm($('#reg-email').value),password=$('#reg-pass').value,confirm=$('#reg-confirm').value;
  if(name.length<2||name.length>80){error.textContent='Escribe un nombre de al menos dos caracteres.';return}
  if(!$('#reg-email').validity.valid||!email){error.textContent='Escribe un correo válido.';return}
  if(password.length<8){error.textContent='La contraseña de demostración necesita ocho caracteres como mínimo.';return}
  if(password!==confirm){error.textContent='Las contraseñas no coinciden.';return}
  if(email==='paciente@demo.com'||STAFF.some(x=>x[0]===email)||readAccounts().some(x=>x.email===email)){
   error.textContent='Ese correo ya tiene una cuenta de prueba. Inicia sesión.';return;
  }
  const button=$('#register-form button[type=submit]');button.disabled=true;
  try{
   const salt=bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
   const hash=await derive(password,salt);
   const patientId='pweb-'+crypto.randomUUID();
   const list=readAccounts();list.push({name,email,salt,hash,patientId,clinicId:DEFAULT_CLINIC,doctorId:DEFAULT_DOCTOR});writeAccounts(list);
   enter({role:'paciente',kind:'new',name,email,patientId});
  }catch(ex){error.textContent='No se pudo crear la cuenta local de demostración. '+(ex.message||'')}
  finally{button.disabled=false}
 });
})();
