import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export const CrudConfig = () => {
  return {
    HOST: process.env.CRUD_SERVICE_HOST,
    PORT: parseInt(process.env.CRUD_SERVICE_PORT),
  };
};

export const CrudSchema: ObjectSchema = Joi.object({
  CRUD_SERVICE_HOST: Joi.string().required(),
  CRUD_SERVICE_PORT: Joi.number().default(1111),
});
