import { HttpService } from '@nestjs/axios';
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './subscription.interface.ts/subscription.entity';
import { SubscriptionInterface } from './subscription.interface.ts/subscription.interface';
import { UserEntity } from './subscription.interface.ts/user.entity';
import {
    PaymentData,
    PaymentResponse,
    User,
} from './subscription.interface.ts/user.interface';

@Injectable()
export class AppService {
    private url_reveniu = process.env.REVENIU_URL;

    private config_header = {
        headers: {
            'Reveniu-Secret-Key': process.env.REVENIU_KEY,
        },
    };

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(SubscriptionEntity)
        private subsRepository: Repository<SubscriptionEntity>,
        private httpService: HttpService
    ) {}

    // Own Services

    /**
     * Just for testing if the service is up
     * @returns Greeting message
     */
    getHello(): string {
        return 'Hola';
    }

    // User Services

    /**
     * Trae a todos los usuarios en base de datos
     * @returns Arreglo de usuarios
     */
    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { status: 'ACTIVATE' },
        });
    }

    /**
     * Buscar un usuario por su ID
     * @param userId id del usuario
     * @returns el usuario
     */
    async findOneUser(userId: number) {
        const { id, name, email, password, phone, status } =
            await this.userRepository.findOne(userId);

        if (!id) {
            throw new BadRequestException('Invalid user');
        }

        const response = {
            id,
            name,
            email,
            phone,
            status,
        };

        return response;
    }

    /**
     * Crear un usuario y guardarlo en base de datos
     * @param user datos del usuario
     * @returns el usuario creado
     */
    async create(user: User): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

    /**
     * Actualiza los datos de un usuario
     * @param userData user data
     */
    async update(userData: UserEntity): Promise<void> {
        const { id, name, email, phone, password } = userData;
        const user = await this.findOneUser(id);

        user.name = name ? name : user.name;
        user.email = email ? email : user.email;
        user.phone = phone ? phone : user.phone;
        await this.userRepository.save(user);
    }

    /**
     * Elimina un usuario
     * @param id identificador del usuario
     */
    async delete(id: number): Promise<void> {
        await this.userRepository.delete({ id });
    }

    async validateUser(email: string, pass: string) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return new UnauthorizedException();
    }

    async updateUserAccount() {
        console.log('user account has been updated');
    }

    // Subscription Service
    /**
     *
     * @returns Arreglo de todas las relaciones que tengo entre usuario y suscripciones
     * creadas en REVENIU
     */
    async getAllSubscription(): Promise<SubscriptionEntity[]> {
        return await this.subsRepository.find({ relations: ['user'] });
    }

    async createOneSubs(
        subscriptionEntity: SubscriptionInterface
    ): Promise<SubscriptionEntity> {
        return await this.subsRepository.save(subscriptionEntity);
    }

    // Reveniu Services

    /**
     * Trae todas las suscripciones de mi cuenta
     * @returns arreglo de suscripciones
     */
    async getSubscriptions() {
        const response = await firstValueFrom(
            this.httpService.get<PaymentResponse>(
                this.url_reveniu + 'subscriptions/',
                this.config_header
            )
        );
        return response.data;
    }

    async getSubFilterByEmail(email: string) {
        const response = await firstValueFrom(
            this.httpService.get<any>(
                `${this.url_reveniu}subscriptions/search?email=${email}`,
                this.config_header
            )
        );
        return response.data;
    }

    /**
     * Consulta el detalle de la suscripcion
     * @param id identificador de la suscripción
     * @returns detalle de la suscripcion
     */
    async getSubscriptionStatus(id: number) {
        const response = await firstValueFrom(
            this.httpService.get<PaymentResponse>(
                this.url_reveniu + 'subscriptions/' + id,
                this.config_header
            )
        );
        return response.data;
    }

    /**
     * Crea una nueva suscripción y devuelve un link y security token para
     * redirigir al usuario
     * @param paymentData datos del usuario
     * @returns link de transkbank para que el usuario vaya a pagar
     */
    async createSuscription(paymentData: PaymentData) {
        const data = {
            plan_id: paymentData.plan_id,
            field_values: {
                email: paymentData.email,
                name: paymentData.name,
            },
        };

        const response = await firstValueFrom(
            this.httpService.post<PaymentResponse>(
                this.url_reveniu + 'subscriptions/',
                data,
                this.config_header
            )
        );

        console.log(response.data);

        const newSubscription = new SubscriptionEntity();
        newSubscription.status = '10';
        newSubscription.subscription_id = response.data.id;
        newSubscription.user = await this.userRepository.findOne(
            paymentData.user_id
        );
        const subCreated = await this.subsRepository.save(newSubscription);

        return response.data;
    }

    async disableSubscription(sub_id: number) {
        const response = await this.httpService
            .post<any>(
                this.url_reveniu + 'subscriptions/' + sub_id + '/disable/',
                {},
                this.config_header
            )
            .toPromise();
        return response.data;
    }

    async enableSubscription(sub_id: number) {
        const response = await firstValueFrom(
            this.httpService.post<any>(
                `${this.url_reveniu}subscriptions/reactivate/${sub_id}/`,
                {},
                this.config_header
            )
        );
        return response.data;
    }

    async invoicePayment(invoice_id: number) {
        const response = await this.httpService
            .post<PaymentResponse>(
                this.url_reveniu + 'payments/invoice/' + invoice_id,
                {},
                this.config_header
            )
            .toPromise();
        return response.data;
    }

    async changeSubscriptionAmount(sub_id: number, amount: number) {
        const response = await this.httpService
            .post<PaymentResponse>(
                `${this.url_reveniu}subscriptions/${sub_id}/amount/`,
                { new_amount: amount },
                this.config_header
            )
            .toPromise();
        return response.data;
    }

    async changeSubscriptionDueDay(sub_id: number, new_due_date: number) {
        const response = await this.httpService
            .post<PaymentResponse>(
                `${this.url_reveniu}subscriptions/${sub_id}/dueday/`,
                { new_day: new_due_date },
                this.config_header
            )
            .toPromise();
        return response.data;
    }

    async findAllPaymentsOfSubscription(idSub: number) {
        console.log(`${this.url_reveniu}subscriptions/${idSub}/payments/`);
        const response = await firstValueFrom(
            this.httpService.get<any>(
                `${this.url_reveniu}subscriptions/${idSub}/payments`,
                this.config_header
            )
        );
        return response.data;
    }

    async findAllPlans() {
        const response = await firstValueFrom(
            this.httpService.get<any>(
                `${this.url_reveniu}plans/`,
                this.config_header
            )
        );
        return response.data;
    }
}
