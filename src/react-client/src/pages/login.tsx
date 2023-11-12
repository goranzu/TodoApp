import * as z from "zod"
import {useForm} from "react-hook-form";
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
import {Link, useNavigate} from "react-router-dom";
import {LoginForm, useAuth} from "@/context/auth-context.tsx";
import {useState} from "react";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
})

export default function LoginPage() {
    const {login} = useAuth();
    const [serverErrorMessage, setServerErrorMessage] = useState("");
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await login(new LoginForm(values.email, values.password), (serverErrorMessage: string | undefined) => {
            if (serverErrorMessage) {
                setServerErrorMessage(serverErrorMessage);
            } else {
                navigate("/dashboard");
            }
        });
    }

    return (
        <div className="container max-w-xl shadow p-8 mt-20">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <h1 className="text-4xl">Sign In</h1>
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
                    <Button className="w-full" type="submit">Sign In</Button>
                    <p className="text-xs text-center">
                        Don't have an account yet? Click <Link className="underline" to="/register">here</Link> to
                        create one.
                    </p>
                    {serverErrorMessage && serverErrorMessage.length > 0 && (
                        <p className="text-center text-destructive">{serverErrorMessage}</p>
                    )}
                    {/*{errorMessage && errorMessage.length > 0 && (*/}
                    {/*    <p className="text-center text-destructive">{errorMessage}</p>*/}
                    {/*)}*/}
                </form>
            </Form>
        </div>
    )
}