import { faker } from '@faker-js/faker/locale/zh_CN'
import axios from '@/utils/axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

// 排行榜列表
mock.onGet('/toplist/detail').reply(() => {
  return [
    200,
    {
      code: 200,
      list: createTopList(),
      artistToplist: createArtistToplist(),
      rewardToplist: createRewardToplist(),
    },
  ]
})

// 推荐歌单
mock.onGet('/personalized').reply(() => {
  return [
    200,
    {
      code: 200,
      result: Array.from({ length: 6 }, () => ({
        id: faker.string.uuid(),
        name: faker.music.songName(),
        picUrl: faker.image.url(),
        playCount: faker.number.int({ min: 1000, max: 100000 }),
      })),
    },
  ]
})

// 歌单详情
mock.onGet(new RegExp('/playlist/detail')).reply(() => {
  return [
    200,
    {
      code: 200,
      playlist: {
        id: faker.string.uuid(),
        name: faker.music.songName(),
        coverImgId: faker.number.int({ min: 100000000000000, max: 999999999999999 }),
        coverImgUrl: faker.image.url(),
        coverImgId_str: faker.string.numeric(15),
        adType: 0,
        userId: faker.number.int({ min: 1, max: 10000 }),
        createTime: faker.date.past().getTime(),
        status: 0,
        opRecommend: false,
        highQuality: false,
        newImported: false,
        updateTime: faker.date.past().getTime(),
        trackCount: faker.number.int({ min: 50, max: 200 }),
        specialType: 10,
        trackIds: Array.from({ length: faker.number.int({ min: 10, max: 30 }) }, () => ({
          id: faker.number.int({ min: 10000, max: 9999999 }),
          v: faker.number.int({ min: 1, max: 100 }),
          t: 0,
          at: faker.date.past().getTime(),
          alg: null,
          uid: faker.number.int({ min: 1, max: 10000 }),
          rcmdReason: '',
          sc: null,
          f: null,
          lr: 0,
        })),
        tracks: Array.from({ length: faker.number.int({ min: 10, max: 30 }) }, () => ({
          name: faker.music.songName(),
          id: faker.number.int({ min: 10000, max: 9999999 }),
          ar: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
            id: faker.number.int({ min: 1000, max: 99999 }),
            name: faker.person.fullName(),
          })),
          al: {
            id: faker.number.int({ min: 10000, max: 9999999 }),
            name: faker.music.songName(),
            picUrl: faker.image.url(),
          },
          dt: faker.number.int({ min: 120000, max: 300000 }),
        })),
      },
    },
  ]
})

// 搜索
mock.onGet('/search').reply(() => {
  return [
    200,
    {
      code: 200,
      result: {
        songs: Array.from({ length: faker.number.int({ min: 10, max: 20 }) }, () => ({
          id: faker.number.int({ min: 1000000, max: 9999999 }),
          name: faker.music.songName(),
          artists: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
            id: faker.number.int({ min: 10000, max: 99999 }),
            name: faker.person.fullName(),
            picUrl: null,
            alias: [],
            albumSize: 0,
            picId: 0,
            fansGroup: null,
            img1v1Url: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
            img1v1: 0,
            trans: null,
          })),
          album: {
            id: faker.number.int({ min: 100000, max: 999999 }),
            name: faker.music.songName(),
            artist: {
              id: 0,
              name: '',
              picUrl: null,
              alias: [],
              albumSize: 0,
              picId: 0,
              fansGroup: null,
              img1v1Url: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
              img1v1: 0,
              trans: null,
            },
            publishTime: faker.date.past().getTime(),
            size: faker.number.int({ min: 1, max: 100 }),
            copyrightId: faker.number.int({ min: 1000, max: 9999 }),
            status: 1,
            picId: faker.number.int({ min: 100000000000000, max: 999999999999999 }),
            mark: 0,
          },
          duration: faker.number.int({ min: 120000, max: 600000 }),
          copyrightId: faker.number.int({ min: 1000, max: 9999 }),
          status: 0,
          alias: [],
          rtype: 0,
          ftype: 0,
          transNames: [faker.word.words()],
          mvid: 0,
          fee: 8,
          rUrl: null,
          mark: faker.number.int({ min: 10000000000, max: 99999999999 }),
        })),
        hasMore: true,
        songCount: faker.number.int({ min: 100, max: 999 }),
      },
    },
  ]
})

// 热搜
mock.onGet('/search/hot').reply(() => {
  return [
    200,
    {
      code: 200,
      result: {
        hots: Array.from({ length: 10 }, () => ({
          first: faker.music.songName(),
          second: faker.number.int({ min: 1, max: 3 }),
          third: null,
          iconType: faker.number.int({ min: 1, max: 3 }),
        })),
      },
    },
  ]
})

// 用户歌单
mock.onGet(new RegExp('/user/playlist')).reply(() => {
  return [
    200,
    {
      code: 200,
      more: false,
      playlist: Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.music.songName(),
        coverImgUrl: faker.image.url(),
        trackCount: faker.number.int({ min: 5, max: 50 }),
      })),
    },
  ]
})

// 歌曲详情
mock.onGet(new RegExp('/song/detail')).reply(() => {
  return [
    200,
    {
      code: 200,
      songs: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.music.songName(),
        ar: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        })),
        al: {
          id: faker.string.uuid(),
          name: `${faker.music.songName()}专辑`,
          picUrl: faker.image.url(),
        },
        dt: faker.number.int({ min: 120000, max: 300000 }),
      })),
    },
  ]
})

