import moment from "moment";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
  registerEnumType,
} from "type-graphql";
import { ClosedReason } from "../entity/ClosedReson";
import {
  ICreateTicketBackAndForth,
  TicketBackAndForth,
} from "../entity/TicketBackAndForth";
import { Tickets } from "../entity/Tickets";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";
import { sendEmail } from "../utils/emails";

enum Direction {
  USER = "USER",
  MIDDLE = "MIDDLE",
  COMPANY = "COMPANY",
  NULL = "NULL",
}

registerEnumType(Direction, { name: "Direction" });

@ObjectType()
export class CutomTicketResponse {
  @Field(() => Tickets)
  ticket!: Tickets;

  @Field(() => [TicketBackAndForth])
  ticketBackAndForth!: TicketBackAndForth[];
}

@InputType()
export class IAddTicketBackAndForth {
  @Field()
  questionReply!: string;

  @Field()
  file!: string;

  @Field(() => Direction)
  nextChooice!: Direction;

  @Field()
  ticketId!: string;

  @Field()
  canCompanyAccept!: boolean;
}

@ObjectType()
export class ICountResponse {
  @Field()
  totalTiketCount!: number;

  @Field()
  totalRunningCount!: number;

  @Field()
  totalClosedCount!: number;
}

@InputType()
export class ICloseInput {
  @Field()
  ticket!: string;

  @Field()
  reason!: string;
}

@Resolver()
export class TicketBackAndForthResolver {
  @Query(() => [TicketBackAndForth])
  async getAllTicketBackAndForth(): Promise<TicketBackAndForth[]> {
    return await TicketBackAndForth.find({ relations: { ticket: true } });
  }

