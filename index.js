const {json, send} = require('micro')
const {router, get, post} = require('microrouter')
const axios = require('axios')

const callHook = async body => 
  await axios.post(body.callbackurl, {value1: body.title, value2: body.imgurl, value3: body.tags})

const checkimageurl = async body => {
  try {
    if(body.imgurl.indexOf("no_image_card") > 0)
      send(res, 200, "no image card found");
    else {
      let imgRes = await axios.head(body.imgurl)
      if(imgRes.status == 200) {
        console.log('calling hook')
        let hookRes = await callHook(body)
        return "hook call status "+hookRes.statusText
      }
    }
  }
  catch(e){
    console.log('error ',e.message)
  }
  return "invalid image url"
}


module.exports = router(
  get('/', async (req, res) => `hiiii`),

  post('/removebrackets', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/\[.*\]/i,"")
    let response = await callHook(body)
    send(res, 200, body)
  }),

  post('/removereblog', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/^.*:/i,"")
    let response = await callHook(body)
    send(res, 200, body)
  }),

  post('/removebracketsandreblog', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/^[a-zA-Z0-9]*:/i,"")
    body.title = body.title && body.title.replace(/\[.*\]/i,"")
    let response = await callHook(body)
    send(res, 200, body)
  }),

  post('/checkimageurl', async (req, res) => {
    let body = await json(req)
    let result = await checkimageurl(body)
    send(res, 200, result)
  }),
  
  post('/removebracketsandcheckimageurl', async (req, res) => {
    var body = await json(req)
    body.title = body.title && body.title.replace(/\[.*\]/i,"")
    if(body.url != undefined)
      body.title += ' <a href='+body.url+' >(source)</a>'
    let result = await checkimageurl(body)
    send(res, 200, result)
  }),

  post('/dump', async (req, res) => {
    send(res, 200, 'dump done')
  })

)
