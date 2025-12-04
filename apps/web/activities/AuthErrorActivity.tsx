import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow } from "../stackflow";

type AuthErrorActivity = {};

export default function AuthErrorActivity({ }: AuthErrorActivity) {
    const { replace } = useFlow();

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-white items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-600">로그인 오류</h1>
                <p className="mt-2 text-gray-600">인증 과정에서 문제가 발생했습니다.</p>
                <button
                    onClick={() => replace("LoginActivity", {})}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    로그인 페이지로 돌아가기
                </button>
            </div>
        </AppScreen>
    );
}
