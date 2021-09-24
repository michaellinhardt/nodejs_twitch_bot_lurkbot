import _ from 'lodash'
import config from '../config'

const tmiAction = async () => {
  const action = data.actions.shift()

  const currTimestamp = timestamp()

  const actionKey = `${action.action}_${action.channel}`

  const actionOnceEvery = _.get(data, `actionOnceEvery.${actionKey}`, 0)
  const channelLock = _.get(data, `channels.${action.channel}.locked`, 0)

  if (actionOnceEvery < currTimestamp
    && (action.action === 'part'
      || (action.action === 'join' && channelLock < currTimestamp))) {

    if (action.action === 'part') {
      data.localPart += 1
      data.localCurr -= 1
    } else {
      data.localJoin += 1
      data.localCurr += 1
    }

    await chatbot[action.action](action.channel)
      .catch(err => {
        const currTimestamp = timestamp()
        if (err === 'msg_banned') {
          output(`Banned from: ${action.channel}.. bitch! locking channel`)
          _.set(data.channels, `${action.channel}.locked`, timestamp() + (60 * 60 * 24 * 10))

        } else {
          output(`Slowing down TMI action: ${err}`)
          config.tmiActionEvery = config.tmiActionSlow
          _.set(data, 'tmiActionSlowUntil', currTimestamp + config.tmiActionSlowUntil)
        }
      })
    data.nextTmiAction = currTimestamp + config.tmiActionEvery
    liveOutput(`TMI ${action.action} @ ${action.channel}`)
  }

  _.set(data, `actionOnceEvery.${actionKey}`, currTimestamp + config.actionOnceEvery)

  return true
}

export default {
  tmiAction,
}
