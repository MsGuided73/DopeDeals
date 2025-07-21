-- ================================================================
-- SUPABASE RLS POLICY FIX
-- Run these commands directly in your Supabase SQL Editor
-- ================================================================

-- Fix content_categories table (the main issue)
CREATE POLICY IF NOT EXISTS "allow_authenticated_read_content_categories" 
ON public.content_categories 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY IF NOT EXISTS "allow_public_read_content_categories" 
ON public.content_categories 
FOR SELECT 
TO anon 
USING (true);

CREATE POLICY IF NOT EXISTS "allow_service_role_all_content_categories" 
ON public.content_categories 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Fix all other main tables to prevent future RLS issues
-- Categories
CREATE POLICY IF NOT EXISTS "allow_read_categories" 
ON public.categories 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY IF NOT EXISTS "allow_service_categories" 
ON public.categories 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Brands  
CREATE POLICY IF NOT EXISTS "allow_read_brands" 
ON public.brands 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY IF NOT EXISTS "allow_service_brands" 
ON public.brands 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Products
CREATE POLICY IF NOT EXISTS "allow_read_products" 
ON public.products 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY IF NOT EXISTS "allow_service_products" 
ON public.products 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Users (careful - only allow users to see their own data)
CREATE POLICY IF NOT EXISTS "allow_users_own_data" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid()::text = id);

CREATE POLICY IF NOT EXISTS "allow_service_users" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Memberships
CREATE POLICY IF NOT EXISTS "allow_read_memberships" 
ON public.memberships 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY IF NOT EXISTS "allow_service_memberships" 
ON public.memberships 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Cart Items (users can only see their own cart)
CREATE POLICY IF NOT EXISTS "allow_users_own_cart" 
ON public.cart_items 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = user_id) 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "allow_service_cart_items" 
ON public.cart_items 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Orders (users can only see their own orders)
CREATE POLICY IF NOT EXISTS "allow_users_own_orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "allow_service_orders" 
ON public.orders 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- User Behavior (users can only see their own behavior data)
CREATE POLICY IF NOT EXISTS "allow_users_own_behavior" 
ON public.user_behavior 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = user_id) 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "allow_service_user_behavior" 
ON public.user_behavior 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- User Preferences (users can only see their own preferences)
CREATE POLICY IF NOT EXISTS "allow_users_own_preferences" 
ON public.user_preferences 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = user_id) 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "allow_service_user_preferences" 
ON public.user_preferences 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Concierge Conversations (users can only see their own conversations)
CREATE POLICY IF NOT EXISTS "allow_users_own_conversations" 
ON public.concierge_conversations 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = user_id) 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "allow_service_concierge_conversations" 
ON public.concierge_conversations 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Concierge Messages (users can only see messages from their conversations)
CREATE POLICY IF NOT EXISTS "allow_users_own_messages" 
ON public.concierge_messages 
FOR ALL 
TO authenticated 
USING (
  conversation_id IN (
    SELECT id FROM public.concierge_conversations 
    WHERE user_id = auth.uid()::text
  )
) 
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.concierge_conversations 
    WHERE user_id = auth.uid()::text
  )
);

CREATE POLICY IF NOT EXISTS "allow_service_concierge_messages" 
ON public.concierge_messages 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Show success message
DO $$
BEGIN
    RAISE NOTICE '✅ All RLS policies have been successfully created!';
    RAISE NOTICE 'Your content_categories table and all other tables should now be accessible.';
END $$;