
## Goal
Dashboard ko compact, responsive aur zyada informative banana — desktop pe kam scroll, mobile pe clean, plus social proof aur naye motivational features.

## Layout & Responsiveness
- **Stat cards**: 6 cards ek hi line me desktop pe (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`), padding/icon size chhota (p-3, icon 20px, number text-xl).
- **Header**: Compact — smaller padding, action buttons icon-only on mobile, icon+label on desktop.
- **Two-column layout** on desktop (`lg:grid-cols-2`): Pie chart left, Bar chart right — side by side, kam scroll.
- **Subject list**: Desktop pe 2-column grid, mobile pe single column.

## New Charts
- **Pie/Donut chart** (Recharts): Completed vs Remaining topics with center % label.
- **Written vs Practical breakdown** chart (stacked bar or second donut).
- Existing bar chart retained, resized smaller.

## Social Proof — Total Users
- New public RPC `get_total_users_count()` (SECURITY DEFINER) reading `auth.users` count — safe, only returns integer.
- Small badge in header: "👥 1,234 learners tracking their study" — animated count-up.
- Grant EXECUTE to `anon` and `authenticated`.

## New Motivational Features
1. **Streak counter**: Days-in-a-row with any topic completed (uses `topics.updated_at`). Shown as compact card in header row with 🔥 icon.
2. **Today's progress**: Topics completed today count + mini progress ring.
3. **Achievement badges**: Milestones (10/50/100 topics, 25%/50%/100% subject completion) shown as small chip row.
4. **Motivational quote** rotating daily below header.
5. **Quick-add topic** floating action button on mobile.
6. **Empty-state illustration** improvement.

## Files to touch
- `src/index.css` — tighter card spacing tokens.
- `src/pages/Index.tsx` — new grid layout, integrate new components.
- `src/components/SubjectProgressChart.tsx` — smaller height (180px).
- `src/components/CompletionPieChart.tsx` — NEW donut chart.
- `src/components/TopicTypeChart.tsx` — NEW written/practical chart.
- `src/components/UserCountBadge.tsx` — NEW, calls RPC.
- `src/components/StreakCard.tsx` — NEW.
- `src/components/AchievementBadges.tsx` — NEW.
- `src/components/MotivationalQuote.tsx` — NEW.
- New migration: `get_total_users_count()` function + grants.

## Technical Notes
- Stat cards restyled: `p-3 rounded-xl`, icon `size={20}`, value `text-xl md:text-2xl font-bold`, label `text-xs`.
- All new components use existing semantic tokens (`bg-card`, `text-primary`, teal gradient) — no hardcoded colors.
- User count fetched once on mount, cached in state.
- Streak computed client-side from loaded topics' `updated_at`.

## Out of scope
- Auth flow changes (already fixed).
- Data model changes beyond the count RPC.
