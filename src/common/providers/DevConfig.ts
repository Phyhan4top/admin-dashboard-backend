import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfig {
  DBHOST = 'localhost';
  getDBHOST() {
    return this.DBHOST;
  }
}
