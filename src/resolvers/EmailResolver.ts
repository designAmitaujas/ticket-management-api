import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  EmailCredential,
  ICreateEmailCredential,
} from "../entity/EmailCredential";
import { EmailTemplate, ICreateEmailTemplate } from "../entity/EmailTemplate";
import { isUser } from "../middleware";
import { IGetByID, IStatusResponse, MyContext } from "../types";

@Resolver()
export class EmailResolver {
  // email credentials

  @Query(() => [EmailCredential])
  async getAllEmailCredentials(): Promise<EmailCredential[]> {
    return await EmailCredential.find();
  }

  @Query(() => EmailCredential)
  async getEmailCredentialsById(
    @Arg("options") options: IGetByID
  ): Promise<EmailCredential> {
    return await EmailCredential.findOneOrFail({ where: { _id: options.id } });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateEmailCredential(
    @Arg("options") options: ICreateEmailCredential,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const {
        authPassword,
        authUser,
        host,
        isActive,
        port,
        secure,
        _id,
        name,
      } = options;

      if (_id) {
        const findEmailCredential = await EmailCredential.findOneOrFail({
          where: { _id: _id },
        });

        findEmailCredential.name = name;
        findEmailCredential.authPassword = authPassword;
        findEmailCredential.authUser = authUser;
        findEmailCredential.host = host;
        findEmailCredential.isActive = isActive;
        findEmailCredential.port = port;
        findEmailCredential.secure = secure;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      } else {
        const findEmailCredential = new EmailCredential();

        findEmailCredential.name = name;
        findEmailCredential.authPassword = authPassword;
        findEmailCredential.authUser = authUser;
        findEmailCredential.host = host;
        findEmailCredential.isActive = isActive;
        findEmailCredential.port = port;
        findEmailCredential.secure = secure;
        findEmailCredential.createdBy = user;
        findEmailCredential.updatedBy = user;
        await findEmailCredential.save();
      }

      return {
        success: true,
        msg: "successfully created or updated email credential",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating email credential",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteEmailCredential(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await EmailCredential.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      await findEmailCredential.save();
      await findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted email credential",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting email credential",
        data: "",
      };
    }
  }

  // email templates

  @Query(() => [EmailTemplate])
  async getAllEmailTemplate(): Promise<EmailTemplate[]> {
    return await EmailTemplate.find({ relations: { emailCredentials: true } });
  }

  @Query(() => EmailTemplate)
  async getEmailTemplateById(
    @Arg("options") options: IGetByID
  ): Promise<EmailTemplate> {
    return await EmailTemplate.findOneOrFail({
      where: { _id: options.id },
      relations: { emailCredentials: true },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async createOrUpdateEmailTemplate(
    @Arg("options") options: ICreateEmailTemplate,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { _id, customId, emailCredentials, html, isActive, name } = options;

      if (_id) {
        const findEmailTemplate = await EmailTemplate.findOneOrFail({
          where: { _id: _id },
        });

        findEmailTemplate.name = name;
        findEmailTemplate.html = html;
        findEmailTemplate.isActive = isActive;
        findEmailTemplate.customId = customId;
        findEmailTemplate.emailCredentials =
          await EmailCredential.findOneOrFail({
            where: { _id: emailCredentials },
          });
        findEmailTemplate.updatedBy = user;
        await findEmailTemplate.save();
      } else {
        const findEmailTemplate = new EmailTemplate();

        findEmailTemplate.name = name;
        findEmailTemplate.html = html;
        findEmailTemplate.isActive = isActive;
        findEmailTemplate.customId = customId;
        findEmailTemplate.emailCredentials =
          await EmailCredential.findOneOrFail({
            where: { _id: emailCredentials },
          });
        findEmailTemplate.createdBy = user;
        findEmailTemplate.updatedBy = user;
        await findEmailTemplate.save();
      }

      return {
        success: true,
        msg: "successfully created or updated email template",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble creating or updating email template",
        data: "",
      };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isUser])
  async deleteEmailTemplate(
    @Arg("options") options: IGetByID,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { id } = options;

      const findEmailCredential = await EmailTemplate.findOneOrFail({
        where: { _id: id },
      });
      findEmailCredential.updatedBy = user;
      await findEmailCredential.save();
      await findEmailCredential.softRemove();

      return {
        success: true,
        msg: "successfully deleted email template",
        data: "",
      };
    } catch (err) {
      return {
        success: false,
        msg: "trouble deleting email template",
        data: "",
      };
    }
  }
}
