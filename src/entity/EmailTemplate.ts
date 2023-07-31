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
import { EmailCredential } from "./EmailCredential";
import { User } from "./User";

@InputType()
export class ICreateEmailTemplate {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  html!: string;

  @Field()
  emailCredentials!: string;

  @Field()
  isActive!: boolean;

  @Field()
  customId!: string;
}

@Entity()
@ObjectType()
export class EmailTemplate extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  html!: string;

  @Field()
  @Column()
  customId!: string;

  @Field(() => EmailCredential, { nullable: true })
  @ManyToOne((type) => EmailCredential, { nullable: true })
  emailCredentials!: EmailCredential;

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
