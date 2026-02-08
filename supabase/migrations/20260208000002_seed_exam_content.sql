-- Seed exam content for B2, C1, and C2 levels
-- This provides initial content for testing and development

-- ============================================
-- PART 1: Interview Questions (30 rows)
-- ============================================

-- B2 Part 1 Questions (10)
INSERT INTO exam_questions (level, part, topic, question_text, follow_up_questions, difficulty) VALUES
('B2', 'part1', 'personal', 'Where are you from?', ARRAY['Has your hometown changed much over the years?', 'Would you recommend it as a place to visit?'], 1),
('B2', 'part1', 'studies', 'What are you studying at the moment?', ARRAY['Why did you choose that subject?', 'What do you plan to do after your studies?'], 2),
('B2', 'part1', 'work', 'Do you have a job at the moment?', ARRAY['What do you enjoy most about your work?', 'Is there anything you would like to change about your job?'], 2),
('B2', 'part1', 'free_time', 'What do you like to do in your free time?', ARRAY['How often do you get time to do this?', 'Did you have different hobbies when you were younger?'], 1),
('B2', 'part1', 'travel', 'Do you enjoy travelling?', ARRAY['What makes a good holiday for you?', 'Where would you like to go next?'], 2),
('B2', 'part1', 'technology', 'How important is technology in your daily life?', ARRAY['Which apps or devices do you use most?', 'Do you think we rely too much on technology?'], 2),
('B2', 'part1', 'environment', 'Are you concerned about environmental issues?', ARRAY['What do you do to help the environment?', 'Do you think individuals can make a difference?'], 2),
('B2', 'part1', 'education', 'What was your favorite subject at school?', ARRAY['Why did you enjoy it so much?', 'Do you still have an interest in that subject?'], 1),
('B2', 'part1', 'city_life', 'Do you prefer living in a city or the countryside?', ARRAY['What are the advantages of your preference?', 'Have you ever considered moving?'], 2),
('B2', 'part1', 'health', 'How do you try to stay healthy?', ARRAY['Is it easy to maintain a healthy lifestyle?', 'What advice would you give to someone who wants to be healthier?'], 2);

-- C1 Part 1 Questions (10)
INSERT INTO exam_questions (level, part, topic, question_text, follow_up_questions, difficulty) VALUES
('C1', 'part1', 'personal', 'Could you tell me something about where you live?', ARRAY['How has the area developed over the years?', 'What impact has this had on the local community?'], 2),
('C1', 'part1', 'studies', 'What motivates you in your academic or professional life?', ARRAY['How do you handle setbacks or challenges?', 'What role has education played in shaping your goals?'], 2),
('C1', 'part1', 'work', 'How do you see your career developing in the future?', ARRAY['What skills do you think will be most valuable?', 'How do you balance ambition with other aspects of life?'], 2),
('C1', 'part1', 'free_time', 'How important is leisure time to you?', ARRAY['How do you decide what to prioritize?', 'Has your approach to free time changed as you have gotten older?'], 2),
('C1', 'part1', 'travel', 'What do you think you can learn from travelling to different countries?', ARRAY['How has travel changed your perspective?', 'What challenges might travelers face in unfamiliar cultures?'], 3),
('C1', 'part1', 'technology', 'How has technology changed the way people communicate?', ARRAY['Do you think these changes are entirely positive?', 'What might we lose as digital communication increases?'], 3),
('C1', 'part1', 'environment', 'What responsibility do governments have in addressing climate change?', ARRAY['How effective are international agreements?', 'What role should businesses play?'], 3),
('C1', 'part1', 'education', 'How has education in your country changed in recent decades?', ARRAY['What improvements would you like to see?', 'How important is lifelong learning?'], 2),
('C1', 'part1', 'media', 'How do you think social media has influenced public opinion?', ARRAY['What are the risks of getting news from social media?', 'How can people become more critical consumers of information?'], 3),
('C1', 'part1', 'health', 'What factors contribute to mental wellbeing in modern society?', ARRAY['How can workplaces better support mental health?', 'What role does community play in individual wellbeing?'], 3);

