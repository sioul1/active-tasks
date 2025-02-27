import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LoginCard = () => {
  return (
    <div className="flex items-center justify-center gap-5 p-5">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className=" text-center">
          <p className="text-lg font-semibold text-primary">
            Entre com sua conta
          </p>
        </CardHeader>
        <form>
          <CardContent className="flex flex-col gap-5">
            <Input id="email" type="email" placeholder="Email" />
            <Input id="password" type="password" placeholder="Senha" />
          </CardContent>
          <CardFooter className="flex flex-col gap-5">
            <Button type="submit" className="text-white py-3 px-6 text-base">
              Login
            </Button>
            <p className="text-xs text-center text-gray-500">
              Ainda não possui uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Registre-se
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="border-t border-gray-300 w-[89px]"></div>
              <span className="mx-4 text-base font-medium text-gray-400">
                Redes Sociais
              </span>
              <div className="border-t border-gray-300 w-[89px]"></div>
            </div>
            <section className="flex gap-4">
                <Image className="cursor-pointer" src={`/images/google_13170545.png`} alt='Google' width={48} height={48}/>
                <Image className="cursor-pointer" src={`/images/github-icon.png`} alt='Github' width={48} height={54}/>
            </section>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginCard;
