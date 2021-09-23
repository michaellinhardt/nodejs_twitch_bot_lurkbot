import _ from 'lodash'

const addAction = (action, channel) => {
  const currTimestamp = timestamp()

  let isAlready = false
  _.forEach(data.actions, actions => {
    if (actions.channel === channel) {
      isAlready = true
      return false
    }
  })
  if (isAlready) { return false }

  if (action === 'part') {
    data.actions.unshift({ action, channel })
    _.set(data, `channels.${channel}.reVerify`, currTimestamp + (config.reVerifyViewerEvery * 999))
    _.set(data, `channels.${channel}.forceLeave`, currTimestamp + (config.forceLeaveAfter * 999))

  } else if (action === 'join') {
    data.actions.push({ action, channel })
    _.set(data, `channels.${channel}.reVerify`, currTimestamp + config.reVerifyViewerEvery)
    _.set(data, `channels.${channel}.forceLeave`, currTimestamp + config.forceLeaveAfter)
  }

}

export default {
  addAction,
}
