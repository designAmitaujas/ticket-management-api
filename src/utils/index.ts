import _ from "lodash";
import moment from "moment";
import { lru } from "tiny-lru";

export const cache = lru(1000, 3600000);

export const getUpdateDate = (time: string) =>
  _.toNumber(time) && !_.isNaN(time)
    ? moment(_.toNumber(time)).toDate()
    : moment(time).toDate();

export const getAddDate = (time: string) => moment(time, "YYYY-MM-DD").toDate();

export function generate(n: number): number {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return _.toNumber(("" + number).substring(add));
}
