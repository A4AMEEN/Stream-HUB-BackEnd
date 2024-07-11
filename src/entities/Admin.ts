export class User {
    isblocked: any;
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly role: string = 'admin', 
    ) {}
}