-- C2 Part 1 Questions (10)
INSERT INTO exam_questions (level, part, topic, question_text, follow_up_questions, difficulty) VALUES
('C2', 'part1', 'personal', 'What aspects of your cultural background have been most influential in shaping who you are?', ARRAY['How do you reconcile traditional values with modern life?', 'In what ways might your cultural perspective differ from others?'], 3),
('C2', 'part1', 'studies', 'To what extent do you think formal education prepares people for the challenges of modern life?', ARRAY['What gaps exist in current educational approaches?', 'How might education need to evolve in the coming decades?'], 3),
('C2', 'part1', 'work', 'How do you think the concept of work-life balance is evolving?', ARRAY['What structural changes might help achieve this balance?', 'Is the pursuit of balance realistic for everyone?'], 3),
('C2', 'part1', 'technology', 'In what ways might artificial intelligence transform society over the next generation?', ARRAY['What ethical considerations should guide AI development?', 'How might we ensure technology benefits are distributed equitably?'], 3),
('C2', 'part1', 'environment', 'How do you think history will judge our generation regarding environmental stewardship?', ARRAY['What systemic changes are needed beyond individual action?', 'How do we balance development with sustainability?'], 3),
('C2', 'part1', 'media', 'How has the democratization of information affected the quality of public discourse?', ARRAY['What responsibilities come with freedom of expression?', 'How might we address misinformation while preserving free speech?'], 3),
('C2', 'part1', 'society', 'What role should tradition play in a rapidly changing world?', ARRAY['How do societies navigate between preservation and progress?', 'When might tradition become an obstacle to necessary change?'], 3),
('C2', 'part1', 'philosophy', 'How do you think the pursuit of happiness has changed in modern times?', ARRAY['What does a meaningful life look like to you?', 'How might materialism affect our sense of fulfillment?'], 3),
('C2', 'part1', 'globalization', 'What tensions arise between global connectivity and local identity?', ARRAY['How can communities maintain their uniqueness while participating in global culture?', 'What might we lose as cultures become more homogenized?'], 3),
('C2', 'part1', 'future', 'If you could address the world leaders of tomorrow, what message would you convey?', ARRAY['What lessons from the past should guide future decisions?', 'What gives you hope or concern about the future?'], 3);

-- ============================================
-- PART 4: Discussion Questions (30 rows)
-- ============================================

-- B2 Part 4 Questions (10)
INSERT INTO exam_questions (level, part, topic, question_text, follow_up_questions, difficulty) VALUES
('B2', 'part4', 'learning', 'Some people think that learning languages should start in primary school. What do you think?', ARRAY['What are the challenges of learning languages at a young age?', 'How important is it to learn more than one language?'], 2),
('B2', 'part4', 'work', 'Do you think working from home is better than working in an office?', ARRAY['What are the main advantages of each?', 'How might this affect team relationships?'], 2),
('B2', 'part4', 'technology', 'How has social media changed the way people make friends?', ARRAY['Are online friendships as valuable as face-to-face ones?', 'What are the risks of relying on social media for relationships?'], 2),
('B2', 'part4', 'environment', 'What can ordinary people do to protect the environment?', ARRAY['How effective are individual actions compared to government policies?', 'What motivates people to make environmentally friendly choices?'], 2),
('B2', 'part4', 'education', 'Is it better to study a subject you enjoy or one that will lead to a good job?', ARRAY['How important is passion in career success?', 'What advice would you give to young people choosing what to study?'], 2),
('B2', 'part4', 'city_life', 'What problems do people face living in big cities today?', ARRAY['How might these problems be solved?', 'Why do people continue to move to cities despite these problems?'], 2),
('B2', 'part4', 'health', 'Why do you think some people find it difficult to maintain a healthy lifestyle?', ARRAY['What role should governments play in promoting health?', 'How has the concept of health changed over time?'], 2),
('B2', 'part4', 'travel', 'Is it important for people to travel to other countries?', ARRAY['What can people learn from traveling abroad?', 'Are there alternatives to physical travel for cultural exchange?'], 2),
('B2', 'part4', 'media', 'How has the way we get news changed in recent years?', ARRAY['What are the advantages and disadvantages of online news?', 'How can people identify reliable news sources?'], 2),
('B2', 'part4', 'family', 'How have family relationships changed compared to previous generations?', ARRAY['What factors have caused these changes?', 'Are these changes positive or negative?'], 2);

