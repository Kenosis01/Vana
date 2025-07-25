import { useEffect, useState } from "react"
import { ProfileDataResponsePayload } from "@roo/WebviewMessage"
import { vscode } from "@/utils/vscode"

export function useKiloIdentity(vanaToken: string, machineId: string) {
	const [vanaIdentity, setVanaIdentity] = useState("")
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "profileDataResponse") {
				const payload = event.data.payload as ProfileDataResponsePayload | undefined
				const success = payload?.success || false
				const tokenFromMessage = payload?.data?.vanaToken || ""
				const email = payload?.data?.user?.email || ""
				if (!success) {
					console.error("VANATEL: Failed to identify Vana user, message doesn't indicate success:", payload)
				} else if (tokenFromMessage !== vanaToken) {
					console.error("VANATEL: Failed to identify Vana user, token mismatch:", payload)
				} else if (!email) {
					console.error("VANATEL: Failed to identify Vana user, email missing:", payload)
				} else {
					console.debug("VANATEL: Vana user identified:", email)
					setVanaIdentity(email)
					window.removeEventListener("message", handleMessage)
				}
			}
		}

		if (vanaToken) {
			console.debug("VANATEL: fetching profile...")
			window.addEventListener("message", handleMessage)
			vscode.postMessage({
				type: "fetchProfileDataRequest",
			})
		} else {
			console.debug("VANATEL: no Vana user")
			setVanaIdentity("")
		}

		return () => {
			window.removeEventListener("message", handleMessage)
		}
	}, [vanaToken])
	return vanaIdentity || machineId
}