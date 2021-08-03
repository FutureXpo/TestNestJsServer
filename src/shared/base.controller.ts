import { SECRET } from '../config';
import * as jwt from 'jsonwebtoken';

export class BaseController {

  constructor() {}

  protected getUserIdFromToken(ownerization) {
    if (!ownerization) return null;

    const token = ownerization.split(' ')[1];
    const decoded: any = jwt.verify(token, SECRET);
    return decoded.id;
  }
}