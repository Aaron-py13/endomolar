/* Endomolar 4 — dashboard independiente en 3 archivos (HTML, CSS y JS).
   Solo demostración, guarda datos ficticios en el navegador. NO usar datos reales. */
(() => {
'use strict';
const STORAGE_KEY='dentalflow_dashboard_local_v1';
const SESSION_KEY='dentalflow_dashboard_session_v1';
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const dateAdd=(offset)=>{const d=new Date(`${today()}T12:00:00`);d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:2}).format(Number(n)||0);
const dateFmt=d=>{if(!d)return '—';const [y,m,day]=d.split('-').map(Number);return new Date(y,m-1,day).toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'})};
const dateLong=d=>{const [y,m,day]=d.split('-').map(Number);return new Date(y,m-1,day).toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long'})};
const initials=s=>String(s||'?').split(' ').filter(Boolean).slice(0,2).map(v=>v[0].toUpperCase()).join('');
const $=(sel,root=document)=>root.querySelector(sel);
const all=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const id=prefix=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
const icpaths={
 tooth:'<path d="M12 5c3.5-3 7-2.7 8.2.9 1 3.5-.5 6.1-1.7 9.3-1 2.6-1.6 6.7-3.5 6.8-1.9 0-1.4-6.5-3-6.5s-1.1 6.5-3 6.5c-1.9-.1-2.5-4.2-3.5-6.8C4.3 12 2.8 9.4 3.8 5.9 5 2.3 8.5 2 12 5Z"/>',
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.2a4 4 0 0 1 0 7.6M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
 credit:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M18 8a3 3 0 0 1 0 6M18 17a4 4 0 0 1 4 4"/>',
 activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
 chart:'<path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.07.08-2.7 2.7-.07-.07a1.8 1.8 0 0 0-2-.36l-.1.04V22h-3.8v-.11a1.8 1.8 0 0 0-1.16-1.7 1.8 1.8 0 0 0-2 .35l-.08.07-2.7-2.7.07-.08a1.8 1.8 0 0 0 .35-2 1.8 1.8 0 0 0-1.7-1.16H2v-3.8h.11a1.8 1.8 0 0 0 1.7-1.16 1.8 1.8 0 0 0-.35-2l-.07-.08 2.7-2.7.08.07a1.8 1.8 0 0 0 2 .35 1.8 1.8 0 0 0 1.16-1.7V2h3.8v.11a1.8 1.8 0 0 0 1.16 1.7 1.8 1.8 0 0 0 2-.35l.08-.07 2.7 2.7-.07.08a1.8 1.8 0 0 0-.35 2 1.8 1.8 0 0 0 1.7 1.16H22v3.8h-.11A1.8 1.8 0 0 0 20.2 14Z"/>',
 search:'<circle cx="10.8" cy="10.8" r="7.6"/><path d="m17 17 5 5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 close:'<path d="M18 6 6 18M6 6l12 12"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 alert:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
 clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 shield:'<path d="m12 2 8 4v6c0 5.1-3.4 8.2-8 10-4.6-1.8-8-4.9-8-10V6l8-4Z"/><path d="m8 12 3 3 5-6"/>',
 dollar:'<circle cx="12" cy="12" r="9"/><path d="M15 8H10a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H9M12 6v12"/>',
 edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z"/>',
 lock:'<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/>',
 building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2M15 7h2M9 11h2M15 11h2M10 21v-5h4v5"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
 mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/>',
 note:'<path d="M4 3h16v18H4zM8 8h8M8 12h8M8 16h5"/>',
 layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5"/>',
 eye:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
};
const icon=(name,cls='')=>`<span class="svgicon ${cls}" aria-hidden="true"><svg viewBox="0 0 24 24">${icpaths[name]||icpaths.info}</svg></span>`;
const toothSvg=()=>`<svg viewBox="0 0 48 62" aria-hidden="true"><path class="tooth-path" d="M24 8 C15 1 7 7 7 17 C7 26 13 30 15 41 C16 49 17 56 21 56 C24 56 22 42 25 42 C28 42 27 56 31 56 C35 56 35 48 38 39 C41 27 44 18 40 11 C37 5 29 3 24 8Z"/></svg>`;
// Datos ficticios integrados para poder abrir este dashboard sin Node.js ni servidor.
// No sustituyen una base de datos ni se deben usar con expedientes reales.
const DEMO_SEED = {
  "clinics": [
    {
      "id": "c1",
      "name": "Endomolar",
      "location": "Sede central · Arequipa"
    },
    {
      "id": "c2",
      "name": "Centro Dental Nova",
      "location": "Sede independiente · Arequipa"
    }
  ],
  "staff": [
    {
      "id": "s1",
      "clinicId": "c1",
      "name": "María Fernández",
      "role": "administrador",
      "specialty": "Dirección",
      "email": "admin@sonrisa.demo"
    },
    {
      "id": "s2",
      "clinicId": "c1",
      "name": "Carlos Ruiz",
      "role": "odontologo",
      "specialty": "Endodoncia",
      "email": "carlos@sonrisa.demo"
    },
    {
      "id": "s3",
      "clinicId": "c1",
      "name": "Valeria Rojas",
      "role": "odontologo",
      "specialty": "Ortodoncia",
      "email": "valeria@sonrisa.demo"
    },
    {
      "id": "s4",
      "clinicId": "c1",
      "name": "Lucía Mendoza",
      "role": "enfermera",
      "specialty": "Asistencia clínica",
      "email": "lucia@sonrisa.demo"
    },
    {
      "id": "s5",
      "clinicId": "c1",
      "name": "Ana Torres",
      "role": "recepcion",
      "specialty": "Atención al cliente",
      "email": "ana@sonrisa.demo"
    },
    {
      "id": "s6",
      "clinicId": "c2",
      "name": "Javier Salas",
      "role": "administrador",
      "specialty": "Dirección",
      "email": "javier@nova.demo"
    },
    {
      "id": "s7",
      "clinicId": "c2",
      "name": "Diego Paredes",
      "role": "odontologo",
      "specialty": "Odontología general",
      "email": "diego@nova.demo"
    },
    {
      "id": "s8",
      "clinicId": "c2",
      "name": "Elena Ríos",
      "role": "enfermera",
      "specialty": "Asistencia clínica",
      "email": "elena@nova.demo"
    },
    {
      "id": "s9",
      "clinicId": "c2",
      "name": "Sara Vega",
      "role": "recepcion",
      "specialty": "Atención al cliente",
      "email": "sara@nova.demo"
    }
  ],
  "patients": [
    {
      "id": "p1",
      "clinicId": "c1",
      "name": "Sofía Ramírez",
      "dni": "74859362",
      "phone": "987654321",
      "email": "sofia@ejemplo.demo",
      "dob": "1998-05-14",
      "doctorId": "s2",
      "allergies": "Ninguna referida",
      "notes": "Paciente en seguimiento por endodoncia",
      "createdAt": "2026-10-08"
    },
    {
      "id": "p2",
      "clinicId": "c1",
      "name": "Luis Mendoza",
      "dni": "73462381",
      "phone": "956432178",
      "email": "luis@ejemplo.demo",
      "dob": "1986-02-23",
      "doctorId": "s2",
      "allergies": "Penicilina (referido por paciente)",
      "notes": "Control de restauración",
      "createdAt": "2026-10-17"
    },
    {
      "id": "p3",
      "clinicId": "c1",
      "name": "Camila Vega",
      "dni": "71412837",
      "phone": "945612300",
      "email": "camila@ejemplo.demo",
      "dob": "2002-08-17",
      "doctorId": "s3",
      "allergies": "Ninguna referida",
      "notes": "Tratamiento de ortodoncia",
      "createdAt": "2026-09-27"
    },
    {
      "id": "p4",
      "clinicId": "c1",
      "name": "Andrés Molina",
      "dni": "70419285",
      "phone": "987101998",
      "email": "andres@ejemplo.demo",
      "dob": "1995-12-02",
      "doctorId": "s3",
      "allergies": "Por confirmar",
      "notes": "Evaluación inicial",
      "createdAt": "2026-11-04"
    },
    {
      "id": "p5",
      "clinicId": "c1",
      "name": "Gabriela Núñez",
      "dni": "76437712",
      "phone": "930877655",
      "email": "gabriela@ejemplo.demo",
      "dob": "1993-03-01",
      "doctorId": "s2",
      "allergies": "Ninguna referida",
      "notes": "Tratamiento restaurador",
      "createdAt": "2026-10-29"
    },
    {
      "id": "p6",
      "clinicId": "c2",
      "name": "Renato Oliva",
      "dni": "72457280",
      "phone": "977334455",
      "email": "renato@ejemplo.demo",
      "dob": "1989-07-09",
      "doctorId": "s7",
      "allergies": "Ninguna referida",
      "notes": "Limpieza dental",
      "createdAt": "2026-10-19"
    },
    {
      "id": "p7",
      "clinicId": "c2",
      "name": "Mariana López",
      "dni": "75635214",
      "phone": "963554433",
      "email": "mariana@ejemplo.demo",
      "dob": "2000-11-19",
      "doctorId": "s7",
      "allergies": "Por confirmar",
      "notes": "Evaluación de caries",
      "createdAt": "2026-11-01"
    },
    {
      "id": "p8",
      "clinicId": "c1",
      "name": "Alejandro Torres (DEMO)",
      "dni": "00000000",
      "phone": "900000000",
      "email": "paciente@demo.test",
      "dob": "1992-06-15",
      "doctorId": "s2",
      "allergies": "Ninguna referida (ejemplo)",
      "notes": "Paciente ficticio para probar extracción y seguimiento móvil.",
      "createdAt": "2026-10-25"
    }
  ],
  "appointments": [
    {
      "id": "a1",
      "clinicId": "c1",
      "patientId": "p1",
      "doctorId": "s2",
      "date": "2026-11-06",
      "time": "09:00",
      "duration": 60,
      "type": "Endodoncia (sesión 2)",
      "status": "Confirmada"
    },
    {
      "id": "a2",
      "clinicId": "c1",
      "patientId": "p3",
      "doctorId": "s3",
      "date": "2026-11-06",
      "time": "10:30",
      "duration": 45,
      "type": "Control de ortodoncia",
      "status": "Confirmada"
    },
    {
      "id": "a3",
      "clinicId": "c1",
      "patientId": "p2",
      "doctorId": "s2",
      "date": "2026-11-06",
      "time": "12:00",
      "duration": 45,
      "type": "Restauración",
      "status": "Pendiente"
    },
    {
      "id": "a4",
      "clinicId": "c1",
      "patientId": "p4",
      "doctorId": "s3",
      "date": "2026-11-06",
      "time": "15:00",
      "duration": 40,
      "type": "Evaluación inicial",
      "status": "Confirmada"
    },
    {
      "id": "a5",
      "clinicId": "c1",
      "patientId": "p5",
      "doctorId": "s2",
      "date": "2026-11-07",
      "time": "11:30",
      "duration": 50,
      "type": "Control de caries",
      "status": "Pendiente"
    },
    {
      "id": "a6",
      "clinicId": "c1",
      "patientId": "p3",
      "doctorId": "s3",
      "date": "2026-11-09",
      "time": "16:00",
      "duration": 50,
      "type": "Ajuste de brackets",
      "status": "Confirmada"
    },
    {
      "id": "a7",
      "clinicId": "c2",
      "patientId": "p6",
      "doctorId": "s7",
      "date": "2026-11-06",
      "time": "09:30",
      "duration": 40,
      "type": "Limpieza dental",
      "status": "Confirmada"
    },
    {
      "id": "a8",
      "clinicId": "c2",
      "patientId": "p7",
      "doctorId": "s7",
      "date": "2026-11-06",
      "time": "12:00",
      "duration": 40,
      "type": "Evaluación de caries",
      "status": "Pendiente"
    },
    {
      "id": "a9",
      "clinicId": "c1",
      "patientId": "p8",
      "doctorId": "s2",
      "date": "2026-11-11",
      "time": "10:30",
      "duration": 30,
      "type": "Control y seguimiento",
      "status": "Confirmada"
    }
  ],
  "records": [
    {
      "id": "r1",
      "patientId": "p1",
      "doctorId": "s2",
      "date": "2026-10-17",
      "type": "Evaluación",
      "notes": "Dolor referido en pieza 36. Se indica evaluación de conductos."
    },
    {
      "id": "r2",
      "patientId": "p1",
      "doctorId": "s2",
      "date": "2026-10-30",
      "type": "Evolución",
      "notes": "Primera sesión de endodoncia completada. Seguimiento programado."
    },
    {
      "id": "r3",
      "patientId": "p3",
      "doctorId": "s3",
      "date": "2026-10-12",
      "type": "Tratamiento",
      "notes": "Se inicia tratamiento de ortodoncia. Control mensual recomendado."
    },
    {
      "id": "r4",
      "patientId": "p2",
      "doctorId": "s2",
      "date": "2026-10-26",
      "type": "Evaluación",
      "notes": "Se evalúa restauración previa y se programa control."
    },
    {
      "id": "r5",
      "patientId": "p6",
      "doctorId": "s7",
      "date": "2026-10-29",
      "type": "Evolución",
      "notes": "Profilaxis realizada sin incidentes."
    },
    {
      "id": "r8",
      "patientId": "p8",
      "doctorId": "s2",
      "date": "2026-11-04",
      "type": "Evaluación",
      "notes": "Se evalúa la pieza 36. Se planifica extracción y seguimiento. Paciente de demostración."
    }
  ],
  "treatments": [
    {
      "id": "t1",
      "clinicId": "c1",
      "patientId": "p1",
      "doctorId": "s2",
      "title": "Endodoncia",
      "tooth": "36",
      "price": 850,
      "progress": 50,
      "status": "En curso"
    },
    {
      "id": "t2",
      "clinicId": "c1",
      "patientId": "p2",
      "doctorId": "s2",
      "title": "Restauración en resina",
      "tooth": "26",
      "price": 260,
      "progress": 20,
      "status": "En curso"
    },
    {
      "id": "t3",
      "clinicId": "c1",
      "patientId": "p3",
      "doctorId": "s3",
      "title": "Ortodoncia",
      "tooth": "—",
      "price": 4200,
      "progress": 45,
      "status": "En curso"
    },
    {
      "id": "t4",
      "clinicId": "c1",
      "patientId": "p5",
      "doctorId": "s2",
      "title": "Tratamiento de caries",
      "tooth": "14",
      "price": 250,
      "progress": 0,
      "status": "Pendiente"
    },
    {
      "id": "t5",
      "clinicId": "c2",
      "patientId": "p6",
      "doctorId": "s7",
      "title": "Profilaxis dental",
      "tooth": "—",
      "price": 150,
      "progress": 100,
      "status": "Finalizado"
    },
    {
      "id": "t6",
      "clinicId": "c2",
      "patientId": "p7",
      "doctorId": "s7",
      "title": "Restauración",
      "tooth": "16",
      "price": 300,
      "progress": 0,
      "status": "Pendiente"
    },
    {
      "id": "t8",
      "clinicId": "c1",
      "patientId": "p8",
      "doctorId": "s2",
      "title": "Plan integral: extracción y rehabilitación",
      "tooth": "36",
      "price": 1200,
      "progress": 20,
      "status": "En curso",
      "steps": [
        {
          "id": "st1",
          "title": "Evaluación y diagnóstico",
          "kind": "diagnostico",
          "tooth": "36",
          "done": true,
          "completedAt": "2026-11-04"
        },
        {
          "id": "st2",
          "title": "Extracción de pieza 36",
          "kind": "extraccion",
          "tooth": "36",
          "done": false,
          "completedAt": null
        },
        {
          "id": "st3",
          "title": "Control de cicatrización",
          "kind": "control",
          "tooth": "36",
          "done": false,
          "completedAt": null
        },
        {
          "id": "st4",
          "title": "Preparación de rehabilitación",
          "kind": "preparacion",
          "tooth": "36",
          "done": false,
          "completedAt": null
        },
        {
          "id": "st5",
          "title": "Rehabilitación final",
          "kind": "rehabilitacion",
          "tooth": "36",
          "done": false,
          "completedAt": null
        }
      ]
    }
  ],
  "payments": [
    {
      "id": "pay1",
      "clinicId": "c1",
      "patientId": "p1",
      "treatmentId": "t1",
      "date": "2026-10-30",
      "amount": 425,
      "method": "Yape",
      "concept": "Abono a endodoncia"
    },
    {
      "id": "pay2",
      "clinicId": "c1",
      "patientId": "p2",
      "treatmentId": "t2",
      "date": "2026-11-01",
      "amount": 100,
      "method": "Efectivo",
      "concept": "Abono a restauración"
    },
    {
      "id": "pay3",
      "clinicId": "c1",
      "patientId": "p3",
      "treatmentId": "t3",
      "date": "2026-10-17",
      "amount": 900,
      "method": "Transferencia",
      "concept": "Inicial de ortodoncia"
    },
    {
      "id": "pay4",
      "clinicId": "c1",
      "patientId": "p3",
      "treatmentId": "t3",
      "date": "2026-11-06",
      "amount": 250,
      "method": "Yape",
      "concept": "Cuota de ortodoncia"
    },
    {
      "id": "pay5",
      "clinicId": "c2",
      "patientId": "p6",
      "treatmentId": "t5",
      "date": "2026-11-06",
      "amount": 150,
      "method": "Efectivo",
      "concept": "Pago de profilaxis"
    },
    {
      "id": "pay8",
      "clinicId": "c1",
      "patientId": "p8",
      "treatmentId": "t8",
      "date": "2026-11-04",
      "amount": 250,
      "method": "Yape",
      "concept": "Abono inicial al plan integral"
    }
  ],
  "dental": {
    "p1": {
      "16": {
        "condition": "restauracion",
        "note": "Obturación registrada",
        "updatedAt": "2026-10-22"
      },
      "36": {
        "condition": "endodoncia",
        "note": "Procedimiento en curso",
        "updatedAt": "2026-10-30"
      }
    },
    "p2": {
      "26": {
        "condition": "restauracion",
        "note": "Revisar borde restaurador",
        "updatedAt": "2026-10-26"
      }
    },
    "p3": {
      "14": {
        "condition": "caries",
        "note": "Pendiente evaluación complementaria",
        "updatedAt": "2026-10-12"
      }
    },
    "p5": {
      "14": {
        "condition": "caries",
        "note": "Hallazgo de evaluación",
        "updatedAt": "2026-10-29"
      }
    },
    "p7": {
      "16": {
        "condition": "caries",
        "note": "Verificar en consulta",
        "updatedAt": "2026-11-01"
      }
    },
    "p8": {
      "36": {
        "condition": "otro",
        "note": "Extracción indicada, pendiente de realización.",
        "updatedAt": "2026-11-04"
      }
    }
  },
  "dentalHistory": [
    {
      "id": "dh-mw5609dq-di8m",
      "patientId": "p1",
      "tooth": "16",
      "condition": "restauracion",
      "note": "Obturación registrada",
      "date": "2026-10-22",
      "doctorId": "s2"
    },
    {
      "id": "dh-mw5609dq-j1sv",
      "patientId": "p1",
      "tooth": "36",
      "condition": "endodoncia",
      "note": "Procedimiento en curso",
      "date": "2026-10-30",
      "doctorId": "s2"
    },
    {
      "id": "dh-mw5609dq-qvr6",
      "patientId": "p2",
      "tooth": "26",
      "condition": "restauracion",
      "note": "Revisar borde restaurador",
      "date": "2026-10-26",
      "doctorId": "s2"
    },
    {
      "id": "dh-mw5609dq-5pa9",
      "patientId": "p3",
      "tooth": "14",
      "condition": "caries",
      "note": "Pendiente evaluación complementaria",
      "date": "2026-10-12",
      "doctorId": "s3"
    },
    {
      "id": "dh-mw5609dq-6eg8",
      "patientId": "p5",
      "tooth": "14",
      "condition": "caries",
      "note": "Hallazgo de evaluación",
      "date": "2026-10-29",
      "doctorId": "s2"
    },
    {
      "id": "dh-mw5609dq-52gv",
      "patientId": "p7",
      "tooth": "16",
      "condition": "caries",
      "note": "Verificar en consulta",
      "date": "2026-11-01",
      "doctorId": "s7"
    },
    {
      "id": "dh8",
      "clinicId": "c1",
      "patientId": "p8",
      "tooth": "36",
      "condition": "otro",
      "surfaces": [],
      "note": "Evaluación inicial: extracción indicada; pendiente de realización.",
      "date": "2026-11-04",
      "recordedAt": "2026-11-04T14:00:00.000Z",
      "doctorId": "s2",
      "dentition": "permanente",
      "recordType": "diagnostico"
    }
  ]
};
const demo = () => structuredClone(DEMO_SEED);

let db;try{db=JSON.parse(localStorage.getItem(STORAGE_KEY))||demo()}catch{db=demo()}
// Adecua la clínica principal de demostración creada con el nombre anterior.
// Conserva sus pacientes, presupuestos y tratamientos ya guardados.
if(Array.isArray(db.clinics)){
 const principal=db.clinics.find(c=>c.id==='c1');
 if(principal&&['Clínica Sonrisa','Sonrisa Viva','Clínica Sonrisa Viva'].includes(principal.name))principal.name='Endomolar';
}
if(!Array.isArray(db.quotes))db.quotes=[]
// La cuenta creada en la portada genera un expediente de DEMO en la clínica c1.
// Ambas vistas se muestran desde el único index.html y comparten almacenamiento local.
const ACCOUNTS_KEY='dentalflow_patient_demo_accounts_v1';
function syncRegisteredPatients(){
 let accounts=[];
 try{const saved=JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'[]');if(Array.isArray(saved))accounts=saved}catch{}
 let added=0;
 for(const account of accounts){
  if(!account.patientId||!account.email||!account.name)continue;
  if(db.patients.some(p=>p.id===account.patientId))continue;
  db.patients.push({
   id:account.patientId,clinicId:account.clinicId||'c1',
   name:String(account.name).slice(0,80),email:String(account.email).slice(0,150),
   dni:'',phone:'',dob:'',doctorId:account.doctorId||'s2',
   allergies:'',notes:'Cuenta web de demostración. Completar y verificar la ficha antes de una atención.',
   createdAt:today(),webRegistration:true
  });
  added++;
 }
 return added;
}
syncRegisteredPatients();
// En esta edición independiente los cambios se guardan solo en este navegador.
 const save=()=>{ try { localStorage.setItem(STORAGE_KEY,JSON.stringify(db)); } catch(error) { console.warn('Este navegador no permite guardar datos locales.',error); } };
 save();
let session;try{session=JSON.parse(sessionStorage.getItem(SESSION_KEY))}catch{session=null}
// El login está en index.html (único documento). Esta DEMO no tiene seguridad real.
const UNIFIED_KEY='dentalflow_unified_auth_demo_v1';
let access=null;
try{access=JSON.parse(sessionStorage.getItem(UNIFIED_KEY))}catch{}
if(!access&&window.name.startsWith('DentalFlowDemo:')){
 try{access=JSON.parse(window.name.slice('DentalFlowDemo:'.length));sessionStorage.setItem(UNIFIED_KEY,JSON.stringify(access))}catch{}
}
window.name='';
if(access?.role==='clinica'){
 session={clinicId:access.clinicId,userId:access.userId};
 try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(session))}catch{}
}else{session=null;try{sessionStorage.removeItem(SESSION_KEY)}catch{}}

