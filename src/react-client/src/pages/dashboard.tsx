import {useAuth} from "@/context/auth-context.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export default function DashboardPage() {

    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <h1>Protected</h1>
            <Button onClick={async () => {
                await auth.logout(() => {
                    navigate("/");
                });
            }}>Logout</Button>
        </div>
    )
}