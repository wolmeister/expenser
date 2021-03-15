import { Model, ModelObject, ToJsonOptions } from 'objection';

export enum UserConstraints {
  UNIQUE_EMAIL = 'users_email_unique',
}

export class User extends Model {
  public static tableName = 'users';

  public id!: number;

  public name!: string;

  public email!: string;

  public password!: string;

  toJSON(opts: ToJsonOptions): ModelObject<any> {
    // we use any here because there's a bug when using objection with typescript v4+
    // https://github.com/Vincit/objection.js/issues/1861
    const json = super.toJSON(opts) as ModelObject<any>;
    delete json.password;
    return json;
  }
}
