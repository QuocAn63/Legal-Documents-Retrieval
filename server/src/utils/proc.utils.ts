import { IStoreProcedureParams } from 'src/interfaces/proc.interface';
import { Repository } from 'typeorm';

export default class SQLStoreProcedure<T> {
  constructor(private repository: Repository<T>) {}

  async executeProcedure<T, G extends IStoreProcedureParams>(
    procedureName: string,
    activityName: string,
    params: G,
  ) {
    let sql = `EXEC ${procedureName} @Activity = '${activityName}'`;

    const sParams = Object.keys(params).map(
      (key) => `, @${key} = '${params[key]}'`,
    );

    return this.repository.query(sql + sParams);
  }
}
