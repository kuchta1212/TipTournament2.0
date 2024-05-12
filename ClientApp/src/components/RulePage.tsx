import * as React from 'react';

interface RulePageProps {

}

export class RulePage extends React.Component<RulePageProps> {

    constructor(props: RulePageProps) {
        super(props);
    }



    public render() {
        const myStyle = {
            opacity: .8,
            backgroundColor: 'white'
        };

        return (
            <div>
                <div className="row">
                    <h1>Pravidla hry a tak obecně </h1>
                </div>

                <div className="row">
                    <div className="col-md-4" style={myStyle}>
                        <h2>O co jde?</h2>
                        <p>
                            Jde o malý tipovací turnájek. Jehož cílem je zpestřit si sledování EURO 2024 a při troše štěstí, mít třeba i dobrý pocit z vítězství.
                        </p>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Jak na to?</h2>
                        <ul>
                           <li> Je nutné se registrovat. </li>
                            <li> Po registraci je v hlavní nabídce možnost "Sázky" </li>
                            <li> Zobrazí se seznam různých sekcí na tipování.</li>
                            <li> Úkolem je natipovat všechny tyto sekce a to pokud možno co nejpřesněji.</li>
                            <li> Po každém odehraném zápase se ti na základě tvého tipu určí body.</li>
                            <li>Body se postupně sčítájí a vítěz je ten kdo má nejvíce bodů (překvapivě)</li>
                            <li>Aby teda bylo ještě o co hrát a vítěz(já protože mám přímý přístup do databáze a budu podvádět ;-) ) a popřípadě i vy ostatní něco vyhráli.</li>
                            <li> Tak je určeno startovné 200Kč, viz. QR code dole. Do předmětu napiště svoje uživatelské jméno. </li>
                            <li><img src={process.env.PUBLIC_URL + '/icons/QR.jpg'} width="200" height="200" /></li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Co je třeba udělat</h2>
                        <ul>
                            <li> Zadat všechny výsledky nejpozději do 14.6 do 21:00 </li>
                            <li> Zaplatit startovné </li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <h1>Sekce - přehled + bodování</h1>
                </div>
                <div className="row">
                    <div className="col-md-4" style={myStyle}>
                        <h2>Alfa+Beta</h2>
                        Zápasy ve skupině. Tipuje se přesný výsledek.
                        <ul>
                            <li>4 - PŘESNÝ VÝSLEDEK</li>
                            <li>2 - SPRÁVNÝ VÍTĚZ A ROZDÍL SKÓRE (reálný výsledek byl 2:1 a váš tip 1:0)</li>
                            <li>1 - SPRÁVNÝ VÍTĚZ</li>
                            <li>0 - KDYŽ STE VEDLE</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Gamma</h2>
                        Pořadí ve skupinách.
                        <ul>
                            <li>1 - KAŽDÉ SPRÁVNÉ MÍSTO</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Delta</h2>
                        Účastníci ve vyřazovacích kolech
                        <ul>
                            <li>2 - KAŽDÉ SPRÁVNÉ ÚČASTNÍKA KOL (nemusí nutně jít vaší postupovou cestou. Příklad: Tip byl, že Německo vyhraje skupinu a postoupí do čtvrtfinále. Skutečnost je, že Němci byli druhý, ale i tak postoupili do čtvrtfinále. Získáváte body.)</li>
                            <li>3 - ZA CELKOVÉHO VÍTĚZE</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Lambda</h2>
                        Tip na nejlepšího střelce
                        Za jméno střelce se považuje jenom přijiméní! (Např. Messi, Mbappé, Lewandovski, Ronaldo....)
                        V případě, že bude jméno špatně napsané, nebude uznáno!
                        <ul>
                            <li>7 - ZA SPRÁVNÉHO NEJLEPŠÍHO STŘELCE</li>
                        </ul>
                    </div>
                    <div className="col-md-4" style={myStyle}>
                        <h2>Omikron</h2>
                        Jak dopadne Český, popřípadě Slovenský výběr. 
                        <ul>
                            <li>3 - ZA SPRÁVNÉ UMÍSTĚNÍ VYBRANÉHO TÝMU</li>
                        </ul>
                    </div>
                </div>
            </div>)
    }
}

