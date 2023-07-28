import { nanoid } from "nanoid";
import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Department } from "./Department";
import { User } from "./User";

@InputType()
export class ICreateDepartmentQuestions {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name!: string;

  @Field()
  department!: string;

  @Field()
  isActive!: boolean;
}

@Entity()
@ObjectType()
export class DepartmentQuestions extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @Column()
  name!: string;

  @Field(() => Department, { nullable: true })
  @ManyToOne((type) => Department, { nullable: true })
  department!: Department;

  @Field()
  @Column({ default: false })
  isActive!: boolean;

  @ManyToOne((type) => User, { nullable: true })
  createdBy!: User;

  @ManyToOne((type) => User, { nullable: true })
  updatedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @BeforeInsert()
  setId() {
    this._id = nanoid(8);
  }
}
