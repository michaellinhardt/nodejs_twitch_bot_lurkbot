/* eslint-disable max-len */
import _ from 'lodash'
import superagent from 'superagent'
import prettyjson from 'prettyjson'
import moment from 'moment'

global.loopStatus = false
global.sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })
global.config = require('./config')
global.timestamp = () => parseInt(moment().format('X'), 10)
global.channelName = channel => channel.replace('#', '').toLowerCase()
global.data = {
  serverJoin: 0,
  serverPart: 0,
  serverCurr: 0,
  localJoin: 0,
  localPart: 0,
  localCurr: 0,
  totalLeaveForce: 0,
  totalLeaveViewers: 0,
  totalLeaveOffline: 0,

  lastLiveOutput: '',
  lastGetStreamJoined: 0,

  actionOnceEvery: {},

  channles: {},
  actions: [],

  nextForceLeaveCheck: timestamp() + config.forceLeaveAfter,
  nextReVerifyCheck: timestamp() + config.reVerifyViewerEvery,
  nextApiCall: 0,
  nextTmiAction: 0,

  output: [],
}
global._ = _
global.superagent = superagent
global.dump = object => process.stdout.write(prettyjson.render(object))

global.liveOutput = msg => {
  data.lastLiveOutput = `${timestamp()}: ${msg}`
  displayStats()
}

global.output = msg => {
  data.output.push(`${timestamp()}: ${msg}`)
  displayStats()
}

const totalDisplayLog = 100
const flushOutput = () => {
  if (data.output.length < (totalDisplayLog * 2)) { return false }
  data.output = data.output.slice((totalDisplayLog + 1) * -1)
}

const displayOutput = () => {
  if (data.output.length < 1) { return false }

  flushOutput()

  const iOutputMax = data.output.length - 1
  let iOutput = data.output.length - totalDisplayLog - 1

  console.debug('\n\n ==================== [ LOGS ] ====================')
  while (iOutput <= iOutputMax) {
    const output = _.get(data, `output[${iOutput}]`, '')
    console.debug(output)
    iOutput += 1
  }
  console.debug(`\nLIVE: ${data.lastLiveOutput}\nTmi Action Every: ${config.tmiActionEvery}\n`)
}

global.displayStats = () => {
  displayOutput()

  const currTimestamp = timestamp()

  let totalChannelLock = 0
  let totalForceLeaveActive = 0
  _.forEach(data.channels, dataChannel => {
    const status = _.get(dataChannel, 'status', false)
    const lockUntil = _.get(dataChannel, 'locked', 0)
    const whenLeave = _.get(dataChannel, 'forceLeave', 0)

    if (status && whenLeave > currTimestamp) { totalForceLeaveActive += 1 }
    if (status && lockUntil > currTimestamp) { totalChannelLock += 1 }
  })

  const actions = { join: 0, part: 0 }
  _.forEach(data.actions, action => { actions[action.action] += 1 })

  const channelPerMin = data.serverCurr / ((currTimestamp - data.startTimestamp) / 60)
  const channelPerMinRound = Math.round((channelPerMin + Number.EPSILON) * 100) / 100

  console.debug(`WAITING \t\t ------ \t\t ${actions.join} join \t\t ${actions.part} part`)
  console.debug(`EXECUTED \t\t ${data.localCurr} active \t\t ${data.localJoin} join \t\t ${data.localPart} part`)
  console.debug(`VALIDATED: \t\t ${data.serverCurr} active \t\t ${data.serverJoin} join \t\t ${data.serverPart} part`)
  console.debug(`\t \t \t ${totalForceLeaveActive} leavePlan \t\t ${totalChannelLock} locked \t\t`)
  console.debug(`${channelPerMinRound} join/min \t\t ${data.totalLeaveForce} forceLeaved \t\t ${data.totalLeaveViewers} viewLeaved \t\t ${data.totalLeaveOffline} offLeaved`)
}

exports.done = {}
