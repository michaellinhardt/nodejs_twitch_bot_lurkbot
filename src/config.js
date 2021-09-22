/* eslint-disable id-length */
const config = {

  // oauth token https://twitchtokengenerator.com/
  clientId: 'gp762nuuoqcoxypju8c569th9wz7q5',
  oauth: 'ft5ohuu8298jplqc9k7s2a4xdx57kh',

  sleepBeforeReady: 3000,

  masterAccount: 'AnnieGreen',

  // verifyMasterEvery: 60 * 1000,

  loopEvery: 1000,

  apiCallEvery: 4,
  tmiActionEvery: 3,

  reVerifyViewerEvery: 60 * 5,
  reVerifyViewerMinimumChannel: 90,

  forceLeaveAfter: 60 * 190,
  lockJoinAfterLeave: 60 * 190,
  checkForceLeaveEvery: 60 * 10,

  game: {
    streamPerPage: 10,

    viewerMinimumEnter: 6,
    viewerMaximumEnter: 50,
    viewerMinimumLeave: 3,
    viewerMaximumLeave: 80,

    lockGameUntil: 60 * 10,

    language: undefined,
    // language: 'en',
  },

  actionOnceEvery: 60 * 60,

  // lockGameUntil: 30,

  games: [
    {
      name: 'All Games',
      id: undefined,
      // language: 'en',
      lockGameUntil: 60 * 10,
    },
    {
      name: 'Lost Ark',
      id: '490100',
      viewerMinimumEnter: 6,
      viewerMaximumEnter: 80,
      viewerMinimumLeave: 3,
      viewerMaximumLeave: 100,
      lockGameUntil: 60 * 30,
      allAtOnce: true,
      priorityJoin: true,
    },
    {
      name: 'Genshin Impact',
      id: '513181',
      viewerMinimumEnter: 6,
      viewerMaximumEnter: 80,
      viewerMinimumLeave: 3,
      viewerMaximumLeave: 100,
      lockGameUntil: 60 * 30,
      allAtOnce: true,
      priorityJoin: true,
    },
    {
      name: 'New World',
      id: '493597',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'World of Warcraft',
      id: '18122',
      lockGameUntil: 60 * 30,
      allAtOnce: true,
    },
    {
      name: 'Final Fantasy XIV Online',
      id: '24241',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Diablo II',
      id: '1041',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Diablo II: Resurrected',
      id: '1788326126',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Diablo III',
      id: '313558',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Black Desert Online',
      id: '386821',
      language: 'en',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'God of War',
      id: '6369',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Dark Souls III',
      id: '490292',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Monster Hunter: World',
      id: '497467',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Just Chatting',
      id: '509658',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Path of Exile',
      id: '29307',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'The Elder Scrolls Online',
      id: '65654',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Dungeons & Dragons',
      id: '509577',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'The Elder Scrolls V: Skyrim',
      id: '30028',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Guild Wars 2',
      id: '19357',
      lockGameUntil: 60 * 90,
      allAtOnce: true,
    },
    {
      name: 'Grand Theft Auto V',
      id: '32982',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Minecraft',
      id: '27471',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'League of Legends',
      id: '21779',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Valorant',
      id: '516575',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Dead by Daylight',
      id: '491487',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Apex Legends',
      id: '511224',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Hearthstone',
      id: '138585',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Call of Duty: Warzone',
      id: '512710',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Red Dead Redemption 2',
      id: '493959',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Dota 2',
      id: '29595',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Teamfight Tactics',
      id: '513143',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Escape from Tarkov',
      id: '491931',
      language: 'en',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Destiny 2',
      id: '497057',
      lockGameUntil: 60 * 90,
    },
    {
      name: 'Kena: Bridge of Spirits',
      id: '518004',
      lockGameUntil: 60 * 90,
    },
    {
      name: 'Jump King',
      id: '512070',
      lockGameUntil: 60 * 90,
    },
    {
      name: 'Art',
      id: '509660',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Rust',
      id: '263490',
      lockGameUntil: 60 * 90,
    },
    {
      name: 'ASMR',
      id: '509659',
      lockGameUntil: 60 * 30,
    },
    {
      name: 'Music',
      id: '26936',
      lockGameUntil: 60 * 30,
    },
  ],

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
