/* eslint-disable id-length */
const config = {

  // oauth token https://twitchtokengenerator.com/
  clientId: 'gp762nuuoqcoxypju8c569th9wz7q5',
  oauth: 'ft5ohuu8298jplqc9k7s2a4xdx57kh',

  loopEvery: 1000,

  apiCallEvery: 1,
  tmiActionEvery: 2,

  reVerifyViewerEvery: 60 * 20,
  reVerifyViewerMinimumChannel: 100,

  // forceLeaveAfter: 60 * 1,
  // lockJoinAfterLeave: 60 * 1,
  // checkForceLeaveEvery: 60 * 1,
  forceLeaveAfter: 60 * 190,
  lockJoinAfterLeave: 60 * 60,

  checkForceLeaveEvery: 60 * 1,
  checkReVerifyEvery: 60 * 1,

  streamPerPage: 100,

  viewerMinimumEnter: 10,
  viewerMaximumEnter: 30,
  viewerMinimumLeave: 6,
  viewerMaximumLeave: 40,

  language: 'en',

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
