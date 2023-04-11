/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
	env: {
		MAPBOX_TOKEN: "pk.eyJ1IjoicmFuYWoxMDEwOTUiLCJhIjoiY2xnODNhbGE1MGI0bzNlcDlkd3FtY3FsciJ9.6NylfqJEDlEDt-hoEicuJQ",
		API_URL: "http://localhost:5198/",
	},
};

module.exports = nextConfig;
