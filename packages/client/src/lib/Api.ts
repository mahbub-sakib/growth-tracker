import axios, {
    AxiosError,
} from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // sends the refresh token cookie automatically
});

// Attach the access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        // const payload = JSON.parse(atob(token.split(".")[1]));
        // console.log("Expires at:", new Date(payload.exp * 1000));
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// On 401, try to refresh the token and retry the original request
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // console.log("Interceptor hit");
        // console.log("Status:", error.response?.status);
        // console.log("URL:", error.config?.url);
        // console.log("Already retried:", error.config?._retry);


        // const originalRequest = error.config;

        // Don't try to refresh the refresh endpoint itself
        if (originalRequest.url === "/auth/refresh") {
            return Promise.reject(error);
        }

        // If not a 401 or already retried, just throw
        if (error.response?.status !== 401 || originalRequest._retry) {
            throw error;
        }

        originalRequest._retry = true;

        try {
            //     // withCredentials sends the refresh token cookie automatically
            console.log("Attempting refresh...");
            // const { data } = await api.post("/auth/refresh");

            if (!isRefreshing) {
                isRefreshing = true;
                console.log("Attempting refresh...2");
                refreshPromise = api
                    .post("/auth/refresh")
                    .then(({ data }) => {
                        localStorage.setItem("accessToken", data.accessToken);
                        return data.accessToken;
                    })
                    .finally(() => {
                        isRefreshing = false;
                        console.log("success refresh...");

                    });
            }


            // const newToken = data.accessToken;
            const newToken = await refreshPromise!;

            // console.log('from refresh', originalRequest);

            // localStorage.setItem("accessToken", newToken);
            // originalRequest.headers.Authorization = `Bearer ${newToken}`;

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            //     // Retry the original request with the new token
            return await api(originalRequest);
        } catch (refreshError: any) {
            //     // Refresh token is also expired — log the user out
            // console.log("Refresh failed:");
            // console.log("Status:", refreshError.response?.status);
            // console.log("Message:", refreshError.response?.data);
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            throw error;
        }
    }
);


export default api;