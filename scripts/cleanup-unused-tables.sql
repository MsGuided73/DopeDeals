-- Database Cleanup Script
-- Removes non-essential tables to simplify the database structure and improve performance

-- =====================================================
-- TABLES TO REMOVE
-- =====================================================

-- Emoji System Tables (not business critical)
DROP TABLE IF EXISTS emoji_usage CASCADE;
DROP TABLE IF EXISTS user_emoji_preferences CASCADE;
DROP TABLE IF EXISTS emoji_recommendations CASCADE;
DROP TABLE IF EXISTS product_emoji_associations CASCADE;

-- Concierge System Tables (nice-to-have, not essential for launch)
DROP TABLE IF EXISTS concierge_conversations CASCADE;
DROP TABLE IF EXISTS concierge_messages CASCADE;
DROP TABLE IF EXISTS concierge_recommendations CASCADE;
DROP TABLE IF EXISTS concierge_analytics CASCADE;

-- =====================================================
-- CLEANUP CONFIRMATION
-- =====================================================

-- Verify removals
SELECT
    'emoji_usage' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'emoji_usage') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'user_emoji_preferences' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_emoji_preferences') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'emoji_recommendations' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'emoji_recommendations') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'product_emoji_associations' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_emoji_associations') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'concierge_conversations' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'concierge_conversations') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'concierge_messages' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'concierge_messages') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'concierge_recommendations' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'concierge_recommendations') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status
UNION ALL
SELECT
    'concierge_analytics' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'concierge_analytics') THEN 'NOT REMOVED' ELSE 'REMOVED' END as status;

-- Show remaining table count
SELECT
    'Remaining Tables' as info,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- List all remaining tables for verification
SELECT
    table_name,
    'ACTIVE' as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
