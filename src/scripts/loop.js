import _ from 'lodash'
import config from '../config'

const { getStreams } = require('./getStreams').default
const { reVerify } = require('./reVerify').default
const { tmiAction } = require('./tmiAction').default

const loop = async () => {
  try {
    const currTimestamp = timestamp()

    // force leave
    if (data.nextForceLeaveCheck <= currTimestamp) {
      _.forEach(data.forceLeave, (whenForceLeave, channel) => {
        if (whenForceLeave <= currTimestamp && data.joined[channel]) {
          data.joined[channel] = currTimestamp + (config.reVerifyViewerEvery * 999)
          data.actions.unshift({
            type: 'tmi',
            action: 'part',
            channel,
          })
          delete data.forceLeave[channel]
        }
      })
      data.nextForceLeaveCheck = currTimestamp + config.checkForceLeaveEvery
    }

    // reverify
    const reVerifyChannel = []
    _.forEach(data.joined, (reVerifyTimestamp, channel) => {
      if (reVerifyTimestamp <= currTimestamp) {
        reVerifyChannel.push(channel)
        data.joined[channel] = currTimestamp + config.reVerifyViewerEvery
      }
      if (reVerifyChannel.length === 100) { return false }
    })

    if (reVerifyChannel.length >= config.reVerifyViewerMinimumChannel
      && data.nextApiCall <= currTimestamp) {
      await reVerify(reVerifyChannel)
      data.nextApiCall = currTimestamp + config.apiCallEvery
      return true
    }

    // Actions list empty
    if (_.isEmpty(data.actions)
    && data.nextApiCall <= currTimestamp) {
      await getStreams()
      data.nextApiCall = currTimestamp + config.apiCallEvery
      return true
    }

    // exec tmi actions
    if (!_.isEmpty(data.actions)
    && data.nextTmiAction <= currTimestamp) {
      await tmiAction()
      data.nextTmiAction = currTimestamp + config.tmiActionEvery
      return true
    }

  } catch (err) { console.debug(err) }

}

const start = async () => {
  await loop()
  setTimeout(start, config.loopEvery)
}

export default {
  start,
}
