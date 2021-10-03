export interface IAddComplain{
    id?: number;
    serviceProviderId: number;
    categoryId: number;
    mobileOrUserId: string;
    serviceProviderTicketNo:string;
    complain:string;
}

export interface IRegister{
    firstName: string;
    lastName: string;
    email:string;
    mobileNo: string;
    password: string;
}

export interface IChangePassword {
    oldPassword: string,
    newPassword: string
}

export interface IForgotPassword{
    email: string;
}

export interface IResetPassword{
    newPassword: string
}