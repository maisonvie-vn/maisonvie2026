-- ═══════════════════════════════════════════════════════════════════════════
-- MAISON VIE — wines table
-- La Carte des Vins 2026 · Schéma Supabase
--
-- Conventions:
--   • All prices stored as INTEGER (VND × 1 000 — i.e. the raw number
--     that appears on the menu before the "(,000) VND" annotation).
--     A price of 4500 in the column = 4,500,000 VND.
--   • NULL price = "not yet published / price on request".
--   • price_variants (JSONB) stores multi-volume pricing:
--       [{"volume": "37.5 cl", "price_bottle": null}, {"volume": "75 cl", "price_bottle": null}]
--   • All text fields that need i18n use JSONB:
--       {"vi": "...", "en": "...", "fr": "...", "ja": "...", "ko": "..."}
--   • wine_style is the PRIMARY classification axis (Level 1):
--       champagne | sparkling | rose | white | red | dessert
--   • vino_club_eligible prepares integration with the VINO Club membership tier.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.wines (
  -- Identity
  id                   TEXT        PRIMARY KEY,  -- Human-readable slug e.g. "red-latour-bourgogne-pinot"
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Classification (Level 1 — primary style axis)
  wine_style           TEXT        NOT NULL CHECK (wine_style IN (
                          'champagne', 'sparkling', 'rose', 'white', 'red', 'dessert'
                        )),

  -- Identity fields (verbatim French / original-language terms preserved)
  name                 TEXT        NOT NULL,     -- Full display name (original language, no translation)
  producer             TEXT,
  cuvee                TEXT,                     -- Cuvée name e.g. "La Chanfleure", "Brut Réserve"

  -- Terroir & Viticulture
  vintage              TEXT,                     -- "NV", "2021", or NULL if TBD
  grape_variety        TEXT,                     -- e.g. "Pinot Noir • Chardonnay • Pinot Meunier"
  appellation          TEXT,                     -- e.g. "Chablis AOC", "Pauillac AOC"
  region               TEXT,                     -- Sub-region e.g. "Bourgogne — Chablis"
  country              TEXT,

  -- Service
  volume               TEXT,                     -- "750ml", "375ml", NULL for multi-volume

  -- Sommelier annotations (internal — not auto-translated)
  sommelier_note       TEXT,
  food_pairing         TEXT,                     -- e.g. "Khánh Hòa scallops, Wagyu"

  -- Pricing — all NULL until synced from internal pricing DB
  -- Stored as INTEGER (VND in thousands) per Wine List convention
  price_bottle         INTEGER,                  -- Bottle price (standard volume)
  price_glass          INTEGER,                  -- Glass price 125ml (Au Verre wines only)

  -- Multi-volume / multi-format pricing (JSONB array)
  -- Schema: [{"volume": "37.5 cl", "price_bottle": <int|null>}, {"volume": "75 cl", "price_bottle": <int|null>}]
  price_variants       JSONB,

  -- Availability
  available            BOOLEAN     NOT NULL DEFAULT TRUE,
  featured             BOOLEAN     NOT NULL DEFAULT FALSE,

  -- VINO Club integration foundation
  vino_club_eligible   BOOLEAN     NOT NULL DEFAULT FALSE,
  vino_club_discount   NUMERIC(5,2),             -- Percentage discount for VINO members e.g. 10.00
  vino_club_tier       TEXT CHECK (vino_club_tier IN ('silver', 'gold', 'platinum', NULL)),

  -- Extended metadata for future features
  wine_score           SMALLINT,                 -- Parker / Wine Spectator score if applicable
  bio_certified        BOOLEAN     NOT NULL DEFAULT FALSE,  -- Biologique / biodynamique
  serving_temp_min     SMALLINT,                 -- °C
  serving_temp_max     SMALLINT,                 -- °C
  decant_recommended   BOOLEAN     NOT NULL DEFAULT FALSE,
  cellar_potential     TEXT,                     -- e.g. "5–8 ans"
  image_url            TEXT,                     -- Bottle photo URL
  qr_data              TEXT,                     -- For tableside QR label
  sort_order           SMALLINT    NOT NULL DEFAULT 0,      -- Manual ordering within style

  -- Audit
  last_price_sync_at   TIMESTAMPTZ              -- Timestamp of last price synchronisation from internal DB
);

-- ── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS wines_style_idx     ON public.wines (wine_style);
CREATE INDEX IF NOT EXISTS wines_country_idx   ON public.wines (country);
CREATE INDEX IF NOT EXISTS wines_available_idx ON public.wines (available);
CREATE INDEX IF NOT EXISTS wines_vino_idx      ON public.wines (vino_club_eligible);
CREATE INDEX IF NOT EXISTS wines_featured_idx  ON public.wines (featured);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE public.wines ENABLE ROW LEVEL SECURITY;

-- Public: read available wines only
CREATE POLICY "Public can read available wines"
  ON public.wines FOR SELECT
  USING (available = TRUE);

-- Authenticated (CRM / admin): full access
CREATE POLICY "Authenticated users have full access"
  ON public.wines FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── AUTO-UPDATE updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER wines_updated_at
  BEFORE UPDATE ON public.wines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── INITIAL SEED — Static structure from La Carte des Vins 2026 ─────────────
-- Prices are intentionally NULL. Sync from internal pricing DB before publish.
-- wine_style follows the Level-1 classification axis confirmed by the Owner.

INSERT INTO public.wines (
  id, wine_style, name, producer, cuvee, vintage,
  grape_variety, appellation, region, country, volume,
  sommelier_note, food_pairing,
  price_bottle, price_glass, price_variants,
  available, vino_club_eligible, bio_certified,
  serving_temp_min, serving_temp_max, sort_order
) VALUES

