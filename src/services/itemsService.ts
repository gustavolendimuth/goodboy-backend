/* eslint-disable import/prefer-default-export */
import ItemsModel from '../database/models/ItemsModel';
import { SanityProduct } from '../interfaces';
import sanity from '../utils/sanityClient';

export const getItemsService = async (orderId:string) => ItemsModel.findAll({ where: { orderId } });

export const getSanityProductsService = async (id:string[]):Promise<SanityProduct[]> => {
  const params = { id };
  return sanity.fetch(
    `*[_type == "products" && _id in $id]{
      "id": _id,
      title,
      price,
      ncm,
      "image": photo.image.asset->url
    }`,
    params,
  );
};
