import { AppScreen } from "@stackflow/plugin-basic-ui";

export default function Result({ params: { id } }: { params: { id: string } }) {
    return (
        <AppScreen>
            <div className="flex flex-col flex-1">
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">결과 확인 페이지</h1>
                    <p className="mt-2">모든 참여자의 일정이 합쳐진 히트맵과 Best 3 시간대를 확인합니다.</p>
                </div>
            </div>
        </AppScreen>
    );
}
