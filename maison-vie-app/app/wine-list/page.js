"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC WINE DATA  — La Carte des Vins 2026
// Prices are intentionally null: they are synchronised from the internal DB.
// The `price_variants` field supports multiple volumes (e.g. Sauternes 37.5cl / 75cl).
// wine_style is the PRIMARY classification axis (Level 1).
// ─────────────────────────────────────────────────────────────────────────────

const WINE_STYLES = [
  { code: "champagne",  label: "Champagne",           labelFr: "Champagne",            icon: "✦" },
  { code: "sparkling",  label: "Sparkling",            labelFr: "Crémants & Pétillants", icon: "◇" },
  { code: "rose",       label: "Rosé",                 labelFr: "Rosés",                icon: "◈" },
  { code: "white",      label: "White",                labelFr: "Vins Blancs",          icon: "○" },
  { code: "red",        label: "Red",                  labelFr: "Vins Rouges",          icon: "●" },
  { code: "dessert",    label: "Dessert",              labelFr: "Vins de Dessert",      icon: "◆" },
];

const STATIC_WINES = [
  // ── CHAMPAGNE ───────────────────────────────────────────────────────────────
  {
    id: "champ-taittinger-nv",
    wine_style: "champagne",
    name: "Champagne Taittinger, Brut Réserve NV",
    producer: "Champagne Taittinger",
    cuvee: "Brut Réserve",
    vintage: "NV",
    grape_variety: "Pinot Noir • Chardonnay • Pinot Meunier",
    appellation: "Champagne AOC",
    region: "Reims",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "champ-moet-imperial-nv",
    wine_style: "champagne",
    name: "Champagne Moët & Chandon, Brut Impérial NV",
    producer: "Moët & Chandon",
    cuvee: "Brut Impérial",
    vintage: "NV",
    grape_variety: "Pinot Noir • Chardonnay • Pinot Meunier",
    appellation: "Champagne AOC",
    region: "Épernay",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── SPARKLING ────────────────────────────────────────────────────────────────
  {
    id: "spark-pierre-larousse-brut",
    wine_style: "sparkling",
    name: "Pierre Larousse Sparkling Brut",
    producer: "Pierre Larousse",
    cuvee: null,
    vintage: null,
    grape_variety: "Chardonnay",
    appellation: "Vin de France",
    region: "France",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,          // Available Au Verre — glass price in AU_VERRE_LIST
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "spark-cremant-bourgogne-buxy",
    wine_style: "sparkling",
    name: "Crémant de Bourgogne Brut Vignerons de Buxy",
    producer: "Vignerons de Buxy",
    cuvee: null,
    vintage: null,
    grape_variety: "Chardonnay • Aligoté • Gamay",
    appellation: "Bourgogne AOC",
    region: "Bourgogne",
    country: "France",
    volume: "750ml",
    sommelier_note: "Méthode traditionnelle — Refreshing aperitif, versatile companion.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── ROSÉ ────────────────────────────────────────────────────────────────────
  {
    id: "rose-bertrand-gris-blanc",
    wine_style: "rose",
    name: "Gérard Bertrand « Gris Blanc » IGP",
    producer: "Gérard Bertrand",
    cuvee: "Gris Blanc",
    vintage: null,
    grape_variety: "Grenache Gris • Grenache Noir",
    appellation: "Pays d'Oc IGP",
    region: "Languedoc",
    country: "France",
    volume: "750ml",
    sommelier_note: "Pale, dry, mineral — the Mediterranean in a glass.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "rose-croix-peyrassol",
    wine_style: "rose",
    name: "Croix de Peyrassol Rosé IGP",
    producer: "Domaine de Peyrassol",
    cuvee: "Croix de Peyrassol",
    vintage: null,
    grape_variety: "Cinsault • Grenache • Syrah",
    appellation: "Provence IGP",
    region: "Provence",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — France Bordeaux ──────────────────────────────────────────────────
  {
    id: "white-baratet-sauv-blanc",
    wine_style: "white",
    name: "Château Baratet, Sauvignon Blanc",
    producer: "Château Baratet",
    cuvee: null,
    vintage: null,
    grape_variety: "Sauvignon Blanc",
    appellation: "Bordeaux AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,         // Available Au Verre
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-grand-bateau-bdx",
    wine_style: "white",
    name: "Grand Bateau Bordeaux Blanc (by Beychevelle)",
    producer: "Château Beychevelle",
    cuvee: "Grand Bateau",
    vintage: null,
    grape_variety: "Sauvignon Blanc",
    appellation: "Bordeaux AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-thienpont-vigne-argent",
    wine_style: "white",
    name: "F. Thienpont « La Vigne d'Argent »",
    producer: "F. Thienpont",
    cuvee: "La Vigne d'Argent",
    vintage: null,
    grape_variety: "Sauvignon Blanc",
    appellation: "Bordeaux AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-ronan-clinet-blanc",
    wine_style: "white",
    name: "Ronan by Clinet Bordeaux Blanc",
    producer: "Château Clinet",
    cuvee: "Ronan by Clinet",
    vintage: null,
    grape_variety: "Sauvignon Blanc • Sémillon",
    appellation: "Vin de France",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-thienpont-puygueraud-blanc",
    wine_style: "white",
    name: "N. Thienpont, Château Puygueraud Blanc",
    producer: "Nicolas Thienpont",
    cuvee: "Château Puygueraud Blanc",
    vintage: null,
    grape_variety: "Sauvignon Gris • Sauvignon Blanc",
    appellation: "Francs Côtes de Bordeaux AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — France Loire ─────────────────────────────────────────────────────
  {
    id: "white-jolivet-attitude",
    wine_style: "white",
    name: "Pascal Jolivet « Attitude » Sauvignon Blanc",
    producer: "Pascal Jolivet",
    cuvee: "Attitude",
    vintage: null,
    grape_variety: "Sauvignon Blanc (biologique)",
    appellation: "Val de Loire IGP",
    region: "Loire Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: "Flint, gooseberry, grapefruit — the benchmark of aromatic Sauvignon Blanc.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — France Alsace ────────────────────────────────────────────────────
  {
    id: "white-lorentz-riesling",
    wine_style: "white",
    name: "Gustave Lorentz Riesling",
    producer: "Gustave Lorentz",
    cuvee: null,
    vintage: null,
    grape_variety: "Riesling",
    appellation: "Alsace AOC",
    region: "Alsace",
    country: "France",
    volume: "750ml",
    sommelier_note: "Dry, mineral — long finishes ideal for Asian spice.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — France Burgundy ──────────────────────────────────────────────────
  {
    id: "white-latour-chablis-chanfleure",
    wine_style: "white",
    name: "Louis Latour Chablis « La Chanfleure »",
    producer: "Louis Latour",
    cuvee: "La Chanfleure",
    vintage: null,
    grape_variety: "Chardonnay",
    appellation: "Chablis AOC",
    region: "Bourgogne — Chablis",
    country: "France",
    volume: "750ml",
    sommelier_note: "Oyster-shell tension, pure mineral expression.",
    food_pairing: "Khánh Hòa scallops, Miso-marinated cod",
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },
  {
    id: "white-latour-pouilly-fuisse",
    wine_style: "white",
    name: "Louis Latour Pouilly-Fuissé",
    producer: "Louis Latour",
    cuvee: null,
    vintage: null,
    grape_variety: "Chardonnay",
    appellation: "Pouilly-Fuissé AOC",
    region: "Bourgogne — Mâconnais",
    country: "France",
    volume: "750ml",
    sommelier_note: "Roundness and generous body.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },

  // ── WHITE — France Rhône ─────────────────────────────────────────────────────
  {
    id: "white-chapoutier-belleruche-blanc",
    wine_style: "white",
    name: "M. Chapoutier « Belleruche » Côtes du Rhône Blanc",
    producer: "M. Chapoutier",
    cuvee: "Belleruche",
    vintage: null,
    grape_variety: "Grenache Blanc • Clairette",
    appellation: "Côtes du Rhône AOC",
    region: "Rhône Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-magrez-prelat-blanc",
    wine_style: "white",
    name: "Bernard Magrez « Le Prélat » Blanc",
    producer: "Bernard Magrez",
    cuvee: "Le Prélat",
    vintage: null,
    grape_variety: "Grenache Blanc • Viognier • Roussanne",
    appellation: "Côtes du Rhône Villages Laudun AOP",
    region: "Rhône Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-chapoutier-mirabel-viognier",
    wine_style: "white",
    name: "M. Chapoutier Domaine des Granges de Mirabel",
    producer: "M. Chapoutier",
    cuvee: "Domaine des Granges de Mirabel",
    vintage: null,
    grape_variety: "Viognier (biodynamique)",
    appellation: "Rhône Valley IGP",
    region: "Rhône Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: "Apricot and honeysuckle — biodynamic viticulture.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — Spain ────────────────────────────────────────────────────────────
  {
    id: "white-torres-sangre-blanco",
    wine_style: "white",
    name: "Torres « Sangre de Toro » Blanco",
    producer: "Torres",
    cuvee: "Sangre de Toro",
    vintage: null,
    grape_variety: "Parellada • Garnacha Blanca",
    appellation: "Catalunya DO",
    region: "Catalunya",
    country: "Spain",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — Chile ────────────────────────────────────────────────────────────
  {
    id: "white-concha-frontera-sauv",
    wine_style: "white",
    name: "Concha y Toro « Frontera » Sauvignon Blanc",
    producer: "Concha y Toro",
    cuvee: "Frontera",
    vintage: null,
    grape_variety: "Sauvignon Blanc",
    appellation: "D.O. Valle Central",
    region: "Valle Central",
    country: "Chile",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,          // Available Au Verre
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "white-concha-marques-chardonnay",
    wine_style: "white",
    name: "Concha y Toro « Marqués de Casa Concha » Chardonnay",
    producer: "Concha y Toro",
    cuvee: "Marqués de Casa Concha",
    vintage: null,
    grape_variety: "Chardonnay",
    appellation: "Limarí Valley DO",
    region: "Limarí Valley",
    country: "Chile",
    volume: "750ml",
    sommelier_note: "Cool Pacific coast — vibrant fruit, solar generosity.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — Argentina ────────────────────────────────────────────────────────
  {
    id: "white-kaiken-sauv-semillon",
    wine_style: "white",
    name: "Kaiken Estate Sauvignon Blanc-Sémillon",
    producer: "Kaiken",
    cuvee: "Estate",
    vintage: null,
    grape_variety: "Sauvignon Blanc • Sémillon",
    appellation: "Mendoza",
    region: "Mendoza",
    country: "Argentina",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── WHITE — South Africa ─────────────────────────────────────────────────────
  {
    id: "white-lebonheur-chardonnay",
    wine_style: "white",
    name: "Le Bonheur « The Eagle's Lair » Chardonnay",
    producer: "Le Bonheur",
    cuvee: "The Eagle's Lair",
    vintage: null,
    grape_variety: "Chardonnay",
    appellation: "Stellenbosch WO",
    region: "Stellenbosch",
    country: "South Africa",
    volume: "750ml",
    sommelier_note: "Granite soils — ripe, structured, age-worthy.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — France Bordeaux Left Bank ─────────────────────────────────────────
  {
    id: "red-noaillac-medoc",
    wine_style: "red",
    name: "Château Noaillac, Médoc Cru Bourgeois",
    producer: "Château Noaillac",
    cuvee: null,
    vintage: null,
    grape_variety: "Merlot • Cabernet Sauvignon",
    appellation: "Médoc AOC",
    region: "Médoc",
    country: "France",
    volume: "750ml",
    sommelier_note: "Cabernet Sauvignon-led blends with graphite and noble tannin — the classical architecture of red wine.",
    food_pairing: "Wagyu",
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },
  {
    id: "red-haut-selve-graves",
    wine_style: "red",
    name: "Château Haut Selve, Graves",
    producer: "Château Haut Selve",
    cuvee: null,
    vintage: null,
    grape_variety: "Merlot • Cabernet Sauvignon",
    appellation: "Graves AOC",
    region: "Graves",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-mouton-cadet-pauillac",
    wine_style: "red",
    name: "Baron P. de Rothschild « Mouton Cadet » Réserve Pauillac",
    producer: "Baron Philippe de Rothschild",
    cuvee: "Mouton Cadet Réserve",
    vintage: null,
    grape_variety: "Cabernet Sauvignon • Merlot • Cabernet Franc",
    appellation: "Pauillac AOC",
    region: "Pauillac — Médoc",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: "Wagyu",
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },

  // ── RED — France Bordeaux Right Bank ────────────────────────────────────────
  {
    id: "red-mont-perat-rouge",
    wine_style: "red",
    name: "Château Mont-Pérat Rouge",
    producer: "Château Mont-Pérat",
    cuvee: null,
    vintage: null,
    grape_variety: "Merlot • Cabernet Franc • Cabernet Sauvignon",
    appellation: "Bordeaux AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: "Merlot-led, opulent, velvet-textured — the sensuality of Libourne.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-haut-saint-brice-semilion",
    wine_style: "red",
    name: "Château Haut Saint-Brice, Saint-Émilion Grand Cru",
    producer: "Château Haut Saint-Brice",
    cuvee: null,
    vintage: null,
    grape_variety: "Merlot • Cabernet Franc",
    appellation: "Saint-Émilion Grand Cru AOC",
    region: "Saint-Émilion",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },
  {
    id: "red-haut-rocher-semilion",
    wine_style: "red",
    name: "Château Haut-Rocher, Saint-Émilion Grand Cru",
    producer: "Château Haut-Rocher",
    cuvee: null,
    vintage: null,
    grape_variety: "Merlot • Cabernet Franc",
    appellation: "Saint-Émilion Grand Cru AOC",
    region: "Saint-Émilion",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },

  // ── RED — France Bordeaux AOC / Côtes ────────────────────────────────────────
  {
    id: "red-baratet-cab-sauv",
    wine_style: "red",
    name: "Château Baratet, Cabernet Sauvignon",
    producer: "Château Baratet",
    cuvee: null,
    vintage: null,
    grape_variety: "Cabernet Sauvignon",
    appellation: "Bordeaux Supérieur AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: "Everyday brilliance from an emblematic Bordelais house.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,           // Available Au Verre
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-mouton-cadet-classique",
    wine_style: "red",
    name: "Baron P. de Rothschild « Mouton Cadet » Classique Rouge",
    producer: "Baron Philippe de Rothschild",
    cuvee: "Mouton Cadet Classique",
    vintage: null,
    grape_variety: "Merlot • Cabernet Sauvignon • Cabernet Franc",
    appellation: "Bordeaux AOC",
    region: "Bordeaux",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — France Burgundy ────────────────────────────────────────────────────
  {
    id: "red-latour-bourgogne-pinot",
    wine_style: "red",
    name: "Louis Latour Bourgogne Pinot Noir",
    producer: "Louis Latour",
    cuvee: null,
    vintage: null,
    grape_variety: "Pinot Noir",
    appellation: "Bourgogne AOC",
    region: "Bourgogne",
    country: "France",
    volume: "750ml",
    sommelier_note: "Translucent, perfumed, silken — Pinot Noir on the southern cusp of Bourgogne.",
    food_pairing: "Vietnamese duck breast",
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },

  // ── RED — France Rhône ───────────────────────────────────────────────────────
  {
    id: "red-chapoutier-belleruche-rouge",
    wine_style: "red",
    name: "M. Chapoutier « Belleruche » Côtes du Rhône Rouge",
    producer: "M. Chapoutier",
    cuvee: "Belleruche",
    vintage: null,
    grape_variety: "Grenache • Syrah",
    appellation: "Côtes du Rhône AOC",
    region: "Rhône Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: "Pepper and smoked violet.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-magrez-prelat-rouge",
    wine_style: "red",
    name: "Bernard Magrez « Le Prélat » Rouge",
    producer: "Bernard Magrez",
    cuvee: "Le Prélat",
    vintage: null,
    grape_variety: "Grenache Noir • Syrah",
    appellation: "Côtes du Rhône Villages Laudun AOP",
    region: "Rhône Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-chapoutier-meysonniers-crozes",
    wine_style: "red",
    name: "M. Chapoutier « Les Meysonniers » Crozes-Hermitage",
    producer: "M. Chapoutier",
    cuvee: "Les Meysonniers",
    vintage: null,
    grape_variety: "Syrah (biologique)",
    appellation: "Crozes-Hermitage AOC",
    region: "Rhône Valley",
    country: "France",
    volume: "750ml",
    sommelier_note: "Organic viticulture — smoky, dark-spiced Syrah.",
    food_pairing: "Wagyu",
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: true,
    available: true,
  },

  // ── RED — Italy ──────────────────────────────────────────────────────────────
  {
    id: "red-talo-primitivo-manduria",
    wine_style: "red",
    name: "Talò Primitivo di Manduria « San Marzano »",
    producer: "San Marzano",
    cuvee: "Talò",
    vintage: null,
    grape_variety: "Primitivo",
    appellation: "Primitivo di Manduria DOP",
    region: "Puglia",
    country: "Italy",
    volume: "750ml",
    sommelier_note: "Sun-drenched — generous, warm, dark-fruited.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — Spain ──────────────────────────────────────────────────────────────
  {
    id: "red-torres-sangre-original",
    wine_style: "red",
    name: "Torres « Sangre de Toro » Original",
    producer: "Torres",
    cuvee: "Sangre de Toro",
    vintage: null,
    grape_variety: "Garnacha • Cariñena",
    appellation: "Catalunya DO",
    region: "Catalunya",
    country: "Spain",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-marques-caceres-crianza",
    wine_style: "red",
    name: "Marqués de Cáceres Crianza",
    producer: "Marqués de Cáceres",
    cuvee: "Crianza",
    vintage: null,
    grape_variety: "Tempranillo",
    appellation: "Rioja DOCa",
    region: "Rioja",
    country: "Spain",
    volume: "750ml",
    sommelier_note: "Warmth and savoury oak — Rioja Tempranillo.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — Argentina ──────────────────────────────────────────────────────────
  {
    id: "red-kaiken-malbec",
    wine_style: "red",
    name: "Kaiken Estate Malbec",
    producer: "Kaiken",
    cuvee: "Estate",
    vintage: null,
    grape_variety: "Malbec",
    appellation: "Mendoza",
    region: "Mendoza",
    country: "Argentina",
    volume: "750ml",
    sommelier_note: "Mendoza is the world capital of Malbec — concentrated fruit, balanced acidity.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — New Zealand ────────────────────────────────────────────────────────
  {
    id: "red-villa-maria-cab-merlot",
    wine_style: "red",
    name: "Villa Maria « Private Bin » Cabernet-Merlot",
    producer: "Villa Maria",
    cuvee: "Private Bin",
    vintage: null,
    grape_variety: "Cabernet Sauvignon • Merlot",
    appellation: "Hawke's Bay GI",
    region: "Hawke's Bay",
    country: "New Zealand",
    volume: "750ml",
    sommelier_note: "Hawke's Bay — elegant Bordeaux-style blend.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — Chile ──────────────────────────────────────────────────────────────
  {
    id: "red-concha-frontera-cab",
    wine_style: "red",
    name: "Concha y Toro « Frontera » Cabernet Sauvignon",
    producer: "Concha y Toro",
    cuvee: "Frontera",
    vintage: null,
    grape_variety: "Cabernet Sauvignon",
    appellation: "D.O. Valle Central",
    region: "Valle Central",
    country: "Chile",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,           // Available Au Verre
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-torres-las-mulas-cab",
    wine_style: "red",
    name: "Miguel Torres « Las Mulas » Cabernet Sauvignon",
    producer: "Miguel Torres",
    cuvee: "Las Mulas",
    vintage: null,
    grape_variety: "Cabernet Sauvignon (biologique)",
    appellation: "D.O. Central Valley",
    region: "Central Valley",
    country: "Chile",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-concha-marques-cab",
    wine_style: "red",
    name: "Concha y Toro « Marqués de Casa Concha » Cabernet Sauvignon",
    producer: "Concha y Toro",
    cuvee: "Marqués de Casa Concha",
    vintage: null,
    grape_variety: "Cabernet Sauvignon",
    appellation: "Maipo Valley DO",
    region: "Maipo Valley",
    country: "Chile",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },
  {
    id: "red-montes-alpha-cab",
    wine_style: "red",
    name: "Montes Alpha Cabernet Sauvignon",
    producer: "Montes",
    cuvee: "Alpha",
    vintage: null,
    grape_variety: "Cabernet Sauvignon • Merlot",
    appellation: "Colchagua Valley DO",
    region: "Colchagua Valley",
    country: "Chile",
    volume: "750ml",
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── RED — South Africa ───────────────────────────────────────────────────────
  {
    id: "red-lebonheur-cab-sauv",
    wine_style: "red",
    name: "Le Bonheur Cabernet Sauvignon",
    producer: "Le Bonheur",
    cuvee: null,
    vintage: null,
    grape_variety: "Cabernet Sauvignon",
    appellation: "Stellenbosch WO",
    region: "Stellenbosch",
    country: "South Africa",
    volume: "750ml",
    sommelier_note: "Granite soils — ripe, structured, age-worthy.",
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    price_variants: null,
    vino_club_eligible: false,
    available: true,
  },

  // ── DESSERT ──────────────────────────────────────────────────────────────────
  {
    id: "dessert-mouton-sauternes",
    wine_style: "dessert",
    name: "Baron P. de Rothschild « Mouton Cadet » Sauternes",
    producer: "Baron Philippe de Rothschild",
    cuvee: "Mouton Cadet Sauternes",
    vintage: null,
    grape_variety: "Sémillon • Sauvignon Blanc",
    appellation: "Sauternes AOC",
    region: "Sauternes — Bordeaux",
    country: "France",
    volume: null,               // Multi-volume — see price_variants
    sommelier_note: null,
    food_pairing: null,
    price_bottle: null,
    price_glass: null,
    // price_variants: driven entirely from DB; schema is [{volume, price_bottle}]
    price_variants: [
      { volume: "37.5 cl", price_bottle: null },
      { volume: "75 cl",   price_bottle: null },
    ],
    vino_club_eligible: true,
    available: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AU VERRE — Wine by the Glass  (125 ml)
// Prices null: synchronised from DB.
// ─────────────────────────────────────────────────────────────────────────────
const AU_VERRE_LIST = [
  { id: "av-pierre-larousse-brut",      name: "Pierre Larousse Sparkling Brut",             grape: "Chardonnay",       style: "Sparkling", appellation: "Vin de France — France",          price_glass: null },
  { id: "av-concha-frontera-sauv",      name: "Concha y Toro « Frontera » Sauvignon Blanc", grape: "Sauvignon Blanc",  style: "White",     appellation: "D.O. Valle Central — Chile",      price_glass: null },
  { id: "av-baratet-sauv",             name: "Château Baratet Sauvignon Blanc",             grape: "Sauvignon Blanc",  style: "White",     appellation: "Bordeaux AOC — France",           price_glass: null },
  { id: "av-dufouleur-pinot-rose",      name: "Dufouleur Père & Fils Pinot Noir Rosé",       grape: "Pinot Noir",       style: "Rosé",      appellation: "Vin de France — France",          price_glass: null },
  { id: "av-concha-frontera-cab",       name: "Concha y Toro « Frontera » Cabernet Sauvignon", grape: "Cabernet Sauvignon", style: "Red",  appellation: "Vin de France — France",          price_glass: null },
  { id: "av-baratet-cab",              name: "Château Baratet Cabernet Sauvignon",           grape: "Cabernet Sauvignon", style: "Red",   appellation: "Bordeaux Supérieur AOC — France",  price_glass: null },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────
const I18N = {
  vi: {
    pageTitle: "La Carte des Vins",
    heroLabel: "Hầm Rượu Thượng Hạng",
    heroSubtitle: "Một cuộc đối thoại tĩnh lặng giữa hai nền văn hoá — tiếng nói cổ điển của Pháp và giai điệu hào phóng của Tân Thế Giới",
    sommelierNote: "Lời ngỏ của Giám đốc Rượu vang",
    filterAll: "Tất Cả",
    labelGrape: "Giống nho",
    labelRegion: "Vùng trồng",
    labelAppellation: "Appellation",
    labelVintage: "Niên vụ",
    labelVolume: "Dung tích",
    labelFoodPairing: "Kết hợp món ăn",
    priceOnRequest: "Giá theo yêu cầu",
    auVerreTitle: "Au Verre · Rượu Theo Ly",
    auVerreSubtitle: "Tuyển chọn để thưởng thức riêng lẻ hoặc theo thực đơn dégustation · 125 ml",
    glassPrice: "Giá ly",
    vinoClub: "VINO Club",
    btnReserve: "Đặt bàn & tư vấn rượu vang",
    btnBack: "Quay lại trang chủ",
    serviceNotes: "Lưu ý phục vụ",
    loading: "Đang tải danh sách rượu vang...",
    empty: "Hiện chưa có chai rượu nào trong phong cách này.",
  },
  en: {
    pageTitle: "La Carte des Vins",
    heroLabel: "Grand Wine Cellar",
    heroSubtitle: "A quiet dialogue between two cultures — the classic voices of France and the generous accents of the New World",
    sommelierNote: "A Note from the Wine Director",
    filterAll: "All Styles",
    labelGrape: "Grape Variety",
    labelRegion: "Region",
    labelAppellation: "Appellation",
    labelVintage: "Vintage",
    labelVolume: "Volume",
    labelFoodPairing: "Food Pairing",
    priceOnRequest: "Price on request",
    auVerreTitle: "Au Verre · Wine by the Glass",
    auVerreSubtitle: "A curated house pour — ideal for the solo diner or the tasting-menu guest · 125 ml",
    glassPrice: "Glass",
    vinoClub: "VINO Club",
    btnReserve: "Book a table & consult our sommelier",
    btnBack: "Back to Home",
    serviceNotes: "Service Notes",
    loading: "Loading wine list...",
    empty: "No wines available in this style.",
  },
  fr: {
    pageTitle: "La Carte des Vins",
    heroLabel: "La Cave d'Exception",
    heroSubtitle: "Un dialogue silencieux entre deux cultures — les voix classiques de France et les accents généreux du Nouveau Monde",
    sommelierNote: "Note du Sommelier",
    filterAll: "Tous les Styles",
    labelGrape: "Cépage",
    labelRegion: "Région",
    labelAppellation: "Appellation",
    labelVintage: "Millésime",
    labelVolume: "Contenance",
    labelFoodPairing: "Accord mets-vins",
    priceOnRequest: "Prix sur demande",
    auVerreTitle: "Au Verre",
    auVerreSubtitle: "Une sélection maison — pour le dîneur solitaire ou le menu dégustation · 125 ml",
    glassPrice: "Au Verre",
    vinoClub: "VINO Club",
    btnReserve: "Réserver et consulter notre Sommelier",
    btnBack: "Retour à l'accueil",
    serviceNotes: "Notes de Service",
    loading: "Chargement de la cave...",
    empty: "Aucun vin disponible dans ce style.",
  },
  ja: {
    pageTitle: "La Carte des Vins",
    heroLabel: "グランド・ワインセラー",
    heroSubtitle: "二つの文化の静かな対話 — フランスの古典的な声と新世界の寛大なアクセント",
    sommelierNote: "ワインディレクターより",
    filterAll: "すべてのスタイル",
    labelGrape: "ぶどう品種",
    labelRegion: "産地",
    labelAppellation: "アペラシオン",
    labelVintage: "ヴィンテージ",
    labelVolume: "容量",
    labelFoodPairing: "料理との相性",
    priceOnRequest: "価格はお問い合わせください",
    auVerreTitle: "Au Verre · グラスワイン",
    auVerreSubtitle: "お一人様や試食コースのゲストのためにセレクトしたハウスポア · 125 ml",
    glassPrice: "グラス",
    vinoClub: "VINO Club",
    btnReserve: "ご予約・ソムリエ相談",
    btnBack: "ホームに戻る",
    serviceNotes: "サービスノート",
    loading: "ワインリストを読み込み中...",
    empty: "このスタイルのワインは現在ございません。",
  },
  ko: {
    pageTitle: "La Carte des Vins",
    heroLabel: "그랜드 와인 셀러",
    heroSubtitle: "두 문화의 고요한 대화 — 프랑스의 클래식한 목소리와 신세계의 관대한 악센트",
    sommelierNote: "와인 디렉터의 노트",
    filterAll: "전체 스타일",
    labelGrape: "품종",
    labelRegion: "생산 지역",
    labelAppellation: "아펠라시옹",
    labelVintage: "빈티지",
    labelVolume: "용량",
    labelFoodPairing: "푸드 페어링",
    priceOnRequest: "가격 문의",
    auVerreTitle: "Au Verre · 글라스 와인",
    auVerreSubtitle: "단독 다이닝 또는 테이스팅 메뉴 게스트를 위한 하우스 셀렉션 · 125 ml",
    glassPrice: "글라스",
    vinoClub: "VINO Club",
    btnReserve: "예약 및 소믈리에 상담",
    btnBack: "홈으로 돌아가기",
    serviceNotes: "서비스 안내",
    loading: "와인 목록을 불러오는 중...",
    empty: "이 스타일에 제공되는 와인이 없습니다.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SOMMELIER NOTE (trilingual, verbatim from Wine List 2026.md)
// ─────────────────────────────────────────────────────────────────────────────
const SOMMELIER_INTRO = {
  fr: `The wine list of Maison Vie is conceived as a quiet dialogue between two cultures — the classic voices of France and the generous accents of the New World — spoken in harmony with the terroirs and aromatic herbs of Vietnam. Every bottle listed here has been selected to accompany a specific gesture of the chef.`,
  vi: `List rượu của Maison Vie được kiến tạo như một cuộc đối thoại tĩnh lặng giữa hai nền văn hoá — tiếng nói cổ điển của Pháp và giai điệu hào phóng của Tân Thế Giới — hoà nhịp cùng thổ nhưỡng và thảo mộc đặc hữu Việt Nam.`,
  service: [
    "All prices are in (,000) VND and exclude 10 % VAT and 5 % service charge.",
    "Champagne & white wines served at 8–10 °C · Rosé at 10–12 °C · Light reds at 14 °C · Structured reds at 16–18 °C.",
    "All bottles are decanted or polished at the table upon request.",
    "A corkage fee of VND 500,000 per 750 ml bottle applies to wines brought from outside; limit 2 bottles per table.",
    "Vintages may vary with availability. Our Sommelier will inform you of any substitution before service.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLE TYPE BADGE COLORS
// ─────────────────────────────────────────────────────────────────────────────
const STYLE_GLASS_COLOR = {
  Sparkling: "#E8D5B7",
  White:     "#D4C17F",
  Rosé:      "#E8A0A0",
  Red:       "#8B2635",
};

// ─────────────────────────────────────────────────────────────────────────────
// WINE CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function WineCard({ wine, t, index }) {
  const [expanded, setExpanded] = useState(false);
  const hasNote = wine.sommelier_note;
  const hasPairing = wine.food_pairing;
  const isMultiVolume = wine.price_variants && wine.price_variants.length > 0;

  return (
    <div
      className="group relative gold-border-glow bg-dark-400/95 backdrop-blur-md animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* VINO Club badge */}
      {wine.vino_club_eligible && (
        <div className="absolute top-0 right-0 bg-gold-500/10 border-b border-l border-gold-500/20 px-3 py-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-500 font-semibold">{t.vinoClub}</span>
        </div>
      )}

      <div className="p-7 md:p-9 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">

        {/* ── LEFT: Identity ─────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Appellation line */}
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold-500/70 font-semibold mb-2 truncate">
            {wine.appellation}
          </p>

          {/* Wine name */}
          <h3 className="text-xl md:text-2xl font-light text-stone-100 font-luxury leading-tight mb-4 group-hover:text-gold-200 transition-premium">
            {wine.name}
          </h3>

          {/* Producer — italic, muted */}
          {wine.producer && (
            <p className="text-sm text-stone-500 italic mb-5">{wine.producer}</p>
          )}

          {/* Specs grid — 2 × 2 / 2 × 3 */}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">

            <div>
              <dt className="text-[11px] uppercase tracking-widest text-stone-600 mb-0.5">{t.labelGrape}</dt>
              <dd className="text-[14px] text-stone-300 font-medium leading-relaxed">{wine.grape_variety || "—"}</dd>
            </div>

            <div>
              <dt className="text-[11px] uppercase tracking-widest text-stone-600 mb-0.5">{t.labelRegion}</dt>
              <dd className="text-[14px] text-stone-300 font-medium">{wine.region || "—"}</dd>
            </div>

            <div>
              <dt className="text-[11px] uppercase tracking-widest text-stone-600 mb-0.5">{t.labelVintage}</dt>
              <dd className="text-[14px] text-gold-400 font-semibold font-luxury">{wine.vintage || "—"}</dd>
            </div>

            <div>
              <dt className="text-[11px] uppercase tracking-widest text-stone-600 mb-0.5">{t.labelVolume}</dt>
              <dd className="text-[14px] text-stone-400">{wine.volume || "—"}</dd>
            </div>

            {wine.country && (
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-widest text-stone-600 mb-0.5">Pays / Quốc gia</dt>
                <dd className="text-[14px] text-stone-400">{wine.country}</dd>
              </div>
            )}

          </dl>

          {/* Expandable: sommelier note + food pairing */}
          {(hasNote || hasPairing) && (
            <div className="mt-5">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[12px] uppercase tracking-widest text-gold-500/60 hover:text-gold-400 transition-premium flex items-center gap-1.5"
              >
                <span>{expanded ? "−" : "+"}</span>
                <span>Note du Sommelier</span>
              </button>

              {expanded && (
                <div className="mt-4 pl-4 border-l border-gold-500/20 space-y-3 animate-fade-in">
                  {hasNote && (
                    <p className="text-[14px] text-stone-400 font-light italic leading-relaxed">
                      {wine.sommelier_note}
                    </p>
                  )}
                  {hasPairing && (
                    <p className="text-[13px] text-stone-500">
                      <span className="text-stone-600 uppercase tracking-wider text-[11px] mr-2">{t.labelFoodPairing}:</span>
                      {wine.food_pairing}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: Price block ─────────────────────────── */}
        <div className="shrink-0 flex flex-col items-end justify-start md:border-l md:border-white/5 md:pl-8 gap-4 min-w-[130px]">

          {isMultiVolume ? (
            // Multi-volume (e.g. Sauternes)
            <div className="space-y-3 text-right">
              {wine.price_variants.map((v) => (
                <div key={v.volume}>
                  <div className="text-[12px] uppercase tracking-widest text-stone-600 mb-0.5">{v.volume}</div>
                  <div className="text-base font-light text-stone-500 italic">{t.priceOnRequest}</div>
                </div>
              ))}
            </div>
          ) : (
            // Standard single-volume
            <div className="text-right">
              <div className="text-[12px] uppercase tracking-widest text-stone-600 mb-1">{t.labelVolume}</div>
              <div className="text-base font-light text-stone-500 italic">{t.priceOnRequest}</div>
            </div>
          )}

        </div>

      </div>

      {/* Subtle bottom accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ style, count }) {
  return (
    <div className="flex items-center gap-6 mb-10 mt-4">
      <span className="text-3xl text-gold-500/40 font-luxury">{style.icon}</span>
      <div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-gold-500/50 font-semibold mb-0.5">
          {style.labelFr}
        </p>
        <h2 className="text-2xl md:text-3xl font-light text-stone-100 font-luxury tracking-wide">
          {style.label}
        </h2>
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-gold-500/20 to-transparent ml-4" />
      <span className="text-[10px] text-stone-600 tracking-widest">{count} sélections</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function WineListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";
  const t = I18N[lang] || I18N.vi;

  const [activeStyle, setActiveStyle] = useState("all");
  const [dbWines, setDbWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sommelierOpen, setSommelierOpen] = useState(false);
  const auVerreRef = useRef(null);

  // Merge static structure with DB prices
  useEffect(() => {
    async function fetchPrices() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("wines")
          .select("id, price_bottle, price_glass, price_variants, available, vintage, sommelier_note")
          .eq("available", true);

        if (!error && data) {
          setDbWines(data);
        }
      } catch (err) {
        console.warn("Wine prices not yet available from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  // Enrich static data with DB prices
  const enrichedWines = STATIC_WINES.map((wine) => {
    const dbRecord = dbWines.find((d) => d.id === wine.id);
    if (!dbRecord) return wine;
    return {
      ...wine,
      price_bottle:   dbRecord.price_bottle   ?? wine.price_bottle,
      price_glass:    dbRecord.price_glass     ?? wine.price_glass,
      price_variants: dbRecord.price_variants  ?? wine.price_variants,
      vintage:        dbRecord.vintage         ?? wine.vintage,
      sommelier_note: dbRecord.sommelier_note  ?? wine.sommelier_note,
    };
  });

  // Filter by style
  const winesByStyle = (styleCode) =>
    enrichedWines.filter(
      (w) => w.available && (styleCode === "all" || w.wine_style === styleCode)
    );

  const visibleStyles =
    activeStyle === "all"
      ? WINE_STYLES
      : WINE_STYLES.filter((s) => s.code === activeStyle);

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <Header lang={lang} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative py-24 text-center border-b border-white/5 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-300 via-dark-400 to-dark-500 opacity-80" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(197,165,90,0.07) 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold-500/60 font-semibold mb-5 block">
            La Cave des Vins · Maison Vie
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight gold-text-gradient font-luxury mb-4 leading-none">
            La Carte des Vins
          </h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500 font-semibold mb-8">
            {t.heroLabel}
          </p>
          <p className="text-stone-400 font-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Sommelier toggle */}
          <div className="mt-10">
            <button
              onClick={() => setSommelierOpen(!sommelierOpen)}
              className="text-[10px] uppercase tracking-widest text-gold-500/60 hover:text-gold-400 border border-gold-500/15 hover:border-gold-500/30 px-5 py-2.5 transition-premium"
            >
              {sommelierOpen ? "−" : "+"} {t.sommelierNote}
            </button>

            {sommelierOpen && (
              <div className="mt-8 max-w-2xl mx-auto animate-fade-in text-left bg-dark-300/50 border border-white/5 p-7">
                <p className="text-stone-300 font-light text-sm leading-relaxed mb-4 italic">
                  {SOMMELIER_INTRO.fr}
                </p>
                <p className="text-stone-500 font-light text-xs leading-relaxed mb-6 italic">
                  {SOMMELIER_INTRO.vi}
                </p>
                <div className="border-t border-white/5 pt-5">
                  <p className="text-[9px] uppercase tracking-widest text-stone-600 mb-3">{t.serviceNotes}</p>
                  <ul className="space-y-1.5">
                    {SOMMELIER_INTRO.service.map((note, i) => (
                      <li key={i} className="text-[11px] text-stone-500 font-light flex items-start gap-2">
                        <span className="text-gold-500/40 mt-0.5">·</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STYLE FILTERS ──────────────────────────────────────────────────── */}
      <section className="sticky top-24 z-40 bg-dark-500/95 backdrop-blur-md border-b border-white/5 py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap gap-2 items-center justify-center">
          {/* All */}
          <button
            onClick={() => setActiveStyle("all")}
            className={`text-[10px] uppercase tracking-widest px-5 py-2.5 border transition-premium font-semibold ${
              activeStyle === "all"
                ? "bg-gold-500 border-gold-500 text-dark-500 shadow-[0_0_20px_rgba(197,165,90,0.2)]"
                : "bg-transparent border-white/5 text-stone-400 hover:border-gold-500/30 hover:text-stone-200"
            }`}
          >
            {t.filterAll}
          </button>

          {WINE_STYLES.map((s) => (
            <button
              key={s.code}
              onClick={() => setActiveStyle(s.code)}
              className={`text-[10px] uppercase tracking-widest px-5 py-2.5 border transition-premium flex items-center gap-2 ${
                activeStyle === s.code
                  ? "bg-gold-500/10 border-gold-500/40 text-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.1)]"
                  : "bg-transparent border-white/5 text-stone-400 hover:border-gold-500/20 hover:text-stone-200"
              }`}
            >
              <span className="text-gold-500/50">{s.icon}</span>
              {s.label}
            </button>
          ))}

          {/* Jump to Au Verre */}
          <button
            onClick={() => auVerreRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="text-[10px] uppercase tracking-widest px-5 py-2.5 border border-gold-500/20 text-gold-500/60 hover:text-gold-400 hover:border-gold-500/40 transition-premium ml-2"
          >
            ◈ Au Verre
          </button>
        </div>
      </section>

      {/* ── WINE LIST BY STYLE ──────────────────────────────────────────────── */}
      <section className="py-16 flex-1">
        <div className="max-w-5xl mx-auto px-6">
          {loading && (
            <div className="text-center py-20 text-gold-500 text-xs tracking-widest uppercase animate-pulse">
              {t.loading}
            </div>
          )}

          {!loading && visibleStyles.map((style) => {
            const wines = winesByStyle(style.code);
            if (wines.length === 0) return null;
            return (
              <div key={style.code} className="mb-20">
                <SectionHeader style={style} count={wines.length} />
                <div className="space-y-5">
                  {wines.map((wine, i) => (
                    <WineCard key={wine.id} wine={wine} t={t} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AU VERRE SECTION ────────────────────────────────────────────────── */}
      <section
        ref={auVerreRef}
        className="py-20 bg-dark-400 border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto px-6">

          {/* Section header */}
          <div className="text-center mb-14">
            <span className="text-[9px] uppercase tracking-[0.4em] text-gold-500/60 font-semibold block mb-3">
              Sélection Maison
            </span>
            <h2 className="text-4xl md:text-5xl font-light gold-text-gradient font-luxury mb-4">
              {t.auVerreTitle}
            </h2>
            <p className="text-stone-500 text-sm font-light italic max-w-lg mx-auto">
              {t.auVerreSubtitle}
            </p>
          </div>

          {/* Au Verre list — elegant table-like layout */}
          <div className="space-y-0">
            {AU_VERRE_LIST.map((wine, i) => {
              const styleColor = STYLE_GLASS_COLOR[wine.style] || "#C5A55A";
              return (
                <div
                  key={wine.id}
                  className={`flex items-center gap-6 py-5 border-b border-white/5 group hover:bg-white/[0.015] transition-premium animate-fade-in px-2`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Style dot */}
                  <div
                    className="shrink-0 w-2.5 h-2.5 rounded-full border border-white/10"
                    style={{ backgroundColor: styleColor, opacity: 0.7 }}
                    title={wine.style}
                  />

                  {/* Wine name & details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-stone-200 font-light font-luxury group-hover:text-stone-100 transition-premium truncate">
                      {wine.name}
                    </p>
                    <p className="text-[10px] text-stone-600 mt-0.5 truncate">
                      {wine.grape} · {wine.appellation}
                    </p>
                  </div>

                  {/* Style badge */}
                  <span
                    className="shrink-0 text-[9px] uppercase tracking-widest font-semibold hidden sm:block"
                    style={{ color: styleColor, opacity: 0.7 }}
                  >
                    {wine.style}
                  </span>

                  {/* Price */}
                  <div className="shrink-0 text-right min-w-[90px]">
                    <span className="text-xs text-stone-600 italic">{t.priceOnRequest}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PAIRING PHILOSOPHY ─────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5 bg-dark-500">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold-500/50 font-semibold block mb-5">
            À propos des accords
          </span>
          <p className="text-stone-500 text-sm font-light italic leading-relaxed max-w-xl mx-auto">
            Our list is organised by style and then by region, from the cooler aromatics of Alsace Riesling and Chablis Chardonnay to the structured grandeur of Left Bank Bordeaux and the sun-warmed opulence of Maipo Cabernet. Our Sommelier remains at your table for tableside guidance.
          </p>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-400 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold mb-5 block">
            Réservations
          </span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-100 font-luxury mb-10">
            L'Art de Recevoir · Trải nghiệm hương vị đẳng cấp thế giới
          </h2>
          <button
            onClick={() => router.push(`/?lang=${lang}#booking`)}
            className="text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-10 py-4 hover:bg-gold-400 shadow-[0_0_30px_rgba(197,165,90,0.2)] transition-premium"
          >
            {t.btnReserve}
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <Footer lang={lang} />

    </div>
  );
}

export default function WineList() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
          Chargement de la cave…
        </div>
      }
    >
      <WineListContent />
    </Suspense>
  );
}
