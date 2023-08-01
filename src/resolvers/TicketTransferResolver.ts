import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Tickets } from "../entity/Tickets";
import {
  ICreateTransfetHistory,
  TransfetHistory,
} from "../entity/TransferHistory";
import { User } from "../entity/User";
import { isUser } from "../middleware";
import { IStatusResponse, MyContext } from "../types";

@Resolver()
export class TicketTransferResolver {
  @Query(() => [User])
  @UseMiddleware([isUser])
  async getAllTransferUser(@Ctx() { user }: MyContext): Promise<User[]> {
    return await User.find({
      where: {
        assignedDepartment: { _id: user.assignedDepartment?._id },
        isCompany: user.isCompany,
        isMiddleMan: user.isMiddleMan,
        isActive: true,
      },
      relations: {
        assignedDepartment: true,
      },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async transferTicket(
    @Arg("options") options: ICreateTransfetHistory,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    const { ticket, transferdUser, reason } = options;

    const findTicker = await Tickets.findOneOrFail({ where: { _id: ticket } });
    const findOtherUser = await User.findOneOrFail({
      where: { _id: transferdUser },
    });

    if (user.isCompany) {
      findTicker.assignedCompany = findOtherUser;
    }

    if (user.isMiddleMan) {
      findTicker.assignedMiddleMan = findOtherUser;
    }

    findTicker.updatedBy = user;

    const newTicketTransfer = new TransfetHistory();
    newTicketTransfer.ticket = findTicker;
    newTicketTransfer.reason = reason;
    newTicketTransfer.currentUsesr = user;
    newTicketTransfer.transferdUser = findOtherUser;
    newTicketTransfer.createdBy = user;
    newTicketTransfer.updatedBy = user;

    await Promise.all([newTicketTransfer.save(), findTicker.save()]);

    return { success: true, msg: "ticket transferd successfully", data: "" };
  }
}
