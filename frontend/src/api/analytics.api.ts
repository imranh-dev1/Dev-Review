import apiClint from "@/lib/apiClint";

export const getStudentAnalytics = () => {
	return apiClint("/analytics/student", {
		method: "GET",
	});
};

export const getReviewerAnalytics = () => {
	return apiClint("/analytics/reviewer", {
		method: "GET",
	});
};

export const getAdminAnalytics = () => {
	return apiClint("/analytics/admin", {
		method: "GET",
	});
};
