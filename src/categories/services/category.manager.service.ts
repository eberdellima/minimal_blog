import { CategoryRepository } from "../repositories/category.repository";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { ICategoryDTO } from "../utilities/category.interface";
import { CategoryAlreadyExistsError, CategoryNotFoundError } from "../utilities/category.errors";


export class CategoryManager {

  private readonly categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public getCategoryById = async (categoryId: number) => {

    const category = await this.categoryRepository.findOne(categoryId);

    if (category === undefined) {
      throw new CategoryNotFoundError();
    }

    return category;
  }

  public getCategoryList = async (paginationDTO: IPaginationDTO) => {
    return this.categoryRepository.getCategories(paginationDTO);
  }

  public addCategory = async (categoryDto: ICategoryDTO) => {

    const sameNameCategory = await this.categoryRepository.getCategoryByName(categoryDto.name);

    if (sameNameCategory) {
      throw new CategoryAlreadyExistsError();
    }

    const newCategory = this.categoryRepository.create(categoryDto);
    return this.categoryRepository.save(newCategory);
  }

  public updateCategoryName = async (categoryDto: ICategoryDTO) => {

    const category = await this.getCategoryById(categoryDto.id);
    const updatedCategory = this.categoryRepository.merge(category, categoryDto);

    return this.categoryRepository.save(updatedCategory);
  }

  public deleteCategoryById = async (categoryId: number) => {

    const category = await this.getCategoryById(categoryId);

    category.posts = [];
    await this.categoryRepository.save(category);
    return this.categoryRepository.delete({ id: categoryId });
  }
}