import { useEffect, useState } from "react";
import { ComputerDesktopIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid'

type Theme = "system" | "light" | "dark";

const ThemeSelect = () => {
    const [theme, setTheme] = useState<Theme>(localStorage.getItem("theme") as Theme ?? "system");

    // Save the theme to localStorage whenever it changes
    useEffect(() => {
        document.querySelector("html")?.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div>
            <button className="p-0! m-0! rounded-[50%]! h-10 w-10 flex justify-center items-center" onClick={() => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")}>
                {theme == "system" && <ComputerDesktopIcon className="size-4 inline cursor-pointer" title='System' />}
                {theme == "light" && <SunIcon className="size-4 inline cursor-pointer" title='Light' />}
                {theme == "dark" && <MoonIcon className="size-4 inline cursor-pointer" title='Dark' />}
            </button>
        </div>
    )
}

export default ThemeSelect;