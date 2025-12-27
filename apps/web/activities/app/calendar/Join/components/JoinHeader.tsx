import { useJoinHeader } from "../hooks/useJoinHeader";

interface JoinHeaderProps {
    id: string;
}

export function JoinHeader({ id }: JoinHeaderProps) {
    const { calendarTitle, hostName, hostAvatar } = useJoinHeader(id);


    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center mb-8">
            {hostAvatar ? (
                <img
                    src={hostAvatar}
                    alt={hostName}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-white shadow-md"
                />
            ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center text-2xl">
                    👋
                </div>
            )}

            <div className="mb-6">
                {hostName && (
                    <p className="text-gray-500 mb-2 font-medium">
                        {hostName}님의 초대
                    </p>
                )}
                <h2 className="text-2xl font-bold text-gray-900 leading-tight break-keep">
                    {calendarTitle || "로딩 중..."}
                </h2>
            </div>

            <p className="text-sm text-gray-400">
                가능한 시간을 알려주세요.<br />
                가장 좋은 시간을 찾아드릴게요!
            </p>
        </div>
    );
}
