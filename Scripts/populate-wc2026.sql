-- ============================================
-- FIFA World Cup 2026 — Populate Tournament Data
-- Run AFTER clear-db-for-new-tournament.sql
-- ============================================

-- ============================================
-- TEAMS (48 teams)
-- ============================================
INSERT INTO Teams (Id, Name, IconPath, FinishedAt) VALUES
('mexico', 'Mexiko', 'icons/flags/mexico.png', 0),
('south_africa', 'Jižní Afrika', 'icons/flags/south_africa.png', 0),
('south_korea', 'Jižní Korea', 'icons/flags/south_korea.png', 0),
('czechia', 'Česko', 'icons/flags/czechia.png', 0),
('canada', 'Kanada', 'icons/flags/canada.png', 0),
('bosnia', 'Bosna a Hercegovina', 'icons/flags/bosnia.png', 0),
('qatar', 'Katar', 'icons/flags/qatar.png', 0),
('switzerland', 'Švýcarsko', 'icons/flags/switzerland.png', 0),
('brazil', 'Brazílie', 'icons/flags/brazil.png', 0),
('morocco', 'Maroko', 'icons/flags/morocco.png', 0),
('haiti', 'Haiti', 'icons/flags/haiti.png', 0),
('scotland', 'Skotsko', 'icons/flags/scotland.png', 0),
('usa', 'USA', 'icons/flags/usa.png', 0),
('paraguay', 'Paraguay', 'icons/flags/paraguay.png', 0),
('australia', 'Austrálie', 'icons/flags/australia.png', 0),
('turkey', 'Turecko', 'icons/flags/turkey.png', 0),
('germany', 'Německo', 'icons/flags/germany.png', 0),
('curacao', 'Curaçao', 'icons/flags/curacao.png', 0),
('ivory_coast', 'Pobřeží slonoviny', 'icons/flags/ivory_coast.png', 0),
('ecuador', 'Ekvádor', 'icons/flags/ecuador.png', 0),
('netherlands', 'Nizozemsko', 'icons/flags/netherlands.png', 0),
('japan', 'Japonsko', 'icons/flags/japan.png', 0),
('sweden', 'Švédsko', 'icons/flags/sweden.png', 0),
('tunisia', 'Tunisko', 'icons/flags/tunisia.png', 0),
('belgium', 'Belgie', 'icons/flags/belgium.png', 0),
('egypt', 'Egypt', 'icons/flags/egypt.png', 0),
('iran', 'Írán', 'icons/flags/iran.png', 0),
('new_zealand', 'Nový Zéland', 'icons/flags/new_zealand.png', 0),
('spain', 'Španělsko', 'icons/flags/spain.png', 0),
('cape_verde', 'Kapverdy', 'icons/flags/cape_verde.png', 0),
('saudi_arabia', 'Saúdská Arábie', 'icons/flags/saudi_arabia.png', 0),
('uruguay', 'Uruguay', 'icons/flags/uruguay.png', 0),
('france', 'Francie', 'icons/flags/france.png', 0),
('senegal', 'Senegal', 'icons/flags/senegal.png', 0),
('iraq', 'Irák', 'icons/flags/iraq.png', 0),
('norway', 'Norsko', 'icons/flags/norway.png', 0),
('argentina', 'Argentina', 'icons/flags/argentina.png', 0),
('algeria', 'Alžírsko', 'icons/flags/algeria.png', 0),
('austria', 'Rakousko', 'icons/flags/austria.png', 0),
('jordan', 'Jordánsko', 'icons/flags/jordan.png', 0),
('portugal', 'Portugalsko', 'icons/flags/portugal.png', 0),
('dr_congo', 'DR Kongo', 'icons/flags/dr_congo.png', 0),
('uzbekistan', 'Uzbekistán', 'icons/flags/uzbekistan.png', 0),
('colombia', 'Kolumbie', 'icons/flags/colombia.png', 0),
('england', 'Anglie', 'icons/flags/england.png', 0),
('croatia', 'Chorvatsko', 'icons/flags/croatia.png', 0),
('ghana', 'Ghana', 'icons/flags/ghana.png', 0),
('panama', 'Panama', 'icons/flags/panama.png', 0);

