-- Bilingual / fuzzy search for catalog browse and AI dedupe (DOMAIN_SPEC 3.3).
-- pg_trgm enables similarity operators (%, <->) and gin_trgm_ops indexes.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Exercise_name_trgm_idx"
  ON "Exercise" USING gin ("name" gin_trgm_ops);

CREATE INDEX "Exercise_namePtBr_trgm_idx"
  ON "Exercise" USING gin ("namePtBr" gin_trgm_ops);

-- Exact / containment lookups on alias tokens (not fuzzy — array_to_string is not IMMUTABLE).
CREATE INDEX "Exercise_searchAliases_gin_idx"
  ON "Exercise" USING gin ("searchAliases");
