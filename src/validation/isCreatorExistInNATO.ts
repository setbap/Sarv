import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { User } from "../entity/User";
import { NotRegUser } from "../entity/NotRegUser";
import { NotAcceptedTouristOrganization } from "../entity/NotAcceptedTouristOrganization";

@ValidatorConstraint({ async: true })
export class isCreatorExistInNATOConstraint
  implements ValidatorConstraintInterface {
  async validate(orgCreatorId: number) {
    const nato = await NotAcceptedTouristOrganization.findOne({
      where: { orgCreatorId }
    });
    // const rn_user = await NotRegUser.findOne({ where: { email } });
    if (nato) return false;
    // if (rn_user) return false;
    return true;
  }
}

export function isCreatorExistInNATO(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isCreatorExistInNATOConstraint
    });
  };
}
