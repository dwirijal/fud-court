// This file is no longer needed as we are not using Supabase Auth.
// It is left here to prevent breaking imports in case it's referenced elsewhere,
// but its functionality is now handled by a simpler middleware.
export const createClient = (request: any) => {
    return { supabase: {}, response: { headers: new Headers(), cookies: { all: () => [] } } };
}
