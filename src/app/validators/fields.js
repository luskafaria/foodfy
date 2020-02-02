
function isFilled(req, res, next) {
  const keys = Object.keys(req.body)


  for (key of keys) {
    if (req.body[key] == "" && req.body[key] != "is_admin") {
      return res.send('Por favor, volte e preencha todos os campos.')
    }
  }

  next()
}

module.exports = {
  isFilled
}