-- C1 Part 4 Questions (10)
INSERT INTO exam_questions (level, part, topic, question_text, follow_up_questions, difficulty) VALUES
('C1', 'part4', 'education', 'To what extent should universities prepare students for specific careers rather than providing a general education?', ARRAY['How might overspecialization limit future opportunities?', 'What is the value of studying subjects with no obvious practical application?'], 3),
('C1', 'part4', 'work', 'How might automation and AI affect employment patterns in the coming decades?', ARRAY['What industries are most vulnerable to these changes?', 'How should societies prepare for potential job displacement?'], 3),
('C1', 'part4', 'technology', 'What ethical considerations should guide the development of emerging technologies?', ARRAY['Who should be responsible for ensuring technology is used responsibly?', 'How do we balance innovation with potential risks?'], 3),
('C1', 'part4', 'environment', 'Should developed countries bear more responsibility for addressing climate change than developing nations?', ARRAY['How can we ensure fair burden-sharing in environmental agreements?', 'What role should economic considerations play in environmental policy?'], 3),
('C1', 'part4', 'media', 'How has the rise of streaming services changed the entertainment industry?', ARRAY['What impact has this had on traditional media?', 'How might content creation evolve in response to these changes?'], 2),
('C1', 'part4', 'society', 'What role should governments play in reducing inequality?', ARRAY['What policies might be most effective?', 'How do we balance equality with individual freedom?'], 3),
('C1', 'part4', 'health', 'How should healthcare systems adapt to aging populations?', ARRAY['What preventive measures might reduce future healthcare burdens?', 'Who should bear the cost of caring for the elderly?'], 3),
('C1', 'part4', 'culture', 'How do you think globalization has affected local cultures and traditions?', ARRAY['What aspects of local culture are worth preserving?', 'Can cultures evolve while maintaining their essential identity?'], 3),
('C1', 'part4', 'privacy', 'How has technology changed our expectations of privacy?', ARRAY['What trade-offs do we make between convenience and privacy?', 'How might privacy concerns shape future technology adoption?'], 3),
('C1', 'part4', 'urban', 'What makes a city truly livable in the modern era?', ARRAY['How can urban planning address diverse community needs?', 'What role should citizen input play in city development?'], 2);

-- C2 Part 4 Questions (10)
INSERT INTO exam_questions (level, part, topic, question_text, follow_up_questions, difficulty) VALUES
('C2', 'part4', 'philosophy', 'To what extent do you believe that objective truth exists, and how does this affect public discourse?', ARRAY['How should we navigate disagreements when fundamental assumptions differ?', 'What role does expertise play in establishing shared understanding?'], 3),
('C2', 'part4', 'society', 'How might the concept of national identity evolve in an increasingly interconnected world?', ARRAY['What tensions arise between national interests and global cooperation?', 'How might future generations define their sense of belonging?'], 3),
('C2', 'part4', 'technology', 'What are the implications of increasingly sophisticated AI systems for human cognition and creativity?', ARRAY['How might our reliance on AI affect critical thinking skills?', 'Could AI enhance rather than replace human creativity?'], 3),
('C2', 'part4', 'ethics', 'How should societies balance individual liberty with collective responsibility?', ARRAY['Where should the limits of personal freedom be drawn?', 'How do different cultural perspectives approach this balance?'], 3),
('C2', 'part4', 'economics', 'Is perpetual economic growth sustainable, and what alternatives might exist?', ARRAY['How might we redefine prosperity beyond GDP?', 'What systemic changes would a post-growth economy require?'], 3),
('C2', 'part4', 'democracy', 'How resilient are democratic institutions in the face of modern challenges?', ARRAY['What threatens democratic participation today?', 'How might democracy need to evolve to remain relevant?'], 3),
('C2', 'part4', 'science', 'What responsibilities do scientists have in communicating their findings to the public?', ARRAY['How can we bridge the gap between scientific consensus and public understanding?', 'What role does uncertainty play in scientific communication?'], 3),
('C2', 'part4', 'art', 'What role does art play in challenging or reinforcing societal norms?', ARRAY['How has the relationship between art and politics evolved?', 'Can art be truly apolitical?'], 3),
('C2', 'part4', 'future', 'If you could redesign one fundamental aspect of how society is organized, what would it be and why?', ARRAY['What obstacles would such a change face?', 'How might unintended consequences be anticipated and addressed?'], 3),
('C2', 'part4', 'humanity', 'What do you consider to be the greatest achievement of human civilization, and what does your choice reveal about your values?', ARRAY['How might future generations view our current achievements?', 'What achievements should we prioritize going forward?'], 3);

-- ============================================
-- PART 2: Long Turn Content (15 rows)
-- ============================================

