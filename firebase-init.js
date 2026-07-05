import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB3NnzXWfDkDnLYFXY8J-dDT0aPoL8E2c0",
  authDomain: "air-dashboard-217fc.firebaseapp.com",
  projectId: "air-dashboard-217fc",
  storageBucket: "air-dashboard-217fc.firebasestorage.app",
  messagingSenderId: "463485097438",
  appId: "1:463485097438:web:82544e30c4117b6f47394f"
};

const _app = initializeApp(firebaseConfig);
const _db  = getFirestore(_app);

// Firestore collection names
const FS = {
  'hr_u':  'hr_users',
  'hr_a':  'hr_att',
  'hr_l':  'hr_leaves',
  'hr_h':  'hr_holidays',
  'hr_s':  'hr_sal',
  'hr_n':  'hr_notif',
  'hr_v':  'hr_vouchers',
  'hr_pi': 'hr_purchase_invoices'
};

// In-memory cache — app reads here (sync), writes go to both cache + Firestore
window._MC = {};

window._fsLoad = async function(){
  for(var k in FS){
    try{
      var snap = await getDoc(doc(_db, 'attendance_portal', FS[k]));
      if(snap.exists() && snap.data().value !== undefined){
        window._MC[k] = snap.data().value;
      }
    }catch(e){ console.warn('Firestore load fail:',k,e); }
  }
};

window._fsSave = function(k, v){
  window._MC[k] = v;
  if(!FS[k]) return;
  setDoc(doc(_db, 'attendance_portal', FS[k]), {value: v}).catch(function(e){
    console.warn('Firestore save fail:',k,e);
  });
};