const state={page:'home',patientId:null,tab:'overview',selectedTooth:'36',dentition:'permanente',selectedSurfaces:[],appointmentDate:today(),workerId:null,workerFilter:'all',patientQuery:'',selectedFinding:'caries',quoteDraft:null,quoteTooth:'36',quoteDentition:'permanente',quoteNewItem:{finding:'caries',procedure:'Restauración con resina',price:'',note:''}};
const me=()=>db.staff.find(s=>s.id===session?.userId&&s.clinicId===session?.clinicId);
const clinic=()=>db.clinics.find(c=>c.id===session?.clinicId);
const ofClinic=arr=>arr.filter(x=>x.clinicId===session?.clinicId);
const patients=()=>ofClinic(db.patients).filter(p=>me()?.role==='odontologo'?p.doctorId===me().id:true);
const staff=()=>ofClinic(db.staff);
const doctors=()=>staff().filter(s=>s.role==='odontologo');
const patientById=x=>patients().find(p=>p.id===x);
const staffName=x=>db.staff.find(s=>s.id===x)?.name||'Sin asignar';
const patientName=x=>db.patients.find(p=>p.id===x)?.name||'Paciente no disponible';
const appointments=()=>ofClinic(db.appointments).filter(a=>patientById(a.patientId));
const treatments=()=>ofClinic(db.treatments).filter(t=>patientById(t.patientId));
const payments=()=>ofClinic(db.payments).filter(p=>patientById(p.patientId));
const recsFor=pid=>db.records.filter(r=>r.patientId===pid).sort((a,b)=>b.date.localeCompare(a.date));
const payFor=pid=>payments().filter(p=>p.patientId===pid);
const treatFor=pid=>treatments().filter(t=>t.patientId===pid);
const applFor=pid=>appointments().filter(a=>a.patientId===pid).sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
const numPaid=tId=>payments().filter(p=>p.treatmentId===tId).reduce((s,p)=>s+Number(p.amount),0);
 const planProgress=t=>Array.isArray(t.steps)&&t.steps.length?Math.round(t.steps.filter(x=>x.done).length*100/t.steps.length):Number(t.progress)||0;
 const extractionRecorded=(pid,tooth)=>db.dentalHistory.some(h=>h.patientId===pid&&h.tooth===tooth&&h.condition==='ausente'&&h.recordType==='extraccion-realizada');
const can=key=>{const role=me()?.role;if(key==='clinical'||key==='odontogram')return role==='odontologo';return role==='administrador'||({payments:['recepcion'],staff:[],treatment:['odontologo'],patient:['recepcion','enfermera','odontologo'],appointment:['recepcion','enfermera','odontologo']}[key]||[]).includes(role)};
const accessible=key=>{if(key==='payments')return can('payments');if(key==='workers')return me()?.role==='administrador';if(key==='quotes')return ['odontologo','administrador','recepcion'].includes(me()?.role);return true};
const conditionLabels={'sin-evaluar':'Sin registrar',sano:'Sano (evaluado)',caries:'Caries',restauracion:'Restauración',endodoncia:'Endodoncia',ausente:'Ausente',corona:'Corona'};
const statusClass=s=>({'Confirmada':'green','Finalizada':'violet','Pendiente':'orange','Cancelada':'red','En atención':'cyan','En curso':'cyan','Finalizado':'green','Pagado':'green'}[s]||'gray');
const pill=s=>`<span class="pill ${statusClass(s)}">${esc(s)}</span>`;
const noData=(text,ico='file')=>`<div class="empty">${icon(ico)}<div>${esc(text)}</div></div>`;
const heading=(title,sub,actions='')=>`<div class="page-head"><div><div class="tag">${esc(clinic()?.name||'Endomolar')} · Clínica Dental</div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><div class="page-actions">${actions}</div></div>`;
const btn=(action,label,kind='primary',extra='')=>`<button type="button" class="btn ${kind==='primary'?'':kind}" data-action="${action}" ${extra}>${label}</button>`;
const metric=(ico,label,value,detail,accent='')=>`<div class="metric"><div class="metric-icon ${accent}">${icon(ico)}</div><div><label>${esc(label)}</label><strong>${esc(value)}</strong><small>${esc(detail)}</small></div></div>`;
const navItems=[['home','home','Inicio'],['patients','users','Pacientes'],['quotes','file','Presupuestos'],['appointments','calendar','Agenda'],['payments','credit','Caja y Pagos'],['workers','people','Trabajadores']];
function renderLogin(){
 window.DentalFlowDemo.logout();
}

