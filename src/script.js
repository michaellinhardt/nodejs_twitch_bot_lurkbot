// eslint-disable-next-line no-unused-vars
import setGlobals from './globals'
import tmi from 'tmi.js'
import config from './config'

const { tmiOpts } = config
const teazyou = require('./scripts/teazyou').default

const start = async () => {
  global.chatbot = new tmi.client(tmiOpts)
  await chatbot.connect()
  await sleep(100)

  teazyou.start()
}

start()
