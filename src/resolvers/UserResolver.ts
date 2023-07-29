import _ from "lodash";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { isUser } from "../middleware";
import { IStatusResponse, MyContext } from "../types";
import { encryptedString, isPasswordValid } from "../utils/hash";
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

  @Field(() => User, { nullable: true })
  user?: User | null;
}

@InputType()
export class IAuthInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class IChangePassword {
  @Field()
  oldPassword!: string;

  @Field()
  newPassword!: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => IAuthResoverResponse)
  async authResolver(
    @Arg("options") options: IAuthInput
  ): Promise<IAuthResoverResponse> {
    const { email, password } = options;

    const findUser = await User.findOne({
      where: { email: _.toLower(email), isActive: true },
    });

    if (!findUser) {
      return {
        success: false,
        email: "",
        jwt: "",
        msg: "cannot find the user",
        name: "",
        user: null,
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
        user: findUser,
      };
    } else {
      return {
        success: false,
        email: "",
        jwt: "",
        msg: "can not authenticate the user",
        name: "",
        user: null,
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async changePassword(
    @Arg("options") options: IChangePassword,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { newPassword, oldPassword } = options;

      const findUser = await User.findOneOrFail({
        where: { _id: user._id, isActive: true },
      });

      if (!findUser) {
        return {
          success: false,
          msg: "can not find user",
          data: "",
        };
      }

      if (isPasswordValid(oldPassword, findUser.hash)) {
        findUser.hash = encryptedString(newPassword);
        findUser.updatedBy = user;

        await findUser.save();

        return {
          success: true,
          msg: "password updated successfully",
          data: "",
        };
      } else {
        return {
          success: false,
          msg: "password did not match",
          data: "",
        };
      }
    } catch (err) {
      return {
        success: false,
        msg: "trouble updating user user",
        data: "",
      };
    }
  }
}
