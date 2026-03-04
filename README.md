<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

KIT Global — task and project management system (NestJS, MongoDB, JWT).

## Project setup

```bash
npm install
```

## Run

```bash
npm run start
npm run start:dev
npm run start:prod
```

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Deployment

### Development

1. Start MongoDB:

```bash
docker compose up -d mongodb
```

2. Configure environment:

```bash
cp .env.example .env
```

Edit `.env` if needed. Default: `MONGODB_URI=mongodb://admin:admin123@localhost:27017/kit_global?authSource=admin`

3. Run app:

```bash
npm install
npm run start:dev
```

API: http://localhost:3000  
Swagger: http://localhost:3000/api

### Production (Docker Compose)

1. Prepare:

```bash
cp .env.prod.example .env
```

Set in `.env`:
- `JWT_SECRET` — JWT secret key
- `MONGO_ROOT_PASSWORD` — MongoDB root password (must match for app and DB; use fresh volume if changing)

2. Start:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Or: `npm run docker:prod:up`

3. Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

Or: `npm run docker:prod:down`

4. Logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

### Dev/Prod database switching

Configuration picks MongoDB URI by `NODE_ENV`:

| NODE_ENV | Default MONGODB_URI |
|----------|---------------------|
| development | `mongodb://admin:admin123@localhost:27017/kit_global?authSource=admin` |
| production | `mongodb://admin:admin123@mongodb:27017/kit_global?authSource=admin` |

Override via `MONGODB_URI` in `.env`.

**Dev:** Run `docker compose up -d mongodb`, then `npm run start:dev`

**Prod:** In `docker-compose.prod.yml` the app connects to `mongodb` service by hostname. Prod uses a separate volume `mongodb_data_prod` (dev uses `mongodb_data`). If you get "Authentication failed", remove the prod volume and restart: `docker compose -f docker-compose.prod.yml down -v && docker compose -f docker-compose.prod.yml up -d`

**External MongoDB:** Set in `.env`:

```
MONGODB_URI=mongodb://user:pass@your-mongo-host:27017/kit_global?authSource=admin
```

### Environment variables

| Variable | Dev | Prod | Description |
|----------|-----|------|-------------|
| NODE_ENV | development | production | Environment |
| PORT | 3000 | 3000 | App port |
| MONGODB_URI | localhost | mongodb (in docker) | MongoDB URI |
| JWT_SECRET | * | required | JWT secret |
| JWT_EXPIRES_IN | 7d | 7d | Token TTL |
| MONGO_ROOT_PASSWORD | - | required | MongoDB root password (prod compose only) |

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
