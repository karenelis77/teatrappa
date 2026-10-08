import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./ui";
import { Auth, Splash } from "./pages/Entry";
import { Home } from "./pages/Home";
import { Theaters, TheaterDetail, TheaterPlays } from "./pages/Theaters";
import { GenreList, GenrePlays } from "./pages/Genres";
import { PlayDetail } from "./pages/PlayDetail";
import { Checkout, TicketView } from "./pages/Checkout";
import { Favorites, Profile, Settings, Subscriptions } from "./pages/Account";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<Shell />}>
        <Route path="/home" element={<Home />} />
        <Route path="/teatros" element={<Theaters />} />
        <Route path="/generos" element={<GenreList />} />
        <Route path="/id" element={<Profile />} />
      </Route>
      <Route element={<Shell back />}>
        <Route path="/teatros/:id" element={<TheaterDetail />} />
        <Route path="/teatros/:id/obras" element={<TheaterPlays />} />
        <Route path="/generos/:name" element={<GenrePlays />} />
        <Route path="/obras/:id" element={<PlayDetail />} />
        <Route path="/comprar/:id" element={<Checkout />} />
        <Route path="/boleta/:code" element={<TicketView />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/suscripciones" element={<Subscriptions />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