-- ============================================
-- GROUPS (12 groups, A–L)
-- ============================================
INSERT INTO Groups (Id, GroupName) VALUES
('Group_A', 'Skupina A'),
('Group_B', 'Skupina B'),
('Group_C', 'Skupina C'),
('Group_D', 'Skupina D'),
('Group_E', 'Skupina E'),
('Group_F', 'Skupina F'),
('Group_G', 'Skupina G'),
('Group_H', 'Skupina H'),
('Group_I', 'Skupina I'),
('Group_J', 'Skupina J'),
('Group_K', 'Skupina K'),
('Group_L', 'Skupina L');

-- ============================================
-- GROUP STAGE MATCHES (72 matches)
-- Teams are associated with groups via their group matches.
-- All times in UTC
-- Stage: 0 = Group
-- ============================================

-- Round 1
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round, GroupId) VALUES
('match_1',  'mexico',       'south_africa',  '2026-06-11 19:00:00', 0, 0, 1, 'Group_A'),
('match_2',  'south_korea',  'czechia',       '2026-06-12 02:00:00', 0, 0, 1, 'Group_A'),
('match_3',  'canada',       'bosnia',        '2026-06-12 19:00:00', 0, 0, 1, 'Group_B'),
('match_4',  'usa',          'paraguay',      '2026-06-13 01:00:00', 0, 0, 1, 'Group_D'),
('match_5',  'haiti',        'scotland',      '2026-06-14 01:00:00', 0, 0, 1, 'Group_C'),
('match_6',  'australia',    'turkey',        '2026-06-14 04:00:00', 0, 0, 1, 'Group_D'),
('match_7',  'brazil',       'morocco',       '2026-06-13 22:00:00', 0, 0, 1, 'Group_C'),
('match_8',  'qatar',        'switzerland',   '2026-06-13 19:00:00', 0, 0, 1, 'Group_B'),
('match_9',  'ivory_coast',  'ecuador',       '2026-06-14 23:00:00', 0, 0, 1, 'Group_E'),
('match_10', 'germany',      'curacao',       '2026-06-14 17:00:00', 0, 0, 1, 'Group_E'),
('match_11', 'netherlands',  'japan',         '2026-06-14 20:00:00', 0, 0, 1, 'Group_F'),
('match_12', 'sweden',       'tunisia',       '2026-06-15 02:00:00', 0, 0, 1, 'Group_F'),
('match_13', 'saudi_arabia', 'uruguay',       '2026-06-15 22:00:00', 0, 0, 1, 'Group_H'),
('match_14', 'spain',        'cape_verde',    '2026-06-15 16:00:00', 0, 0, 1, 'Group_H'),
('match_15', 'iran',         'new_zealand',   '2026-06-16 01:00:00', 0, 0, 1, 'Group_G'),
('match_16', 'belgium',      'egypt',         '2026-06-15 19:00:00', 0, 0, 1, 'Group_G'),
('match_17', 'france',       'senegal',       '2026-06-16 19:00:00', 0, 0, 1, 'Group_I'),
('match_18', 'iraq',         'norway',        '2026-06-16 22:00:00', 0, 0, 1, 'Group_I'),
('match_19', 'argentina',    'algeria',       '2026-06-17 01:00:00', 0, 0, 1, 'Group_J'),
('match_20', 'austria',      'jordan',        '2026-06-17 04:00:00', 0, 0, 1, 'Group_J'),
('match_21', 'ghana',        'panama',        '2026-06-17 23:00:00', 0, 0, 1, 'Group_L'),
('match_22', 'england',      'croatia',       '2026-06-17 20:00:00', 0, 0, 1, 'Group_L'),
('match_23', 'portugal',     'dr_congo',      '2026-06-17 17:00:00', 0, 0, 1, 'Group_K'),
('match_24', 'uzbekistan',   'colombia',      '2026-06-18 02:00:00', 0, 0, 1, 'Group_K');

