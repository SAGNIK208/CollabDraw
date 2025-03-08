import { useEffect,useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
import { CreateUserSchema, SignInSchema, AuthFormType, CreateUserType } from "@repo/common/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import ApiTooltip from "@repo/ui/apiToolTip";

export default function AuthForm({ isSignUp }: { isSignUp: boolean }) {
  const schema = isSignUp ? CreateUserSchema : SignInSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    unregister,
  } = useForm<AuthFormType>({
    resolver: zodResolver(schema),
    defaultValues: isSignUp ? { username: "", email: "", password: "" } : { email: "", password: "" },
  });

  useEffect(() => {
    reset();
    if (!isSignUp) unregister("username");
  }, [isSignUp, reset, unregister]);

  type TooltipState = {
    message: string | null;
    type: "success" | "error" | null;
    statusCode?: number;
  };
  const [tooltip, setTooltip] = useState<TooltipState>({
    message: null,
    type: null,
    statusCode: undefined,
  });
  const router = useRouter();
  const onSubmit = async (data: AuthFormType) => {
    try{
      const response = await axios({
        url:`http://localhost:8080/api/auth/${isSignUp ? "signup" : "signin"}`,
        method: "POST",
        data: data,
        withCredentials:true
      });
      setTooltip({
        message:response.data.message,
        type:"success",
        statusCode:response.status
      });
      setTimeout(()=>{
        router.push((isSignUp)?"/signin":"rooms");
      },1000);
    }catch(error:unknown){
      console.log(error);
      if (axios.isAxiosError(error)) {
        setTooltip({
          message:error.response?.data?.message,
          type:"error",
          statusCode:error.status
        });
      } else {
        setTooltip({
          message:"Something went wrong",
          type:"error",
          statusCode:500
        });
      }
    }
  };

  return (
    <>
     {tooltip.message && <ApiTooltip key={Date.now()} message={tooltip.message} type={tooltip.type} statusCode={tooltip.statusCode}/>}
    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? "Create an Account" : "Sign In"}
      </h2>
      <Form.Root onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                {...register("username")}
                className="mt-1 p-2 w-full border rounded-lg"
                placeholder="JohnDoe123"
              />
              {(errors as FieldErrors<CreateUserType>)?.username && (
                <p className="text-red-500 text-sm">{(errors as FieldErrors<CreateUserType>)?.username?.message as string}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              {...register("email")}
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="••••••"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </Form.Root>
      <p className="text-center mt-4 text-sm">
        {isSignUp ? "Already have an account?" : "Don't have an account?"} 
        <a
          href={isSignUp ? "/signin" : "/signup"}
          className="text-blue-600 hover:underline ml-1"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </a>
      </p>
    </div>
  </> 
  );
}
