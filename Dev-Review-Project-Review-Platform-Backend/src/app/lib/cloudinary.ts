import { v2 as Cloudinary } from "cloudinary";
import config from "../config";

Cloudinary.config({
	cloud_name: config.cloud_name,
	api_key: config.cloud_api_key,
	api_secret: config.cloud_api_secret,
});

export const cloudinary = Cloudinary;
