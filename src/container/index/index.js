document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    const { user } = window.session

    if (user.isConfirm) {
      if (user.role === 1) {
        location.assign('/home-user')
      } else if (user.role === 2) {
        location.assign('/home-admin')
      } else if (user.role === 3) {
        location.assign('/home-developer')
      }
    } else {
      location.assign('/signup-confirm')
    }
  } else {
    location.assign('/signup')
  }
})
