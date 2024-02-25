// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')

// ================================================================

router.get('/home-user', function (req, res) {
  res.render('home-user', {
    name: 'home-user',
    component: [],

    title: "User's page",

    data: {},
  })
})

// ================================================================
router.get('/home-admin', function (req, res) {
  res.render('home-admin', {
    name: 'home-admin',
    component: [],

    title: "Admin's page",

    data: {},
  })
})

// ================================================================
router.get('/home-developer', function (req, res) {
  res.render('home-developer', {
    name: 'home-developer',
    component: [],

    title: "Developers's page",

    data: {},
  })
})

// ================================================================

router.get('/user-list', function (req, res) {
  res.render('user-list', {
    name: 'user-list',

    component: ['back-button'],

    title: 'User-list page',

    data: {},
  })
})

router.get('/user-list-data', function (req, res) {
  const list = User.getList()

  if (list.length === 0) {
    return res.status(400).json({
      message: 'The list of users is empty',
    })
  }

  return res.status(200).json({
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

// ================================================================

router.get('/user-item', function (req, res) {
  return res.render('user-item', {
    name: 'user-item',

    component: ['back-button'],

    title: 'User item page',

    data: {},
  })
})

router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: 'There must be a user ID',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'The user with this ID does not exist',
    })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    },
  })
})

module.exports = router
