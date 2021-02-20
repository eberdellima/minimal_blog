import { CategoryRepository } from "../repositories/category.repository";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { ICategoryDTO } from "../utilities/category.interface";
import { CategoryNotFoundError } from "../utilities/category.errors";


export class CategoryManager {

  private readonly categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public getCategoryList = async (paginationDTO: IPaginationDTO) => {
    return this.categoryRepository.getCategories(paginationDTO);
  }

  public addCategory = async (categoryDto: ICategoryDTO) => {
    const newCategory = this.categoryRepository.create(categoryDto);
    return this.categoryRepository.save(newCategory);
  }

  public updateCategoryName = async (categoryDto: ICategoryDTO) => {

    const category = await this.categoryRepository.findOne(categoryDto.id);

    if (category === undefined) {
      throw new CategoryNotFoundError();
    }

    const updatedCategory = this.categoryRepository.merge(category, categoryDto);
    return this.categoryRepository.save(updatedCategory);
  }
}