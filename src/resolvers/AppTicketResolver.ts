import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { IsNull, Not } from "typeorm";
import { Department } from "../entity/Department";
import { DepartmentQuestions } from "../entity/DepartmentQuestion";
import { ICreateTickets, Tickets } from "../entity/Tickets";
import { User } from "../entity/User";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";

@Resolver()
export class AppTicketResolver {
  // law update category

  @Query(() => [Tickets])
  async getAllTickets(): Promise<Tickets[]> {
    return await Tickets.find({
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
    });
  }

  @Query(() => [Tickets])
  @UseMiddleware([isUser])
  async getMyTicketByUser(@Ctx() { user }: MyContext): Promise<Tickets[]> {
    return await Tickets.find({
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
      where: { assignedCustomer: { _id: user._id } },
    });
  }

  @Query(() => [Tickets])
  @UseMiddleware([isUser])
  async getMyTicketByMiddleMan(@Ctx() { user }: MyContext): Promise<Tickets[]> {
    return await Tickets.find({
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
      where: { assignedMiddleMan: { _id: user._id } },
    });
  }

  @Query(() => [Tickets])
  @UseMiddleware([isUser])
  async getMyTicketByCompany(@Ctx() { user }: MyContext): Promise<Tickets[]> {
    return await Tickets.find({
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
      where: { assignedCompany: { _id: user._id } },
    });
  }

  @Query(() => [Tickets])
  @UseMiddleware([isUser])
  async getAllAcceptAcceptByMiddleMan(
    @Ctx() { user }: MyContext
  ): Promise<Tickets[]> {
    return await Tickets.find({
      where: {
        department: { _id: user.assignedDepartment?._id || "" },
        assignedMiddleMan: IsNull(),
      },
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
    });
  }

  @Query(() => [Tickets])
  @UseMiddleware([isUser])
  async getAllAcceptAcceptByCompany(
    @Ctx() { user }: MyContext
  ): Promise<Tickets[]> {
    return await Tickets.find({
      where: {
        department: { _id: user.assignedDepartment?._id || "" },
        assignedMiddleMan: Not(IsNull()),
        assignedCompany: IsNull(),
        canCompanyAccept: true,
      },

      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async acceptTiketByMiddleMan(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const findTicket = await Tickets.findOneOrFail({
        where: {
          _id: options.id,
          department: { _id: user.assignedDepartment?._id || "" },
          assignedMiddleMan: IsNull(),
        },
      });

      findTicket.assignedMiddleMan = user;
      findTicket.updatedBy = user;
      await findTicket.save();

      return { data: "", msg: "ticket accepted successfully", success: true };
    } catch (err) {}
    return { data: "", msg: "trouble assigning tasks", success: false };
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async acceptTiketByCompany(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const findTicket = await Tickets.findOneOrFail({
        where: {
          _id: options.id,
          department: { _id: user.assignedDepartment?._id || "" },
          assignedCompany: IsNull(),
        },
      });

      findTicket.assignedCompany = user;
      findTicket.updatedBy = user;
      await findTicket.save();

      return { data: "", msg: "ticket accepted successfully", success: true };
    } catch (err) {}
    return { data: "", msg: "trouble assigning tasks", success: false };
  }

  @Query(() => Tickets)
  async getTicketsById(@Arg("options") options: IGetByID): Promise<Tickets> {
    return await Tickets.findOneOrFail({
      where: { _id: options.id },
      relations: {
        assignedCompany: true,
        assignedCustomer: true,
        assignedMiddleMan: true,
        department: true,
        departmentQuestion: true,
      },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateTickets(
    @Arg("options") options: ICreateTickets,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const {
        _id,
        isActive,
        assignedCompany,
        assignedCustomer,
        assignedMiddleMan,
        department,
        departmentQuestion,
        description,
        file,
        isResolved,
        question,
        mobile,
      } = options;

      if (_id) {
        const findEmailCredential = await Tickets.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.assignedCompany = await User.findOne({
          where: { _id: assignedCompany },
        });
        findEmailCredential.assignedCustomer = await User.findOne({
          where: { _id: assignedCustomer },
        });
        findEmailCredential.assignedMiddleMan = await User.findOne({
          where: { _id: assignedMiddleMan },
        });
        findEmailCredential.department = await Department.findOneOrFail({
          where: { _id: department },
        });
        findEmailCredential.departmentQuestion =
          await DepartmentQuestions.findOneOrFail({
            where: { _id: departmentQuestion },
          });
        findEmailCredential.description = description;
        findEmailCredential.mobile = mobile;
        findEmailCredential.file = file;
        findEmailCredential.isResolved = isResolved;
        findEmailCredential.question = question;
        findEmailCredential.isActive = isActive;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new Tickets();

        findEmailCredential.assignedCompany = await User.findOne({
          where: { _id: assignedCompany },
        });
        findEmailCredential.assignedCustomer = await User.findOne({
          where: { _id: assignedCustomer },
        });
        findEmailCredential.assignedMiddleMan = await User.findOne({
          where: { _id: assignedMiddleMan },
        });
        findEmailCredential.department = await Department.findOneOrFail({
          where: { _id: department },
        });
        findEmailCredential.departmentQuestion =
          await DepartmentQuestions.findOneOrFail({
            where: { _id: departmentQuestion },
          });
        findEmailCredential.mobile = mobile;
        findEmailCredential.description = description;
        findEmailCredential.file = file;
        findEmailCredential.isResolved = isResolved;
        findEmailCredential.question = question;
        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated ticket",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating ticket",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteTickets(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await Tickets.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      findEmailCredential.save();
      findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted ticket",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting ticket",
        data: "",
      };
    }
  }
}
