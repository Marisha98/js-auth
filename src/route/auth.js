// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@email.com',
  password: 123,
  role: 1,
})

User.create({
  email: 'admin@email.com',
  password: 123,
  role: 2,
})

User.create({
  email: 'developer@email.com',
  password: 123,
  role: 3,
})
// ================================================================

router.get('/signup', function (req, res) {
  res.render('signup', {
    name: 'signup',
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    title: 'Signup page',

    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'User' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Admin',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Developer',
        },
      ],
    },
  })
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Error. Required fields are missing',
    })
  }

  if (email.length > 30) {
    return res.status(400).json({
      message: 'Error. Your email exceeds 30 characters',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message:
        'Error. Enter the correct value of the email address',
    })
  }

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Error. The password is not correct',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Error. This user already exists',
      })
    }

    const newUser = User.create({ email, password, role })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'The user has been successfully registered',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating a user',
    })
  }
})

// ================================================================

router.get('/recovery', function (req, res) {
  res.render('recovery', {
    name: 'recovery',

    component: ['back-button', 'field'],

    title: 'Recovery page',

    data: {},
  })
})

router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Error. Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'The user with this email does not exist',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'The password recovery code has been sent',
      email: email,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.get('/recovery-confirm', function (req, res) {
  const { renew, email } = req.query
  let confirm = ''

  if (renew) {
    confirm = Confirm.create(email)
  }

  res.render('recovery-confirm', {
    name: 'recovery-confirm',

    component: ['back-button', 'field', 'field-password'],

    title: 'Recovery confirm page',

    data: {
      confirm: confirm,
    },
  })
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  if (!code || !password) {
    return res.status(400).json({
      message: 'Error. Required fields are missing',
    })
  }

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Error. The password is not correct',
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'User with this email does not exist',
      })
    }

    user.password = password

    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password has changed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query
  let confirm = ''

  if (renew) {
    confirm = Confirm.create(email)
  }

  res.render('signup-confirm', {
    name: 'signup-confirm',

    component: ['back-button', 'field'],

    title: 'Signup confirm page',

    data: {
      confirm: confirm,
    },
  })
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Error. Required fields are missing',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message:
          'Error. You are not logged in to your account',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'You have confirmed your email',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.get('/login', function (req, res) {
  res.render('login', {
    name: 'login',

    component: ['back-button', 'field', 'field-password'],

    title: 'Login page',

    data: {},
  })
})

router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Error. User with this email does not exist',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'You are logged in',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
