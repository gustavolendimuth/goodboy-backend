/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { sanityProductCreateService } from '../services/sanityProductCreateService';

export const sanityProductCreateController = async (req: Request, res: Response) => {
  const { body } = req;

  await sanityProductCreateService(body);
  res.sendStatus(200);
};
