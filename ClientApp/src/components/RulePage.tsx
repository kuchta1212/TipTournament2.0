import * as React from 'react';

interface RulePageProps {

}

export class RulePage extends React.Component<RulePageProps> {

    constructor(props: RulePageProps) {
        super(props);
    }



    public render() {
        const myStyle = {
            opacity: .9,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
        };

        return (
            <div className="container">
                <div className="row my-4">
                    <div className="col text-center">
                        <h1>Pravidla hry a tak obecně</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4" style={myStyle}>
                        <h2>O co jde?</h2>
                        <p>
                            Jde o malý tipovací turnájek, jehož cílem je zpestřit si sledování EURO 2024 a při troše štěstí, mít třeba i dobrý pocit z vítězství.
                        </p>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Jak na to?</h2>
                        <ul>
                            <li>Je nutné se registrovat.</li>
                            <li>Po registraci je v hlavní nabídce možnost "Sázky".</li>
                            <li>Zobrazí se seznam různých sekcí na tipování.</li>
                            <li>Úkolem je natipovat všechny tyto sekce a to pokud možno co nejpřesněji.</li>
                            <li>Po každém odehraném zápase se ti na základě tvého tipu určí body.</li>
                            <li>Body se postupně sčítají a vítěz je ten, kdo má nejvíce bodů (překvapivě).</li>
                            <li>Aby teda bylo ještě o co hrát a vítěz (já protože mám přímý přístup do databáze a budu podvádět ;-) ) a popřípadě i vy ostatní něco vyhráli.</li>
                            <li>Tak je určeno startovné 200Kč, viz. QR code dole. Do předmětu napište svoje uživatelské jméno.</li>
                            <li><img src={process.env.PUBLIC_URL + '/icons/QR.jpg'} width="200" height="200" alt="QR Code" /></li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Co je třeba udělat</h2>
                        <ul>
                            <li>Zadat všechny výsledky nejpozději do 14.6 do 21:00.</li>
                            <li>Zaplatit startovné.</li>
                        </ul>
                    </div>
                </div>

                <div className="row my-4">
                    <div className="col text-center">
                        <h1>Sekce + bodování</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4" style={myStyle}>
                        <h2>Alfa+Beta</h2>
                        <p>Zápasy ve skupině. Tipuje se přesný výsledek.</p>
                        <ul>
                            <li>4 - PŘESNÝ VÝSLEDEK</li>
                            <li>2 - SPRÁVNÝ VÍTĚZ A ROZDÍL SKÓRE (reálný výsledek byl 2:1 a váš tip 1:0)</li>
                            <li>1 - SPRÁVNÝ VÍTĚZ</li>
                            <li>0 - KDYŽ STE VEDLE</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Gamma</h2>
                        <p>Pořadí ve skupinách.</p>
                        <ul>
                            <li>1 - KAŽDÉ SPRÁVNÉ MÍSTO</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Delta</h2>
                        <p>Účastníci ve vyřazovacích kolech</p>
                        <ul>
                            <li>2 - ZA KAŽDÉHO SPRÁVNÉHO ÚČASTNÍKA KOLA (nemusí nutně jít vaší postupovou cestou. Příklad: Tip byl, že Německo vyhraje skupinu a postoupí do čtvrtfinále. Skutečnost je, že Němci byli druzí, ale i tak postoupili do čtvrtfinále.) Získáváte body.</li>
                            <li>3 - ZA CELKOVÉHO VÍTĚZE</li>
                        </ul>
                        <h3>Osmifinále</h3>
                        <ul>
                            <li>Není bodované.</li>
                            <li>Je třeba doplnit postupující ze 3. míst.</li>
                            <li>Pravidla ohledně postupujících ze 3. míst jsou zde: <a href="https://cs.wikipedia.org/wiki/Mistrovstv%C3%AD_Evropy_ve_fotbale_2024#Vy%C5%99azovac%C3%AD_f%C3%A1ze" target="_blank" rel="noopener noreferrer">Wikipedia</a>.</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Lambda</h2>
                        <p>Tip na nejlepšího střelce</p>
                        <p>Za jméno střelce se považuje jenom příjmení! (Např. Messi, Mbappé, Lewandowski, Ronaldo....). V případě, že bude jméno špatně napsané, nebude uznáno!</p>
                        <ul>
                            <li>7 - ZA SPRÁVNÉHO NEJLEPŠÍHO STŘELCE</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Omikron</h2>
                        <p>Jak dopadne Český, popřípadě Slovenský výběr.</p>
                        <ul>
                            <li>3 - ZA SPRÁVNÉ UMÍSTĚNÍ VYBRANÉHO TÝMU</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