-- Round 2
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round, GroupId) VALUES
('match_25', 'czechia',      'south_africa',  '2026-06-18 16:00:00', 0, 0, 2, 'Group_A'),
('match_26', 'switzerland',  'bosnia',        '2026-06-18 19:00:00', 0, 0, 2, 'Group_B'),
('match_27', 'canada',       'qatar',         '2026-06-18 22:00:00', 0, 0, 2, 'Group_B'),
('match_28', 'mexico',       'south_korea',   '2026-06-19 01:00:00', 0, 0, 2, 'Group_A'),
('match_29', 'brazil',       'haiti',         '2026-06-20 00:30:00', 0, 0, 2, 'Group_C'),
('match_30', 'scotland',     'morocco',       '2026-06-19 22:00:00', 0, 0, 2, 'Group_C'),
('match_31', 'turkey',       'paraguay',      '2026-06-20 03:00:00', 0, 0, 2, 'Group_D'),
('match_32', 'usa',          'australia',     '2026-06-19 19:00:00', 0, 0, 2, 'Group_D'),
('match_33', 'germany',      'ivory_coast',   '2026-06-20 20:00:00', 0, 0, 2, 'Group_E'),
('match_34', 'ecuador',      'curacao',       '2026-06-21 00:00:00', 0, 0, 2, 'Group_E'),
('match_35', 'netherlands',  'sweden',        '2026-06-20 17:00:00', 0, 0, 2, 'Group_F'),
('match_36', 'tunisia',      'japan',         '2026-06-21 04:00:00', 0, 0, 2, 'Group_F'),
('match_37', 'uruguay',      'cape_verde',    '2026-06-21 22:00:00', 0, 0, 2, 'Group_H'),
('match_38', 'spain',        'saudi_arabia',  '2026-06-21 16:00:00', 0, 0, 2, 'Group_H'),
('match_39', 'belgium',      'iran',          '2026-06-21 19:00:00', 0, 0, 2, 'Group_G'),
('match_40', 'new_zealand',  'egypt',         '2026-06-22 01:00:00', 0, 0, 2, 'Group_G'),
('match_41', 'norway',       'senegal',       '2026-06-23 00:00:00', 0, 0, 2, 'Group_I'),
('match_42', 'france',       'iraq',          '2026-06-22 21:00:00', 0, 0, 2, 'Group_I'),
('match_43', 'argentina',    'austria',       '2026-06-22 17:00:00', 0, 0, 2, 'Group_J'),
('match_44', 'jordan',       'algeria',       '2026-06-23 03:00:00', 0, 0, 2, 'Group_J'),
('match_45', 'england',      'ghana',         '2026-06-23 20:00:00', 0, 0, 2, 'Group_L'),
('match_46', 'panama',       'croatia',       '2026-06-23 23:00:00', 0, 0, 2, 'Group_L'),
('match_47', 'portugal',     'uzbekistan',    '2026-06-23 17:00:00', 0, 0, 2, 'Group_K'),
('match_48', 'colombia',     'dr_congo',      '2026-06-24 02:00:00', 0, 0, 2, 'Group_K');

