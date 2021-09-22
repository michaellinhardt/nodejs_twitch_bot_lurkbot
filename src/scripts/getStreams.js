import config from '../config'

const getStreams = async () => {
  const game = config.games.shift()

  const rules = {
    ...config.game,
    ...game,
  }

  const currTimestamp = timestamp()

  const query = _.get(data, `pagination['${game.id}']`, {
    game_id: game.id,
    language: rules.language,
    first: rules.streamPerPage,
  })

  if (!query.after && data.lockGame[game.id] > currTimestamp) {
    console.debug(`\nGame ${game.name} is locked..`)
    data.nextApiCall = currTimestamp + 3
    return false
  }

  if (rules.allAtOnce === true) {
    rules.streamPerPage = 100
    query.first = 100
    config.games.unshift(game)
  } else {
    config.games.push(game)
  }

  const res = await superagent
    .get('https://api.twitch.tv/helix/streams')
    .query(query)
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => { console.debug(err, err.response, err.message) })

  const streams = _.get(res, 'body.data', [])

  const after = _.get(res, 'body.pagination.cursor', undefined)

  if (!after || streams.length === 0) {
    console.debug(`\nLocking Game ${game.name} for 1 hour`)
    delete data.pagination[game.id]
    data.lockGame[game.id] = currTimestamp + rules.lockGameUntil
  }

  if (after) {
    _.set(data, `pagination['${game.id}']`, {
      ...query,
      after,
    })
  }

  let totalPriority = 0
  let totalNormal = 0
  const nextVerify = timestamp() + config.reVerifyViewerEvery

  let totalLeaveViewers = 0

  _.forEach(streams, stream => {
    const { type, user_login, viewer_count, game_id } = stream
    const channel = formatChannel(user_login)
    // console.debug(`- ${language.toUpperCase()} (${type}) ${channel}, ${viewer_count} viewers`)

    const viewerMinimumLeave = _.get(config, `games['${game_id}'].viewerMinimumLeave`, config.viewerMinimumLeave)
    const viewerMaximumLeave = _.get(config, `games['${game_id}'].viewerMaximumLeave`, config.viewerMaximumLeave)

    const isJoined = _.get(data, `joined.${channel}`, null)
    if (type === 'live'
        && viewer_count >= rules.viewerMinimumEnter
        && viewer_count <= rules.viewerMaximumEnter
        && !isJoined) {

      const action = {
        type: 'tmi',
        action: 'join',
        channel,
      }
      if (rules.priorityJoin === true) {
        totalPriority += 1
        data.actions.unshift(action)
      } else {
        totalNormal += 1
        data.actions.push(action)
      }

    } else if (isJoined && (type !== 'live'
    || viewer_count < viewerMinimumLeave
    || viewer_count > viewerMaximumLeave)) {

      totalLeaveViewers += 1
      data.totalLeaveViewers += 1
      data.actions.unshift({
        type: 'tmi',
        action: 'part',
        channel,
      })
      data.joined[channel] = nextVerify * 999

    }
  })

  if (totalPriority > 0) {
    console.debug(`\nGet ${rules.streamPerPage} [ ${game.name} ] ${totalPriority} priority join`)
  } else if (totalNormal > 0) {
    console.debug(`\nGet ${rules.streamPerPage} [ ${game.name} ] ${totalNormal} normal join`)
  } else {
    console.debug(`\nGet ${rules.streamPerPage} [ ${game.name} ] 0 join`)
  }

  if (totalLeaveViewers > 0) {
    console.debug(`${totalLeaveViewers} leave, low viewers`)
  }
}

export default {
  getStreams,
}
