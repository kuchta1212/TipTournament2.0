
export function getIconName(teamName: string): string {
    switch (teamName) {
        case 'Nizozemsko': return 'icons/netherlands.svg';
        case 'Ukrajina': return 'icons/ukraine.svg';
        case 'Španělsko': return 'icons/spain.svg';
        case 'Švédsko': return 'icons/sweden.svg';
        case 'Belgie': return 'icons/belgium.svg';
        case 'Rusko': return 'icons/russia.svg';
        case 'Rakousko': return 'icons/austria.svg';
        case 'S. Makedonie': return 'icons/republic-of-macedonia.svg';
        case 'Itálie': return 'icons/italy.svg';
        case 'Wales': return 'icons/wales.svg';
        case 'Slovensko': return 'icons/slovakia.svg';
        case 'Švýcarsko': return 'icons/switzerland.svg';
        case 'Turecko': return 'icons/turkey.svg';
        case 'Maďarsko': return 'icons/hungary.svg';
        case 'Portugalsko': return 'icons/portugal.svg';
        case 'Francie': return 'icons/france.svg';
        case 'Německo': return 'icons/germany.svg';
        case 'Dánsko': return 'icons/denmark.svg';
        case 'Finsko': return 'icons/finland.svg';
        case 'Anglie': return 'icons/england.svg';
        case 'Chorvatsko': return 'icons/croatia.svg';
        case 'Polsko': return 'icons/poland.svg';
        case 'Skotsko': return 'icons/scotland.svg';
        case 'Česko': return 'icons/czech-republic.svg';
        default: return '/germany.svg'
    }
}