-- ============================================
-- Fix IconPath values for WC 2026 teams
-- The original populate script used 'icons/flags/*.png'
-- but actual files are at 'icons/*.svg'
-- ============================================

UPDATE Teams SET IconPath = 'icons/mexico.svg' WHERE Id = 'mexico';
UPDATE Teams SET IconPath = 'icons/southkorea.svg' WHERE Id = 'south_korea';
UPDATE Teams SET IconPath = 'icons/czechia.svg' WHERE Id = 'czechia';
UPDATE Teams SET IconPath = 'icons/canada.svg' WHERE Id = 'canada';
UPDATE Teams SET IconPath = 'icons/qatar.svg' WHERE Id = 'qatar';
UPDATE Teams SET IconPath = 'icons/switzerland.svg' WHERE Id = 'switzerland';
UPDATE Teams SET IconPath = 'icons/brazil.svg' WHERE Id = 'brazil';
UPDATE Teams SET IconPath = 'icons/morocco.svg' WHERE Id = 'morocco';
UPDATE Teams SET IconPath = 'icons/scotland.svg' WHERE Id = 'scotland';
UPDATE Teams SET IconPath = 'icons/unitedstates.svg' WHERE Id = 'usa';
UPDATE Teams SET IconPath = 'icons/australia.svg' WHERE Id = 'australia';
UPDATE Teams SET IconPath = 'icons/turkey.svg' WHERE Id = 'turkey';
UPDATE Teams SET IconPath = 'icons/germany.svg' WHERE Id = 'germany';
UPDATE Teams SET IconPath = 'icons/ecuador.svg' WHERE Id = 'ecuador';
UPDATE Teams SET IconPath = 'icons/netherlands.svg' WHERE Id = 'netherlands';
UPDATE Teams SET IconPath = 'icons/japan.svg' WHERE Id = 'japan';
UPDATE Teams SET IconPath = 'icons/sweden.svg' WHERE Id = 'sweden';
UPDATE Teams SET IconPath = 'icons/tunisia.svg' WHERE Id = 'tunisia';
UPDATE Teams SET IconPath = 'icons/belgium.svg' WHERE Id = 'belgium';
UPDATE Teams SET IconPath = 'icons/iran.svg' WHERE Id = 'iran';
UPDATE Teams SET IconPath = 'icons/spain.svg' WHERE Id = 'spain';
UPDATE Teams SET IconPath = 'icons/saudiarabia.svg' WHERE Id = 'saudi_arabia';
UPDATE Teams SET IconPath = 'icons/uruguay.svg' WHERE Id = 'uruguay';
UPDATE Teams SET IconPath = 'icons/france.svg' WHERE Id = 'france';
UPDATE Teams SET IconPath = 'icons/senegal.svg' WHERE Id = 'senegal';
UPDATE Teams SET IconPath = 'icons/argentina.svg' WHERE Id = 'argentina';
UPDATE Teams SET IconPath = 'icons/austria.svg' WHERE Id = 'austria';
UPDATE Teams SET IconPath = 'icons/portugal.svg' WHERE Id = 'portugal';
UPDATE Teams SET IconPath = 'icons/england.svg' WHERE Id = 'england';
UPDATE Teams SET IconPath = 'icons/croatia.svg' WHERE Id = 'croatia';
UPDATE Teams SET IconPath = 'icons/ghana.svg' WHERE Id = 'ghana';
UPDATE Teams SET IconPath = 'icons/south_africa.svg' WHERE Id = 'south_africa';
UPDATE Teams SET IconPath = 'icons/bosnia.svg' WHERE Id = 'bosnia';
UPDATE Teams SET IconPath = 'icons/haiti.svg' WHERE Id = 'haiti';
UPDATE Teams SET IconPath = 'icons/paraguay.svg' WHERE Id = 'paraguay';
UPDATE Teams SET IconPath = 'icons/curacao.svg' WHERE Id = 'curacao';
UPDATE Teams SET IconPath = 'icons/ivory_coast.svg' WHERE Id = 'ivory_coast';
UPDATE Teams SET IconPath = 'icons/egypt.svg' WHERE Id = 'egypt';
UPDATE Teams SET IconPath = 'icons/new_zealand.svg' WHERE Id = 'new_zealand';
UPDATE Teams SET IconPath = 'icons/cape_verde.svg' WHERE Id = 'cape_verde';
UPDATE Teams SET IconPath = 'icons/iraq.svg' WHERE Id = 'iraq';
UPDATE Teams SET IconPath = 'icons/norway.svg' WHERE Id = 'norway';
UPDATE Teams SET IconPath = 'icons/algeria.svg' WHERE Id = 'algeria';
UPDATE Teams SET IconPath = 'icons/jordan.svg' WHERE Id = 'jordan';
UPDATE Teams SET IconPath = 'icons/dr_congo.svg' WHERE Id = 'dr_congo';
UPDATE Teams SET IconPath = 'icons/uzbekistan.svg' WHERE Id = 'uzbekistan';
UPDATE Teams SET IconPath = 'icons/colombia.svg' WHERE Id = 'colombia';
UPDATE Teams SET IconPath = 'icons/panama.svg' WHERE Id = 'panama';
