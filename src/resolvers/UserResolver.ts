import _ from "lodash";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";
import { isPasswordValid } from "../utils/hash";
import { signJwt } from "../utils/jwt";

@ObjectType()
export class IAuthResoverResponse {
  @Field()
  success!: boolean;

  @Field()
  msg!: string;

  @Field()
  jwt!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}

@InputType()
export class IAuthInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => IAuthResoverResponse)
  async authResolver(
    @Arg("options") options: IAuthInput
  ): Promise<IAuthResoverResponse> {
    const { email, password } = options;

    const findUser = await User.findOne({
      where: { email: _.toLower(email), isActive: true, isAdmin: true },
    });

    if (!findUser) {
      return {
        success: false,
        email: "",
        jwt: "",
        msg: "cannot find the user",
        name: "",
      };
    }

    if (isPasswordValid(password, findUser.hash)) {
      return {
        success: true,
        email: email,
        jwt: signJwt({
          id: findUser._id,
          isAdmin: findUser.isAdmin,
          isSuperAdmin: findUser.isSuperAdmin,
        }),
        msg: "user authenticated successfully.",
        name: findUser.name,
      };
    } else {
      return {
        success: false,
        email: "",
        jwt: "",
        msg: "can not authenticate the user",
        name: "",
      };
    }
  }
}
