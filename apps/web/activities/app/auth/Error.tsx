import { ActivityLayout } from "@/common/components/ActivityLayout";
import { useFlow } from "../../../stackflow";
import { useEffect, useState } from "react";

type ErrorProps = {};

export default function Error({ }: ErrorProps) {
    const { replace } = useFlow();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        if (error) {
            setErrorMessage(error);
        }
    }, []);

    return (
        <ActivityLayout hideAppBar>
            <div className="flex flex-col flex-1 bg-white items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-600">로그인 오류</h1>
                <p className="mt-2 text-slate-600">인증 과정에서 문제가 발생했습니다.</p>
                {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl max-w-md text-center break-words border border-red-100">
                        <p className="font-semibold">오류 내용:</p>
                        <p>{errorMessage}</p>
                    </div>
                )}
                <button
                    onClick={() => replace("Login", {})}
                    className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    로그인 페이지로 돌아가기
                </button>
            </div>
        </ActivityLayout>
    );
}
