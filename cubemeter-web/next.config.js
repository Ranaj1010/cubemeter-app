/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	env: {
		MAPBOX_TOKEN: "pk.eyJ1IjoicmFuYWoxMDEwOTUiLCJhIjoiY2xnODNhbGE1MGI0bzNlcDlkd3FtY3FsciJ9.6NylfqJEDlEDt-hoEicuJQ",
		API_URL: "https://localhost:5199/",
	},
};

module.exports = nextConfig;
