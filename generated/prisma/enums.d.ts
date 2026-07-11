export declare const Role: {
    readonly CUSTOMER: "CUSTOMER";
    readonly PROVIDER: "PROVIDER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const RentalStatus: {
    readonly PLACED: "PLACED";
    readonly CONFIRMED: "CONFIRMED";
    readonly CANCELLED: "CANCELLED";
    readonly PAID: "PAID";
    readonly PICKED_UP: "PICKED_UP";
    readonly RETURNED: "RETURNED";
};
export type RentalStatus = (typeof RentalStatus)[keyof typeof RentalStatus];
export declare const PaymentProvider: {
    readonly STRIPE: "STRIPE";
    readonly SSLCOMMERZ: "SSLCOMMERZ";
};
export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map