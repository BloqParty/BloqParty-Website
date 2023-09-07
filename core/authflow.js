const sessions = new Map();
const crypto = require(`crypto`);

module.exports = {
    _sessions: sessions,

    createSession: () => {
        const id = crypto.randomBytes(32).toString(`hex`);

        const session = {
            id,
            created: Date.now(),
            lastUsed: Date.now(),
            destroy: () => {
                if(session.timeout) clearTimeout(session.timeout);
                if(sessions.has(id)) sessions.delete(id);
            },
            createTimeout: (time = 300000) => { // default 5 mins
                if(session.timeout) clearTimeout(session.timeout);
                Object.assign(session, {
                    expiration: Date.now() + time,
                    timeout: setTimeout(() => session.destroy(), time),
                    get expiresIn() {
                        return this.expiration - Date.now()
                    }
                });
            }
        };

        sessions.set(id, session);

        session.createTimeout();
        
        return session;
    },

    getSession: (id) => {
        if(!sessions.has(id)) return null;

        const session = sessions.get(id);

        session.lastUsed = Date.now();

        session.createTimeout();

        return session;
    }
}