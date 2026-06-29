import z, { email } from "zod";

const registerSchema = z.object({
    fullName: z.string().min(2, "name too short"),
    email: z.email("Invalid email"),
    password: z.string.min(6, "password must be minimum of 6 characters")
});

const loginSchema = z.object({
    email: z.email("email is required"),
    password: z.string.min(1, "password is required")
})


export {
    registerSchema,
    loginSchema
}