import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { User } from "../entity/User";
import { NotRegUser } from "../entity/NotRegUser";

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExistNotRegUserConstraint
  implements ValidatorConstraintInterface {
  async validate(email: string) {
    // const user = await User.findOne({ where: { email } });
    const rn_user = await NotRegUser.findOne({ where: { email } });
    // if (user) return false;
    if (rn_user) return false;
    return true;
  }
}

export function isEmailAlreadyExistNotRegUser(
  validationOptions?: ValidationOptions
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyExistNotRegUserConstraint
    });
  };
}
