import _ from 'lodash'
import config from '../config'
const { addAction } = require('./addAction').default

const reVerify = async (reVerifyChannel) => {

  output(`Re Verify ${reVerifyChannel.length} streams`)
  const queryString = reVerifyChannel.join('&user_login=')
  const url = `https://api.twitch.tv/helix/streams?user_login=${queryString}`
  const viewerMinimumLeave = config.viewerMinimumLeave
  const viewerMaximumLeave = config.viewerMaximumLeave

  const total = {
    partViewers: 0,
    stayViewers: 0,
    partOffline: 0,
  }

  const res = await superagent
    .get(url)
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => {
      output(`lol ${err}, ${err.response}, ${err.message}`)
      _.forEach(data.channels, dataChannel => {
        _.get(dataChannel, 'reVerify', currTimestamp + (60 * 5))
      })
      return false
    })
  const currTimestamp = timestamp()

  const streams = _.get(res, 'body.data', [])

  _.forEach(reVerifyChannel, channel => {
    _.set(data.channels, `${channel}.reVerify`, currTimestamp + config.reVerifyViewerEvery)
  })

  if (streams.length === 0) {
    _.forEach(reVerifyChannel, channel => {
      addAction('part', channel)
      total.partOffline += 1
      data.totalLeaveOffline += 1
    })

    output(
      `${total.stayViewers} stay == ${total.partViewers} part viewers == ${total.partOffline} part offline`)

    return false
  }

  _.forEach(streams, stream => {
    const { type, user_login, viewer_count } = stream

    const channel = channelName(user_login)

    const isJoined = _.get(data, `channels.${channel}.status`, false)
    if (isJoined && (type !== 'live'
        || viewer_count < viewerMinimumLeave
        || viewer_count > viewerMaximumLeave)) {

      total.partViewers += 1
      data.totalLeaveViewers += 1
      addAction('part', channel)

    } else { total.stayViewers += 1 }
  })

  _.forEach(reVerifyChannel, channel => {
    const formatedChannel = channelName(channel)
    const isStream = streams.find(s => channelName(s.user_login) === formatedChannel)
    if (!isStream) {
      addAction('part', channel)
      total.partOffline += 1
      data.totalLeaveOffline += 1
    }
  })

  output(
    `${total.stayViewers} stay == ${total.partViewers} part viewers == ${total.partOffline} part offline`)
}

export default {
  reVerify,
}