-- B2 Part 2 Content (5)
INSERT INTO exam_part2_content (level, topic, image_urls, prompt_text, follow_up_question, comparison_points, difficulty) VALUES
('B2', 'learning', ARRAY['exam-photos/temp/b2-learning-1.jpg', 'exam-photos/temp/b2-learning-2.jpg'],
 'Here are two photographs showing people learning. I would like you to compare the photographs and say what you think the people might be enjoying about these different ways of learning.',
 'Which way of learning do you think is more effective?',
 ARRAY['environment', 'interaction level', 'resources used', 'focus level', 'type of knowledge'], 2),

('B2', 'work', ARRAY['exam-photos/temp/b2-work-1.jpg', 'exam-photos/temp/b2-work-2.jpg'],
 'These photographs show people working in different environments. Compare the photographs and say how you think the people feel about their work.',
 'Which work environment would you prefer?',
 ARRAY['physical environment', 'collaboration', 'formality', 'stress levels', 'creativity'], 2),

('B2', 'leisure', ARRAY['exam-photos/temp/b2-leisure-1.jpg', 'exam-photos/temp/b2-leisure-2.jpg'],
 'These photographs show people enjoying their free time. Compare the photographs and say what benefits these activities might have.',
 'How important is it to have varied leisure activities?',
 ARRAY['social interaction', 'physical activity', 'mental stimulation', 'relaxation', 'skill development'], 2),

('B2', 'transport', ARRAY['exam-photos/temp/b2-transport-1.jpg', 'exam-photos/temp/b2-transport-2.jpg'],
 'Here are two photographs showing different forms of transport. Compare the photographs and say what the advantages and disadvantages of each might be.',
 'How do you think transport will change in the future?',
 ARRAY['environmental impact', 'convenience', 'cost', 'speed', 'social aspect'], 2),

('B2', 'celebration', ARRAY['exam-photos/temp/b2-celebration-1.jpg', 'exam-photos/temp/b2-celebration-2.jpg'],
 'These photographs show people celebrating. Compare the photographs and say what might make these celebrations memorable.',
 'Why do you think celebrations are important in our lives?',
 ARRAY['scale of event', 'participants', 'traditions', 'atmosphere', 'significance'], 2);

-- C1 Part 2 Content (5)
INSERT INTO exam_part2_content (level, topic, image_urls, prompt_text, follow_up_question, comparison_points, difficulty) VALUES
('C1', 'communication', ARRAY['exam-photos/temp/c1-communication-1.jpg', 'exam-photos/temp/c1-communication-2.jpg', 'exam-photos/temp/c1-communication-3.jpg'],
 'These photographs show different ways people communicate. Compare two of the photographs and discuss how effective each form of communication might be in different contexts.',
 'How do you think communication methods will evolve in the future?',
 ARRAY['formality', 'emotional connection', 'clarity', 'accessibility', 'permanence'], 3),

('C1', 'urban_nature', ARRAY['exam-photos/temp/c1-nature-1.jpg', 'exam-photos/temp/c1-nature-2.jpg', 'exam-photos/temp/c1-nature-3.jpg'],
 'These photographs show different relationships between urban spaces and nature. Compare two of the photographs and discuss the importance of integrating nature into city environments.',
 'What challenges might cities face in creating more green spaces?',
 ARRAY['wellbeing benefits', 'practical constraints', 'community impact', 'environmental value', 'design considerations'], 3),

('C1', 'generations', ARRAY['exam-photos/temp/c1-generations-1.jpg', 'exam-photos/temp/c1-generations-2.jpg', 'exam-photos/temp/c1-generations-3.jpg'],
 'These photographs show interactions between different generations. Compare two of the photographs and discuss what each generation might gain from these interactions.',
 'How can communities encourage more intergenerational connection?',
 ARRAY['knowledge transfer', 'emotional support', 'perspective sharing', 'mutual understanding', 'cultural continuity'], 3),

('C1', 'innovation', ARRAY['exam-photos/temp/c1-innovation-1.jpg', 'exam-photos/temp/c1-innovation-2.jpg', 'exam-photos/temp/c1-innovation-3.jpg'],
 'These photographs show different types of innovation. Compare two of the photographs and discuss how each type of innovation might impact society.',
 'What factors determine whether an innovation succeeds or fails?',
 ARRAY['scale of change', 'accessibility', 'sustainability', 'social implications', 'economic impact'], 3),

