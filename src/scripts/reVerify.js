import _ from 'lodash'
import config from '../config'

const reVerify = async (reVerifyChannel) => {

  console.debug(`\nRe Verify ${reVerifyChannel.length} streams`)
  const queryString = reVerifyChannel.join('&user_login=')
  const url = `https://api.twitch.tv/helix/streams?user_login=${queryString}`

  const res = await superagent
    .get(url)
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => {
      console.debug(err, err.response, err.message)
      const nextVerify = timestamp() + config.reVerifyViewerEvery
      _.forEach(data.joined, (value, channel) => {
        data.joined[channel.replace('#', '')] = nextVerify * 3
      })
    })

  const streams = _.get(res, 'body.data', [])

  const nextVerify = timestamp() + config.reVerifyViewerEvery

  _.forEach(streams, stream => {
    const { type, user_login, viewer_count, game_id, language } = stream

    const viewerMinimumLeave = _.get(config, `games['${game_id}'].viewerMinimumLeave`, config.viewerMinimumLeave)
    const viewerMaximumLeave = _.get(config, `games['${game_id}'].viewerMaximumLeave`, config.viewerMaximumLeave)

    const channel = formatChannel(user_login)

    const isJoined = _.get(data, `joined.${channel}`, null)
    if (isJoined && (type !== 'live'
        || viewer_count < viewerMinimumLeave
        || viewer_count > viewerMaximumLeave)) {
      console.debug(`-- ${language.toUpperCase()} (viewers) ${channel}: part, ${viewer_count} viewers`)
      data.actions.push({
        type: 'tmi',
        action: 'part',
        channel,
      })
      data.joined[channel] = nextVerify * 999
    }
    console.debug(`-- ${language.toUpperCase()} (live) ${channel}: stay, ${viewer_count} viewers`)
  })

  _.forEach(reVerifyChannel, channel => {
    const formatedChannel = formatChannel(channel)
    const isStream = streams.find(s => formatChannel(s.user_login) === formatedChannel)
    if (!isStream) {
      data.joined[formatedChannel] = nextVerify * 999
      console.debug(`-- (offline) ${formatedChannel}: part`)
      // console.debug(`-- ${formatedChannel}: part`)
      data.actions.push({
        type: 'tmi',
        action: 'part',
        channel: formatedChannel,
      })
    }
  })
}

export default {
  reVerify,
}
