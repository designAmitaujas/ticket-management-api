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
import { DepartmentQuestions } from "./DepartmentQuestion";
import { User } from "./User";

@InputType()
export class ICreateTickets {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  department!: string;

  @Field()
  departmentQuestion!: string;

  @Field()
  question!: string;

  @Field()
  description!: string;

  @Field()
  mobile!: string;

  @Field()
  file!: string;

  @Field()
  isResolved!: boolean;

  @Field()
  assignedCustomer!: string;

  @Field()
  assignedMiddleMan!: string;

  @Field()
  assignedCompany!: string;

  @Field()
  isActive!: boolean;
}

@Entity()
@ObjectType()
export class Tickets extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field(() => Department, { nullable: true })
  @ManyToOne((type) => Department, { nullable: true })
  department!: Department;

  @Field(() => DepartmentQuestions, { nullable: true })
  @ManyToOne((type) => DepartmentQuestions, { nullable: true })
  departmentQuestion!: DepartmentQuestions;

  @Field()
  @Column()
  question!: string;

  @Field()
  @Column({ default: "" })
  mobile!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  file!: string;

  @Field()
  @Column({ default: false })
  isResolved!: boolean;

  @Field(() => User, { nullable: true })
  @ManyToOne((type) => User, { nullable: true })
  assignedCustomer!: User | null;

  @Field(() => User, { nullable: true })
  @ManyToOne((type) => User, { nullable: true })
  assignedMiddleMan!: User | null;

  @Field(() => User, { nullable: true })
  @ManyToOne((type) => User, { nullable: true })
  assignedCompany!: User | null;

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
