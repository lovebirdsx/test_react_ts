import { SetupWorker, rest, setupWorker } from 'msw';
import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { Server as MockSocketServer } from 'mock-socket';
import { parseISO } from 'date-fns';

const NUM_USERS = 3;
const POSTS_PER_USER = 3;
const RECENT_NOTIFICATIONS_DAYS = 7;
const ARTIFICIAL_DELAY_MS = 2000;

let useSeededRNG = true;
let rng = seedrandom();

if (useSeededRNG) {
  let randomSeedString = localStorage.getItem('randomTimestampSeed');
  let seedDate: Date;

  if (randomSeedString) {
    seedDate = new Date(randomSeedString);
  } else {
    seedDate = new Date();
    randomSeedString = seedDate.toISOString();
    localStorage.setItem('randomTimestampSeed', randomSeedString);
  }

  rng = seedrandom(randomSeedString);
  faker.seed(seedDate.getTime());
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min + 1)) + min;
}

const randomFromArray = <T>(array: T[]): T => {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
};

export const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf('post'),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    date: String,
    content: String,
    reactions: oneOf('reaction'),
    comments: manyOf('comment'),
    user: oneOf('user'),
  },
  comment: {
    id: primaryKey(String),
    date: String,
    text: String,
    post: oneOf('post'),
  },
  reaction: {
    id: primaryKey(nanoid),
    thumbsUp: Number,
    hooray: Number,
    heart: Number,
    rocket: Number,
    eyes: Number,
    post: oneOf('post'),
  },
});

interface UserData {
  firstName: string;
  lastName: string;
  name: string;
  username: string;
}

const createUserData = (): UserData => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(),
  }
};

const createPostData = (user: any) => {
  return {
    title: faker.lorem.words(),
    date: faker.date.recent({ days: RECENT_NOTIFICATIONS_DAYS }).toISOString(),
    user,
    content: faker.lorem.paragraphs(),
    reactions: db.reaction.create(),
  };
};

for (let i = 0; i < NUM_USERS; i++) {
  const author = db.user.create(createUserData());
  for (let j = 0; j < POSTS_PER_USER; j++) {
    const newPost = createPostData(author);
    db.post.create(newPost);
  }
}

const serializePost = (post: any) => ({
  ...post,
  user: post.user.id,
});

export const handlers = [
  rest.get('/fakeApi/posts', function (req, res, ctx) {
    const posts = db.post.getAll().map(serializePost)
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(posts))
  }),

  rest.post('/fakeApi/posts', async function (req, res, ctx) {
    const data = await req.json()
    if (data.content === 'error') {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json('Server error saving this post!')
      )
    }

    data.date = new Date().toISOString()

    const user = db.user.findFirst({ where: { id: { equals: data.user } } })
    data.user = user
    data.reactions = db.reaction.create()

    const post = db.post.create(data)
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)))
  }),

  rest.get('/fakeApi/posts/:postId', function (req, res, ctx) {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId as string } },
    })
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)))
  }),

  rest.patch('/fakeApi/posts/:postId', async (req, res, ctx) => {
    const { id, ...data } = await req.json()
    const updatedPost = db.post.update({
      where: { id: { equals: req.params.postId as string } },
      data,
    })
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(serializePost(updatedPost))
    )
  }),

  rest.get('/fakeApi/posts/:postId/comments', (req, res, ctx) => {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId as string } },
    });

    if (!post) {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(404),
        ctx.json({ message: 'Post not found' })
      )
    }

    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json({ comments: post.comments })
    );
  }),

  rest.post('/fakeApi/posts/:postId/reactions', async (req, res, ctx) => {
    const postId = req.params.postId as string;
    const { reaction } = await req.json();
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    });

    if (!post) {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(404),
        ctx.json({ message: 'Post not found' })
      )
    }

    const reactions = post.reactions as any;
    const updatedPost = db.post.update({
      where: { id: { equals: postId as string } },
      data: {
        reactions: {
          ...post.reactions,
          [reaction]: (reactions[reaction] += 1),
        } as any,
      },
    })

    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(serializePost(updatedPost))
    )
  }),
  rest.get('/fakeApi/notifications', (req, res, ctx) => {
    const numNotifications = getRandomInt(1, 5)

    let notifications = generateRandomNotifications(
      undefined,
      numNotifications,
      db
    )

    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(notifications))
  }),
  rest.get('/fakeApi/users', (req, res, ctx) => {
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(db.user.getAll()))
  }),
];

// 需要的时候才创建 worker，避免nodejs环境下的测试报错
let worker: SetupWorker | undefined = undefined;
export function getWorker() {
  if (!worker) {
    worker = setupWorker(...handlers);
  }

  return worker;
}

const socketServer = new MockSocketServer('ws://localhost');
let currentSocket: any;

const sendMessage = (socket: any, obj: any) => {
  socket.send(JSON.stringify(obj));
};

const sendRandomNotifications = (socket: any, since: any) => {
  const numNotifications = getRandomInt(1, 5);
  const notifications = generateRandomNotifications(since, numNotifications, db);
  sendMessage(socket, { type: 'notifications', payload: notifications });
};

export const forceGenerateNotifications = (since: any) => {
  sendRandomNotifications(currentSocket, since);
};

socketServer.on('connection', (socket) => {
  currentSocket = socket;
  socket.on('message', (data) => {
    const message = JSON.parse(data as string);
    switch (message.type) {
      case 'notifications': {
        const since = message.payload;
        sendRandomNotifications(socket, since);
        break;
      }
      default:
        break;
    }
  });
});

interface Notification {
  id: string;
  date: string;
  message: string;
  user: string;
}

const notificationTemplates: string[] = [
  'poked you',
  'says hi!',
  `is glad we're friends`,
  'sent you a gift',
];

function generateRandomNotifications(since: string | undefined, numNotifications: number, db: any): Notification[] {
  const now = new Date();
  let pastDate: Date;

  if (since) {
    pastDate = parseISO(since);
  } else {
    pastDate = new Date(now.valueOf());
    pastDate.setMinutes(pastDate.getMinutes() - 15);
  }

  const notifications: Notification[] = [...Array(numNotifications)].map(() => {
    const user = randomFromArray(db.user.getAll()) as any;
    const template = randomFromArray(notificationTemplates);
    return {
      id: nanoid(),
      date: faker.date.between(pastDate, now).toISOString(),
      message: template,
      user: user.id,
    };
  });

  return notifications;
}
