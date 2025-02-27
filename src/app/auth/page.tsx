"use client";

import Header from "@/components/layout/header";
import LoginCard from "./components/login-card";



const Page = () => {
    return (
        <div className="flex flex-col gap-48">
            <Header />
            <LoginCard />
        </div>
    );
}

export default Page;
