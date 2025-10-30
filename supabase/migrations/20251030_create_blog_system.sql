-- Create comprehensive blog/article management system
-- Includes blogs, analytics, and community features

-- Enum for blog status
DO $$ BEGIN
    CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived', 'scheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum for content type
DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('blog', 'announcement', 'tutorial', 'news', 'review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    author_id UUID REFERENCES users(id),
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    category TEXT,
    tags TEXT[],
    content_type content_type DEFAULT 'blog',
    status blog_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    reading_time_minutes INTEGER DEFAULT 5,
    word_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    meta_keywords TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#10B981',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog analytics and tracking
CREATE TABLE IF NOT EXISTS blog_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id TEXT,
    event_type TEXT NOT NULL, -- 'view', 'like', 'share', 'link_click', 'time_on_page'
    link_url TEXT, -- for internal link tracking
    time_spent_seconds INTEGER,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Community messages/comments
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    parent_id UUID REFERENCES blog_comments(id), -- for nested replies
    content TEXT NOT NULL,
    status TEXT DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
    is_featured BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMPTZ
);

-- Internal link tracking
CREATE TABLE IF NOT EXISTS blog_internal_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_blog_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    target_url TEXT NOT NULL,
    link_text TEXT NOT NULL,
    link_position INTEGER, -- paragraph number where link appears
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog post likes
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blog_id, user_id)
);

-- Blog post shares
CREATE TABLE IF NOT EXISTS blog_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    platform TEXT, -- 'twitter', 'facebook', 'instagram', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog ON blog_analytics(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_type ON blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_timestamp ON blog_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- GIN indexes for array fields
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_meta_keywords ON blog_posts USING gin(meta_keywords);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
-- Everyone can read published posts
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Admin and authors can manage their posts
CREATE POLICY "Authors can manage their own posts" ON blog_posts
    FOR ALL USING (
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('moderator', 'admin')
        )
    );

-- RLS Policies for blog_comments
-- Everyone can read approved comments
CREATE POLICY "Approved comments are viewable by everyone" ON blog_comments
    FOR SELECT USING (status = 'approved');

-- Users can create their own comments
CREATE POLICY "Users can create comments" ON blog_comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        status = 'approved' -- Auto-approve for now
    );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" ON blog_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all comments
CREATE POLICY "Admins can manage all comments" ON blog_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('moderator', 'admin')
        )
    );

-- RLS Policies for blog_analytics
-- Users can view their own analytics, admins can view all
CREATE POLICY "Users can view their own analytics" ON blog_analytics
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('moderator', 'admin')
        )
    );

-- Allow insert for anonymous analytics (tracking)
CREATE POLICY "Allow anonymous analytics inserts" ON blog_analytics
    FOR INSERT WITH CHECK (true);

-- RLS Policies for other tables - Admin only for management
CREATE POLICY "Admins manage categories" ON blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin')
        )
    );

CREATE POLICY "Admins manage tags" ON blog_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin')
        )
    );

-- Everyone can read categories and tags
CREATE POLICY "Everyone can read categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Everyone can read tags" ON blog_tags FOR SELECT USING (true);

-- Users can manage their own likes/shares
CREATE POLICY "Users can manage their own likes" ON blog_likes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own shares" ON blog_shares
    FOR ALL USING (auth.uid() = user_id);

-- Functions for updating counters
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts SET view_count = view_count + 1 WHERE id = blog_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_blog_like_count(blog_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts SET like_count = like_count + 1 WHERE id = blog_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_blog_like_count(blog_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = blog_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
    reading_time INTEGER;
BEGIN
    -- Split by spaces and count words (rough estimate)
    word_count := array_length(string_to_array(content_text, ' '), 1);

    -- Average reading speed: ~200 words per minute
    reading_time := GREATEST(CEIL(word_count::decimal / 200), 1);

    RETURN reading_time;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract internal links from content
CREATE OR REPLACE FUNCTION extract_internal_links(blog_id UUID, content TEXT)
RETURNS TABLE(link_url TEXT, link_text TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        substring(content FROM '<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>' FOR 2) as link_url,
        substring(content FROM '<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>' FOR 3) as link_text
    WHERE content LIKE '%<a href="/%'; -- Only internal links
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_modified_by = auth.uid();
    IF OLD.content != NEW.content THEN
        NEW.word_count = array_length(string_to_array(NEW.content, ' '), 1);
        NEW.reading_time_minutes = calculate_reading_time(NEW.content);
        NEW.version = COALESCE(OLD.version, 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

CREATE OR REPLACE FUNCTION update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_comments_updated_at
    BEFORE UPDATE ON blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_comments_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON blog_posts TO authenticated, anon;
GRANT ALL ON blog_categories TO authenticated, anon;
GRANT ALL ON blog_tags TO authenticated, anon;
GRANT ALL ON blog_analytics TO authenticated, anon;
GRANT ALL ON blog_comments TO authenticated, anon;
GRANT ALL ON blog_internal_links TO authenticated, anon;
GRANT ALL ON blog_likes TO authenticated, anon;
GRANT ALL ON blog_shares TO authenticated, anon;

-- Comments for documentation
COMMENT ON TABLE blog_posts IS 'Main blog posts table with full content management';
COMMENT ON TABLE blog_analytics IS 'Analytics tracking for blog posts including internal link performance';
COMMENT ON TABLE blog_comments IS 'Community comments and discussion on blog posts';
COMMENT ON TABLE blog_internal_links IS 'Internal link tracking for SEO analysis';
COMMENT ON TABLE blog_categories IS 'Blog categories for organization';
COMMENT ON TABLE blog_tags IS 'Tags for blog posts with usage tracking';
