class fieldCheckbox {
  static toggle = (target) => {
    target.toggleAttribute('active')
  }
}

window.fieldCheckbox = fieldCheckbox
