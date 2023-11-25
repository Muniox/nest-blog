import * as Joi from 'joi';

export const envValidationObjectSchema = Joi.object({
  // NODE MODE
  NODE_ENV: Joi.string().valid('development', 'production').required(),

  //APP
  APP_PORT: Joi.number().required(),
  APP_HOSTNAME: Joi.string().required(),

  //COOKIE
  APP_DOMAIN: Joi.string().required(),
  APP_REFRESH_PATH: Joi.string().required(),

  // DATABASE
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().required(),
  DB_LOGGING: Joi.boolean().required(),

  //ACCESS TOKEN
  JWT_SECRET_ACCESS_TOKEN: Joi.string().required(),
  JWT_EXPIRATION_TIME_ACCESS_TOKEN: Joi.string().required(),
  //REFRESH TOKEN
  JWT_SECRET_REFRESH_TOKEN: Joi.string().required(),
  JWT_EXPIRATION_TIME_REFRESH_TOKEN: Joi.string().required(),
});
