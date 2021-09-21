import _ from 'lodash'

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
    const { type, user_name, viewer_count } = stream
    const channel = formatChannel(user_name)
    console.debug(`- (${type}) ${channel}, ${viewer_count} viewers`)

    const isJoined = _.get(data, `joined.${channel}`, null)
    if (isJoined && (type !== 'live'
        || viewer_count < config.viewerMinimumLeave
        || viewer_count > config.viewerMaximumLeave)) {
      console.debug(`-- ${channel}: part`)
      data.actions.push({
        type: 'tmi',
        action: 'part',
        channel,
      })
      data.joined[channel] = nextVerify * 999
    }
  })

  _.forEach(reVerifyChannel, channel => {
    const formatedChannel = formatChannel(channel)
    const isStream = streams.find(s => formatChannel(s.user_name) === formatedChannel)
    if (!isStream) {
      data.joined[formatedChannel] = nextVerify
      console.debug(`- (offline) ${formatedChannel}, 0 viewers`)
      console.debug(`-- ${formatedChannel}: part`)
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
