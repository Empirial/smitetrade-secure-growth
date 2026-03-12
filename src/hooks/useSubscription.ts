import { useStore } from "@/context/StoreContext";

export const useSubscription = () => {
    const { user } = useStore();
    const sub = user?.subscription;

    const isPremium =
        !!sub &&
        (sub.status === "active" || sub.status === "trial") &&
        (!sub.trialEndsAt || new Date(sub.trialEndsAt) > new Date());

    return {
        isPremium,
        plan: sub?.plan ?? null,
        status: sub?.status ?? null,
        trialEndsAt: sub?.trialEndsAt ?? null,
    };
};
