/* eslint-disable max-len */
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
  channelLock: {},
  forceLeave: {},
  nextForceLeaveCheck: 0,
  totalJoin: 0,
  totalPart: 0,
  totalCurr: 0,
  totalLeaveForce: 0,
  totalLeaveOffline: 0,
  totalLeaveViewers: 0,
}
global.formatChannel = channel => channel.replace('#', '').toLowerCase()
global._ = _
global.superagent = superagent
global.dump = object => process.stdout.write(prettyjson.render(object))

global.displayStats = () => {
  const currTimestamp = timestamp()

  let totalChannelLock = 0
  _.forEach(data.channelLock, (lockUntil) => {
    if (lockUntil > currTimestamp) {
      totalChannelLock += 1
    }
  })
  let totalForceLeave = 0
  _.forEach(data.forceLeave, () => {
    totalForceLeave += 1
  })
  let totalLockGame = 0
  _.forEach(data.lockGame, (lockUntil) => {
    if (lockUntil > currTimestamp) {
      totalLockGame += 1
    }
  })
  console.debug(`${data.totalCurr} active \t\t ${data.totalJoin} Joineedd \t\t ${data.totalPart} Leaved`)
  console.debug(`${totalForceLeave} leave plan \t\t ${totalChannelLock} locked \t\t ${totalLockGame} game lock`)
  console.debug(`${data.totalLeaveForce} forceLeaved \t\t ${data.totalLeaveViewers} viewLeaved \t\t ${data.totalLeaveOffline} offLeaved`)
}

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
      data.totalJoin += 1
      data.totalCurr += 1
      const currTimestamp = timestamp()
      data.total += 1
      const channelFormated = formatChannel(channel)
      // console.debug(`Join Validate: ${channelFormated}, [${data.total} joined]`)
      data.joined[channelFormated] = currTimestamp + config.reVerifyViewerEvery
      data.forceLeave[channelFormated] = currTimestamp + config.forceLeaveAfter
    }
  })

  chatbot.on('part', (channel, username, self) => {
    if (self) {
      data.totalPart += 1
      data.totalCurr -= 1
      data.total -= 1
      const channelFormated = formatChannel(channel)
      // console.debug(`Part Validate: ${channelFormated}, [${data.total} joined]`)
      data.channelLock[channelFormated] = timestamp() + config.lockJoinAfterLeave
      delete data.joined[channelFormated]
      delete data.forceLeave[channelFormated]
    }
  })

  // teazyou.start()
  loop.start()
}

start()

