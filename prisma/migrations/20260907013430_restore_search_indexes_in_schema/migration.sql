-- CreateIndex
CREATE INDEX "Exercise_name_trgm_idx" ON "Exercise" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Exercise_namePtBr_trgm_idx" ON "Exercise" USING GIN ("namePtBr" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Exercise_searchAliases_gin_idx" ON "Exercise" USING GIN ("searchAliases");
