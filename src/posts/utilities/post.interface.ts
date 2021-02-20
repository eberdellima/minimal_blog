import { ICategoryDTO } from "../../categories/utilities/category.interface";

export interface IPostDTO {
  id?: number;
  title: string;
  description: string;
  slug?: string;
  categories?: ICategoryDTO[];
}