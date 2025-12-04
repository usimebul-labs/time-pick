import { AppScreen } from "@stackflow/plugin-basic-ui";

type LoginActivity = {};

export default function LoginActivity({}: LoginActivity) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">로그인 페이지</h1>
          <p className="mt-2">소셜 로그인(구글, 카카오)을 통해 로그인합니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
