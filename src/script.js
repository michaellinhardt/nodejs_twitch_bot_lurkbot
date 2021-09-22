/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import tmi from 'tmi.js'
import _ from 'lodash'
import superagent from 'superagent'
import prettyjson from 'prettyjson'
import moment from 'moment'
import config from './config'

const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })
const timestamp = () => parseInt(moment().format('X'), 10)
const dump = object => process.stdout.write(prettyjson.render(object))

const data = {}
const { tmiOpts } = config

let chatbot = null

const start = async () => {
  chatbot = new tmi.client(tmiOpts)
  await chatbot.connect()
  await sleep(500)
  console.log('Connected')

  chatbot.on('join', (channel, username, self) => {
    if (self) {}
  })

  chatbot.on('part', (channel, username, self) => {
    if (self) {}
  })
}

const run = async () => {
  const query = {
    login: 'teazmod',
  }

  const res = await superagent
    .get('https://api.twitch.tv/helix/users')
    .query(query)
    .set('Client-ID', config.clientId)
    .set('Authorization', `Bearer ${config.oauth}`)
    .set('Accept', 'application/json')
    .catch((err) => { console.debug(err, err.response, err.message) })

  const data = _.get(res, 'body.data[0]', undefined)
  console.debug(data)
}

run()
