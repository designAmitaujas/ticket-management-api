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
export class ICreateTransfetHistory {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  ticket!: string;

  @Field()
  transferdUser!: string;
}

@Entity()
@ObjectType()
export class TransfetHistory extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @ManyToOne((type) => Tickets, { nullable: true })
  ticket!: Tickets;

  @Field()
  @ManyToOne((type) => User, { nullable: true })
  currentUsesr!: User;

  @Field()
  @ManyToOne((type) => User, { nullable: true })
  transferdUser!: User;

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
