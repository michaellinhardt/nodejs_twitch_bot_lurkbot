import _ from 'lodash'

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
    data.nextTmiAction = currTimestamp + config.tmiActionEvery
    liveOutput(`TMI ${action.action} @ ${action.channel}`)
  }

  _.set(data, `actionOnceEvery.${actionKey}`, currTimestamp + config.actionOnceEvery)

  return true
}

export default {
  tmiAction,
}
