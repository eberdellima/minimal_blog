import { CategoryRepository } from "../repositories/category.repository";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";


export class CategoryManager {

  private readonly categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public getCategoryList = async (paginationDTO: IPaginationDTO) => {
    return this.categoryRepository.getCategories(paginationDTO);
  }
}