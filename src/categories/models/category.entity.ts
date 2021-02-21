import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/models/post.entity";

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 30})
  name: string;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false})
  updatedAt: Date;

  @ManyToMany(() => Post, post => post.categories)
  posts: Post[];
}