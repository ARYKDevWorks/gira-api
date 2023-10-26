import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
export const config = () => {
  return {
    PORT: parseInt(process.env.PORT),
    DB_PORT: parseInt(process.env.DB_PORT),
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
  };
};

export const schema: ObjectSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_PORT: Joi.number().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
