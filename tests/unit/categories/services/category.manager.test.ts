
import { Category } from '../../../../src/categories/models/category.entity';
import { CategoryRepository } from '../../../../src/categories/repositories/category.repository';
import { CategoryManager } from '../../../../src/categories/services/category.manager.service';
import { CategoryAlreadyExistsError, CategoryNotFoundError } from '../../../../src/categories/utilities/category.errors';
import { ICategoryDTO } from '../../../../src/categories/utilities/category.interface';
import { IPaginationDTO, ORDER_DIRECTION_ENUM } from '../../../../src/common/utilities/pagination.interface';

describe("unit testing CategoryManager", () => {

  describe("getCategoryById()", () => {
    test("should throw CategoryNotFoundError when no category found", async () => {

      const categoryRepository = new CategoryRepository();
      categoryRepository.findOne = jest.fn(async () => undefined);

      const categoryManager = new CategoryManager(categoryRepository);

      try {
        await categoryManager.getCategoryById(1);
      } catch(err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
      }
    });

    test("should return category for the provided id", async () => {

      const categoryRepository = new CategoryRepository();
      const category =  new Category();
      category.id = 1;
      category.name = "name";

      categoryRepository.findOne = jest.fn(async () => category);

      const categoryManager = new CategoryManager(categoryRepository);
      const resultCategory = await categoryManager.getCategoryById(category.id);

      expect(resultCategory).toEqual(category);
    });
  });

  describe("getCategoryList()", () => {
    test("should return list of categories", async () => {

      const category = new Category();
      category.id = 1;
      category.name = "category name";

      const categoryList = [ [category], 1 ];

      const categoryRepository = new CategoryRepository();
      categoryRepository.getCategories = jest.fn().mockReturnValue(categoryList);

      const paginationDto: IPaginationDTO = {
        size: 1,
        offset: 0,
        orderBy: "id",
        orderDirection: ORDER_DIRECTION_ENUM.DESC
      };

      const categoryManager = new CategoryManager(categoryRepository);
      const result = await categoryManager.getCategoryList(paginationDto);

      expect(result).toEqual(categoryList);
    });
  });

  describe("addCategory()", () => {
    test("should throw CategoryAlreadyExistsError", async () => {

      const category = new Category();
      category.name = "category name";

      const categoryRepository = new CategoryRepository();
      categoryRepository.getCategoryByName = jest.fn().mockReturnValue(category);

      const categoryManager = new CategoryManager(categoryRepository);

      const categoryDto: ICategoryDTO = {
        name: category.name
      };

      try {
        await categoryManager.addCategory(categoryDto);
      } catch(err) {
        expect(err).toBeInstanceOf(CategoryAlreadyExistsError);
      }
    });

    test("should return created category", async () => {

      const category = new Category();
      category.name = "category name";

      const categoryRepository = new CategoryRepository();
      categoryRepository.getCategoryByName = jest.fn().mockReturnValue(undefined);
      categoryRepository.create = jest.fn().mockReturnValue(category);
      categoryRepository.save = jest.fn().mockImplementation((category: Category) => {
        category.id = 1;
        return category;
      });

      const categoryManager = new CategoryManager(categoryRepository);

      const categoryDto: ICategoryDTO = {
        name: category.name
      };

      const result = await categoryManager.addCategory(categoryDto);

      expect(result.name).toEqual(category.name);
      expect(result.id).toEqual(1);
    });
  });

  describe("updateCategoryName()", () => {
    test("should throw CategoryNotFoundError", async () => {

      const categoryRepository = new CategoryRepository();
      categoryRepository.findOne = jest.fn().mockReturnValue(undefined);

      const categoryManager = new CategoryManager(categoryRepository);

      const categoryDto: ICategoryDTO = {
        name: "category name"
      };

      try {
        await categoryManager.updateCategoryName(categoryDto);
      } catch(err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
      }
    });

    test("should modify existing category", async () => {

      const category = new Category();
      category.id = 1;
      category.name = "category name";

      const categoryRepository = new CategoryRepository();
      categoryRepository.findOne = jest.fn().mockReturnValue(category);
      categoryRepository.save = jest.fn().mockImplementation((category: Category) => category);
      categoryRepository.merge = jest.fn().mockImplementation((category: Category, categoryPartial: Partial<Category>) => {
        category.name = categoryPartial.name;
        return category;
      });

      const categoryManager = new CategoryManager(categoryRepository);

      const categoryDto: ICategoryDTO = {
        id: 1,
        name: " new category name"
      };

      const result = await categoryManager.updateCategoryName(categoryDto);

      expect(result).toEqual(category);
      expect(category.name).toEqual(categoryDto.name);
    });
  });

  describe("deleteCategoryById()", () => {
    test("should throw CategoryNotFoundError", async () => {

      const categoryRepository = new CategoryRepository();
      categoryRepository.findOne = jest.fn().mockReturnValue(undefined);

      const categoryManager = new CategoryManager(categoryRepository);

      try {
        await categoryManager.deleteCategoryById(1);
      } catch(err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
      }
    });

    test("should delete category with given id", async () => {

      const category = new Category();
      category.id = 1;

      let categories = [ category ];

      const categoryRepository = new CategoryRepository();
      categoryRepository.findOne = jest.fn().mockReturnValue(category);
      categoryRepository.save = jest.fn().mockReturnValue(category);
      categoryRepository.delete = jest.fn().mockImplementation(({id}) => {
        categories = categories.filter(c => c.id !== id);
      });

      const categoryManager = new CategoryManager(categoryRepository);

      await categoryManager.deleteCategoryById(category.id);

      expect(categories.length).toBe(0);
    });
  });
});