/* eslint-disable id-length */
const config = {

  // oauth token https://twitchtokengenerator.com/
  clientId: 'gp762nuuoqcoxypju8c569th9wz7q5',
  oauth: 'ft5ohuu8298jplqc9k7s2a4xdx57kh',

  loopEvery: 1000,

  apiCallEvery: 3,
  tmiActionEvery: 4,

  reVerifyViewerEvery: 60 * 1,
  reVerifyViewerMinimumChannel: 100,

  // forceLeaveAfter: 60 * 1,
  // lockJoinAfterLeave: 60 * 1,
  // checkForceLeaveEvery: 60 * 1,
  forceLeaveAfter: 60 * 190,
  lockJoinAfterLeave: 60 * 90,

  checkForceLeaveEvery: 60 * 2,
  checkReVerifyEvery: 60 * 2,

  streamPerPage: 100,

  viewerMinimumEnter: 7,
  viewerMaximumEnter: 30,
  viewerMinimumLeave: 5,
  viewerMaximumLeave: 40,

  language: undefined,

  actionOnceEvery: 60 * 190,

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
