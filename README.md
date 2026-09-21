## To run

You need two terminals (backend and frontend), plus Node.js 18+.

**Terminal 1 — backend**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 — frontend**
```bash
cd client
npm install
npm run dev
```

## API reference

| Method | Path | Auth required |\
| GET  | `/api/basic/dashboard` | `Authorization: Basic` |


| POST | `/api/bearer/login` | body `{username, password}` |\
| GET  | `/api/bearer/dashboard` | `Authorization: Bearer <token>` |\
| POST | `/api/bearer/logout` | `Authorization: Bearer <token>` |


| POST | `/api/jwt/login` | body `{username, password}` |\
| POST | `/api/jwt/refresh` | body `{refreshToken}` |\
| GET  | `/api/jwt/dashboard` | `Authorization: Bearer <jwt>` |\
| POST | `/api/jwt/logout` | none |
