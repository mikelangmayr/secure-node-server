import bcrypt from 'bcrypt'
import njwt from 'njwt'
import { getUserById, getUserByUsername } from "./databaseService.mjs"

const APP_SECRET = 'secret'

const returnInvalidCredentials = (res) => {
  res.status(401)
  return res.send('Invalid username or password')
}


export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username)

  // check if user exists in db
  if (!user) {
    return returnInvalidCredentials(res)
  }

  // compare passwords and set jwt token
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const accessToken = encodeToken({ userId: user.id })
      const expDate = new Date()
      res.cookie('Access-Token', accessToken, { sameSite: true, maxAge: expDate })
      return res.redirect('/dashboard')
    } else {
      return returnInvalidCredentials(res);
    }
  });
}

export const authenticated = async (req, res, next) => {
  // Get jwt token from cookie
  const token = req.cookies['Access-Token']

  try {
    if (!token) {
      return res.render('login', { csrfToken: req.csrfToken() })
    }

    // Decode token and resolve user
    const decoded = decodeToken(token);
    const { userId } = decoded;
    const user = await getUserById(userId)

    if (user) {
      req.userId = user.id
      req.username = user.username
      return next()
    } else {
      res.render('login', { csrfToken: req.csrfToken() })
    }
  } catch (e) {
    return res.render('login', { csrfToken: req.csrfToken() })
  }
}

export const getLogout = (req,res) => {
  res.clearCookie("Access-Token")
  res.redirect("/")
  console.log(`User logged out`)
}

const decodeToken = (token) => {
  const inOneWeek = new Date().getTime() + 604800000
  return njwt.verify(token, APP_SECRET).setExpiration(inOneWeek).body;
}

const encodeToken = (tokenData) => {
  return njwt.create(tokenData, APP_SECRET).compact();
}

