import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import {
  ICreateTicketBackAndForth,
  TicketBackAndForth,
} from "../entity/TicketBackAndForth";
import { Tickets } from "../entity/Tickets";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";

@Resolver()
export class TicketBackAndForthResolver {
  @Query(() => [TicketBackAndForth])
  async getAllTicketBackAndForth(): Promise<TicketBackAndForth[]> {
    return await TicketBackAndForth.find();
  }

  @Query(() => TicketBackAndForth)
  async getTicketBackAndForthById(
    @Arg("options") options: IGetByID
  ): Promise<TicketBackAndForth> {
    return await TicketBackAndForth.findOneOrFail({
      where: { _id: options.id },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateLawCategory(
    @Arg("options") options: ICreateTicketBackAndForth,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const {
        _id,
        isActive,
        file,
        isEdited,
        isLastReopened,
        isLastResolved,
        isNexonCompany,
        isNextOnCustomer,
        isNextOnMiddleMan,
        isRunningOnCustomer,
        isRunningOnMiddleMan,
        isRunnningOnCompany,
        questionReply,
        ticket,
      } = options;

      if (_id) {
        const findEmailCredential = await TicketBackAndForth.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.file = file;
        findEmailCredential.isEdited = isEdited;
        findEmailCredential.isLastReopened = isLastReopened;
        findEmailCredential.isLastResolved = isLastResolved;
        findEmailCredential.isNexonCompany = isNexonCompany;
        findEmailCredential.isNextOnCustomer = isNextOnCustomer;
        findEmailCredential.isRunningOnMiddleMan = isRunningOnMiddleMan;
        findEmailCredential.isNextOnMiddleMan = isNextOnMiddleMan;
        findEmailCredential.isRunnningOnCompany = isRunnningOnCompany;
        findEmailCredential.isRunningOnCustomer = isRunningOnCustomer;
        findEmailCredential.ticket = await Tickets.findOneOrFail({
          where: { _id: ticket },
        });
        findEmailCredential.questionReply = questionReply;
        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new TicketBackAndForth();

        findEmailCredential.file = file;
        findEmailCredential.isEdited = isEdited;
        findEmailCredential.isLastReopened = isLastReopened;
        findEmailCredential.isLastResolved = isLastResolved;
        findEmailCredential.isNexonCompany = isNexonCompany;
        findEmailCredential.isNextOnCustomer = isNextOnCustomer;
        findEmailCredential.isRunningOnMiddleMan = isRunningOnMiddleMan;
        findEmailCredential.isNextOnMiddleMan = isNextOnMiddleMan;
        findEmailCredential.isRunnningOnCompany = isRunnningOnCompany;
        findEmailCredential.isRunningOnCustomer = isRunningOnCustomer;
        findEmailCredential.ticket = await Tickets.findOneOrFail({
          where: { _id: ticket },
        });
        findEmailCredential.questionReply = questionReply;
        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated law update category",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating law update category",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteTicketBackAndForth(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await TicketBackAndForth.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      findEmailCredential.save();
      findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted law update category",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting law update category",
        data: "",
      };
    }
  }
}
