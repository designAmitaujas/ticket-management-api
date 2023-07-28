import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
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
    return await Tickets.find();
  }

  @Query(() => Tickets)
  async getTicketsById(@Arg("options") options: IGetByID): Promise<Tickets> {
    return await Tickets.findOneOrFail({
      where: { _id: options.id },
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
      } = options;

      if (_id) {
        const findEmailCredential = await Tickets.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.assignedCompany = await User.findOneOrFail({
          where: { _id: assignedCompany },
        });
        findEmailCredential.assignedCustomer = await User.findOneOrFail({
          where: { _id: assignedCustomer },
        });
        findEmailCredential.assignedMiddleMan = await User.findOneOrFail({
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
        findEmailCredential.file = file;
        findEmailCredential.isResolved = isResolved;
        findEmailCredential.question = question;
        findEmailCredential.isActive = isActive;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new Tickets();

        findEmailCredential.assignedCompany = await User.findOneOrFail({
          where: { _id: assignedCompany },
        });
        findEmailCredential.assignedCustomer = await User.findOneOrFail({
          where: { _id: assignedCustomer },
        });
        findEmailCredential.assignedMiddleMan = await User.findOneOrFail({
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