// 检查音乐可用性
mock.onGet(new RegExp('/check/music')).reply(() => {
  return [
    200,
    {
      code: 200,
      success: true,
      message: '音乐可用',
    },
  ]
})

// 音乐地址
mock.onGet(new RegExp('/song/url')).reply(() => {
  return [
    200,
    {
      code: 200,
      data: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
        id: faker.string.uuid(),
        url: faker.internet.url(),
        br: faker.number.int({ min: 128, max: 320 }),
      })),
    },
  ]
})

// 歌词
mock.onGet(new RegExp('/lyric')).reply(() => {
  return [
    200,
    {
      code: 200,
      sgc: false,
      sfy: false,
      qfy: false,
      lrc: {
        version: 2,
        lyric: `[00:00.000] 作词 : ${faker.person.fullName()}\n[00:00.000] 作曲 : ${faker.person.fullName()}\n[00:00.000] 编曲 : ${faker.person.fullName()}\n[00:01.000] ${faker.lorem.sentence()}\n[00:05.000] ${faker.lorem.sentence()}\n[00:09.000] ${faker.lorem.sentence()}`,
      },
      klyric: {
        version: 0,
        lyric: '',
      },
      tlyric: {
        version: 0,
        lyric: '',
      },
      romalrc: {
        version: 0,
        lyric: '',
      },
    },
  ]
})

// 音乐评论
mock.onGet(new RegExp('/comment/music')).reply(() => {
  return [
    200,
    {
      code: 200,
      comments: Array.from({ length: faker.number.int({ min: 10, max: 20 }) }, () => ({
        user: {
          userId: faker.string.uuid(),
          nickname: faker.person.fullName(),
          avatarUrl: faker.image.avatar(),
        },
        content: faker.lorem.paragraph(),
        time: faker.date.past().getTime(),
        likedCount: faker.number.int({ min: 0, max: 1000 }),
      })),
      total: faker.number.int({ min: 50, max: 500 }),
    },
  ]
})

// 辅助函数
const createTopList = (count = 5) => {
  return Array.from({ length: count }, () => ({
    subscribers: [],
    subscribed: null,
    creator: null,
    artists: null,
    tracks: Array.from({ length: 3 }, () => ({
      first: faker.music.songName(),
      second: faker.person.fullName(),
    })),
    updateFrequency: '每天更新',
    backgroundCoverId: 0,
    backgroundCoverUrl: null,
    titleImage: 0,
    coverText: null,
    titleImageUrl: null,
    coverImageUrl: null,
    iconImageUrl: null,
    englishTitle: null,
    opRecommend: false,
    recommendInfo: null,
    socialPlaylistCover: null,
    tsSongCount: 0,
    algType: null,
    totalDuration: 0,
    playCount: faker.number.int({ min: 1000000000, max: 9999999999 }),
    privacy: 0,
    trackNumberUpdateTime: faker.date.past().getTime(),
    trackUpdateTime: faker.date.past().getTime(),
    highQuality: false,
    specialType: 10,
    coverImgId: faker.number.int({ min: 100000000000000, max: 999999999999999 }),
    newImported: false,
    anonimous: false,
    updateTime: faker.date.past().getTime(),
    coverImgUrl: faker.image.url(),
    trackCount: faker.number.int({ min: 50, max: 200 }),
    commentThreadId: `A_PL_0_${faker.number.int({ min: 10000, max: 99999 })}`,
    adType: 0,
    subscribedCount: faker.number.int({ min: 1000000, max: 9999999 }),
    cloudTrackCount: 0,
    createTime: faker.date.past().getTime(),
    ordered: true,
    description: faker.lorem.paragraph(),
    status: 0,
    tags: [],
    userId: 1,
    name: `${faker.music.genre()}榜`,
    id: faker.number.int({ min: 10000, max: 99999 }),
    coverImgId_str: faker.string.numeric(15),
    ToplistType: 'S',
  }))
}

const createArtistToplist = () => ({
  coverUrl: faker.image.url(),
  artists: Array.from({ length: 10 }, () => ({
    first: faker.person.fullName(),
    second: '',
    third: faker.number.int({ min: 1000000, max: 9999999 }),
  })),
  name: '云音乐歌手榜',
  upateFrequency: '每天更新',
  position: 5,
  updateFrequency: '每天更新',
})

const createRewardToplist = () => ({
  coverUrl: faker.image.url(),
  songs: Array.from({ length: 3 }, () => ({
    name: faker.music.songName(),
    id: faker.number.int({ min: 10000, max: 9999999 }),
    position: 0,
    alias: [faker.lorem.words(2)],
    status: 0,
    fee: 8,
    artists: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      name: faker.person.fullName(),
      id: faker.number.int({ min: 10000, max: 99999 }),
    })),
    album: {
      name: faker.music.songName(),
      id: faker.number.int({ min: 100000, max: 999999 }),
      picUrl: faker.image.url(),
      publishTime: faker.date.past().getTime(),
    },
    duration: faker.number.int({ min: 120000, max: 300000 }),
    mvid: faker.number.int({ min: 0, max: 99999 }),
  })),
  name: '云音乐赞赏榜',
  position: 4,
})
export default mock
