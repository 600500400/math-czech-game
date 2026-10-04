# Read-only kontrola Supabase před nasazením — výsledky

## Ověřené schéma (odpovídá očekávání)
- `user_levels`: user_id text, current_level/total_xp/xp_to_next_level int, updated_at ✅
- `user_streaks`: user_id text, current/longest_streak, last_activity_date date, streak_type ✅
- `user_achievements`: user_id text, achievement_id uuid (nullable), progress, completed ✅
- `dictionary_words`: user_id text, is_user_created bool ✅

## Funkce
- `update_user_level(text, integer)` — existuje (SECURITY DEFINER) ✅
- `calculate_xp_for_level(integer)` — existuje (SECURITY DEFINER) ✅
- `complete_learning_session(jsonb)` — NEEXISTUJE

## Learning tabulky
- `learning_content`, `learning_words`, `learning_sessions`, `learning_daily_rewards`, `learning_badges` — žádná neexistuje, migrace bez kolizí ✅

## Stav dat před migrací
- user_levels: 8 řádků, součet total_xp = 4 950
- user_streaks: 7, user_achievements: 8
- dictionary_words: 175 (55 uživatelských)

## Triggery
- Na gamifikačních tabulkách žádné; jen `on_auth_user_created` na auth.users

## Nekompatibility k zohlednění v migraci
1. user_id je text (ne uuid) — learning tabulky musí používat text
2. achievement_id nullable v user_achievements
3. Nové funkce držet vzor SECURITY DEFINER + search_path = ''

## Další krok (po schválení)
Připravit migraci: learning_content, learning_words, learning_sessions, learning_daily_rewards, learning_badges + complete_learning_session(jsonb), s GRANTy a RLS podle projektových pravidel.
