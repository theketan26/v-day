-- Seed romantic templates

INSERT INTO templates (name, description, theme, screens, animations, colors, is_public)
VALUES
(
  'Love Letter',
  'A heartfelt love letter template with customizable message and signature. Share your deepest feelings with style.',
  'romantic',
  '[
    {"id":"greeting","title":"Greeting","type":"text","placeholder":"My Dearest..."},
    {"id":"message","title":"Message","type":"textarea","placeholder":"You are the most important person in my life..."},
    {"id":"signature","title":"Signature","type":"text","placeholder":"Forever yours..."}
  ]'::JSONB,
  '{"type":"fade","duration":500,"easeIn":true}'::JSONB,
  '{"primary":"#ff69b4","secondary":"#ffe4e1","accent":"#ff1493","background":"#fff5f7","text":"#333333"}'::JSONB,
  TRUE
),
(
  'Timeline of Us',
  'Create a beautiful timeline of your relationship milestones, memories, and special moments together.',
  'romantic',
  '[
    {"id":"title","title":"Timeline Title","type":"text","placeholder":"Our Love Story"},
    {"id":"events","title":"Add Events","type":"array","itemLabel":"Milestone","fields":[{"name":"date","label":"Date","type":"date"},{"name":"title","label":"Event Title","type":"text"},{"name":"description","label":"Memory","type":"textarea"}]}
  ]'::JSONB,
  '{"type":"slideUp","duration":400,"stagger":100}'::JSONB,
  '{"primary":"#ff6b9d","secondary":"#f5c2d0","accent":"#ff1493","background":"#fff8fa","text":"#333333"}'::JSONB,
  TRUE
),
(
  'Reasons I Love You',
  'List 50, 100, or any number of reasons why you love someone. Beautifully animated with romantic effects.',
  'romantic',
  '[
    {"id":"intro","title":"Introduction","type":"textarea","placeholder":"Here are all the reasons I love you..."},
    {"id":"reasons","title":"Add Reasons","type":"array","itemLabel":"Reason","fields":[{"name":"reason","label":"Why I love you...","type":"textarea"}]},
    {"id":"closing","title":"Closing Message","type":"textarea","placeholder":"And so much more..."}
  ]'::JSONB,
  '{"type":"pop","duration":300,"bounce":true}'::JSONB,
  '{"primary":"#e91e63","secondary":"#fce4ec","accent":"#c2185b","background":"#fff3f8","text":"#333333"}'::JSONB,
  TRUE
),
(
  'Memory Box',
  'A digital memory box where loved ones can share photos, memories, and messages. Perfect for anniversaries or special occasions.',
  'romantic',
  '[
    {"id":"title","title":"Box Title","type":"text","placeholder":"Our Memory Box"},
    {"id":"memories","title":"Add Memories","type":"array","itemLabel":"Memory","fields":[{"name":"title","label":"Memory Title","type":"text"},{"name":"image","label":"Photo","type":"image"},{"name":"caption","label":"Caption","type":"textarea"}]}
  ]'::JSONB,
  '{"type":"zoomIn","duration":350,"rotation":5}'::JSONB,
  '{"primary":"#ff69b4","secondary":"#fff0f5","accent":"#ff1493","background":"#fffbfd","text":"#333333"}'::JSONB,
  TRUE
),
(
  'Proposal or Confession',
  'The ultimate romantic template for asking the big question or confessing your love. Animated with rose petals and hearts.',
  'romantic',
  '[
    {"id":"setup","title":"Set the Scene","type":"textarea","placeholder":"Describe the moment..."},
    {"id":"message","title":"The Big Moment","type":"textarea","placeholder":"I want to spend forever with you..."},
    {"id":"celebration","title":"Looking Forward","type":"textarea","placeholder":"Will you...?"}
  ]'::JSONB,
  '{"type":"pulse","duration":600,"glow":true}'::JSONB,
  '{"primary":"#ff1493","secondary":"#ffe4f0","accent":"#c2185b","background":"#fff0f6","text":"#333333"}'::JSONB,
  TRUE
);