  @Query(() => ICountResponse)
  @UseMiddleware([isUser])
  async getTicketCount(@Ctx() { user }: MyContext): Promise<ICountResponse> {
    if (user.isCustomer) {
      const [d1, d2, d3] = await Promise.all([
        Tickets.find({
          where: { createdBy: { _id: user._id } },
        }),

        Tickets.find({
          where: { isResolved: true, createdBy: { _id: user._id } },
        }),

        Tickets.find({
          where: { isResolved: false, createdBy: { _id: user._id } },
        }),
      ]);

      return {
        totalTiketCount: d1.length,
        totalRunningCount: d3.length,
        totalClosedCount: d2.length,
      };
    }

    if (user.isMiddleMan) {
      const d1 = await Tickets.find({
        where: { assignedMiddleMan: { _id: user._id } },
      });
      const d2 = await Tickets.find({
        where: { isResolved: true, assignedMiddleMan: { _id: user._id } },
      });
      const d3 = await Tickets.find({
        where: { isResolved: false, assignedMiddleMan: { _id: user._id } },
      });

      return {
        totalTiketCount: d1.length,
        totalRunningCount: d3.length,
        totalClosedCount: d2.length,
      };
    }

    if (user.isCompany) {
      const d1 = await Tickets.find({
        where: { assignedCompany: { _id: user._id } },
      });
      const d2 = await Tickets.find({
        where: { isResolved: true, assignedCompany: { _id: user._id } },
      });
      const d3 = await Tickets.find({
        where: { isResolved: false, assignedCompany: { _id: user._id } },
      });

      return {
        totalTiketCount: d1.length,
        totalRunningCount: d3.length,
        totalClosedCount: d2.length,
      };
    }

    const d1 = await Tickets.find();
    const d2 = await Tickets.find({
      where: { isResolved: true },
    });
    const d3 = await Tickets.find({
      where: { isResolved: false },
    });

    return {
      totalTiketCount: d1.length,
      totalRunningCount: d3.length,
      totalClosedCount: d2.length,
    };
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async getTickerClosedById(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    const findTicket = await Tickets.findOneOrFail({
      where: { _id: options.id },
    });

    findTicket.isResolved = !findTicket.isResolved;
    findTicket.updatedBy = user;
    await findTicket.save();

    const findV2 = await Tickets.findOneOrFail({
      where: { _id: options.id },
    });

    return {
      success: findV2.isResolved,
      data: "",
      msg:
        findV2.isResolved === true
          ? "Ticket Is Closed Successfully"
          : "Ticket Is Opend Successfully",
    };
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async getTickerClosedByMiddleMan(
    @Arg("options") options: ICloseInput,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    const { reason, ticket } = options;

    const findTicket = await Tickets.findOneOrFail({
      where: { _id: ticket },
    });

    findTicket.isResolved = !findTicket.isResolved;
    findTicket.closedReason = await ClosedReason.findOneOrFail({
      where: { _id: reason },
    });
    findTicket.updatedBy = user;
    await findTicket.save();

    const findV2 = await Tickets.findOneOrFail({
      where: { _id: ticket },
    });

    return {
      success: findV2.isResolved,
      data: "",
      msg:
        findV2.isResolved === true
          ? "Ticket Is Closed Successfully"
          : "Ticket Is Opend Successfully",
    };
  }

  @Query(() => TicketBackAndForth)
  async getTicketBackAndForthById(
    @Arg("options") options: IGetByID
  ): Promise<TicketBackAndForth> {
    return await TicketBackAndForth.findOneOrFail({
      where: { _id: options.id },
      relations: { ticket: true },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async AddTicketBackAndForth(
    @Arg("options") options: IAddTicketBackAndForth,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    const { file, nextChooice, questionReply, ticketId, canCompanyAccept } =
      options;

    const findTicket = await Tickets.findOneOrFail({
      where: { _id: ticketId },
    });

    if (canCompanyAccept === true) {
      if (findTicket) {
        findTicket.canCompanyAccept = true;
        await findTicket.save();

        await sendEmail({
          customId: "##SEND_TICKET##",
          from: "design@amitaujas.com",
          to: `${findTicket.assignedCustomer?.email} ${findTicket.assignedMiddleMan?.email} ${findTicket.assignedCompany?.email}`,
          replaceArray: [
            { substr: "##CURRENT_DATE##", to: moment().format("DD/MM/YYYY") },
            {
              substr: "##QUERY_TITLE##",
              to: findTicket.question,
            },
            {
              substr: "##ASSIGN_TEXT##",
              to: "Your query is transferd to Tridot",
            },
            {
              substr: "##CURRENT_YEAR##",
              to: moment().year().toString(),
            },
          ],
          subject: "[Amitaujas LLP] Ticket Update",
        });
      }
    }

    const newTicketBackAndForth = new TicketBackAndForth();

    newTicketBackAndForth.ticket = await Tickets.findOneOrFail({
      where: { _id: ticketId },
    });
    newTicketBackAndForth.questionReply = questionReply;
    newTicketBackAndForth.file = file || "";
    newTicketBackAndForth.isRunningOnCustomer = Direction.USER === nextChooice;
    newTicketBackAndForth.isRunningOnMiddleMan =
      Direction.MIDDLE === nextChooice;
    newTicketBackAndForth.isRunnningOnCompany =
      Direction.COMPANY === nextChooice;

    newTicketBackAndForth.createdBy = user;
    newTicketBackAndForth.updatedBy = user;

    await newTicketBackAndForth.save();

    await sendEmail({
      customId: "##SEND_TICKET##",
      from: "design@amitaujas.com",
      to: `${findTicket.assignedCustomer?.email} ${findTicket.assignedMiddleMan?.email} ${findTicket.assignedCompany?.email}`,
      replaceArray: [
        { substr: "##CURRENT_DATE##", to: moment().format("DD/MM/YYYY") },
        {
          substr: "##QUERY_TITLE##",
          to: findTicket.question,
        },
        {
          substr: "##ASSIGN_TEXT##",
          to: `${user.name} is added replay to your question please check it on your portal`,
        },
        {
          substr: "##CURRENT_YEAR##",
          to: moment().year().toString(),
        },
      ],
      subject: "[Amitaujas LLP] Ticket Update",
    });

    return { success: true, data: "data added successfully", msg: "" };
  }

  @Query(() => CutomTicketResponse)
  async getTicketBackAndForthByTiketId(
    @Arg("options") options: IGetByID
  ): Promise<CutomTicketResponse> {
    const d1 = await Tickets.findOneOrFail({
      where: { _id: options.id },
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
    });

    const d2 = await TicketBackAndForth.find({
      where: { ticket: { _id: options.id } },
      relations: { ticket: true, createdBy: true },
    });

    return {
      ticket: d1,
      ticketBackAndForth: d2,
    };
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
