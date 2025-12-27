import { ChevronDown, ChevronUp, Info, MapPin, Train, SquareParking, Banknote, Landmark, Phone, FileText } from "lucide-react";
import { AppIcon } from "./AppIcon";
import { useResultStore } from "../stores/useResultStore";
import { ConfirmedCalendarResult } from "@/app/actions/calendar";

interface ResultInfoProps {
    message: ConfirmedCalendarResult['event']['message'];
}

export function ResultInfo({ message }: ResultInfoProps) {
    const { isInfoOpen, toggleInfo } = useResultStore();
    const hasAdditionalInfo = message && Object.values(message).some(v => v);

    if (!hasAdditionalInfo) return null;

    return (
        <div className="px-6 pb-6">
            <button
                onClick={toggleInfo}
                className="flex items-center justify-between w-full py-4 border-t border-slate-100 group"
            >
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-900">기타 안내 사항</span>
                </div>
                {isInfoOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                )}
            </button>

            {isInfoOpen && (
                <div className="bg-slate-50 rounded-xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <InfoRow
                        icon={MapPin}
                        label="장소"
                        value={message?.location}
                        action={
                            message?.location && (
                                <div className="flex gap-2 mt-2">
                                    <MapLink url={`https://map.naver.com/v5/search/${encodeURIComponent(message.location)}`} appName="naver map" alt="Naver Map" />
                                    <MapLink url={`https://map.kakao.com/link/search/${encodeURIComponent(message.location)}`} appName="kakao map" alt="Kakao Map" />
                                    <MapLink url={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(message.location)}`} appName="google maps" alt="Google Maps" />
                                </div>
                            )
                        }
                    />
                    <InfoRow icon={Train} label="교통" value={message?.transport} />
                    <InfoRow icon={SquareParking} label="주차" value={message?.parking} />
                    <InfoRow icon={Banknote} label="회비" value={message?.fee} />
                    <InfoRow icon={Landmark} label="계좌" value={message?.bank} />
                    <InfoRow icon={Phone} label="문의" value={message?.inquiry} />
                    <InfoRow icon={FileText} label="메모" value={message?.memo} />
                </div>
            )}
        </div>
    );
}

const InfoRow = ({ icon: Icon, label, value, action }: { icon: any, label: string, value?: string, action?: React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex flex-col gap-0.5 w-full">
                <span className="text-xs font-bold text-slate-500">{label}</span>
                <span className="text-slate-900 text-sm whitespace-pre-wrap leading-relaxed">{value}</span>
                {action}
            </div>
        </div>
    );
};

const MapLink = ({ url, appName, alt }: { url: string, appName: any, alt: string }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:scale-105 transition-transform"
        aria-label={alt}
    >
        <AppIcon appName={appName} alt={alt} className="w-full h-full" />
    </a>
);
