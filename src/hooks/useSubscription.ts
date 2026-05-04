export const useSubscription = () => {
    // Platform is currently free — all features unlocked for everyone
    return {
        isPremium: true,
        plan: 'free' as const,
        status: 'active' as const,
        trialEndsAt: null,
    };
};