-- CHAMPAGNE
('champ-taittinger-nv',    'champagne', 'Champagne Taittinger, Brut Réserve NV',         'Champagne Taittinger',           'Brut Réserve',              'NV',  'Pinot Noir • Chardonnay • Pinot Meunier', 'Champagne AOC',                       'Reims',                  'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 1),
('champ-moet-imperial-nv', 'champagne', 'Champagne Moët & Chandon, Brut Impérial NV',     'Moët & Chandon',                 'Brut Impérial',             'NV',  'Pinot Noir • Chardonnay • Pinot Meunier', 'Champagne AOC',                       'Épernay',                'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 2),

-- SPARKLING
('spark-pierre-larousse-brut',    'sparkling', 'Pierre Larousse Sparkling Brut',          'Pierre Larousse',                NULL,                        NULL,  'Chardonnay',                              'Vin de France',                       'France',                 'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 1),
('spark-cremant-bourgogne-buxy',  'sparkling', 'Crémant de Bourgogne Brut Vignerons de Buxy', 'Vignerons de Buxy',          NULL,                        NULL,  'Chardonnay • Aligoté • Gamay',            'Bourgogne AOC',                       'Bourgogne',              'France',       '750ml', 'Méthode traditionnelle.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 2),

-- ROSÉ
('rose-bertrand-gris-blanc',  'rose', 'Gérard Bertrand « Gris Blanc » IGP',              'Gérard Bertrand',                'Gris Blanc',                NULL,  'Grenache Gris • Grenache Noir',           'Pays d''Oc IGP',                      'Languedoc',              'France',       '750ml', 'Pale, dry, mineral — the Mediterranean in a glass.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 10, 12, 1),
('rose-croix-peyrassol',      'rose', 'Croix de Peyrassol Rosé IGP',                     'Domaine de Peyrassol',           'Croix de Peyrassol',        NULL,  'Cinsault • Grenache • Syrah',             'Provence IGP',                        'Provence',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 10, 12, 2),

-- WHITE — France Bordeaux
('white-baratet-sauv-blanc',       'white', 'Château Baratet, Sauvignon Blanc',           'Château Baratet',               NULL,                         NULL,  'Sauvignon Blanc',                         'Bordeaux AOC',                        'Bordeaux',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 1),
('white-grand-bateau-bdx',         'white', 'Grand Bateau Bordeaux Blanc (by Beychevelle)','Château Beychevelle',           'Grand Bateau',               NULL,  'Sauvignon Blanc',                         'Bordeaux AOC',                        'Bordeaux',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 2),
('white-thienpont-vigne-argent',   'white', 'F. Thienpont « La Vigne d''Argent »',        'F. Thienpont',                  'La Vigne d''Argent',         NULL,  'Sauvignon Blanc',                         'Bordeaux AOC',                        'Bordeaux',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 3),
('white-ronan-clinet-blanc',       'white', 'Ronan by Clinet Bordeaux Blanc',             'Château Clinet',                'Ronan by Clinet',            NULL,  'Sauvignon Blanc • Sémillon',              'Vin de France',                       'Bordeaux',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 4),
('white-thienpont-puygueraud-blanc','white','N. Thienpont, Château Puygueraud Blanc',      'Nicolas Thienpont',             'Château Puygueraud Blanc',   NULL,  'Sauvignon Gris • Sauvignon Blanc',        'Francs Côtes de Bordeaux AOC',        'Bordeaux',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 5),
-- WHITE — France Loire
('white-jolivet-attitude',         'white', 'Pascal Jolivet « Attitude » Sauvignon Blanc','Pascal Jolivet',                'Attitude',                   NULL,  'Sauvignon Blanc (biologique)',            'Val de Loire IGP',                    'Loire Valley',           'France',       '750ml', 'Flint, gooseberry, grapefruit.', NULL, NULL, NULL, NULL, TRUE, FALSE, TRUE,  8, 10, 6),
-- WHITE — France Alsace
('white-lorentz-riesling',         'white', 'Gustave Lorentz Riesling',                   'Gustave Lorentz',               NULL,                         NULL,  'Riesling',                                'Alsace AOC',                          'Alsace',                 'France',       '750ml', 'Dry, mineral — long finishes ideal for Asian spice.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 7),
-- WHITE — France Burgundy
('white-latour-chablis-chanfleure','white', 'Louis Latour Chablis « La Chanfleure »',     'Louis Latour',                  'La Chanfleure',              NULL,  'Chardonnay',                              'Chablis AOC',                         'Bourgogne — Chablis',    'France',       '750ml', 'Oyster-shell tension, pure mineral expression.', 'Khánh Hòa scallops, Miso-marinated cod', NULL, NULL, NULL, TRUE, TRUE, FALSE, 8, 10, 8),
('white-latour-pouilly-fuisse',    'white', 'Louis Latour Pouilly-Fuissé',                'Louis Latour',                  NULL,                         NULL,  'Chardonnay',                              'Pouilly-Fuissé AOC',                  'Bourgogne — Mâconnais',  'France',       '750ml', 'Roundness and generous body.', NULL, NULL, NULL, NULL, TRUE, TRUE, FALSE, 8, 10, 9),
-- WHITE — France Rhône
('white-chapoutier-belleruche-blanc','white','M. Chapoutier « Belleruche » Côtes du Rhône Blanc','M. Chapoutier',           'Belleruche',                 NULL,  'Grenache Blanc • Clairette',              'Côtes du Rhône AOC',                  'Rhône Valley',           'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 10),
('white-magrez-prelat-blanc',      'white', 'Bernard Magrez « Le Prélat » Blanc',         'Bernard Magrez',                'Le Prélat',                  NULL,  'Grenache Blanc • Viognier • Roussanne',   'Côtes du Rhône Villages Laudun AOP',  'Rhône Valley',           'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 11),
('white-chapoutier-mirabel-viognier','white','M. Chapoutier Domaine des Granges de Mirabel','M. Chapoutier',               'Domaine des Granges de Mirabel',NULL,'Viognier (biodynamique)',                 'Rhône Valley IGP',                    'Rhône Valley',           'France',       '750ml', 'Apricot and honeysuckle — biodynamic viticulture.', NULL, NULL, NULL, NULL, TRUE, FALSE, TRUE, 8, 10, 12),
-- WHITE — Spain
('white-torres-sangre-blanco',     'white', 'Torres « Sangre de Toro » Blanco',           'Torres',                        'Sangre de Toro',             NULL,  'Parellada • Garnacha Blanca',             'Catalunya DO',                        'Catalunya',              'Spain',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 13),
-- WHITE — Chile
('white-concha-frontera-sauv',     'white', 'Concha y Toro « Frontera » Sauvignon Blanc', 'Concha y Toro',                 'Frontera',                   NULL,  'Sauvignon Blanc',                         'D.O. Valle Central',                  'Valle Central',          'Chile',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 14),
('white-concha-marques-chardonnay','white', 'Concha y Toro « Marqués de Casa Concha » Chardonnay','Concha y Toro',         'Marqués de Casa Concha',    NULL,  'Chardonnay',                              'Limarí Valley DO',                    'Limarí Valley',          'Chile',        '750ml', 'Cool Pacific coast — vibrant fruit.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 15),
-- WHITE — Argentina
('white-kaiken-sauv-semillon',     'white', 'Kaiken Estate Sauvignon Blanc-Sémillon',     'Kaiken',                        'Estate',                     NULL,  'Sauvignon Blanc • Sémillon',              'Mendoza',                             'Mendoza',                'Argentina',    '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 16),
-- WHITE — South Africa
('white-lebonheur-chardonnay',     'white', 'Le Bonheur « The Eagle''s Lair » Chardonnay','Le Bonheur',                   'The Eagle''s Lair',          NULL,  'Chardonnay',                              'Stellenbosch WO',                     'Stellenbosch',           'South Africa', '750ml', 'Granite soils — ripe, structured, age-worthy.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 8, 10, 17),

-- RED — France Bordeaux Left Bank
('red-noaillac-medoc',             'red',   'Château Noaillac, Médoc Cru Bourgeois',      'Château Noaillac',              NULL,                         NULL,  'Merlot • Cabernet Sauvignon',             'Médoc AOC',                           'Médoc',                  'France',       '750ml', 'Cabernet Sauvignon-led blends with graphite and noble tannin.', 'Wagyu', NULL, NULL, NULL, TRUE, TRUE, FALSE, 16, 18, 1),
('red-haut-selve-graves',          'red',   'Château Haut Selve, Graves',                 'Château Haut Selve',            NULL,                         NULL,  'Merlot • Cabernet Sauvignon',             'Graves AOC',                          'Graves',                 'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 2),
('red-mouton-cadet-pauillac',      'red',   'Baron P. de Rothschild « Mouton Cadet » Réserve Pauillac','Baron Philippe de Rothschild','Mouton Cadet Réserve',NULL,'Cabernet Sauvignon • Merlot • Cabernet Franc','Pauillac AOC',             'Pauillac — Médoc',       'France',       '750ml', NULL, 'Wagyu', NULL, NULL, NULL, TRUE, TRUE, FALSE, 16, 18, 3),
-- RED — France Bordeaux Right Bank
('red-mont-perat-rouge',           'red',   'Château Mont-Pérat Rouge',                   'Château Mont-Pérat',            NULL,                         NULL,  'Merlot • Cabernet Franc • Cabernet Sauvignon','Bordeaux AOC',             'Bordeaux',               'France',       '750ml', 'Merlot-led, opulent, velvet-textured — the sensuality of Libourne.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 4),
('red-haut-saint-brice-semilion',  'red',   'Château Haut Saint-Brice, Saint-Émilion Grand Cru','Château Haut Saint-Brice',NULL,                         NULL,  'Merlot • Cabernet Franc',                 'Saint-Émilion Grand Cru AOC',         'Saint-Émilion',          'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, FALSE, 16, 18, 5),
('red-haut-rocher-semilion',       'red',   'Château Haut-Rocher, Saint-Émilion Grand Cru','Château Haut-Rocher',          NULL,                         NULL,  'Merlot • Cabernet Franc',                 'Saint-Émilion Grand Cru AOC',         'Saint-Émilion',          'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, FALSE, 16, 18, 6),
-- RED — France Bordeaux AOC / Côtes
('red-baratet-cab-sauv',           'red',   'Château Baratet, Cabernet Sauvignon',        'Château Baratet',               NULL,                         NULL,  'Cabernet Sauvignon',                      'Bordeaux Supérieur AOC',              'Bordeaux',               'France',       '750ml', 'Everyday brilliance from an emblematic Bordelais house.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 7),
('red-mouton-cadet-classique',     'red',   'Baron P. de Rothschild « Mouton Cadet » Classique Rouge','Baron Philippe de Rothschild','Mouton Cadet Classique',NULL,'Merlot • Cabernet Sauvignon • Cabernet Franc','Bordeaux AOC',        'Bordeaux',               'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 8),
-- RED — France Burgundy
('red-latour-bourgogne-pinot',     'red',   'Louis Latour Bourgogne Pinot Noir',          'Louis Latour',                  NULL,                         NULL,  'Pinot Noir',                              'Bourgogne AOC',                       'Bourgogne',              'France',       '750ml', 'Translucent, perfumed, silken — Pinot Noir on the southern cusp of Bourgogne.', 'Vietnamese duck breast', NULL, NULL, NULL, TRUE, TRUE, FALSE, 14, 16, 9),
-- RED — France Rhône
('red-chapoutier-belleruche-rouge','red',   'M. Chapoutier « Belleruche » Côtes du Rhône Rouge','M. Chapoutier',           'Belleruche',                 NULL,  'Grenache • Syrah',                        'Côtes du Rhône AOC',                  'Rhône Valley',           'France',       '750ml', 'Pepper and smoked violet.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 10),
('red-magrez-prelat-rouge',        'red',   'Bernard Magrez « Le Prélat » Rouge',         'Bernard Magrez',                'Le Prélat',                  NULL,  'Grenache Noir • Syrah',                   'Côtes du Rhône Villages Laudun AOP',  'Rhône Valley',           'France',       '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 11),
('red-chapoutier-meysonniers-crozes','red', 'M. Chapoutier « Les Meysonniers » Crozes-Hermitage','M. Chapoutier',          'Les Meysonniers',            NULL,  'Syrah (biologique)',                       'Crozes-Hermitage AOC',                'Rhône Valley',           'France',       '750ml', 'Organic viticulture — smoky, dark-spiced Syrah.', 'Wagyu', NULL, NULL, NULL, TRUE, TRUE, TRUE,  16, 18, 12),
-- RED — Italy
('red-talo-primitivo-manduria',    'red',   'Talò Primitivo di Manduria « San Marzano »', 'San Marzano',                   'Talò',                       NULL,  'Primitivo',                               'Primitivo di Manduria DOP',           'Puglia',                 'Italy',        '750ml', 'Sun-drenched — generous, warm, dark-fruited.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 13),
-- RED — Spain
('red-torres-sangre-original',     'red',   'Torres « Sangre de Toro » Original',         'Torres',                        'Sangre de Toro',             NULL,  'Garnacha • Cariñena',                     'Catalunya DO',                        'Catalunya',              'Spain',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 14),
('red-marques-caceres-crianza',    'red',   'Marqués de Cáceres Crianza',                 'Marqués de Cáceres',            'Crianza',                    NULL,  'Tempranillo',                             'Rioja DOCa',                          'Rioja',                  'Spain',        '750ml', 'Warmth and savoury oak.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 15),
-- RED — Argentina
('red-kaiken-malbec',              'red',   'Kaiken Estate Malbec',                       'Kaiken',                        'Estate',                     NULL,  'Malbec',                                  'Mendoza',                             'Mendoza',                'Argentina',    '750ml', 'Mendoza is the world capital of Malbec.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 16),
-- RED — New Zealand
('red-villa-maria-cab-merlot',     'red',   'Villa Maria « Private Bin » Cabernet-Merlot','Villa Maria',                   'Private Bin',                NULL,  'Cabernet Sauvignon • Merlot',             'Hawke''s Bay GI',                     'Hawke''s Bay',           'New Zealand',  '750ml', 'Hawke''s Bay — elegant Bordeaux-style blend.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 17),
-- RED — Chile
('red-concha-frontera-cab',        'red',   'Concha y Toro « Frontera » Cabernet Sauvignon','Concha y Toro',               'Frontera',                   NULL,  'Cabernet Sauvignon',                      'D.O. Valle Central',                  'Valle Central',          'Chile',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 18),
('red-torres-las-mulas-cab',       'red',   'Miguel Torres « Las Mulas » Cabernet Sauvignon','Miguel Torres',              'Las Mulas',                  NULL,  'Cabernet Sauvignon (biologique)',          'D.O. Central Valley',                 'Central Valley',         'Chile',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, TRUE, 16, 18, 19),
('red-concha-marques-cab',         'red',   'Concha y Toro « Marqués de Casa Concha » Cabernet Sauvignon','Concha y Toro','Marqués de Casa Concha',    NULL,  'Cabernet Sauvignon',                      'Maipo Valley DO',                     'Maipo Valley',           'Chile',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 20),
('red-montes-alpha-cab',           'red',   'Montes Alpha Cabernet Sauvignon',             'Montes',                        'Alpha',                      NULL,  'Cabernet Sauvignon • Merlot',             'Colchagua Valley DO',                 'Colchagua Valley',       'Chile',        '750ml', NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 21),
-- RED — South Africa
('red-lebonheur-cab-sauv',         'red',   'Le Bonheur Cabernet Sauvignon',              'Le Bonheur',                    NULL,                         NULL,  'Cabernet Sauvignon',                      'Stellenbosch WO',                     'Stellenbosch',           'South Africa', '750ml', 'Granite soils — ripe, structured, age-worthy.', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, 16, 18, 22),

-- DESSERT
('dessert-mouton-sauternes',       'dessert','Baron P. de Rothschild « Mouton Cadet » Sauternes','Baron Philippe de Rothschild','Mouton Cadet Sauternes',NULL, 'Sémillon • Sauvignon Blanc',              'Sauternes AOC',                       'Sauternes — Bordeaux',   'France',       NULL,   NULL, NULL, NULL, NULL,
  '[{"volume": "37.5 cl", "price_bottle": null}, {"volume": "75 cl", "price_bottle": null}]'::jsonb,
  TRUE, TRUE, FALSE, 8, 10, 1)

ON CONFLICT (id) DO NOTHING;

-- ── AU VERRE TABLE ───────────────────────────────────────────────────────────
-- Separate table for by-the-glass references.
-- References the wines table by wine_id for shared fields.

CREATE TABLE IF NOT EXISTS public.wines_au_verre (
  id           TEXT        PRIMARY KEY,
  wine_id      TEXT        REFERENCES public.wines(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,   -- Display name (may differ from bottle listing)
  grape        TEXT,
  wine_style   TEXT,                   -- "Sparkling" | "White" | "Rosé" | "Red"
  appellation  TEXT,
  price_glass  INTEGER,                -- VND in thousands, NULL = not yet published
  volume_ml    SMALLINT    NOT NULL DEFAULT 125,
  available    BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order   SMALLINT    NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.wines_au_verre ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read available au verre" ON public.wines_au_verre FOR SELECT USING (available = TRUE);
CREATE POLICY "Auth full access au verre" ON public.wines_au_verre FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.wines_au_verre (id, wine_id, name, grape, wine_style, appellation, price_glass, available, sort_order) VALUES
('av-pierre-larousse-brut',    'spark-pierre-larousse-brut',    'Pierre Larousse Sparkling Brut',                   'Chardonnay',          'Sparkling', 'Vin de France — France',              NULL, TRUE, 1),
('av-concha-frontera-sauv',    'white-concha-frontera-sauv',    'Concha y Toro « Frontera » Sauvignon Blanc',        'Sauvignon Blanc',     'White',     'D.O. Valle Central — Chile',          NULL, TRUE, 2),
('av-baratet-sauv',           'white-baratet-sauv-blanc',       'Château Baratet Sauvignon Blanc',                   'Sauvignon Blanc',     'White',     'Bordeaux AOC — France',               NULL, TRUE, 3),
('av-dufouleur-pinot-rose',    NULL,                            'Dufouleur Père & Fils Pinot Noir Rosé',             'Pinot Noir',          'Rosé',      'Vin de France — France',              NULL, TRUE, 4),
('av-concha-frontera-cab',     'red-concha-frontera-cab',       'Concha y Toro « Frontera » Cabernet Sauvignon',     'Cabernet Sauvignon',  'Red',       'Vin de France — France',              NULL, TRUE, 5),
('av-baratet-cab',            'red-baratet-cab-sauv',           'Château Baratet Cabernet Sauvignon',                'Cabernet Sauvignon',  'Red',       'Bordeaux Supérieur AOC — France',     NULL, TRUE, 6)

ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- VINO CLUB FOUNDATION — wines_vino_club_tiers
-- Extends wines for membership-tier pricing and perks.
-- Designed for seamless future integration.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.wines_vino_club_tiers (
  id              SERIAL      PRIMARY KEY,
  wine_id         TEXT        NOT NULL REFERENCES public.wines(id) ON DELETE CASCADE,
  tier            TEXT        NOT NULL CHECK (tier IN ('silver', 'gold', 'platinum')),
  discount_pct    NUMERIC(5,2) NOT NULL DEFAULT 0,   -- e.g. 10.00 = 10 %
  priority_access BOOLEAN     NOT NULL DEFAULT FALSE, -- First-access on rare allocations
  complimentary   BOOLEAN     NOT NULL DEFAULT FALSE, -- Complimentary glass on arrival
  notes           TEXT,
  valid_from      DATE,
  valid_until     DATE,
  UNIQUE (wine_id, tier)
);

ALTER TABLE public.wines_vino_club_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth full access vino tiers" ON public.wines_vino_club_tiers FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
