import { EntityRepository, Repository } from "typeorm";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { Post } from "../models/post.entity";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {

  public async getPosts(paginationDTO: IPaginationDTO) {
    const qb = this.createQueryBuilder('p');
    
    if (paginationDTO.size) {
      qb.take(paginationDTO.size);
    }

    if (paginationDTO.offset) {
      qb.skip(paginationDTO.offset);
    }

    if (paginationDTO.orderBy) {
      qb.orderBy(paginationDTO.orderBy, paginationDTO.orderDirection);
    }

    return qb.leftJoinAndMapMany("p.categories", "p.categories", "categories")
      .orderBy("p.createdAt", "DESC")
      .getManyAndCount();
  }

  public async getPostBySlug(slug: string) {
    return this.findOne({
      where: { slug }
    });
  }
}