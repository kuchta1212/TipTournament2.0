import * as React from 'react';
import { MedalTournament, MedalPlace } from '../typings';

interface MedalIconProps {
    tournament: MedalTournament;
    place: MedalPlace;
    size?: number;
    className?: string;
    title?: string;
}

const TOURNAMENT_KEY: Record<MedalTournament, string> = {
    [MedalTournament.E20]: 'e20',
    [MedalTournament.E24]: 'e24',
    [MedalTournament.WC22]: 'wc22'
};

const PLACE_KEY: Record<MedalPlace, string> = {
    [MedalPlace.Gold]: 'gold',
    [MedalPlace.Silver]: 'silver',
    [MedalPlace.Bronze]: 'bronze'
};

const TOURNAMENT_LABEL: Record<MedalTournament, string> = {
    [MedalTournament.E20]: 'EURO 2020',
    [MedalTournament.E24]: 'EURO 2024',
    [MedalTournament.WC22]: 'World Cup 2022'
};

const PLACE_LABEL: Record<MedalPlace, string> = {
    [MedalPlace.Gold]: 'Zlato',
    [MedalPlace.Silver]: 'Stříbro',
    [MedalPlace.Bronze]: 'Bronz'
};

export function getMedalIconPath(tournament: MedalTournament, place: MedalPlace): string {
    return `${process.env.PUBLIC_URL}/medals/${PLACE_KEY[place]}-${TOURNAMENT_KEY[tournament]}.svg`;
}

export function getMedalLabel(tournament: MedalTournament, place: MedalPlace): string {
    return `${PLACE_LABEL[place]} – ${TOURNAMENT_LABEL[tournament]}`;
}

export class MedalIcon extends React.Component<MedalIconProps> {
    public render() {
        const size = this.props.size || 22;
        const title = this.props.title || getMedalLabel(this.props.tournament, this.props.place);
        return (
            <img
                src={getMedalIconPath(this.props.tournament, this.props.place)}
                width={size}
                height={Math.round(size * 28 / 24)}
                alt={title}
                title={title}
                className={`medal-icon ${this.props.className || ''}`}
            />
        );
    }
}
