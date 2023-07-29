import _ from "lodash";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASS } from "./constant";
import { User } from "./entity/User";
import { encryptedString } from "./utils/hash";

export const seedFunction = async () => {
  const isUserExist = await User.findOne({
    where: { email: _.toLower(ADMIN_EMAIL) },
  });

  // await seedCMS();

  if (!isUserExist) {
    const newUser = new User();
    newUser.email = _.toLower(ADMIN_EMAIL);
    newUser.hash = encryptedString(ADMIN_PASS);
    newUser.name = ADMIN_NAME;
    newUser.isAdmin = true;
    newUser.isSuperAdmin = true;
    newUser.isActive = true;
    newUser.createdBy = newUser;
    newUser.updatedBy = newUser;

    await newUser.save();
  }
};
