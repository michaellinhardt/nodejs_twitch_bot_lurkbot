/* eslint-disable id-length */
const config = {

  // oauth token https://twitchtokengenerator.com/
  clientId: 'gp762nuuoqcoxypju8c569th9wz7q5',
  oauth: 'ft5ohuu8298jplqc9k7s2a4xdx57kh',

  loopEvery: 500,

  apiCallEvery: 3,
  tmiActionEvery: 4,

  tmiActionFast: 4,
  tmiActionSlow: 120,
  tmiActionSlowUntil: 360,

  reVerifyViewerEvery: 60 * 5,
  reVerifyViewerOptimalChannel: 100,
  reVerifyViewerMinimumChannel: 10,

  // forceLeaveAfter: 60 * 1,
  // lockJoinAfterLeave: 60 * 1,
  // checkForceLeaveEvery: 60 * 1,
  forceLeaveAfter: 60 * 120,
  lockJoinAfterLeave: 60 * 60,

  checkForceLeaveEvery: 60 * 2,
  checkReVerifyEvery: 60 * 2,

  streamPerPage: 10,

  viewerMinimumEnter: 6,
  viewerMaximumEnter: 30,
  viewerMinimumLeave: 4,
  viewerMaximumLeave: 40,

  language: 'en',

  actionOnceEvery: 60 * 90,

  tmiOpts: {
    options: { debug: false },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: 'teazyou',
      // chat token https://twitchapps.com/tmi/
      password: 'ft5ohuu8298jplqc9k7s2a4xdx57kh',
    },
    channels: [],
  },

}

module.exports = config
