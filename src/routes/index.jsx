import { Routes, Route } from "react-router-dom";

import Menu from "../pages/Menu";
import PuzzlePage from "../pages/PuzzlePage";
import Cake from "../pages/CakePage";
import Final from "../pages/Final";

export default function AppRoutes() {
    return (
        <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/puzzle-1" element={<PuzzlePage key="p1" levelIndex={0} />} />
        <Route path="/puzzle-2" element={<PuzzlePage key="p2" levelIndex={1} />} />
        <Route path="/puzzle-3" element={<PuzzlePage key="p3" levelIndex={2} />} />
        <Route path="/cake" element={<Cake />} />
        <Route path="/final" element={<Final />} />
        </Routes>
    );
}
