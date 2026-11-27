// Conexão com o Firebase (Firestore). Carregado só quando js/firebase-config.js estiver preenchido.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export function connect(config) {
  const app = initializeApp(config);
  const db = getFirestore(app);
  return {
    async list(col, n = 40) {
      const snap = await getDocs(query(collection(db, col), orderBy('criadoEm', 'desc'), limit(n)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    async add(col, data) {
      const ref = await addDoc(collection(db, col), { ...data, criadoEm: serverTimestamp() });
      return ref.id;
    },
    async inc(col, id, field) {
      await updateDoc(doc(db, col, id), { [field]: increment(1) });
    }
  };
}
