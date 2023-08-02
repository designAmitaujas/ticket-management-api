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

@InputType()
export class ICreateUser {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  hash!: string;

  @Field()
  isCustomer!: boolean;

  @Field()
  isMiddleMan!: boolean;

  @Field()
  isCompany!: boolean;

  @Field()
  assignedDepartment!: string;

  @Field()
  isAdmin!: boolean;

  @Field()
  isSuperAdmin!: boolean;

  @Field()
  isManaging!: boolean;

  @Field()
  isActive!: boolean;
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  hash!: string;

  @Field()
  @Column({ default: false })
  isCustomer!: boolean;

  @Field()
  @Column({ default: false })
  isMiddleMan!: boolean;

  @Field()
  @Column({ default: false })
  isCompany!: boolean;

  @Field(() => Department, { nullable: true })
  @ManyToOne((type) => Department, { nullable: true })
  assignedDepartment?: Department | null;

  @Field()
  @Column({ default: false })
  isManaging!: boolean;

  @Field()
  @Column({ default: false })
  isAdmin!: boolean;

  @Field()
  @Column({ default: false })
  isSuperAdmin!: boolean;

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
