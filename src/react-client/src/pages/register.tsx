import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Link} from "react-router-dom";
import {RegisterForm, useAuth} from "@/context/auth-context.tsx";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
    confirmPassword: z.string().min(3),
})
    .refine(x => x.password === x.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

export default function RegisterPage() {
    const {register} = useAuth();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await register(new RegisterForm(values.email, values.password, values.confirmPassword), () => {
        });
    }

    return (
        <div className="container max-w-xl shadow p-8 mt-20">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <h1 className="text-4xl">Create an account</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">Create</Button>
                    <p className="text-xs text-center">
                        Already have an account? Click <Link className="underline" to="/">here</Link> to login.
                    </p>
                </form>
            </Form>
        </div>
    )
}
