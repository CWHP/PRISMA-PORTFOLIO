import session from "express-session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PrismaSessionStore extends session.Store {
  async get(sid, callback) {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sid },
      });
      if (session && new Date() < session.expires) {
        callback(null, JSON.parse(session.data));
      } else {
        callback();
      }
    } catch (err) {
      callback(err);
    }
  }

  async set(sid, sessionData, callback) {
    try {
      const expires = sessionData.cookie.expires
        ? new Date(sessionData.cookie.expires)
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 1 day if no expiration

      const data = JSON.stringify(sessionData);
      await prisma.session.upsert({
        where: { id: sid },
        create: { id: sid, expires, data },
        update: { expires, data },
      });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  async destroy(sid, callback) {
    try {
      await prisma.session.delete({
        where: { id: sid },
      });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}

export default PrismaSessionStore;
