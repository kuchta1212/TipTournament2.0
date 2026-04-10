import * as React from 'react';
import './../custom.css';

interface RulePageProps {
}

export class RulePage extends React.Component<RulePageProps> {

    constructor(props: RulePageProps) {
        super(props);
    }

    public render() {
        return (
            <div className="rules-page">
                {/* Hero */}
                <div className="rules-hero">
                    <h1>Pravidla tipovacího turnaje</h1>
                    <p className="rules-subtitle">Vše co potřebuješ vědět, než začneš tipovat</p>
                </div>

                {/* Intro cards */}
                <div className="rules-grid rules-grid-3">
                    <div className="rules-card">
                        <div className="rules-card-icon">&#9917;</div>
                        <h2>O co jde?</h2>
                        <p>
                            Tipovací turnaj pro zpestření sledování šampionátu. Tipuješ výsledky zápasů,
                            pořadí ve skupinách, postupující v playoff, nejlepšího střelce a umístění vybraného týmu.
                            Kdo nasbírá nejvíce bodů, vyhrává.
                        </p>
                    </div>
                    <div className="rules-card">
                        <div className="rules-card-icon">&#128221;</div>
                        <h2>Jak na to?</h2>
                        <ol className="rules-steps">
                            <li>Zaregistruj se</li>
                            <li>V menu klikni na <strong>Sázky</strong></li>
                            <li>Vyplň všechny tipovací sekce</li>
                            <li>Body se sčítají po každém odehraném zápase</li>
                            <li>Zaplatit startovné 200 Kč (QR kód níže)</li>
                        </ol>
                    </div>
                    <div className="rules-card">
                        <div className="rules-card-icon">&#128176;</div>
                        <h2>Startovné</h2>
                        <p>Startovné je <strong>200 Kč</strong>. Do předmětu platby napiš svoje uživatelské jméno.</p>
                        <div className="rules-qr">
                            <img src={process.env.PUBLIC_URL + '/icons/QR.jpg'} width="160" height="160" alt="QR Code pro platbu" />
                        </div>
                    </div>
                </div>

                {/* Deadlines */}
                <div className="rules-section-header">
                    <h1>Uzávěrky tipů</h1>
                    <p className="rules-subtitle">Kdy musí být co vyplněno</p>
                </div>

                <div className="rules-card rules-card-wide">
                    <p>Každá tipovací sekce má svůj vlastní <strong>deadline</strong> (uzávěrku). Po jeho uplynutí se sekce zamkne a tipy už nelze měnit.</p>
                    <table className="rules-deadline-table">
                        <thead>
                            <tr>
                                <th>Sekce</th>
                                <th>Uzávěrka</th>
                                <th>Poznámka</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Alfa+Beta</strong> (výsledky zápasů)</td>
                                <td>Začátek každého zápasu</td>
                                <td>Tip na každý zápas se zamkne individuálně v momentě jeho začátku. Zápasy, které ještě nezačaly, lze stále upravovat.</td>
                            </tr>
                            <tr>
                                <td><strong>Gama</strong> (pořadí skupin)</td>
                                <td>Začátek turnaje</td>
                                <td>Musí být vyplněno před prvním zápasem turnaje.</td>
                            </tr>
                            <tr>
                                <td><strong>Delta – Vítěz</strong></td>
                                <td>Začátek turnaje</td>
                                <td>Tip na celkového vítěze se zamkne s prvním zápasem turnaje.</td>
                            </tr>
                            <tr>
                                <td><strong>Delta – Playoff</strong> (osmifinále až finále)</td>
                                <td>Deadline příslušného kola</td>
                                <td>Každé kolo playoff (osmifinále, čtvrtfinále, semifinále, finále) má vlastní uzávěrku. Tipy na dané kolo se zamknou před začátkem prvního zápasu kola.</td>
                            </tr>
                            <tr>
                                <td><strong>Lambda</strong> (nejlepší střelec)</td>
                                <td>Začátek turnaje</td>
                                <td>Musí být vyplněno před prvním zápasem.</td>
                            </tr>
                            <tr>
                                <td><strong>Omikron</strong> (sázka na tým)</td>
                                <td>Začátek turnaje</td>
                                <td>Musí být vyplněno před prvním zápasem.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Scoring */}
                <div className="rules-section-header">
                    <h1>Bodování</h1>
                    <p className="rules-subtitle">Jak se počítají body v jednotlivých sekcích</p>
                </div>

                <div className="rules-grid rules-grid-2">
                    <div className="rules-card">
                        <h2>Alfa + Beta <span className="rules-badge">Skupinové zápasy</span></h2>
                        <p>Tipuješ přesný výsledek každého zápasu ve skupinové fázi.</p>
                        <div className="rules-scoring">
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-4">4 b.</span>
                                <span>Přesný výsledek</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-2">2 b.</span>
                                <span>Správný vítěz + správný rozdíl skóre <em>(např. tip 1:0, reálně 2:1)</em></span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-1">1 b.</span>
                                <span>Správný vítěz (nebo remíza)</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-0">0 b.</span>
                                <span>Špatný tip</span>
                            </div>
                        </div>
                        <div className="rules-note">
                            <strong>Dixit bonus:</strong> Pokud správně tipneš výsledek zápasu a většina hráčů se mýlí, získáváš bonusové body:
                        </div>
                        <div className="rules-scoring">
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-1">+1 b.</span>
                                <span>Méně než 40 % hráčů tiplo správně</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-2">+2 b.</span>
                                <span>Méně než 20 % hráčů tiplo správně</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-3">+3 b.</span>
                                <span>Jako jediný jsi tipnul správně</span>
                            </div>
                        </div>
                        <div className="rules-note">
                            Bonusy se nesčítají — platí vždy nejvyšší dosažený stupeň. Bonus se počítá ze všech hráčů, kteří na daný zápas tipovali.
                        </div>
                    </div>

                    <div className="rules-card">
                        <h2>Gama <span className="rules-badge">Pořadí skupin</span></h2>
                        <p>Tipuješ konečné pořadí týmů v každé skupině.</p>
                        <div className="rules-scoring">
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-1">1 b.</span>
                                <span>Za každé správně trefené umístění ve skupině</span>
                            </div>
                        </div>
                    </div>

                    <div className="rules-card">
                        <h2>Delta <span className="rules-badge">Vyřazovací fáze</span></h2>
                        <p>Tipuješ účastníky jednotlivých kol playoff. Nezáleží na tom, jakou cestou se tým do kola dostal — důležité je, že tam je.</p>
                        <div className="rules-scoring">
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-2">2 b.</span>
                                <span>Za každého správného účastníka kola (čtvrtfinále, semifinále, finále)</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-3">3 b.</span>
                                <span>Za správně tipnutého celkového vítěze</span>
                            </div>
                        </div>
                        <div className="rules-note">
                            <strong>Osmifinále</strong> se neboduje. Je třeba doplnit postupující ze 3. míst dle{' '}
                            <a href="https://cs.wikipedia.org/wiki/Mistrovstv%C3%AD_Evropy_ve_fotbale_2024#Vy%C5%99azovac%C3%AD_f%C3%A1ze" target="_blank" rel="noopener noreferrer">pravidel UEFA</a>.
                        </div>
                        <div className="rules-note">
                            <strong>Příklad:</strong> Za správně tipnutého vítěze turnaje můžeš získat celkem <strong>9 bodů</strong> (2 za čtvrtfinále + 2 za semifinále + 2 za finále + 3 za vítěze).
                        </div>
                        <div className="rules-note">
                            <strong>Dixit bonus:</strong> Pokud správně tipneš účastníka kola a většina hráčů se mýlí, získáváš bonusové body:
                        </div>
                        <div className="rules-scoring">
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-1">+1 b.</span>
                                <span>Méně než 40 % hráčů tiplo správně</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-2">+2 b.</span>
                                <span>Méně než 20 % hráčů tiplo správně</span>
                            </div>
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-3">+3 b.</span>
                                <span>Jako jediný jsi tipnul správně</span>
                            </div>
                        </div>
                        <div className="rules-note">
                            Bonusy se nesčítají — platí vždy nejvyšší dosažený stupeň. Bonus se počítá ze všech hráčů, kteří na daný zápas tipovali.
                        </div>
                    </div>

                    <div className="rules-card">
                        <h2>Lambda <span className="rules-badge">Nejlepší střelec</span></h2>
                        <p>Tipuješ nejlepšího střelce celého turnaje. Zadává se pouze <strong>příjmení</strong> (např. Schick, Mbappé, Ronaldo).</p>
                        <div className="rules-scoring">
                            <div className="rules-score-row">
                                <span className="rules-points rules-points-7">7 b.</span>
                                <span>Za správného nejlepšího střelce</span>
                            </div>
                        </div>
                        <div className="rules-note rules-note-warning">
                            Špatně napsané příjmení nebude uznáno!
                        </div>
                    </div>

                    <div className="rules-card rules-card-full">
                        <h2>Omikron <span className="rules-badge">Sázka na tým</span></h2>
                        <p>Tipuješ, jak daleko se dostane Česko nebo Slovensko. Body se udělují za správné finální umístění.</p>
                        <div className="rules-scoring rules-scoring-horizontal">
                            <div className="rules-score-block">
                                <span className="rules-points-big">3</span>
                                <span>Skupina / Osmifinále</span>
                            </div>
                            <div className="rules-score-block">
                                <span className="rules-points-big">5</span>
                                <span>Čtvrtfinále</span>
                            </div>
                            <div className="rules-score-block">
                                <span className="rules-points-big">8</span>
                                <span>Semifinále</span>
                            </div>
                            <div className="rules-score-block">
                                <span className="rules-points-big">12</span>
                                <span>Finále</span>
                            </div>
                            <div className="rules-score-block">
                                <span className="rules-points-big">15</span>
                                <span>Vítěz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
