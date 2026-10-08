// Datos de ejemplo (ficticios) para la demo. No hay backend.

export type Genre = "Drama" | "Comedia" | "Infantil" | "Musical" | "Experimental";
export const GENRES: { name: Genre; emoji: string }[] = [
  { name: "Drama", emoji: "🎭" },
  { name: "Comedia", emoji: "😄" },
  { name: "Infantil", emoji: "🧸" },
  { name: "Musical", emoji: "🎶" },
  { name: "Experimental", emoji: "🔮" },
];

export interface Theater {
  id: string;
  name: string;
  zone: string;
  address: string;
  phone: string;
  email: string;
  social: string;
  capacity: number;
  about: string;
  hue: number;
  lat: number;
  lng: number;
}

export interface Play {
  id: string;
  title: string;
  theaterId: string;
  genre: Genre;
  synopsis: string;
  cast: string[];
  director: string;
  price: number; // COP
  rating: number;
  votes: number;
  popularity: number;
  hue: number;
  emoji: string;
  // días desde hoy en los que hay función, con horarios
  days: number[];
  times: string[];
  featured?: boolean;
}

export const THEATERS: Theater[] = [
  {
    id: "principal",
    name: "Teatro Principal",
    zone: "Centro",
    address: "Cra. 7 #20-15, Centro",
    phone: "+57 601 555 0101",
    email: "contacto@teatroprincipal.example",
    social: "@teatroprincipal",
    capacity: 220,
    about: "Sala a la italiana con más de 80 años de historia, dedicada al gran formato dramático y musical.",
    hue: 345,
    lat: 4.6097,
    lng: -74.0817,
  },
  {
    id: "luna",
    name: "Teatro La Luna",
    zone: "Chapinero",
    address: "Cll. 59 #9-30, Chapinero",
    phone: "+57 601 555 0102",
    email: "hola@teatrolaluna.example",
    social: "@teatrolaluna",
    capacity: 120,
    about: "Un espacio íntimo pensado para público infantil y familiar.",
    hue: 270,
    lat: 4.6486,
    lng: -74.0628,
  },
  {
    id: "telon",
    name: "Sala Telón",
    zone: "La Candelaria",
    address: "Cll. 12 #3-44, La Candelaria",
    phone: "+57 601 555 0103",
    email: "salatelon@example.com",
    social: "@salatelon",
    capacity: 80,
    about: "Sala independiente para teatro experimental y contemporáneo.",
    hue: 200,
    lat: 4.5964,
    lng: -74.0736,
  },
  {
    id: "parque",
    name: "Teatro del Parque",
    zone: "Usaquén",
    address: "Cra. 6 #119-05, Usaquén",
    phone: "+57 601 555 0104",
    email: "info@teatrodelparque.example",
    social: "@teatrodelparque",
    capacity: 160,
    about: "Comedia, musicales y temporadas de verano al aire libre.",
    hue: 35,
    lat: 4.6951,
    lng: -74.0307,
  },
];