function roleName(r){return {administrador:'Administrador',odontologo:'Odontólogo',enfermera:'Enfermera',recepcion:'Recepción'}[r]||r}
function shell(content){
 const visible=navItems.filter(([name])=>accessible(name));
 const initialsName=me().name.split(' '); const first=initialsName[0];
 $('#app').innerHTML=`<div class="overlay-mobile" id="mobile-overlay" data-action="mobile-close"></div><div class="shell"><aside class="sidebar" id="sidebar"><div class="brand"><div class="brand-mark">${icon('tooth')}</div><span>Endomolar <i>4.0</i><small>Clínica Dental</small></span></div><nav class="nav">${visible.map(([route,ico,title])=>`<button class="nav-btn ${route===state.page?'active':''}" type="button" data-action="nav" data-page="${route}">${icon(ico)} ${title}</button>`).join('')}</nav><div class="sidebar-decor"><div class="tooth-glow">${icon('tooth')}</div></div><div class="sidebar-bottom"><div class="clinic-chip">${icon('building')}<div><strong>${esc(clinic()?.name)}</strong><span>Clínica seleccionada</span></div></div><button class="nav-btn logout-btn" data-action="logout">${icon('logout')} Cerrar sesión</button></div></aside><div class="main"><header class="topbar"><div class="topbar-left"><button type="button" class="btn ghost iconbtn mobile-toggle" data-action="mobile-open" aria-label="Abrir menú">${icon('menu')}</button><div class="search-global">${icon('search')} <input id="global-search" type="search" placeholder="Buscar paciente (DNI, nombre o teléfono)..." aria-label="Buscar paciente" title="Escribe y presiona Enter"></div></div><div class="topbar-right"><span class="top-role">${roleName(me().role)}</span><div class="notification-dot">${icon('alert')}</div><div class="userbox"><div class="avatar">${esc(initials(me().name))}</div><div><strong>${esc(me().name)}</strong><small>${esc(me().specialty)}</small></div></div></div></header><main class="main-body" id="page-content">${content}</main><footer class="demo-footer">Endomolar · Demostración con datos ficticios · No usar información clínica real</footer></div></div>`;
}
function render(){
 if(!me()){session=null;sessionStorage.removeItem(SESSION_KEY);renderLogin();return}
 if(!accessible(state.page))state.page='home';
 const routes={home:renderHome,patients:renderPatients,quotes:renderQuotes,appointments:renderAppointments,payments:renderPayments,workers:renderWorkers};
 shell((routes[state.page]||renderHome)());
}
function renderHome(){
 const role=me().role;
 const aps=appointments().filter(a=>a.date===today()&&a.status!=='Cancelada').sort((a,b)=>a.time.localeCompare(b.time));
 const relevantTreat=treatments().filter(t=>t.status!=='Finalizado');
 const waiting=aps.filter(a=>['Pendiente','Confirmada'].includes(a.status));
 const active=aps.filter(a=>a.status==='En atención');
 const income=payments().filter(x=>x.date===today()).reduce((n,x)=>n+Number(x.amount),0);
 const greeting=new Date().getHours()<12?'Buenos días':new Date().getHours()<19?'Buenas tardes':'Buenas noches';
 const roleMessages={odontologo:'Estas son tus atenciones y seguimientos de hoy.',recepcion:'Organiza la llegada de pacientes y controla las citas.',enfermera:'Revisa las visitas previstas y las necesidades de apoyo.',administrador:'Supervisa la actividad diaria de tu clínica.'};
 const first=me().name.split(' ')[0];
 const metrics=role==='odontologo'?
 [metric('calendar','Mis citas hoy',aps.length,'Asignadas a tu agenda','violet'),metric('clock','Por atender',waiting.length,'Pendientes y confirmadas','orange'),metric('tooth','Tratamientos en curso',relevantTreat.filter(t=>t.status==='En curso').length,'En mis pacientes','cyan'),metric('clipboard','Seguimientos',relevantTreat.length,'Requieren revisión','red')]:
 role==='administrador'?
 [metric('calendar','Citas de hoy',aps.length,'Programadas hoy','violet'),metric('users','Pacientes',patients().length,'Expedientes registrados','cyan'),metric('credit','Cobros de hoy',money(income),'Movimientos registrados','green'),metric('clipboard','Planes activos',relevantTreat.length,'Por completar','orange')]:
 [metric('calendar','Citas de hoy',aps.length,'Agenda de hoy','violet'),metric('clock','Por recibir',waiting.length,'Pendientes de llegada','orange'),metric('activity','En atención',active.length,'Atendiéndose','cyan'),metric('users','Pacientes',patients().length,'En esta clínica','green')];
 const contentAppointments=aps.map(a=>`<div class="work-appointment"><span class="work-time">${esc(a.time)}</span><div class="work-person"><div class="avatar avatar-tiny">${esc(initials(patientName(a.patientId)))}</div><div><strong>${esc(patientName(a.patientId))}</strong><small>${esc(a.type)} ${role==='odontologo'?'':'· '+esc(staffName(a.doctorId))}</small></div></div><div class="work-end">${pill(a.status)}<button class="row-circle" data-action="open-patient" data-id="${esc(a.patientId)}" title="Abrir expediente" aria-label="Abrir expediente de ${esc(patientName(a.patientId))}">${icon('chevron')}</button></div></div>`).join('')||noData('Sin pacientes agendados hoy','calendar');
 const listTreatment=relevantTreat.slice(0,5).map(t=>`<button class="followup-row" data-action="open-patient" data-id="${esc(t.patientId)}"><span class="followup-icon">${icon('tooth')}</span><span><strong>${esc(patientName(t.patientId))}</strong><small>${esc(t.title)} ${t.tooth&&t.tooth!=='—'?'· Pieza '+esc(t.tooth):''}</small><span class="track"><span style="width:${Math.min(100,Math.max(0,Number(t.progress)))}%"></span></span></span>${icon('chevron')}</button>`).join('')||noData('Sin seguimientos pendientes','check');
 const workTitle=role==='odontologo'?'Mis pacientes de hoy':role==='administrador'?'Agenda de hoy':role==='recepcion'?'Llegadas y citas de hoy':'Pacientes previstos hoy';
 const trackingTitle=role==='odontologo'?'Seguimientos pendientes':role==='administrador'?'Tratamientos por completar':role==='recepcion'?'Citas por confirmar':'Atenciones en curso';
 const rightContent=role==='recepcion'?
 aps.filter(a=>['Pendiente','Confirmada'].includes(a.status)).map(a=>`<div class="followup-row followup-static"><span class="followup-icon">${icon('calendar')}</span><span><strong>${esc(patientName(a.patientId))}</strong><small>${esc(a.time)} · ${esc(a.type)}</small></span>${pill(a.status)}</div>`).join('')||noData('Todo confirmado','check'):
 role==='enfermera'?aps.filter(a=>a.status==='En atención'||a.status==='Confirmada').map(a=>`<div class="followup-row followup-static"><span class="followup-icon">${icon('activity')}</span><span><strong>${esc(patientName(a.patientId))}</strong><small>${esc(a.time)} · ${esc(a.type)}</small></span></div>`).join('')||noData('Sin atenciones en curso','activity'):
 listTreatment;
 return `<div class="welcome v3-welcome"><div class="welcome-copy"><span class="welcome-overline">PANEL ${role==='odontologo'?'ODONTOLÓGICO':role==='administrador'?'ADMINISTRATIVO':'DE '+roleName(role).toUpperCase()}</span><h2>${greeting}, ${role==='odontologo'?'Dr(a). ':''}${esc(first)} <span class="wave">👋</span></h2><p>${roleMessages[role]}</p></div><div class="hero-dental">${icon('tooth')}<div class="hero-spark spark-a"></div><div class="hero-spark spark-b"></div></div></div><div class="metric-grid v3-metrics">${metrics.join('')}</div><div class="home-main-grid"><section class="panel home-patients"><div class="panel-head"><div><h3>${workTitle}</h3><p>${role==='odontologo'?'Tu lista clínica; abre cualquier expediente con una sola acción.':'Turnos y estados actualizados desde la agenda.'}</p></div></div><div class="home-appointments">${contentAppointments}</div></section><section class="panel home-followups"><div class="panel-head"><div><h3>${trackingTitle}</h3><p>${role==='odontologo'?'Abre la ficha y continúa donde quedó la última visita.':'Pendientes relacionados con esta clínica.'}</p></div><span class="round-counter">${role==='recepcion'?waiting.length:relevantTreat.length}</span></div><div class="followup-list">${rightContent}</div><div class="followups-decor" aria-hidden="true">${icon('tooth')}</div></section></div><div class="home-note">${icon('shield')} Datos de demostración. Las funciones clínicas solo deben usarse con información ficticia hasta implementar y validar el sistema de producción.</div>`;
}
function patientRow(p){
 return `<tr data-patient-row data-search="${esc(`${p.name} ${p.dni} ${p.phone}`.toLowerCase())}"><td><div class="patient-name"><div class="table-avatar">${esc(initials(p.name))}</div><div><div class="table-main">${esc(p.name)}${p.webRegistration?' <span class="pill cyan" style="font-size:10px;padding:3px 7px">Registro web</span>':''}</div><div class="table-meta">${p.webRegistration?'Cuenta de paciente · pendiente de completar ficha':'DNI '+esc(p.dni||'—')}</div></div></div></td><td>${esc(staffName(p.doctorId))}</td><td>${treatFor(p.id).length}</td><td>${btn('open-patient',`Ver expediente ${icon('chevron','tinyicon')}`,'ghost sm',`data-id="${esc(p.id)}"`)}</td></tr>`;
}
function renderPatients(){
 if(state.patientId&&patientById(state.patientId))return renderPatientDetail(patientById(state.patientId));
 return `${heading('Pacientes','Expedientes únicos con historia clínica, citas, odontograma, tratamientos y pagos.',can('patient')?btn('new-patient',`${icon('plus')} Nuevo paciente`):'')}<div class="toolbar"><div class="input-search">${icon('search','tinyicon')}<input id="patient-search" data-patient-filter type="search" placeholder="Buscar por nombre, DNI o teléfono" value="${esc(state.patientQuery)}"></div><span class="small muted">${patients().length} paciente(s) en esta clínica</span></div><div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>Paciente</th><th>Odontólogo asignado</th><th>Tratamientos</th><th>Expediente</th></tr></thead><tbody>${patients().map(patientRow).join('')||'<tr><td colspan="4">Aún no hay pacientes registrados.</td></tr>'}</tbody></table></div></div>`;
}
function renderPatientDetail(p){
 const tabs=[['overview','Resumen','home'],['clinical','Historia clínica','clipboard'],['dental','Odontograma','tooth'],['treatments','Plan dental','note'],['appointments','Citas','calendar'],['payments','Pagos','credit']];
 let detail='';
 if(state.tab==='overview')detail=patientOverview(p);
 if(state.tab==='clinical')detail=patientHistory(p);
 if(state.tab==='appointments')detail=patientAppointments(p);
 if(state.tab==='dental')detail=odontogramWidget(p);
 if(state.tab==='treatments')detail=patientTreatments(p);
 if(state.tab==='payments')detail=patientPayments(p);
 const age=p.dob?Math.floor((new Date()-new Date(p.dob+'T00:00:00'))/31557600000):(p.age||null);
 return `<div class="breadcrumb"><button data-action="back-patients">${icon('arrow')} Pacientes</button><span>›</span><strong>Expediente del paciente</strong></div><div class="patient-banner panel"><div class="patient-banner-main"><div class="avatar patient-large">${esc(initials(p.name))}</div><div class="patient-identity"><h1>${esc(p.name)}</h1><p>DNI: ${esc(p.dni)} ${age?'· '+age+' años':''}</p><p>${icon('people','tinyicon')} ${esc(p.phone)} · Odontólogo: ${esc(staffName(p.doctorId))}</p></div></div><div class="patient-banner-actions"><span class="pill green">Paciente activo</span>${can('patient')?btn('edit-patient','Editar','ghost sm',`data-id="${p.id}"`):''}${can('clinical')?btn('new-record',`${icon('plus')} Nueva atención`,'primary',`data-id="${p.id}"`):''}</div><nav class="tabs patient-tabs" aria-label="Secciones del expediente">${tabs.filter(([key])=>key!=='payments'||accessible('payments')).map(([key,label,ico])=>`<button type="button" class="tab ${key===state.tab?'active':''}" data-action="profile-tab" data-tab="${key}">${icon(ico)} ${label}</button>`).join('')}</nav></div>${detail}`;
}
function patientOverview(p){
 const latest=recsFor(p.id)[0];
 const future=applFor(p.id).filter(a=>a.date>=today()&&a.status!=='Cancelada').sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))[0];
 return `<div class="cols-two"><div class="panel panel-pad"><h3 class="subheading">Datos principales</h3><div class="detail-grid"><div class="info-item"><small>Documento</small><strong>${esc(p.dni||'—')}</strong></div><div class="info-item"><small>Teléfono</small><strong>${esc(p.phone||'—')}</strong></div><div class="info-item"><small>Fecha de nacimiento</small><strong>${esc(dateFmt(p.dob))}</strong></div><div class="info-item"><small>Correo</small><strong>${esc(p.email||'—')}</strong></div><div class="info-item"><small>Antecedentes / alergias</small><strong>${esc(p.allergies||'No registrado')}</strong></div><div class="info-item"><small>Registro</small><strong>${esc(dateFmt(p.createdAt))}</strong></div></div><div class="notice" style="margin-top:18px">${icon('note')} ${esc(p.notes||'Sin anotaciones generales.')}</div></div><div class="panel panel-pad"><h3 class="subheading">Próxima cita</h3>${future?`<div style="display:flex;gap:12px;align-items:center"><div class="metric-icon" style="width:50px;height:50px;display:grid;place-items:center;background:#edf6ff;border-radius:13px;color:#1874c7">${icon('calendar')}</div><div><strong>${esc(dateFmt(future.date))} · ${esc(future.time)}</strong><p class="small muted" style="margin:5px 0">${esc(future.type)}</p>${pill(future.status)}</div></div>`:noData('Sin citas futuras','calendar')}<div style="margin-top:20px"><h3 class="subheading">Último registro clínico</h3>${latest?`<strong class="small">${esc(latest.type)} · ${esc(dateFmt(latest.date))}</strong><p class="small muted" style="line-height:1.7">${esc(latest.notes)}</p>`:noData('Sin historia clínica registrada','file')}</div></div></div>`;
}
function patientHistory(p){const list=recsFor(p.id);return `<section class="panel"><div class="panel-head"><div><h3>Historia clínica y evolución</h3><p>Registro longitudinal de atenciones</p></div></div><div class="panel-pad" style="padding-top:6px"><div class="timeline">${list.map(r=>`<div class="timeline-item"><span class="timeline-marker"></span><div class="timeline-box"><strong>${esc(r.type)}</strong><p>${esc(r.notes)}</p><small>${esc(dateFmt(r.date))} · ${esc(staffName(r.doctorId))}</small></div></div>`).join('')||noData('Aún no existen anotaciones en el expediente','file')}</div></div></section>`}
function patientAppointments(p){const rows=applFor(p.id);return `<section class="panel"><div class="panel-head"><div><h3>Historial de citas</h3><p>Programadas, atendidas y canceladas</p></div>${can('appointment')?btn('new-appointment',`${icon('plus')} Agendar cita`,'primary',`data-patient="${p.id}"`):''}</div><div class="table-scroll"><table class="data-table"><thead><tr><th>Fecha y hora</th><th>Motivo</th><th>Odontólogo</th><th>Estado</th><th></th></tr></thead><tbody>${rows.map(a=>`<tr><td>${esc(dateFmt(a.date))} · ${esc(a.time)}</td><td class="table-main">${esc(a.type)}</td><td>${esc(staffName(a.doctorId))}</td><td>${pill(a.status)}</td><td>${can('appointment')?btn('edit-appointment','Gestionar','ghost sm',`data-id="${a.id}"`):''}</td></tr>`).join('')||'<tr><td colspan="5">Sin citas</td></tr>'}</tbody></table></div></section>`}
function patientTreatments(p){const tr=treatFor(p.id);return `<section class="panel"><div class="panel-head"><div><h3>Planes de tratamiento</h3><p>Presupuesto, avance clínico y saldo</p></div>${can('treatment')?btn('new-treatment',`${icon('plus')} Crear tratamiento`,'primary',`data-patient="${p.id}"`):''}</div><div class="table-scroll"><table class="data-table"><thead><tr><th>Tratamiento</th><th>Pieza</th><th>Odontólogo</th><th>Avance</th><th>Presupuesto</th><th>Pagado</th><th>Saldo</th><th></th></tr></thead><tbody>${tr.map(t=>`<tr><td><strong>${esc(t.title)}</strong><div class="table-meta">${pill(t.status)}</div></td><td>${esc(t.tooth||'—')}</td><td>${esc(staffName(t.doctorId))}</td><td><strong>${planProgress(t)}%</strong>${t.steps?.length?`<div class="table-meta">${t.steps.filter(x=>x.done).length}/${t.steps.length} etapas</div>`:''}</td><td>${money(t.price)}</td><td>${money(numPaid(t.id))}</td><td><strong>${money(Math.max(0,t.price-numPaid(t.id)))}</strong></td><td>${can('treatment')?btn('edit-treatment','Actualizar','ghost sm',`data-id="${t.id}"`):''}</td></tr>`).join('')||'<tr><td colspan="8">Sin tratamientos registrados.</td></tr>'}</tbody></table></div></section>`}
function patientPayments(p){const rows=payFor(p.id).sort((a,b)=>b.date.localeCompare(a.date));const budget=treatFor(p.id).reduce((s,t)=>s+Number(t.price),0),paid=rows.reduce((s,x)=>s+Number(x.amount),0),due=treatFor(p.id).reduce((s,t)=>s+Math.max(0,t.price-numPaid(t.id)),0);return `<div class="metric-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${metric('clipboard','Presupuesto de tratamientos',money(budget),'Planes registrados','violet')}${metric('check','Abonos registrados',money(paid),'Cobros guardados','green')}${metric('credit','Saldo de tratamientos',money(due),'Por cobrar (según planes)','orange')}</div><section class="panel"><div class="panel-head"><div><h3>Movimientos de pago</h3><p>Cada cobro se registra una sola vez en Caja</p></div>${can('payments')?btn('go-payments',`${icon('arrow')} Ir a Caja para cobrar`,'ghost sm'):''}</div><div class="table-scroll"><table class="data-table"><thead><tr><th>Fecha</th><th>Concepto</th><th>Método</th><th>Importe</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(dateFmt(x.date))}</td><td>${esc(x.concept)}</td><td>${esc(x.method)}</td><td class="table-main">${money(x.amount)}</td></tr>`).join('')||'<tr><td colspan="4">Sin cobros registrados.</td></tr>'}</tbody></table></div></section>`}
const upperTeeth=['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'];
const lowerTeeth=['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38'];
const upperBaby=['55','54','53','52','51','61','62','63','64','65'];
const lowerBaby=['85','84','83','82','81','71','72','73','74','75'];
const teethFor=(dentition)=>dentition==='temporal'?[...upperBaby,...lowerBaby]:[...upperTeeth,...lowerTeeth];
const findings={
 'sano':{label:'Evaluado sin hallazgos',color:'#d7eaf3'},
 'caries':{label:'Caries',color:'#f16876'},
 'restauracion':{label:'Restauración',color:'#44a8e8'},
 'endodoncia':{label:'Tratamiento de conductos',color:'#9d78df'},
 'corona':{label:'Corona',color:'#edb94d'},
 'fractura':{label:'Fractura',color:'#e28a4a'},
 'ausente':{label:'Pieza ausente',color:'#9cabc0'},
 'otro':{label:'Otro hallazgo',color:'#49bbaa'}
};
const surfaceLabels={V:'Vestibular',M:'Mesial',O:'Oclusal / incisal',D:'Distal',L:'Lingual / palatina'};
const dentalEvents=(pid,tooth='')=>db.dentalHistory.filter(h=>h.patientId===pid&&(!tooth||h.tooth===tooth));
const latestDental=(pid,tooth)=>dentalEvents(pid,tooth).slice().sort((a,b)=>(b.recordedAt||b.date||'').localeCompare(a.recordedAt||a.date||''))[0];
const summaryFindings=(pid,tooth)=>{const events=dentalEvents(pid,tooth);return [...new Set(events.map(e=>e.condition))].filter(x=>x!=='sin-evaluar')};
function toothShape(num){
 const n=Number(num[1]);
 if(n<=2)return 'M24 5c-8-1-12 6-12 14 0 9 6 17 7 28 1 7 4 9 5 1 2-8 2-15 6-15s4 7 6 15c1 8 3 6 5-1 2-11 7-19 7-28C36 11 32 4 24 5Z';
 if(n===3)return 'M23 5C11 2 8 11 10 22c2 7 5 11 6 21 1 10 4 13 6 9 2-7 2-14 5-14s2 7 4 14c2 5 5 1 6-9 1-8 5-15 5-23C42 9 35 2 23 5Z';
 return 'M24 7C15-1 5 7 6 20c1 10 8 15 9 25 1 8 3 13 6 10s2-15 5-15 3 12 6 15 5-2 6-10c1-9 8-17 9-25C48 7 35 0 24 7Z';
}
function detailedToothSvg(num, pid){
 const ev=latestDental(pid,num);const latest=ev?.condition;
 const col=findings[latest]?.color||'#c2d7e6';
 const surfaces=ev?.surfaces||[];const missing=dentalEvents(pid,num).some(h=>h.condition==='ausente');const shade=latest?'#f7fbff':'#ffffff';
 return `<svg viewBox="0 0 50 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="${toothShape(num)}" fill="${shade}" stroke="${col}" stroke-width="${latest?3:1.8}" stroke-linejoin="round"/>
  <path d="M17 20q7-7 15 0M20 26q4-3 9 0" fill="none" stroke="#d4e3ed" stroke-width="1.2"/>
  ${surfaces.length?`<circle cx="39" cy="10" r="5.5" fill="${col}" stroke="#fff" stroke-width="1.5"/>`:''}
  ${missing?'<path d="M11 9 39 52M39 9 11 52" stroke="#cc5667" stroke-width="3.2" stroke-linecap="round"/>':''}
 </svg>`;
}
function teethRow(ids,p){return `<div class="teeth-grid dental-grid ${ids.length===10?'baby-grid':''}">${ids.map(num=>{const events=dentalEvents(p.id,num);const last=latestDental(p.id,num);const cond=last?.condition;return `<button type="button" aria-pressed="${state.selectedTooth===num}" aria-label="Pieza ${num}, ${events.length?events.length+' registro(s)':'sin registros'}" title="Pieza ${num}: ${events.length} registro(s)" data-action="select-tooth" data-tooth="${num}" class="tooth-btn fancy-tooth ${state.selectedTooth===num?'selected':''}"><div class="tooth-figure">${detailedToothSvg(num,p.id)}</div><strong>${num}</strong>${events.length?'<span class="tooth-recorded-dot" aria-hidden="true"></span>':''}</button>`}).join('')}</div>`}
function surfacePicker(){
 const order=[['V','super-top'],['M','super-left'],['O','super-core'],['D','super-right'],['L','super-bottom']];
 return `<div class="surface-picker" role="group" aria-label="Superficies dentales">${order.map(([key,cls])=>`<button type="button" class="surface ${cls} ${state.selectedSurfaces.includes(key)?'on':''}" data-action="toggle-surface" data-surface="${key}" aria-pressed="${state.selectedSurfaces.includes(key)}" title="${surfaceLabels[key]}">${key}</button>`).join('')}</div>`;
}
function odontogramWidget(p){
 const allTeeth=teethFor(state.dentition);
 if(!allTeeth.includes(state.selectedTooth))state.selectedTooth=state.dentition==='temporal'?'85':'36';
 const num=state.selectedTooth;
 const rec=latestDental(p.id,num);
 const toothHistory=dentalEvents(p.id,num).sort((a,b)=>(b.recordedAt||b.date||'').localeCompare(a.recordedAt||a.date||''));
 const totalRecords=dentalEvents(p.id).length;
 const selectedPlans=treatFor(p.id).filter(t=>t.tooth===num);
 const procedures=['Restauración con resina','Curación dental','Tratamiento de conductos','Extracción dental','Corona dental','Limpieza dental','Sellante dental','Rehabilitación dental','Otro procedimiento'];
 return `<div id="odonto-app">
 <div class="dental-topbar"><div class="dentition-tabs" role="group" aria-label="Tipo de dentición"><button type="button" data-action="dentition" data-dentition="permanente" class="${state.dentition==='permanente'?'on':''}">Permanente · 32 piezas</button><button type="button" data-action="dentition" data-dentition="temporal" class="${state.dentition==='temporal'?'on':''}">Temporal · 20 piezas</button></div><button class="btn ghost sm" type="button" data-action="print-dental">${icon('download')} Imprimir / PDF</button></div>
 <div class="dental-main-grid"><aside class="panel tools-panel"><h3>Hallazgos</h3><p>Colores usados en el odontograma.</p><div class="finding-tools">${Object.entries(findings).map(([key,f])=>`<button type="button" class="finding-tool ${state.selectedFinding===key?'active':''}" data-action="choose-finding" data-condition="${key}"><span class="finding-dot" style="background:${f.color}"></span>${esc(f.label)}</button>`).join('')}</div><div class="tools-caption">${icon('info')} Los colores muestran hallazgos registrados; no indican por sí solos un tratamiento terminado.</div></aside>
 <div class="odonto-center-column"><section class="panel odontocard dental-chart-panel"><div class="dental-chart-head"><div><h3>Mapa dental</h3><p>Selecciona un diente para registrar el diagnóstico y el tratamiento.</p></div><div class="stat-mini">${totalRecords}<span> registros</span></div></div>
 <div class="jaw-label"><span>01</span> Arcada superior <small>maxilar</small></div>
 ${teethRow(state.dentition==='temporal'?upperBaby:upperTeeth,p)}
 <div class="midline">Línea media dental</div>
 <div class="jaw-label"><span>02</span> Arcada inferior <small>mandíbula</small></div>
 ${teethRow(state.dentition==='temporal'?lowerBaby:lowerTeeth,p)}
 </section>
 <div class="dental-history-cols"><section class="panel"><div class="panel-head"><div><h3>Historial del diente ${esc(num)}</h3><p>Qué se encontró, cuándo se registró y quién atendió. El historial de otras piezas no se repite aquí.</p></div><span class="pill gray">${toothHistory.length} registros</span></div><div class="dental-events">${toothHistory.slice(0,20).map(h=>`<div class="dental-event"><span class="event-color" style="background:${findings[h.condition]?.color||'#d6e7f2'}"></span><div><strong>${esc(findings[h.condition]?.label||h.condition)}</strong><p>${esc(h.note||'Sin observación')}</p><small>${esc(dateFmt(h.date))} · ${esc(staffName(h.doctorId))}${h.surfaces?.length?' · Zonas: '+esc(h.surfaces.map(s=>surfaceLabels[s]||s).join(', ')):''}</small></div></div>`).join('')||noData('Aún no se ha registrado una evaluación de este diente','tooth')}</div></section></div>
 </div>
 <aside class="dental-detail-card"><div class="dental-detail-top"><div><div class="tag">DIENTE SELECCIONADO</div><h3>Diente ${esc(num)}</h3></div><div class="large-tooth">${detailedToothSvg(num,p.id)}</div></div>
 <div class="latest-finding">${rec?`<span class="pill cyan">Último registro: ${esc(findings[rec.condition]?.label||rec.condition)}</span><p>${esc(rec.note||'Sin observaciones adicionales.')}</p>`:'<span class="pill gray">Todavía sin evaluar</span><p>Esta pieza no tiene anotaciones.</p>'}</div>
 ${can('odontogram')?`<form class="od-short-form" data-form="save-tooth" data-patient="${esc(p.id)}" data-tooth="${esc(num)}">
 <div class="od-form-section od-form-evaluation">
 <div class="od-step-label"><span>1</span> Evaluación del diente</div>
 <label class="dental-label" for="od-condition">Hallazgo clínico</label><select id="od-condition" name="condition" required>${Object.entries(findings).map(([k,x])=>`<option value="${k}" ${state.selectedFinding===k?'selected':''}>${esc(x.label)}</option>`).join('')}</select>
 <div class="surface-title"><strong>Superficie afectada</strong><span>Si corresponde</span></div>${surfacePicker()}<p class="surface-hint"><b>V</b> externa · <b>M</b> mesial · <b>O</b> masticación · <b>D</b> distal · <b>L</b> interna</p><input type="hidden" name="surfaces" value="${esc(state.selectedSurfaces.join(','))}">
 <label class="dental-label" for="dental-note">Observación clínica</label><textarea id="dental-note" name="note" placeholder="Describe lo encontrado..." maxlength="1200" rows="2" required></textarea>
 </div>
 <div class="od-form-section od-form-treatment">
 <div class="od-step-label"><span>2</span> Tratamiento y costo</div>
 <label class="dental-label" for="od-procedure">Procedimiento propuesto</label><select id="od-procedure" name="procedure"><option value="">Solo registrar evaluación</option>${procedures.map(pro=>`<option value="${esc(pro)}">${esc(pro)}</option>`).join('')}</select>
 <div class="od-compact-fields"><div><label class="dental-label" for="od-cost">Precio (S/)</label><input id="od-cost" name="price" type="number" min="0" step="0.01" placeholder="Ej. 180.00" inputmode="decimal"></div><div><label class="dental-label" for="od-stages">Sesiones</label><select id="od-stages" name="stages"><option value="1">1 sesión</option><option value="2">2 sesiones</option><option value="3">3 sesiones</option><option value="4">4 sesiones</option><option value="5">5 sesiones</option><option value="6">6 sesiones</option></select></div></div>
 </div>
 <div class="od-form-section od-form-appointment">
 <div class="od-step-label"><span>3</span> Cita (opcional)</div>
 <div class="od-compact-fields"><div><label class="dental-label" for="od-date">Fecha</label><input id="od-date" name="date" type="date" min="${today()}"></div><div><label class="dental-label" for="od-time">Hora</label><input id="od-time" name="time" type="time"></div></div>
 </div>
 <div class="od-form-footer"><p class="od-small-note">El tratamiento queda en 0 % hasta confirmar las sesiones realizadas.</p>
 <p id="form-error" class="od-form-error" role="alert" aria-live="polite"></p>
 <button type="submit" class="btn dental-save-btn">${icon('check')} Guardar diagnóstico y plan</button></div></form>`:`<div class="notice">${icon('shield')} Solo el odontólogo puede registrar diagnósticos, tratamientos y citas.</div>`}
 <details class="df-workflow"><summary class="df-workflow-summary"><strong>Seguimiento de tratamientos</strong><span>${selectedPlans.length} ${selectedPlans.length===1?'plan':'planes'} · Ver detalles</span></summary><div class="df-workflow-content"><p class="df-muted">Confirma únicamente las sesiones atendidas; programar una cita no cambia el avance.</p>
 ${selectedPlans.length?selectedPlans.map(t=>{const progress=planProgress(t);const next=applFor(p.id).filter(a=>a.treatmentId===t.id&&a.date>=today()&&a.status!=='Cancelada').sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))[0];return `<div class="df-plan"><div class="df-plan-head"><strong>${esc(t.title)}</strong><span class="pill ${progress===100?'green':'cyan'}">${progress}%</span></div><div class="od-plan-meta">Costo: ${money(t.price)} · ${esc(t.status)}${next?`<br>Próxima cita: ${esc(dateFmt(next.date))} · ${esc(next.time)}`:''}</div><div class="df-meter"><span style="width:${progress}%"></span></div>${t.steps?.length?t.steps.map((step,i)=>`<div class="df-step"><span class="df-step-icon ${step.done?'yes':''}">${step.done?'✓':i+1}</span><div class="df-step-text"><strong>${esc(step.title)}</strong><small>${step.done?'Realizada'+(step.completedAt?' · '+dateFmt(step.completedAt):''):'Pendiente de atención'}</small></div>${can('odontogram')&&!step.done&&t.steps.slice(0,i).every(x=>x.done)?`<button type="button" class="btn ghost sm" data-action="${step.kind==='extraccion'?'complete-extraction':'complete-plan-step'}" data-treatment="${esc(t.id)}" data-step="${esc(step.id)}" data-patient="${esc(p.id)}" data-tooth="${esc(step.tooth||num)}">${step.kind==='extraccion'?'Confirmar extracción realizada':'Marcar sesión realizada'}</button>`:''}</div>`).join(''):`<div class="od-old-plan">${can('odontogram')&&progress<100?`<button type="button" class="btn ghost sm" data-action="record-manual-progress" data-treatment="${esc(t.id)}" data-patient="${esc(p.id)}">Registrar avance de atención</button>`:`<small>Avance guardado: ${progress}%</small>`}</div>`}</div>`}).join(''):'<div class="df-muted">Al guardar un tratamiento aparecerá aquí su avance y sus sesiones.</div>'}
 ${extractionRecorded(p.id,num)?`<div class="df-extraction-done">${icon('check')} Extracción efectuada y registrada en el expediente.</div>`:''}
 </div></details></aside>
 </div></div>`;
}
/* ================================================
   PRESUPUESTOS DENTALES - DEMO LOCAL
   Las cotizaciones NO crean pacientes hasta su aceptación.
   Se imprimen como documento independiente, no como captura de la web.
   ================================================ */
const quoteProcedures=[
 'Restauración con resina','Curación dental','Tratamiento de conductos','Extracción dental',
 'Corona dental','Limpieza dental','Sellante dental','Rehabilitación dental','Otro procedimiento'
];
const quotes=()=>db.quotes.filter(q=>q.clinicId===session.clinicId).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
const quoteAmount=q=>(q.items||[]).reduce((sum,item)=>sum+(Number(item.price)||0),0);
const quoteLabel=(num)=>num==='—'?'General':`Pieza ${num}`;
const quoteStatus=s=>s==='Aceptado'?'green':'orange';
function newQuoteDraft(source){
 if(source)return JSON.parse(JSON.stringify(source));
 return {id:'',clinicId:session.clinicId,firstName:'',lastName:'',age:'',phone:'',address:'',dni:'',notes:'',doctorId:me()?.role==='odontologo'?me().id:(doctors()[0]?.id||''),status:'Pendiente',items:[]};
}
function quoteField(label,name,type='text',required=false,extra=''){
 const d=state.quoteDraft||{};
 return `<label class="quote-field"><span>${esc(label)}${required?' <b>*</b>':''}</span><input data-quote-field="${name}" name="${name}" type="${type}" value="${esc(d[name]??'')}" ${required?'required':''} ${extra}></label>`;
}
function renderQuotes(){
 if(state.quoteDraft)return renderQuoteEditor();
 const list=quotes();
 return `${heading('Presupuestos','Elabora propuestas de tratamiento y entrégalas en PDF. Solo se crea la ficha del paciente cuando acepta.',btn('quote-new',`${icon('plus')} Registrar presupuesto`))}
 <div class="quote-kpis"><div class="panel"><span>Presupuestos guardados</span><strong>${list.length}</strong></div><div class="panel"><span>Pendientes de respuesta</span><strong>${list.filter(q=>q.status!=='Aceptado').length}</strong></div><div class="panel"><span>Convertidos en pacientes</span><strong>${list.filter(q=>q.status==='Aceptado').length}</strong></div></div>
 <section class="panel quote-list"><div class="quote-list-title"><div><h2>Historial de presupuestos</h2><p>Puedes imprimirlos o aceptar uno pendiente más adelante.</p></div></div>
 <div class="table-scroll"><table class="data-table"><thead><tr><th>N.º</th><th>Paciente / interesado</th><th>Fecha</th><th>Procedimientos</th><th>Importe</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
 ${list.map(q=>`<tr><td><strong>${esc(quoteNumber(q))}</strong></td><td class="table-main">${esc(q.firstName+' '+q.lastName)}</td><td>${esc(dateFmt(q.date||today()))}</td><td>${q.items.length}</td><td><strong>${money(quoteAmount(q))}</strong></td><td><span class="pill ${quoteStatus(q.status)}">${esc(q.status)}</span></td><td><div class="quote-table-actions">${btn('quote-open','Ver detalles','ghost sm',`data-id="${esc(q.id)}"`)}${btn('quote-print',`${icon('download')} PDF`,'ghost sm',`data-id="${esc(q.id)}"`)}</div></td></tr>`).join('')||'<tr><td colspan="7" class="quote-list-empty">Todavía no hay presupuestos. Pulsa «Registrar presupuesto» para crear uno.</td></tr>'}
 </tbody></table></div></section><div class="quote-warning">${icon('info')} Solo demostración con datos inventados. La información se guarda en este navegador; no es un sistema clínico seguro.</div>`;
}
function quoteNumber(q){return q.number?`PRE-${String(q.number).padStart(4,'0')}`:'Borrador';}
function quoteTeethRow(numbers){
 return `<div class="quote-teeth">${numbers.map(number=>{
  const chosen=state.quoteTooth===number;
  const hits=(state.quoteDraft.items||[]).filter(i=>i.tooth===number);
  return `<button type="button" data-action="quote-tooth" data-tooth="${number}" title="Seleccionar pieza ${number}" class="quote-tooth ${chosen?'selected':''} ${hits.length?'with-item':''}" aria-pressed="${chosen}"><span>${toothSvg()}</span><small>${number}</small>${hits.length?`<i aria-hidden="true"></i>`:''}</button>`;
 }).join('')}</div>`;
}
function renderQuoteEditor(){
 const q=state.quoteDraft,readOnly=q.status==='Aceptado';
 const upper=state.quoteDentition==='temporal'?upperBaby:upperTeeth;
 const lower=state.quoteDentition==='temporal'?lowerBaby:lowerTeeth;
 const finding=state.quoteNewItem.finding;
 return `<div class="quote-topline"><button class="quote-back" data-action="quote-back">${icon('arrow')} Volver a presupuestos</button><span class="pill ${quoteStatus(q.status)}">${readOnly?'Presupuesto aceptado':q.id?'Presupuesto pendiente':'Nuevo presupuesto'}</span></div>
 ${heading(readOnly?'Presupuesto aprobado':q.id?'Editar presupuesto':'Registrar presupuesto','Revisa al paciente, selecciona las piezas y coloca el procedimiento con su costo.',q.id?btn('quote-print',`${icon('download')} Imprimir / PDF`,'ghost'):'')}
 <section class="panel quote-section"><div class="quote-step-head"><span class="quote-step">1</span><div><h2>Datos de la persona</h2><p>Esta información aparecerá en el PDF. No se crea todavía un expediente clínico.</p></div></div>
 <div class="quote-info-grid">${quoteField('Nombres','firstName','text',true,'maxlength="70" '+(readOnly?'disabled':''))}${quoteField('Apellidos','lastName','text',true,'maxlength="80" '+(readOnly?'disabled':''))}${quoteField('Edad (años)','age','number',true,'min="1" max="120" '+(readOnly?'disabled':''))}${quoteField('Celular','phone','tel',true,'maxlength="25" '+(readOnly?'disabled':''))}${quoteField('Dirección','address','text',true,'maxlength="180" '+(readOnly?'disabled':''))}${quoteField('DNI (opcional)','dni','text',false,'maxlength="20" '+(readOnly?'disabled':''))}</div></section>
 <section class="panel quote-section"><div class="quote-step-head"><span class="quote-step">2</span><div><h2>Odontograma para el presupuesto</h2><p>Selecciona una pieza. A la derecha anota el hallazgo, el tratamiento propuesto y el precio.</p></div></div>
 <div class="quote-dentition"><button type="button" data-action="quote-dentition" data-dentition="permanente" class="${state.quoteDentition==='permanente'?'active':''}" ${readOnly?'disabled':''}>Dentición permanente · 32</button><button type="button" data-action="quote-dentition" data-dentition="temporal" class="${state.quoteDentition==='temporal'?'active':''}" ${readOnly?'disabled':''}>Dentición temporal · 20</button></div>
 <div class="quote-editor-grid"><div class="quote-jaw-chart"><div class="quote-arch-label">Arcada superior <small>Maxilar</small></div>${quoteTeethRow(upper)}<div class="quote-midline">LÍNEA MEDIA DENTAL</div><div class="quote-arch-label">Arcada inferior <small>Mandíbula</small></div>${quoteTeethRow(lower)}<div class="quote-chart-note">Los números identifican las piezas dentales. El punto turquesa indica una pieza añadida al presupuesto.</div></div>
 <div class="quote-piece-card"><div class="quote-piece-head"><div>${toothSvg()}</div><span><small>PIEZA SELECCIONADA</small><strong>Diente ${esc(state.quoteTooth)}</strong></span></div>
 <label class="quote-field"><span>Hallazgo del odontólogo *</span><select data-quote-new="finding" ${readOnly?'disabled':''}>${Object.entries(findings).map(([key,item])=>`<option value="${key}" ${finding===key?'selected':''}>${esc(item.label)}</option>`).join('')}</select></label>
 <label class="quote-field"><span>Tratamiento que se propone *</span><select data-quote-new="procedure" ${readOnly?'disabled':''}>${quoteProcedures.map(p=>`<option value="${esc(p)}" ${state.quoteNewItem.procedure===p?'selected':''}>${esc(p)}</option>`).join('')}</select></label>
 <label class="quote-field"><span>Precio estimado (S/) *</span><input type="number" min="0" step="0.01" placeholder="Ejemplo: 180.00" value="${esc(state.quoteNewItem.price)}" data-quote-new="price" ${readOnly?'disabled':''}></label>
 <label class="quote-field"><span>Observación (opcional)</span><textarea data-quote-new="note" maxlength="400" rows="3" placeholder="Explica brevemente lo que se hará" ${readOnly?'disabled':''}>${esc(state.quoteNewItem.note)}</textarea></label>
 ${readOnly?'':btn('quote-add-item',`${icon('plus')} Agregar procedimiento`)}
 </div></div></section>
 <section class="panel quote-section"><div class="quote-step-head"><span class="quote-step">3</span><div><h2>Detalle del presupuesto</h2><p>El paciente podrá ver cuánto cuesta cada tratamiento y el total estimado.</p></div></div>
 <div class="table-scroll"><table class="data-table quote-items-table"><thead><tr><th>Pieza</th><th>Hallazgo</th><th>Tratamiento propuesto</th><th>Costo</th>${readOnly?'':'<th></th>'}</tr></thead><tbody>${q.items.map(item=>`<tr><td><span class="quote-number">${esc(item.tooth)}</span></td><td>${esc(findings[item.finding]?.label||item.finding)}</td><td><strong>${esc(item.procedure)}</strong>${item.note?`<small class="quote-item-note">${esc(item.note)}</small>`:''}</td><td>${money(item.price)}</td>${readOnly?'':`<td>${btn('quote-remove-item',icon('close'),'ghost sm',`data-id="${esc(item.id)}" aria-label="Eliminar procedimiento"`)}</td>`}</tr>`).join('')||`<tr><td colspan="${readOnly?4:5}">Aún no añadiste ningún procedimiento. Selecciona un diente para comenzar.</td></tr>`}</tbody></table></div>
 <div class="quote-total"><span>Total estimado</span><strong>${money(quoteAmount(q))}</strong></div>
 <label class="quote-field quote-notes"><span>Indicaciones generales para el presupuesto (opcional)</span><textarea data-quote-field="notes" rows="3" maxlength="800" placeholder="Ejemplo: El tratamiento se realizará en dos sesiones, sujeto a evaluación." ${readOnly?'disabled':''}>${esc(q.notes||'')}</textarea></label>
 </section>
 <section class="panel quote-actions-panel"><div><h3>¿Qué deseas hacer?</h3><p><b>Guardar presupuesto:</b> queda pendiente y no crea cliente. <b>Guardar cliente:</b> confirma que aceptó y abre su expediente con los tratamientos propuestos.</p></div>
 <div class="quote-bottom-actions">${btn('quote-print',`${icon('download')} Vista previa / PDF`,'ghost')}${readOnly?btn('quote-go-patient',`${icon('users')} Ver expediente`,'primary',`data-id="${esc(q.patientId||'')}"`):`${btn('quote-save',`${icon('file')} Guardar presupuesto`,'ghost')}${btn('quote-approve',`${icon('check')} Guardar cliente`)}`}</div></section>`;
}
function quoteValidate(q){
 if(!q.firstName?.trim()||!q.lastName?.trim()||!q.phone?.trim()||!q.address?.trim())return 'Completa nombres, apellidos, celular y dirección.';
 const age=Number(q.age);if(!Number.isInteger(age)||age<1||age>120)return 'Ingresa una edad válida entre 1 y 120 años.';
 if(!Array.isArray(q.items)||!q.items.length)return 'Añade al menos un procedimiento en el odontograma.';
 if(q.items.some(item=>!item.tooth||!item.procedure||!Number.isFinite(Number(item.price))||Number(item.price)<0))return 'Revisa las piezas, procedimientos y precios.';
 return '';
}
function quoteSave(approve=false){
 const q=state.quoteDraft;if(!q||q.status==='Aceptado')return;
 const error=quoteValidate(q);if(error)return toast(error,true);
 if(approve&&!confirm(`¿${q.firstName} ${q.lastName} aceptó el presupuesto de ${money(quoteAmount(q))}? Se creará su expediente y sus tratamientos pendientes.`))return;
 const saved=q.id?db.quotes.find(x=>x.id===q.id&&x.clinicId===session.clinicId):null;
 if(q.id&&!saved)return toast('No se encontró este presupuesto en la clínica.',true);
 const copy=JSON.parse(JSON.stringify(q));
 if(!saved){copy.id=id('quote');copy.number=db.quotes.filter(x=>x.clinicId===session.clinicId).reduce((n,x)=>Math.max(n,Number(x.number)||0),0)+1;copy.date=today();copy.createdAt=new Date().toISOString();}
 copy.updatedAt=new Date().toISOString();copy.status=approve?'Aceptado':'Pendiente';
 if(approve){
  let patient=copy.patientId?db.patients.find(p=>p.id===copy.patientId):null;
  // Nunca asociar automáticamente por un nombre parecido. Solo el propio presupuesto aprobado.
  if(!patient){
   const doctor=doctors().find(d=>d.id===copy.doctorId)||doctors()[0];
   if(!doctor)return toast('Esta clínica no tiene odontólogo disponible.',true);
   patient={id:id('p'),clinicId:session.clinicId,name:(copy.firstName+' '+copy.lastName).trim(),
    dni:copy.dni||'',phone:copy.phone,email:'',dob:'',age:Number(copy.age),address:copy.address,
    doctorId:doctor.id,allergies:'',notes:`Paciente ingresado desde presupuesto ${quoteNumber(copy)} aceptado. Completar su historia clínica.`,createdAt:today()};
   db.patients.push(patient);
  }
  copy.patientId=patient.id;
  copy.approvedAt=copy.approvedAt||new Date().toISOString();
  // Se conservan los hallazgos consignados en la evaluación, sin marcar tratamientos como realizados.
  db.dental[patient.id]||={};
  for(const item of copy.items){
   if(db.dentalHistory.some(h=>h.quoteId===copy.id&&h.quoteItemId===item.id))continue;
   const clinicalNote=`Hallazgo consignado para presupuesto: ${findings[item.finding]?.label||item.finding}. Tratamiento propuesto: ${item.procedure}. ${item.note||''}`.trim();
   db.dentalHistory.push({id:id('dh'),clinicId:session.clinicId,patientId:patient.id,tooth:item.tooth,
    condition:item.finding,surfaces:[],note:clinicalNote,date:today(),recordedAt:new Date().toISOString(),
    doctorId:patient.doctorId,dentition:item.dentition||'permanente',recordType:'evaluacion-presupuesto',quoteId:copy.id,quoteItemId:item.id});
   db.dental[patient.id][item.tooth]={condition:item.finding,note:clinicalNote,updatedAt:today()};
  }
  // Cada propuesta se convierte en un tratamiento PENDIENTE, nunca en un procedimiento realizado.
  for(const item of copy.items){
   if(db.treatments.some(t=>t.quoteItemId===item.id&&t.quoteId===copy.id))continue;
   db.treatments.push({id:id('t'),clinicId:session.clinicId,patientId:patient.id,doctorId:patient.doctorId,
    title:item.procedure,tooth:item.tooth,price:Number(item.price),progress:0,status:'Pendiente',
    quoteId:copy.id,quoteItemId:item.id});
  }
 }
 if(saved)Object.assign(saved,copy);else db.quotes.push(copy);
 save();state.quoteDraft=null;render();
 toast(approve?'Presupuesto aceptado: paciente y tratamientos pendientes guardados.':'Presupuesto guardado sin crear expediente del paciente.');
}
function quotePreview(q){
 const error=quoteValidate(q);if(error)return toast(error,true);
 const name=`${q.firstName} ${q.lastName}`.trim();
 const date=q.date||today();
 const total=quoteAmount(q);
 const html=`<div class="quote-pdf-page"><header class="quote-pdf-header"><div class="quote-pdf-brand"><span class="quote-pdf-logo">${icon('tooth')}</span><div><strong>${esc(clinic()?.name||'Clínica Dental')}</strong><small>Presupuesto de atención odontológica</small></div></div><div class="quote-pdf-number"><span>${esc(quoteNumber(q))}</span><small>Fecha: ${esc(dateFmt(date))}</small></div></header>
 <div class="quote-pdf-title"><span>PROPUESTA DE TRATAMIENTO</span><h1>Tu presupuesto dental</h1><p>Conoce qué tratamientos te propone el odontólogo y cuánto costarán.</p></div>
 <section class="quote-pdf-patient"><h2>Datos de la persona evaluada</h2><div><p><span>Nombre</span><strong>${esc(name)}</strong></p><p><span>Edad</span><strong>${esc(q.age)} años</strong></p><p><span>Celular</span><strong>${esc(q.phone)}</strong></p><p><span>Dirección</span><strong>${esc(q.address)}</strong></p><p><span>Odontólogo</span><strong>${esc(staffName(q.doctorId))}</strong></p>${q.dni?`<p><span>Documento</span><strong>${esc(q.dni)}</strong></p>`:''}</div></section>
 <section class="quote-pdf-treatments"><h2>Tratamientos propuestos</h2><p class="quote-pdf-intro">El número de pieza identifica el diente. Los procedimientos indicados todavía no se consideran realizados.</p><table><thead><tr><th>Pieza</th><th>¿Qué encontramos?</th><th>¿Qué se propone hacer?</th><th>Precio (S/)</th></tr></thead><tbody>
 ${q.items.map(item=>`<tr><td><b class="quote-pdf-tooth">${esc(item.tooth)}</b></td><td>${esc(findings[item.finding]?.label||item.finding)}</td><td><strong>${esc(item.procedure)}</strong>${item.note?`<small>${esc(item.note)}</small>`:''}</td><td class="quote-pdf-price">${Number(item.price).toFixed(2)}</td></tr>`).join('')}
 </tbody></table></section><div class="quote-pdf-amount"><span>Total estimado del presupuesto</span><strong>${money(total)}</strong></div>
 ${q.notes?`<section class="quote-pdf-notes"><h2>Observaciones de tu odontólogo</h2><p>${esc(q.notes).replace(/\n/g,'<br>')}</p></section>`:''}
 <div class="quote-pdf-info"><b>¿Qué sigue?</b><p>Revisa los tratamientos y el costo estimado. Si estás de acuerdo, comunícalo a la clínica para registrar tu expediente y programar las citas correspondientes.</p></div>
 <div class="quote-pdf-signatures"><div><i></i><span>Firma del profesional</span></div><div><i></i><span>Firma de conformidad del paciente (opcional)</span></div></div><footer>Documento informativo de demostración · Los precios son estimados · No acredita procedimientos realizados.</footer></div>`;
 let root=document.getElementById('quote-print-root');if(!root){root=document.createElement('div');root.id='quote-print-root';document.body.appendChild(root)}
 root.innerHTML=html;document.body.classList.add('quote-print');
 const title=document.title;document.title=`Presupuesto dental - ${name} - Endomolar`;
 const finish=()=>{document.body.classList.remove('quote-print');document.title=title;root.remove()};
 window.addEventListener('afterprint',finish,{once:true});
 window.print();
 // Respaldo: algunos navegadores no disparan afterprint al cancelar.
 // La limpieza también ocurre al volver a interactuar con la página.
}

function renderAppointments(){
 const ds=state.appointmentDate;
 const apts=appointments().filter(a=>a.date===ds).sort((a,b)=>a.time.localeCompare(b.time));
 const apHours=apts.map(a=>Number(a.time.split(':')[0]));const firstHour=Math.min(8,...apHours),lastHour=Math.max(19,...apHours);const hours=Array.from({length:lastHour-firstHour+1},(_,i)=>String(i+firstHour).padStart(2,'0'));
 const grid=hours.map(hr=>{const items=apts.filter(a=>a.time.startsWith(hr+':'));return `<div class="time-slot">${hr}:00</div><div class="slot-body">${items.map(a=>`<div class="appointment-block ${statusClass(a.status)}"><div><strong>${esc(a.time)} · ${esc(patientName(a.patientId))}</strong><small>${esc(a.type)} · ${esc(staffName(a.doctorId))} · ${a.duration} min</small></div><div style="display:flex;gap:8px;align-items:center">${pill(a.status)}${can('appointment')?btn('edit-appointment',icon('edit','tinyicon'),'ghost sm',`data-id="${a.id}" title="Editar cita"`):''}</div></div>`).join('')||'<span class="small muted">Disponible</span>'}</div>`}).join('');
 return `${heading('Agenda de citas','Control de horarios, odontólogos, pacientes y estado de cada consulta.',can('appointment')?btn('new-appointment',`${icon('plus')} Nueva cita`):'')}<div class="metric-grid">${metric('calendar','Citas del día',String(apts.length),'Agendadas para esta fecha')}${metric('check','Confirmadas',String(apts.filter(a=>a.status==='Confirmada').length),'Pendientes de atención','green')}${metric('clock','Por confirmar',String(apts.filter(a=>a.status==='Pendiente').length),'Requieren confirmación','orange')}${metric('tooth','Atendidas',String(apts.filter(a=>a.status==='Finalizada').length),'Consultas finalizadas','violet')}</div><section class="panel"><div class="panel-head"><div><h3>Agenda del día</h3><p>${esc(dateLong(ds))}</p></div><div class="appointment-day"><button class="btn ghost sm" data-action="appointment-prev">Anterior</button><input class="input-slim" type="date" id="appointment-date" value="${esc(ds)}"><button class="btn ghost sm" data-action="appointment-next">Siguiente</button></div></div><div class="calendar-list">${grid}</div></section>`;
}
function renderTreatments(){
 return `${heading('Tratamientos','Planes, piezas involucradas, progreso clínico, presupuesto y saldo.',can('treatment')?btn('new-treatment',`${icon('plus')} Nuevo tratamiento`):'')}<section class="panel"><div class="panel-head"><div><h3>Planes registrados</h3><p>Tratamientos de pacientes de esta clínica</p></div><span class="pill cyan">${treatments().length} planes</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Paciente</th><th>Procedimiento</th><th>Odontólogo</th><th>Estado</th><th>Avance</th><th>Presupuesto</th><th>Pagado</th><th>Saldo</th><th></th></tr></thead><tbody>${treatments().map(t=>`<tr><td class="table-main">${esc(patientName(t.patientId))}</td><td>${esc(t.title)}<div class="table-meta">Pieza: ${esc(t.tooth||'—')}</div></td><td>${esc(staffName(t.doctorId))}</td><td>${pill(t.status)}</td><td><strong>${planProgress(t)}%</strong>${t.steps?.length?`<div class="table-meta">${t.steps.filter(x=>x.done).length}/${t.steps.length} etapas</div>`:''}</td><td>${money(t.price)}</td><td>${money(numPaid(t.id))}</td><td class="table-main">${money(Math.max(0,t.price-numPaid(t.id)))}</td><td>${can('treatment')?btn('edit-treatment','Actualizar','ghost sm',`data-id="${t.id}"`):''}</td></tr>`).join('')||'<tr><td colspan="9">No hay tratamientos.</td></tr>'}</tbody></table></div></section>`;
}
function renderPayments(){
 const ps=payments().sort((a,b)=>b.date.localeCompare(a.date));
 const total=ps.reduce((s,p)=>s+Number(p.amount),0);
 const budget=treatments().reduce((s,t)=>s+Number(t.price),0);const due=treatments().reduce((s,t)=>s+Math.max(0,t.price-numPaid(t.id)),0);
 return `${heading('Caja y pagos','Registra cobros una sola vez y consulta el saldo de cada tratamiento.',can('payments')?btn('new-payment',`${icon('plus')} Registrar pago`):'')}<div class="metric-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${metric('dollar','Total cobrado',money(total),'Todos los registros','green')}${metric('credit','Presupuestos',money(budget),'Planes de esta clínica','violet')}${metric('clock','Saldo pendiente',money(due),'Estimado de planes registrados','orange')}</div><section class="panel"><div class="panel-head"><div><h3>Historial de cobros</h3><p>Fecha, paciente, procedimiento y método de pago</p></div><span class="pill cyan">${ps.length} movimientos</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Fecha</th><th>Paciente</th><th>Concepto</th><th>Tratamiento</th><th>Método</th><th>Importe</th></tr></thead><tbody>${ps.map(p=>`<tr><td>${esc(dateFmt(p.date))}</td><td class="table-main">${esc(patientName(p.patientId))}</td><td>${esc(p.concept)}</td><td>${esc(db.treatments.find(t=>t.id===p.treatmentId)?.title||'Pago sin plan')}</td><td>${esc(p.method)}</td><td class="table-main">${money(p.amount)}</td></tr>`).join('')||'<tr><td colspan="6">Sin cobros.</td></tr>'}</tbody></table></div></section>`;
}
function workerCard(w){
 const assigned=patients().filter(p=>p.doctorId===w.id);
 const todayCount=appointments().filter(a=>a.doctorId===w.id&&a.date===today()).length;
 return `<div class="worker-card"><div class="worker-top"><div class="avatar">${esc(initials(w.name))}</div><div><h3>${esc(w.name)}</h3><p>${esc(w.specialty||roleName(w.role))}</p></div></div><span class="pill ${w.role==='odontologo'?'cyan':'gray'}">${esc(roleName(w.role))}</span><div class="worker-metrics"><div><strong>${w.role==='odontologo'?assigned.length:'—'}</strong><small>Pacientes asignados</small></div><div><strong>${w.role==='odontologo'?todayCount:'—'}</strong><small>Citas de hoy</small></div></div>${btn('open-worker',`${icon('eye')} Ver ficha y seguimiento`,'ghost',`data-id="${w.id}"`)}</div>`;
}
function renderWorkers(){
 if(state.workerId&&staff().some(w=>w.id===state.workerId))return renderWorkerDetail(staff().find(w=>w.id===state.workerId));
 const options=[['all','Todos'],['odontologo','Odontólogos'],['enfermera','Enfermeras'],['recepcion','Recepción'],['administrador','Administradores']];
 const ws=staff().filter(w=>state.workerFilter==='all'||w.role===state.workerFilter);
 return `${heading('Trabajadores','Odontólogos, enfermeras, recepción y administración. Cada odontólogo ve sus pacientes.',can('staff')?btn('new-worker',`${icon('plus')} Nuevo trabajador`):'')}<div class="toolbar"><div class="filter-btns">${options.map(([key,label])=>`<button class="btn ghost sm ${state.workerFilter===key?'active':''}" data-action="worker-filter" data-filter="${key}">${label}</button>`).join('')}</div><span class="small muted">${staff().length} personas registradas</span></div><div class="worker-grid">${ws.map(workerCard).join('')||noData('No hay trabajadores con este filtro','people')}</div>`;
}
function renderWorkerDetail(w){
 const assigned=patients().filter(p=>p.doctorId===w.id);
 const apts=appointments().filter(a=>a.doctorId===w.id).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
 const tr=treatments().filter(t=>t.doctorId===w.id);
 return `${heading('Ficha del trabajador',`Profesional: ${w.name}`,btn('back-workers',`${icon('arrow')} Volver a trabajadores`,'ghost'))}<div class="panel panel-pad" style="margin-bottom:17px;display:flex;align-items:center;gap:14px"><div class="avatar" style="height:66px;width:66px;font-size:21px">${esc(initials(w.name))}</div><div><h2 style="margin:0 0 5px">${esc(w.name)}</h2><p style="margin:0 0 7px" class="small muted">${esc(w.email||'Sin correo')} · ${esc(w.specialty||'Sin especialidad')}</p><span class="pill cyan">${esc(roleName(w.role))}</span></div></div>${w.role!=='odontologo'?`<div class="notice">${icon('info')} Este trabajador tiene rol ${esc(roleName(w.role))}. Los pacientes y tratamientos se asignan a odontólogos, no al personal de apoyo.</div>`:`<div class="metric-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${metric('users','Pacientes asignados',String(assigned.length),'Bajo su responsabilidad')}${metric('calendar','Citas agendadas',String(apts.length),'En esta clínica','violet')}${metric('tooth','Planes de tratamiento',String(tr.length),'En seguimiento','cyan')}</div><div class="cols-equal"><section class="panel"><div class="panel-head"><div><h3>Pacientes del odontólogo</h3><p>Abre el expediente para revisar su evolución.</p></div></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Paciente</th><th>Tratamientos</th><th></th></tr></thead><tbody>${assigned.map(p=>`<tr><td class="table-main">${esc(p.name)}</td><td>${treatFor(p.id).length}</td><td>${btn('open-patient','Ver expediente','ghost sm',`data-id="${p.id}"`)}</td></tr>`).join('')||'<tr><td colspan="3">Sin pacientes asignados.</td></tr>'}</tbody></table></div></section><section class="panel"><div class="panel-head"><div><h3>Próximas citas</h3><p>Calendario del profesional</p></div></div><div class="list-appointments">${apts.filter(a=>a.date>=today()&&a.status!=='Cancelada').slice(0,6).map(a=>`<div class="appointment-item"><time>${esc(a.time)}</time><div><strong>${esc(patientName(a.patientId))}</strong><small>${esc(dateFmt(a.date))} · ${esc(a.type)}</small></div>${pill(a.status)}</div>`).join('')||noData('Sin citas próximas','calendar')}</div></section></div>`}`;
}
function renderReports(){
 const ap=appointments(),tr=treatments(),pa=payments();
 const byDoctor=doctors().map(d=>({doctor:d,patients:patients().filter(p=>p.doctorId===d.id).length,appointments:ap.filter(a=>a.doctorId===d.id).length,active:tr.filter(t=>t.doctorId===d.id&&t.status==='En curso').length}));
 return `${heading('Reportes','Indicadores internos de la clínica y seguimiento de profesionales.',btn('export-csv',`${icon('download')} Exportar pacientes CSV`,'ghost'))}<div class="metric-grid">${metric('users','Pacientes',patients().length,'Expedientes activos')}${metric('calendar','Total de citas',ap.length,'Incluye todos los estados','violet')}${metric('clipboard','Tratamientos en curso',tr.filter(t=>t.status==='En curso').length,'Seguimiento clínico','cyan')}${metric('dollar','Cobrado',money(pa.reduce((s,p)=>s+Number(p.amount),0)),'Movimientos registrados','green')}</div><section class="panel"><div class="panel-head"><div><h3>Actividad por odontólogo</h3><p>Resumen del personal odontológico de esta clínica</p></div></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Profesional</th><th>Especialidad</th><th>Pacientes</th><th>Citas</th><th>Tratamientos activos</th></tr></thead><tbody>${byDoctor.map(x=>`<tr><td class="table-main">${esc(x.doctor.name)}</td><td>${esc(x.doctor.specialty)}</td><td>${x.patients}</td><td>${x.appointments}</td><td>${x.active}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function field(label,name,value='',type='text',extra=''){
 return `<div class="field"><label for="field-${name}">${esc(label)}</label><input id="field-${name}" type="${type}" name="${name}" value="${esc(value)}" ${extra}></div>`;
}
function selectField(label,name,options,selected='',extra=''){
 return `<div class="field"><label for="field-${name}">${esc(label)}</label><select id="field-${name}" name="${name}" ${extra}>${options.map(([v,t])=>`<option value="${esc(v)}" ${String(v)===String(selected)?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
}
function textareaField(label,name,value='',extra=''){return `<div class="field full"><label for="field-${name}">${esc(label)}</label><textarea id="field-${name}" name="${name}" ${extra}>${esc(value)}</textarea></div>`}
function modal(title,subtitle,formName,body,saveLabel='Guardar',extra=''){
 $('#modal-root').innerHTML=`<div class="modal-overlay" id="modal-overlay"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-top"><div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div>${btn('close-modal',icon('close'),'ghost iconbtn')}</div><form data-form="${formName}" ${extra}><div class="modal-content"><div class="form-grid">${body}</div><div class="err" id="form-error" style="margin-top:9px"></div></div><div class="modal-footer">${btn('close-modal','Cancelar','ghost')}<button type="submit" class="btn">${icon('check')} ${esc(saveLabel)}</button></div></form></div></div>`;
 const first=$('.modal input,.modal select');if(first)first.focus();
}
function closeModal(){$('#modal-root').innerHTML=''}
function optionPatients(selected='',placeholder=true){return [...(placeholder?[['','Seleccionar paciente']]:[]),...patients().map(p=>[p.id,p.name])];}
function optionDoctors(selected=''){const docs=doctors().filter(d=>me().role!=='odontologo'||d.id===me().id);return [['','Seleccionar odontólogo'],...docs.map(x=>[x.id,x.name])];}
function openForm(kind,params={}){
 if(kind==='patient'){
 const p=db.patients.find(x=>x.id===params.id&&x.clinicId===session.clinicId);
 if(!can('patient'))return toast('Tu rol no permite gestionar pacientes.',true);
 modal(p?'Editar datos del paciente':'Nuevo paciente','Datos básicos y responsable clínico','patient',`${field('Nombre completo *','name',p?.name,'text','required maxlength="100"')}${field('DNI / documento *','dni',p?.dni,'text','required maxlength="20"')}${field('Teléfono','phone',p?.phone,'tel','maxlength="30"')}${field('Correo','email',p?.email,'email','maxlength="100"')}${field('Fecha de nacimiento','dob',p?.dob,'date')}${selectField('Odontólogo asignado *','doctorId',optionDoctors(),p?.doctorId|| (me().role==='odontologo'?me().id:''),'required')}${field('Alergias / antecedentes referidos','allergies',p?.allergies||'','text','maxlength="150"')}${textareaField('Notas generales','notes',p?.notes||'','maxlength="700"')}`,'Guardar paciente',`data-id="${p?.id||''}"`);return;
 }
 if(kind==='appointment'){
 if(!can('appointment'))return toast('Tu rol no permite gestionar citas.',true);
 const a=db.appointments.find(x=>x.id===params.id&&x.clinicId===session.clinicId);
 modal(a?'Gestionar cita':'Nueva cita','Se comprueba la superposición de horario del odontólogo','appointment',`${selectField('Paciente *','patientId',optionPatients(),a?.patientId||params.patientId,'required')}${selectField('Odontólogo *','doctorId',optionDoctors(),a?.doctorId||'','required')}${field('Fecha *','date',a?.date||state.appointmentDate,'date','required')}${field('Hora *','time',a?.time||'09:00','time','required')}${field('Duración en minutos *','duration',a?.duration||45,'number','required min="15" max="240" step="5"')}${field('Motivo de consulta *','type',a?.type||'Evaluación dental','text','required maxlength="120"')}${selectField('Estado','status',['Pendiente','Confirmada','En atención','Finalizada','Cancelada'].map(v=>[v,v]),a?.status||'Pendiente')}`,'Guardar cita',`data-id="${a?.id||''}"`);return;
 }
 if(kind==='record'){
 if(!can('clinical'))return toast('Solo un odontólogo puede añadir una nota clínica en esta demo.',true);
 const p=patientById(params.patientId);if(!p)return;
 modal('Registrar nueva atención',`Expediente de ${p.name}`,'record',`${selectField('Tipo de registro','type',['Evaluación','Evolución','Procedimiento','Seguimiento'].map(v=>[v,v]))}${field('Fecha','date',today(),'date','required')}${textareaField('Observación clínica *','notes','','required maxlength="1500"')}`,'Registrar nota',`data-patient="${p.id}"`);return;
 }
 if(kind==='treatment'){
 if(!can('treatment'))return toast('Tu rol no permite gestionar tratamientos.',true);
 const t=db.treatments.find(x=>x.id===params.id&&x.clinicId===session.clinicId);
 if(t?.steps?.length)return toast('Este plan se actualiza completando sus etapas desde el odontograma.',true);
 modal(t?'Actualizar tratamiento':'Nuevo plan de tratamiento','Procedimiento y estado, separado de los cobros de caja','treatment',`${selectField('Paciente *','patientId',optionPatients(),t?.patientId||params.patientId,'required')}${selectField('Odontólogo *','doctorId',optionDoctors(),t?.doctorId||'','required')}${field('Nombre del tratamiento *','title',t?.title||'','text','required maxlength="120"')}${field('Pieza dental (FDI o —)','tooth',t?.tooth||params.tooth||'—','text','maxlength="10"')}${field('Presupuesto (S/) *','price',t?.price??'','number','required min="0" step="0.01"')}${field('Avance (%) *','progress',t?.progress??0,'number','required min="0" max="100" step="1"')}${selectField('Estado','status',['Pendiente','En curso','Finalizado'].map(v=>[v,v]),t?.status||'Pendiente')}`,'Guardar tratamiento',`data-id="${t?.id||''}"`);return;
 }
 if(kind==='payment'){
 if(!can('payments'))return toast('Tu rol no permite gestionar pagos.',true);
 modal('Registrar cobro','Movimiento nuevo en la caja de esta clínica','payment',`${selectField('Paciente *','patientId',optionPatients(),params.patientId,'required')}${selectField('Tratamiento relacionado','treatmentId',[['','Sin tratamiento asociado'],...treatments().filter(t=>!params.patientId||t.patientId===params.patientId).map(t=>[t.id,`${t.title} — ${patientName(t.patientId)}`])])}${field('Monto recibido (S/) *','amount','','number','required min="0.01" step="0.01"')}${selectField('Medio de pago','method',['Efectivo','Yape','Plin','Transferencia','Tarjeta'].map(v=>[v,v]))}${field('Fecha','date',today(),'date','required')}${field('Concepto *','concept','','text','required maxlength="200"')}`,'Registrar pago');return;
 }
 if(kind==='worker'){
 if(!can('staff'))return toast('Solo administración puede añadir trabajadores.',true);
 modal('Nuevo trabajador','Cuenta de acceso para esta clínica (demo)','worker',`${field('Nombre completo *','name','','text','required maxlength="100"')}${selectField('Rol *','role',[['odontologo','Odontólogo'],['enfermera','Enfermera'],['recepcion','Recepción'],['administrador','Administrador']])}${field('Especialidad / área','specialty','','text','maxlength="100"')}${field('Correo demo *','email','','email','required maxlength="100"')}`,'Crear trabajador');return;
 }
}
function toast(message,error=false){const root=$('#toast-root');root.innerHTML=`<div class="toast ${error?'error':''}">${esc(message)}</div>`;setTimeout(()=>{const el=$('.toast',root);if(el)el.remove()},3700)}
function formError(message){const el=$('#form-error');if(el)el.textContent=message;else toast(message,true)}
function handleForm(form){
 const type=form.dataset.form;const v=Object.fromEntries(new FormData(form).entries());
 if(type==='save-tooth'){
  if(!can('odontogram'))return toast('Solo odontólogos pueden registrar evaluaciones y planes.',true);
  const p=patientById(form.dataset.patient),tooth=form.dataset.tooth;
  if(!p||!teethFor(state.dentition).includes(tooth))return formError('Paciente o diente no válido.');
  if(!Object.hasOwn(findings,v.condition))return formError('Selecciona un hallazgo clínico válido.');
  if(!v.note?.trim())return formError('Escribe la observación del doctor.');
  const surfaces=String(v.surfaces||'').split(',').filter(k=>Object.hasOwn(surfaceLabels,k));
  if(['caries','restauracion','fractura'].includes(v.condition)&&!surfaces.length)return formError('Indica al menos una superficie afectada (V, M, O, D o L).');
  const procedure=String(v.procedure||'').trim(),isPlan=procedure.length>0;
  const price=Number(v.price),stages=Number(v.stages);
  if(isPlan&&(!['Restauración con resina','Curación dental','Tratamiento de conductos','Extracción dental','Corona dental','Limpieza dental','Sellante dental','Rehabilitación dental','Otro procedimiento'].includes(procedure)||String(v.price||'').trim()===''||!Number.isFinite(price)||price<0||!Number.isInteger(stages)||stages<1||stages>6))return formError('Selecciona un tratamiento, indica su costo y las sesiones previstas.');
  if(!isPlan&&(v.price||v.date||v.time))return formError('Selecciona el tratamiento antes de indicar costo o agendar cita.');
  if((v.date&&!v.time)||(!v.date&&v.time))return formError('Para programar la cita, indica fecha y hora juntas.');
  if(v.date&&v.date<today())return formError('Selecciona una fecha actual o futura para la cita.');
  if(v.date&&!isPlan)return formError('Selecciona el tratamiento que se atenderá en esta cita.');
  if(isPlan&&procedure==='Extracción dental'&&dentalEvents(p.id,tooth).some(x=>x.condition==='ausente'))return formError('Esta pieza ya figura como ausente. Revisa el historial antes de planificar una extracción.');
  if(isPlan&&procedure==='Extracción dental'&&treatFor(p.id).some(t=>t.tooth===tooth&&t.steps?.some(x=>x.kind==='extraccion'&&!x.done)))return formError('Ya existe una extracción pendiente para esta pieza.');
  // Evitar dos citas simultáneas para el mismo profesional.
  if(v.date&&v.time){
   const start=Number(v.time.slice(0,2))*60+Number(v.time.slice(3,5));
   if(!Number.isFinite(start))return formError('Indica una hora válida.');
   const conflict=appointments().find(a=>a.doctorId===me().id&&a.date===v.date&&a.status!=='Cancelada'&&start<(Number(a.time.slice(0,2))*60+Number(a.time.slice(3,5))+Number(a.duration||45))&&(Number(a.time.slice(0,2))*60+Number(a.time.slice(3,5)))<start+45);
   if(conflict)return formError(`El doctor tiene una cita a las ${conflict.time}. Elige otra hora.`);
  }
  const note=v.note.trim(),now=new Date().toISOString(),tId=isPlan?id('t'):null;
  const entry={id:id('dh'),clinicId:session.clinicId,patientId:p.id,tooth,condition:v.condition,surfaces,note,date:today(),recordedAt:now,doctorId:me().id,dentition:state.dentition,...(tId?{treatmentId:tId}:{})};
  db.dentalHistory.push(entry);
  db.dental[p.id]||={};db.dental[p.id][tooth]={condition:v.condition,note,updatedAt:today()};
  if(isPlan){
   const steps=Array.from({length:stages},(_,i)=>({id:id('step'),title:stages===1?procedure:`Sesión ${i+1} de ${stages} · ${procedure}`,kind:procedure==='Extracción dental'&&i===stages-1?'extraccion':'sesion',tooth,done:false,completedAt:null}));
   db.treatments.push({id:tId,clinicId:session.clinicId,patientId:p.id,doctorId:me().id,title:procedure,tooth,price,progress:0,status:'Pendiente',steps,createdAt:now});
   if(v.date){db.appointments.push({id:id('a'),clinicId:session.clinicId,patientId:p.id,doctorId:me().id,treatmentId:tId,date:v.date,time:v.time,duration:45,type:procedure+' · Pieza '+tooth,status:'Pendiente'});}
  }
  state.selectedSurfaces=[];save();preserveRender();
  toast(isPlan?`Evaluación y tratamiento guardados en la pieza ${tooth}, con avance inicial 0 %.${v.date?' Cita programada.':''}`:`Evaluación de pieza ${tooth} guardada en el historial.`);return;
 }
 if(type==='patient'){
  if(!can('patient'))return formError('No autorizado');
  const doctor=doctors().find(d=>d.id===v.doctorId);if(!doctor)return formError('Selecciona un odontólogo válido.');
  if(!v.name.trim()||(!form.dataset.id&&!v.dni.trim()))return formError('Nombre y documento son obligatorios al crear fichas desde la clínica.');
  if(v.dni.trim()&&db.patients.some(p=>p.clinicId===session.clinicId&&p.dni.trim()===v.dni.trim()&&p.id!==form.dataset.id))return formError('Ya existe un paciente con ese documento en esta clínica.');
  const existing=db.patients.find(p=>p.id===form.dataset.id&&p.clinicId===session.clinicId);
  const data={name:v.name.trim(),dni:v.dni.trim(),phone:v.phone.trim(),email:v.email.trim(),dob:v.dob,doctorId:v.doctorId,allergies:v.allergies.trim(),notes:v.notes.trim()};
  if(existing)Object.assign(existing,data);else db.patients.push({id:id('p'),clinicId:session.clinicId,createdAt:today(),...data});
  save();closeModal();render();toast(existing?'Paciente actualizado.':'Paciente registrado.');return;
 }
 if(type==='appointment'){
  if(!can('appointment'))return formError('No autorizado');
  const p=patientById(v.patientId),doctor=doctors().find(d=>d.id===v.doctorId);if(!p||!doctor)return formError('Paciente u odontólogo no válido.');
  if(!v.date||!v.time||!v.type.trim())return formError('Completa fecha, hora y motivo.');
  const dur=Number(v.duration);if(!Number.isInteger(dur)||dur<15||dur>240)return formError('La duración debe estar entre 15 y 240 minutos.');
  const start=Number(v.time.split(':')[0])*60+Number(v.time.split(':')[1]);
  const conflicting=appointments().find(a=>a.id!==form.dataset.id&&a.doctorId===v.doctorId&&a.date===v.date&&a.status!=='Cancelada'&&v.status!=='Cancelada'&&start<Number(a.time.split(':')[0])*60+Number(a.time.split(':')[1])+Number(a.duration)&&Number(a.time.split(':')[0])*60+Number(a.time.split(':')[1])<start+dur);
  if(conflicting)return formError(`Horario ocupado: ${patientName(conflicting.patientId)} a las ${conflicting.time}.`);
  const existing=db.appointments.find(a=>a.id===form.dataset.id&&a.clinicId===session.clinicId);
  const data={patientId:p.id,doctorId:doctor.id,date:v.date,time:v.time,duration:dur,type:v.type.trim(),status:v.status};
  if(existing)Object.assign(existing,data);else db.appointments.push({id:id('a'),clinicId:session.clinicId,...data});
  state.appointmentDate=v.date;save();closeModal();render();toast(existing?'Cita actualizada.':'Cita agendada.');return;
 }
 if(type==='record'){
  if(!can('clinical'))return formError('No autorizado');const p=patientById(form.dataset.patient);if(!p||!v.notes.trim())return formError('Añade una nota válida.');
  db.records.push({id:id('r'),patientId:p.id,doctorId:me().id,date:v.date||today(),type:v.type,notes:v.notes.trim()});save();closeModal();render();toast('Nota clínica registrada.');return;
 }
 if(type==='treatment'){
  if(!can('treatment'))return formError('No autorizado');
  const p=patientById(v.patientId),doctor=doctors().find(d=>d.id===v.doctorId);if(!p||!doctor)return formError('Selecciona paciente y odontólogo.');
  const price=Number(v.price),progress=Number(v.progress);
  if(!v.title.trim()||!Number.isFinite(price)||price<0||!Number.isInteger(progress)||progress<0||progress>100)return formError('Verifica tratamiento, presupuesto y avance.');
  if((v.status==='Pendiente'&&progress!==0)||(v.status==='Finalizado'&&progress!==100)||(v.status==='En curso'&&(progress<=0||progress>=100)))return formError('El avance y el estado deben coincidir: pendiente 0%, en curso 1–99%, finalizado 100%.');
  const old=db.treatments.find(t=>t.id===form.dataset.id&&t.clinicId===session.clinicId);
  const data={patientId:p.id,doctorId:doctor.id,title:v.title.trim(),tooth:v.tooth.trim()||'—',price,progress,status:v.status};
  if(old&&old.patientId!==p.id&&numPaid(old.id)>0)return formError('No puedes cambiar el paciente de un plan con pagos.');
  if(old&&price<numPaid(old.id))return formError('El presupuesto no puede ser inferior al monto ya abonado.');
  if(old)Object.assign(old,data);else db.treatments.push({id:id('t'),clinicId:session.clinicId,...data});
  save();closeModal();render();toast(old?'Tratamiento actualizado.':'Tratamiento creado.');return;
 }
 if(type==='payment'){
  if(!can('payments'))return formError('No autorizado');const p=patientById(v.patientId),t=treatments().find(t=>t.id===v.treatmentId);const amount=Number(v.amount);
  if(!p)return formError('Selecciona un paciente.');
  if(!Number.isFinite(amount)||amount<=0||!v.concept.trim())return formError('Ingresa un importe positivo y un concepto.');
  if(v.treatmentId&&(!t||t.patientId!==p.id))return formError('El tratamiento debe pertenecer al paciente seleccionado.');
  if(t&&numPaid(t.id)+amount>Number(t.price)+.001)return formError(`El cobro supera el saldo del tratamiento (${money(Math.max(0,t.price-numPaid(t.id)))}).`);
  db.payments.push({id:id('pay'),clinicId:session.clinicId,patientId:p.id,treatmentId:t?.id||'',amount,date:v.date||today(),method:v.method,concept:v.concept.trim()});save();closeModal();render();toast('Pago registrado correctamente.');return;
 }
 if(type==='worker'){
  if(!can('staff'))return formError('No autorizado');
  if(!v.name.trim()||!v.email.trim())return formError('Nombre y correo son obligatorios.');
  if(db.staff.some(s=>s.email.toLowerCase()===v.email.toLowerCase()))return formError('Ya existe una cuenta con ese correo.');
  db.staff.push({id:id('s'),clinicId:session.clinicId,name:v.name.trim(),role:v.role,specialty:v.specialty.trim(),email:v.email.trim()});save();closeModal();render();toast('Trabajador creado.');return;
 }
}
function csvExport(){
 if(me().role!=='administrador')return toast('Solo administración puede exportar.',true);
 const rows=[['Nombre','DNI','Telefono','Correo','Odontologo'],...patients().map(p=>[p.name,p.dni,p.phone,p.email,staffName(p.doctorId)])];
 const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(';')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='endomolar-pacientes-DEMO.csv';a.click();URL.revokeObjectURL(url);toast('Archivo CSV generado.');
}
function navigate(page){state.page=page;state.patientId=null;state.workerId=null;state.tab='overview';state.selectedTooth='36';state.dentition='permanente';state.selectedSurfaces=[];state.patientQuery='';closeModal();render();window.scrollTo({top:0,behavior:'instant'})}
function handleAction(el){
 const action=el.dataset.action;
 switch(action){
  case 'nav':navigate(el.dataset.page);return;
  case 'logout':session=null;sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(UNIFIED_KEY);window.name='';window.DentalFlowDemo.logout();return;
  case 'mobile-open':$('#sidebar')?.classList.add('open');$('#mobile-overlay')?.classList.add('show');return;
  case 'mobile-close':$('#sidebar')?.classList.remove('open');$('#mobile-overlay')?.classList.remove('show');return;
  case 'quote-new':state.quoteDraft=newQuoteDraft();state.quoteTooth='36';state.quoteDentition='permanente';state.quoteNewItem={finding:'caries',procedure:'Restauración con resina',price:'',note:''};render();return;
  case 'quote-back':state.quoteDraft=null;render();return;
  case 'quote-open':{const q=quotes().find(x=>x.id===el.dataset.id);if(!q)return toast('Presupuesto no encontrado.',true);state.quoteDraft=newQuoteDraft(q);state.quoteTooth='36';state.quoteDentition='permanente';state.quoteNewItem={finding:'caries',procedure:'Restauración con resina',price:'',note:''};render();return}
  case 'quote-dentition':state.quoteDentition=el.dataset.dentition;state.quoteTooth=state.quoteDentition==='temporal'?'85':'36';preserveRender();return;
  case 'quote-tooth':state.quoteTooth=el.dataset.tooth;preserveRender();return;
  case 'quote-add-item':{
   const d=state.quoteDraft,n=state.quoteNewItem;if(!d||d.status==='Aceptado')return;
   const amount=Number(n.price);
   if(!Number.isFinite(amount)||amount<0||String(n.price).trim()==='')return toast('Ingresa el costo del procedimiento (S/).',true);
   if(!quoteProcedures.includes(n.procedure)||!Object.hasOwn(findings,n.finding))return toast('Selecciona el hallazgo y el procedimiento.',true);
   d.items.push({id:id('qi'),tooth:state.quoteTooth,dentition:state.quoteDentition,finding:n.finding,procedure:n.procedure,price:Math.round(amount*100)/100,note:n.note.trim()});
   state.quoteNewItem={finding:'caries',procedure:'Restauración con resina',price:'',note:''};preserveRender();toast('Procedimiento añadido al presupuesto.');return;
  }
  case 'quote-remove-item':if(state.quoteDraft?.status!=='Aceptado'){state.quoteDraft.items=state.quoteDraft.items.filter(x=>x.id!==el.dataset.id);preserveRender()}return;
  case 'quote-save':quoteSave(false);return;
  case 'quote-approve':quoteSave(true);return;
  case 'quote-print':{const q=el.dataset.id?quotes().find(x=>x.id===el.dataset.id):state.quoteDraft;if(!q)return toast('No se encontró el presupuesto.',true);quotePreview(q);return}
  case 'quote-go-patient':if(el.dataset.id){state.quoteDraft=null;state.page='patients';state.patientId=el.dataset.id;state.tab='treatments';render()}return;
  case 'new-patient':openForm('patient');return;
  case 'edit-patient':openForm('patient',{id:el.dataset.id});return;
  case 'open-patient':state.page='patients';state.patientId=el.dataset.id;state.tab='overview';state.selectedTooth='36';state.dentition='permanente';state.selectedSurfaces=[];render();window.scrollTo(0,0);return;
  case 'back-patients':state.patientId=null;state.page='patients';render();return;
  case 'profile-tab':state.tab=el.dataset.tab;render();return;
  case 'new-appointment':openForm('appointment',{patientId:el.dataset.patient||state.patientId});return;
  case 'edit-appointment':openForm('appointment',{id:el.dataset.id});return;
  case 'new-record':openForm('record',{patientId:el.dataset.id});return;
  case 'new-treatment':openForm('treatment',{patientId:el.dataset.patient||state.patientId});return;
  case 'edit-treatment':openForm('treatment',{id:el.dataset.id});return;
  case 'new-payment':openForm('payment',{patientId:el.dataset.patient||state.patientId});return;
  case 'new-worker':openForm('worker');return;
  case 'choose-finding':state.selectedFinding=el.dataset.condition;document.querySelectorAll('.finding-tool').forEach(b=>b.classList.toggle('active',b.dataset.condition===state.selectedFinding));const findingSelect=document.querySelector('#odonto-app select[name=condition]');if(findingSelect)findingSelect.value=state.selectedFinding;return;
  case 'select-tooth':state.selectedTooth=el.dataset.tooth;state.selectedSurfaces=[];preserveRender();return;
  case 'jump-tooth':state.selectedTooth=el.dataset.tooth;state.dentition=(upperBaby.concat(lowerBaby).includes(el.dataset.tooth))?'temporal':'permanente';state.selectedSurfaces=[];preserveRender();return;
  case 'dentition':state.dentition=el.dataset.dentition;state.selectedTooth=state.dentition==='temporal'?'85':'36';state.selectedSurfaces=[];preserveRender();return;
  case 'toggle-surface':{
   const k=el.dataset.surface;if(!Object.hasOwn(surfaceLabels,k))return;
   state.selectedSurfaces=state.selectedSurfaces.includes(k)?state.selectedSurfaces.filter(v=>v!==k):[...state.selectedSurfaces,k];
   const group=el.closest('.surface-picker');
   group?.querySelectorAll('[data-action=toggle-surface]').forEach(button=>{const on=state.selectedSurfaces.includes(button.dataset.surface);button.classList.toggle('on',on);button.setAttribute('aria-pressed',on?'true':'false')});
   const hidden=el.closest('form')?.querySelector('[name=surfaces]');if(hidden)hidden.value=state.selectedSurfaces.join(',');
   return;
  }
  case 'record-manual-progress':{
   if(!can('odontogram'))return toast('Solo el odontólogo puede registrar avances.',true);
   const p=patientById(el.dataset.patient),t=treatFor(el.dataset.patient).find(x=>x.id===el.dataset.treatment);
   if(!p||!t||t.steps?.length)return toast('Selecciona un plan antiguo válido.',true);
   const old=planProgress(t);
   const raw=prompt(`¿Qué porcentaje se completó realmente de «${t.title}»? Actual: ${old} %.\nEscribe un número de ${old+1} a 100.`,String(Math.min(100,old+25)));
   if(raw===null)return;
   const progress=Number(raw);
   if(!Number.isInteger(progress)||progress<=old||progress>100)return toast('El nuevo avance debe ser un porcentaje entero mayor al anterior y hasta 100.',true);
   if(!confirm(`¿Confirmas que se realizó atención y que el avance de ${t.title} pasó de ${old}% a ${progress}%?`))return;
   t.progress=progress;t.status=progress===100?'Finalizado':'En curso';
   db.records.push({id:id('r'),patientId:p.id,doctorId:me().id,date:today(),type:'Evolución',notes:`Avance confirmado en pieza ${t.tooth}: ${t.title}, de ${old}% a ${progress}%.`});
   save();preserveRender();toast('Avance actualizado tras la atención.');return;
  }
  case 'schedule-extraction':{
   if(!can('odontogram'))return toast('Solo el odontólogo puede registrar procedimientos.',true);
   const pid=el.dataset.patient,tooth=el.dataset.tooth,p=patientById(pid);
   if(!p||!teethFor(state.dentition).includes(tooth))return toast('Pieza no válida.',true);
   if(dentalEvents(pid,tooth).some(x=>x.condition==='ausente'))return toast('La pieza ya figura como ausente; revisa el historial.',true);
   if(treatFor(pid).some(t=>t.tooth===tooth&&t.steps?.some(x=>x.kind==='extraccion'&&!x.done)))return toast('Esta extracción ya está programada.',true);
   if(!confirm(`¿Programar una extracción de la pieza ${tooth} para ${p.name}? Este paso NO marca la pieza como extraída.`))return;
   db.treatments.push({id:id('t'),clinicId:session.clinicId,patientId:pid,doctorId:me().id,title:'Extracción de pieza '+tooth,tooth,price:0,progress:0,status:'Pendiente',steps:[{id:id('step'),title:'Extracción de pieza '+tooth,kind:'extraccion',tooth,done:false,completedAt:null}]});
   save();preserveRender();toast('Extracción programada. El diente aún está presente.');return;
  }
  case 'complete-extraction':
  case 'complete-plan-step':{
   if(!can('odontogram'))return toast('Solo el odontólogo puede confirmar procedimientos.',true);
   const t=treatFor(el.dataset.patient).find(x=>x.id===el.dataset.treatment);
   const step=t?.steps?.find(x=>x.id===el.dataset.step);const p=patientById(el.dataset.patient);
   if(!t||!step||!p||step.done)return toast('Esta etapa ya está completada o no existe.',true);
   const i=t.steps.indexOf(step);if(t.steps.slice(0,i).some(x=>!x.done))return toast('Completa las etapas anteriores primero.',true);
   const tooth=String(step.tooth||t.tooth||'');
   const isExtraction=step.kind==='extraccion';
   if(isExtraction&&dentalEvents(p.id,tooth).some(x=>x.condition==='ausente'))return toast('Esta pieza ya figura como ausente.',true);
   if(!confirm(`¿Confirmas que se realizó «${step.title}» a ${p.name}? Esta acción modificará su expediente de demostración.`))return;
   const now=new Date().toISOString();step.done=true;step.completedAt=today();step.doctorId=me().id;
   t.progress=planProgress(t);t.status=t.progress===100?'Finalizado':'En curso';
   const note=`${step.title} · atención realizada y confirmada por ${me().name}.`;
   db.records.push({id:id('r'),patientId:p.id,doctorId:me().id,date:today(),type:'Procedimiento',notes:note});
   if(isExtraction){
    db.dentalHistory.push({id:id('dh'),clinicId:session.clinicId,patientId:p.id,tooth,condition:'ausente',surfaces:[],note:'Extracción realizada · '+me().name,date:today(),recordedAt:now,doctorId:me().id,dentition:state.dentition,recordType:'extraccion-realizada',treatmentId:t.id,stepId:step.id});
    db.dental[p.id]||={};db.dental[p.id][tooth]={condition:'ausente',note,updatedAt:today()};
   }
   save();preserveRender();toast(isExtraction?`Extracción registrada en pieza ${tooth}. Plan actualizado al ${t.progress}%.`:`Etapa completada. Avance del plan: ${t.progress}%.`);return;
  }
  case 'plan-from-tooth':openForm('treatment',{patientId:el.dataset.patient,tooth:el.dataset.tooth});return;
  case 'print-dental':{
   const previousTitle=document.title;
   const patient=patientById(state.patientId);
   document.title=`Odontograma - ${patient?.name||'Paciente'} - Endomolar`;
   window.addEventListener('afterprint',()=>{document.title=previousTitle},{once:true});
   window.print();return;
  }
  case 'worker-filter':state.workerFilter=el.dataset.filter;render();return;
  case 'open-worker':state.workerId=el.dataset.id;render();return;
  case 'back-workers':state.workerId=null;render();return;
  case 'appointment-prev':state.appointmentDate=changeDate(state.appointmentDate,-1);render();return;
  case 'appointment-next':state.appointmentDate=changeDate(state.appointmentDate,1);render();return;
  case 'close-modal':closeModal();return;
  case 'go-appointments':navigate('appointments');return;
  case 'go-payments':navigate('payments');return;
  case 'go-patients':navigate('patients');return;
  case 'go-treatments':navigate('patients');return;
  case 'export-csv':csvExport();return;
 }
}
function preserveRender(){const y=window.scrollY;render();window.scrollTo({top:y,left:0,behavior:'instant'})}
function changeDate(str,offset){const d=new Date(str+'T12:00:00');d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(el){e.preventDefault();handleAction(el);return}
 if(e.target.id==='modal-overlay')closeModal();
});
document.addEventListener('submit',e=>{
 if(e.target.id==='login-form'){
  e.preventDefault();const f=e.target;const clinicId=f.elements.clinic.value,userId=f.elements.user.value,password=f.elements.password.value;
  if(password!=='demo123'){const el=$('#login-error');if(el)el.textContent='Clave de demostración incorrecta.';return}
  if(!db.staff.some(s=>s.clinicId===clinicId&&s.id===userId)){const el=$('#login-error');if(el)el.textContent='Cuenta inválida.';return}
  session={clinicId,userId};sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));state.page='home';render();return;
 }
 if(e.target.matches('[data-form]')){e.preventDefault();handleForm(e.target)}
});
document.addEventListener('change',e=>{
 if(state.page==='quotes'&&state.quoteDraft?.status!=='Aceptado'&&e.target.hasAttribute('data-quote-new')){state.quoteNewItem[e.target.dataset.quoteNew]=e.target.value;return}
 if(e.target.id==='login-clinic'){const cid=e.target.value;const select=$('#login-user');if(select)select.innerHTML=db.staff.filter(s=>s.clinicId===cid).map(s=>`<option value="${esc(s.id)}">${esc(s.name)} · ${esc(roleName(s.role))}</option>`).join('');return}
 if(e.target.name==='condition'&&e.target.closest('#odonto-app')){state.selectedFinding=e.target.value;document.querySelectorAll('.finding-tool').forEach(b=>b.classList.toggle('active',b.dataset.condition===state.selectedFinding));return}
 if(e.target.id==='appointment-date'){state.appointmentDate=e.target.value||today();render();return}
 if(e.target.id==='dental-patient-select'){state.dentalPatientId=e.target.value;state.selectedTooth='36';render();return}
 if(e.target.name==='patientId'&&e.target.closest('[data-form="payment"]')){
  const pid=e.target.value;const select=e.target.form.elements.treatmentId;
  select.innerHTML=`<option value="">Sin tratamiento asociado</option>`+treatments().filter(t=>t.patientId===pid).map(t=>`<option value="${t.id}">${esc(t.title)} · Saldo: ${esc(money(t.price-numPaid(t.id)))}</option>`).join('');return;
 }
});
document.addEventListener('keydown',e=>{if(e.target.id==='global-search'&&e.key==='Enter'){e.preventDefault();state.page='patients';state.patientId=null;state.patientQuery=e.target.value.trim();render();const input=document.querySelector('#patient-search');if(input){input.value=state.patientQuery;input.dispatchEvent(new Event('input',{bubbles:true}))}}});
document.addEventListener('input',e=>{
 if(state.page==='quotes'&&state.quoteDraft?.status!=='Aceptado'){
  if(e.target.hasAttribute('data-quote-field')){state.quoteDraft[e.target.dataset.quoteField]=e.target.value;return}
  if(e.target.hasAttribute('data-quote-new')){state.quoteNewItem[e.target.dataset.quoteNew]=e.target.value;return}
 }
 if(e.target.matches('[data-patient-filter]')){
  state.patientQuery=e.target.value;
  const term=e.target.value.toLocaleLowerCase('es-PE').trim();
  all('[data-patient-row]').forEach(row=>row.hidden=!row.dataset.search.includes(term));
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
render();

window.addEventListener('storage',event=>{
 if(event.key===ACCOUNTS_KEY&&syncRegisteredPatients()){save();if(me())render()}
});
})();