-- Round 3
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round, GroupId) VALUES
('match_49', 'scotland',     'brazil',        '2026-06-24 22:00:00', 0, 0, 3, 'Group_C'),
('match_50', 'morocco',      'haiti',         '2026-06-24 22:00:00', 0, 0, 3, 'Group_C'),
('match_51', 'switzerland',  'canada',        '2026-06-24 19:00:00', 0, 0, 3, 'Group_B'),
('match_52', 'bosnia',       'qatar',         '2026-06-24 19:00:00', 0, 0, 3, 'Group_B'),
('match_53', 'czechia',      'mexico',        '2026-06-25 01:00:00', 0, 0, 3, 'Group_A'),
('match_54', 'south_africa', 'south_korea',   '2026-06-25 01:00:00', 0, 0, 3, 'Group_A'),
('match_55', 'curacao',      'ivory_coast',   '2026-06-25 20:00:00', 0, 0, 3, 'Group_E'),
('match_56', 'ecuador',      'germany',       '2026-06-25 20:00:00', 0, 0, 3, 'Group_E'),
('match_57', 'japan',        'sweden',        '2026-06-25 23:00:00', 0, 0, 3, 'Group_F'),
('match_58', 'tunisia',      'netherlands',   '2026-06-25 23:00:00', 0, 0, 3, 'Group_F'),
('match_59', 'turkey',       'usa',           '2026-06-26 02:00:00', 0, 0, 3, 'Group_D'),
('match_60', 'paraguay',     'australia',     '2026-06-26 02:00:00', 0, 0, 3, 'Group_D'),
('match_61', 'norway',       'france',        '2026-06-26 19:00:00', 0, 0, 3, 'Group_I'),
('match_62', 'senegal',      'iraq',          '2026-06-26 19:00:00', 0, 0, 3, 'Group_I'),
('match_63', 'egypt',        'iran',          '2026-06-27 03:00:00', 0, 0, 3, 'Group_G'),
('match_64', 'new_zealand',  'belgium',       '2026-06-27 03:00:00', 0, 0, 3, 'Group_G'),
('match_65', 'cape_verde',   'saudi_arabia',  '2026-06-27 00:00:00', 0, 0, 3, 'Group_H'),
('match_66', 'uruguay',      'spain',         '2026-06-27 00:00:00', 0, 0, 3, 'Group_H'),
('match_67', 'panama',       'england',       '2026-06-27 21:00:00', 0, 0, 3, 'Group_L'),
('match_68', 'croatia',      'ghana',         '2026-06-27 21:00:00', 0, 0, 3, 'Group_L'),
('match_69', 'algeria',      'austria',       '2026-06-28 02:00:00', 0, 0, 3, 'Group_J'),
('match_70', 'jordan',       'argentina',     '2026-06-28 02:00:00', 0, 0, 3, 'Group_J'),
('match_71', 'colombia',     'portugal',      '2026-06-27 23:30:00', 0, 0, 3, 'Group_K'),
('match_72', 'dr_congo',     'uzbekistan',    '2026-06-27 23:30:00', 0, 0, 3, 'Group_K');

-- ============================================
-- KNOCKOUT MATCHES (32 matches)
-- Home/Away NULL for TBD matches
-- Stage: 1 = RoundOf32, 2 = FirstRound (R16),
--        3 = Quarterfinal, 4 = Semifinal, 5 = Final
-- ============================================

-- Round of 32 (16 matches)
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round) VALUES
('match_73',  NULL, NULL, '2026-06-28 19:00:00', 0, 1, 0),  -- 2A vs 2B, Inglewood UTC-7 → 12:00+7=19:00
('match_74',  NULL, NULL, '2026-06-29 20:30:00', 0, 1, 0),  -- 1E vs 3rd, Foxborough UTC-4 → 16:30+4=20:30
('match_75',  NULL, NULL, '2026-06-30 01:00:00', 0, 1, 0),  -- 1F vs 2C, Guadalupe UTC-6 → 19:00+6=01:00
('match_76',  NULL, NULL, '2026-06-29 17:00:00', 0, 1, 0),  -- 1C vs 2F, Houston UTC-5 → 12:00+5=17:00
('match_77',  NULL, NULL, '2026-06-30 21:00:00', 0, 1, 0),  -- 1I vs 3rd, East Rutherford UTC-4 → 17:00+4=21:00
('match_78',  NULL, NULL, '2026-06-30 17:00:00', 0, 1, 0),  -- 2E vs 2I, Arlington UTC-5 → 12:00+5=17:00
('match_79',  NULL, NULL, '2026-07-01 01:00:00', 0, 1, 0),  -- 1A vs 3rd, Mexico City UTC-6 → 19:00+6=01:00
('match_80',  NULL, NULL, '2026-07-01 16:00:00', 0, 1, 0),  -- 1L vs 3rd, Atlanta UTC-4 → 12:00+4=16:00
('match_81',  NULL, NULL, '2026-07-02 00:00:00', 0, 1, 0),  -- 1D vs 3rd, Santa Clara UTC-7 → 17:00+7=00:00
('match_82',  NULL, NULL, '2026-07-01 20:00:00', 0, 1, 0),  -- 1G vs 3rd, Seattle UTC-7 → 13:00+7=20:00
('match_83',  NULL, NULL, '2026-07-02 23:00:00', 0, 1, 0),  -- 2K vs 2L, Toronto UTC-4 → 19:00+4=23:00
('match_84',  NULL, NULL, '2026-07-02 19:00:00', 0, 1, 0),  -- 1H vs 2J, Inglewood UTC-7 → 12:00+7=19:00
('match_85',  NULL, NULL, '2026-07-03 03:00:00', 0, 1, 0),  -- 1B vs 3rd, Vancouver UTC-7 → 20:00+7=03:00
('match_86',  NULL, NULL, '2026-07-03 22:00:00', 0, 1, 0),  -- 1J vs 2H, Miami UTC-4 → 18:00+4=22:00
('match_87',  NULL, NULL, '2026-07-04 01:30:00', 0, 1, 0),  -- 1K vs 3rd, Kansas City UTC-5 → 20:30+5=01:30
('match_88',  NULL, NULL, '2026-07-03 18:00:00', 0, 1, 0);  -- 2D vs 2G, Arlington UTC-5 → 13:00+5=18:00

