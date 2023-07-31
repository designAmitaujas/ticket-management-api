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
import { Tickets } from "./Tickets";
import { User } from "./User";

@InputType()
export class ICreateTicketBackAndForth {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  ticket!: string;

  @Field()
  questionReply!: string;

  @Field()
  file!: string;

  @Field()
  isRunningOnCustomer!: boolean;

  @Field()
  isRunningOnMiddleMan!: boolean;

  @Field()
  isRunnningOnCompany!: boolean;

  @Field()
  isNextOnCustomer!: boolean;

  @Field()
  isNextOnMiddleMan!: boolean;

  @Field()
  isNexonCompany!: boolean;

  @Field()
  isLastResolved!: boolean;

  @Field()
  isLastReopened!: boolean;

  @Field()
  isEdited!: boolean;

  @Field()
  isActive!: boolean;
}

@Entity()
@ObjectType()
export class TicketBackAndForth extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field(() => Tickets, { nullable: true })
  @ManyToOne((type) => Tickets, { nullable: true })
  ticket!: Tickets;

  @Field()
  @Column()
  questionReply!: string;

  @Field()
  @Column()
  file!: string;

  @Field()
  @Column({ default: false })
  isRunningOnCustomer!: boolean;

  @Field()
  @Column({ default: false })
  isRunningOnMiddleMan!: boolean;

  @Field()
  @Column({ default: false })
  isRunnningOnCompany!: boolean;

  @Field()
  @Column({ default: false })
  isNextOnCustomer!: boolean;

  @Field()
  @Column({ default: false })
  isNextOnMiddleMan!: boolean;

  @Field()
  @Column({ default: false })
  isNexonCompany!: boolean;

  @Field()
  @Column({ default: false })
  isLastResolved!: boolean;

  @Field()
  @Column({ default: false })
  isLastReopened!: boolean;

  @Field()
  @Column({ default: false })
  isEdited!: boolean;

  @Field()
  @Column({ default: false })
  isActive!: boolean;

  @Field(() => User, { nullable: true })
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
