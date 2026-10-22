import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClint = ofetch.create({
	baseURL: BASE_URL,
	credentials: "include",

	onResponseError({ response }) {
		const message = response._data?.message;

		if (message) {
			throw new Error(message);
		}
	},
});

export default apiClint;
