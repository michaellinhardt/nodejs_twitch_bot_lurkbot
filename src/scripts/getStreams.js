import config from '../config'
const { addAction } = require('./addAction').default

const getStreams = async () => {
  const query = {
    after: _.get(data, 'cursor', undefined),
    language: config.language,
    first: config.streamPerPage,
  }

  if (data.lastGetStreamJoined === 0) {
    query.first = 100
  }

  const res = await superagent
    .get('https://api.twitch.tv/helix/streams')
    .query(query)
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => {
      output(err, err.response, err.message)
      return false
    })

  const streams = _.get(res, 'body.data', [])
  if (streams.length === 0) { return false }

  const after = _.get(res, 'body.pagination.cursor', undefined)
  _.set(data, 'cursor', after)

  let serverJoined = 0
  let totalLeaveViewers = 0

  const nextVerify = timestamp() + config.reVerifyViewerEvery
  const viewerMinimumLeave = config.viewerMinimumLeave
  const viewerMaximumLeave = config.viewerMaximumLeave
  let highestViewer = 0

  _.forEach(streams, stream => {
    const { type, user_login, viewer_count, game_id } = stream
    if (viewer_count > highestViewer) { highestViewer = viewer_count }
    const channel = channelName(user_login)

    const isJoined = _.get(data, `channels.${channel}.status`, false)
    if (!isJoined
        && game_id !== '490100' // lost ark
        && type === 'live'
        && viewer_count >= config.viewerMinimumEnter
        && viewer_count <= config.viewerMaximumEnter) {

      serverJoined += 1
      addAction('join', channel)

    } else if (isJoined && (type !== 'live'
    || viewer_count < viewerMinimumLeave
    || viewer_count > viewerMaximumLeave)) {

      totalLeaveViewers += 1
      data.totalLeaveViewers += 1
      addAction('part', channel)

    } else if (isJoined) {
      _.set(data, `channels.${channel}.reVerify`, nextVerify)
    }
  })

  data.lastGetStreamJoined = serverJoined

  output(`Get ${query.first} streams, ${serverJoined} join`)

  if (totalLeaveViewers > 0) {
    output(`${totalLeaveViewers} leave for low viewers`)
  }

  if (highestViewer < config.viewerMinimumEnter) {
    _.set(data, 'cursor', undefined)
    output('Reached too low viewer count on the list, restart from top')
  }
}

export default {
  getStreams,
}
