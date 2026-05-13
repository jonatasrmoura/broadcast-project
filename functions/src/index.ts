import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();

// Esta função roda a cada 1 minuto
export const processScheduledMessages = onSchedule(
  "every 1 minutes",
  async (event) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    // 1. Busca mensagens que estão 'scheduled' e que o horário já passou (ou é agora)
    const snapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledDate", "<=", now)
      .get();

    if (snapshot.empty) return;

    const batch = db.batch();

    // 2. Atualiza o status para 'sent'
    snapshot.forEach((doc) => {
      batch.update(doc.ref, {
        status: "sent",
        sentAt: now, // Opcional: guardar quando foi enviado de fato
      });
    });

    await batch.commit();
    console.log(`Processadas ${snapshot.size} mensagens.`);
  },
);
