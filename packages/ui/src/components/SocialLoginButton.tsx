"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    provider: "google" | "kakao";
    children: ReactNode;
    className?: string;
}

export const SocialLoginButton = ({
    provider,
    children,
    className = "",
    ...props
}: SocialLoginButtonProps) => {
    const baseStyles =
        "flex items-center justify-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ease-in-out transform active:scale-[0.98] shadow-sm hover:shadow-md";

    const providerStyles = {
        google: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
        kakao: "bg-[#FEE500] text-[#191919] border border-[#FEE500] hover:bg-[#FDD835]",
    };

    return (
        <button
            className={`${baseStyles} ${providerStyles[provider]} ${className}`}
            {...props}
        >
            {/* Icon placeholder - in a real app we'd use SVGs or Lucide icons */}
            <span className="mr-3">
                {provider === "google" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                )}
                {provider === "kakao" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C5.925 3 1 6.925 1 11.75C1 14.6 2.875 17.15 5.725 18.625L4.825 21.95C4.725 22.325 5.15 22.6 5.475 22.375L9.65 19.6C10.4 19.725 11.175 19.8 12 19.8C18.075 19.8 23 15.875 23 11.05C23 6.225 18.075 3 12 3Z" />
                    </svg>
                )}
            </span>
            {children}
        </button>
    );
};
