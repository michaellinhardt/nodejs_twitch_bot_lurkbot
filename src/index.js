import tmi from 'tmi.js'
import _ from 'lodash'
import superagent from 'superagent'
import prettyjson from 'prettyjson'
import moment from 'moment'
import config from './config'

const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })

global.config = require('./config')
global.timestamp = () => parseInt(moment().format('X'), 10)
global.data = {
  nextApiCall: 0,
  nextTmiAction: 0,
  joined: {},
  actions: [],
  pagination: {},
  actionOnceEvery: {},
  lockGame: {},
  total: 0,
}
global.formatChannel = channel => channel.replace('#', '').toLowerCase()
global._ = _
global.superagent = superagent
global.dump = object => process.stdout.write(prettyjson.render(object))

const { tmiOpts } = config

// eslint-disable-next-line no-unused-vars
const teazyou = require('./scripts/teazyou').default
// eslint-disable-next-line no-unused-vars
const loop = require('./scripts/loop').default

const start = async () => {
  global.chatbot = new tmi.client(tmiOpts)
  await chatbot.connect()
  await sleep(config.sleepBeforeReady)
  console.log('Ready To Lurk B)')

  chatbot.on('join', (channel, username, self) => {
    if (self) {
      data.total += 1
      const channelFormated = formatChannel(channel)
      console.debug(`Join Validate: ${channelFormated}, [${data.total} joined]`)
      data.joined[channelFormated] = timestamp() + config.reVerifyViewerEvery
    }
  })

  chatbot.on('part', (channel, username, self) => {
    if (self) {
      data.total -= 1
      const channelFormated = formatChannel(channel)
      console.debug(`Part Validate: ${channelFormated}, [${data.total} joined]`)
      data.joined[channelFormated] = undefined
    }
  })

  // teazyou.start()
  loop.start()
}

start()

