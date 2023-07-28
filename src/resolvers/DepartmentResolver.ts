import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Department, ICreateDepartment } from "../entity/Department";
import {
  DepartmentQuestions,
  ICreateDepartmentQuestions,
} from "../entity/DepartmentQuestion";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";

@Resolver()
export class DepartmentResolver {
  // Department

  @Query(() => [Department])
  async getAllDepartment(): Promise<Department[]> {
    return await Department.find();
  }

  @Query(() => Department)
  async getDepartmentById(
    @Arg("options") options: IGetByID
  ): Promise<Department> {
    return await Department.findOneOrFail({
      where: { _id: options.id },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateDepartment(
    @Arg("options") options: ICreateDepartment,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { _id, isActive, name } = options;

      if (_id) {
        const findEmailCredential = await Department.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.name = name;
        findEmailCredential.isActive = isActive;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new Department();

        findEmailCredential.name = name;
        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated department",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating department",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteDepartment(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await Department.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      findEmailCredential.save();
      findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted department",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting department",
        data: "",
      };
    }
  }

  // Department

  @Query(() => [DepartmentQuestions])
  async getAllDepartmentQuestions(): Promise<DepartmentQuestions[]> {
    return await DepartmentQuestions.find({
      relations: { department: true },
    });
  }

  @Query(() => DepartmentQuestions)
  async getDepartmentQuestionsById(
    @Arg("options") options: IGetByID
  ): Promise<DepartmentQuestions> {
    return await DepartmentQuestions.findOneOrFail({
      where: { _id: options.id },
      relations: { department: true },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateDepartmentQuestions(
    @Arg("options") options: ICreateDepartmentQuestions,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { _id, isActive, name, department } = options;

      if (_id) {
        const findEmailCredential = await DepartmentQuestions.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.name = name;
        findEmailCredential.department = await Department.findOneOrFail({
          where: { _id: department },
        });
        findEmailCredential.isActive = isActive;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new DepartmentQuestions();

        findEmailCredential.name = name;
        findEmailCredential.department = await Department.findOneOrFail({
          where: { _id: department },
        });
        findEmailCredential.isActive = isActive;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated department question",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating department question",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteDepartmentQuestions(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await DepartmentQuestions.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      findEmailCredential.save();
      findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted department question",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting department question",
        data: "",
      };
    }
  }
}
