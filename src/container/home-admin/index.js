document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    const { user } = window.session

    if (user.role !== 2) {
      location.assign('/')
    }
  } else {
    location.assign('/signin')
  }
})

class Home {
  static update() {
    location.assign(
      `/user-item?id=${window.session.user.id}`,
    )
  }

  static logout() {
    location.assign('/logout')
  }
}

window.home = Home
