// eslint-disable-next-line no-unused-vars
import setGlobals from './globals'
import _ from 'lodash'
import tmi from 'tmi.js'
import config from './config'

const { tmiOpts } = config
const loop = require('./scripts/loop').default

const start = async () => {
  global.chatbot = new tmi.client(tmiOpts)
  await chatbot.connect()
  await sleep(1000)

  chatbot.on('join', (channel, username, self) => {
    if (self) {
      data.serverJoin += 1
      data.serverCurr += 1
      const currTimestamp = timestamp()
      const channelFormated = channelName(channel)

      _.set(data, `channels.${channelFormated}.status`, true)
      _.set(data, `channels.${channelFormated}.onJoin`, currTimestamp)
      _.set(data, `channels.${channelFormated}.reVerify`, currTimestamp + config.reVerifyViewerEvery)
      _.set(data, `channels.${channelFormated}.forceLeave`, currTimestamp + config.forceLeaveAfter)
      _.set(data, `channels.${channelFormated}.locked`,
        currTimestamp + config.forceLeaveAfter + config.lockJoinAfterLeave)
    }
  })

  chatbot.on('part', (channel, username, self) => {
    if (self) {
      data.serverPart += 1
      data.serverCurr -= 1
      const currTimestamp = timestamp()
      const channelFormated = channelName(channel)

      _.set(data, `channels.${channelFormated}`, false)
      _.set(data, `channels.${channelFormated}.onPart`, currTimestamp)
      _.set(data, `channels.${channelFormated}.locked`, currTimestamp + config.lockJoinAfterLeave)

    }
  })

  loop.start()
}

start()
