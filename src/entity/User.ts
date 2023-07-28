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

@InputType()
export class ICreateUser {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field()
  password!: string;

  @Field()
  isAdmin!: boolean;

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
