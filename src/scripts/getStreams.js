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
    config.games.unshift(game)
  } else {
    config.games.push(game)
  }

  console.debug(`\nGet ${rules.streamPerPage} [ ${game.name} ] streams`)

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

  _.forEach(streams, stream => {
    const { type, user_login, viewer_count, language } = stream
    const channel = formatChannel(user_login)
    console.debug(`- ${language.toUpperCase()} (${type}) ${channel}, ${viewer_count} viewers`)

    const isJoined = _.get(data, `joined.${channel}`, null)
    if (type === 'live'
        && viewer_count >= rules.viewerMinimumEnter
        && viewer_count <= rules.viewerMaximumEnter
        && !isJoined) {
      data.actions.push({
        type: 'tmi',
        action: 'join',
        channel,
      })
    }
  })
}

export default {
  getStreams,
}
