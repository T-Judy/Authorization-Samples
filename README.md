## To run

You need two terminals (backend and frontend), plus Node.js 18+.

### 1. Backend

```bash
cd server
npm install 
npm start
```

The API listens on **http://localhost:3000**. 

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app opens on **http://localhost:5173**.

## API reference

| Method | Path | Auth required |\
| POST | `/api/basic/login` | body `{username, password}` |\
| GET  | `/api/basic/dashboard` | `Authorization: Basic` |


| POST | `/api/bearer/login` | body `{username, password}` |\
| GET  | `/api/bearer/dashboard` | `Authorization: Bearer <token>` |\
| POST | `/api/bearer/logout` | `Authorization: Bearer <token>` |


| POST | `/api/jwt/login` | body `{username, password}` |\
| POST | `/api/jwt/refresh` | body `{refreshToken}` |\
| GET  | `/api/jwt/dashboard` | `Authorization: Bearer <jwt>` |\
| POST | `/api/jwt/logout` | none |

## Things this repository does that you should not do
- Passwords are stored in plain text in `server/src/data/users.js`. A real app must hash them (bcrypt/argon2) and never log or echo them back.
- Everything is in-memory and resets when the server restarts. You should use a database!
- The JWT secrets in `.env` are placeholders; generate strong random secrets and do not upload them to the repository.
