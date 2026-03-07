const isProd = process.env.NODE_ENV === 'production';

const defaultMongoDev =
  'mongodb://admin:admin123@localhost:27017/kit_global?authSource=admin';
const defaultMongoProd =
  'mongodb://admin:admin123@mongodb:27017/kit_global?authSource=admin';

export default () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongodb: {
    uri:
      process.env.MONGODB_URI ?? (isProd ? defaultMongoProd : defaultMongoDev),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
