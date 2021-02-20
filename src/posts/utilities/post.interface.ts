import { ICategoryDTO } from "../../categories/utilities/category.interface";

export interface IPostDTO {
  title: string;
  description: string;
  slug?: string;
  categories?: ICategoryDTO[];
}