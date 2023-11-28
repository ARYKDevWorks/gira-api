import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const Config = () => {
  return {
    PORT: parseInt(process.env.PORT),
    CRUD_SERVICE_HOST: process.env.CRUD_SERVICE_HOST,
    CRUD_SERVICE_PORT: parseInt(process.env.CRUD_SERVICE_PORT),
    AUTH_SERVICE_HOST: process.env.AUTH_SERVICE_HOST,
    AUTH_SERVICE_PORT: parseInt(process.env.AUTH_SERVICE_PORT),
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_CHECK_PERIOD: process.env.AUTH_CHECK_PERIOD,
  };
};

export const ConfigSchema: ObjectSchema = Joi.object({
  PORT: Joi.number().default(3000),
  CRUD_SERVICE_HOST: Joi.string().required(),
  CRUD_SERVICE_PORT: Joi.number().default(1111),
  AUTH_SERVICE_HOST: Joi.string().required(),
  AUTH_SERVICE_PORT: Joi.number().default(2222),
  AUTH_SECRET: Joi.string().required(),
  AUTH_CHECK_PERIOD: Joi.number().default(86400000),
});
