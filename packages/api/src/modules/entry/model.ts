import { Model } from 'objection';

export class Entry extends Model {
  public static tableName = 'entries';

  public id!: number;

  public userId!: number;

  public amount!: number;

  public category!: number;

  public description?: number | null;

  public date!: string;
}
