import { useQuery } from "@tanstack/react-query";
import {
	getAdminAnalytics,
	getReviewerAnalytics,
	getStudentAnalytics,
} from "@/api/analytics.api";

export const useStudentAnalytics = () => {
	return useQuery({
		queryKey: ["analytics", "student"],
		queryFn: getStudentAnalytics,
	});
};

export const useReviewerAnalytics = () => {
	return useQuery({
		queryKey: ["analytics", "reviewer"],
		queryFn: getReviewerAnalytics,
	});
};

export const useAdminAnalytics = () => {
	return useQuery({
		queryKey: ["analytics", "admin"],
		queryFn: getAdminAnalytics,
	});
};
