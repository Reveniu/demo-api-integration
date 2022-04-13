export interface User {
    id?: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    status?: 'ACTIVATE' | 'INACTIVATE';
}

export interface PaymentResponse {
    id: number;
    completion_url: string;
    security_token: string;
    status_code: 200;
}

export interface PaymentLink {
    data: PaymentResponse;
}

export interface UserSession {
    email: string;
    password: string;
}

export interface PaymentData {
    user_id: number;
    plan_id: number;
    email: string;
    name: string;
}