('C1', 'challenge', ARRAY['exam-photos/temp/c1-challenge-1.jpg', 'exam-photos/temp/c1-challenge-2.jpg', 'exam-photos/temp/c1-challenge-3.jpg'],
 'These photographs show people facing different challenges. Compare two of the photographs and discuss what qualities might help people overcome these challenges.',
 'How do challenges contribute to personal development?',
 ARRAY['physical demands', 'mental resilience', 'support systems', 'risk level', 'reward nature'], 3);

-- C2 Part 2 Content (5)
INSERT INTO exam_part2_content (level, topic, image_urls, prompt_text, follow_up_question, comparison_points, difficulty) VALUES
('C2', 'identity', ARRAY['exam-photos/temp/c2-identity-1.jpg', 'exam-photos/temp/c2-identity-2.jpg'],
 'These photographs both relate to the theme of identity. I would like you to compare the photographs and explore how identity is expressed in different ways.',
 'In what ways do you think identity formation has changed in the digital age?',
 ARRAY['individual vs collective', 'cultural markers', 'personal choice', 'external perception', 'evolution over time'], 3),

('C2', 'power', ARRAY['exam-photos/temp/c2-power-1.jpg', 'exam-photos/temp/c2-power-2.jpg'],
 'These photographs explore different manifestations of power. Compare the photographs and discuss how power is demonstrated in each context.',
 'How might our understanding of power shift in the coming decades?',
 ARRAY['visible vs invisible', 'legitimate vs coercive', 'individual vs institutional', 'temporary vs enduring', 'consequences'], 3),

('C2', 'connection', ARRAY['exam-photos/temp/c2-connection-1.jpg', 'exam-photos/temp/c2-connection-2.jpg'],
 'These photographs illustrate different forms of human connection. Compare the photographs and explore what these connections reveal about human nature.',
 'How do you think technology is fundamentally changing human relationships?',
 ARRAY['depth vs breadth', 'proximity', 'intentionality', 'vulnerability', 'reciprocity'], 3),

('C2', 'change', ARRAY['exam-photos/temp/c2-change-1.jpg', 'exam-photos/temp/c2-change-2.jpg'],
 'These photographs capture moments of change or transition. Compare the photographs and discuss the role of change in human experience.',
 'What aspects of change do people tend to resist, and why?',
 ARRAY['pace', 'reversibility', 'agency', 'impact', 'adaptation required'], 3),

('C2', 'meaning', ARRAY['exam-photos/temp/c2-meaning-1.jpg', 'exam-photos/temp/c2-meaning-2.jpg'],
 'These photographs both touch on the search for meaning. Compare the photographs and reflect on what constitutes a meaningful experience.',
 'How do you think the pursuit of meaning differs across cultures and generations?',
 ARRAY['individual vs shared', 'effort involved', 'duration', 'tangibility', 'impact on others'], 3);

-- ============================================
-- PART 3: Collaborative Task Content (15 rows)
-- ============================================

