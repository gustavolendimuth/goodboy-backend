/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { sanityProductUpdateService, sanityProductCreateService } from '../services/sanityProductService';

export const sanityProductCreateController = async (req: Request, res: Response) => {
  const { body } = req;

  await sanityProductCreateService(body);
  res.sendStatus(200);
};

export const sanityProductUpdateController = async (req: Request, res: Response) => {
  const { body } = req;

  await sanityProductUpdateService(body);
  res.sendStatus(200);
};
