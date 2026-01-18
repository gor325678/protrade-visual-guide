-- =====================================================
-- ProTrader Systems: Flywheel Database Schema
-- Version: 1.0
-- Date: 2026-01-18
-- =====================================================

-- =====================================================
-- TABLE: quiz_leads
-- Purpose: Store leads captured from quiz email gate
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    quiz_score INTEGER NOT NULL,
    quiz_percentage DECIMAL(5,2) NOT NULL,
    segment TEXT NOT NULL CHECK (segment IN ('beginner', 'intermediate', 'advanced')),
    referral_code TEXT,
    source TEXT DEFAULT 'quiz',
    brevo_synced BOOLEAN DEFAULT FALSE,
    brevo_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads(email);
CREATE INDEX IF NOT EXISTS idx_quiz_leads_segment ON quiz_leads(segment);
CREATE INDEX IF NOT EXISTS idx_quiz_leads_referral ON quiz_leads(referral_code);

-- =====================================================
-- TABLE: referrals
-- Purpose: Track referral program participants and commissions
-- =====================================================
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referred_email TEXT,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'completed', 'paid')),
    commission_amount DECIMAL(10,2) DEFAULT 170.00,
    commission_paid BOOLEAN DEFAULT FALSE,
    commission_paid_at TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    payment_details JSONB,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for referral tracking
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- =====================================================
-- TABLE: referral_stats (Materialized View alternative)
-- Purpose: Pre-calculated referral statistics per user
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    pending_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    pending_earnings DECIMAL(10,2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: testimonials
-- Purpose: Store student testimonials for social proof
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role TEXT,
    avatar_emoji TEXT DEFAULT '📈',
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    video_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    trading_result TEXT,
    location TEXT,
    telegram_handle TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: nps_surveys
-- Purpose: Net Promoter Score collection
-- =====================================================
CREATE TABLE IF NOT EXISTS nps_surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
    category TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN score >= 9 THEN 'promoter'
            WHEN score >= 7 THEN 'passive'
            ELSE 'detractor'
        END
    ) STORED,
    feedback TEXT,
    would_recommend BOOLEAN,
    improvement_suggestions TEXT,
    follow_up_requested BOOLEAN DEFAULT FALSE,
    follow_up_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nps_user ON nps_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_nps_category ON nps_surveys(category);

-- =====================================================
-- FUNCTION: Update referral stats after referral change
-- =====================================================
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO referral_stats (user_id, total_referrals, successful_referrals, pending_referrals, total_earnings, pending_earnings, is_vip, commission_rate)
    SELECT 
        COALESCE(NEW.referrer_id, OLD.referrer_id) as user_id,
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE status = 'completed' OR status = 'paid') as successful_referrals,
        COUNT(*) FILTER (WHERE status = 'pending' OR status = 'registered') as pending_referrals,
        COALESCE(SUM(commission_amount) FILTER (WHERE status = 'paid'), 0) as total_earnings,
        COALESCE(SUM(commission_amount) FILTER (WHERE status = 'completed'), 0) as pending_earnings,
        COUNT(*) FILTER (WHERE status = 'completed' OR status = 'paid') >= 3 as is_vip,
        CASE WHEN COUNT(*) FILTER (WHERE status = 'completed' OR status = 'paid') >= 3 THEN 20.00 ELSE 10.00 END as commission_rate
    FROM referrals
    WHERE referrer_id = COALESCE(NEW.referrer_id, OLD.referrer_id)
    GROUP BY referrer_id
    ON CONFLICT (user_id) DO UPDATE SET
        total_referrals = EXCLUDED.total_referrals,
        successful_referrals = EXCLUDED.successful_referrals,
        pending_referrals = EXCLUDED.pending_referrals,
        total_earnings = EXCLUDED.total_earnings,
        pending_earnings = EXCLUDED.pending_earnings,
        is_vip = EXCLUDED.is_vip,
        commission_rate = EXCLUDED.commission_rate,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats
DROP TRIGGER IF EXISTS trigger_update_referral_stats ON referrals;
CREATE TRIGGER trigger_update_referral_stats
    AFTER INSERT OR UPDATE OR DELETE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_referral_stats();

