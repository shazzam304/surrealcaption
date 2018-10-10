const {json, send} = require('micro')
const {router, get, post} = require('microrouter')
const axios = require('axios')

const callHook = async body => 
  await axios.post(body.callbackurl, {value1: body.title, value2: body.imgurl, value3: body.tags})


module.exports = router(
  get('/', async (req, res) => `hello there, whatsup`),

  post('/removebrackets', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/\[.*\]/i,"")
    let response = await callHook(body)
    send(res, 200, body)
  }),

  post('/removereblog', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/^[a-zA-Z0-9]*: /i,"")
    let response = await callHook(body)
    send(res, 200, body)
  }),

  post('/removebracketsandreblog', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/^[a-zA-Z0-9]*: /i,"")
    body.title = body.title && body.title.replace(/\[.*\]/i,"")
    let response = await callHook(body)
    send(res, 200, body)
  }),

)
