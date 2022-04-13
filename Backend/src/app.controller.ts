import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SubscriptionInterface } from './subscription.interface.ts/subscription.interface';
import { UserEntity } from './subscription.interface.ts/user.entity';
import {
    PaymentData,
    UserSession,
} from './subscription.interface.ts/user.interface';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get('')
    async hellow() {
        return 'The App is running';
    }

    @Post('login')
    async login(@Body() data: UserSession) {
        return await this.appService.validateUser(data.email, data.password);
    }

    @Post('getWebHook')
    async getWebHook(@Body() data) {
        console.log(data.data);
        await this.appService.updateUserAccount();
        return { transaction: 'registred' };
    }

    @Get('allUsers')
    async getUsers(): Promise<UserEntity[]> {
        return await this.appService.findAll();
    }

    @Get('findUser/:id')
    async getUser(@Param('id') id: string) {
        return await this.appService.findOneUser(parseInt(id));
    }

    @Post('create-user')
    async createUser(@Body() data: UserEntity) {
        console.log(data);
        return await this.appService.create(data);
    }

    @Delete('deleteUser/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.appService.delete(parseInt(id));
    }

    @Post('createSuscription')
    async createSuscription(@Body() data: PaymentData) {
        return await this.appService.createSuscription(data);
    }

    @Get('getSubs')
    async getSubs() {
        return await this.appService.getSubscriptions();
    }

    @Get('getSub/:id')
    async getSub(@Param('id') id: string) {
        return await this.appService.getSubscriptionStatus(parseInt(id));
    }

    @Get('getSubByEmail')
    async getSubByEmail(@Query() query) {
        if (query.email)
            return await this.appService.getSubFilterByEmail(query.email);
        else return { error: 404, data: [] };
    }

    @Get('getSubPayments/:id')
    async getSubPayments(@Param('id') id: string) {
        return await this.appService.findAllPaymentsOfSubscription(
            parseInt(id)
        );
    }

    @Post('disableSub/:id')
    async disableSub(@Param('id') id: string) {
        return await this.appService.disableSubscription(parseInt(id));
    }

    @Post('enableSub/:id')
    async enableSub(@Param('id') id: string) {
        return this.appService.enableSubscription(parseInt(id));
    }

    @Get('getUsersSubs')
    async getUsersSubs() {
        return this.appService.getAllSubscription();
    }

    @Post('createSub')
    async createSub(@Body() data: SubscriptionInterface) {
        return this.appService.createOneSubs(data);
    }

    @Get('findAllPlans')
    async findAllPlans() {
        return this.appService.findAllPlans();
    }
}
