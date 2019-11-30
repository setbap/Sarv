import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { User } from "../entity/User";
import { NotRegUser } from "../entity/NotRegUser";
import { NotAcceptedTouristOrganization } from "../entity/NotAcceptedTouristOrganization";
import { TouristOrganization } from "../entity/TouristOrganization";

@ValidatorConstraint({ async: true })
export class isCreatorExistInTOConstraint
  implements ValidatorConstraintInterface {
  async validate(orgCreatorId: number) {
    const to = await TouristOrganization.findOne({
      where: { orgCreatorId }
    });
    // const rn_user = await NotRegUser.findOne({ where: { email } });
    if (to) return false;
    // if (rn_user) return false;
    return true;
  }
}

export function isCreatorExistInTO(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isCreatorExistInTOConstraint
    });
  };
}
