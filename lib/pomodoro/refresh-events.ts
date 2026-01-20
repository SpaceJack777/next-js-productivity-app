import { createRefreshEvent } from "@/hooks/use-refresh-on-event";

export const todaySessionsRefresh = createRefreshEvent();
export const totalSessionsRefresh = createRefreshEvent();
export const allSessionsRefresh = createRefreshEvent();
