/* eslint-disable id-length */
const config = {

  // oauth token https://twitchtokengenerator.com/
  clientId: 'gp762nuuoqcoxypju8c569th9wz7q5',
  oauth: 'ft5ohuu8298jplqc9k7s2a4xdx57kh',

  sleepBeforeReady: 3000,

  language: 'en',

  masterAccount: 'AnnieGreen',

  // verifyMasterEvery: 60 * 1000,

  loopEvery: 1000,

  apiCallEvery: 6,
  tmiActionEvery: 3,

  streamPerPage: 30,

  reVerifyViewerEvery: 60 * 20,
  reVerifyViewerMinimumChannel: 20,

  actionOnceEvery: 60 * 30,

  // lockGameUntil: 30,
  lockGameUntil: 60 * 30,

  viewerMinimumEnter: 5,
  viewerMaximumEnter: 40,

  viewerMinimumLeave: 2,
  viewerMaximumLeave: 50,

  games: [
    {
      name: 'Lost Ark',
      id: '490100',
    },
    {
      name: 'Genshin Impact',
      id: '513181',
    },
    {
      name: 'New World',
      id: '493597',
    },
    {
      name: 'World of Warcraft',
      id: '18122',
    },
    {
      name: 'Final Fantasy XIV Online',
      id: '24241',
    },
    {
      name: 'Diablo II',
      id: '1041',
    },
    {
      name: 'Diablo II: Resurrected',
      id: '1788326126',
    },
    {
      name: 'Diablo III',
      id: '313558',
    },
    {
      name: 'Black Desert Online',
      id: '386821',
    },
    {
      name: 'God of War',
      id: '6369',
    },
    {
      name: 'Dark Souls III',
      id: '490292',
    },
    {
      name: 'Monster Hunter: World',
      id: '497467',
    },
    {
      name: 'Just Chatting',
      id: '509658',
    },
    {
      name: 'Path of Exile',
      id: '29307',
    },
    {
      name: 'The Elder Scrolls Online',
      id: '65654',
    },
    {
      name: 'Dungeons & Dragons',
      id: '509577',
    },
    {
      name: 'The Elder Scrolls V: Skyrim',
      id: '30028',
    },
    {
      name: 'Guild Wars 2',
      id: '19357',
    },
    {
      name: 'Grand Theft Auto V',
      id: '32982',
    },
    {
      name: 'Minecraft',
      id: '27471',
    },
    {
      name: 'League of Legends',
      id: '21779',
    },
    {
      name: 'Valorant',
      id: '516575',
    },
    {
      name: 'Dead by Daylight',
      id: '491487',
    },
    {
      name: 'Apex Legends',
      id: '511224',
    },
    {
      name: 'Hearthstone',
      id: '138585',
    },
    {
      name: 'Call of Duty: Warzone',
      id: '512710',
    },
    {
      name: 'Red Dead Redemption 2',
      id: '493959',
    },
    {
      name: 'Dota 2',
      id: '29595',
    },
    {
      name: 'Teamfight Tactics',
      id: '513143',
    },
    {
      name: 'Escape from Tarkov',
      id: '491931',
    },
    {
      name: 'Destiny 2',
      id: '497057',
    },
    {
      name: 'Kena: Bridge of Spirits',
      id: '518004',
    },
    {
      name: 'Jump King',
      id: '512070',
    },
    {
      name: 'Art',
      id: '509660',
    },
    {
      name: 'Rust',
      id: '263490',
    },
    {
      name: 'ASMR',
      id: '509659',
    },
    {
      name: 'Music',
      id: '26936',
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
