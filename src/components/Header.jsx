import ResourceBar from "./ResourceBar";
import NavBar from "./NavBar";

export default function Header({ cash, prestige, onReset }) {
    return (
        <>
            <ResourceBar 
                cash={cash}
                prestige={prestige}
                onReset={onReset}
            />
            <NavBar />
        </>
    )
}