-- =====================================================
-- FUNCTION: Get referral code for user
-- =====================================================
CREATE OR REPLACE FUNCTION get_referral_code(user_id UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN UPPER(SUBSTRING(user_id::TEXT, 1, 8));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Process referral from code
-- =====================================================
CREATE OR REPLACE FUNCTION process_referral(
    p_referral_code TEXT,
    p_referred_email TEXT,
    p_referred_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_referrer_id UUID;
    v_referral_id UUID;
BEGIN
    -- Find referrer by code
    SELECT id INTO v_referrer_id
    FROM auth.users
    WHERE UPPER(SUBSTRING(id::TEXT, 1, 8)) = UPPER(p_referral_code);
    
    IF v_referrer_id IS NULL THEN
        RAISE EXCEPTION 'Invalid referral code';
    END IF;
    
    -- Create referral record
    INSERT INTO referrals (referrer_id, referred_email, referred_user_id, referral_code, status)
    VALUES (v_referrer_id, p_referred_email, p_referred_user_id, p_referral_code, 
            CASE WHEN p_referred_user_id IS NOT NULL THEN 'registered' ELSE 'pending' END)
    RETURNING id INTO v_referral_id;
    
    RETURN v_referral_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Complete referral after purchase
-- =====================================================
CREATE OR REPLACE FUNCTION complete_referral(p_referred_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_referral RECORD;
BEGIN
    -- Find pending referral for this user
    SELECT * INTO v_referral
    FROM referrals
    WHERE referred_user_id = p_referred_user_id
    AND status IN ('pending', 'registered')
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF v_referral IS NOT NULL THEN
        -- Get commission rate (10% or 20% for VIP)
        UPDATE referrals 
        SET 
            status = 'completed',
            commission_amount = CASE 
                WHEN (SELECT is_vip FROM referral_stats WHERE user_id = v_referral.referrer_id) 
                THEN 340.00 
                ELSE 170.00 
            END,
            updated_at = NOW()
        WHERE id = v_referral.id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Enable RLS
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE nps_surveys ENABLE ROW LEVEL SECURITY;

-- Quiz leads: Allow insert from anon, select for admins
CREATE POLICY "Anyone can insert quiz leads" ON quiz_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view quiz leads" ON quiz_leads FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Referrals: Users can see their own referrals
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (
    auth.uid() = referrer_id
);
CREATE POLICY "System can insert referrals" ON referrals FOR INSERT WITH CHECK (true);

-- Referral stats: Users can see their own stats
CREATE POLICY "Users can view own stats" ON referral_stats FOR SELECT USING (
    auth.uid() = user_id
);

-- Testimonials: Anyone can view published
CREATE POLICY "Anyone can view published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Users can insert own testimonials" ON testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NPS: Users can submit their own
CREATE POLICY "Users can insert own NPS" ON nps_surveys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own NPS" ON nps_surveys FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- SAMPLE DATA: Testimonials
-- =====================================================
INSERT INTO testimonials (name, role, avatar_emoji, rating, text, is_verified, is_featured, is_published, location, telegram_handle) VALUES
('Олексій К.', 'Начинающий трейдер → +40% за 3 мес', '🐂', 5, 'После курса я наконец понял, почему сливал депозит. Теперь торгую по системе и за 3 месяца вышел в +40%. Больше не гадаю — следую алгоритму.', true, true, true, 'Київ', '@alexey_trader'),
('Дмитро М.', 'Пользователь инструментов', '📈', 5, 'Калькулятор Risk of Ruin открыл мне глаза. Раньше рисковал 10% на сделку — сейчас 1-2% и сплю спокойно. Бесплатные инструменты — огонь!', true, true, true, 'Одеса', NULL),
('Марія С.', 'Студент курса с августа 2025', '💵', 5, 'Скептически относилась к онлайн-курсам. Но здесь реальные результаты — MT4 statement не подделаешь. Уже на полпути к первой цели.', true, true, true, 'Харків', '@maria_trades'),
('Андрій П.', 'Prop-trader', '🚀', 5, 'Прошёл отбор на prop-firm после этого курса. Система риск-менеджмента — именно то, что требуют фонды. Рекомендую всем серьёзным.', true, true, true, 'Львів', '@andrey_proptrader')
ON CONFLICT DO NOTHING;
