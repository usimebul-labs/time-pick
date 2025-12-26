export interface SharedParticipant {
    id: string;
    name: string;
    avatarUrl: string | null;
    userId?: string | null; // For identifying if it's a registered user
    email?: string | null;
    createdAt?: string;
    isGuest?: boolean;
}
