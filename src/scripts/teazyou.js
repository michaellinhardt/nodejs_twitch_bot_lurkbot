let stalkInterval = null

const stalk = async () => {
  const res = await superagent
    .get('https://api.twitch.tv/helix/streams')
    .query({
      user_login: config.masterAccount,
    //   user_login: config.tmiOpts.identity.username,
    })
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => {
      output(err, err.response, err.message)
      data.stream = undefined
    })

  data.stream = _.get(res, 'body.data[0]', undefined)
  output(data.stream)
}

export default {
  start: async () => {
    await stalk()
    // stalkInterval = setInterval(stalk, config.verifyMasterEvery)
  },
  stop: () => {
    clearInterval(stalkInterval)
    stalkInterval = null
  },
}
