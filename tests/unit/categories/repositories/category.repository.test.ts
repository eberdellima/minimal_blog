
import { FindConditions, FindManyOptions, FindOneOptions, FindOperator } from 'typeorm';
import { Category } from '../../../../src/categories/models/category.entity';
import { CategoryRepository } from '../../../../src/categories/repositories/category.repository';
import { IPaginationDTO, ORDER_DIRECTION_ENUM } from '../../../../src/common/utilities/pagination.interface';

describe("unit testing CategoryRepository", () => {

  describe("getCategories()", () => {
    test("shoudl return tuple with categories list and total caount", async () => {

      const categories = [
        [new Category()],
        1
      ];

      const categoryRepository = new CategoryRepository();

      categoryRepository.createQueryBuilder = jest.fn().mockReturnValue({
        take: jest.fn().mockReturnValueOnce(this),
        skip: jest.fn().mockReturnValueOnce(this),
        orderBy: jest.fn().mockReturnValueOnce(this),
        getManyAndCount: jest.fn().mockReturnValueOnce(categories),
      });
  
      const paginationDto: IPaginationDTO = {
        size: 1,
        offset: 0,
        orderBy: "id",
        orderDirection: ORDER_DIRECTION_ENUM.DESC
      };
  
      const result = await categoryRepository.getCategories(paginationDto);
      expect(result).toEqual(categories);
    });
  });

  describe("countCategoriesById()", () => {
    test("should return number of categories with given ids", async () => {

      const category1 = new Category();
      category1.id = 1;

      const category2 = new Category();
      category2.id = 2;

      const category3 = new Category();
      category2.id = 3;

      const categoryList = [
        category1,
        category2,
        category3,
      ];

      const customCount = jest.fn((options: FindManyOptions) => {

        const categoryFindConditions: FindConditions<Category> = <FindConditions<Category>>options.where;
        const idFindOperator: FindOperator<number> =  <FindOperator<number>> categoryFindConditions.id;
        const ids: number[] = <number[]> (idFindOperator.value as unknown);
        
        return categoryList.filter(c => ids.includes(c.id));
      });

      const categoryRepository = new CategoryRepository();
      categoryRepository.count = jest.fn().mockImplementation(customCount);

      const ids: number[] = [ category1.id, category2.id ];
      const result = await categoryRepository.countCategoriesById(ids);

      expect(result).toEqual([category1, category2]);
    });
  });

  describe("getCategoryByName()", () => {
    test("should return category with the given name", async () => {

      const category1 = new Category();
      category1.name = "category 1";

      const category2 = new Category();
      category2.name = "category 2";

      const categoryList = [
        category1,
        category2,
      ];

      const customFindOne = jest.fn((options: FindOneOptions) => {

        const categoryFindConditions: FindConditions<Category> = <FindConditions<Category>>options.where;
        const categoryName: string = <string>categoryFindConditions.name;

        return categoryList.find(c => c.name === categoryName);
      });

      const categoryRepository = new CategoryRepository();
      categoryRepository.findOne = jest.fn().mockImplementation(customFindOne);

      const result = await categoryRepository.getCategoryByName(category1.name);
      expect(result).toEqual(category1);
    });
  });
});