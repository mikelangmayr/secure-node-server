import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'

const db = new sqlite3.Database(':memory:');
const saltRounds = 10;

export function createInMemoryDB() {
  // Create users table and users with salted password hashes
  db.serialize(function () {
    const createUsersTable = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)";
    db.run(createUsersTable);
    
    bcrypt.hash('password', saltRounds, function (err, hash) {
      const insertUsers = `INSERT INTO users (username, password) VALUES ('clarissa', '${hash}');`
      db.run(insertUsers);
    });
    bcrypt.hash('password', saltRounds, function (err, hash) {
      const insertUsers = `INSERT INTO users (username, password) VALUES ('gipson', '${hash}');`
      db.run(insertUsers);
    });
    bcrypt.hash('password', saltRounds, function (err, hash) {
      const insertUsers = `INSERT INTO users (username, password) VALUES ('mike', '${hash}');`
      db.run(insertUsers);
    });

    // Create user ISP stats
    const createStatsTable = "CREATE TABLE IF NOT EXISTS isp_stats (id INTEGER, billingAmount INTEGER, usageMB INTEGER, FOREIGN KEY(id) REFERENCES users(id))";
    db.run(createStatsTable);
    let insertUserStats = `INSERT INTO isp_stats (id, billingAmount, usageMB) VALUES (1, 10, 1000), (2, 200, 5000), (3, 2500, 10000);`
    db.run(insertUserStats);
  });
}

export async function getUserByUsername(username) {
  return get("SELECT * FROM users WHERE username = ?", [username]);
}

export async function getUserById(id) {
  return get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function getStatsById(id) {
  return get('SELECT * FROM isp_stats WHERE id = ?', [id]);
}

export async function makePayment(id, paymentAmount) {
  const stats = await getStatsById(id)

  // check if amount is too high
  if (Number(paymentAmount) > Number(stats.billingAmount)) {
    return { error: 'Amount too high' }
  // check if amount is negative
  } else if (Number(paymentAmount) < 0) {
    return { error: 'Amount negative' }
  } else {
    const newAmount = Number(stats.billingAmount) - Number(paymentAmount)
    db.run('UPDATE isp_stats SET billingAmount = ? WHERE id = ?', [newAmount, id])
    return newAmount
  }
}

function get(stmt, params) {
  return new Promise((res, rej) => {
      db.get(stmt, params, (error, result) => {
          if (error) {
              return rej(error.message);
          }
          return res(result);
      });
  })
}