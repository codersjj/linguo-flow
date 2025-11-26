-- 将所有现有用户标记为邮箱已验证
-- 这样他们可以直接登录,不需要验证邮箱
UPDATE "User" 
SET "emailVerified" = true 
WHERE "emailVerified" = false;

-- 验证更新
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN "emailVerified" = true THEN 1 ELSE 0 END) as verified_users
FROM "User";