-- Round of 16 (8 matches)
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round) VALUES
('match_89',  NULL, NULL, '2026-07-04 21:00:00', 0, 2, 0),  -- W77 vs W78, Philadelphia UTC-4 → 17:00+4=21:00
('match_90',  NULL, NULL, '2026-07-04 17:00:00', 0, 2, 0),  -- W76 vs W73, Houston UTC-5 → 12:00+5=17:00
('match_91',  NULL, NULL, '2026-07-05 20:00:00', 0, 2, 0),  -- W74 vs W75, East Rutherford UTC-4 → 16:00+4=20:00
('match_92',  NULL, NULL, '2026-07-06 00:00:00', 0, 2, 0),  -- W79 vs W80, Mexico City UTC-6 → 18:00+6=00:00
('match_93',  NULL, NULL, '2026-07-06 19:00:00', 0, 2, 0),  -- W88 vs W86, Arlington UTC-5 → 14:00+5=19:00
('match_94',  NULL, NULL, '2026-07-07 00:00:00', 0, 2, 0),  -- W82 vs W81, Seattle UTC-7 → 17:00+7=00:00
('match_95',  NULL, NULL, '2026-07-07 16:00:00', 0, 2, 0),  -- W83 vs W84, Atlanta UTC-4 → 12:00+4=16:00
('match_96',  NULL, NULL, '2026-07-07 20:00:00', 0, 2, 0);  -- W85 vs W87, Vancouver UTC-7 → 13:00+7=20:00

-- Quarterfinals (4 matches)
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round) VALUES
('match_97',  NULL, NULL, '2026-07-09 20:00:00', 0, 3, 0),  -- W89 vs W90, Foxborough UTC-4 → 16:00+4=20:00
('match_98',  NULL, NULL, '2026-07-10 19:00:00', 0, 3, 0),  -- W91 vs W92, Inglewood UTC-7 → 12:00+7=19:00
('match_99',  NULL, NULL, '2026-07-11 21:00:00', 0, 3, 0),  -- W93 vs W94, Miami UTC-4 → 17:00+4=21:00
('match_100', NULL, NULL, '2026-07-12 01:00:00', 0, 3, 0);  -- W95 vs W96, Kansas City UTC-5 → 20:00+5=01:00

-- Semifinals (2 matches)
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round) VALUES
('match_101', NULL, NULL, '2026-07-14 19:00:00', 0, 4, 0),  -- W97 vs W98, Arlington UTC-5 → 14:00+5=19:00
('match_102', NULL, NULL, '2026-07-15 19:00:00', 0, 4, 0);  -- W99 vs W100, Atlanta UTC-4 → 15:00+4=19:00

-- Third place match (treated as Semifinal stage in app)
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round) VALUES
('match_103', NULL, NULL, '2026-07-18 21:00:00', 0, 4, 0);  -- L101 vs L102, Miami UTC-4 → 17:00+4=21:00

-- Final
INSERT INTO Matches (Id, HomeId, AwayId, StartTime, Ended, Stage, Round) VALUES
('match_104', NULL, NULL, '2026-07-19 19:00:00', 0, 5, 0);  -- W101 vs W102, East Rutherford UTC-4 → 15:00+4=19:00
