import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../categories/models/category.entity";

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 121})
  title: string;

  @Column({type: 'text'})
  description: string;

  @Column({type: 'varchar', length: 121})
  slug: string;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @Column({type: 'timestamp', nullable: true})
  deletedAt: Date;

  @ManyToMany(() => Category, category => category.posts, {
    cascade: true
  })
  @JoinTable()
  categories: Category[];
}