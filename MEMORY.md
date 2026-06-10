# Long-Term Memory (Maison Vie 2026)

This file stores distilled project context, design decisions, and system setups to ensure consistency across model invocations.

## Database & Menu Structure
- **Table `menu_items`**: Used for both À La Carte items and set menu prices (category: `'Set Menu Price'`).
- **Table `menu_item_allergens`**: Links menu items to `allergen_categories`. Cascades on delete.
- **À La Carte 2026**: Contains 26 items in 4 main categories (`Appetizer`, `Soup`, `Main Course`, `Dessert`).
- **Wines**: Stored in a separate table `wines`.

## Pages & Routing
- `/menu` (À La Carte): Fetches active dishes from Supabase dynamically.
- `/menu/set-menu`: Displays set menu choices and packages (statically mapped in code, with prices fetched from database).
- `/menu/drinks`: Dedicated beverage listing page containing all drinks from pages 8–10 of `Final Menu A la carte 2026.pdf`. *Note: Drink prices are omitted in the UI per client request, to be updated later.*

## Translation Architecture
- We support 6 languages: Vietnamese (`vi`), English (`en`), French (`fr`), Japanese (`ja`), Korean (`ko`), and Traditional Chinese / Hong Kong (`hk`).
- Translations are resolved via JSONB fields in the database (`name`, `description`) or standard translation structures matching the URL query `?lang=...`.
