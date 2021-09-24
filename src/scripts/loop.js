import _ from 'lodash'
import config, { tmiActionFast } from '../config'

const { getStreams } = require('./getStreams').default
const { reVerify } = require('./reVerify').default
const { tmiAction } = require('./tmiAction').default
const { addAction } = require('./addAction').default

const loop = async () => {
  if (!loopStatus) { return false }
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
      if (data.actions.length === 0) {
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
          }
          if (reVerifyChannel.length === 100) { return false }
        })

        liveOutput(`${reVerifyChannel.length} / ${config.reVerifyViewerOptimalChannel} channel need to be re-verified`)

        if (reVerifyChannel.length >= config.reVerifyViewerOptimalChannel) {
          await reVerify(reVerifyChannel)
          data.nextApiCall = currTimestamp + config.apiCallEvery
          return true
        }
      }
    }

    // exec tmi actions
    const tmiActionSlowUntil = _.get(data, 'tmiActionSlowUntil', 0)
    if (tmiActionSlowUntil <= currTimestamp) {
      config.tmiActionEvery = tmiActionFast
      _.set(data, 'tmiActionSlowUntil', currTimestamp + (60 * 60 * 24 * 10))
    }

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
      const reVerifyChannel2 = []
      _.forEach(reVerifyChannelList, channel => {
        const status = _.get(data.channels, `${channel[0]}.status`, false)
        const reVerifyTimestamp = _.get(data.channels, `${channel[0]}.reVerify`, currTimestamp)

        if (status && reVerifyTimestamp < currTimestamp) {
          reVerifyChannel2.push(channel[0])
        }
        if (reVerifyChannel2.length === 100) { return false }
      })

      liveOutput(`${reVerifyChannel2.length} / ${config.reVerifyViewerMinimumChannel} channel need to be re-verified`)

      if (reVerifyChannel2.length >= config.reVerifyViewerMinimumChannel) {
        await reVerify(reVerifyChannel2)
        data.nextApiCall = currTimestamp + config.apiCallEvery
        return true
      }

      // Actions list empty
      if (data.actions.length < 10) {
        liveOutput('Loop called getStreams()')
        await getStreams()
        liveOutput('getStreams() is over')
        data.nextApiCall = currTimestamp + config.apiCallEvery
        return true
      }

    }

    liveOutput('Loop had nothing to do..')

  } catch (err) {
    output(`ici - ${err}`)
  }

}

const start = async () => {
  await loop()
  setTimeout(start, config.loopEvery)
}

export default {
  start,
}