export const PLAYS: Play[] = [
  {
    id: "fantasma",
    title: "El Fantasma del Teatro",
    theaterId: "principal",
    genre: "Musical",
    synopsis:
      "Una joven soprano descubre que alguien habita los túneles bajo el escenario y que su voz es la única que puede liberarlo de una vieja maldición.",
    cast: ["Camila Restrepo", "Julián Ortega", "Marta Villalba"],
    director: "Andrés Gómez",
    price: 85000,
    rating: 4.8,
    votes: 342,
    popularity: 98,
    hue: 350,
    emoji: "🎭",
    days: [2, 3, 9, 10, 16],
    times: ["18:30", "21:00"],
    featured: true,
  },
  {
    id: "alicia",
    title: "Alicia en el País de las Maravillas",
    theaterId: "luna",
    genre: "Infantil",
    synopsis: "Una versión musical y llena de títeres del clásico de Lewis Carroll para toda la familia.",
    cast: ["Laura Peña", "Nicolás Arango", "Colectivo Madriguera"],
    director: "Sofía Linares",
    price: 38000,
    rating: 4.7,
    votes: 210,
    popularity: 91,
    hue: 200,
    emoji: "🐇",
    days: [1, 2, 8, 9],
    times: ["11:00", "15:00"],
    featured: true,
  },
  {
    id: "bernarda",
    title: "La Casa de Bernarda Alba",
    theaterId: "principal",
    genre: "Drama",
    synopsis: "Tras la muerte de su marido, Bernarda impone ocho años de luto riguroso a sus cinco hijas.",
    cast: ["Patricia Gil", "Ana M. Cruz", "Lucía Herrera", "Daniela Mora"],
    director: "Carlos Pineda",
    price: 70000,
    rating: 4.6,
    votes: 188,
    popularity: 80,
    hue: 20,
    emoji: "🕯️",
    days: [4, 5, 11, 12],
    times: ["20:00"],
  },
  {
    id: "enredos",
    title: "Enredos de Medianoche",
    theaterId: "parque",
    genre: "Comedia",
    synopsis: "Tres parejas, una cena y un malentendido que se vuelve imposible de explicar.",
    cast: ["Felipe Rueda", "Isabel Cano", "Tomás Beltrán"],
    director: "Valeria Suárez",
    price: 60000,
    rating: 4.4,
    votes: 156,
    popularity: 86,
    hue: 40,
    emoji: "🥂",
    days: [1, 3, 5, 7],
    times: ["19:00", "21:30"],
    featured: true,
  },
  {
    id: "umbral",
    title: "Umbral",
    theaterId: "telon",
    genre: "Experimental",
    synopsis: "Teatro inmersivo para 40 espectadores: cada función cambia según quién la recorra.",
    cast: ["Colectivo Umbral"],
    director: "Mateo Quintero",
    price: 45000,
    rating: 4.9,
    votes: 64,
    popularity: 55,
    hue: 175,
    emoji: "🔮",
    days: [3, 4, 10, 11],
    times: ["20:30"],
  },
  {
    id: "romeo",
    title: "Romeo y Julieta, hoy",
    theaterId: "telon",
    genre: "Drama",
    synopsis: "El clásico de Shakespeare trasladado a dos barrios rivales de una ciudad actual.",
    cast: ["Santiago Mejía", "Valentina Cruz"],
    director: "Elena Duarte",
    price: 50000,
    rating: 4.5,
    votes: 97,
    popularity: 70,
    hue: 310,
    emoji: "🌹",
    days: [2, 6, 9, 13],
    times: ["19:30"],
  },
  {
    id: "circo",
    title: "El Gran Circo de Papel",
    theaterId: "luna",
    genre: "Infantil",
    synopsis: "Acróbatas, magia y sombras chinescas hechas con papel recortado.",
    cast: ["Compañía Origami"],
    director: "Rosa Calderón",
    price: 32000,
    rating: 4.6,
    votes: 121,
    popularity: 74,
    hue: 160,
    emoji: "🎪",
    days: [5, 6, 12, 13],
    times: ["10:30", "14:00"],
  },
  {
    id: "noche",
    title: "Noche de Boleros",
    theaterId: "parque",
    genre: "Musical",
    synopsis: "Un recorrido en vivo por los boleros que marcaron generaciones, con orquesta de cámara.",
    cast: ["Orquesta Latitud", "Rodrigo Ángel"],
    director: "Jorge Salazar",
    price: 75000,
    rating: 4.7,
    votes: 133,
    popularity: 88,
    hue: 15,
    emoji: "🎻",
    days: [6, 7, 13, 14],
    times: ["20:00"],
  },
];

export const PLANS = [
  {
    id: "basica",
    name: "Básica",
    price: 12000,
    perks: ["Descuentos ocasionales", "Alertas de nuevas funciones", "Favoritos ilimitados"],
  },
  {
    id: "cultural",
    name: "Cultural",
    price: 29000,
    perks: ["Acceso anticipado a preventa", "10% en toda la boletería", "Todo lo de Básica"],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 59000,
    perks: ["Funciones especiales", "20% en toda la boletería", "Reserva prioritaria", "Todo lo de Cultural"],
  },
];

// ---- helpers ----
export const theaterById = (id: string) => THEATERS.find((t) => t.id === id)!;
export const playById = (id: string) => PLAYS.find((p) => p.id === id);

export const money = (n: number) => "$" + n.toLocaleString("es-CO") + " COP";

export function dateFromOffset(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });

export interface Show {
  id: string; // playId|day|time
  playId: string;
  day: number;
  time: string;
}

export function showsOf(play: Play): Show[] {
  return play.days.flatMap((day) =>
    play.times.map((time) => ({ id: `${play.id}|${day}|${time}`, playId: play.id, day, time })),
  );
}

// Venta "base" determinista para que cada función se vea distinta
export function baseSold(showId: string, capacity: number): number {
  let h = 0;
  for (const c of showId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Math.floor(capacity * (0.35 + (h % 60) / 100));
}

export function activeDatesLabel(play: Play): string {
  const first = fmtDate(dateFromOffset(Math.min(...play.days)));
  const last = fmtDate(dateFromOffset(Math.max(...play.days)));
  return `${first} – ${last}`;
}
