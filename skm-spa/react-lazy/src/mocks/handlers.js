import { rest } from 'msw'

export const handlers = [
  rest.get('/users/me', (req, res, ctx) => {
    return res(
      ctx.delay(2000),
      ctx.status(200),
      ctx.json({
        id: '22',
        userName: 'krulik'
      })
    )
  }),
  rest.get('/users/:userId', (req, res, ctx) => {
    return res(
      ctx.delay(3000),
      ctx.status(200),
      ctx.json({
        id: '22',
        userName: 'krulik',
        firstName: 'Serge',
        lastName: 'Krul'
      })
    )
  }),
]