# Hardened Node.js App - ISP Dashboard

## Features

- Authentication with JWT Tokens
- Password hashing with salt (bcrypt)
- SQLite (In-memory)
- CSRF protection (with `csurf`)
- Jade template engine
- Sessions stored in SQLite DB

## Installation

1. **Install dependencies:**
   ```sh
   yarn install
   # or
   npm install
   ```

2. **Start the server:**
   ```sh
   npm start
   ```

   The webserver will start at [http://localhost:3000](http://localhost:3000)

   **For HTTPS, please check the `https` branch!**

## Usage

- Visit `/login` to log in.
- Use the following credentials:
  - mike : password
  - clarissa : password
  - gipson : password
- After login, access:
  - `/dashboard` for the main user interface
  - `/usage` to view data usage
  - `/billing` to manage payments

## Security Notes

- **Session Secret**: Configure SESSION_SECRET as an environment variable in production.
- **Session Store**: The session store uses in-memory SQLite. For production, use a persistent database file.
- **CSRF**: Enabled via cookie-based tokens for all relevant routes.

## Project Structure

```
.
├── index.mjs
├── package.json
├── services/
│   ├── databaseService.mjs
│   ├── loginService.mjs
│   └── statsService.mjs
└── views/
    ├── billing.jade
    ├── dashboard.jade
    ├── login.jade
    └── usage.jade
```

## Authors

- Gipson Bachman
- Clarissa Bernardo
- Michael Langmayr
