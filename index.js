const {json} = require('micro')

module.exports = async (req, res) => {
  const par = await json(req)
  return "params "+par
}
