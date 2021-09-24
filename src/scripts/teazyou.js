let stalkInterval = null

const stalk = async () => {
  const res = await superagent
    .get('https://api.twitch.tv/helix/streams?user_login=teazyou&user_login=teazwar&user_login=Stoopzz_TV')
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => {
      output(`zbra - ${err}, ${err.response}, ${err.message}`)
      data.stream = undefined
    })

  data.stream = _.get(res, 'body.data[0]', undefined)
  console.debug(data.stream)
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
