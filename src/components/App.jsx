import React from "react"
import Menu from "./Menu.jsx"
import { createRoot } from "react-dom/client"

const root = document.createElement("div")
document.body.append(root)
createRoot(root).render(
	<Menu
		size={window.size}
		reset_count={() => window.count = 0}
		reset_points={() => window.points.length = 0}
		reset_canvas={() => window.reset = true}
	/>
)