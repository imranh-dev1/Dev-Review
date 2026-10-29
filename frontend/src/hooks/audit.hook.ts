import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, type IAuditLogListQuery } from "@/api/audit.api";

export const useGetAuditLogs = (query?: IAuditLogListQuery) => {
	return useQuery({
		queryKey: ["audit-logs", query],
		queryFn: () => getAuditLogs(query),
	});
};
