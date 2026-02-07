-- Seed romantic templates

INSERT INTO templates (id, name, description, category, thumbnail, config, created_at) VALUES
(
  gen_random_uuid(),
  'Love Letter',
  'A heartfelt love letter template with customizable message and signature. Share your deepest feelings with style.',
  'messages',
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=300&fit=crop',
  json_build_object(
    'greeting', 'My Dearest',
    'main_message', 'You are the most important person in my life...',
    'closing', 'Forever yours'
  ),
  NOW()
),
(
  gen_random_uuid(),
  'Timeline of Us',
  'Create a beautiful timeline of your relationship milestones, memories, and special moments together.',
  'timeline',
  'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=300&fit=crop',
  json_build_object(
    'first_meeting', 'The day we met',
    'first_date', 'Our first date',
    'milestone_1', 'A special moment',
    'milestone_2', 'Another wonderful memory'
  ),
  NOW()
),
(
  gen_random_uuid(),
  'Reasons I Love You',
  'List 50, 100, or any number of reasons why you love someone. Beautifully animated with romantic effects.',
  'list',
  'https://images.unsplash.com/photo-1516481318751-0365be6c75d8?w=400&h=300&fit=crop',
  json_build_object(
    'reason_1', 'Your beautiful smile',
    'reason_2', 'The way you laugh',
    'reason_3', 'Your kindness',
    'reason_4', 'Your strength',
    'reason_5', 'Your wisdom'
  ),
  NOW()
),
(
  gen_random_uuid(),
  'Memory Box',
  'A digital memory box where loved ones can share photos, memories, and messages. Perfect for anniversaries or special occasions.',
  'gallery',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  json_build_object(
    'title', 'Our Memory Box',
    'subtitle', 'A collection of our favorite moments',
    'memory_theme', 'romantic'
  ),
  NOW()
),
(
  gen_random_uuid(),
  'Proposal or Confession',
  'The ultimate romantic template for asking the big question or confessing your love. Animated with rose petals and hearts.',
  'special',
  'https://images.unsplash.com/photo-1518021357461-ce5e4c316d51?w=400&h=300&fit=crop',
  json_build_object(
    'title', 'Will you marry me?',
    'message', 'You make me the happiest person alive. I want to spend forever with you.',
    'button_text', 'Yes!'
  ),
  NOW()
);
