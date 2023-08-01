import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ClosedReason, ICreateClosedReason } from "../entity/ClosedReson";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";

@Resolver()
export class ClosedReasonResolver {
  // Closed Reason

  @Query(() => [ClosedReason])
  async getAllClosedReason(): Promise<ClosedReason[]> {
    return await ClosedReason.find();
  }

  @Query(() => ClosedReason)
  async getClosedReasonById(
    @Arg("options") options: IGetByID
  ): Promise<ClosedReason> {
    return await ClosedReason.findOneOrFail({
      where: { _id: options.id },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateClosedReason(
    @Arg("options") options: ICreateClosedReason,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { _id, isActive, name } = options;

      if (_id) {
        const findEmailCredential = await ClosedReason.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.name = name;
        findEmailCredential.isActive = isActive;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new ClosedReason();

        findEmailCredential.name = name;
        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated closed reason",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating closed reason",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteClosedReason(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await ClosedReason.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      findEmailCredential.save();
      findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted closed reason",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting closed reason",
        data: "",
      };
    }
  }
}
