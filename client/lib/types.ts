import { z } from 'zod';

const UserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});


const FilePayloadSchema = z.object({
    email: z.string().email(),
    filename: z.string()  
});

export type UserPayload = z.infer<typeof UserSchema>;

export type FilePayload = z.infer<typeof FilePayloadSchema>;