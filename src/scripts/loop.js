import _ from 'lodash'
import config from '../config'

const { getStreams } = require('./getStreams').default
const { reVerify } = require('./reVerify').default
const { tmiAction } = require('./tmiAction').default
const { addAction } = require('./addAction').default

const loop = async () => {
  try {
    const currTimestamp = timestamp()

    // force leave
    if (data.nextForceLeaveCheck <= currTimestamp) {
      liveOutput('Start verifying force leave list')
      data.nextForceLeaveCheck = currTimestamp + config.checkForceLeaveEvery
      let totalForceLeave = 0
      _.forEach(data.channels, (dataChannel, channel) => {
        const status = _.get(dataChannel, 'status', false)
        const whenForceLeave = _.get(dataChannel, 'forceLeave', currTimestamp)
        if (status && whenForceLeave < currTimestamp) {
          addAction('part', channel)
          totalForceLeave += 1
          data.totalLeaveForce += 1
        }
      })
      output(`${totalForceLeave} Force leave channel`)
      return true
    }

    if (data.nextApiCall <= currTimestamp) {

      // Actions list empty
      if (data.actions.length < 4) {
        liveOutput('Loop called getStreams()')
        await getStreams()
        liveOutput('getStreams() is over')
        data.nextApiCall = currTimestamp + config.apiCallEvery
        return true
      }

      if (data.nextReVerifyCheck < currTimestamp) {
        data.nextReVerifyCheck = currTimestamp + config.checkReVerifyEvery
        // reverify
        liveOutput('Start verifying viewers on current channel')
        const reVerifyChannelList = []
        _.forEach(data.channels, ({ reVerify }, channel) => {
          reVerifyChannelList.push([channel, reVerify])
        })
        reVerifyChannelList.sort((a, b) => a[1] - b[1])
        const reVerifyChannel = []
        _.forEach(reVerifyChannelList, channel => {
          const status = _.get(data.channels, `${channel[0]}.status`, false)
          const reVerifyTimestamp = _.get(data.channels, `${channel[0]}.reVerify`, currTimestamp)

          if (status && reVerifyTimestamp < currTimestamp) {
            reVerifyChannel.push(channel[0])
            _.set(data, `channels.${channel[0]}.reVerify`, currTimestamp + config.reVerifyViewerEvery)
          }
          if (reVerifyChannel.length === 100) { return false }
        })

        liveOutput(`${reVerifyChannel.length} / ${config.reVerifyViewerMinimumChannel} channel need to be re-verified`)

        if (reVerifyChannel.length >= config.reVerifyViewerMinimumChannel) {
          await reVerify(reVerifyChannel)
          data.nextApiCall = currTimestamp + config.apiCallEvery
          return true
        }
      }
    }

    // exec tmi actions
    if (!_.isEmpty(data.actions)
    && data.nextTmiAction <= currTimestamp) {
      await tmiAction()
      data.nextTmiAction = currTimestamp + config.tmiActionEvery
      return true
    }

    // Nothing better to do
    if (data.nextApiCall <= currTimestamp) {

      data.nextReVerifyCheck = currTimestamp + config.checkReVerifyEvery
      // reverify
      liveOutput('Start verifying viewers on current channel')
      const reVerifyChannelList = []
      _.forEach(data.channels, ({ reVerify }, channel) => {
        reVerifyChannelList.push([channel, reVerify])
      })
      reVerifyChannelList.sort((a, b) => a[1] - b[1])
      const reVerifyChannel = []
      _.forEach(reVerifyChannelList, channel => {
        const status = _.get(data.channels, `${channel[0]}.status`, false)
        const reVerifyTimestamp = _.get(data.channels, `${channel[0]}.reVerify`, currTimestamp)

        if (status && reVerifyTimestamp < currTimestamp) {
          reVerifyChannel.push(channel[0])
          _.set(data, `channels.${channel[0]}.reVerify`, currTimestamp + config.reVerifyViewerEvery)
        }
        if (reVerifyChannel.length === 0) { return false }
      })

      liveOutput(`${reVerifyChannel.length} / ${config.reVerifyViewerMinimumChannel} channel need to be re-verified`)

      if (reVerifyChannel.length > 0) {
        await reVerify(reVerifyChannel)
        data.nextApiCall = currTimestamp + config.apiCallEvery
        return true
      }

    }

    liveOutput('Loop had nothing to do..')

  } catch (err) { output(err) }

}

const start = async () => {
  await loop()
  setTimeout(start, config.loopEvery)
}

export default {
  start,
}
