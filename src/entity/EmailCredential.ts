import { nanoid } from "nanoid";
import { Field, InputType, Int, ObjectType } from "type-graphql";
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
import { User } from "./User";

@InputType()
export class ICreateEmailCredential {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  host!: string;

  @Field(() => Int)
  port!: number;

  @Field()
  secure!: boolean;

  @Field()
  authUser!: string;

  @Field()
  authPassword!: string;

  @Field()
  isActive!: boolean;

  @Field()
  name!: string;
}

@Entity()
@ObjectType()
export class EmailCredential extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  host!: string;

  @Field()
  @Column()
  port!: number;

  @Field()
  @Column({ default: false })
  secure!: boolean;

  @Field()
  @Column()
  authUser!: string;

  @Field()
  @Column()
  authPassword!: string;

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