-- B2 Part 3 Content (5)
INSERT INTO exam_part3_content (level, topic, visual_prompt_url, discussion_prompt, options, decision_prompt, difficulty, diagram_mermaid) VALUES
('B2', 'city_life', NULL,
 'Here are some ways a city could improve quality of life for its residents. Talk together about how effective each of these might be.',
 ARRAY['Improving public transport', 'Creating more green spaces', 'Increasing safety measures', 'Building affordable housing', 'Organizing community events'],
 'Which two of these would have the biggest positive impact?',
 2,
 'mindmap
  root((Quality of Life))
    Public Transport
      Reduces traffic
      Affordable access
      Environmental benefit
    Green Spaces
      Mental health
      Recreation
      Clean air
    Safety Measures
      Peace of mind
      Community trust
      Investment appeal
    Affordable Housing
      Social stability
      Reduced stress
      Economic diversity
    Community Events
      Social bonds
      Cultural identity
      Inclusion'),

('B2', 'environment', NULL,
 'Here are some ways to encourage people to be more environmentally friendly. Talk together about how practical each approach might be.',
 ARRAY['Banning single-use plastics', 'Offering tax incentives for green choices', 'Environmental education in schools', 'Improving recycling facilities', 'Promoting car-free days'],
 'Which approach do you think would be most effective in changing behavior?',
 2,
 'mindmap
  root((Environmental Action))
    Plastic Ban
      Immediate impact
      Requires alternatives
      Enforcement needed
    Tax Incentives
      Financial motivation
      Rewards good behavior
      Complex to implement
    Education
      Long-term change
      Builds awareness
      Slow results
    Recycling
      Easy to participate
      Infrastructure cost
      Visible action
    Car-free Days
      Community experience
      Temporary impact
      Raises awareness'),

('B2', 'education', NULL,
 'Here are some ways to make education more engaging for students. Talk together about the advantages and disadvantages of each.',
 ARRAY['Using more technology in lessons', 'Reducing class sizes', 'Making subjects more practical', 'Giving students more choice', 'Increasing outdoor learning'],
 'Which two changes would benefit students most?',
 2,
 'mindmap
  root((Engaging Education))
    Technology
      Interactive content
      Digital skills
      Distraction risk
    Smaller Classes
      Individual attention
      Better discussion
      Higher costs
    Practical Focus
      Real-world skills
      Higher motivation
      Resource intensive
    Student Choice
      Ownership of learning
      Personal interest
      Guidance needed
    Outdoor Learning
      Fresh perspective
      Physical activity
      Weather dependent'),

('B2', 'health', NULL,
 'Here are some ways to promote better health in a community. Talk together about how these might affect different groups of people.',
 ARRAY['Building more sports facilities', 'Offering free health screenings', 'Creating healthy eating campaigns', 'Providing mental health support', 'Organizing group fitness activities'],
 'Which initiative should be prioritized with limited funding?',
 2,
 'mindmap
  root((Community Health))
    Sports Facilities
      Physical fitness
      Social activity
      Accessibility issues
    Health Screenings
      Early detection
      Prevention focus
      One-time event
    Eating Campaigns
      Awareness building
      Behavior change
      Information overload
    Mental Health Support
      Growing need
      Reduces stigma
      Professional requirement
    Group Fitness
      Community building
      Motivation boost
      Scheduling challenges'),

('B2', 'technology', NULL,
 'Here are some concerns about how technology affects young people. Talk together about how serious each concern is.',
 ARRAY['Spending too much time on screens', 'Privacy and personal data', 'Cyberbullying', 'Impact on physical health', 'Reduced face-to-face communication'],
 'Which concern requires the most urgent attention?',
 2,
 'mindmap
  root((Tech Concerns))
    Screen Time
      Addiction risk
      Sleep disruption
      Productivity loss
    Privacy
      Data collection
      Identity theft
      Surveillance
    Cyberbullying
      Mental health impact
      Anonymous attacks
      24/7 exposure
    Physical Health
      Sedentary lifestyle
      Eye strain
      Posture issues
    Communication
      Social skills
      Emotional intelligence
      Isolation risk');

-- C1 Part 3 Content (5)
INSERT INTO exam_part3_content (level, topic, visual_prompt_url, discussion_prompt, options, decision_prompt, difficulty, diagram_mermaid) VALUES
('C1', 'workplace', NULL,
 'Here are some factors that might contribute to job satisfaction. Discuss how significant each factor is and how they might interact with each other.',
 ARRAY['Competitive salary and benefits', 'Opportunities for career advancement', 'Work-life balance', 'Meaningful and challenging work', 'Positive relationships with colleagues'],
 'Which factor do you think is most fundamental to long-term job satisfaction?',
 3,
 'mindmap
  root((Job Satisfaction))
    Salary
      Basic needs
      Recognition
      Market value
    Advancement
      Growth mindset
      Future security
      Achievement
    Work-life Balance
      Personal fulfillment
      Sustainability
      Relationships
    Meaningful Work
      Purpose
      Engagement
      Legacy
    Colleagues
      Daily experience
      Support network
      Collaboration'),

('C1', 'society', NULL,
 'Here are some challenges facing modern democracies. Discuss the causes and potential consequences of each challenge.',
 ARRAY['Declining voter participation', 'Spread of misinformation', 'Political polarization', 'Influence of money in politics', 'Erosion of trust in institutions'],
 'Which challenge poses the greatest threat to democratic governance?',
 3,
 'mindmap
  root((Democratic Challenges))
    Voter Apathy
      Disillusionment
      Access barriers
      Perceived irrelevance
    Misinformation
      Echo chambers
      Manipulation
      Truth erosion
    Polarization
      Tribal identity
      Compromise failure
      Social division
    Money Influence
      Policy capture
      Inequality
      Access disparity
    Trust Erosion
      Cynicism
      Disengagement
      Legitimacy crisis'),

('C1', 'education', NULL,
 'Here are some skills that are increasingly important in the modern world. Discuss how effectively educational systems prepare people for these.',
 ARRAY['Critical thinking and analysis', 'Digital literacy', 'Emotional intelligence', 'Adaptability and resilience', 'Collaborative problem-solving'],
 'Which skill gap is most urgent to address?',
 3,
 'mindmap
  root((Future Skills))
    Critical Thinking
      Information filtering
      Decision making
      Independence
    Digital Literacy
      Technology navigation
      Online safety
      Tool proficiency
    Emotional Intelligence
      Self-awareness
      Empathy
      Conflict resolution
    Adaptability
      Change management
      Continuous learning
      Uncertainty tolerance
    Collaboration
      Diverse perspectives
      Shared goals
      Communication'),

('C1', 'environment', NULL,
 'Here are some approaches to addressing climate change. Discuss the feasibility and effectiveness of each approach.',
 ARRAY['Carbon taxation', 'Investment in renewable energy', 'Individual behavior change', 'International agreements', 'Technological innovation'],
 'Which combination of approaches would be most effective?',
 3,
 'mindmap
  root((Climate Action))
    Carbon Tax
      Market mechanism
      Revenue generation
      Political resistance
    Renewables
      Clean energy
      Job creation
      Infrastructure needs
    Behavior Change
      Individual impact
      Aggregate effect
      Slow adoption
    Agreements
      Global coordination
      Enforcement challenges
      Shared responsibility
    Innovation
      Solution potential
      Uncertainty
      Investment required'),

('C1', 'media', NULL,
 'Here are some ways the media landscape has changed. Discuss the implications of these changes for society.',
 ARRAY['Rise of citizen journalism', 'Decline of traditional newspapers', 'Algorithm-driven content', 'Shortened attention spans', 'Blurring of news and entertainment'],
 'Which change has had the most significant impact on public discourse?',
 3,
 'mindmap
  root((Media Evolution))
    Citizen Journalism
      Diverse voices
      Quality concerns
      Real-time coverage
    Print Decline
      Lost expertise
      Digital shift
      Local news gap
    Algorithms
      Personalization
      Filter bubbles
      Engagement optimization
    Attention Spans
      Content format
      Depth reduction
      Visual preference
    News Entertainment
      Engagement
      Credibility issues
      Emotional appeal');

-- C2 Part 3 Content (5)
INSERT INTO exam_part3_content (level, topic, visual_prompt_url, discussion_prompt, options, decision_prompt, difficulty, diagram_mermaid) VALUES
('C2', 'philosophy', NULL,
 'These concepts all relate to what constitutes a good life. Explore how each might contribute to human flourishing and how they might sometimes conflict.',
 ARRAY['Personal freedom and autonomy', 'Strong community bonds', 'Material security and comfort', 'Pursuit of knowledge and truth', 'Creative self-expression'],
 'Is it possible to achieve all of these, or must we inevitably prioritize some over others?',
 3,
 'mindmap
  root((Human Flourishing))
    Freedom
      Self-determination
      Responsibility
      Isolation risk
    Community
      Belonging
      Support
      Conformity pressure
    Security
      Peace of mind
      Foundation
      Complacency
    Knowledge
      Understanding
      Growth
      Uncertainty
    Creativity
      Self-expression
      Innovation
      Vulnerability'),

('C2', 'ethics', NULL,
 'These ethical frameworks offer different approaches to moral decision-making. Discuss the strengths and limitations of each in addressing contemporary moral dilemmas.',
 ARRAY['Consequentialism (judging by outcomes)', 'Deontology (duty-based ethics)', 'Virtue ethics (character focus)', 'Care ethics (relationship focus)', 'Pragmatic ethics (contextual approach)'],
 'Can any single framework adequately address the complexity of modern ethical challenges?',
 3,
 'mindmap
  root((Ethical Frameworks))
    Consequentialism
      Outcome focus
      Calculation challenges
      Uncertainty
    Deontology
      Clear rules
      Inflexibility
      Universal principles
    Virtue Ethics
      Character building
      Cultural variation
      Long-term focus
    Care Ethics
      Relationships
      Contextual
      Scalability issues
    Pragmatism
      Flexibility
      No absolutes
      Adaptability'),

('C2', 'future', NULL,
 'These developments may fundamentally reshape human civilization. Discuss the opportunities and risks each presents.',
 ARRAY['Artificial general intelligence', 'Genetic engineering and enhancement', 'Space colonization', 'Post-scarcity economics', 'Extended human lifespan'],
 'Which development deserves the most careful ethical consideration before advancement?',
 3,
 'mindmap
  root((Future Developments))
    AGI
      Problem solving
      Control challenges
      Job displacement
    Genetic Engineering
      Disease elimination
      Enhancement ethics
      Access inequality
    Space Colonization
      Species survival
      Resource expansion
      Governance questions
    Post-scarcity
      Need elimination
      Purpose questions
      Transition challenges
    Extended Life
      Experience accumulation
      Resource implications
      Social dynamics'),

('C2', 'society', NULL,
 'These tensions exist in most complex societies. Explore how different societies navigate these competing values.',
 ARRAY['Individual rights vs collective welfare', 'Tradition vs progress', 'Security vs liberty', 'Equality vs meritocracy', 'Local identity vs global citizenship'],
 'Are these tensions inherently irresolvable, or can societies find sustainable balances?',
 3,
 'mindmap
  root((Societal Tensions))
    Rights vs Welfare
      Legal frameworks
      Social contracts
      Emergency exceptions
    Tradition vs Progress
      Cultural continuity
      Innovation drive
      Generational conflict
    Security vs Liberty
      Safety needs
      Privacy concerns
      Power abuse
    Equality vs Merit
      Fairness
      Incentives
      Starting conditions
    Local vs Global
      Identity
      Cooperation
      Responsibility'),

('C2', 'knowledge', NULL,
 'These epistemological questions challenge how we understand truth and knowledge. Discuss how each affects our approach to learning and decision-making.',
 ARRAY['The limits of human cognition', 'The role of intuition vs reason', 'Expert knowledge vs lived experience', 'Scientific method vs other ways of knowing', 'Information abundance vs wisdom'],
 'How should individuals and societies navigate these complexities in seeking truth?',
 3,
 'mindmap
  root((Knowledge Questions))
    Cognitive Limits
      Bias awareness
      Tool assistance
      Humility
    Intuition vs Reason
      Complementary roles
      Domain differences
      Integration
    Experts vs Experience
      Credibility
      Context
      Accessibility
    Scientific Method
      Rigor
      Limitations
      Alternatives
    Information vs Wisdom
      Processing challenges
      Synthesis need
      Application');

-- ============================================
-- C2 PROMPT CARDS (5 rows)
-- ============================================

INSERT INTO exam_c2_prompt_cards (topic, prompt_text, bullet_points, follow_up_questions, difficulty) VALUES
('education', 'The nature and purpose of education',
 ARRAY['How has the purpose of education evolved over time?', 'What is the relationship between education and economic development?', 'Should education prioritize individual fulfillment or societal needs?', 'How might technology fundamentally change what education means?'],
 ARRAY['What role should education play in addressing social inequality?', 'How do you respond to the argument that formal education stifles creativity?'],
 3),

('technology', 'Technology and human relationships',
 ARRAY['How has technology changed the nature of human connection?', 'What is gained and what is lost as communication becomes increasingly digital?', 'How might future technologies further transform relationships?', 'Should there be limits on technology''s role in personal relationships?'],
 ARRAY['Do you think technology makes us more or less empathetic?', 'How might virtual reality change our understanding of authentic experience?'],
 3),

('society', 'The concept of progress',
 ARRAY['What does progress mean in different contexts - technological, social, moral?', 'Is progress always desirable, or can it have negative consequences?', 'How do we measure progress as a society?', 'What role does individual action play in societal progress?'],
 ARRAY['Can progress be reversed? Give examples.', 'How might different cultures define progress differently?'],
 3),

('philosophy', 'The search for meaning',
 ARRAY['How do people typically find meaning in their lives?', 'Has the search for meaning changed in modern times?', 'What is the relationship between meaning and happiness?', 'Can meaning be created, or must it be discovered?'],
 ARRAY['How do you think artificial intelligence might impact our sense of purpose?', 'Is the search for meaning universal across cultures?'],
 3),

('ethics', 'Responsibility in a connected world',
 ARRAY['How has globalization changed our sense of responsibility to others?', 'What responsibilities do individuals have to future generations?', 'How should responsibility be shared between individuals, corporations, and governments?', 'Can we be responsible for the unintended consequences of our actions?'],
 ARRAY['How do you balance personal interests with broader responsibilities?', 'Should wealthy nations bear more responsibility for global challenges?'],
 3);
