const { getStreams } = require('./getStreams').default
const { reVerify } = require('./reVerify').default
const { tmiAction } = require('./tmiAction').default

const loop = async () => {
  try {
    const currTimestamp = timestamp()

    // reverify
    const reVerifyChannel = []
    _.forEach(data.joined, (reVerifyTimestamp, channel) => {
      if (reVerifyTimestamp <= currTimestamp) {
        reVerifyChannel.push(channel)
        data.joined[channel] = currTimestamp + config.reVerifyViewerEvery
      }
      if (reVerifyChannel.length >= 99) { return false }
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
