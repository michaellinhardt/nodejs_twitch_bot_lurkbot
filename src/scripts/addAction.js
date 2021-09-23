import _ from 'lodash'

const addAction = (action, channel) => {
  const currTimestamp = timestamp()
  data.actions.unshift({ action, channel })

  if (action === 'part') {
    _.set(data, `channels.${channel}.reVerify`, currTimestamp + (config.reVerifyViewerEvery * 999))
    _.set(data, `channels.${channel}.forceLeave`, currTimestamp + (config.forceLeaveAfter * 999))

  } else if (action === 'join') {
    _.set(data, `channels.${channel}.reVerify`, currTimestamp + config.reVerifyViewerEvery)
    _.set(data, `channels.${channel}.forceLeave`, currTimestamp + config.forceLeaveAfter)
  }

}

export default {
  addAction,
}
