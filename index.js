const {json, text} = require('micro')

module.exports = async (req, res) => {
  const par = await text(req)
  return "params "+par
}
