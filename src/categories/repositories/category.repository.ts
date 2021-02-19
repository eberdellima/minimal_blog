import { EntityRepository, Repository } from "typeorm";
import { Category } from "../models/category.entity";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { ICategoryDTO } from "../utilities/category.interface";


@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

  public async getCategories(paginationDTO: IPaginationDTO) {
    const qb = this.createQueryBuilder('c');
    
    if (paginationDTO.size) {
      qb.take(paginationDTO.size);
    }

    if (paginationDTO.offset) {
      qb.skip(paginationDTO.offset);
    }

    if (paginationDTO.orderBy) {
      qb.orderBy(paginationDTO.orderBy, paginationDTO.orderDirection);
    }

    return qb.getManyAndCount();
  }

  public async addCategory(categoryDto: ICategoryDTO) {
    const newCategory = this.create(categoryDto);
    return this.save(newCategory);
  }
}