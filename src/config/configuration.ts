const isProd = process.env.NODE_ENV === 'production';

export default () => {
  if (isProd && !process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET environment variable must be set in production',
    );
  }
  if (isProd && !process.env.MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable must be set in production',
    );
  }

  return {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    mongodb: {
      uri:
        process.env.MONGODB_URI ??
        'mongodb://admin:admin123@localhost:27017/kit_global?authSource=admin',
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
  };
};
