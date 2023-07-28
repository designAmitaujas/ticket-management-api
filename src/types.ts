import { Request, Response } from "polka";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./entity/User";

@ObjectType()
export class IStatusResponse {
  @Field()
  success!: boolean;

  @Field()
  msg!: string;

  @Field()
  data!: string;
}

@InputType()
export class IGetByID {
  @Field()
  id!: string;
}

export interface MyContext {
  req: Request;
  res: Response;
  user: User;
}
