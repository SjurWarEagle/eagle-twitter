import {Controller, Get, Query} from '@nestjs/common';
import { AppService } from './app.service';
import {UrlList} from "./types/url-list";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query('screen_name') screen_name: string): Promise<UrlList> {
    return await this.appService.extractImageUrls(screen_name);
  }
}
