'use client';

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, Input, Button } from "@repo/ui";
import { MapPin, Search, Loader2 } from "lucide-react";

interface LocationSearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (location: string) => void;
}

declare global {
    interface Window {
        kakao: any;
    }
}

export function LocationSearchDialog({ isOpen, onClose, onSelect }: LocationSearchDialogProps) {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load Kakao Map Script
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement("script");
        const apiKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

        if (!apiKey) {
            setError("Kakao API Key is missing");
            return;
        }

        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                setIsScriptLoaded(true);
            });
        };

        script.onerror = (e) => {
            console.log(e)
            setError("Failed to load Kakao Maps SDK" + e);
        };

        document.head.appendChild(script);

        return () => {
            // cleanup if needed, but usually keeping script is fine
        };
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!keyword.trim() || !isScriptLoaded) return;

        setIsLoading(true);
        setResults([]);

        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(keyword, (data: any, status: any) => {
            setIsLoading(false);
            if (status === window.kakao.maps.services.Status.OK) {
                setResults(data);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULTS) {
                setResults([]);
            } else {
                console.error("Kakao Search Error:", status);
                setResults([]);
            }
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-xl p-0">
                <SheetHeader className="px-5 pt-5 pb-2 text-left">
                    <SheetTitle className="text-lg font-bold">장소 검색</SheetTitle>
                    <SheetDescription>
                        키워드로 장소를 검색해보세요. (예: 강남역 스타벅스)
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col h-full overflow-hidden">
                    {/* Search Input */}
                    <div className="px-5 pb-4 border-b border-slate-100">
                        <form onSubmit={handleSearch} className="relative flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="장소, 주소, 건물명 검색"
                                    className="pl-9 h-11 bg-slate-50 border-slate-200 focus:bg-white"
                                    autoFocus
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || !isScriptLoaded}
                                className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                            >
                                검색
                            </Button>
                        </form>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    </div>

                    {/* Results List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            </div>
                        ) : results.length > 0 ? (
                            <ul className="divide-y divide-slate-50">
                                {results.map((place) => (
                                    <li
                                        key={place.id}
                                        onClick={() => {
                                            onSelect(`${place.place_name} (${place.address_name})`);
                                            onClose();
                                        }}
                                        className="px-5 py-4 hover:bg-slate-50 cursor-pointer flex items-start gap-3 active:bg-slate-100 transition-colors"
                                    >
                                        <div className="mt-0.5 p-2 bg-slate-100 rounded-full shrink-0 text-slate-500">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col min-w-0 gap-0.5">
                                            <span className="text-sm font-bold text-slate-900 leading-tight">
                                                {place.place_name}
                                            </span>
                                            <span className="text-xs text-slate-500 truncate">
                                                {place.road_address_name || place.address_name}
                                            </span>
                                            {place.category_name && (
                                                <span className="text-[10px] text-indigo-500 font-medium truncate mt-0.5">
                                                    {place.category_name.split('>').pop()?.trim()}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <Search className="w-8 h-8 text-slate-200 mb-2" />
                                <p className="text-slate-500 text-sm">
                                    {keyword ? "검색 결과가 없습니다." : "검색어를 입력해주세요."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
