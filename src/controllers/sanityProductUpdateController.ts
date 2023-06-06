/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { sanityProductUpdateService } from '../services/sanityProductUpdateService';

export const sanityProductUpdateController = async (req: Request, res: Response) => {
  const { body } = req;

  await sanityProductUpdateService(body);
  res.sendStatus(200);
};
