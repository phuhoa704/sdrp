import Medusa from "@medusajs/js-sdk"
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "./config"

export const medusa = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    publishableKey: MEDUSA_PUBLISHABLE_KEY,
    auth: {
        type: "jwt", // Switch back to JWT for cross-domain (ngrok) compatibility
    },
    globalHeaders: {
        "ngrok-skip-browser-warning": "true"
    }
})
