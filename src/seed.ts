import _ from "lodash";
import { map } from "modern-async";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASS, CMS_DATA } from "./constant";
import { CMS } from "./entity/Cms";
import { User } from "./entity/User";
import { encryptedString } from "./utils/hash";

const seedCMS = async () => {
  await map(CMS_DATA, async (item) => {
    try {
      const findItem = await CMS.findOne({ where: { custId: item.custId } });

      if (findItem) {
        findItem.html = item.html;
        await findItem.save();
      } else {
        const newItem = new CMS();
        newItem.name = item.name;
        newItem.html = item.html;
        newItem.custId = item.custId;
        newItem.isActive = true;

        await newItem.save();
      }
    } catch (err) {}
  });
};

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
