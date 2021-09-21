import _ from 'lodash'

const tmiAction = async () => {
  const action = data.actions.shift()

  const currTimestamp = timestamp()

  // console.debug(`\nTmi Action: ${action.action}, Channel: ${action.channel}`)

  const actionKey = `${action.action}_${action.channel}`

  const actionOnceEvery = _.get(data, `actionOnceEvery.${actionKey}`, 0)

  if (actionOnceEvery <= currTimestamp) {
    await chatbot[action.action](action.channel)
    data.nextTmiAction = currTimestamp + config.tmiActionEvery
  }

  _.set(data, `actionOnceEvery.${actionKey}`, currTimestamp + config.actionOnceEvery)

  return true
}

export default {
  tmiAction,
}
