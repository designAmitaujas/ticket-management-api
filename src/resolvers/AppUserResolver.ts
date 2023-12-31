import _ from "lodash";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Department } from "../entity/Department";
import { ICreateUser, User } from "../entity/User";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";
import { encryptedString, isEncryptedString } from "../utils/hash";

@Resolver()
export class AppUserResolver {
  // User

  @Query(() => [User])
  async getAllUser(): Promise<User[]> {
    return await User.find({
      relations: { assignedDepartment: true },
    });
  }

  @Query(() => User)
  async getUserById(@Arg("options") options: IGetByID): Promise<User> {
    return await User.findOneOrFail({
      where: { _id: options.id },
      relations: { assignedDepartment: true },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateUser(
    @Arg("options") options: ICreateUser,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const {
        _id,
        isActive,
        name,
        assignedDepartment,
        email,
        hash,
        isAdmin,
        isCompany,
        isCustomer,
        isMiddleMan,
        isSuperAdmin,
        isManaging,
      } = options;

      const findUser = await User.findOne({
        where: { email: _.toLower(email) },
      });

      if (findUser && !_id) {
        return {
          success: false,
          msg: "user exist using this email",
          data: "",
        };
      }

      if (_id) {
        const findEmailCredential = await User.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.name = name;
        findEmailCredential.assignedDepartment = await Department.findOne({
          where: { _id: assignedDepartment },
        });
        findEmailCredential.email = _.toLower(email);
        findEmailCredential.hash = isEncryptedString(hash)
          ? hash
          : encryptedString(hash);
        findEmailCredential.isAdmin = isAdmin;
        findEmailCredential.isCompany = isCompany;
        findEmailCredential.isCustomer = isCustomer;
        findEmailCredential.isManaging = isManaging;
        findEmailCredential.isMiddleMan = isMiddleMan;
        findEmailCredential.isSuperAdmin = isSuperAdmin;
        findEmailCredential.isActive = isActive;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new User();

        findEmailCredential.name = name;
        findEmailCredential.assignedDepartment = await Department.findOne({
          where: { _id: assignedDepartment },
        });
        findEmailCredential.email = _.toLower(email);
        findEmailCredential.hash = encryptedString(hash);
        findEmailCredential.isAdmin = isAdmin;
        findEmailCredential.isCompany = isCompany;
        findEmailCredential.isCustomer = isCustomer;
        findEmailCredential.isManaging = isManaging;
        findEmailCredential.isMiddleMan = isMiddleMan;
        findEmailCredential.isSuperAdmin = isSuperAdmin;

        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated user",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating user",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteUser(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await User.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      findEmailCredential.save();
      findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted user",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting user",
        data: "",
      };
    }
  }
}
