import * as Joi from 'joi';

export const envValidationObjectSchema = Joi.object({
    // NODE MODE
    NODE_ENV: Joi.string().valid('development', 'production').required(),

    //APP
    APP_PORT: Joi.number().required(),
    APP_HOSTNAME: Joi.string().required(),

    // DATABASE
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_SYNCHRONIZE: Joi.boolean().required(),
    DB_LOGGING: Joi.boolean().required(),
});
